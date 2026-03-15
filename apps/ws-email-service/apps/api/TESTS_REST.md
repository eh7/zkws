curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'


curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

curl -X POST http://localhost:3000/api/auth/update-password \
  -H "Content-Type: application/json" \
  -H "x-auth-token: your_jwt_token" \
  -d '{"currentPassword": "oldpassword", "newPassword": "newpassword123"}'

# List all emails
curl -X GET http://localhost:3000/api/mail/list \
  -H "x-auth-token: your_jwt_token"

# Get specific email
curl -X GET http://localhost:3000/api/mail/1 \
  -H "x-auth-token: your_jwt_token"

curl -X POST http://localhost:3000/api/mail/move/1234567890.12345_1.example.com \
  -H "Content-Type: application/json" \
  -H "x-auth-token: your_jwt_token" \
  -d '{"source": "new", "destination": "cur"}'

curl -X POST http://localhost:3000/api/mail/mark-read/1234567890.12345_1.example.com \
  -H "x-auth-token: your_jwt_token"

curl -X DELETE http://localhost:3000/api/mail/1234567890.12345_1.example.com \
  -H "x-auth-token: your_jwt_token"

