import OpeningDetailsClient from "./OpeningDetailsClient";
import { use } from "react";

// This should be async to properly handle dynamic params
async function getParams(params) {
  const { name, fen, id } = await params;

  return {
    name,
    fen,
    id,
  };
}

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
