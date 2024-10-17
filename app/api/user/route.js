import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { authenticateToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

async function handler(req) {
  console.log("User API route called");
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  console.log("Received ID:", _id);

  if (!_id) {
    console.log("Missing ID parameter");
    return NextResponse.json(
      { message: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    console.log("Attempting to find user with ID:", _id);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.email);
    return NextResponse.json({ username: user.email, _id: user._id });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = authenticateToken(handler);
