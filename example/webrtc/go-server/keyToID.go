package main

import (
 "io/ioutil"
  "fmt"

	. "github.com/libp2p/go-libp2p-core/crypto"
        peer "github.com/libp2p/go-libp2p/core/peer"
)
        //. "github.com/libp2p/go-libp2p-crypto"
        //peer "github.com/libp2p/go-libp2p-peer"

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func main() {
        pkbin, err := ioutil.ReadFile("key/pub-bin")
  check(err)

        pk, err := UnmarshalSecp256k1PublicKey(pkbin)
        check(err)

  pid, err := peer.IDFromPublicKey(pk)
  check(err)
  fmt.Println(pid.Pretty())

        privbin, err := ioutil.ReadFile("priv-bin")
  check(err)

        pvk, err := UnmarshalSecp256k1PrivateKey(privbin)
        check(err)

  pid2, err := peer.IDFromPrivateKey(pvk)
  check(err)
  fmt.Println(pid2.Pretty())
}
