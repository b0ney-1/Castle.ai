export const metadata = {
  title:
    "AI-Powered Chess Move Analyzer: Features & Capabilities | Castle.ai",
  description:
    "Explore Castle.ai's features: real-time move analysis, 20+ opening systems, positional evaluation, puzzle trainer, centipawn loss tracking, and multi-variation analysis. Perfect for beginners to tournament players.",
  openGraph: {
    title: "AI-Powered Chess Move Analyzer: Features & Capabilities",
    description:
      "Real-time analysis, opening systems, puzzles, and more. Castle.ai combines cutting-edge chess engine technology with intuitive learning tools.",
    type: "article",
  },
};

export default function FeaturesLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can I use Castle.ai for tournament preparation?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. Many club and tournament players use Castle.ai to analyze their games, refine their opening repertoire, and drill tactical patterns. The engine's depth and accuracy are suitable for preparation at all levels below professional play.",
                },
              },
              {
                "@type": "Question",
                name: "Does Castle.ai work on mobile devices?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Castle.ai runs directly in your browser using WebAssembly, making it compatible with desktops, tablets, and smartphones. Performance scales with device capability — newer hardware provides faster analysis, but even older devices can run the engine at reduced depth.",
                },
              },
              {
                "@type": "Question",
                name: "How does Castle.ai compare to Stockfish?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Castle.ai uses a neural network architecture similar to Stockfish's NNUE evaluation. At typical analysis depths, both engines agree on the optimal move more than 90% of the time. For practical training purposes, the differences are negligible.",
                },
              },
              {
                "@type": "Question",
                name: "Can I import games from other platforms?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Castle.ai supports PGN (Portable Game Notation) import, allowing you to analyze games from Chess.com, Lichess, or over-the-board tournaments. Simply paste the PGN into the import tool, and the engine will annotate the game with evaluations and suggestions.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
