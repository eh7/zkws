import Pop3Command from 'node-pop3'
import emlformat from 'eml-format'

import DKIMSignature from 'dkim-signature'
import DKIM from 'dkim'

import dns from 'node:dns';

import child_process from 'child_process'
import fs from 'node:fs'

import 'dotenv/config'

const app = {}
const exec = child_process.exec;

//dns.resolveTxt('dkim99._domainkey.dmail0.zkws.org', (err, data, family) => {
dns.resolveTxt(
  process.env.SELECTOR + '._domainkey.' + process.env.DOMAIN,
  (err, data) => {
    app.key =  data
    console.log(`dkim selector/domain pubkey data: \n${data}`)
  }
)

const pop3 = new Pop3Command({
  user: process.env.BOT_USER,
  password: process.env.BOT_PASSWD,
  host: process.env.BOT_HOST,
})
//await pop3.connect(),
//
console.log(
  await pop3.STAT(),
)

const list = await pop3.UIDL()
const uidl = await pop3.UIDL()

console.log(
  //pop3
  //await pop3.command('STAT')
  list,
  uidl,
)

const message = await pop3.UIDL(1)
console.log('1:', message)

const messageData = await pop3.RETR(6)
//console.log(messageData)
//console.log('xx---------------------------------xx')
//console.log(app)

for(let i = 1; i <= list.length; i++) {
  const messageData = await pop3.RETR(i)
  //console.log(list[i])
  await verify(messageData)
}



//process.exit()
 
/*
console.log(
  DKIM.verify(
    Buffer.from(
      messageData
    ),
    (out) => {
      console.log('out', out)
    }
  )
)

emlformat.read(messageData, (error, data) => {
  if (error) return console.log(error)
  console.log(data)
  console.log(data.headers['DKIM-Signature'])
  //const signature = DKIMSignature.parse(data.headers['DKIM-Signature'])
  const signature = DKIMSignature.parse(
    "v=1; a=rsa-sha256; c=relaxed/relaxed; d=dmail0.zkws.org; s=dkim99; x=1747145697; h=Received-SPF: Message-ID:From:Subject:To:User-Agent:Date; bh=x9eXaS9JWd9JtdaxYMTGl8PUA81wbUrHHQEQG9iJJPw=; b=xPHEB+ZyjgtxviUM8ak6CIIEswT/SsQClObhkI7D50FRl0BOYFVdvBh3ZcjJj/1f+AmNTbILGd5CpvLRgp3qzukwJdGwcmJTvI9ooJ+pu/hP9zBRmzmhvEX7M+5MP4me95SGRY24fIRVcil7HZ7TWK1WXwEtSiHfDGQ2gLCk2fSCcofvn1ksUaEG1sXn0NSt0XvxelzzpNinINjL+vOhed0SY9Tcvew8IepyM/pdhi+C191SLi+23rkFcJmiP+i3xXxX3sh9Mvt9TFGU5HLe7ixSuySSyrXsbxGsujMiqE7WU0nLGDCs/SGbv8b7PhkFFZwnLHJ/wZEO/uKNMiupGQ=="
  )
  console.log(
    DKIM.verify(
      Buffer.from(
        data.headers['DKIM-Signature']
      ),
      (out) => {
        console.log(out)
      }
    )
  )
})
*/


pop3.command('QUIT')


//
//  dkimverify system call with messageData
//
/*
function verifyEmail() {
  return new Promise((resolve, reject) => {
    callbackFn(...args, (err, result) => {
    if (err) {
      return reject(err);
    }
    resolve(result);
  });
}
*/

function verify(_messageData) {
  return new Promise((resolve, reject) => {
    const tmpFile = '/tmp/data.txt'
    console.log('dkim veirfy: ', _messageData) 
    fs.writeFile(tmpFile, _messageData, "utf8", (err) => {
      if (err) {
        reject(err)
      } else {
        console.log("File created -> ", tmpFile. _id)
        exec("dkimverify < /tmp/data.txt", (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else {
            //console.log(error, stdout, stderr)
            fs.unlink(tmpFile, (err) => {
              if (err) {
                reject(err)
              } else {
                console.log("File removed -> ", tmpFile. _id)
                resolve('done')
              }
            })
          }
        })
      }
    });
  })
}
