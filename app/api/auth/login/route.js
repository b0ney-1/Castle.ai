import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // GTG
    const client = await clientPromise;

    console.log("MongoDB Client:", client);
    const db = client.db(process.env.MONGO_DB);

    if (!db) {
      throw new Error("Failed to get database instance");
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generated successfully");

    return new Response(
      JSON.stringify({ token, userId: user._id, message: "Login successful" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        message: "Server error",
        error: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
      }
    );
  }
}
