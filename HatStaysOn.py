from web3 import Web3
import asyncio
import logging
from datetime import datetime
from eth_account import Account

# === CONFIG ===
RPC_URL = "https://rpc.pulsechain.com"  # Replace with live RPC
PRIVATE_KEY = "0x..."  # Replace with private key of watched wallet
WATCHED_WALLETS = ["0xLegacyWallet1"]  # Add any old wallet here
SAFE_VAULT = "0xSafeVaultAddress"  # Your vault address

# === INIT WEB3 ===
w3 = Web3(Web3.HTTPProvider(RPC_URL))
assert w3.isConnected(), "❌ Web3 connection failed"

class SmartHATAgent:
    def __init__(self, web3, private_key, watch_wallets, safe_vault, threshold=0.7):
        self.web3 = web3
        self.private_key = private_key
        self.watch_wallets = watch_wallets
        self.safe_vault = safe_vault
        self.account = self.web3.eth.account.from_key(private_key)
        self.threshold = threshold

    async def monitor_wallets(self):
        while True:
            for wallet in self.watch_wallets:
                risk_score = self.simulate_risk(wallet)
                logging.info(f"[{datetime.utcnow()}] Wallet {wallet} risk score: {risk_score:.2f}")

                if risk_score > self.threshold:
                    logging.warning(f"🚨 High risk detected on {wallet}")
                    success = self.bounce_funds(wallet)
                    if success:
                        logging.info(f"✅ Bounced funds from {wallet}")
                    else:
                        logging.error(f"❌ Bounce failed for {wallet}")
            await asyncio.sleep(15)

    def simulate_risk(self, wallet):
        from random import random
        return random()  # You’ll replace this with GANGAR scoring later

    def bounce_funds(self, from_wallet):
        try:
            balance = self.web3.eth.get_balance(self.account.address)
            if balance > 0.01 * 10**18:  # Keep some buffer
                gas_price = self.web3.eth.gas_price
                tx = {
                    'to': self.safe_vault,
                    'value': balance - (21000 * gas_price),
                    'gas': 21000,
                    'gasPrice': gas_price,
                    'nonce': self.web3.eth.get_transaction_count(self.account.address),
                    'chainId': self.web3.eth.chain_id
                }
                signed_tx = self.web3.eth.account.sign_transaction(tx, self.private_key)
                tx_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                logging.info(f"⛓️ Bounce TX sent: {tx_hash.hex()}")
                return True
            else:
                logging.info("💤 No ETH/PLS to bounce.")
                return False
        except Exception as e:
            logging.error(f"💥 Bounce exception: {e}")
            return False

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    agent = SmartHATAgent(
        web3=w3,
        private_key=PRIVATE_KEY,
        watch_wallets=WATCHED_WALLETS,
        safe_vault=SAFE_VAULT
    )
    asyncio.run(agent.monitor_wallets())
