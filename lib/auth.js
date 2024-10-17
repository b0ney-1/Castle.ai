import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const authenticateToken = (handler) => async (req) => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return handler(req);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
};
