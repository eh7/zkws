package main

import (
	"io/ioutil"
	"fmt"
        . "github.com/libp2p/go-libp2p/core/crypto"
	peer "github.com/libp2p/go-libp2p/core/peer"
)

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func main() {
        priv, err := ioutil.ReadFile("key/priv-bin")
  check(err)
  //fmt.Println(string(priv))

        privkey, err := UnmarshalSecp256k1PrivateKey(priv)
        check(err)
  fmt.Println(privkey)
	pubkey := privkey.GetPublic()
  fmt.Println(pubkey)
	pid, err := peer.IDFromPublicKey(pubkey)
        check(err)
  fmt.Println(pid)
  fmt.Println(pid)

        mprivkey, err := MarshalPrivateKey(privkey)
        check(err)
  fmt.Println(mprivkey)
}
