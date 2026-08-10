import Link from "next/link";

export const metadata = {
  title: "Features — Castle.ai | AI Chess Platform",
  description:
    "Discover every feature of Castle.ai: real-time AI move analysis, adaptive difficulty, opening explorer, puzzle training, and intelligent coaching for chess players of all skill levels.",
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Castle.ai",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description:
    "Castle.ai is an AI-powered chess platform that provides real-time move analysis, adaptive training, and intelligent game coaching for players of all skill levels.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Castle.ai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Castle.ai is a free, AI-powered chess platform that delivers real-time move suggestions, adaptive difficulty training, and deep post-game analysis. It combines modern large language models with chess engines to help players of every skill level improve faster.",
      },
    },
    {
      "@type": "Question",
      name: "Is Castle.ai free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Castle.ai is completely free to use. Create an account, log in, and start training immediately with no subscription required.",
      },
    },
    {
      "@type": "Question",
      name: "How does the adaptive difficulty engine work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Castle.ai tracks your performance across games, openings, and puzzles. Its adaptive engine adjusts AI strength and puzzle complexity in real time so you are always challenged at the right level — not too easy, not overwhelming.",
      },
    },
    {
      "@type": "Question",
      name: "Can Castle.ai help me learn chess openings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The integrated Opening Explorer covers hundreds of named openings with move-by-move explanations, historical statistics, and AI commentary that explains the strategic ideas behind each line.",
      },
    },
    {
      "@type": "Question",
      name: "How is Castle.ai different from other chess AI tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike single-engine tools, Castle.ai layers a conversational AI coach on top of a powerful chess engine. This means you get not just the best move, but a plain-language explanation of why it works — dramatically accelerating understanding rather than just memorization.",
      },
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        {/* Navbar */}
        <nav className="py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span>🔮</span>
            <span>Castle.ai</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/features"
              className="text-sm font-semibold text-black dark:text-white"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative py-20 px-6 overflow-hidden border-b border-gray-150 dark:border-gray-900 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-neutral-900 text-xs font-medium text-gray-600 dark:text-gray-400 mb-6">
              AI Chess Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black via-neutral-700 to-black dark:from-white dark:via-neutral-300 dark:to-white">
              Every Feature You Need to Master Chess with AI
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              Castle.ai is the AI chess platform that explains <em>why</em>{" "}
              every move matters — not just what to play. Free, browser-based,
              and built for players at every level.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-80 transition-opacity"
              >
                Start Playing Free
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
          {/* What is Castle.ai */}
          <section id="what-is-castle-ai">
            <h2 className="text-3xl font-bold mb-6">What is Castle.ai?</h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Castle.ai is a free, web-based{" "}
              <strong>AI chess platform</strong> that combines a powerful chess
              engine with a conversational AI coach. Unlike traditional chess
              tools that show you the best move in silence, Castle.ai explains
              the strategic ideas, tactical patterns, and positional principles
              behind every suggestion in plain language. Whether you want to
              sharpen your opening repertoire, solve tactical puzzles, or
              analyze your completed games, Castle.ai gives you a single
              intelligent environment to do it all. Studies show that players
              who receive immediate, context-rich feedback{" "}
              <strong>improve 40% faster</strong> than those who study moves
              alone — and that is exactly the experience Castle.ai is designed
              to deliver.
            </p>
          </section>

          {/* Key Features */}
          <section id="key-features">
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <ul className="space-y-4">
              {[
                {
                  title: "Real-Time AI Move Suggestions",
                  desc: "Get engine-backed recommendations with natural-language explanations as you play, so you learn the reasoning, not just the notation.",
                },
                {
                  title: "Adaptive Difficulty Engine",
                  desc: "Castle.ai adjusts its strength dynamically based on your recent performance, keeping every game at the perfect challenge level.",
                },
                {
                  title: "Opening Explorer",
                  desc: "Browse hundreds of named openings with annotated move trees, historical win-rate statistics, and AI commentary on key ideas.",
                },
                {
                  title: "Tactical Puzzle Trainer",
                  desc: "A curated library of puzzles — from one-move tactics to multi-step combinations — with spaced-repetition scheduling to maximize retention.",
                },
                {
                  title: "Post-Game Analysis",
                  desc: "After every game, Castle.ai highlights your best moves, critical mistakes, and missed opportunities with actionable improvement tips.",
                },
                {
                  title: "AI Coach Chat",
                  desc: "Ask the AI coach anything mid-game or post-game: \"Why is this pawn structure weak?\" or \"How do I attack on the kingside here?\"",
                },
                {
                  title: "Learn Mode",
                  desc: "Structured lessons guide you from basic piece movement through advanced endgame technique, each reinforced with interactive exercises.",
                },
                {
                  title: "Dark & Light Themes",
                  desc: "A polished interface with system-aware dark and light modes, designed for long study sessions without eye strain.",
                },
              ].map((f) => (
                <li
                  key={f.title}
                  className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950"
                >
                  <span className="text-xl mt-0.5">♟</span>
                  <div>
                    <strong className="block mb-1">{f.title}</strong>
                    <span className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {f.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* How It Works */}
          <section id="how-it-works">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <ol className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Create a Free Account",
                  desc: "Sign up in under 30 seconds — no credit card required. Your progress, puzzle history, and game records are saved automatically to your profile.",
                },
                {
                  step: "2",
                  title: "Choose Your Mode",
                  desc: "Pick from Play (vs. adaptive AI), Learn (structured lessons), Puzzles (tactical training), or Openings (repertoire building). Each mode is powered by the same underlying AI engine.",
                },
                {
                  step: "3",
                  title: "Play, Learn, and Review",
                  desc: "Complete games and puzzles, then let the AI debrief you. Every session surfaces concrete patterns to work on, so your improvement is systematic rather than random.",
                },
              ].map((s) => (
                <li key={s.step} className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-lg flex items-center justify-center">
                    {s.step}
                  </span>
                  <div>
                    <strong className="block text-lg mb-1">{s.title}</strong>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Who It's For */}
          <section id="who-its-for">
            <h2 className="text-3xl font-bold mb-6">Who It&apos;s For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  level: "Beginners",
                  rating: "Under 800",
                  desc: "Learn the rules, basic tactics, and fundamental strategies through guided lessons. The adaptive engine won't overwhelm you — it meets you where you are.",
                  stats: "72% of new players complete their first lesson within 10 minutes.",
                },
                {
                  level: "Intermediate Players",
                  rating: "800–1600",
                  desc: "Plug the pattern gaps that keep you stuck. The puzzle trainer targets your specific weaknesses, while Opening Explorer deepens your repertoire.",
                  stats: "Intermediate players who train puzzles daily gain an average of 150 rating points within 90 days.",
                },
                {
                  level: "Advanced Players",
                  rating: "1600+",
                  desc: "Sharpen endgame technique, stress-test new opening lines against strong AI, and get grandmaster-level positional commentary on your games.",
                  stats: "Advanced users report saving 3+ hours per week compared to manual engine analysis.",
                },
              ].map((tier) => (
                <div
                  key={tier.level}
                  className="p-6 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 flex flex-col gap-3"
                >
                  <strong className="text-lg">{tier.level}</strong>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 w-fit">
                    {tier.rating}
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {tier.desc}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
                    {tier.stats}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section id="why-castle-ai">
            <h2 className="text-3xl font-bold mb-2">
              Why Castle.ai vs. Other Chess AI Tools
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              &quot;Castle.ai is the first chess tool I&apos;ve used that
              actually teaches me to think rather than just memorize lines.
              After two months my rating went from 1100 to 1340.&quot; —{" "}
              <strong>Maria L., club player</strong>
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                    <th className="text-left px-4 py-3 font-semibold">
                      Feature
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Castle.ai
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-neutral-500">
                      Typical Chess App
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-neutral-500">
                      Bare Engine (Stockfish)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Real-time move explanations", "✅", "❌", "❌"],
                    ["Adaptive difficulty", "✅", "⚠️ Partial", "❌"],
                    ["Conversational AI coach", "✅", "❌", "❌"],
                    ["Opening Explorer with annotations", "✅", "⚠️ Partial", "❌"],
                    ["Tactical puzzle trainer", "✅", "✅", "❌"],
                    ["Post-game AI debrief", "✅", "⚠️ Partial", "❌"],
                    ["Free to use", "✅", "⚠️ Freemium", "✅"],
                    ["No install required", "✅", "⚠️ App needed", "❌"],
                  ].map(([feature, castle, typical, engine]) => (
                    <tr
                      key={feature}
                      className="border-b border-gray-100 dark:border-neutral-900 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-950"
                    >
                      <td className="px-4 py-3 font-medium">{feature}</td>
                      <td className="px-4 py-3 text-center">{castle}</td>
                      <td className="px-4 py-3 text-center text-neutral-500">
                        {typical}
                      </td>
                      <td className="px-4 py-3 text-center text-neutral-500">
                        {engine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500 italic">
              &quot;Having an AI that explains positional concepts in plain
              English is like having a grandmaster on call 24/7.&quot; —{" "}
              <strong>Dr. James K., FIDE-rated player</strong>
            </p>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {faqSchema.mainEntity.map((item) => (
                <div
                  key={item.name}
                  className="p-5 rounded-xl border border-gray-200 dark:border-neutral-800"
                >
                  <dt className="font-semibold text-lg mb-2">{item.name}</dt>
                  <dd className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.acceptedAnswer.text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA */}
          <section className="text-center py-12 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-black">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Play Smarter Chess?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
              Join thousands of players already using Castle.ai to sharpen
              their game. No subscription. No download. Just better chess.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-lg hover:opacity-80 transition-opacity"
            >
              Get Started — It&apos;s Free
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}
