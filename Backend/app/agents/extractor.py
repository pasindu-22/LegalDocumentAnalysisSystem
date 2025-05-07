import re
import os
import json
import asyncio
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from app.services.load_pdf import load_pdf_pages
from dotenv import load_dotenv

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key=gemini_api_key
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=5000, chunk_overlap=100)

file_path = r"app/assets/legalcase_demo.pdf"


async def summarize_chunk(text: str, llm_instance=None):
    """
    Summarize a chunk of text using the LLM.
    """
    prompt = f"Summarize the following legal text chunk:\n{text}"
    messages = [{"role": "user", "content": prompt}]
    
    # Use the passed llm instance or the global one
    instance = llm_instance or llm
    response = await instance.ainvoke(messages)
    return response.content.strip()


async def extract_case_summary(full_summary: str, llm_instance=None):
    """
    Extract structured information from the summarized legal case text.
    """

    prompt = f"""
    Based on the following summarized legal case text, extract:

    - decision_type out of ["majority opinion", "per curiam", "plurality opinion", "equally divided", "dismissal - other", "dismissal - improvidently granted", "dismissal - moot", "opinion of the court"]
    - disposition out of ["reversed/remanded", "affirmed", "reversed", "vacated/remanded", "reversed in-part/remanded", "none", "reversed in-part", "vacated", "vacated in-part/remanded"]
    - first_party
    - second_party
    - facts (summarized)

    Return a JSON object.

    Summary:
    {full_summary}
    """

    messages = [{"role": "user", "content": prompt}]
    instance = llm_instance or llm
    response = await instance.ainvoke(messages)
    # Extract raw text content (in case it's a Message object)
    content = response.content if hasattr(
        response, "content") else str(response)

    # Remove triple backticks and `json` markdown language tags if present
    cleaned = re.sub(r"^```json|```$", "", content.strip(),
                     flags=re.MULTILINE).strip()
    cleaned = re.sub(r"^```|```$", "", cleaned, flags=re.MULTILINE).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        print("Error decoding JSON:")
        print(cleaned)
        return {"error": "Failed to parse JSON", "raw_output": cleaned}


# Replace the real process_pdf function with this version
async def process_pdf(file_path):
    """Modified version that handles event loop issues better"""
    # Create a new client for each call to avoid stale references
    local_llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=gemini_api_key
    )
    
    pages = await load_pdf_pages(file_path)
    chunks = text_splitter.split_documents(pages)

    # Process each chunk sequentially to avoid multiple concurrent API calls
    summaries = []
    for chunk in chunks[:10]:
        summary = await summarize_chunk(chunk.page_content, local_llm)
        summaries.append(summary)

    combined_summary = "\n".join(summaries)

    final_result = await extract_case_summary(combined_summary, local_llm)
    return final_result

# Mock version of process_pdf function for testing purposes
# async def process_pdf(file_path):
#     """
#     TEMPORARY MOCK VERSION - Returns mock data instead of making API calls
#     Comment out this version and uncomment the original when ready to use real API calls
#     """
#     print("Using mock data instead of API calls for testing")
    
#     # Mock data that mimics the structure of real extraction results
#     mock_result = {
#         "decision_type": "majority opinion",
#         "disposition": "affirmed",
#         "first_party": "United States",
#         "second_party": "Jones",
#         "facts": """This case concerns a dispute over property rights in a commercial district. 
#                  The plaintiff argued that zoning regulations unfairly restricted their ability to develop 
#                  the property for commercial use. The lower court ruled in favor of the defendant, 
#                  finding that the zoning regulations were properly applied and served legitimate 
#                  public interests. Evidence presented included property surveys, expert testimony on 
#                  land valuation, and historical records of land use in the area."""
#     }
    
#     # Simulate some processing delay to mimic API call timing
#     await asyncio.sleep(0.5)
    
#     return mock_result

async def main():
    result = await process_pdf(file_path)
    print(json.dumps(result, indent=2))

asyncio.run(main())
