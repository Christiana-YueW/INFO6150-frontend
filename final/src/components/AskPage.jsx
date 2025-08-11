import { useEffect, useRef, useState } from "react";
import "../styles/ask.css";

function AskPage({ items = [], userProfile }) {

    const [messages, setMessages] = useState(() => ([
    {
      id: "m0",
      role: "assistant",
      text:
        "Hi! Ask me about your items. Try: “Where is camera?” or “Find charger”. " +
        "I’ll search your saved items and tell you the location.",
      ts: Date.now(),
    },
    ]));


    const [input, setInput] = useState("");
    const logRef = useRef(null);
    const nextId = () => "m" + Math.random().toString(36).slice(2, 8);


  useEffect(() => {

    const log = logRef.current;

    if (!log) return;

    log.scrollTop = log.scrollHeight;
  }, [messages]);


  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed) return;

    const userMsg = { id: nextId(), role: "user", text: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

   //message! answer!
    const reply = answer(trimmed, items);
    const asstMsg = { id: nextId(), role: "assistant", text: reply, ts: Date.now() };
    setMessages((prev) => [...prev, asstMsg]);

    setInput("");
  }

  function onKeyDown(e) {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const fakeEvent = { preventDefault(){} };
      handleSubmit(fakeEvent);
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
          <button type="submit" className="send-button" aria-label="Send message"> Send </button>

        </div>

      </form>

    </section>
  );
}

//generate answer fake answer
function answer(query, items) {

  const q = query.toLowerCase();


  if (
      q === "list" || q === "show all" || q === "all items"
  ) {

    if (items.length === 0) {
      return "You have no saved items yet. Use Add to create one.";
    }

    const lines = items.map((it) => `• ${it.name} — ${it.location}`);

    return "Here are your items:\n" + lines.join("\n");
  }



  const words = q.trim().toLowerCase().split(" ").filter(word => word !== "");

  const matches = items.filter((item) => {
    const itemName = item.name.toLowerCase();

    return words.some((words) => itemName.includes(words));
  });

  if (matches.length === 1) {

    const foundIt = matches[0];

    return `${foundIt.name} is in “${foundIt.location}”.`;
  }


  if (matches.length > 1) {

    const lines = matches.map(
        (item) => `• ${item.name} — ${item.location}`);

    return `I found ${matches.length} items:\n` + lines.join("\n");
  }

  return (
    "I couldn't find that. Try a different name, or add the item on the Add page. "
  );
}


export default AskPage;