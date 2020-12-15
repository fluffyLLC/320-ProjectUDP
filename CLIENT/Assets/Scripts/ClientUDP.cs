using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;
using UnityEngine.UI;

public class ClientUDP : MonoBehaviour
{
    public string serverHOST = "127.0.0.1";
    public ushort serverPORT = 320;


    private Dictionary<byte, Frag> frags = new Dictionary<byte, Frag>(); //TODO add timeout for removing old frags

    UdpClient sock = new UdpClient();
    private static ClientUDP _singleton;
    public static ClientUDP singleton{
        get {
            return _singleton;
        }

        private set { _singleton = value; }
    
    }
    //ack = agknowlage // most recent ball update packet that has been recieved
    uint ackBallUpdate = 0;

    public Transform Ball;


    void Start()
    {
        ListenForPackets();

        if (singleton != null)
        {
            Destroy(gameObject);
            

        }
        else {
            singleton = this;
            DontDestroyOnLoad(gameObject);

            IPEndPoint ep = new IPEndPoint(IPAddress.Parse(serverHOST), serverPORT);
            sock = new UdpClient(ep.AddressFamily);
            sock.Connect(ep);

            ListenForPackets();

            Buffer packet = Buffer.From("JOIN");
            SendPacket(packet);


        }

        
    }

    async void ListenForPackets() {
        UdpReceiveResult res;
        while (true)
        {
            try
            {
                 res = await sock.ReceiveAsync();
            }
            catch {
                break;
            }

            Buffer packet = Buffer.From(res.Buffer);


            ProcessPacket(packet);
        }


    }

    private void ProcessPacket(Buffer packet)
    {
        //print("packet recieved");
        if (packet.Length < 9) return;

        string id = packet.ReadString(0, 4);
        //print(id + " packet recieved");

        byte ack = packet.ReadUInt8(4);
        // print(ack);

        uint packetID = packet.ReadUInt32BE(5);
        //print(packetID);

        if (ack == 1 && id != "FRAG") SendPacket(PacketBuilder.AckPacket(packetID));

        //TODO: add a length check in order to make sure we got the whole packet // a check for corruption would also be appropriate

        //TODO: process Header for frag annd ACK packets


        switch (id) {
            case "FRAG":

                if (packet.Length < 17) return;
                
                byte fragID = packet.ReadUInt8(9);

                if (frags.ContainsKey(fragID))
                {
                    Buffer completePacket = frags[fragID].ProcessFrag(packet);

                    if (completePacket.Length > 0)
                    {
                        //print("completed packet returntd");
                        frags.Remove(fragID);//remove the frag packet in csae th efrag ID gets reused
                        SendPacket(PacketBuilder.AckPacket(packetID));//send ack for final frag packet
                        ProcessPacket(completePacket);//process the complete frag packet
                        
                    }
                    else {
                        SendPacket(PacketBuilder.AckPacket(packetID, true));

                    }


                }
                else {
                    frags.Add(fragID, new Frag(packet));
                    SendPacket(PacketBuilder.AckPacket(packetID,true));
                    //frags[fragID]
                }

                break;

            case "PAWN":
               // if (packet.Length < 5) return;

               // byte networkID = packet.ReadUInt8(4);

                //NetworkObject obj = NetworkObject.GetObjectByNetworkID(networkID);
                //if (obj) {
                    //if (obj.classID != "PAWN") return; 
                 //   Pawn P = (obj as Pawn);
                   // if (P != null) P.canPlayerControl = true;
               // }

                break;
            case "MAPG"://we are currently using our packet type as our classID, we may want to decouple this in the future 
                if (packet.Length < 11) return;

                NetworkObject obj = ObjectRegistry.SpawnFrom(id);

                obj.Deserialize(packet.Slice(9));
                

                print("map recived");


                break;

        }

        


    }

    private void ProcessPacketREPL(Buffer packet) //not recognised in protocall, this function is here for refrence
    {
        if (packet.Length < 5) return;
       // print(packet);
        int replType = packet.ReadUInt8(4);

        if (replType != 1 && replType != 2 && replType != 3) return;
        //print("repl type" + replType);

        int offset = 5;

        //int loopCap = 0;
        while (offset <= packet.Length)
        {

            //print("offset: " + offset + "packetL: " + packet.Length); 

            //print("ID: "+ networkID);
            int networkID = 0;


            switch (replType)
            {

                case 1: // create:
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);
                    //print("REPL packet CREATE recived...");
                    string classID = packet.ReadString(offset, 4);


                    //check network ID

                    if (NetworkObject.GetObjectByNetworkID(networkID) != null) return;
                    
                    NetworkObject obj = ObjectRegistry.SpawnFrom(classID);

                    if (obj == null) return;//error class ID not found
                    //print(classID);
                    offset += 4; //trim out ClassID off the beginning of packet data

                    Buffer chunk = packet.Slice(offset);
                    //print(chunk);

                    offset += obj.Deserialize(chunk);
                    NetworkObject.AddObject(obj);


                    break;
                case 2: // update:
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);


                    NetworkObject obj2 = NetworkObject.GetObjectByNetworkID(networkID);
                    
                    if (obj2 == null) return;
                    //print("update recived");

                    offset += 4; //trim out ClassID off the beginning of packet data
                    offset += obj2.Deserialize(packet.Slice(offset));
                    
                    //lookup object, using network ID

                    //update it

                    break;
                case 3: // delete:
                    if (packet.Length < offset + 1) return;
                    networkID = packet.ReadUInt8(offset);

                    NetworkObject obj3 = NetworkObject.GetObjectByNetworkID(networkID);
                    if (obj3 == null) return;

                    //offset += 4;
                    NetworkObject.RemoveObject(networkID);//remove obj from list of network objects
                    Destroy(obj3.gameObject);// remove obj from game
                    //lookup object, using network ID
                    //update it

                    offset++;

                    break;

            }

            //print("offset: " + offset + "packetL: " + packet.Length);
            //loopCap++;
           // if(loopCap > 255)break;
            //break;
        }
    }

    

    async public void SendPacket(Buffer packet) {
        if (sock == null) return;
        if (packet == null) return;
        //Buffer packet = Buffer.From("Hello world!");
        if (!sock.Client.Connected) return;
        

        await sock.SendAsync(packet.bytes, packet.bytes.Length);

    }

    void Update()
    {
        
    }
}
