// karrot-logic.js
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const accounts = await web3.eth.getAccounts();
    console.log('👤 Connected wallet:', accounts[0]);

    const karrotContractAddress = "0xYourKarrotContract"; // Replace with actual deployed address
    const karrotABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "type": "function"
      }
    ];
    // Add these near other swap functions in karrot-logic.js

async function requestXStocksRaySwap(tokenIn, amountIn, aggregatorAddress, signer) {
  const abi = ["function requestXStocksRaySwap(address tokenIn, uint256 amountIn) external returns (bytes32)"];
  const agr = new ethers.Contract(aggregatorAddress, abi, signer);
  const tx = await agr.requestXStocksRaySwap(tokenIn, amountIn);
  const receipt = await tx.wait();
  const requestId = receipt.events.find(e => e.event === "XStocksRayRequested").args.requestId;
  console.log("Ray Swap Req ID:", requestId);
  return requestId;
}

async function requestXStocksJupSwap(tokenIn, amountIn, aggregatorAddress, signer) {
  const abi = ["function requestXStocksJupSwap(address tokenIn, uint256 amountIn) external returns (bytes32)"];
  const agr = new ethers.Contract(aggregatorAddress, abi, signer);
  const tx = await agr.requestXStocksJupSwap(tokenIn, amountIn);
  const receipt = await tx.wait();
  const requestId = receipt.events.find(e => e.event === "XStocksJupRequested").args.requestId;
  console.log("Jupiter Swap Req ID:", requestId);
  return requestId;
}

async function requestZKSwap(tokenIn, amountIn, zkMemo, aggregatorAddress, signer) {
  const abi = ["function requestZKSwap(address tokenIn, uint256 amountIn, string calldata memo) external returns (bytes32)"];
  const agr = new ethers.Contract(aggregatorAddress, abi, signer);
  const tx = await agr.requestZKSwap(tokenIn, amountIn, zkMemo);
  const receipt = await tx.wait();
  const requestId = receipt.events.find(e => e.event === "ZKSwapRequested").args.requestId;
  console.log("ZK Swap Req ID:", requestId);
  return requestId;
}

// UI Hook Integration

document.getElementById("btnRaySwap").addEventListener("click", async () => {
  const tokenIn = document.getElementById("tokenIn").value;
  const amountIn = document.getElementById("amountIn").value;
  await requestXStocksRaySwap(tokenIn, amountIn, AGG_ADDR, signer);
});

document.getElementById("btnJupSwap").addEventListener("click", async () => {
  const tokenIn = document.getElementById("tokenIn").value;
  const amountIn = document.getElementById("amountIn").value;
  await requestXStocksJupSwap(tokenIn, amountIn, AGG_ADDR, signer);
});

document.getElementById("btnZKSwap").addEventListener("click", async () => {
  const tokenIn = document.getElementById("tokenIn").value;
  const amountIn = document.getElementById("amountIn").value;
  const zkMemo = document.getElementById("zkMemo").value;
  await requestZKSwap(tokenIn, amountIn, zkMemo, AGG_ADDR, signer);
});


    const karrot = new web3.eth.Contract(karrotABI, karrotContractAddress);

    document.getElementById('karrotVoiceBtn').addEventListener('click', async () => {
      try {
        const supply = await karrot.methods.totalSupply().call();
        alert(`🥕 Total Karrot Supply: ${supply}`);
      } catch (err) {
        console.error(err);
      }
    });
  } else {
    alert('Please install MetaMask');
  }
});
