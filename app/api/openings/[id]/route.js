// app/api/openings/[id]/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Handler for GET requests to retrieve an opening by ID
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const { id } = params;

    // Find the opening in the database by ID
    const opening = await db.collection("moves").findOne({
      _id: new ObjectId(id),
    });

    // Return error if the opening is not found
    if (!opening) {
      return new Response(JSON.stringify({ error: "Opening not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the opening data if found
    return new Response(JSON.stringify({ opening }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle internal server errors and return a generic error message
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
