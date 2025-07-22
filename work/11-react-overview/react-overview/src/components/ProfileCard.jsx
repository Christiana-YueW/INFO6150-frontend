import { useState} from "react";

function ProfileCard({ label, type, value, onSave, validate, options = [] }) {

    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const [error, setError] = useState('');

    function trySave() {

        let finalValue = input;

        if (validate) {
            const msg = validate(input);
            if (msg) {
                setError(msg);
                return;
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
                {!editing && <button onClick={() => {

                    setEditing(true);
                    setError('')
                    setInput(value);
                }} className="edit-btn" aria-label={`Edit ${label}`}> ✏️ Edit </button>}
            </div>


            <div className="profile-value">
                {editing ? (
                    <>
                        {type === 'text' && <input value={input} onChange={(e) => setInput(e.target.value)} aria-label={label} />}
                        {type === 'select' && <select value={input} onChange={(e) => setInput(e.target.value)} aria-label={label} >{options.map(opt => <option key={opt}>{opt}</option>)} </select> }
                        {type === 'checkbox' && <input type="checkbox" checked={input} onChange={(e) => setInput(e.target.checked)} aria-label={label} />}


                        <div className="profile-options">
                            <button onClick={(e) => trySave()} className="save-btn" aria-label={`Save ${label}`}> ✅ Save </button>

                            <button onClick={(e) => {
                                setEditing(false);
                                setInput(value);
                                setError('');
                            }}
                                className="cancel-btn" aria-label={`Cancel editing ${label}`}> ❌ Cancel
                            </button>
                        </div>

                        {error && <div id={`${label}-error`} className="validation-msg" role="alert">{error}</div>}

                    </>
                ) : (

                        <span> {type === 'checkbox' ? (value ? 'Yes' : 'No') : value} </span>

                )}

            </div>


        </div>


    )


}

export default ProfileCard;
