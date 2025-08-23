// handler.js

import { state } from '../state.js';
import { populateTokens, updateIcons } from './tokenUI.js';
import { connectWallet } from '../wallet/connect.js';
import { executeSwap, setAggregator } from '../karrot-logic.js';

export function initHandlers({
  aggregatorSelect,
  tokenFrom,
  tokenTo,
  fromIcon,
  toIcon,
  amountInput,
  connectBtn,
  swapBtn,
  swapBtnText,
  swapSpinner,
  useCustomAddress,
  customAddress,
  switchBtn
}) {
  // Aggregator selection
  aggregatorSelect.addEventListener('change', () => {
    state.selectedAggregator = aggregatorSelect.value;
    setAggregator(state.selectedAggregator);
    populateTokens(tokenFrom, tokenTo, fromIcon, toIcon);
  });

  // Switch tokens
  switchBtn.addEventListener('click', () => {
    const temp = tokenFrom.value;
    tokenFrom.value = tokenTo.value;
    tokenTo.value = temp;
    updateIcons(tokenFrom, tokenTo, fromIcon, toIcon);
  });

  // Token changes
  tokenFrom.addEventListener('change', () => updateIcons(tokenFrom, tokenTo, fromIcon, toIcon));
  tokenTo.addEventListener('change', () => updateIcons(tokenFrom, tokenTo, fromIcon, toIcon));

  // Toggle custom address input
  useCustomAddress.addEventListener('change', () => {
    customAddress.classList.toggle('hidden', !useCustomAddress.checked);
  });

  // Wallet connect
  connectBtn.addEventListener('click', async () => {
    const address = await connectWallet();
    if (address) {
      connectBtn.textContent = shortenAddress(address);
    }
  });

  // Swap button logic
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
