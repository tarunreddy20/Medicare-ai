import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { getChatHistory, getOrCreateUserId, sendMessage, sendMessageStreaming } from "../services/api";
import specialties from "../data/specialties";
import { FaHospital, FaMicrophone, FaMicrophoneSlash, FaDownload, FaMoon, FaSun, FaCog, FaPlus, FaTrash, FaExclamationTriangle, FaFont } from "react-icons/fa";
import { useTheme, usePreferences, useTTS, useNotificationSound, detectEmergency, LANGUAGES } from "../hooks/useTheme";
import { useAnnouncer } from "../hooks/useAnnouncer.jsx";

export default function ChatWindow() {
  const navigate = useNavigate();
  const { specialty } = useParams();
  const specData = specialties.find((s) => s.slug === specialty);
  const specName = specData ? specData.name : "General";
  const HeaderIcon = specData ? specData.icon : FaHospital;
  const userId = useMemo(() => getOrCreateUserId(), []);

  const greetingText = useMemo(
    () => `Hi! I am your ${specName} AI assistant. I can share educational guidance, but I am not a licensed doctor.`,
    [specName]
  );

  const quickPrompts = specData?.prompts || [
    "What symptoms should I watch for?",
    "When should I seek urgent care?",
    "What tests are commonly recommended?",
    "How should I prepare for my consultation?"
  ];

  const [messages, setMessages] = useState([{ sender: "bot", text: greetingText, timestamp: null }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [redirectPopup, setRedirectPopup] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const popupRef = useRef(null);
  const { dark, toggle } = useTheme();
  const { prefs, update: updatePref } = usePreferences();
  const { speak, stop: stopTTS } = useTTS(prefs.ttsEnabled);
  const { play: playSound } = useNotificationSound(prefs.soundEnabled);
  const { announce, AnnouncerRegion } = useAnnouncer();
  const [listening, setListening] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [flashResponse, setFlashResponse] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      announce("Voice input is not supported in your browser", "assertive");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      announce("Voice input stopped");
    } else {
      recognitionRef.current.start();
      setListening(true);
      announce("Listening for voice input. Speak now.", "assertive");
    }
  };

  const exportChat = () => {
    const text = messages
      .map((m) => `[${m.timestamp || ""}] ${m.sender === "bot" ? "AI Doctor" : "You"}: ${m.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${specName}-consultation-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(specialty, userId);
        if (history.messages?.length) {
          setMessages(history.messages);
          return;
        }
      } catch (err) {
        // Fall back to greeting when history is unavailable.
      }

      setMessages([{ sender: "bot", text: greetingText, timestamp: null }]);
    };

    loadHistory();
  }, [specialty, userId, greetingText]);

  const handleSend = async (customText) => {
    const textToSend = customText ?? input;
    if (!textToSend.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: "user", text: textToSend, timestamp: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    setEmergency(false);
    announce("Sending message. AI is thinking...");

    try {
      // Add a placeholder bot message for streaming
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsgIndex = messages.length + 1; // after user msg

      const response = await sendMessageStreaming(textToSend, specialty, userId, (partial) => {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[botMsgIndex]) {
            updated[botMsgIndex] = { ...updated[botMsgIndex], text: partial };
          } else {
            updated.push({ sender: "bot", text: partial, timestamp: botTimestamp });
          }
          return updated;
        });
        setTyping(false);
      }, prefs.language);

      if (response.redirected_specialty && response.redirected_specialty !== specialty) {
        const targetSpec = specialties.find((s) => s.slug === response.redirected_specialty);
        const targetName = targetSpec ? targetSpec.name : response.redirected_specialty;
        const TargetIcon = targetSpec ? targetSpec.icon : FaHospital;

        setRedirectPopup({
          targetSlug: response.redirected_specialty,
          targetName,
          TargetIcon,
        });
        announce(`AI responded. Suggesting redirect to ${targetName} department.`, "assertive");
      } else {
        announce("AI doctor has responded. New message available.");
      }

      playSound();
      setFlashResponse(true);
      setTimeout(() => setFlashResponse(false), 600);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      announce("Error: message failed to send. Please try again.", "assertive");
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  // Check for emergency keywords in user input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setEmergency(detectEmergency(val));
  };

  // New session - clear messages
  const startNewSession = () => {
    setMessages([{ sender: "bot", text: greetingText, timestamp: null }]);
    announce("Started a new consultation session");
  };

  // Font size cycle
  const cycleFontSize = () => {
    const sizes = ["small", "medium", "large", "xlarge"];
    const idx = sizes.indexOf(prefs.fontSize);
    updatePref("fontSize", sizes[(idx + 1) % sizes.length]);
  };

  // Focus trap for redirect popup
  const handlePopupKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setRedirectPopup(null);
      inputRef.current?.focus();
    }
    if (e.key === "Tab" && popupRef.current) {
      const focusable = popupRef.current.querySelectorAll("button, [href], [tabindex]:not([tabindex=\"-1\"])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // Auto-focus popup when it appears
  useEffect(() => {
    if (redirectPopup && popupRef.current) {
      const firstBtn = popupRef.current.querySelector("button");
      firstBtn?.focus();
    }
  }, [redirectPopup]);

  return (
    <div className="app-container" role="application" aria-label={`${specName} AI consultation`}>
      <AnnouncerRegion />

      <header className="app-header" role="banner">
        <Link to="/" className="back-button" aria-label="Go back to all departments">← All Departments</Link>
        <div className="chat-header-meta">
          <span className="header-title" aria-label={`${specName} department`}>
            <HeaderIcon aria-hidden="true" /> {specName}
          </span>
          <span className="status-pill" role="status" aria-label="AI assistant is online">LLM Assistant Online</span>
        </div>
        <div className="chat-header-actions">
          <button className="chat-action-btn" onClick={cycleFontSize} aria-label={`Font size: ${prefs.fontSize}`} title="Change font size">
            <FaFont aria-hidden="true" />
          </button>
          <button className="chat-action-btn" onClick={startNewSession} aria-label="Start new conversation">
            <FaPlus aria-hidden="true" />
          </button>
          <button className="chat-action-btn" onClick={exportChat} aria-label="Download conversation as text file">
            <FaDownload aria-hidden="true" />
          </button>
          <button className="chat-action-btn" onClick={() => setShowPrefs(!showPrefs)} aria-label="Open preferences" aria-pressed={showPrefs}>
            <FaCog aria-hidden="true" />
          </button>
          <button className="chat-action-btn" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}>
            {dark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* EMERGENCY BANNER */}
      {emergency && (
        <div className="emergency-banner" role="alert" aria-live="assertive">
          <FaExclamationTriangle aria-hidden="true" />
          <span>If this is a medical emergency, <strong>call 911</strong> or your local emergency number immediately.</span>
          <a href="tel:911" className="emergency-call-btn">Call 911</a>
        </div>
      )}

      {/* PREFERENCES PANEL */}
      {showPrefs && (
        <div className="prefs-panel" role="region" aria-label="User preferences">
          <div className="prefs-row">
            <label>Read responses aloud (TTS)</label>
            <button className={`toggle-switch ${prefs.ttsEnabled ? "on" : ""}`} onClick={() => updatePref("ttsEnabled", !prefs.ttsEnabled)} aria-pressed={prefs.ttsEnabled}>
              {prefs.ttsEnabled ? "ON" : "OFF"}
            </button>
          </div>
          <div className="prefs-row">
            <label>Notification sound</label>
            <button className={`toggle-switch ${prefs.soundEnabled ? "on" : ""}`} onClick={() => updatePref("soundEnabled", !prefs.soundEnabled)} aria-pressed={prefs.soundEnabled}>
              {prefs.soundEnabled ? "ON" : "OFF"}
            </button>
          </div>
          <div className="prefs-row">
            <label>Font size</label>
            <select value={prefs.fontSize} onChange={(e) => updatePref("fontSize", e.target.value)} aria-label="Font size">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          </div>
          <div className="prefs-row">
            <label>Language</label>
            <select value={prefs.language} onChange={(e) => updatePref("language", e.target.value)} aria-label="Language">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="chat-layout">
        <aside className="triage-sidebar" aria-label="Consultation information and quick prompts">
          <h2>AI Consultation Desk</h2>
          <p>
            You are connected to a <strong>{specName}</strong> LLM assistant,
            not a human doctor.
          </p>
          <div className="triage-alert" role="alert" aria-label="Emergency warning">
            <h3>Emergency Notice</h3>
            <p>
              If you have chest pain, severe bleeding, breathing distress, or loss of consciousness,
              call emergency services immediately.
            </p>
          </div>
          <div className="quick-prompts" role="group" aria-label="Quick prompt suggestions">
            <h3>Quick AI Prompts</h3>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="prompt-chip"
                onClick={() => handleSend(prompt)}
                aria-label={`Send prompt: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>

        <div className={`chat-window ${flashResponse ? "flash" : ""}`} role="region" aria-label="Chat conversation">
          <div className="messages" role="log" aria-live="polite" aria-label="Message history" aria-relevant="additions">
            {messages.map((msg, idx) => (
              <Message key={idx} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} onSpeak={prefs.ttsEnabled ? speak : null} onStopSpeak={stopTTS} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area" role="form" aria-label="Send a message">
            <button
              className={`voice-btn ${listening ? "active" : ""}`}
              onClick={toggleVoice}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              aria-pressed={listening}
              type="button"
            >
              {listening ? <FaMicrophoneSlash aria-hidden="true" /> : <FaMicrophone aria-hidden="true" />}
            </button>
            {listening && <span className="voice-visual-feedback" aria-hidden="true">🔴 Listening...</span>}
            <input
              ref={inputRef}
              type="text"
              placeholder={listening ? "Listening..." : `Describe your ${specName.toLowerCase()} concern...`}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              aria-label={`Type your ${specName.toLowerCase()} health question`}
              aria-describedby="input-help"
            />
            <span id="input-help" className="sr-only">Press Enter to send or use the send button</span>
            <button onClick={() => handleSend()} aria-label="Send message">Send</button>
          </div>
        </div>
      </div>

      <footer className="app-footer" role="contentinfo">
        LLM responses are informational only and must not replace professional medical evaluation.
        <span className="app-footer-signature">Developed by Tarun Reddy</span>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button className="mobile-nav-item active" onClick={() => inputRef.current?.focus()} aria-label="Chat">
          <FaHospital />
          <span>Chat</span>
        </button>
        <button className="mobile-nav-item" onClick={() => setShowPrefs(!showPrefs)} aria-label="Settings">
          <FaCog />
          <span>Settings</span>
        </button>
        <button className="mobile-nav-item" onClick={startNewSession} aria-label="New session">
          <FaPlus />
          <span>New</span>
        </button>
        <button className="mobile-nav-item" onClick={exportChat} aria-label="Export chat">
          <FaDownload />
          <span>Export</span>
        </button>
      </nav>

      {redirectPopup && (
        <div className="redirect-overlay" role="dialog" aria-modal="true" aria-labelledby="redirect-title" onKeyDown={handlePopupKeyDown}>
          <div className="redirect-popup" ref={popupRef}>
            <div className="redirect-icon" aria-hidden="true">
              <redirectPopup.TargetIcon />
            </div>
            <h3 id="redirect-title">Switching Department</h3>
            <p>
              Your question is best handled by our{" "}
              <strong>{redirectPopup.targetName}</strong> specialist.
            </p>
            <p className="redirect-sub">Would you like to continue there?</p>
            <div className="redirect-actions">
              <button
                className="redirect-btn primary"
                onClick={() => {
                  setRedirectPopup(null);
                  navigate(`/chat/${redirectPopup.targetSlug}`);
                }}
                aria-label={`Go to ${redirectPopup.targetName} department`}
              >
                Go to {redirectPopup.targetName}
              </button>
              <button
                className="redirect-btn secondary"
                onClick={() => { setRedirectPopup(null); inputRef.current?.focus(); }}
                aria-label="Stay in current department"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
