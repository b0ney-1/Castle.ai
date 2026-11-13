const OVERVIEWS = {
  landing: {
    heading: "About Castle.ai",
    paragraphs: [
      "Castle.ai is a chess web app where your move is powered by AI. It brings together three ways to improve and enjoy the game in one place: playing against an AI opponent, learning chess openings, and solving chess puzzles. Whether you are picking up the game for the first time or you already play regularly, the goal is to make every session a little more useful than the last.",
      "Create a free account with your email and a password, log in, and Castle.ai sets up your board. From your personal dashboard you can jump into a game, browse the opening library, or open the puzzle gallery. Your progress is tied to your account, so you can come back and continue where you left off.",
      "When you play, the AI responds to your moves on an interactive chessboard, so you can practise ideas, test a new opening, or simply enjoy a casual game at your own pace. When you want to study, the learning section lets you explore named openings, preview the position each opening leads to, and open a detailed page that explains the ideas behind it with AI assistance.",
      "Puzzles help you sharpen tactics. Each puzzle starts from a real position taken from a game, and your task is to find the best continuation on the board. Practising positions like these is a proven way to train pattern recognition, which is what lets stronger players spot threats and opportunities quickly.",
      "Castle.ai also publishes a blog with articles about chess strategy, how artificial intelligence is changing the way people learn the game, and the technology behind the app. Read it to pick up opening tips, understand how engines think, and find new ideas to try in your next game.",
    ],
  },
  dashboard: {
    heading: "Your Castle.ai dashboard",
    paragraphs: [
      "This dashboard is the starting point for everything you can do on Castle.ai. Three cards lead to the main areas of the app: Play, Learn and Puzzles. Choose the one that matches what you want to work on today, and use the Blog link in the navigation bar for articles about chess and AI.",
      "Play opens an interactive chessboard where you can face an AI opponent. It is a good place to practise what you have learned, try out an opening in a real game, and get comfortable making decisions under the pressure of a live position. Games are linked to your account so your progress is kept.",
      "Learn takes you to the opening library. Browse through a paginated list of named chess openings, hover over any name to preview the resulting position on the board, and click through to a dedicated page about that opening. Understanding the first moves of a game gives you a clear plan, helps you avoid early mistakes, and builds confidence in the middlegame.",
      "Puzzles opens a gallery of tactical positions displayed as a scrollable carousel of boards. Pick a puzzle to open it full size and look for the best move. Solving puzzles regularly improves your calculation, your awareness of forks, pins and other tactical themes, and your ability to find the winning idea in a complicated position.",
      "You can switch between a light and dark theme at any time using the sun and moon button, and sign out from the menu under your username when you are done. Everything on Castle.ai is designed to be simple to reach from this page so you can spend your time on chess instead of searching for features.",
    ],
  },
  blog: {
    heading: "About the Castle.ai blog",
    paragraphs: [
      "The Castle.ai blog collects articles for people who care about chess, artificial intelligence and building software. Posts cover practical questions such as how AI changes the way players study the game, how to approach opening preparation, and what to consider when choosing a template for an AI-powered application.",
      "Each article is labelled with a category, a publication date and an estimated reading time, so you can quickly decide which one to read now and which to save for later. Cards on this page show a short excerpt, and selecting a card opens the full post with headings that break the topic into clear sections.",
      "If you are new to the game, the chess-focused posts are a friendly way to learn the vocabulary of openings, tactics and strategy. If you are an experienced player, they offer fresh ideas to test in your own games, along with a look at how modern engines evaluate positions and why they sometimes prefer moves that feel unnatural to people.",
      "If you are a developer, the technical posts explain the thinking behind Castle.ai and compare it with other starting points for AI apps, so you can judge what fits your own project. Our aim is to keep the writing practical, honest about trade-offs and easy to follow.",
      "After reading, you can head back to the app to put the ideas into practice. Play a game against the AI, study an opening in the learning section, or solve a few puzzles to turn new knowledge into real improvement over the board. Come back to the blog regularly to see new articles as they are added.",
    ],
  },
  learn: {
    heading: "Learn chess openings with Castle.ai",
    paragraphs: [
      "The opening is the first phase of a chess game, and the moves you choose here shape the position for everything that follows. This page is the Castle.ai opening library: a browsable list of named chess openings that you can explore at your own pace.",
      "Move your cursor over any opening in the list and the chessboard updates to show the position that opening leads to. This makes it easy to compare lines side by side and to see how different first moves change the structure of the board, the placement of the pieces and the plans available to each side.",
      "Click an opening to visit its own page. There you will find the position in detail and AI-assisted explanations that help you understand the main ideas, typical plans and common mistakes, rather than just memorising a string of moves. Understanding why a move is played is what lets you stay flexible when your opponent leaves the book.",
      "Use the pagination controls below the list to move through the library. Because there are many openings, a good approach is to pick one opening as White and one or two defences as Black, study them until the ideas feel familiar, and then try them in a game against the AI on the Play page.",
      "Good opening knowledge helps you develop your pieces quickly, control the centre, keep your king safe and reach a comfortable middlegame. Combine this page with the puzzle gallery to practise the tactics that often arise from these openings, and read the blog for further tips on preparation and study habits.",
    ],
  },
  puzzle: {
    heading: "Chess puzzles on Castle.ai",
    paragraphs: [
      "Tactics decide a large share of chess games, and puzzles are one of the most effective ways to train them. The Castle.ai puzzle gallery shows a set of positions on interactive chessboards that you can scroll through using the carousel arrows.",
      "Every card displays a position taken from a game, along with the game identifier it came from. Select a card to open that puzzle in a larger view, study the pieces carefully and look for the strongest move. Take your time: the aim is to build the habit of checking forcing moves such as checks, captures and threats before settling on an answer.",
      "Regular puzzle practice develops pattern recognition. Over time you start to recognise common ideas like forks, pins, skewers, discovered attacks and back-rank weaknesses almost instantly, which saves thinking time in real games and helps you avoid blunders.",
      "A useful routine is to solve a few puzzles each day instead of many in a single long session. Try to find the whole line in your head before you move a piece, and if you miss the solution, review why the best move works so the idea sticks the next time it appears.",
      "When you are ready to apply what you have learned, play a game against the AI opponent, or visit the learning section to study the openings that lead to the kinds of positions you have been practising. You can also read the Castle.ai blog for more guidance on improving at chess with the help of artificial intelligence.",
    ],
  },
};

export default function PageOverview({ page, className = "" }) {
  const content = OVERVIEWS[page];
  if (!content) return null;
  return (
    <section
      className={`max-w-4xl mx-auto px-6 py-12 text-neutral-700 dark:text-neutral-300 ${className}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        {content.heading}
      </h2>
      {content.paragraphs.map((text, i) => (
        <p key={i} className="mb-4 leading-relaxed">
          {text}
        </p>
      ))}
    </section>
  );
}
