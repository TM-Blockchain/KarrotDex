// ui/tokenUI.js

import { state } from '../state.js';
import { aggregatorTokenMap, aggregatorDefaults } from '../tokenMap.js';

// Populate token dropdowns per aggregator
export function populateTokens() {
  const tf = document.getElementById('tokenFrom');
  const tt = document.getElementById('tokenTo');
  const fromIcon = document.getElementById('fromIcon');
  const toIcon = document.getElementById('toIcon');

  const list = aggregatorTokenMap[state.selectedAggregator] || [];

  tf.innerHTML = '';
  tt.innerHTML = '';

  list.forEach(token => {
    tf.add(new Option(token.label, token.address.toLowerCase()));
    tt.add(new Option(token.label, token.address.toLowerCase()));
  });

  const defaults = aggregatorDefaults[state.selectedAggregator];
  if (defaults) {
    tf.value = defaults.from.toLowerCase();
    tt.value = defaults.to.toLowerCase();
  } else {
    tf.selectedIndex = 0;
    tt.selectedIndex = list.length > 1 ? 1 : 0;
  }

  updateIcons();
}

// Update from and to icons based on dropdowns
export function updateIcons() {
  updateIcon('tokenFrom', 'fromIcon');
  updateIcon('tokenTo', 'toIcon');
}

function updateIcon(selectId, iconId) {
  const selectEl = document.getElementById(selectId);
  const iconEl = document.getElementById(iconId);
  const addr = selectEl.value.toLowerCase();
  const list = aggregatorTokenMap[state.selectedAggregator] || [];
  const match = list.find(t => t.address.toLowerCase() === addr);
  iconEl.src = match?.logo || 'img/default-token.png';
  iconEl.onerror = () => { iconEl.src = 'img/default-token.png'; };
}
