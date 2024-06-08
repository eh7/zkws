echo abcdefghijklmnopqrstuvwxyz > myfile.txt

openssl dgst -sha1 -sign private-key.pem -out sha1.sign myfile.txt

hexdump sha1.sign
