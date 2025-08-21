// karrot-logic.js
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

window.addEventListener("load", async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  console.log("👤 Connected wallet:", account);

  const AGG_ADDR = "0xYourKarrotAggregatorAddress"; // Set your deployed contract
  const karrotABI = [{ constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], type: "function" }];
  const karrot = new ethers.Contract(AGG_ADDR, karrotABI, signer);

  // Delegated request functions for modular routing
  async function requestSwap(method, ...args) {
    const abi = [`function ${method}(${args.map((_, i) => typeof args[i] === "string" ? "string" : "uint256").join(",")}) external returns (bytes32)`];
    const agr = new ethers.Contract(AGG_ADDR, abi, signer);
    const tx = await agr[method](...args);
    const receipt = await tx.wait();
    const event = receipt.events.find((e) => e.event === method + "Requested");
    const requestId = event.args.requestId;
    console.log(`${method} Req ID:`, requestId);
    return requestId;
  }

  // Button hooks
  document.getElementById("btnSwap").addEventListener("click", async () => {
    const tokenIn = document.getElementById("fromToken").value;
    const tokenOut = document.getElementById("toToken").value;
    const amount = document.getElementById("swapAmount").value;
    const recipient = document.getElementById("useCustomAddress").checked
      ? document.getElementById("customAddress").value
      : account;
    await requestSwap("swapV2", tokenIn, tokenOut, amount, recipient);
  });

  document.getElementById("btnRaySwap").addEventListener("click", async () => {
    const tokenIn = document.getElementById("fromToken").value;
    const amountIn = document.getElementById("swapAmount").value;
    await requestSwap("requestXStocksRaySwap", tokenIn, amountIn);
  });

  document.getElementById("btnJupSwap").addEventListener("click", async () => {
    const tokenIn = document.getElementById("fromToken").value;
    const amountIn = document.getElementById("swapAmount").value;
    await requestSwap("requestXStocksJupSwap", tokenIn, amountIn);
  });

  document.getElementById("btnZKSwap").addEventListener("click", async () => {
    const tokenIn = document.getElementById("fromToken").value;
    const amountIn = document.getElementById("swapAmount").value;
    const zkMemo = document.getElementById("zkMemo")?.value || "";
    await requestSwap("requestZKSwap", tokenIn, amountIn, zkMemo);
  });

  document.getElementById("karrotVoiceBtn").addEventListener("click", async () => {
    try {
      const supply = await karrot.totalSupply();
      alert(`🥕 Total Karrot Supply: ${ethers.utils.formatUnits(supply, 18)}`);
    } catch (err) {
      console.error("Error fetching total supply:", err);
    }
  });

  // Token data list (update with real token details)
  const TOKENS = [
    { symbol: "WPLS", address: "0xToken1", icon: "img/wpls.png" },
    { symbol: "9MM", address: "0xToken2", icon: "img/9mm.png" },
    { symbol: "KARROT", address: "0xToken3", icon: "img/karrot-icon.png" },
    { symbol: "PXSTOCK", address: "0xToken4", icon: "img/pxstock.png" },
    { symbol: "MXDAI", address: "0xToken5", icon: "img/mxdai.png" },
  ];

  // Populate token dropdowns and update icon+balance
  function populateTokens() {
    const fromSel = document.getElementById("fromToken");
    const toSel = document.getElementById("toToken");
    TOKENS.forEach(({ symbol, address }) => {
      fromSel.add(new Option(symbol, address));
      toSel.add(new Option(symbol, address));
    });
  }
  populateTokens();

  async function updateBalance(selectorId, balanceId, token) {
    const balance = await fetchBalance(account, token);
    document.getElementById(balanceId).innerText = `Balance: ${balance}`;
  }

  async function fetchBalance(address, token) {
    // Example using ERC20 balanceOf - plug real logic
    // const tokenContract = new ethers.Contract(token, erc20Abi, provider);
    // const raw = await tokenContract.balanceOf(address);
    // return ethers.utils.formatUnits(raw, 18);
    return "0.00"; // placeholder
  }

  document.getElementById("fromToken").addEventListener("change", (e) => {
    document.getElementById("fromTokenIcon").src =
      TOKENS.find((t) => t.address === e.target.value)?.icon || "img/default-token.png";
    updateBalance("fromToken", "fromBalance", e.target.value);
  });

  document.getElementById("toToken").addEventListener("change", (e) => {
    document.getElementById("toTokenIcon").src =
      TOKENS.find((t) => t.address === e.target.value)?.icon || "img/default-token.png";
    updateBalance("toToken", "toBalance", e.target.value);
  });

  document.getElementById("useCustomAddress").addEventListener("change", (e) => {
    document.getElementById("customAddress").classList.toggle("hidden", !e.target.checked);
  });

  console.log("KarrotDex logic initialized.");
});
