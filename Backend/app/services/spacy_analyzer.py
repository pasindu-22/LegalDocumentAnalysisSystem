from tools.spacy_loader  import load_spacy_model
import os


nlp=load_spacy_model()

def analyze_legal_text(text,nlp):
    if not nlp:
        return {"error": "SpaCy model not loaded"}
    
    doc = nlp(text)
    
    # Basic analysis
    analysis = {
        "entities": [],
        "text_length": len(text),
        "sentence_count": len(list(doc.sents)),
        "key_phrases": []
    }
    
    # Extract entities
    for entity in doc.ents:
        analysis["entities"].append({
            "text": entity.text,
            "type": entity.label_,
            "start": entity.start_char,
            "end": entity.end_char
        })
    
    
    key_phrases = []
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) > 1:  
            key_phrases.append(chunk.text)
    
    analysis["key_phrases"] = key_phrases[:15]  # Limit to top 15 phrases
    
    
    legal_terms = ["agreement", "contract", "party", "parties", "terms", "conditions", 
                  "liability", "shall", "warranty", "indemnification", "termination",
                  "governing law", "jurisdiction", "arbitration", "confidential"]
    
    legal_term_matches = []
    for term in legal_terms:
        if term in text.lower():
            legal_term_matches.append(term)
    
    analysis["legal_terms_found"] = legal_term_matches
    
    return analysis