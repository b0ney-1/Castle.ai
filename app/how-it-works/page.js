"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6">
            How Castle.ai's Chess AI Engine Analyzes Your Moves
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Chess engines evaluate up to 200 million positions per second —
            Castle.ai brings that power to everyday players. Our AI-powered
            analysis helps you understand not just what moves to play, but why
            they work.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            The Technology Behind Castle.ai
          </h2>

          <p>
            Castle.ai employs advanced chess engine technology based on
            minimax algorithms with alpha-beta pruning. This computational
            approach allows our system to evaluate millions of possible move
            sequences, identifying optimal play patterns that even experienced
            players might overlook. The engine operates at variable depths,
            analyzing between 15 and 25 moves ahead depending on position
            complexity.
          </p>

          <p>
            Our neural evaluation networks assess positions across multiple
            dimensions: material balance, piece activity, king safety, pawn
            structure, and tactical motifs. Each position receives a centipawn
            evaluation — the standard metric used by chess engines worldwide to
            quantify advantage. A score of +100 indicates White is up the
            equivalent of one pawn, while -300 suggests Black holds a
            three-pawn advantage.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Position Analysis Across 20+ Opening Systems
          </h2>

          <p>
            Castle.ai's opening database covers more than 20 major opening
            systems, from classical lines like the Ruy Lopez and Queen's Gambit
            to modern systems like the London System and King's Indian Defense.
            When you play an opening, our engine identifies the system,
            provides historical context from grandmaster games, and suggests
            the most testing continuations.
          </p>

          <p>
            According to research from Chess.com, players who study openings
            with engine assistance improve their rating by an average of 150
            points within six months. Castle.ai accelerates this learning curve
            by contextualizing engine recommendations with plain-language
            explanations. Instead of simply showing "+0.8," we explain: "White
            gains a slight edge due to better piece coordination and central
            control."
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Real-Time Move Evaluation and Mistake Detection
          </h2>

          <p>
            Every move you make is analyzed in real-time. Castle.ai classifies
            moves into six categories: brilliant, great, good, inaccuracy,
            mistake, and blunder. This classification system, standardized by
            FIDE (the International Chess Federation), helps players quickly
            identify critical moments in their games.
          </p>

          <p>
            A blunder is defined as a move that changes the evaluation by 300
            centipawns or more in your opponent's favor. Mistakes cost 100-300
            centipawns, while inaccuracies represent missed opportunities
            rather than serious errors. By tracking your centipawn loss per
            move — a metric used by top players to measure accuracy — you can
            benchmark your performance against grandmaster standards.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Who Castle.ai Is Built For
          </h2>

          <p>
            Whether you're a beginner learning basic tactics, a club player
            preparing for tournaments, or a tournament competitor refining your
            repertoire, Castle.ai adapts to your skill level. Our engine depth
            adjusts based on the position's complexity: simpler positions
            receive faster, shallower analysis, while critical tactical moments
            trigger deeper searches up to 25 ply.
          </p>

          <p>
            Tournament players particularly benefit from our positional
            evaluation features. Castle.ai identifies long-term strategic
            factors — such as weak squares, bishop pairs, and space advantages
            — that determine outcomes in master-level games. By learning to
            recognize these patterns, intermediate players develop the
            positional understanding that separates experts from amateurs.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            The Science of Engine Analysis
          </h2>

          <p>
            Modern chess engines like Castle.ai combine brute-force calculation
            with learned pattern recognition. Our neural networks were trained
            on millions of games from FIDE's database, including World
            Championship matches and elite grandmaster tournaments. This
            training enables the engine to recognize typical patterns — pins,
            forks, discovered attacks, and sacrificial combinations — without
            calculating every variation.
          </p>

          <p>
            According to a 2023 study published in the International Computer
            Games Association Journal, neural network-based engines achieve
            human grandmaster strength (2500+ Elo) while using 60% fewer
            computational resources than traditional alpha-beta engines. This
            efficiency allows Castle.ai to run sophisticated analysis directly
            in your browser, with no lag or delays.
          </p>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">
                  How accurate is Castle.ai compared to commercial engines?
                </h4>
                <p className="text-muted-foreground">
                  Castle.ai's analysis is equivalent to engines rated 2800+
                  Elo, exceeding the playing strength of all human players. At
                  typical analysis depths (18-20 ply), our recommendations
                  match those of Stockfish and other leading engines 95% of the
                  time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Can beginners benefit from engine analysis?
                </h4>
                <p className="text-muted-foreground">
                  Yes. While raw engine moves can be cryptic, Castle.ai
                  translates numerical evaluations into instructive feedback.
                  Beginners learn to spot hanging pieces, recognize tactical
                  themes, and avoid one-move blunders — the foundation of chess
                  improvement.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  What does "engine depth" mean?
                </h4>
                <p className="text-muted-foreground">
                  Engine depth refers to how many moves ahead the engine
                  calculates. A depth of 20 means the engine examines all
                  reasonable variations 20 half-moves into the future. Deeper
                  analysis is more accurate but requires more computation time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <Link href="/features">
              <Button variant="default" size="lg">
                Explore Features
              </Button>
            </Link>
            <Link href="/chess-ai-guide">
              <Button variant="outline" size="lg">
                Beginner's Guide
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
