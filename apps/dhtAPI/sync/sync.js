import fs from "fs"
import path from "path"
import md5 from "md5"

var configFile = "autosync.json";
if (process.argv.length == 3) {
  configFile = process.argv[2];
}
var config = JSON.parse(fs.readFileSync(configFile, "UTF-8"));

config.repatterns = [];
for (var i = 0; i < config.patterns.length; i++) {
  config.repatterns.push(new RegExp(config.patterns[i], "i"));    
}


console.log("------------------------------------------");
console.log("Autosync - Revision 0");
console.log("------------------------------------------");
console.log("Source:      " + config.source);
console.log("Destination: " + config.destination);
console.log("Patterns:    " + config.repatterns);
console.log("------------------------------------------");


function dups(a, b) {
  var i = 0;
  var j = 0;
  var r = [];     
    
  a.sort();
  b.sort();
    
  while (i < a.length && j < b.length) {
    if (a[i] == b[j]) {
      r.push(a[i]);
      i++;
      j++;
    }
    else {
      if (a[i] < b[j])
        i++;
      else
        j++;           
    }        
  }
    
  return r;
}

function copy(source, dest, cb) {
  var rs = fs.createReadStream(source);
  var ws = fs.createWriteStream(dest);
    
  rs.pipe(ws);
  ws.on("end", cb);
}

function watchFile(source, dest) {
  var file = path.basename(source);
  console.log("watching " + file);
  fs.watchFile(source, function (curr, prev) {
    copy(source, dest, function (err) {            
      if (err) {
        console.log("failed to copy " + file);
         // TODO retry?
      }
      else {
        console.log("copied " + file);
      }
    });
  });
}

function md5File (path) {
  try {
    const content = fs.readFileSync(path)
    return md5(content)
  } catch (e) {
    console.log('md5File error:', e.message)
    return null
  }
}

const run = async () => {

  fs.readdir(config.source, function (err, sourceFiles) {
    if (err) throw err;    
    fs.readdir(config.destination, function (err, destFiles) {
    if (err) throw err;    
      var files = dups(sourceFiles, destFiles);

console.log(
  sourceFiles,
  destFiles,
  files,
)

      for (var i = 0; i < sourceFiles.length; i++) {
        for (var j = 0; j < config.repatterns.length; j++) {
          if (sourceFiles[i].match(config.repatterns[j])) {
            var sourceFile = path.join(config.source, sourceFiles[i]);
            var destFile = path.join(config.destination, sourceFiles[i]);
            copy(sourceFile, destFile, function (err) {            
              if (err) {
                console.log("failed to copy " + file);
                 // TODO retry?
              }
              else {
                console.log("copied " + file);
              }
            });
            const sourceMd5 = md5File(sourceFile);
            const destMd5 = md5File(destFile);
            //if (md5File(sourceFile) !== md5File(destFile) && ) {
            if (sourceMd5 !== null && destMd5 !== null && sourceMd5 !== destMd5) {
              console.log("md5 file content change, copy new content from source to dest\nsync ", sourceFile, destFile)
              copy(sourceFile, destFile, function (err) {            
                if (err) {
                  console.log("failed to copy " + file);
                 // TODO retry?
                }
                else {
                  console.log("copied " + file);
                }
              });
            }
            //watchFile(sourceFile, destFile);
            //console.log(
            //  sourceFile, 
            //  await md5File(sourceFile),            
            //  await md5File(destFile),
            //)            
          }
        }
      }        
        
/*
      for (var i = 0; i < files.length; i++) {
        for (var j = 0; j < config.repatterns.length; j++) {
          if (files[i].match(config.repatterns[j])) {
            var sourceFile = path.join(config.source, files[i]);
            var destFile = path.join(config.destination, files[i]);
console.log(sourceFile, destFile)
            //watchFile(sourceFile, destFile);
          }
        }
      }        
*/
    });

  });

}

run()
