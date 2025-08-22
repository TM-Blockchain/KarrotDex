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
  // Add more...
};

const DEFAULTS = {
  PulseX: { from: '0x6b17...', to: '0x6910...' },
  Ray: { from: '0x5d3a5...', to: '0x4fabb...' },
  ZK: { from: '0xabc1...', to: '0xabc2...' }
};

function init() {
  const aggregatorSelect = document.getElementById('aggregator');
  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');
  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');
  const swapBtn = document.getElementById('btnSwap');
  const switchBtn = document.getElementById('switchTokens');
  const useCustomAddress = document.getElementById('useCustomAddress');
  const customAddress = document.getElementById('customAddress');

  // Populate aggregator dropdown
  aggregatorSelect.innerHTML = Object.keys(aggregatorTokens).map(name => 
    `<option value="${name}">${name}</option>`
  ).join('');

  let selectedAggregator = aggregatorSelect.value;

  function updateIcon(sel, img) {
    const addr = sel.value.toLowerCase();
    const token = aggregatorTokens[selectedAggregator].find(t => t.address.toLowerCase() === addr);
    img.src = token ? token.logo : 'img/default-token.png';
  }

  function populateTokens() {
    const list = aggregatorTokens[selectedAggregator] || [];
    tf.innerHTML = '';
    tt.innerHTML = '';

    list.forEach(t => {
      const o1 = document.createElement('option');
      o1.value = t.address.toLowerCase();
      o1.textContent = t.label;
      tf.appendChild(o1);

      const o2 = o1.cloneNode(true);
      tt.appendChild(o2);
    });

    if (DEFAULTS[selectedAggregator]) {
      tf.value = DEFAULTS[selectedAggregator].from.toLowerCase();
      tt.value = DEFAULTS[selectedAggregator].to.toLowerCase();
    } else {
      tf.selectedIndex = 0;
      tt.selectedIndex = tf.options.length > 1 ? 1 : 0;
    }

    updateIcon(tf, fromIcon);
    updateIcon(tt, toIcon);
  }

  aggregatorSelect.addEventListener('change', () => {
    selectedAggregator = aggregatorSelect.value;
    populateTokens();
  });

  tf.addEventListener('change', () => updateIcon(tf, fromIcon));
  tt.addEventListener('change', () => updateIcon(tt, toIcon));

  switchBtn.addEventListener('click', () => {
    const fromValue = tf.value;
    tf.value = tt.value;
    tt.value = fromValue;
    updateIcon(tf, fromIcon);
    updateIcon
