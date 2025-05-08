import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
const app = express()
const host = 'www.zkws.org' //'localhost'; 
const port = 8000

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//console.log(import.meta.url)
//console.log()
//console.log(__dirname)

const __dirname = process.cwd();
//const __dirname = '/tmp/';

app.use(express.static('dist'));

app.get('*', (req, res) => {
  //res.sendFile(path.resolve(__dirname, "..", 'dist', 'index.html'));
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`); 
})

