export default function TypingIndicator() {
  return (
    <div className="typing-indicator" role="status" aria-label="AI doctor is typing a response">
      <div className="typing-avatar" aria-hidden="true">AI</div>
      <div className="typing-dots" aria-hidden="true">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="sr-only">AI doctor is typing...</span>
    </div>
  );
}
