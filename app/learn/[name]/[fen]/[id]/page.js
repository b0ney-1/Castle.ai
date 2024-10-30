import OpeningDetailsClient from "./OpeningDetailsClient";
import { use } from "react";

// Async function to unwrap dynamic route parameters
async function getParams(params) {
  const { name, fen, id } = await params;

  return {
    name,
    fen,
    id,
  };
}

// Main page component that renders OpeningDetailsClient with dynamic params
export default async function Page({ params }) {
  const unwrappedParams = await getParams(params);

  return (
    <OpeningDetailsClient
      name={unwrappedParams.name}
      fen={unwrappedParams.fen}
      id={unwrappedParams.id}
    />
  );
}
