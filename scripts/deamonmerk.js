// Monitor PulseChain event
on BurnedEvent(symbol, user, amount, burnId, log) {
  const merkleData = getMerkleInclusionProof(log);
  callSolanaOrSolidity(
    pool.unlockViaMerkle(user, amount, burnId, merkleData.proof, merkleData.leaf)
  );

  // Optionally: build zkProof using Circom + snarkjs
  // callSolanaOrEvm(pool.unlockViaZk(user, amount, burnId, zkProof, inputs, vkId))
}
