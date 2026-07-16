import ReactMarkdown from "react-markdown";
import { FaUserMd, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useState } from "react";

export default function Message({ sender, text, timestamp, onSpeak, onStopSpeak }) {
  const isBot = sender === "bot";
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (speaking) {
      onStopSpeak?.();
      setSpeaking(false);
    } else {
      onSpeak?.(text);
      setSpeaking(true);
      // Auto-reset after speech ends
      const checkEnd = setInterval(() => {
        if (!window.speechSynthesis?.speaking) {
          setSpeaking(false);
          clearInterval(checkEnd);
        }
      }, 500);
    }
  };

  return (
    <div
      className={`message-row ${sender}`}
      role="article"
      aria-label={`${isBot ? "AI Doctor" : "You"} ${timestamp ? `at ${timestamp}` : ""}`}
    >
      {isBot && (
        <div className="msg-avatar" aria-hidden="true">
          <FaUserMd />
        </div>
      )}
      <div className={`message ${sender}`}>
        {isBot ? <ReactMarkdown>{text}</ReactMarkdown> : text}
        <div className="msg-footer">
          {timestamp && <span className="msg-time" aria-hidden="true">{timestamp}</span>}
          {isBot && onSpeak && (
            <button
              className={`tts-btn ${speaking ? "active" : ""}`}
              onClick={handleSpeak}
              aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
              type="button"
            >
              {speaking ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
