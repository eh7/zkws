pragma circom 2.0.0;

//include "../node_modules/circomlib/circuits/sha256/sha256.circom";

include "../node_modules/circomlib/circuits/poseidon.circom";

template BirthdayPoseidon(){
  component poseidon = Poseidon(8);
  signal input date[8];
  poseidon.in[0] <== date[0];
  poseidon.in[1] <== date[1];
  poseidon.in[2] <== date[2];
  poseidon.in[3] <== date[3];
  poseidon.in[4] <== date[4];
  poseidon.in[5] <== date[5];
  poseidon.in[6] <== date[6];
  poseidon.in[7] <== date[7];

  signal output date_out[256];
  date_out <== poseidon.out;
}

component main = BirthdayPoseidon();
