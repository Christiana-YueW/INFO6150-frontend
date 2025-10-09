import { useEffect, useRef, useState } from "react";
import api from "../services/api.js";
import "../styles/ask.css";

function AskPage({ items = [], userProfile, userId }) {

    const [messages, setMessages] = useState(() => ([
    {
      id: "m0",
      role: "assistant",
      text:
        `Hi${userProfile?.name ? `, ${userProfile.name}` : ""}!
         Ask me about your items. Try: "Where is camera?" or "Find charger". `,
      ts: Date.now(),
    },
    ]));


    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const logRef = useRef(null);
    const nextId = () => "m" + Math.random().toString(36).slice(2, 8);


  useEffect(() => {

    const log = logRef.current;

    if (!log) return;

    log.scrollTop = log.scrollHeight;
  }, [messages]);


  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || loading) return;

    const userMsg = { id: nextId(), role: "user", text: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call AI API
      const response = await api.ai.query(userId, trimmed);

      if (response.success && response.data) {
        const asstMsg = {
          id: nextId(),
          role: "assistant",
          text: response.data.response,
          ts: Date.now()
        };
        setMessages((prev) => [...prev, asstMsg]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('AI query error:', error);
      const errorMsg = {
        id: nextId(),
        role: "assistant",
        text: "Sorry, I'm having trouble processing your request. Please try again.",
        ts: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();


      handleSubmit(e);
    }
  }

  return (
    <section className="ask-page">
      <h1> Ask </h1>
      <p className="ask-intro">
        Chat with me. I’ll look through your items and tell you where they are.
      </p>

      <div
        ref={logRef}
        className="chat-log"
        role="log"

        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat transcript"

        tabIndex={0}
      >
        <ul className="chat-list">

          {messages.map((m) => (
            <li key={m.id} className={`chat-msg chat-msg--${m.role}`}>

              <div className="chat-bubble">
                <p>{m.text}</p>
              </div>

            </li>

          ))}
        </ul>

      </div>


      <form className="chat-form" onSubmit={handleSubmit} noValidate>

        <label htmlFor="ask-input" className="visually-hidden"> Type your message here </label>
        <textarea

          id="ask-input"
          className="chat-input"

          rows={2}
          value={input}

          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}

          placeholder='e.g., "where is camera", "find charger", or "list all items"'
          aria-invalid={false}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="send-button"
            aria-label="Send message"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>

        </div>

      </form>

    </section>
  );
}

export default AskPage;
