// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tf = document.getElementById("tokenFrom");
  const tt = document.getElementById("tokenTo");
  const fromIcon = document.getElementById("fromIcon");
  const toIcon = document.getElementById("toIcon");
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");
  const swapBtn = document.getElementById("btnSwap");

  const tokenLogos = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
    "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
  };

  function updateIcon(sel, img) {
    const val = sel.value.toLowerCase();
    img.src = tokenLogos[val] || sel.selectedOptions[0]?.dataset.logo || "img/default-token.png";
  }

  function updateAllIcons() {
    updateIcon(tf, fromIcon);
    updateIcon(tt, toIcon);
  }

  // Load tokens from CoinGecko
  const wanted = ["dai", "usd-coin", "tether", "weth", "wrapped-bitcoin"];
  for (const id of wanted) {
    try {
      const d = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(r => r.json());
      const addr = d.platforms.ethereum?.toLowerCase();
      if (addr) {
        const sym = d.symbol.toUpperCase();
        const logo = d.image.thumb;
        const o1 = document.createElement("option");
        o1.value = addr;
        o1.textContent = sym;
        o1.dataset.logo = logo;
        tf.appendChild(o1);
        const o2 = o1.cloneNode(true);
        tf.appendChild; // margin
        tt.appendChild(o2);
      }
    } catch (e) {
      console.warn("Failed:", id, e);
    }
  }

  // Add defaults
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const KARROT = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da";
  tf.value = DAI;
  tt.value = KARROT;
  updateAllIcons();

  tf.addEventListener("change", () => {
    updateIcon(tf, fromIcon);
    if (tf.value === tt.value) {
      const idx = (tt.selectedIndex + 1) % tt.options.length;
      tt.selectedIndex = idx;
      updateIcon(tt, toIcon);
    }
  });
  tt.addEventListener("change", () => {
    updateIcon(tt, toIcon);
    if (tt.value === tf.value) {
      const idx = (tf.selectedIndex + 1) % tf.options.length;
      tf.selectedIndex = idx;
      updateIcon(tf, fromIcon);
    }
  });

  // Custom address toggle
  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      customAddressInput.classList.toggle("hidden", !checkbox.checked);
    });
  }

  // Advanced swap handler placeholders
  const AGG = "0xYourKarrotAggregator"; // replace with your aggregator
  const karrotABI = [
    { constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], type: "function" }
  ];

  const { ethers } = window;
  let provider, signer, account;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("connectWallet").innerText = `🟢 ${account.slice(0,6)}...${account.slice(-4)}`;
  } else {
    alert("Please install MetaMask!");
    swapBtn.disabled = true;
  }

  const karrot = new ethers.Contract(AGG, karrotABI, signer);

  async function swapRay() {
    /* implement ray swap logic */
  }
  async function swapZK() {
    /* zk swap logic */
  }
  async function swapLiberty() {
    /* liberty swap logic */
  }

  swapBtn.addEventListener("click", () => {
    const tokenIn = tf.value, tokenOut = tt.value;
    const amt = document.getElementById("amountFrom").value;
    const custom = checkbox.checked ? document.getElementById("customAddress").value : account;
    if (!amt || isNaN(amt) || Number(amt) <= 0) {
      return alert("Enter valid amount");
    }
    console.log("Swapping:", amt, tokenIn, "→", tokenOut, "to:", custom);
    alert(`Swap ${amt} from ${tokenIn} to ${tokenOut}`);
    // choose appropriate handler:
    // swapRay();
  });

});
