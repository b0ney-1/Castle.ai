export const metadata = {
  title: "What Is a Chess AI Engine? A Beginner's Guide | Castle.ai",
  description:
    "Learn how chess AI engines work, from minimax algorithms and alpha-beta pruning to neural networks. Discover what engines can teach you and how to use Castle.ai effectively — even as a beginner.",
  openGraph: {
    title: "What Is a Chess AI Engine? A Beginner's Guide",
    description:
      "Chess engines evaluate up to 200 million positions per second. Learn how they work and what they can teach you about chess improvement.",
    type: "article",
  },
};

export default function ChessAIGuideLayout({ children }) {
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
                name: "Can a human ever beat a chess engine?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Not in standard play. Modern engines are approximately 800 Elo points stronger than the best humans, meaning they would win 99%+ of games. Even World Champions cannot consistently compete with top engines on equal terms.",
                },
              },
              {
                "@type": "Question",
                name: "Do chess engines make mistakes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "At typical search depths (18-20 ply), engines play near-perfect chess in most positions. Mistakes occur primarily in extremely complex tactical positions requiring 30+ move calculations, or in positions with fortresses and zugzwang where the evaluation changes dramatically based on whose turn it is.",
                },
              },
              {
                "@type": "Question",
                name: "Should beginners use engines?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, but focus on big mistakes (blunders) rather than optimizing every move. Use the engine to identify hanging pieces, missed tactics, and checkmate threats. Don't worry about small evaluation differences — those are for advanced players.",
                },
              },
              {
                "@type": "Question",
                name: "What's the difference between engine analysis and human coaching?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Engines find the objectively best moves but don't explain why humans make certain mistakes or how to improve decision making. Coaches provide strategic guidance, psychological support, and personalized training plans — things engines cannot do. The ideal approach combines engine analysis with human instruction.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
