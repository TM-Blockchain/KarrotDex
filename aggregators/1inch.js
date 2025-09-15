// aggregators/1inch.js

const ONE_INCH_API_BASE = "https://api.1inch.dev/swap/v5.2";
const ONE_INCH_CHAIN = "1"; // Ethereum Mainnet chain ID as string

// 📦 Swap via 1inch Aggregator API
export async function swap1inch(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on 1inch:", { tokenIn, tokenOut, amount, userAddr });

  const apiKey = "YOUR_1INCH_API_KEY"; // Replace with your actual key

  const amountWei = (parseFloat(amount) * 1e18).toString(); // assumes 18 decimals

  const url = `${ONE_INCH_API_BASE}/${ONE_INCH_CHAIN}/swap?` +
    new URLSearchParams({
      src: tokenIn,
      dst: tokenOut,
      amount: amountWei,
      from: userAddr,
      slippage: "1",
      disableEstimate: "true",
      includeProtocols: "ALL"
    });

  const headers = {
    "accept": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.description || "1inch API Error");
    }

    const { tx } = await response.json();

    // Send the transaction
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const sentTx = await signer.sendTransaction(tx);

    console.log("TX Submitted:", sentTx.hash);
    await sentTx.wait();
    console.log("✅ 1inch Swap complete!");
  } catch (err) {
    console.error("1inch Swap Error:", err.message);
    throw err;
  }
}
