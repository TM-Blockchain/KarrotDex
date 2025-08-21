// karrotdex.js

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log("🦊 Connected:", account);

    // Connect Wallet display
    const walletButton = document.getElementById('connectWallet');
    if (walletButton) {
      walletButton.innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;
    }

    // Dummy Aggregator Contract (Replace with actual deployed address)
    const AGG_ADDR = "0xYourKarrotAggregator";
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

    // Token icon handling
    const tokenIcons = {
      '0xTokenA': 'img/token-a.png',
      '0xTokenB': 'img/token-b.png',
      '0xTokenX': 'img/token-x.png',
      '0xTokenY': 'img/token-y.png',
    };

    function updateTokenIcon(selectId, imgId) {
      const selectEl = document.getElementById(selectId);
      const iconEl = document.getElementById(imgId);
      const tokenAddress = selectEl.value;
      iconEl.src = tokenIcons[tokenAddress] || 'img/default-token.png';
    }

    async function getBalance(tokenAddr) {
      // Replace with real Web3/ERC20 logic
      return "1,000.00";
    }

    async function updateBalances() {
      const fromAddr = document.getElementById("fromToken").value;
      const toAddr = document.getElementById("toToken").value;
      const fromBalance = await getBalance(fromAddr);
      const toBalance = await getBalance(toAddr);
      document.getElementById("fromBalance").innerText = `Balance: ${fromBalance}`;
      document.getElementById("toBalance").innerText = `Balance: ${toBalance}`;
    }

    document.getElementById("fromToken").addEventListener("change", () => {
      updateTokenIcon("fromToken", "fromTokenIcon");
      updateBalances();
    });

    document.getElementById("toToken").addEventListener("change", () => {
      updateTokenIcon("toToken", "toTokenIcon");
      updateBalances();
    });

    document.getElementById("useCustomAddress").addEventListener("change", (e) => {
      const input = document.getElementById("customAddress");
      if (e.target.checked) {
        input.classList.remove("hidden");
      } else {
        input.classList.add("hidden");
      }
    });

    document.getElementById("swapBtn").addEventListener("click", async () => {
      const tokenIn = document.getElementById("fromToken").value;
      const tokenOut = document.getElementById("toToken").value;
      const amount = document.getElementById("swapAmount").value;
      const toCustom = document.getElementById("useCustomAddress").checked;
      const recipient = toCustom ? document.getElementById("customAddress").value : account;

      console.log(`Swapping ${amount} of ${tokenIn} → ${tokenOut} to ${recipient}`);
      alert(`Swap submitted!\n${amount} of ${tokenIn} to ${tokenOut}\nRecipient: ${recipient}`);
      // Add actual swap contract interaction here
    });

    // Initial load
    updateTokenIcon("fromToken", "fromTokenIcon");
    updateTokenIcon("toToken", "toTokenIcon");
    updateBalances();

  } else {
    alert("Please install MetaMask!");
  }
});
