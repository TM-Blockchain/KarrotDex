// aggregators/cowswap.js

/**
 * Placeholder module for integrating CowSwap.
 * CowSwap uses an API endpoint for routing swaps (off-chain).
 * Without a public on-chain router, your UI needs to fetch the route or redirect the user.
 */

const COWSWAP_API = 'https://api.cowswap.exchange/swap/v1'; // Confirm endpoint path

export async function swapCowSwap(tokenIn, tokenOut, amount, userAddr) {
  console.log("Requesting CowSwap route:", { tokenIn, tokenOut, amount, userAddr });

  try {
    const response = await fetch(COWSWAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenIn,
        tokenOut,
        amount,
        userAddress: userAddr
      })
    });

    if (!response.ok) throw new Error(`CowSwap API error: ${response.status}`);

    const data = await response.json();
    console.log("CowSwap API response:", data);

    if (data.swapLink) {
      window.open(data.swapLink, '_blank');
      return { status: 'redirect', url: data.swapLink };
    }

    // Return raw route data if no redirect link
    return { status: 'quote', data };
  } catch (err) {
    console.error("CowSwap swap error:", err);
    throw err;
  }
}
