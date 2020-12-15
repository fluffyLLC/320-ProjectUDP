using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Frag
{
    public byte fragID;
    public uint totalLength; 
    public List<Buffer> unsortedFrag = new List<Buffer>();
    public Buffer combinedFrag = Buffer.Alloc(0);
    public bool[] recivedBuffers;


    public Frag(Buffer fragPacket) {
       // Debug.Log(fragPacket);
        fragID = fragPacket.ReadUInt8(9);
        //Debug.Log(fragID);
        ProcessFrag(fragPacket);

    }

    //store all frag packets until we have all the frag packets for a given packet
    //write app packets to the buffer?
    //we heve to be able to handle dupe packets and packets out of order

    public Buffer ProcessFrag(Buffer fragPacket) { //process and stores the fragPacket, returns a complete packet if the packet is done
        int headerLength = 18;
        if (fragPacket.Length < headerLength) return Buffer.Alloc(0);//check that all nessicery contents are present

        int order = fragPacket.ReadUInt16BE(10);
        uint totalOffset = fragPacket.ReadUInt32BE(12);//this contains either the content offset or the content total
        int contentLength = fragPacket.ReadUInt16BE(16);



        if(fragPacket.Length < headerLength + contentLength) return Buffer.Alloc(0);//packet was corrupted/not all data was sent/should not ack

        if (combinedFrag.Length == 0) { //if we have yet to recive the first frag packet fot this packet
            if (order == 1)//if this is the first paket run setup
            {
                int numExpected = (int)Mathf.Ceil((float)totalOffset / (float)contentLength);
                Debug.Log(totalOffset); /// (float)contentLength);
                Debug.Log("packets expected: " + numExpected);
                recivedBuffers = new bool[numExpected];//content length should always be the same as the Max content length on the first packet. We can use this to determin the number of expected frags
                recivedBuffers[0] = true;//we have recived the first packet
                totalLength = totalOffset;//store the total length
                combinedFrag = Buffer.Alloc(totalOffset);//create a buffer where we can combine the contents of all recived frag packets
                
                combinedFrag.WriteRange(fragPacket, headerLength, contentLength);//write to combined frag

                //if we have unsorted/out of order packets process them.
                if (unsortedFrag.Count > 0) {
                    foreach (Buffer b in unsortedFrag) {
                        ProcessFrag(b);   
                    }
                    
                    if (CheckFragComplete()) return combinedFrag;// check if all frag packets have been processed

                }

                return Buffer.Alloc(0);//return out of the function

            }
            else {//if this is not the first packet ie. we have recived them out of order 
                unsortedFrag.Add(fragPacket);
            }

        }
        else { //if we have recived the first packet
            //write contents to frag
            combinedFrag.WriteRange(fragPacket, headerLength, contentLength, (int)totalOffset);
            //register packet as recived
            recivedBuffers[order-1] = true;
            //check if we have recived all packets 
            if (CheckFragComplete()) return combinedFrag;
            //return out of the function
            //return Buffer.Alloc(0);
        }

        return Buffer.Alloc(0);
    }


    public bool CheckFragComplete() {
        bool fragComplete = true;
        for (int i = 0; i < recivedBuffers.Length; i++)
        {
            if (recivedBuffers[i] == null || !recivedBuffers[i])
            {
                fragComplete = false;
            }
        }
        return fragComplete;
    }
   



}
