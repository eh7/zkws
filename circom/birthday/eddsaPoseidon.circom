pragma circom 2.0.0;

//include "../node_modules/circomlib/circuits/sha256/sha256.circom";

//include "../node_modules/circomlib/circuits/poseidon.circom";

include "../node_modules/circomlib/circuits/eddsaposeidon.circom";

template EddsaPoseidon(){
  signal input in0;
  signal input in1;
  signal output out;

  out <== in0 * in1;

  /*
  component poseidon = Poseidon(8);
  signal input date[8];
  poseidon.inputs <== date;

  log(poseidon.out);

  //signal output date_out[256];
  signal output date_out;
  date_out <== poseidon.out;
  */
}

component main = EddsaPoseidon();
