import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const openingsPerPage = parseInt(searchParams.get("limit")) || 10;

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

    const skip = (page - 1) * openingsPerPage;

    const openings = await db
      .collection("moves")
      .find({})
      .skip(skip)
      .limit(openingsPerPage)
      .toArray();

    const totalOpenings = await db.collection("moves").countDocuments();
    const totalPages = Math.ceil(totalOpenings / openingsPerPage);

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
