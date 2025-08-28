// zkp2p.js

const ZKP2P_ENDPOINT = 'https://api.zkp2p.io/v1/quote'; // 🔧 Replace with actual endpoint if different

/**
 * Fetches a quote from the ZKP2P aggregator.
 * Supports cross-chain, privacy-preserving swaps.
 */
export async function swapZKP2P({ tokenIn, tokenOut, amount, recipient, slippage = 1, useCrossChain = false, pxAsset = null }) {
  try {
    const decimals = tokenIn.decimals || 18;
const formattedAmount = (parseFloat(amount) * Math.pow(10, decimals)).toString(); 
    
   const payload = {
      fromToken: tokenIn,
      toToken: tokenOut,
      recipient,
      amount: formattedAmount,
      slippage,
      crossChain: useCrossChain,
      pxAsset, // Optional, only used if provided
      integrator: 'karrotdex',
    };

    // Clean up null fields
    Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);

    const response = await fetch(ZKP2P_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`ZKP2P aggregator failed: ${response.statusText}`);

    const result = await response.json();
    console.log(`[✅ ZKP2P] Quote retrieved`, result);
    return result;

  } catch (error) {
    console.error(`[❌ ZKP2P] Swap failed:`, error.message);
    throw error;
  }
}
