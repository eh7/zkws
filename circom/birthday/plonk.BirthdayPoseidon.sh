NAME=$1
PTAU_FILE=$2 # eg: ../ptau/powersOfTau28_hez_final_18.ptau

circom ${NAME}.circom --r1cs --wasm --sym --c

node ${NAME}_js/generate_witness.js ${NAME}_js/${NAME}.wasm input.${NAME}.json witness.wtns

snarkjs plonk setup ${NAME}.r1cs ${PTAU_FILE} ${NAME}_final.plonk.zkey
#snarkjs plonk setup ${NAME}.r1cs ../ptau/powersOfTau28_hez_final_14.ptau ${NAME}_final.plonk.zkey

snarkjs zkey export verificationkey ${NAME}_final.plonk.zkey verification_key.plonk.json

snarkjs plonk prove ${NAME}_final.plonk.zkey witness.wtns proof.plonk.json public.plonk.json

snarkjs plonk verify verification_key.plonk.json public.plonk.json proof.plonk.json

cat public.plonk.json

snarkjs zkey export solidityverifier ${NAME}_final.plonk.zkey verifierPlonk.sol
