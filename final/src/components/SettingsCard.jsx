import { useState, useRef, useEffect} from "react";


function SettingsCard({label, type, value, options = [], onSave, validate}) {

    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const [error, setError] = useState("");

    function trySave() {

        const i = input;
        if (validate) {
            const message = validate(i);
            if (message) {
                setError(message);
                return;

            }
        }

        setError("");
        onSave(i);
        setEditing(false);
    }

    function cancel() {
        setEditing(false);
        setInput(value);
        setError("");
    }

    return (
        <div className="settings-card">

            <div className="settings-label-row">
                <span className="settings-label">{label}</span>
                {!editing && (

                    <button
                    type="button"
                    className="edit-btn"
                    onClick={() => { setEditing(true); setInput(value); setError(""); }}
                    aria-label={`Edit ${label}`}
                    >
                        ✏️ Edit
                    </button>

                )}
            </div>

            <div className="settings-value">
                {editing ? (
                    <>
                        {type === "text" && (
                            <input
                                className="settings-input"
                                aria-label={label}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        )}

                        {type === "select" && (
                            <select
                                className="settings-select"
                                aria-label={label}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            >
                                {options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                            ))}
                            </select>
                        )}

                         <div className="settings-options">
                              <button
                                  type="button"
                                  className="save-btn"
                                  onClick={trySave}
                                  aria-label={`Save ${label}`}
                              >
                                ✅ Save
                              </button>

                              <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={cancel}
                                  aria-label={`Cancel ${label}`}
                              >
                                ❌ Cancel

                              </button>
                         </div>


                        {error && <div className="validation-msg" role="alert">{error}</div>}
                    </>
                    ) : (<span>{value}</span>
        )}


            </div>


        </div>



    );

}

export default SettingsCard;