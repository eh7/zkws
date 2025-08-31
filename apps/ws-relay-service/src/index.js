import Pop3Command from 'node-pop3'
import emlformat from 'eml-format'

import DKIMSignature from 'dkim-signature'
import DKIM from 'dkim'
import { dkimVerify } from 'dkimpy'

import dns from 'node:dns';

import child_process from 'child_process'
import fs from 'node:fs'

import {
ethers,
} from "ethers"

import nodemailer from 'nodemailer'

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

/*
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
*/

for(let i = 1; i <= list.length; i++) {
  const messageData = await pop3.RETR(i)
  //console.log(list[i])
  //console.log(" :::::::::::::::::::::::::::::::::::::::::::::::::::")
  //console.log(i)
  //console.log(messageData)

  await verify(messageData)

/*
  DKIM.verify(
    Buffer.from(
      messageData
    ),
    (out) => {
      console.log('out', out)
    }
  )
*/
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
    //console.log('dkim veirfy: ', _messageData) 
    fs.writeFile(tmpFile, _messageData, "utf8", async (err) => {
      if (err) {
        //console.log(_messageData)
        //reject(err)
        //resolve(err)
      } else {
        //console.log("#### ---> File created -> ", tmpFile)
        const dkim_verify_result = await dkimVerify(_messageData)

        if (dkim_verify_result === true) {
          console.log(":::::::::::::::::::::::::::::::::::::::::::::::")
          console.log("#### ---> File created -> ", tmpFile)
          console.log("dkim_verify_result:  ", dkim_verify_result)
          //console.log("messageData:  ", _messageData)
          emlformat.read(_messageData, async (error, data) => {
            console.log(data.subject)
            if (data.subject === 'balance request') {
              try {
                console.log(data.text)
                console.log(data.from.email)
//process.exit()
                const bodyLines = data.text.split("\r\n")
                let address = ''
                let network = ''
                bodyLines.map((item) => {
                  if (item.search(/^address: /) === 0) {
                    address = item.replace(/^address: /, '')
//                  address = item //.replace(/^address: /, '')
                  } else if (item.search(/^network: /) === 0) {
                    network = item.replace(/^network: /, '')
//                    network = item //.replace(/^network: /, '')
                  }
                })
                if (address !== '' && network !== '') {
                  console.log(address, network)

                  const MM_API_KEY = process.env.MM_API_KEY
                  const rcpUrl = "https://" + network + ".infura.io/v3/" + MM_API_KEY
                  console.log(rcpUrl)
                  const provider = new ethers.JsonRpcProvider(rcpUrl)

                  const outText = "Balance for " + address + " :: " +
                    ethers.formatEther(
                      (await provider.getBalance(address)).toString()
                    ) + "ETH\n\nThanks zkws crypto-bot network-relayer."

                  const outHtml = "Hi<br>Balance for <b>" + address + "</b> :: <h5>" + 
                    ethers.formatEther(
                      (await provider.getBalance(address)).toString()
                    ) + " ETH</h5><p>Thanks zkws crypto-bot network-relayer.</p>"

                  console.log(outText)
                  console.log(outHtml)

                  sendEmail(data.from, "Re: " + data.subject, outText, outHtml)
                }
              } catch (e) {
                console.log('ERROR :: balance request :: ', e.message)
              }
            }
            //console.log(data.text.split("\r\n"))
          })
        }
//emlformat.read(messageData, (error, data) => {
/*
        exec("dkimverify < /tmp/data.txt", (error, stdout, stderr) => {
          if (error) {
            console.log(error.message)
          }
        })
*/
        resolve('done')
/*
        exec("dkimverify < /tmp/data.txt", (error, stdout, stderr) => {
          if (error) {
            if (stdout === "signature verification failed") {
              console.log('stdout :: ',stdout)
              resolve('done')
            } else {
              //reject(error)
              console.log(error.message)
              resolve(error)
            }
          } else {
            //console.log(error, stdout, stderr)
            fs.unlink(tmpFile, (err) => {
              if (err) {
                reject(err)
              } else {
                console.log("File removed -> ", tmpFile)
                resolve('done')
              }
            })
          }
        })
*/
      }
    });
  })
}

const sendEmail = async (_toEmail, _subject, _text, _html) => {
  const sendEmail = process.env.BOT_USER
  const sendPass  = process.env.BOT_PASSWD
  const sendHost  = process.env.BOT_HOST
  const sendPort  = process.env.BOT_OUT_PORT

  const transporter = nodemailer.createTransport({
    host: sendHost,
    port: sendPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: sendEmail,
      pass: sendPass,
    },
  });

  const info = await transporter.sendMail({
    from: '"zkws crypto-bot" <' + sendEmail + '>',
    to: '"' + _toEmail.name + '" <' + _toEmail.email + '>',
    subject: _subject,
    text: _text,
    html: _html,
  });

  console.log("Message sent:", info.messageId);
}
