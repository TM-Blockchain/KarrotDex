pragma circom 2.0.0;

include "circomlib/poseidon.circom";

template MerkleLeaf() {
    signal input userHash;
    signal input amount;
    signal output out;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== userHash;
    hasher.inputs[1] <== amount;

    out <== hasher.out;
}

component main = MerkleLeaf();
