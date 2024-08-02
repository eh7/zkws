curl -X POST  http://127.0.0.1:5000/file/save/multi \
  -H 'Content-Type: multipart/form-data' \
  -F "files=@${1}" \
  -F "files=@${2}"  
