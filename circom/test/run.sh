
circom test.circom --r1cs --wasm --sym --c

node test_js/generate_witness.js test_js/test.wasm input.json witness.wtns

snarkjs groth16 setup test.r1cs ../ptau/pot12_final.ptau test_0000.zkey

snarkjs zkey contribute test_0000.zkey test_0001.zkey --name="1st Contributor Name" -v

snarkjs zkey export verificationkey test_0001.zkey verification_key.json

snarkjs groth16 prove test_0001.zkey witness.wtns proof.json public.json
