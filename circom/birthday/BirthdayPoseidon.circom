pragma circom 2.0.0;

//include "../node_modules/circomlib/circuits/sha256/sha256.circom";

include "../node_modules/circomlib/circuits/poseidon.circom";

template BirthdayPoseidon(){
  component poseidon = Poseidon(8);
  signal input date[8];
  poseidon.inputs <== date;

  /*
  log(date[0]);
  log(date[1]);
  log(date[2]);
  log(date[3]);
  log(date[4]);
  log(date[5]);
  log(date[6]);
  log(date[7]);
  */
  log(poseidon.out);

  //signal output date_out[256];
  signal output date_out;
  date_out <== poseidon.out;
}

component main = BirthdayPoseidon();
