"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Link from "next/link";

export default function OpeningDetails({ params }) {
  const [game, setGame] = useState(null);
  const [openingDetails, setOpeningDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const decodedName = decodeURIComponent(params.name);
    const decodedFen = decodeURIComponent(params.fen);

    setOpeningDetails({
      name: decodedName,
      fen: decodedFen,
    });

    setGame(new Chess(decodedFen));

    // Introduce the opening when the page loads
    introduceOpening(decodedName, decodedFen);
  }, [params]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const introduceOpening = async (name, fen) => {
    const prompt = `Introduce the chess opening "${name}" with the starting position FEN: ${fen}. Provide some context and ask the user to make a move.`;
    await sendMessage(prompt);
  };

  const handleGameChange = async (newGame) => {
    setGame(new Chess(newGame.fen()));
    await provideFeedback(newGame);
  };

  const provideFeedback = async (newGame) => {
    const prompt = `The user just made a move in the ${
      openingDetails.name
    } opening. The current board position is: ${newGame.fen()}. Provide feedback on this move and suggest what the user should consider next.`;
    await sendMessage(prompt);
  };

  const sendMessage = async (prompt) => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from OpenAI API");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputMessage },
    ]);
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  if (!game || !openingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen p-4 gap-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">{openingDetails.name}</h1>
        <div className="w-full max-w-[600px] mb-4">
          <Chessboard
            id="OpeningBoard"
            boardWidth={600}
            position={game.fen()}
            onPieceDrop={(source, target) => {
              const move = game.move({
                from: source,
                to: target,
                promotion: "q",
              });

              if (move === null) return false;
              handleGameChange(game);
              return true;
            }}
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:bg-primary/90 mr-2"
            onClick={() => handleGameChange(new Chess(openingDetails.fen))}
          >
            Reset Position
          </button>
          <Link
            href="/learn"
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md shadow hover:bg-secondary/90"
          >
            Back to Openings
          </Link>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col h-[600px] border rounded-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleInputSubmit} className="p-4 border-t">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="w-full p-2 border rounded-lg"
          />
        </form>
      </div>
    </div>
  );
}
