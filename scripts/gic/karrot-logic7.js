// karrot-logic.js

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer;
    let account;

    async function connectWallet() {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      account = await signer.getAddress();
      console.log("🦊 Connected:", account);
      const walletButton = document.getElementById('connectWallet');
      if (walletButton) {
        walletButton.innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;
      }
      updateBalances();
    }

    document.getElementById('connectWallet').addEventListener('click', connectWallet);

    const tokenIcons = {
      'tokena': 'img/tokens/tokena.png',
      'tokenb': 'img/tokens/tokenb.png',
      'tokenx': 'img/tokens/tokenx.png',
      'tokeny': 'img/tokens/tokeny.png',
    };

    function updateTokenIcons() {
      const from = document.getElementById("tokenFrom").value;
      const to = document.getElementById("tokenTo").value;
      document.getElementById("fromIcon").src = tokenIcons[from] || 'img/default-token.png';
      document.getElementById("toIcon").src = tokenIcons[to] || 'img/default-token.png';
    }

    async function getBalance(tokenSymbol) {
      // Replace with actual contract logic
      return "1,000.00";
    }

    async function updateBalances() {
      const fromToken = document.getElementById("tokenFrom").value;
      const toToken = document.getElementById("tokenTo").value;
      document.getElementById("balanceFrom").innerText = "Balance: " + await getBalance(fromToken);
      document.getElementById("balanceTo").innerText = "Balance: " + await getBalance(toToken);
    }

    document.getElementById("tokenFrom").addEventListener("change", () => {
      updateTokenIcons();
      updateBalances();
    });

    document.getElementById("tokenTo").addEventListener("change", () => {
      updateTokenIcons();
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

    document.getElementById("btnSwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenFrom").value;
      const tokenOut = document.getElementById("tokenTo").value;
      const amountIn = document.getElementById("amountFrom").value;
      const useCustom = document.getElementById("useCustomAddress").checked;
      const customAddr = document.getElementById("customAddress").value;

      if (!account) {
        alert("Please connect your wallet first.");
        return;
      }
      if (tokenIn === "0x..." || tokenOut === "0x...") {
        alert("Please select both From and To tokens.");
        return;
      }
      if (!amountIn || isNaN(amountIn) || Number(amountIn) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      if (useCustom && (!customAddr || !customAddr.startsWith("0x") || customAddr.length !== 42)) {
        alert("Please enter a valid custom address.");
        return;
      }

      const recipient = useCustom ? customAddr : account;

      console.log(`Swapping ${amountIn} ${tokenIn} → ${tokenOut} to ${recipient}`);
      alert(`Swap submitted!\n${amountIn} ${tokenIn} → ${tokenOut}\nRecipient: ${recipient}`);
      // Add real swap logic here
    });

    // Initial load
    updateTokenIcons();
    updateBalances();

  } else {
    alert("Please install MetaMask!");
  }
});
