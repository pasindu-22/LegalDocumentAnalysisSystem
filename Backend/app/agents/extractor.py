import re
import os
import json
import asyncio
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from dotenv import load_dotenv
from services.load_pdf import load_pdf_pages  # PDF page loader

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=5000, chunk_overlap=100)


async def summarize_chunk(text: str, llm_instance):
    prompt = f"Summarize the following legal text chunk:\n{text}"
    messages = [{"role": "user", "content": prompt}]
    response = await llm_instance.ainvoke(messages)
    return response.content.strip()


async def extract_case_summary(full_summary: str, llm_instance):
    prompt = f"""
    Based on the following summarized legal case text, extract:
    - decision_type
    - disposition
    - first_party
    - second_party
    - facts (summarized)

    Return a JSON object.

    Summary:
    {full_summary}
    """
    messages = [{"role": "user", "content": prompt}]
    response = await llm_instance.ainvoke(messages)
    content = response.content if hasattr(
        response, "content") else str(response)
    cleaned = re.sub(r"^```json|```$", "", content.strip(),
                     flags=re.MULTILINE).strip()
    cleaned = re.sub(r"^```|```$", "", cleaned, flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw_output": cleaned}


async def process_raw_text(text: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=gemini_api_key
    )

    documents = [Document(page_content=text)]
    chunks = text_splitter.split_documents(documents)
    summaries = [await summarize_chunk(chunk.page_content, llm) for chunk in chunks[:10]]
    combined_summary = "\n".join(summaries)
    return await extract_case_summary(combined_summary, llm)

# ----------------------
# 🧪 TESTING MAIN BLOCK
# ----------------------
if __name__ == "__main__":
    async def test_extraction():
        pdf_path = "app/assets/legalcase_demo.pdf"
        pages = await load_pdf_pages(pdf_path)
        full_text = "\n".join([p.page_content for p in pages])
        result = await process_raw_text(full_text)
        print(json.dumps(result, indent=2))

    asyncio.run(test_extraction())
