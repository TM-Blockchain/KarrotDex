<!-- At end of body -->
<script>
  const aggregatorTokens = {
    ZK: [{ address: '0x...', label: 'KARROT', logo: 'img/karrot-hex.jpg' }, /* more */],
    Ray: [{ address: '0x...', label: 'MXDAI', logo: '...' }, /* more */],
    PulseX: [{ address: '0x6b17...', label: 'DAI', logo: '...' }, /* more */],
    // ...other aggregators
  };

  const DEFAULTS = {
    PulseX: { from: '0x6b17...', to: '0x6910...' },
    Ray: { from: '0x5d3a5...', to: '0x4fabb...' },
    // ...
  };

  function init() {
    const tf = document.getElementById('tokenFrom');
    const tt = document.getElementById('tokenTo');
    const aggregatorSelect = document.getElementById('aggregator');
    const fromIcon = document.getElementById('fromIcon');
    const toIcon = document.getElementById('toIcon');
    const swapBtn = document.getElementById('btnSwap');
    let selectedAggregator = aggregatorSelect.value;

    function updateIcon(sel, img) {
      const addr = sel.value.toLowerCase();
      const token = aggregatorTokens[selectedAggregator].find(t => t.address.toLowerCase() === addr);
      img.src = token ? token.logo : 'img/default-token.png';
    }

    function populate() {
      tf.innerHTML = '';
      tt.innerHTML = '';
      const list = aggregatorTokens[selectedAggregator] || [];
      list.forEach(t => {
        const o1 = document.createElement('option');
        o1.value = t.address.toLowerCase(); o1.textContent = t.label;
        tf.appendChild(o1);
        const o2 = o1.cloneNode(true);
        tt.appendChild(o2);
      });
      if (DEFAULTS[selectedAggregator]) {
        tf.value = DEFAULTS[selectedAggregator].from.toLowerCase();
        tt.value = DEFAULTS[selectedAggregator].to.toLowerCase();
      } else {
        tt.selectedIndex = tf.options.length > 1 ? 1 : 0;
      }
      updateIcon(tf, fromIcon);
      updateIcon(tt, toIcon);
    }

    aggregatorSelect.addEventListener('change', () => {
      selectedAggregator = aggregatorSelect.value;
      populate();
    });
    tf.addEventListener('change', () => updateIcon(tf, fromIcon));
    tt.addEventListener('change', () => updateIcon(tt, toIcon));
    swapBtn.addEventListener('click', () => {
      // your swap logic here
      console.log('Swapping via', selectedAggregator);
    });

    populate();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
</script>
