using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pawn : NetworkObject
{

    new public static string classID = "PAWN"; //new overrides property from Network object

    public bool canPlayerControl = false;

	Vector3 velocity = new Vector3();
    void FixedUpdate()
    {
		if (canPlayerControl) {
			int moveX = (int)Input.GetAxisRaw("Horizontal");

			velocity.x = Accelerate(velocity.x, moveX);

			transform.position += new Vector3(velocity.x, 0, 0) * Time.fixedDeltaTime;
		}
        
    }

	float Accelerate(float vel, float acc)
	{
		//let 

		if (acc != 0)
		{
			//console.log("accelerate true");
			vel += acc * Time.fixedDeltaTime;
		}
		else
		{
			//no input, slow down
			if (vel > 0)
			{//moveing right...
				acc = -1;//accelerate left
				vel += acc * Time.fixedDeltaTime;
				if (vel < 0) vel = 0;
			}

			if (vel < 0)
			{//moving left...
				acc = 1;//accelerate right
				vel += acc * Time.fixedDeltaTime;
				if (vel > 0) vel = 0;
			}

		}

		return vel;

	}


	public override int Deserialize(Buffer packet)
    {
        return base.Deserialize(packet);
    }
}
