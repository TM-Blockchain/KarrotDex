// handler.js

import { state } from '../state.js';
import { populateTokens, updateIcons } from './tokenUI.js';
import { connectWallet } from '../wallet/connect.js';
import { executeSwap, setAggregator } from '../karrot-logic.js';

export function initHandlers() {
  const aggregatorSelect = document.getElementById('aggregator');
  const tokenFrom = document.getElementById('tokenFrom');
  const tokenTo = document.getElementById('tokenTo');
  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');
  const amountInput = document.getElementById('amountFrom');
  const connectBtn = document.getElementById('connectWallet');
  const swapBtn = document.getElementById('btnSwap');
  const swapBtnText = document.getElementById('swapBtnText');
  const swapSpinner = document.getElementById('swapSpinner');
  const useCustomAddress = document.getElementById('useCustomAddress');
  const customAddress = document.getElementById('customAddress');
  const switchBtn = document.getElementById('switchTokens');

  // Aggregator change
  aggregatorSelect.addEventListener('change', () => {
    state.selectedAggregator = aggregatorSelect.value;
    setAggregator(state.selectedAggregator);
    populateTokens(); // From tokenUI.js
  });

  // Switch from/to tokens
  switchBtn.addEventListener('click', () => {
    const tmp = tokenFrom.value;
    tokenFrom.value = tokenTo.value;
    tokenTo.value = tmp;
    updateIcons(); // From tokenUI.js
  });

  // Token selection changes
  tokenFrom.addEventListener('change', updateIcons);
  tokenTo.addEventListener('change', updateIcons);

  // Toggle custom address input
  useCustomAddress.addEventListener('change', () => {
    customAddress.classList.toggle('hidden', !useCustomAddress.checked);
  });

  // Connect Wallet
  connectBtn.addEventListener('click', async () => {
    const address = await connectWallet();
    if (address) {
      connectBtn.textContent = shortenAddress(address);
    }
  });

  // Swap execution
  swapBtn.addEventListener('click', async () => {
    if (!state.walletConnected) {
      alert("Connect wallet first.");
      return;
    }

    const from = tokenFrom.value;
    const to = tokenTo.value;
    const amount = amountInput.value;
    const dest = useCustomAddress.checked ? customAddress.value.trim() : state.userAddress;

    if (!from || !to || !amount || !dest) {
      alert("Fill all fields.");
      return;
    }

    try {
      swapBtn.disabled = true;
      swapBtnText.textContent = 'Swapping...';
      swapSpinner.classList.remove('hidden');

      await executeSwap(from, to, amount, dest);

      alert(`✅ Swapped ${amount} tokens`);
    } catch (err) {
      alert(`❌ Swap failed: ${err.message}`);
    } finally {
      swapBtn.disabled = false;
      swapBtnText.textContent = 'Swap';
      swapSpinner.classList.add('hidden');
    }
  });
}

function shortenAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}
