// karrot-logic.js

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log("🦊 Connected:", account);

    // Update wallet button
    const walletButton = document.getElementById('connectWallet');
    if (walletButton) {
      walletButton.innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;
    }

    // CoinGecko API to get token logo by contract address
    async function fetchTokenLogo(address) {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
        if (!res.ok) throw new Error('Token not found');
        const data = await res.json();
        return data.image?.small || 'img/default-token.png';
      } catch (err) {
        console.warn(`⚠️ Logo not found for ${address}:`, err.message);
        return 'img/default-token.png';
      }
    }

    async function updateTokenIcon(selectId, iconId) {
      const selectEl = document.getElementById(selectId);
      const iconEl = document.getElementById(iconId);
      const tokenAddr = selectEl.value;
      iconEl.src = await fetchTokenLogo(tokenAddr);
    }

    async function getBalance(tokenAddr) {
      // Dummy balance for now – replace with real ERC20 logic
      return "1,000.00";
    }

    async function updateBalances() {
      const fromAddr = document.getElementById("tokenFrom").value;
      const toAddr = document.getElementById("tokenTo").value;
      const fromBalance = await getBalance(fromAddr);
      const toBalance = await getBalance(toAddr);
      document.getElementById("balanceFrom").innerText = `Balance: ${fromBalance}`;
      document.getElementById("balanceTo").innerText = `Balance: ${toBalance}`;
    }

    // Event listeners
    document.getElementById("tokenFrom").addEventListener("change", () => {
      updateTokenIcon("tokenFrom", "fromIcon");
      updateBalances();
    });

    document.getElementById("tokenTo").addEventListener("change", () => {
      updateTokenIcon("tokenTo", "toIcon");
      updateBalances();
    });

    document.getElementById("useCustomAddress").addEventListener("change", (e) => {
      const input = document.getElementById("customAddress");
      input.classList.toggle("hidden", !e.target.checked);
    });

    document.getElementById("btnSwap").addEventListener("click", async () => {
      const tokenIn = document.getElementById("tokenFrom").value;
      const tokenOut = document.getElementById("tokenTo").value;
      const amount = document.getElementById("amountFrom").value;
      const toCustom = document.getElementById("useCustomAddress").checked;
      const recipient = toCustom ? document.getElementById("customAddress").value : account;

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      if (toCustom && (!recipient || !recipient.startsWith("0x") || recipient.length !== 42)) {
        alert("Invalid custom address.");
        return;
      }

      alert(`Swap submitted!\n${amount} of ${tokenIn} to ${tokenOut}\nRecipient: ${recipient}`);
      console.log(`Swapping ${amount} ${tokenIn} → ${tokenOut} to ${recipient}`);
    });

    // Initial load
    updateTokenIcon("tokenFrom", "fromIcon");
    updateTokenIcon("tokenTo", "toIcon");
    updateBalances();
  } else {
    alert("Please install MetaMask!");
  }
});
