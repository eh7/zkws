import Pop3Command from 'node-pop3'
import 'dotenv/config'

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

const list = await pop3.UIDL();
const uidl = await pop3.UIDL();

console.log(
  //pop3
  //await pop3.command('STAT')
  list,
  uidl,
)

const message = await pop3.UIDL(1);
console.log('1:', message)

const messageData = await pop3.RETR(1);
console.log(messageData)

pop3.command('QUIT')

//const str = await pop3.command('LIST');

//console.log(str)

//const msgNum = 1;


//const str = await pop3.RETR(msgNum);
//// deal with mail string
//await pop3.QUIT();
