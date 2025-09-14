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
import { simpleParser } from 'mailparser'

import {
  Writable,
  Readable,
} from 'constant-db64'

import 'dotenv/config'

const app = {}
const exec = child_process.exec;

const cdb_path = './db/cdbfile'
const writer = new Writable(cdb_path)
await writer.open()
const reader = new Readable(cdb_path)
await reader.open()

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
  port: process.env.BOT_PORT,
})
//await pop3.connect(),
//
console.log(
  await pop3.STAT(),
)

const list = await pop3.UIDL()

console.log(list)

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

const sendReturnEmail = async (_toEmail, _subject, _text, _html) => {
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

  console.log('sendEmail :: ', _toEmail, _subject, _text, _html)

  const info = await transporter.sendMail({
    from: '"zkws crypto-bot" <' + sendEmail + '>',
//    to: '"' + _toEmail.name + '" <' + _toEmail.address + '>',
    to: _toEmail.text,
    subject: _subject,
    text: _text,
    html: _html,
  });

  console.log("Message sent:", info.messageId);
/*
*/
}

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
  return new Promise(async (resolve, reject) => {
    const dkim_verify_result = await dkimVerify(_messageData)
    console.log(dkim_verify_result)
    if (dkim_verify_result === true) {
      const options = {}
      const mail = await simpleParser(_messageData, options)
      console.log(mail.messageId)
      const from = mail.headers.get('from')
      const subject = mail.headers.get('subject')
      if (subject === 'balance request') {
        const mailBody = mail.text
        const outText = 'text'
        const outHtml = '<b>html</b>'

        const bodyLines = mailBody.split("\n")
        let address = ''
        let network = ''
        bodyLines.map((item) => {
          if (item.search(/^address: /) === 0) {
            address = item.replace(/^address: /, '')
          } else if (item.search(/^network: /) === 0) {
            network = item.replace(/^network: /, '')
          }
        })
        if (address !== '' && network !== '') {
          console.log(address, network)

          const MM_API_KEY = process.env.MM_API_KEY
          const rcpUrl = "https://" + network + ".infura.io/v3/" + MM_API_KEY
          console.log(rcpUrl)
          const provider = new ethers.JsonRpcProvider(rcpUrl)

          const balance = ethers.formatEther(
            (await provider.getBalance(address)).toString()
          )

          const outText = "Balance for " + address + " :: " + balance + "ETH\n\nThanks zkws crypto-bot network-relayer."
          const outHtml = "Hi<br><br>Balance for <b>" + address + "</b><h5>" + balance + " ETH</h5><p>Thanks zkws crypto-bot network-relayer.</p>"

          //console.log(from, "Re: " + subject)
          console.log('XXXXXXXXXXXXXXXX', from, "Re: " + subject, outText, outHtml)
          sendReturnEmail(from, "Re: " + subject, outText, outHtml)
        }
      }
    }
    resolve('done')
  })
}

function verifyOld(_messageData) {
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
//          console.log("#### ---> File created -> ", tmpFile)
//          console.log("dkim_verify_result:  ", dkim_verify_result)
//          console.log("messageData:  ", _messageData)

          const options = {}
          const mail = await simpleParser(_messageData, options)
          console.log(mail.messageId)
/*
          console.log(typeof mail.messageId)
          console.log(await reader.get(mail.messageId))
          writer.put(mail.messageId, 'done')
          await writer.close()
*/
          const from = mail.headers.get('from')
          const subject = mail.headers.get('subject')
          if (subject === 'balance request') {
            const mailBody = mail.text
            const outText = 'text'
            const outHtml = '<b>html</b>'

            const bodyLines = mailBody.split("\n")
            let address = ''
            let network = ''
            bodyLines.map((item) => {
              if (item.search(/^address: /) === 0) {
                address = item.replace(/^address: /, '')
              } else if (item.search(/^network: /) === 0) {
                network = item.replace(/^network: /, '')
              }
            })
            if (address !== '' && network !== '') {
              console.log(address, network)

              const MM_API_KEY = process.env.MM_API_KEY
              const rcpUrl = "https://" + network + ".infura.io/v3/" + MM_API_KEY
              console.log(rcpUrl)
              const provider = new ethers.JsonRpcProvider(rcpUrl)

              const balance = ethers.formatEther(
                (await provider.getBalance(address)).toString()
              )

              const outText = "Balance for " + address + " :: " + balance + "ETH\n\nThanks zkws crypto-bot network-relayer."
              const outHtml = "Hi<br><br>Balance for <b>" + address + "</b><h5>" + balance + " ETH</h5><p>Thanks zkws crypto-bot network-relayer.</p>"

              console.log(from, "Re: " + subject)
              //console.log('XXXXXXXXXXXXXXXX', from, "Re: " + subject, outText, outHtml)
              //sendReturnEmail(from, "Re: " + subject, outText, outHtml)
            }
          }
console.log('------------------')
        }
        resolve('done')
      }
    });
  })
}

