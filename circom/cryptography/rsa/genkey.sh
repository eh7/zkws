openssl genrsa -out private-key.pem 3072

openssl rsa -in private-key.pem -pubout -out public-key.pem

# optional: create a self-signed certificate
# openssl req -new -x509 -key private-key.pem -out cert.pem -days 360


# optional: convert pem to pfx
# openssl pkcs12 -export -inkey private-key.pem -in cert.pem -out cert.pfx
