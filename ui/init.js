import { initHandlers } from '../handler.js';
import { populateTokens } from './tokenUI.js';
import { state } from '../state.js';

// Grab all DOM elements once
const aggregatorSelect = document.getElementById('aggregator');
const tokenFrom = document.getElementById('tokenFrom');
const tokenTo = document.getElementById('tokenTo');
const fromIcon = document.getElementById('fromIcon');
const toIcon = document.getElementById('toIcon');
const amountInput = document.getElementById('amountFrom');
const connectBtn = document.getElementById('connectWallet');
const swapBtn = document.getElementById('btnSwap');
const swapBtnText = document.getElementById('swapBtnText');
const swapSpinner = document.getElementById('swapSpinner');
const useCustomAddress = document.getElementById('useCustomAddress');
const customAddress = document.getElementById('customAddress');
const switchBtn = document.getElementById('switchTokens');

// Set default aggregator and tokens
state.selectedAggregator = aggregatorSelect.value;
populateTokens(tokenFrom, tokenTo, fromIcon, toIcon);

// Hook up all button events
initHandlers({
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
});
