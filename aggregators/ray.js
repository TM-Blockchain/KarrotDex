// aggregators/rayswap.js

const RAYSWAP_API = "https://api.rayswap.com/v1/quote"; // Replace with the correct endpoint

/**
 *  RaySwap swap integration via API.
 *  Gets a quote or redirect link for Solana-based swaps.
 */
export async function swapRay(tokenIn, tokenOut, amount, userAddr) {
  console.log("Requesting RaySwap quote:", { tokenIn, tokenOut, amount, userAddr });

  try {
    const response = await fetch(RAYSWAP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputMint: tokenIn,
        outputMint: tokenOut,
        amount,
        userPubkey: userAddr
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `RaySwap API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("RaySwap response:", data);

    if (data.swapLink) {
      window.open(data.swapLink, "_blank");
      return { status: "redirect", url: data.swapLink };
    }

    return { status: "quote", data };
  } catch (err) {
    console.error("RaySwap error:", err.message);
    throw err;
  }
}
