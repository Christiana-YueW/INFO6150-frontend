import { useState} from "react";


function SettingsCardPassword({label, onSave}) {

      const [editing, setEditing] = useState(false);
      const [pwd1, setPwd1] = useState("");
      const [pwd2, setPwd2] = useState("");
      const [error, setError] = useState("");

      function validate() {
          if (pwd1.length < 6) return "Password must be at least 6 characters.";
          if (pwd2 !== pwd1) return "Passwords do not match.";
          return "";
      }

      function trySave() {
          const message = validate();
          if (message) {
              setError(message);
              return;
          }

          setError("")
          onSave(pwd1);
          setEditing(false);
          setPwd1("");
          setPwd2("");

      }

      function cancel() {
          setEditing(false);
          setPwd1("");
          setPwd2("");
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
                        onClick={() => setEditing(true)}
                        aria-label={`Edit ${label}`}
                      >
                        ✏️ Edit
                      </button>
                  )}

              </div>

              <div className="settings-value">
                  {editing ? (
                      <>
                          <div className="settings-pass-fields">
                              <label htmlFor="pwd-1" className="form-label"> New Password </label>

                              <input
                                  id="pwd-1"
                                  type="password"
                                  className="settings-input"
                                  value={pwd1}
                                  onChange={(e) => setPwd1(e.target.value)}
                                  aria-invalid={!!error && pwd1.length < 6}
                              />

                              <label htmlFor="pwd-2" className="form-label"> Confirm Password </label>

                              <input
                                  id="pwd-2"
                                  type="password"
                                  className="settings-input"
                                  value={pwd2}
                                  onChange={(e) => setPwd2(e.target.value)}
                                  aria-invalid={!!error && pwd2 !== pwd1}
                              />

                          </div>

                          <div className="settings-options">
                              <button
                                  type="button"
                                  className="save-btn"
                                  onClick={trySave}
                                  aria-label={`Save ${label}`}
                              > ✅ Save </button>

                              <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={cancel}
                                  aria-label={`Cancel ${label}`}
                              > ❌ Cancel </button>

                          </div>

                          {error && <div className="validation-msg" role="alert"> {error} </div>}

                      </>


                  ): (
                      <span> ...... </span>
                  )}



              </div>





          </div>



      )



}

export default SettingsCardPassword;