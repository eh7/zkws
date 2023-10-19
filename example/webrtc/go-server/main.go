package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"encoding/json"
	"io/ioutil"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/crypto"
	webrtc "github.com/libp2p/go-libp2p/p2p/transport/webrtc"
)

type PeerData struct {
	Id string
	Privkey string
	Pubkey string
}

var listenerIp = net.IPv4(127, 0, 0, 1)

func init() {
	ifaces, err := net.Interfaces()
	if err != nil {
		return
	}
	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 {
			continue
		}
		addrs, err := iface.Addrs()
		if err != nil {
			return
		}
		for _, addr := range addrs {
			// bind to private non-loopback ip
			if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() && ipnet.IP.IsPrivate() {
	fmt.Printf("listenerIp: %s\n", listenerIp)
				if ipnet.IP.To4() != nil {
					listenerIp = ipnet.IP.To4()
	//				return
				}
			}
		}
	}
}

func echoHandler(stream network.Stream) {
	for {
		reader := bufio.NewReader(stream)
		str, err := reader.ReadString('\n')
		log.Printf("err: %s", err)
		if err != nil {
			return
		}
		log.Printf("echo: %s", str)
		_, err = stream.Write([]byte(str))
		if err != nil {
			log.Printf("err: %v", err)
			return
		}
	}
}

func main() {
	//getPeerId()

	host := createHost()
	host.SetStreamHandler("/echo/1.0.0", echoHandler)
	defer host.Close()
	remoteInfo := peer.AddrInfo{
		ID:    host.ID(),
		Addrs: host.Network().ListenAddresses(),
	}
	fmt.Println("p2p remoteInfo: ", remoteInfo)

	remoteAddrs, _ := peer.AddrInfoToP2pAddrs(&remoteInfo)
	fmt.Println("p2p addr: ", remoteAddrs[0])

	fmt.Println("press Ctrl+C to quit")
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGTERM, syscall.SIGINT)
	<-ch
}

func getPeerId() {
	//peerJson, err := os.Open("peerId.json")
	//fmt.printf("peerID Json: %s", peerJson.privKey)
	//defer jsonFile.Close();
	//fmt.Printf("listenerIp in getPeerId: %s\n", listenerIp)

	content, err := ioutil.ReadFile("./peerId.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}
	var payload PeerData
	err = json.Unmarshal(content, &payload)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
	//log.Printf("id: %s\n", payload.Id)
	log.Printf("privkey: %s\n", payload.Privkey)
	//log.Printf("pubkey: %s\n", payload.Pubkey)
	//return payload.Privkey

	//peer.IDFromPrivateKey(payload.Privkey)
}

func createHost() host.Host {
	fmt.Printf("listenerIp: %s\n", listenerIp)
        //const name, age = "Kim", 22
	//fmt.Printf("%s is %d years old.\n", name, age)
	//privkey := getPeerId()
	//fmt.Printf("privkey: %s\n", privkey)
        privBin, err := ioutil.ReadFile("key/priv-bin")
        priv, err := crypto.UnmarshalSecp256k1PrivateKey(privBin)

	// testing fixing webrtc multiaddress see libs ~/go/
	rcmgr := &network.NullResourceManager{}
	fmt.Printf("rcmgr: %s\n", rcmgr)
	//	libp2p.Transport(webrtc.New(priv, nil, nil,),
	//	libp2p.Transport(webrtc.New(priv, nil, nil, rcmgr, opts...),

	h, err := libp2p.New(
		//libp2p.Identity(privkey),
		libp2p.Transport(webrtc.New),
		//libp2p.Transport(webrtc.New(priv, nil, nil)),
		libp2p.ListenAddrStrings(
			fmt.Sprintf("/ip4/%s/udp/0/webrtc-direct", listenerIp),
		),
		libp2p.DisableRelay(),
		libp2p.Ping(true),
		libp2p.Identity(priv),
	)
	if err != nil {
		panic(err)
	}

	return h
}
