package main

import (
	"io/ioutil"
	"fmt"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/crypto"
)
//	"io"
//	"crypto/rand"
//	mrand "math/rand"

//priv, _, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, r)

//func NewHost(ctx context.Context, seed int64, port int) (host.Host, error) {
//}

func main() {
	/*
	var r io.Reader
	var seed int64 = 6343435
	if seed == 0 {
		r = rand.Reader
	} else {
		r = mrand.New(mrand.NewSource(seed))
	}
	r = mrand.New(mrand.NewSource(seed))
	priv, _, err := crypto.GenerateRSAKeyPair(2048, r)
	if err != nil {
		fmt.Printf("err: %s\n", err)
	}
	*/
	//fmt.Printf("hello world\n")
	//fmt.Printf("err: %s\n", err)

        privBin, err := ioutil.ReadFile("key/priv-bin")
        priv, err := crypto.UnmarshalSecp256k1PrivateKey(privBin)

	//priv, _, err := crypto.GenerateKeyPair(
	//	//crypto.Ed25519, // Select your key type. Ed25519 are nice short
	//	//-1,             // Select key length when possible (i.e. RSA).
	//	crypto.RSA, // Select your key type. Ed25519 are nice short
	//	2048,             // Select key length when possible (i.e. RSA).
	//)
	if err != nil {
		panic(err)
	}
	fmt.Printf("priv: %s\n", priv)

	var port = 10333
	//addr, _ := multiaddr.NewMultiaddr(fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", port))
	addr := fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", port)
	//fmt.Printf("addr: %s\n", addr)

	//var ctx context.Context
	opts := []libp2p.Option{
		//libp2p.ListenAddrStrings(fmt.Sprintf("/ip4/127.0.0.1/tcp/%d", port)),
		libp2p.ListenAddrStrings(addr),
		libp2p.Identity(priv),
		libp2p.DisableRelay(),
	}
	webrtcNode0, err := libp2p.New(opts...)
	//webrtcNode0, err := libp2p.New(ctx,
	//	libp2p.ListenAddrs(addr),
	//	libp2p.Identity(priv),
	//)
	fmt.Printf("libp2p: %s", webrtcNode0.Addrs())
	fmt.Printf("Node Addr: %s", webrtcNode0.Addrs())
	fmt.Printf("Node ID: %s", webrtcNode0.ID())
}

	/*
import (
	"context"
	"crypto/rand"
	"fmt"
	"io"
	mrand "math/rand"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/crypto"
	"github.com/libp2p/go-libp2p-core/host"
	"github.com/multiformats/go-multiaddr"
)
*/

/*
func NewHost(ctx context.Context, seed int64, port int) (host.Host, error) {

	// If the seed is zero, use real cryptographic randomness. Otherwise, use a
	// deterministic randomness source to make generated keys stay the same
	// across multiple runs
	var r io.Reader
	if seed == 0 {
		r = rand.Reader
	} else {
		r = mrand.New(mrand.NewSource(seed))
	}

	priv sk, _, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, r)
	if err != nil {
		return nil, err
	}

	addr, _ := multiaddr.NewMultiaddr(fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", port))

	return libp2p.New(ctx,
		libp2p.ListenAddrs(addr),
		libp2p.Identity(priv),
	)
}
*/
