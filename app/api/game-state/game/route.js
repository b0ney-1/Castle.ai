import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { authenticateToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";

// Handler for GET requests to retrieve saved game state and last game timestamp for a specific user
async function getHandler(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  // Validate that a user ID is provided
  if (!userId) {
    return NextResponse.json(
      { message: "Missing user id parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Retrieve user data based on user ID
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    // Return error if user not found
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return saved game state and last game timestamp if found
    return NextResponse.json({
      savedGameState: user.savedGameState || null,
      lastGameTimestamp: user.lastGameTimestamp || null,
    });
  } catch (error) {
    // Handle internal server error
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// Handler for POST requests to save the current game state and timestamp for a specific user
async function postHandler(req) {
  try {
    const { userId, gameState } = await req.json();

    // Validate that both user ID and game state are provided
    if (!userId || !gameState) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Update the user's saved game state and timestamp in the database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          savedGameState: gameState,
          lastGameTimestamp: new Date().toISOString(),
        },
      }
    );

    // Return error if user not found
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return success message if game state is saved successfully
    return NextResponse.json(
      { message: "Game state saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle internal server error
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// Export authenticated GET and POST handlers
export const GET = authenticateToken(getHandler);
export const POST = authenticateToken(postHandler);
