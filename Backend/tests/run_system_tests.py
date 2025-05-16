import os
import sys
import pytest

def run_system_tests():
    """Run all system tests"""
    # Add project root to path if needed
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    # Run tests with detailed output
    pytest.main(['-xvs', 'tests/system'])

if __name__ == "__main__":
    run_system_tests()