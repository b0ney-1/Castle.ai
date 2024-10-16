"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Link from "next/link";
import styles from "../page.module.css";

function Play() {
  const [game, setGame] = useState(new Chess());
  const [mode, setMode] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);

  const makeAMove = useCallback(
    (move) => {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setMoveHistory((prevMoveHistory) => [
          ...prevMoveHistory.slice(0, moveIndex + 1),
          gameCopy.fen(),
        ]);
        setMoveIndex((prevIndex) => prevIndex + 1);
      }
      return result;
    },
    [game, moveIndex]
  );

  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      if (!gameStarted || game.turn() !== "w") return false;
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Optional promotion
      });
      if (move === null) return false; // Invalid move

      // Trigger AI move after the player's move
      setTimeout(handleAIMove, 300);
      return true; // Indicate the drop was successful
    },
    [gameStarted, game, makeAMove]
  );

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleGameStart = () => {
    const newGame = new Chess();
    setGameStarted(true);
    setGame(newGame);
    setMoveHistory([newGame.fen()]);
    setMoveIndex(0);
  };

  const handleGameExit = () => {
    setGameStarted(false);
    setGame(new Chess());
    setMoveHistory([]);
    setMoveIndex(0);
  };

  const handlePrevMove = () => {
    if (mode !== "easy" || moveIndex <= 0) return;
    setMoveIndex((prevIndex) => prevIndex - 1);
    setGame(new Chess(moveHistory[moveIndex - 1]));
  };

  const handleNextMove = () => {
    if (mode !== "easy" || moveIndex >= moveHistory.length - 1) return;
    setMoveIndex((prevIndex) => prevIndex + 1);
    setGame(new Chess(moveHistory[moveIndex + 1]));
  };

  const getAIMove = useCallback(async () => {
    if (game.turn() !== "b") return; // Ensure it's black's turn

    try {
      const prompt = `You are a chess AI assistant. The current game state in FEN notation is: ${game.fen()}. The difficulty level is set to ${mode}. Please provide the next best move for black in standard algebraic notation (e.g., "e4", "Nf3"). For ${mode} difficulty, ${
        mode === "easy"
          ? "make a random legal move"
          : mode === "medium"
          ? "make a moderately strong move"
          : "make the best move possible"
      }.`;

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI move");
      }

      const data = await res.json();
      const aiMove = data.response.trim();

      // Validate the AI move
      const possibleMoves = game.moves();
      if (possibleMoves.includes(aiMove)) {
        makeAMove(aiMove);
      } else {
        console.error("Invalid AI move:", aiMove);
        // Fallback to a random move if the AI provides an invalid move
        const randomMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        makeAMove(randomMove);
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      // Handle error (e.g., show a message to the user)
    }
  }, [game, makeAMove, mode]);

  const handleAIMove = useCallback(() => {
    if (!gameStarted || game.turn() !== "b") return;
    getAIMove();
  }, [gameStarted, game, getAIMove]);

  useEffect(() => {
    if (gameStarted && game.turn() === "b") {
      handleAIMove();
    }
  }, [gameStarted, game, handleAIMove]);

  return (
    <div className={styles.playContainer}>
      <div className={styles.navBar}>
        <ul>
          <li>
            <Link href="#">Admin</Link>
          </li>
          <li>
            <Link href="/">Sign out</Link>
          </li>
        </ul>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.leftSection}>
          <Chessboard
            id="BasicBoard"
            boardWidth={700}
            position={game.fen()}
            onPieceDrop={onDrop}
          />
        </div>
        <div className={styles.rightSection}>
          <p>Select Difficulty: {mode}</p>
          <div className={styles.modeSection}>
            <button
              className={mode === "easy" ? styles.ButtonWhite : styles.Button}
              onClick={() => handleModeChange("easy")}
            >
              Easy
            </button>
            <button
              className={mode === "medium" ? styles.ButtonWhite : styles.Button}
              onClick={() => handleModeChange("medium")}
            >
              Medium
            </button>
            <button
              className={mode === "hard" ? styles.ButtonWhite : styles.Button}
              onClick={() => handleModeChange("hard")}
            >
              Hard
            </button>
          </div>
          <p>Match Controls: {gameStarted ? "In Progress" : "Not Started"}</p>
          <div className={styles.buttonSection}>
            <button className={styles.Button} onClick={handleGameStart}>
              Reset
            </button>
            <button className={styles.Button} onClick={handleGameExit}>
              Resign
            </button>
            <button
              className={styles.Button}
              onClick={handlePrevMove}
              disabled={mode !== "easy" || moveIndex <= 0}
            >
              Previous Move
            </button>
            <button
              className={styles.Button}
              onClick={handleNextMove}
              disabled={mode !== "easy" || moveIndex >= moveHistory.length - 1}
            >
              Next Move
            </button>
          </div>
          <p>Moves:</p>
          <div className={styles.movesSection}>
            {moveHistory.map((fen, index) => (
              <div
                key={index}
                className={index === moveIndex ? styles.currentMove : ""}
              >
                {index + 1}. {index % 2 === 0 ? "White" : "Black"} - {fen}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Play;
