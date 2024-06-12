pragma circom 2.0.0;

//include "../node_modules/circomlib/circuits/sha256/sha256.circom";

//include "../node_modules/circomlib/circuits/poseidon.circom";

include "../node_modules/circomlib/circuits/eddsaposeidon.circom";

template EddsaPoseidon(){

  signal input enabled;
  signal input Ax;
  signal input Ay;

  signal input S;
  signal input R8x;
  signal input R8y;

  signal input M;

  component eddsa = EdDSAPoseidonVerifier();

  eddsa.enabled <== enabled;
  eddsa.Ax <== Ax;
  eddsa.Ay <== Ay;
  eddsa.S <== S;
  eddsa.R8x <== R8x;
  eddsa.R8y <== R8y;
  eddsa.M <== M;
}

/*
component main = EddsaPoseidon();
*/

component main = EddsaPoseidon();
