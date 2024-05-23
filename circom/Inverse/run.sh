
circom Inverse.circom --r1cs --wasm --sym --c

#node Inverse_js/generate_witness.js Iverse_js/test.wasm input.json witness.wtns

#snarkjs groth16 setup Inverse.r1cs ../ptau/pot12_final.ptau Inverse_0000.zkey

#snarkjs zkey contribute Inverse_0000.zkey Inverse_0001.zkey --name="1st Contributor Name" -v

#snarkjs zkey export verificationkey Inverse_0001.zkey verification_key.json

#snarkjs groth16 prove Inverse_0001.zkey witness.wtns proof.json public.json
