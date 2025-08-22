// ui/init.js
import { aggregatorTokens, DEFAULTS } from '../tokens/index.js';
import { updateIcons } from './icons.js';
import { state } from '../state.js';

export function initAggregatorDropdown(aggregatorSelect) {
  aggregatorSelect.innerHTML = Object.keys(aggregatorTokens)
    .map(name => `<option value="${name}">${name}</option>`)
    .join('');

  state.selectedAggregator = aggregatorSelect.value;
}

export function populateTokens(tf, tt) {
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

  updateIcons(tf, tt);
}
