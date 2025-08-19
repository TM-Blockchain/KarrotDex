// shrine-bind.js — wires MetaMask, Aggregator calls, and Oracle Echo
import { initOracleEcho } from "./oracle-echo.js";

const AGGREGATOR_ADDRESS = "0xYourAggregator";
const AGGREGATOR_ABI = [
  { "inputs":[{"internalType":"string","name":"venue","type":"string"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256","name":"deadline","type":"uint256"}],
    "name":"swapV2","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  { "inputs":[{"internalType":"string","name":"venue","type":"string"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minOut","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint256","name":"deadline","type":"uint256"}],
    "name":"swapV3","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  { "inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"string","name":"targetChain","type":"string"},{"internalType":"string","name":"memo","type":"string"}],
    "name":"requestThorSwap","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"}
];

let web3, accounts, agg;

window.addEventListener('load', async () => {
  if (!window.ethereum) return alert("Install MetaMask");

  web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  accounts = await web3.eth.getAccounts();

  agg = new web3.eth.Contract(AGGREGATOR_ABI, AGGREGATOR_ADDRESS);

  // Wire Oracle Echo
  await initOracleEcho(web3);

  // Buttons
  document.getElementById('btnSwapPulsex').onclick = () => swapV2("PulseX");
  document.getElementById('btnSwap9mm').onclick   = () => swapV2("9mm");
  document.getElementById('btnSwapPancake').onclick = () => swapV2("Pancake");
  document.getElementById('btnSwapUniV3').onclick  = () => swapV3("UniswapV3");
  document.getElementById('btnThor').onclick       = requestThor;

  console.log("Karrot Shrine bound. Wallet:", accounts[0]);
});

async function swapV2(venue) {
  const tokenIn  = document.getElementById('tokenIn').value;
  const tokenOut = document.getElementById('tokenOut').value;
  const amountIn = document.getElementById('amountIn').value;
  const minOut   = document.getElementById('minOut').value;
  const deadline = Math.floor(Date.now()/1000) + 600;
  const path     = [tokenIn, tokenOut];

  const tx = await agg.methods.swapV2(venue, tokenIn, tokenOut, amountIn, minOut, path, deadline)
    .send({ from: accounts[0] });

  console.log(`${venue} swap tx`, tx.transactionHash);
}

async function swapV3(venue) {
  const tokenIn  = document.getElementById('tokenIn').value;
  const tokenOut = document.getElementById('tokenOut').value;
  const amountIn = document.getElementById('amountIn').value;
  const minOut   = document.getElementById('minOut').value;
  const fee      = 3000;
  const deadline = Math.floor(Date.now()/1000) + 600;

  const tx = await agg.methods.swapV3(venue, tokenIn, tokenOut, amountIn, minOut, fee, deadline)
    .send({ from: accounts[0] });

  console.log(`${venue} swap tx`, tx.transactionHash);
}

async function requestThor() {
  const tokenIn  = document.getElementById('tokenIn').value;
  const amountIn = document.getElementById('amountIn').value;
  const targetChain = document.getElementById('targetChain').value || "BTC";
  const memo = "karrot-intent";

  const tx = await agg.methods.requestThorSwap(tokenIn, amountIn, targetChain, memo)
    .send({ from: accounts[0] });

  console.log(`Thor request id`, tx.events.ThorRequested.returnValues.requestId);
}
