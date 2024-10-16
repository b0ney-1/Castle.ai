"use client";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function Puzzle() {
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [userMove, setUserMove] = useState("");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    fetch("/api/puzzles")
      .then((res) => res.json())
      .then((data) => {
        setPuzzles(data.entries);
        if (data.entries.length > 0) {
          setGame(new Chess(data.entries[0].fen));
        }
      })
      .catch((error) => console.error("Error fetching puzzles:", error));
  }, []);

  const handleMove = (move) => {
    if (game.move(move)) {
      setGame(new Chess(game.fen()));
      setUserMove(move.san);
      checkMove();
    }
  };

  const checkMove = () => {
    setMessage(
      "Move made. In a complete implementation, this would check if the move is correct."
    );
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      const newIndex = currentPuzzleIndex + 1;
      setCurrentPuzzleIndex(newIndex);
      setGame(new Chess(puzzles[newIndex].fen));
      setUserMove("");
      setMessage("");
      setHint("");
    } else {
      setMessage("You've completed all puzzles!");
    }
  };

  const resetPuzzle = () => {
    if (puzzles[currentPuzzleIndex]) {
      setGame(new Chess(puzzles[currentPuzzleIndex].fen));
      setUserMove("");
      setMessage("");
      setHint("");
    }
  };

  const getHint = async () => {
    setIsLoadingHint(true);
    const currentPuzzle = puzzles[currentPuzzleIndex];
    const prompt = `Given the chess position with FEN: ${currentPuzzle.fen}, provide a hint for the best move without explicitly stating the move. The hint should guide the player's thinking without giving away the solution.`;

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hint");
      }

      const data = await response.json();
      setHint(data.response);
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHint("Sorry, I couldn't generate a hint at this time.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto p-4 gap-8">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Chessboard
          id="PuzzleBoard"
          boardWidth={650}
          position={game.fen()}
          onPieceDrop={(source, target) => {
            handleMove({
              from: source,
              to: target,
              promotion: "q", // always promote to queen for simplicity
            });
            return true;
          }}
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Chess Puzzle</h2>
        {puzzles.length > 0 ? (
          <>
            <p className="mb-2">
              <strong>Puzzle:</strong> {currentPuzzleIndex + 1} /{" "}
              {puzzles.length}
            </p>
            <p className="mb-2">
              <strong>Game ID:</strong> {puzzles[currentPuzzleIndex].gameId}
            </p>
            <p className="mb-4">
              <strong>FEN:</strong> {puzzles[currentPuzzleIndex].fen}
            </p>
            <p className="mb-2">
              <strong>Your last move:</strong> {userMove || "None"}
            </p>
            <p className="mb-4 text-lg font-semibold">{message}</p>
            {hint && (
              <div className="mb-4 p-4 bg-secondary/10 rounded-md">
                <strong>Hint:</strong> {hint}
              </div>
            )}
            <div className="flex gap-4 mb-4">
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:bg-primary/90"
                onClick={resetPuzzle}
              >
                Reset Puzzle
              </button>
              <button
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md shadow hover:bg-secondary/90"
                onClick={nextPuzzle}
              >
                Next Puzzle
              </button>
              <button
                className="bg-accent text-accent-foreground px-4 py-2 rounded-md shadow hover:bg-accent/90"
                onClick={getHint}
                disabled={isLoadingHint}
              >
                {isLoadingHint ? "Loading Hint..." : "Get Hint"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading puzzles...</p>
        )}
      </div>
    </div>
  );
}
