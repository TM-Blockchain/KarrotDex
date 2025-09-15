window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log("🦊 Connected:", account);

    const AGG_ADDR = "0xYourKarrotAggregator"; // Replace with real contract
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

    document.getElementById('connectWallet').innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;

    async function updateTokenIcons() {
      const from = document.getElementById("tokenFrom").value;
      const to = document.getElementById("tokenTo").value;
      document.getElementById("fromIcon").src = `img/tokens/${from.toLowerCase()}.png`;
      document.getElementById("toIcon").src = `img/tokens/${to.toLowerCase()}.png`;
    }

    async function getBalance(tokenSymbol) {
      // Replace with actual token lookup logic
      return "1,000.00";
    }

    async function updateBalances() {
      document.getElementById("balanceFrom").innerText = await getBalance(document.getElementById("tokenFrom").value);
      document.getElementById("balanceTo").innerText = await getBalance(document.getElementById("tokenTo").value);
    }

    document.getElementById("tokenFrom").addEventListener("change", () => {
      updateTokenIcons();
      updateBalances();
    });
    document.getElementById("tokenTo").addEventListener("change", () => {
      updateTokenIcons();
      updateBalances();
    });

    updateTokenIcons();
    updateBalances();

    document.getElementById("btnSwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenFrom").value;
      const tokenOut = document.getElementById("tokenTo").value;
      const amountIn = document.getElementById("amountFrom").value;

      console.log(`Swapping ${amountIn} ${tokenIn} for ${tokenOut}...`);

      // Actual DEX aggregator contract logic would go here
      alert(`Swap submitted!\n${amountIn} ${tokenIn} → ${tokenOut}`);
    });
  } else {
    alert("Please install MetaMask!");
  }
});
