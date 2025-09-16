// wallet/connect.js
import { state } from '../state.js';

export async function connectWallet(buttonElement) {
  if (!window.ethereum) {
    alert("🦊 MetaMask not found. Please install it.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    state.walletConnected = true;
    state.userAddress = accounts[0];
    buttonElement.textContent = shortenAddress(state.userAddress);
    console.log("✅ Wallet connected:", state.userAddress);
  } catch (err) {
    console.error("❌ Wallet connection error:", err);
  }
}

function shortenAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}
