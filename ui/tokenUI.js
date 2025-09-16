// ui/tokenUI.js

import { state } from '../state.js';
import { aggregatorTokenMap, aggregatorDefaults } from '../tokenMap.js';

// Populate dropdowns with tokens for the selected aggregator
 
export function populateTokens() {
  console.log('Populating tokens for:', state.selectedAggregator); 
  console.log('Tokens:', aggregatorTokenMap[state.selectedAggregator]);

  // Clear existing options
  tf.innerHTML = '';
  tt.innerHTML = '';

  // Fetch tokens for current aggregator
  const tokens = aggregatorTokenMap[state.selectedAggregator] || [];

  // Add each token to both dropdowns
  tokens.forEach(token => {
    tf.add(new Option(token.label, token.address.toLowerCase()));
    tt.add(new Option(token.label, token.address.toLowerCase()));
  });

  // Set default selections if provided
  const defaults = aggregatorDefaults[state.selectedAggregator];
  if (defaults) {
    tf.value = defaults.from.toLowerCase();
    tt.value = defaults.to.toLowerCase();
  } else {
    tf.selectedIndex = 0;
    tt.selectedIndex = tokens.length > 1 ? 1 : 0;
  }

  // Sync icons with current selections
  updateIcons();
}

// Update both token icons based on what's selected
export function updateIcons() {
  updateIcon('tokenFrom', 'fromIcon');
  updateIcon('tokenTo', 'toIcon');
}

// Helper: updates one icon based on a dropdown’s selected token
function updateIcon(selectId, iconId) {
  const selectEl = document.getElementById(selectId);
  const iconEl = document.getElementById(iconId);
  const addr = selectEl.value?.toLowerCase();
  const tokens = aggregatorTokenMap[state.selectedAggregator] || [];
  const match = tokens.find(t => t.address.toLowerCase() === addr);

  iconEl.src = match?.logo || 'img/default-token.png';
  iconEl.onerror = () => { iconEl.src = 'img/default-token.png'; };
}
