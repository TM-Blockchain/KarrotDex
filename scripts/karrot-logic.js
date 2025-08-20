// karrot-logic.js
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    // Setup ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log('👤 Connected wallet:', account);

    const AGG_ADDR = "0xYourKarrotContract"; // ✅ Replace with actual deployed aggregator contract
    const karrotABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "type": "function"
      }
    ];

    const karrot = new ethers.Contract(AGG_ADDR, karrotABI, signer);

    // ✅ Request Functions
    async function requestXStocksRaySwap(tokenIn, amountIn) {
      const abi = ["function requestXStocksRaySwap(address tokenIn, uint256 amountIn) external returns (bytes32)"];
      const agr = new ethers.Contract(AGG_ADDR, abi, signer);
      const tx = await agr.requestXStocksRaySwap(tokenIn, amountIn);
      const receipt = await tx.wait();
      const requestId = receipt.events.find(e => e.event === "XStocksRayRequested").args.requestId;
      console.log("Ray Swap Req ID:", requestId);
      return requestId;
    }

    async function requestXStocksJupSwap(tokenIn, amountIn) {
      const abi = ["function requestXStocksJupSwap(address tokenIn, uint256 amountIn) external returns (bytes32)"];
      const agr = new ethers.Contract(AGG_ADDR, abi, signer);
      const tx = await agr.requestXStocksJupSwap(tokenIn, amountIn);
      const receipt = await tx.wait();
      const requestId = receipt.events.find(e => e.event === "XStocksJupRequested").args.requestId;
      console.log("Jupiter Swap Req ID:", requestId);
      return requestId;
    }

    async function requestZKSwap(tokenIn, amountIn, zkMemo) {
      const abi = ["function requestZKSwap(address tokenIn, uint256 amountIn, string memo) external returns (bytes32)"];
      const agr = new ethers.Contract(AGG_ADDR, abi, signer);
      const tx = await agr.requestZKSwap(tokenIn, amountIn, zkMemo);
      const receipt = await tx.wait();
      const requestId = receipt.events.find(e => e.event === "ZKSwapRequested").args.requestId;
      console.log("ZK Swap Req ID:", requestId);
      return requestId;
    }

    // ✅ UI Button Hooks
    document.getElementById("btnRaySwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenIn").value;
      const amountIn = document.getElementById("amountIn").value;
      await requestXStocksRaySwap(tokenIn, amountIn);
    });

    document.getElementById("btnJupSwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenIn").value;
      const amountIn = document.getElementById("amountIn").value;
      await requestXStocksJupSwap(tokenIn, amountIn);
    });

    document.getElementById("btnZKSwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenIn").value;
      const amountIn = document.getElementById("amountIn").value;
      const zkMemo = document.getElementById("zkMemo").value;
      await requestZKSwap(tokenIn, amountIn, zkMemo);
    });

    // ✅ Karrot Voice Button
    document.getElementById('karrotVoiceBtn').addEventListener('click', async () => {
      try {
        const supply = await karrot.totalSupply();
        alert(`🥕 Total Karrot Supply: ${ethers.utils.formatUnits(supply, 18)}`);
      } catch (err) {
        console.error("Error getting total supply:", err);
      }
    });
  } else {
    alert('Please install MetaMask');
  }
});
