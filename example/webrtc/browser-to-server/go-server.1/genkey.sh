openssl ecparam -name secp256k1 -genkey -noout | openssl ec -text -noout > key/keypair
cat key/keypair | grep pub -A 5 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^04//' > key/pub 
cat key/keypair | grep priv -A 3 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^00//' > key/priv
cat key/pub | keccak-256sum -x -l | tr -d ' -' | tail -c 41 > key/address
cat key/priv | xxd -r -p > key/priv-bin
cat key/pub | xxd -r -p > key/pub-bin
