"use client";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

const openingsPerPage = 10;

export default function Learn() {
  const [openings, setOpenings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [game, setGame] = useState(new Chess());
  const router = useRouter();
  const [selection, setSelection] = useState({
    name: "Select an Opening to learn",
    fen: "start",
  });

  useEffect(() => {
    fetch(`/api/openings?page=${page + 1}&limit=${openingsPerPage}`)
      .then((res) => res.json())
      .then((data) => {
        setOpenings(data.openings);
        setTotalPages(Math.ceil(data.total / openingsPerPage));
      })
      .catch((error) => console.error("Error fetching openings:", error));
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleGameChange = (newGame) => {
    setGame(new Chess(newGame.fen()));
  };

  const handleOpeningClick = (opening) => {
    const encodedName = encodeURIComponent(opening.name);
    const encodedFen = encodeURIComponent(opening.fen);
    router.push(`/learn/${encodedName}/${encodedFen}`);
  };

  return (
    <div className="flex flex-row md:flex-row w-full h-full max-w-7xl mx-auto p-4 gap-8">
      <div className="w-full md:w-1/2 flex items-center justify-center align-items-center h-full mx-auto">
        <div className="m-auto flex items-center justify-center">
          <Chessboard
            id="BasicBoard"
            boardWidth={650}
            className="w-full max-w-[700px]"
            position={game.fen()}
            onMove={() => handleGameChange(game)}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-center justify-center">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:bg-primary/90"
            onClick={() => handleOpeningClick(selection)}
          >
            Start : {selection.name}
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-4 mb-4">
          {openings.map((opening) => (
            <li
              key={opening.id}
              className="bg-white shadow rounded-lg p-4 transition-transform transform-gpu hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <h3
                className="text-md font-semibold mb-2"
                onClick={() => {
                  try {
                    console.log(opening.fen);
                    const newGame = new Chess(opening.fen);
                    handleGameChange(newGame);
                    setSelection({
                      name: opening.name,
                      fen: opening.fen,
                    });
                    console.log(newGame.fen());
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                {opening.name}
              </h3>
              {/* <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-primary cursor-pointer">
                {opening.moves}
              </p> */}
            </li>
          ))}
        </ul>
        <Pagination className="mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                as={Link}
                key={page}
                href={`/learn?page=${Math.max(0, page - 1)}`}
                onClick={() => handlePageChange(Math.max(0, page - 1))}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {totalPages > 0 &&
              [...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    as={Link}
                    href={`/learn?page=${index}`}
                    onClick={() => handlePageChange(index)}
                    isActive={page === index}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {totalPages > 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                as={Link}
                href={`/learn?page=${page + 1}`}
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === totalPages - 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
