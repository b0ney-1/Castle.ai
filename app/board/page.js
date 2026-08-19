export const metadata = {
  title: "Chess Board - Castle.ai",
  description: "Interactive chess board for analyzing positions and practicing strategies. Explore chess tactics and improve your game with Castle.ai's digital board.",
};

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Chess Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive chess board powered by Castle.ai
        </p>
      </div>
    </div>
  );
}
