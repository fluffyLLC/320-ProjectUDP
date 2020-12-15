using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class MapBuilder : NetworkObject
{
    new public static string classID = "MAPG";



    public Tile[] testTiles;
    public Tilemap testMap;
    public int mapWidth;
    public int mapHeight;
    [HideInInspector]
    public byte[] tileIDs;



    // Start is called before the first frame update
    void Start()
    {
        //GenerateMap();

    }

    private void GenerateMap()
    {
        int i = 0;
        for (int y = 0; y < mapHeight; y++)
        {
            for (int x = 0; x < mapWidth; x++)
             {
                testMap.SetTile(new Vector3Int(x, -y, 0), testTiles[tileIDs[i]-1]);//set the tile equal to the tile in the tile ID slot at the relevent location
                i++;
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public override int Deserialize(Buffer packet) {
        
       // print("decerial");

        //TODO: double check that all tile data has been sent
        //TODO: set the Network ID for the map

        int tileDataOffset = 2;//the number of bytes in that the tile data starts. derived from the protocall

        mapWidth = packet.ReadInt16BE();//get map width
        print("map width " + mapWidth);
        print(packet.Length);

        int tileNum = packet.Length - tileDataOffset;//get number of tiles
        print("TileNum " + tileNum);

        mapHeight = tileNum / mapWidth;//get map height
        print("map Height " + mapHeight);

        tileIDs = new byte[tileNum];//create array to store tile state





        for (int i = 0; i < tileNum; i++) {
            tileIDs[i] = packet.ReadUInt8(i + tileDataOffset);
            //print(tileIDs[i]);
        }

        GenerateMap();

        return 0;
    }




}
