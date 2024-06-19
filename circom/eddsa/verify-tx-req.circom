pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/eddsaposeidon.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template VerifyNewNoteRequest() {

    signal input sender;
    signal input nonce;

    signal input Ax;
    signal input Ay;
    signal input S;
    signal input R8x;
    signal input R8y;

    component eddsa = EdDSAPoseidonVerifier();
    component poseidon = Poseidon(2);

    // calculate the transaction hash

    poseidon.inputs[0] <== sender;
    poseidon.inputs[1] <== nonce;

    log(sender);
    log(nonce);
    log(poseidon.out);

    // verify the signature on the transaction hash

    eddsa.enabled <== 1;
    eddsa.Ax <== Ax;
    eddsa.Ay <== Ay;
    eddsa.S <== S;
    eddsa.R8x <== R8x;
    eddsa.R8y <== R8y;
    eddsa.M <== poseidon.out;
}

component main = VerifyNewNoteRequest();
