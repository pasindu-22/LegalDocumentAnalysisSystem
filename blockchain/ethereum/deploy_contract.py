from web3 import Web3
from solcx import compile_source, set_solc_version
import json

# Set Solidity compiler version
set_solc_version("0.8.0")

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
account = w3.eth.accounts[9] 
balance = w3.eth.get_balance(account)
print("Account:", account)
print("Balance (ETH):", w3.from_wei(balance, 'ether'))
# Load and compile Solidity
with open("contracts/DocumentVerification.sol") as f:
    contract_source = f.read()
compiled_sol = compile_source(contract_source)
contract_id, contract_interface = compiled_sol.popitem()

# Deploy contract
DocumentVerification = w3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])
tx_hash = DocumentVerification.constructor().transact({
    "from": account,
    "gas": 3000000,
    "gasPrice": w3.to_wei("2", "gwei")  # Matches Ganache default
})
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print("Contract deployed at:", tx_receipt.contractAddress)

# Save to file
with open("contract_address.json", "w") as f:
    json.dump({"address": tx_receipt.contractAddress, "abi": contract_interface['abi']}, f)