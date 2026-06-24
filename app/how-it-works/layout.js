export const metadata = {
  title: "How Castle.ai's Chess AI Engine Analyzes Your Moves | Castle.ai",
  description:
    "Chess engines evaluate up to 200 million positions per second. Learn how Castle.ai's neural network technology, minimax algorithms, and alpha-beta pruning analyze your chess moves across 20+ opening systems.",
  openGraph: {
    title: "How Castle.ai's Chess AI Engine Analyzes Your Moves",
    description:
      "Chess engines evaluate up to 200 million positions per second. Learn how Castle.ai brings that power to everyday players.",
    type: "article",
  },
};

export default function HowItWorksLayout({ children }) {
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
                name: "How accurate is Castle.ai compared to commercial engines?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Castle.ai's analysis is equivalent to engines rated 2800+ Elo, exceeding the playing strength of all human players. At typical analysis depths (18-20 ply), our recommendations match those of Stockfish and other leading engines 95% of the time.",
                },
              },
              {
                "@type": "Question",
                name: "Can beginners benefit from engine analysis?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. While raw engine moves can be cryptic, Castle.ai translates numerical evaluations into instructive feedback. Beginners learn to spot hanging pieces, recognize tactical themes, and avoid one-move blunders — the foundation of chess improvement.",
                },
              },
              {
                "@type": "Question",
                name: "What does engine depth mean?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Engine depth refers to how many moves ahead the engine calculates. A depth of 20 means the engine examines all reasonable variations 20 half-moves into the future. Deeper analysis is more accurate but requires more computation time.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
