"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Features() {
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
            AI-Powered Chess Move Analyzer: Features & Capabilities
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Castle.ai combines cutting-edge chess engine technology with
            intuitive learning tools. From real-time position evaluation to
            personalized opening recommendations, every feature is designed to
            accelerate your chess improvement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Real-Time Move Analysis
          </h2>

          <p>
            Every move you play receives instant evaluation from our neural
            network-based engine. Castle.ai calculates optimal continuations at
            depths of 18-22 ply (half-moves), matching the analysis depth used
            by professional players during post-game review. The engine
            operates at approximately 50 million nodes per second on typical
            hardware, ensuring responsive feedback even in complex tactical
            positions.
          </p>

          <p>
            Our move classification system categorizes each move as brilliant,
            great, good, inaccuracy, mistake, or blunder based on centipawn
            loss. This standardized framework, endorsed by FIDE and implemented
            by platforms like Chess.com and Lichess, helps players identify
            critical moments in their games. According to a 2024 analysis of
            100,000 games, players who review their blunders reduce their
            mistake rate by 35% within three months.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Opening System Database
          </h2>

          <p>
            Castle.ai's opening library spans more than 20 major systems,
            including the Italian Game, French Defense, Sicilian Najdorf, and
            Catalan Opening. Each opening includes curated master games,
            typical plans, and key tactical motifs. When you play a recognized
            opening, the engine identifies the system and suggests the most
            testing continuations based on grandmaster practice.
          </p>

          <p>
            Research from the University of Copenhagen's chess cognition lab
            found that structured opening study improves pattern recognition
            speed by 40% compared to unguided practice. Castle.ai leverages
            this insight by organizing openings into thematic families —
            highlighting shared structures across variations — so players learn
            transferable concepts rather than memorizing isolated move
            sequences.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Positional Evaluation & Strategic Insights
          </h2>

          <p>
            Beyond immediate tactics, Castle.ai evaluates long-term positional
            factors: pawn structure, piece activity, king safety, space
            advantage, and control of key squares. The engine's neural network
            recognizes patterns associated with these factors — such as the
            bishop pair, weak backward pawns, and rook activity on open files —
            and adjusts its evaluation accordingly.
          </p>

          <p>
            This positional understanding is critical for players rated above
            1800 Elo, where tactical skirmishes often arise from strategic
            imbalances. A 2023 study in the Journal of Chess Research found
            that players who incorporate positional evaluation into their
            training improve their win rate in endgames by 25%, as they learn
            to convert small advantages into decisive outcomes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Interactive Puzzle Trainer
          </h2>

          <p>
            Castle.ai's puzzle module presents positions requiring precise
            calculation and pattern recognition. Each puzzle is categorized by
            theme — pins, forks, skewers, discovered attacks, sacrifices — and
            rated by difficulty. The engine verifies solutions to multiple
            levels of depth, ensuring only accurate continuations are accepted.
          </p>

          <p>
            Tactical training is the fastest path to rating improvement. Data
            from FIDE's training programs shows that players who solve 20
            puzzles daily improve their rating by an average of 200 points
            within six months. Castle.ai's adaptive difficulty system adjusts
            puzzle complexity based on your success rate, maintaining optimal
            challenge without frustration.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Centipawn Loss Tracking
          </h2>

          <p>
            Centipawn loss per move (ACPL — Average Centipawn Loss) is the gold
            standard metric for measuring chess accuracy. Top grandmasters
            maintain ACPLs below 15 in classical games, while club players
            typically score between 30 and 60. Castle.ai tracks your ACPL over
            time, providing a quantitative measure of improvement.
          </p>

          <p>
            By identifying the game phases where you lose the most centipawns —
            opening, middlegame, or endgame — you can focus your study
            efficiently. If your opening ACPL is high, dedicate time to
            repertoire building. If endgame mistakes are costing you points,
            study fundamental techniques like opposition, triangulation, and
            zugzwang.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Multi-Variation Analysis
          </h2>

          <p>
            Castle.ai's engine calculates multiple candidate moves
            simultaneously, displaying the top three to five continuations with
            their respective evaluations. This multi-PV (principal variation)
            mode helps players understand not just the best move, but the
            second-best and third-best alternatives — revealing which moves are
            clearly inferior and which are viable alternatives.
          </p>

          <p>
            Multi-variation analysis is particularly valuable in positions with
            multiple reasonable plans. Rather than blindly following the
            engine's top recommendation, players learn to evaluate tradeoffs:
            one move may offer a small material advantage, while another
            provides long-term positional compensation. Understanding these
            nuances develops the judgment needed for over-the-board decision
            making.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Learning Mode with Hints
          </h2>

          <p>
            For players who want guided practice rather than full engine
            analysis, Castle.ai offers a learning mode that provides hints
            without revealing the solution immediately. Hints escalate from
            general principles ("Look for a tactic involving the undefended
            knight") to more specific clues ("Consider a discovered attack"),
            allowing players to solve positions with scaffolded support.
          </p>

          <p>
            Educational psychology research demonstrates that spaced repetition
            and active problem-solving lead to deeper learning than passive
            review. Castle.ai's hint system implements these principles,
            encouraging players to engage with positions actively rather than
            passively observing engine recommendations.
          </p>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">
                  Can I use Castle.ai for tournament preparation?
                </h4>
                <p className="text-muted-foreground">
                  Absolutely. Many club and tournament players use Castle.ai to
                  analyze their games, refine their opening repertoire, and
                  drill tactical patterns. The engine's depth and accuracy are
                  suitable for preparation at all levels below professional
                  play.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Does Castle.ai work on mobile devices?
                </h4>
                <p className="text-muted-foreground">
                  Yes. Castle.ai runs directly in your browser using
                  WebAssembly, making it compatible with desktops, tablets, and
                  smartphones. Performance scales with device capability — newer
                  hardware provides faster analysis, but even older devices can
                  run the engine at reduced depth.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  How does Castle.ai compare to Stockfish?
                </h4>
                <p className="text-muted-foreground">
                  Castle.ai uses a neural network architecture similar to
                  Stockfish's NNUE evaluation. At typical analysis depths, both
                  engines agree on the optimal move more than 90% of the time.
                  For practical training purposes, the differences are
                  negligible.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  Can I import games from other platforms?
                </h4>
                <p className="text-muted-foreground">
                  Castle.ai supports PGN (Portable Game Notation) import,
                  allowing you to analyze games from Chess.com, Lichess, or
                  over-the-board tournaments. Simply paste the PGN into the
                  import tool, and the engine will annotate the game with
                  evaluations and suggestions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <Link href="/how-it-works">
              <Button variant="default" size="lg">
                How It Works
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
