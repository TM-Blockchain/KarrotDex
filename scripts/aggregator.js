
import { aggregatorTokenMap, aggregatorDefaults } from './tokenMap.js';
import { executeSwap, setAggregator } from './karrot-logic.js';

const DEBUG = false;
function log(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}

// 1. Populate the token dropdowns based on the selected aggregator
export function populateTokens() {
  const agg = document.getElementById('aggregator').value;
  const tokens = aggregatorTokenMap[agg] || [];
  const defaults = aggregatorDefaults[agg];

  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');

  tf.innerHTML = '';
  tt.innerHTML = '';

  tokens.forEach(token => {
    tf.add(new Option(token.label, token.address));
    tt.add(new Option(token.label, token.address));
  });

  if (defaults &&
      tokens.find(t => t.address === defaults.from) &&
      tokens.find(t => t.address === defaults.to)) {
    tf.value = defaults.from;
    tt.value = defaults.to;
  } else {
    tf.selectedIndex = 0;
    tt.selectedIndex = tokens.length > 1 ? 1 : 0;
  }

  updateIcons();
  log('Tokens populated for aggregator:', agg);
}

// 2. Synchronize the token icons with the dropdown selections
export function updateIcons() {
  const agg = document.getElementById('aggregator').value;
  const tokens = aggregatorTokenMap[agg] || [];

  const fromAddr = document.getElementById('tokenFrom').value;
  const toAddr = document.getElementById('tokenTo').value;

  const fromToken = tokens.find(t => t.address === fromAddr);
  const toToken = tokens.find(t => t.address === toAddr);

  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');

  fromIcon.src = fromToken ? fromToken.logo : 'img/default-token.png';
  toIcon.src = toToken ? toToken.logo : 'img/default-token.png';

  log('Token icons updated');
}

// 3. Initial setup: bind event listeners and trigger first load
function init() {
  const aggSel = document.getElementById('aggregator');
  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');
  const swapBtn = document.getElementById('btnSwap');
  const swapText = document.getElementById('swapBtnText');
  const swapSpinner = document.getElementById('swapSpinner');

  Object.keys(aggregatorTokenMap).forEach(name => {
    aggSel.add(new Option(name, name));
  });

  const firstAgg = Object.keys(aggregatorTokenMap)[0];
  aggSel.value = firstAgg;
  try {
    setAggregator(firstAgg);
  } catch (err) {
    console.error("Failed to set initial aggregator:", err);
  }

  aggSel.addEventListener('change', () => {
    const selectedAgg = aggSel.value;
    try {
      setAggregator(selectedAgg);
    } catch (err) {
      alert("Aggregator setup failed: " + (err.message || err));
    }
    populateTokens();
  });

  tf.addEventListener('change', updateIcons);
  tt.addEventListener('change', updateIcons);

  swapBtn.addEventListener('click', async () => {
    const amount = document.getElementById('amountFrom').value;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return alert("Enter a valid, positive amount");
    }

    if (tf.value === tt.value) {
      return alert("Please select two different tokens to swap.");
    }

    let userAddr;
    try {
      [userAddr] = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
    } catch {
      return alert("Connect wallet first");
    }

    swapBtn.disabled = true;
    swapText.textContent = "Swapping...";
    swapSpinner.classList.remove("hidden");

    try {
      await executeSwap(tf.value, tt.value, amount, userAddr);
      alert(`Swapped ${amount} tokens successfully`);
    } catch (err) {
      alert(`Swap failed: ${err?.message || 'Unknown error occurred'}`);
    } finally {
      swapBtn.disabled = false;
      swapText.textContent = "Swap";
      swapSpinner.classList.add("hidden");
    }
  });

  populateTokens();
}

window.addEventListener('DOMContentLoaded', init);
