#curl -d "param1=value1&param2=value2" -X POST http://127.0.0.1:5000/file/save
curl -F "weg=@weg.txt" http://127.0.0.1:5000/file/save
