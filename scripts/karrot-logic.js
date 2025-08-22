<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Token Swap</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background: #f9f9f9; }
    select, input { padding: 8px; margin-top: 6px; width: 100%; box-sizing: border-box; }
    button { padding: 10px 20px; margin-top: 12px; cursor: pointer; }
    .flex-row { display: flex; align-items: center; gap: 10px; }
    .token-icon { width: 24px; height: 24px; object-fit: contain; vertical-align: middle; }
    .hidden { display: none; }
    .field { margin-bottom: 16px; }
  </style>
</head>
<body>

  <h2>🔁 Token Swap Interface</h2>

  <div class="field">
    <label for="aggregator">Select Aggregator</label>
    <select id="aggregator"></select>
  </div>

  <div class="field">
    <label for="tokenFrom">From Token</label>
    <div class="flex-row">
      <select id="tokenFrom"></select>
      <img id="fromIcon" class="token-icon" src="img/default-token.png" alt="From Icon" />
    </div>
  </div>

  <div class="field">
    <label for="tokenTo">To Token</label>
    <div class="flex-row">
      <select id="tokenTo"></select>
      <img id="toIcon" class="token-icon" src="img/default-token.png" alt="To Icon" />
    </div>
  </div>

  <div class="field">
    <label for="amountFrom">Amount</label>
    <input type="number" id="amountFrom" placeholder="Enter amount to swap" />
  </div>

  <div class="field">
    <input type="checkbox" id="useCustomAddress" />
    <label for="useCustomAddress">Use custom destination address</label>
    <input type="text" id="customAddress" class="hidden" placeholder="0x..." />
  </div>

  <button id="switchTokens">🔁 Switch Tokens</button>

  <div class="field">
    <button id="btnSwap">
      <span id="swapBtnText">Swap</span>
      <span id="swapSpinner" class="hidden">⏳</span>
    </button>
  </div>

  <button id="connectWallet">🔌 Connect Wallet</button>

  <!-- JavaScript block -->
  <script>
    const aggregatorTokens = {
      ZK: [
        { address: '0xabc1...', label: 'ZKToken', logo: 'img/zk-token.png' },
        { address: '0xabc2...', label: 'ZKUSD', logo: 'img/zkusd.png' }
      ],
      Ray: [
        { address: '0x5d3a5...', label: 'MXDAI', logo: 'img/mxdai.png' },
        { address: '0x4fabb...', label: 'USDT', logo: 'img/usdt.png' }
      ],
      PulseX: [
        { address: '0x6b17...', label: 'DAI', logo: 'img/dai.png' },
        { address: '0x6910...', label: 'KARROT', logo: 'img/karrot-hex.jpg' }
      ]
    };

    const DEFAULTS = {
      PulseX: { from: '0x6b17...', to: '0x6910...' },
      Ray: { from: '0x5d3a5...', to: '0x4fabb...' },
      ZK: { from: '0xabc1...', to: '0xabc2...' }
    };

    const state = {
      walletConnected: false,
      userAddress: '',
      selectedAggregator: 'PulseX'
    };

    window.addEventListener('DOMContentLoaded', () => {
      const aggregatorSelect = document.getElementById('aggregator');
      const tf = document.getElementById('tokenFrom');
      const tt = document.getElementById('tokenTo');
      const fromIcon = document.getElementById('fromIcon');
      const toIcon = document.getElementById('toIcon');
      const swapBtn = document.getElementById('btnSwap');
      const swapSpinner = document.getElementById('swapSpinner');
      const swapBtnText = document.getElementById('swapBtnText');
      const connectBtn = document.getElementById('connectWallet');
      const useCustomAddress = document.getElementById('useCustomAddress');
      const customAddress = document.getElementById('customAddress');
      const switchBtn = document.getElementById('switchTokens');

      aggregatorSelect.innerHTML = Object.keys(aggregatorTokens)
        .map(name => `<option value="${name}">${name}</option>`)
        .join('');
      state.selectedAggregator = aggregatorSelect.value;

            function populateTokens() {
        const list = aggregatorTokens[state.selectedAggregator] || [];
        tf.innerHTML = '';
        tt.innerHTML = '';

        list.forEach(token => {
          const opt1 = new Option(token.label, token.address.toLowerCase());
          const opt2 = new Option(token.label, token.address.toLowerCase());
          tf.appendChild(opt1);
          tt.appendChild(opt2);
        });

        const defaults = DEFAULTS[state.selectedAggregator];
        if (defaults) {
          tf.value = defaults.from.toLowerCase();
          tt.value = defaults.to.toLowerCase();
        } else {
          tf.selectedIndex = 0;
          tt.selectedIndex = tf.options.length > 1 ? 1 : 0;
        }

        updateIcons();
      }

      function updateIcon(select, icon) {
        const addr = select.value.toLowerCase();
        const token = (aggregatorTokens[state.selectedAggregator] || []).find(t => t.address.toLowerCase() === addr);
        icon.src = token?.logo || 'img/default-token.png';
      }

      function updateIcons() {
        updateIcon(tf, fromIcon);
        updateIcon(tt, toIcon);
      }

      function shortAddr(addr) {
        return addr.slice(0, 6) + '...' + addr.slice(-4);
      }

      connectBtn.addEventListener('click', async () => {
        if (!window.ethereum) {
          alert("MetaMask not found.");
          return;
        }

        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          state.walletConnected = true;
          state.userAddress = accounts[0];
          connectBtn.textContent = shortAddr(state.userAddress);
        } catch (err) {
          console.error("Wallet connection error", err);
        }
      });

      switchBtn.addEventListener('click', () => {
        const temp = tf.value;
        tf.value = tt.value;
        tt.value = temp;
        updateIcons();
      });

      aggregatorSelect.addEventListener('change', () => {
        state.selectedAggregator = aggregatorSelect.value;
        populateTokens();
      });

      tf.addEventListener('change', () => updateIcon(tf, fromIcon));
      tt.addEventListener('change', () => updateIcon(tt, toIcon));

      useCustomAddress.addEventListener('change', () => {
        customAddress.classList.toggle('hidden', !useCustomAddress.checked);
      });

      swapBtn.addEventListener('click', () => {
        if (!state.walletConnected) {
          alert("Connect wallet first.");
          return;
        }

        const from = tf.value;
        const to = tt.value;
        const amount = document.getElementById('amountFrom').value;
        const dest = useCustomAddress.checked ? customAddress.value.trim() : state.userAddress;

        if (!from || !to || !amount || !dest) {
          alert("Fill all fields.");
          return;
        }

        swapBtnText.textContent = "Swapping...";
        swapSpinner.classList.remove("hidden");
        swapBtn.disabled = true;

        setTimeout(() => {
          alert(`Swapped ${amount} from ${shortAddr(from)} → ${shortAddr(to)}\nSent to: ${shortAddr(dest)}`);
          swapBtnText.textContent = "Swap";
          swapSpinner.classList.add("hidden");
          swapBtn.disabled = false;
        }, 2000);
      });

      // Initial run
      populateTokens();
    });
  </script>

