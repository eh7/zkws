// main.go
package main

import (
    "encoding/json"
    "io/ioutil"
    "log"
)

// The data struct for the decoded data
// Notice that all fields must be exportable!
type Data struct {
    Origin string
    User   string
    Active bool
}

type PeerData struct {
    Id string
    Privkey string
    Pubkey string
}

func mainJson() {
    content, err := ioutil.ReadFile("./peerId.json")
    if err != nil {
        log.Fatal("Error when opening file: ", err)
    }

    var payload PeerData
    err = json.Unmarshal(content, &payload)
    if err != nil {
        log.Fatal("Error during Unmarshal(): ", err)
    }

    log.Printf("mainJson")
    log.Printf("Id: %s\n", payload.Id)
    log.Printf("Privkey: %s\n", payload.Privkey)
    log.Printf("Pubkey: %s\n", payload.Pubkey)
}

func main() {
    // Let's first read the `config.json` file
    content, err := ioutil.ReadFile("./config.json")
    if err != nil {
        log.Fatal("Error when opening file: ", err)
    }

    // Now let's unmarshall the data into `payload`
    var payload Data
    err = json.Unmarshal(content, &payload)
    if err != nil {
        log.Fatal("Error during Unmarshal(): ", err)
    }

    // Let's print the unmarshalled data!
    log.Printf("origin: %s\n", payload.Origin)
    log.Printf("user: %s\n", payload.User)
    log.Printf("status: %t\n", payload.Active)

    mainJson()
}
