import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { authenticateToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

// Handler for GET requests to retrieve user information by ID
async function handler(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  // Validate that an ID parameter is provided
  if (!_id) {
    return NextResponse.json(
      { message: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Find user in the database by ID
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });

    // Return error if user not found
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user's email and ID if found
    return NextResponse.json({ username: user.email, _id: user._id });
  } catch (error) {
    // Handle internal server error and return a generic error message
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Export the authenticated GET handler
export const GET = authenticateToken(handler);
