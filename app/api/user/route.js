import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  console.log("Received _id:", _id);

  if (!_id) {
    console.log("Missing _id parameter");
    return new Response(JSON.stringify({ message: "Missing _id parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    console.log("Attempting to find user with _id:", _id);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });

    if (!user) {
      console.log("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("User found:", user.email);
    return new Response(JSON.stringify({ username: user.email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
