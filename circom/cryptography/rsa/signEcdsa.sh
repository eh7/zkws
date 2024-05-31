echo -n "abcdefghijklmnopqrstuvwxyz" > myfile.txt

openssl ecparam -genkey -name prime192v1 > private-key-EC.pem

openssl ec -in private-key-EC.pem -pubout > public-key-EC.pem

openssl dgst -sha3-256 -binary myfile.txt > myfile.txt.hash.txt

openssl pkeyutl -sign -inkey private-key-EC.pem -in myfile.txt.hash.txt > sig-EC.txt

hexdump sig-EC.txt

openssl pkeyutl -verify -in myfile.txt.hash.txt -sigfile sig-EC.txt -inkey public-key-EC.pem -pubin 
