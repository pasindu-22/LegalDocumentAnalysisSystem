import hashlib

def calculate_hash(content: bytes) -> str:
    """Calculate SHA-256 hash of file content (expects bytes)"""
    if not isinstance(content, bytes):
        raise TypeError("Content must be bytes.")
    return hashlib.sha256(content).hexdigest()
