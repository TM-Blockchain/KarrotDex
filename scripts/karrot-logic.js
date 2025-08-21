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
    "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024", // MXDAI (example)
    "0x4fabb145d64652a948d72533023f6e7a623c7c53": "https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=024"  // BUSD (example)
  };

  function updateIcon(sel, img) {
    const val = sel.value.toLowerCase();
    const tokenOption = sel.querySelector(`option[value="${val}"]`);
    const dynamicLogo = tokenOption ? tokenOption.dataset.logo : null;
    img.src = tokenLogos[val] || dynamicLogo || "img/default-token.png";
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
        tt.appendChild(o2);
      }
    } catch (e) {
      console.warn("Failed to load token:", id, e);
    }
  }

  // Add default tokens to From dropdown
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const KARROT = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da";
  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const MXDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const BUSD = "0x4fabb145d64652a948d72533023f6e7a623c7c53";

  // From dropdown options
  [
    { addr: KARROT, label: "KARROT", logo: tokenLogos[KARROT] },
    { addr: DAI, label: "DAI", logo: tokenLogos[DAI] },
    { addr: USDC, label: "USDC", logo: tokenLogos[USDC] },
    { addr: MXDAI, label: "MXDAI", logo: tokenLogos[MXDAI] },
    { addr: BUSD, label: "BUSD", logo: tokenLogos[BUSD] },
  ].forEach(({ addr, label, logo }) => {
    const option = document.createElement("option");
    option.value = addr;
    option.textContent = label;
    option.dataset.logo = logo;
    tf.appendChild(option);
  });

  // To dropdown options - but rename one DAI and USDC for clarity
  [
    { addr: KARROT, label: "KARROT", logo: tokenLogos[KARROT] },
    { addr: DAI, label: "MXDAI", logo: tokenLogos[DAI] },  // renamed
    { addr: USDC, label: "BUSD", logo: tokenLogos[USDC] }, // renamed
    { addr: MXDAI, label: "DAI", logo: tokenLogos[MXDAI] }, // renamed
    { addr: BUSD, label: "USDC", logo: tokenLogos[BUSD] },  // renamed
  ].forEach(({ addr, label, logo }) => {
    const option = document.createElement("option");
    option.value = addr;
    option.textContent = label;
    option.dataset.logo = logo;
    tt.appendChild(option);
  });

  tf.value = DAI;
  tt.value = KARROT;

  tf.dispatchEvent(new Event("change"));
  tt.dispatchEvent(new Event("change"));
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

  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      customAddressInput.classList.toggle("hidden", !checkbox.checked);
    });
  }

  const AGG = "0xYourKarrotAggregator"; // Replace with your aggregator address
  const karrotABI = [
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      type: "function"
    }
  ];

  const { ethers } = window;
  let provider, signer, account;

  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("connectWallet").innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;
  } else {
    alert("Please install MetaMask!");
    swapBtn.disabled = true;
  }

  const karrot = new ethers.Contract(AGG, karrotABI, signer);

  async function swapRay() {
    // implement ray swap logic
  }

  async function swapZK() {
    // zk swap logic
  }

  async function swapLiberty() {
    // liberty swap logic
  }

  swapBtn.addEventListener("click", () => {
    const tokenIn = tf.value;
    const tokenOut = tt.value;
    const amt = document.getElementById("amountFrom").value;
    const custom = checkbox.checked ? document.getElementById("customAddress").value : account;

    if (!amt || isNaN(amt) || Number(amt) <= 0) {
      return alert("Enter valid amount");
    }

    console.log("Swapping:", amt, tokenIn, "→", tokenOut, "to:", custom);
    alert(`Swap ${amt} from ${tokenIn} to ${tokenOut}`);

    // Uncomment the handler needed
    // swapRay();
    // swapZK();
    // swapLiberty();
  });
});
