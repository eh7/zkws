import Pop3Command from 'node-pop3'
import 'dotenv/config'

const pop3 = new Pop3Command({
  user: 'bote@app.zkws.org',
  password: process.env.BOT_PASSWD,
  host: 'mail0.zkws.org'
})
await pop3.connect(),

console.log(
  //pop3
  await pop3.command('STAT')
)
//const str = await pop3.command('LIST');

//console.log(str)

//const msgNum = 1;


//const str = await pop3.RETR(msgNum);
//// deal with mail string
//await pop3.QUIT();
