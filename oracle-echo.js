// oracle-echo.js — listens to Mesh/Mirror oracle, triggers audio + UI signals

// Config
const ORACLE_ADDRESS = "0xYourOracle"; // KarrotMeshOracle or MirrorOracle; must emit events
const ORACLE_ABI = [
  // KarrotMeshOracle events
  { "anonymous": false, "inputs":[
      {"indexed":false,"internalType":"uint256","name":"roundId","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"median","type":"uint256"}
    ], "name":"ValueFinalized", "type":"event"
  },
  // Optional getter
  { "inputs": [], "name": "latestValue", "outputs": [{"type":"uint256"}], "stateMutability":"view", "type":"function" }
];

// thresholds
const DRIFT_ALERT_BP = 100;   // 1% parity drift alert
const ARB_ALERT_BP   = 300;   // 3% cross-venue arbitrage

let lastPrice = null;

async function initOracleEcho(web3) {
  const oracle = new web3.eth.Contract(ORACLE_ABI, ORACLE_ADDRESS);

  // initial read
  try {
    const v = await oracle.methods.latestValue().call();
    lastPrice = Number(v);
  } catch {}

  oracle.events.ValueFinalized({})
    .on("data", (ev) => {
      const price = Number(ev.returnValues.median);
      handlePrice(price);
    })
    .on("error", (e) => console.warn("Oracle event error", e));
}

function handlePrice(price) {
  if (!lastPrice) { lastPrice = price; return; }

  const driftBp = Math.abs((price - lastPrice) * 10000 / lastPrice);
  if (driftBp >= DRIFT_ALERT_BP) {
    speak(`⚠️ Parity drift detected: ${(driftBp/100).toFixed(2)}%`);
    toast(`Parity drift ${(driftBp/100).toFixed(2)}% — check mxDAI defenses`);
  }

  // Example: compare with a cached Liberty/Uni quote you maintain elsewhere (stubbed here)
  const extQuote = window.__karrotLastExternalQuote || price; // plug in your fetched quote
  const arbBp = Math.abs((price - extQuote) * 10000 / ((price+extQuote)/2));
  if (arbBp >= ARB_ALERT_BP) {
    speak(`🔥 Arbitrage window ${(arbBp/100).toFixed(2)}% — strike now.`);
    toast(`Arb ${(arbBp/100).toFixed(2)}% — route via Aggregator`);
  }

  lastPrice = price;
}

function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 0.9; u.rate = 1.0;
    synth.speak(u);
  } catch (e) { console.warn("TTS error", e); }
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'fixed bottom-6 right-6 bg-purple-700 text-white px-4 py-3 rounded shadow';
  el.innerText = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

export { initOracleEcho };
