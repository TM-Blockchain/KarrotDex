// aggregators/matcha.js

/**
 * Matcha (0x API) swap integration
 * This module fetches a quote from 0x API and optionally executes the swap.
 */

const MATCHA_API = 'https://api.0x.org/swap/v1/quote';

export async function swapMatcha(tokenIn, tokenOut, amount, userAddr) {
  console.log("Requesting Matcha quote...", { tokenIn, tokenOut, amount, userAddr });

  try {
    const params = new URLSearchParams({
      sellToken: tokenIn,
      buyToken: tokenOut,
      sellAmount: (parseFloat(amount) * 1e18).toString(), // assumes 18 decimals
      takerAddress: userAddr,
      slippagePercentage: '0.01'
    });

    const response = await fetch(`${MATCHA_API}?${params.toString()}`);
    if (!response.ok) throw new Error(`Matcha API error: ${response.statusText}`);

    const quote = await response.json();

    const tx = {
      from: quote.from,
      to: quote.to,
      data: quote.data,
      value: quote.value || '0x0'
    };

    // Ask for user approval in their wallet
    console.log("Sending transaction to Matcha router...");
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });

    console.log("Matcha TX submitted:", txHash);
    return { status: 'success', txHash };
  } catch (err) {
    console.error("Matcha swap error:", err);
    throw err;
  }
}
