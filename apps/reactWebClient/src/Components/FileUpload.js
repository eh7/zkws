import React from 'react'

import {
  Button,
  Form,
  FormGroup,
  Card,
  Row,
  Col,
  Container,
  FloatingLabel,
  Table,
} from 'react-bootstrap';

import {openDB} from 'idb'
import * as indexedDB from 'idb'

import Wallet from '../services/wallet'

import SyncDataSettings from "../Components/SyncDataSetting"

const dbVersion = 1
const apiHost = (process.env.PROD === 'true') ? "www.zkws.org" : "localhost"

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      files: [],
      form: {phrase:''},
      pharse: '',
      address: null,
      syncAddress: null,
      syncPhrase: null,
      dbStatus: false,
      listening: false,
      dbName: 'filesystem-database',
      storeName: 'files',
      dbNameNew: 'filesystem-database-new',
      storeNameTest: 'newFiles',
      utf8FileText: '',
    };

  }

  // example blob to file example
//  const myFile = new File([myBlob], '/tmp/image.jpeg', {
//    type: myBlob.type,
//  });

  createStoreInDBNew = async () => {
    try {
      const dbName =this.state.dbNameNew 
      const storeName = this.state.storeName
      const dbPromise = openDB(dbName, dbVersion, {
        upgrade(db) {
          db.createObjectStore(storeName);
          console.log("db.createObjectStore ::", dbName, storeName)
        },
      });
    } catch (e) {
      console.error('ERROR in :: createStoreInDBNew :: ', e)
    };
  }

  createStoreInDB = async () => {
    try {
      //const dbName = 'filesystem-database'
      //const storeName = 'files'
      const dbName =this.state.dbName
      const storeName = this.state.storeName
      const storeNameTest = this.state.storeNameTest
      const dbPromise = openDB(dbName, dbVersion, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName)
          }
          if (!db.objectStoreNames.contains(storeNameTest)) {
            db.createObjectStore(storeNameTest)
          }
          console.log('UPGRADE indexedDB OKAY! version:', dbVersion, db.objectStoreNames)
        },
      });
    } catch (e) {
      console.error('ERROR in :: createStoreInDB :: ', e)
    };
  }

  indexedDBStuff = async () => {
    if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      return false;
    } else {
      return true
    }
  }

  createStoreInDBOld = async () => {

    try {
      this.setState({ phrase: await this.wallet.getNewPhraseData() });
      console.log("phrase:", this.state.syncPhrase);
      const dbName = 'filesystem-database'
      const storeName = 'files'
      const db = await openDB(dbName, dbVersion)
      this.setState({ keys: await db.getAllKeys(storeName) })
      this.setState({ files: await db.getAll(storeName) })
      console.log('keys', this.state.keys)
      console.log('files', this.state.files)
    } catch (e) {
      console.error("ERROR CATCH :: createStoreInDB :: ", e)
    }
  }

  readChunks = (reader) => {
    return {
      async* [Symbol.asyncIterator]() {
        let readResult = await reader.read();
        while (!readResult.done) {
          yield readResult.value;
          readResult = await reader.read();
        }
      },
    };
  }

  handleStatsClick = async (event) => {
    try {
      const now = new Date()
      const seconds = String(Math.round(now.getTime() / 1000));
      const data = JSON.stringify({
        info: "stats",
        now: seconds,
      })
      const {signature, hashedMessage} = await this.wallet.signMessage(data);

      const url = "http://" + apiHost + ":3333/stats"
      const headers = {
        'fsignature': signature,
        'fmessage': seconds, 
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      console.log('stats :: response ::', response)
    } catch (err) {
      console.error('ERROR :: handleStatsClick ::', err)
    }
  }

  handleLatestClick = async (event) => {
    const newFiles = []
    let files = ''
    try {
      const addressUser = await this.wallet.getAddress()
      const addressData = await this.wallet.getDataWalletPhrase(this.state.syncPhrase)

      const now = new Date()
      const seconds = String(Math.round(now.getTime() / 1000));
      const data = JSON.stringify({
        addressData,
        addressUser,
        now: seconds,
      })
      const {signature, hashedMessage} = await this.wallet.signMessage(data);

      const url = "http://" + apiHost + ":3333/latest/" + addressData + '/' + addressUser
      //const url = "http://localhost:3333/latest/" + addressData + '/' + addressUser + "?" + new URLSearchParams({signature, hashedMessage})
      const headers = {
        'fsignature': signature,
        'fmessage': seconds, 
      }
      //console.log('handleLatestClick url', url)
      const response = await fetch(url, {
        method: "GET",
        headers,
//        body: {signature, hashedMessage},
//      //body: JSON.stringify({ username: "example" }),
//      body: dataString,
      })
//console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx response:', response)
//
 //     if (response.status === 200) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf8');
        for await (const chunk of this.readChunks(reader)) {
          console.log(`received chunk of size ${chunk.length}`);
          //console.log(decoder.decode(chunk))
          files = files + decoder.decode(chunk) 
        }
        files = JSON.parse(files)
        console.log('files', files)
        /*
        files.map((file, index) => {
          const decryptedFileData = this.wallet.decryptFileData(
            file,
            this.state.phrase,
          )
          console.log('decryptedFilesData array index=' + index, file, decryptedFileData);
        })
        */
        files.map((file) => {
          newFiles.push(this.wallet.decryptFilesData(file, this.state.syncPhrase))
        })
        //WIP
        console.log('decryptFilesData :: decrypted :: ', newFiles)
        this.updateFiles(newFiles)
//      }
    } catch (err) {
      console.error('ERROR :: handleLatestClick ::', err)
      if (files.message === 'Error streaming file') {
        alert("Error streaming file - Has the sync been run since you published your files?")
      }
    }
  }

  handleListenClick = (event) => {
    try {
      let value = document.querySelector('#listenSwitch').value;
      if (document.querySelector('#listenSwitch').value === 'off') {
        document.querySelector("#listenSwitch").value = "on";
        this.syncSwitchOn()
        console.log("initiate publishing of latest files data on REST API or p2p broadcast")
      } else {
        document.querySelector("#listenSwitch").value = "off";
        this.syncSwitchOff()
        console.log("p2p signoff and halt publishing of latest files data")
      }
    } catch (e) {
      console.error(':: handleListenClick ERROR :: ', e)
      alert(':: handleListenClick ERROR :: ' +  e.message)
    }
  }

  syncSwitchOn = async (event) => {
    //console.log('files', this.state.files)

    const address = await this.wallet.getAddress()

    const encryptedFilesData = await this.wallet.encryptFilesData(
      this.state.files,
      this.state.syncPhrase,
      address
    )
    console.log('encryptedFilesData', encryptedFilesData);
    console.log(JSON.stringify(encryptedFilesData))

    // WIP START
    // Example showing decryption of file and files data
    const decryptedFilesData = this.wallet.decryptFilesData(
      encryptedFilesData,
      this.state.syncPhrase,
    )
    console.log('decryptedFilesData', decryptedFilesData);

    encryptedFilesData.encryptedFiles.map((file, index) => {
      const decryptedFilesData = this.wallet.decryptFilesData(
        file,
        this.state.syncPhrase,
      )
      console.log('decryptedFilesData array index=' + index, decryptedFilesData);
    })
    // WIP DONE

    try {
      console.log('encryptedFilesData', encryptedFilesData)
      const data = JSON.stringify(
        encryptedFilesData
        //encryptedFilesData.hashes
      );
      const {signature, hashedMessage} = await this.wallet.signMessage(data);
      //const signature = await this.wallet.signMessage(data);
      const recoveredAddress = await this.wallet.recoverAddressFromMessage(data, signature);
      console.log({
        text: 'signMessage',
        state: (address === recoveredAddress),
        address,
        recoveredAddress,
        //dataOld: encryptedFilesData.hashes,
        data,
      });

      let apiData = encryptedFilesData
      encryptedFilesData.signature = signature

      //
      // publish the latest files data to the filesAPI server
      // host localhost port 3333 path /publishNew
      const url = "http://" + apiHost + ":3333/publishNew";
      //const dataString = "this is a data string in the components/Data/FileUpload.js" 
      //const dataString = JSON.stringify(encryptedFilesData) 
      const dataString = JSON.stringify(apiData) 
      const response = await fetch(url, {
        method: "POST",
        //body: JSON.stringify({ username: "example" }),
        body: dataString,
      })
      console.log({
        response,
      })
   } catch (err) {
     console.error('signMessage', err)
   }

    alert('on')
  }

  syncSwitchOff = (event) => {
    alert('off')
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async (e) => {
      // Code to handle the uploaded file
      console.log(file)
      const fileString = e.target.result;
      console.log(fileString)
      console.log("fileString size : " + fileString.length);

      let ob = {
        created:new Date(),
        data: fileString,
        name: file.name,
      }

//alert(JSON.stringify(ob))

      try {
        //const dbName = 'filesystem-database'
        //const storeName = 'files'
        const db = await openDB(this.state.dbName, dbVersion)

        const trans = db.transaction([this.state.storeName], 'readwrite');
        await trans.store.put(ob, ob.name)

        const dataInDb = await trans.store.get(ob.name)

        this.setupDBState();

        document.querySelector("#image").style = 'border: 1px solid black';
        document.querySelector("#image").src = dataInDb.data;

      //  e.target.value = null;
      } catch (e) {
        console.log('ERROR FILE SAVE', e)
      }
    };

    //reader.readAsDataURL(file);
    //reader.readAsBinaryString(file);
  };

  setupDBState = async (_fileData) => {
    const db = await openDB(this.state.dbName, dbVersion)
    await this.setState({
      dbStatus: true,
      files: await db.getAll(this.state.storeName), 
      keys: await db.getAllKeys(this.state.storeName),
    })
  }

  renderTextFile = async (_name, _index) => {
    try {
    const ob = this.state.files[_index]
    const db = await openDB(this.state.dbName, dbVersion)
    const trans = db.transaction([this.state.storeName], 'readonly');
    const dataInDb = await trans.store.get(ob.name)
    let [typeEncoding, typeEncodedData] = dataInDb.data.split(",")
    typeEncoding = typeEncoding.substring(5)
    let [type, encoding] = typeEncoding.split(";")
    console.log(typeEncodedData, type, encoding)
    const binaryData = atob(typeEncodedData)
    const utf8String = decodeURIComponent(escape(binaryData))

    this.setState({ utf8FileText: utf8String })
//    document.querySelector("#blobTextData").style = 'border: 1px solid black';
//    document.querySelector("#blobTextData").innerHtml = utf8String;
//    document.querySelector("#blobTextData").innerHtml = "testing debug text"
    //alert(utf8String)

    document.querySelector("#image").style = 'border: 0px solid black';
    document.querySelector("#image").src = '';
    } catch (err) {
      console.error('ERROR :: renderTextFile ::', err.message)
    }
  }

  saveImageFile = async (_name, _index) => {
    const ob = this.state.files[_index]
    const db = await openDB(this.state.dbName, dbVersion)
    const trans = db.transaction([this.state.storeName], 'readonly');
    const dataInDb = await trans.store.get(ob.name)

    const saveBlob = (function () {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      return function (data, fileName) {

      let [typeEncoding, typeEncodedData] = data.split(",")
      typeEncoding = typeEncoding.substring(5)
      let [type, encoding] = typeEncoding.split(";")
      
console.log(
  'data.spli(",")::',
  data.split(","),
  'type:',
  type,
)
        // From http://stackoverflow.com/questions/14967647/ (continues on next line)
        // encode-decode-image-with-base64-breaks-image (2013-04-21)
        function fixBinary (bin) {
          var length = bin.length;
          var buf = new ArrayBuffer(length);
          var arr = new Uint8Array(buf);
          for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
          }
          return buf;
        }

        const binaryData = fixBinary(atob(typeEncodedData));
        const json = JSON.stringify(data)
        //const blob = new Blob([json], {type: "octet/stream"})
        //const blob = new Blob([json], {
        const blob = new Blob([binaryData], {
          type,
        })
        const url  = window.URL.createObjectURL(blob)
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    }());

    saveBlob(dataInDb.data, dataInDb.name);
  }

  showImageFile = async (_name, _index) => {
    try {
    const ob = this.state.files[_index]
    const db = await openDB(this.state.dbName, dbVersion)
    const trans = db.transaction([this.state.storeName], 'readonly');
    const dataInDb = await trans.store.get(ob.name)
console.log('dataInDb', ob)
    document.querySelector("#image").style = 'border: 1px solid black';
    document.querySelector("#image").src = dataInDb.data;
    this.setState({ utf8FileText: '' })
    } catch (err) {
      console.error('ERROR :: showImageFile ::', err)
    }
  }

  updateFiles = async (_files) => {
    try {
      const db = await openDB(this.state.dbName, dbVersion)
      //const table = this.state.storeNameTest
      const table = this.state.storeName
      const trans = db.transaction([table], 'readwrite')

      trans.addEventListener("complete", (event) => {
        this.setupDBState();
        alert('trans complete :: added all synced files to ' + table)
      })

      _files.map(async (file) => {
        console.log("put", file)
        const ob = file
        await trans.objectStore(table).put(ob, ob.name)
        console.log('store.put(ob, ob.name)', ob, table)
      })
      trans.done

      //alert('added all synced files to ' + this.state.storeNameTest)
    } catch (err) {
      console.error('ERROR :: updateFiles ::', err)
    } 
  }

  deleteFile = async (_name, _index) => {
    const ob = this.state.files[_index]
    const db = await openDB(this.state.dbName, dbVersion)
    const trans = db.transaction([this.state.storeName], 'readwrite');
    console.log(this.state.files)
    console.log(
      'DELETED FILE :: ',
      _name,
    )
    console.log(
      'DELETED FILE RESULT:: ',
      await trans.objectStore(this.state.storeName).delete(ob.name),
    )
    console.log(this.state.files)
    this.setupDBState();
  }
  
  setPhrase = async () => {
    //e.preventDefault() 
    if (!this.state.form.phrase) {
      alert('Set a value for new phrase if you wish to set a new one')
    } else {
      console.log('update sync Phrase:', this.state.form.phrase)
      await this.wallet.setNewPhraseData(this.state.form.phrase)
      await this.setState({ phrase: this.state.form.phrase });
      //this.state.form.phrase = ''
      await this.setState(prevState => ({
        form: {
          ...prevState.form,
          phrase: '',
        }
      }))
      //console.log('this.state.form.phrase', this.state.form.phrase)
      console.log('updated sync Phrase')//, this.state.phrase)
      window.location = "/files"
      //alert('WIP setPhrase()')
    }
  }

  //componentDidUpdate = async () => {
  //  alert('componentDidUpdate')
  //}

  componentDidMount = async () => {
    try {
      this.wallet = new Wallet();
      this.createStoreInDB();
      //this.createStoreInDBNew();
      this.syncPhrase = await this.wallet.getPhraseData()
      this.setState({ syncPhrase: this.syncPhrase });
      //this.setState({ phrase: await this.wallet.getPhraseData() });
      this.setState({ address: await this.wallet.getAddress() })
      this.setState({ syncAddress: await this.wallet.getDataWalletAddress(this.syncPhrase) });
      this.setupDBState();
    } catch (e) {
      console.error('ERROR :: FileUpload :: componentDidMount :: ', e)
    }
  };

  componentDidUpdate = () => {
    //alert("componentDidUpdate")
  }

  render() {
//    if(!this.state.dbStatus) {
//      return (
//        <>
//          db not setup...
//        </>
//      )
//    } else if(this.indexedDBStuff()) {
    if(this.indexedDBStuff()) {
      return (
        <>
          <Card className="m-3">
            <Card.Header>Your Data Sync Settings</Card.Header>
            <Card.Body>
              <SyncDataSettings />
            </Card.Body>
          </Card>
          <Card className="m-3">
            <Card.Header>Data Sync Controls</Card.Header>
            <Card.Title>Your Files Data</Card.Title>
            <Card.Body>
              <p>Listen: 
                <b>{ this.state.listening }</b>
                <input type="button" id="listenSwitch" value="off" onClick={this.handleListenClick}/>
              </p>
              <p>Latest: 
                <input type="button" id="latestSwitch" value="get" onClick={this.handleLatestClick}/>
              </p>
              { (this.state.address === '0xF125Fe77570a4E51B16B674C95ace26fbE99164e' || this.state.address === '0x7574b8D4C0C2566b671C530d710821EB6694bE0C') && 
                <p>Run Stats: 
                  <input type="button" id="runStats" value="get" onClick={this.handleStatsClick}/>
                </p>
              }

              FileUpload Input: <input type="file"
                                       key={Math.random().toString(36)}
                                       onChange={this.handleFileUpload} />
              <Container fluid="md">
                <Table striped bordered hover size="sm" variant="warning" >
                  <thead>
                    <tr>
                      <th>-</th>
                      <th>-</th>
                      <th>-</th>
                     <th>delete</th>
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.keys.map((name, index) => {
                     return (
                       <tr>
                         <td>
                           <button onClick={() => this.showImageFile(name, index)}>show {name}</button>
                          </td>
                          <td>
                            <button onClick={() => this.saveImageFile(name, index)}> save </button>
                          </td>
                          <td>
                            <button onClick={() => this.renderTextFile(name, index)}> renderTextFile </button>
                          </td>
                          <td>
                            <button onClick={() => this.deleteFile(name, index)}> x </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Container>
              <Card bg="Success" border="warning">
                <Card.Header>File Output ({ (this.state.utf8FileText) ? <>text</> : <>image</> })</Card.Header>
                <Card.Body>
                  { (this.state.utf8FileText) &&
                    <Card.Text className='text-left'>
                      {this.state?.utf8FileText}
                    </Card.Text>
                  }
                  <Card.Text className='text-center'>
                    <img id="image"/>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className="mt-3">
                <Card.Header>Update Your Sync Phrase</Card.Header>
                <Card.Body>
                  <p>
                    <Form.Group className="mb-3" controlId="phraseInputs">
                      <Form.Control
                        id='phrase'
                        type="input"
                        as="textarea"
                        label="Enter New Sync Phrase"
                        placeholder="enter your new phrase"
                        onChange={(event) => {
                          this.state.form.phrase = event.target.value
                        }}
                        ref={this.state.form.phrase}
                      />
                      <Button type="submit" onClick={() => this.setPhrase()}>update sync phrase</Button>
                    </Form.Group>
                  </p>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </>
      );
    } else {
      return (
        <>
          FileUpload IndexedDB not available in this browser 
        </>
      );
    }
  }
}

export default FileUpload
