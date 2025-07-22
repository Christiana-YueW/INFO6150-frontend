import { useState} from "react";

function ProfileCard({ label, type, value, onSave, validate, options = [] }) {

    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const [error, setError] = useState('');

    function trySave() {

        let finalValue = input;
        const trimmed = typeof input === 'string' ? input.trim() : input;

        if (validate) {
            const msg = validate(trimmed);
            if (msg) {
                setError(msg);
                return;
            }
        }



          if (label === 'Actual Name') {
            // Allow empty string
            if (trimmed === '') {
              finalValue = '';
            }
          }

        setError('');
        onSave(finalValue);
        setEditing(false);
    }

    return (

        <div className="profile-card">
            <div className="profile-label-row">
                <span className="profile-label">{label}</span>
                {!editing && <button onClick={() => setEditing(true)} className="edit-btn"> ✏️ Edit </button>}
            </div>


            <div className="profile-value">
                {editing ? (
                    <>
                        {type === 'text' && <input value={input} onChange={(e) => setInput(e.target.value)} aria-label={label} />}
                        {type === 'select' && <select value={input} onChange={(e) => setInput(e.target.value)} >{options.map(opt => <option key={opt}>{opt}</option>)} </select> }
                        {type === 'checkbox' && <input type="checkbox" checked={input} onChange={(e) => setInput(e.target.checked)} />}


                        <div className="profile-options">
                            <button onClick={(e) => trySave()} className="save-btn"> ✅ Save </button>
                            <button onClick={(e) => setEditing(false)} className="cancel-btn"> ❌ Cancel </button>
                        </div>

                        {error && <div className="validation-msg">{error}</div>}

                    </>
                ) : (

                        <span> {type === 'checkbox' ? (value ? 'Yes' : 'No') : value} </span>

                )}

            </div>


        </div>


    )


}

export default ProfileCard;
