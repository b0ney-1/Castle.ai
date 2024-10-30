import clientPromise from "../../../lib/mongodb";

// Handler for GET requests to retrieve a puzzle from the database
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Fetch a puzzle document from the collection
    const puzzle = await db.collection("puzzle").findOne({});

    // Return error if no puzzle is found
    if (!puzzle) {
      return new Response(
        JSON.stringify({ message: "No puzzle found in the collection" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the puzzle data if found
    return new Response(JSON.stringify(puzzle), {
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
