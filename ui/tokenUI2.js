// ui/tokenUI.js

import { aggregatorTokens, DEFAULTS } from '../tokens/index.js';
import { state } from '../state.js';

// Populate the token dropdowns based on the selected aggregator
export function populateTokens(tokenFromSelect, tokenToSelect, fromIcon, toIcon) {
  const tokens = aggregatorTokens[state.selectedAggregator] || [];

  // Clear old options
  tokenFromSelect.innerHTML = '';
  tokenToSelect.innerHTML = '';

  tokens.forEach(token => {
    const opt1 = new Option(token.label, token.address.toLowerCase());
    const opt2 = new Option(token.label, token.address.toLowerCase());
    tokenFromSelect.appendChild(opt1);
    tokenToSelect.appendChild(opt2);
  });

  const defaults = DEFAULTS[state.selectedAggregator];
  if (defaults) {
    tokenFromSelect.value = defaults.from.toLowerCase();
    tokenToSelect.value = defaults.to.toLowerCase();
  } else {
    tokenFromSelect.selectedIndex = 0;
    tokenToSelect.selectedIndex = tokens.length > 1 ? 1 : 0;
  }

  updateIcons(tokenFromSelect, tokenToSelect, fromIcon, toIcon);
}

// Update icons based on current token selection
export function updateIcons(tokenFromSelect, tokenToSelect, fromIcon, toIcon) {
  updateIcon(tokenFromSelect, fromIcon);
  updateIcon(tokenToSelect, toIcon);
}

// Internal: get logo from token address
function updateIcon(select, icon) {
  const address = select.value.toLowerCase();
  const tokenList = aggregatorTokens[state.selectedAggregator] || [];
  const token = tokenList.find(t => t.address.toLowerCase() === address);

  icon.src = token?.logo || 'img/default-token.png';
}
