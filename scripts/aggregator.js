import { aggregatorTokenMap, aggregatorDefaults } from './tokenMap.js';
import { updateIcons } from './aggregator.js';

export function populateTokens() {
  const aggregator = document.getElementById("aggregator").value;
  const tokens = aggregatorTokenMap[aggregator];
  const defaults = aggregatorDefaults[aggregator];

  const tokenFrom = document.getElementById("tokenFrom");
  const tokenTo = document.getElementById("tokenTo");

  tokenFrom.innerHTML = "";
  tokenTo.innerHTML = "";

  tokens.forEach(token => {
    const optFrom = new Option(token.label, token.address);
    const optTo = new Option(token.label, token.address);
    tokenFrom.add(optFrom);
    tokenTo.add(optTo);
  });

  tokenFrom.value = defaults.from;
  tokenTo.value = defaults.to;

  updateIcons(); // 🔥 set logos
}
