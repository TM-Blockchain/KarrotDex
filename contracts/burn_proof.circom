// circuits/burn_proof.circom
pragma circom 2.0.0;

include "circomlib/poseidon.circom";

template BurnProof() {
    signal input user;       // represented as numeric
    signal input amount;
    signal input burnId;     // numeric representation
    signal input leaf;       // Merkle leaf hash

    // Poseidon hash: building the event fingerprint
    component hasher = Poseidon(4);
    hasher.inputs[0] <== user;
    hasher.inputs[1] <== amount;
    hasher.inputs[2] <== burnId;
    hasher.inputs[3] <== leaf;

    signal output out;
    out <== hasher.out;
}

component main = BurnProof();
