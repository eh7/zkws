import fs from 'node:fs'

const directoryPath = '/tmp/'

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.log("error:", err)
  }
  console.log('Files in the directory:')
  files.forEach(file => {
    console.log(file);
  });
})
