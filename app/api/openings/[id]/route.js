// app/api/openings/[id]/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const { id } = params;

    console.log("Fetching opening with ID:", id); // Debug log

    const opening = await db.collection("moves").findOne({
      _id: new ObjectId(id),
    });

    if (!opening) {
      console.log("Opening not found for ID:", id); // Debug log
      return new Response(JSON.stringify({ error: "Opening not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Opening found:", opening); // Debug log
    return new Response(JSON.stringify({ opening }), {
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
