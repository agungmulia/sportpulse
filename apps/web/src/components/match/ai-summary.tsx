interface Props {
  article: {
    title: string;
    summary: string | null;
    content: string;
  };
}

export function AiSummary({ article }: Props) {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/30 dark:to-blue-950/30 rounded-xl border border-primary-100 dark:border-primary-900/50 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <h2 className="font-semibold">AI Match Analysis</h2>
        <span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
          AI Generated
        </span>
      </div>
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{article.title}</h3>
      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {article.summary || article.content.slice(0, 500)}
      </div>
    </div>
  );
}
