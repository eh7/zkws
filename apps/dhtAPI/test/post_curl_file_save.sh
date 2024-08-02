#curl -d "param1=value1&param2=value2" -X POST http://127.0.0.1:5000/file/save
curl -X POST  http://127.0.0.1:5000/file/save/weg \
  -F "weg=@weg.txt"
#curl -X POST \
#  http://127.0.0.1:5000/file/save \
#  -H 'content-type: multipart/form-data;' \
