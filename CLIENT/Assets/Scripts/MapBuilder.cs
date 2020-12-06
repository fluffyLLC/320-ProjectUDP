using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class MapBuilder : MonoBehaviour
{
    public Tile testTile;
    public Tilemap testMap;
    public int mapWidth;
    public int mapHeight;

    // Start is called before the first frame update
    void Start()
    {
        for (int x = 0; x < mapWidth; x++) {
            for (int y = 0; y < mapHeight; y++)
            {
                testMap.SetTile(new Vector3Int(x, -y, 0), testTile);
            }
        }
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
