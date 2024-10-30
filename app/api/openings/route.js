import clientPromise from "../../../lib/mongodb";

// Handler for GET requests to retrieve a paginated list of openings
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1; // Default to page 1 if not provided
  const openingsPerPage = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page if not provided

  // Validate that page and limit parameters are positive integers
  if (page < 1 || openingsPerPage < 1) {
    return new Response(
      JSON.stringify({ message: "Invalid page or limit parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const skip = (page - 1) * openingsPerPage; // Calculate the number of items to skip based on the current page

    // Retrieve the openings for the current page with the specified limit
    const openings = await db
      .collection("moves")
      .find({})
      .skip(skip)
      .limit(openingsPerPage)
      .toArray();

    const totalOpenings = await db.collection("moves").countDocuments(); // Get the total count of openings
    const totalPages = Math.ceil(totalOpenings / openingsPerPage); // Calculate the total number of pages

    // Return paginated results along with page details
    return new Response(
      JSON.stringify({
        openings,
        currentPage: page,
        totalPages,
        openingsPerPage,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle internal server error and return a generic error message
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
