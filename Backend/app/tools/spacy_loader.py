import spacy

def load_spacy_model():
    try:
        return spacy.load("en_core_web_lg")
    except OSError:
        
        try:
            print("Using smaller SpaCy model. For better results, install en_core_web_lg")
            return spacy.load("en_core_web_sm")
            
        except OSError as e:
            print(f"Error loading en_core_web_sm: {e}")
            print("No SpaCy models found. Please install one using: python -m spacy download en_core_web_sm")
            return None

