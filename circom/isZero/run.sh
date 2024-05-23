NAME=$1

circom ${NAME}.circom --r1cs --wasm --sym --c

node ${NAME}_js/generate_witness.js ${NAME}_js/${NAME}.wasm input.json witness.wtns

snarkjs groth16 setup ${NAME}.r1cs ../ptau/pot12_final.ptau ${NAME}_0000.zkey

snarkjs zkey contribute ${NAME}_0000.zkey ${NAME}_0001.zkey --name="1st Contributor Name" -v

snarkjs zkey export verificationkey ${NAME}_0001.zkey verification_key.json

snarkjs groth16 prove ${NAME}_0001.zkey witness.wtns proof.json public.json

snarkjs groth16 verify verification_key.json public.json proof.json
