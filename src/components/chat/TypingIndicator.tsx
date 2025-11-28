export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
      </div>
    </div>
  );
};
