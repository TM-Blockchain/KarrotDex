// ui/tokenUI.js

import { state } from '../state.js';

// Hardcoded token data per aggregator
const aggregatorTokens = {
  PulseX: [
    { address: '0x6b17...0001', label: 'DAI', logo: 'img/dai.png' },
    { address: '0x6910...0002', label: 'KARROT', logo: 'img/karrot-hex.jpg' }
  ],
  Ray: [
    { address: '0x5d3a5...0003', label: 'MXDAI', logo: 'img/mxdai.png' },
    { address: '0x4fabb...0004', label: 'USDT', logo: 'img/usdt.png' }
  ],
  ZK: [
    { address: '0xabc1...0005', label: 'ZKToken', logo: 'img/zk-token.png' },
    { address: '0xabc2...0006', label: 'ZKUSD', logo: 'img/zkusd.png' }
  ]
};

// Optional default token selections per aggregator
const DEFAULTS = {
  PulseX: { from: '0x6b17...0001', to: '0x6910...0002' },
  Ray: { from: '0x5d3a5...0003', to: '0x4fabb...0004' },
  ZK: { from: '0xabc1...0005', to: '0xabc2...0006' }
};

// Populate token dropdowns
export function populateTokens() {
  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');
  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');

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

// Update token logos
export function updateIcons() {
  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');
  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');

  updateIcon(tf, fromIcon);
  updateIcon(tt, toIcon);
}

function updateIcon(select, iconEl) {
  const addr = select.value.toLowerCase();
  const tokens = aggregatorTokens[state.selectedAggregator] || [];
  const token = tokens.find(t => t.address.toLowerCase() === addr);
  iconEl.src = token?.logo || 'img/default-token.png';
}
