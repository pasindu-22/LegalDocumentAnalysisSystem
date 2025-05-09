import hashlib

def calculate_hash(content):
    """Calculate SHA-256 hash of file content"""
    if isinstance(content, bytes):
        return hashlib.sha256(content).hexdigest()
    return hashlib.sha256(content.encode()).hexdigest()