import { useState, useEffect, useRef } from "react";
import "../styles/setting.css"

function SettingsPage({userProfile, onUpdateUserProfile, onChangePassword, theme, onSetTheme}) {

    const [username, setUsername] = useState(userProfile?.name || "");
    const [avatar, setAvatar] = useState("default");
    const [presetAvatar, setPresetAvatar] = useState("/avatar1-white.jpg");


    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");

    const [errors, setErrors] = useState({});


    const presetList = [
        "/avatar1-white.jpg",
        "/avatar2-scarf.jpg",
        "/avatar3-orange.jpg",

    ]

    function validateProfile() {
        const e = {};

        if (!username.trim())
            e.username = "Username cannot be empty.";
        return e;
    }

    function handleSaveProfile(e) {

        e.preventDefault();

        const eo = validateProfile();

        setErrors(eo);
        if (Object.keys(eo).length > 0) return;

        let avatarUrl = userProfile?.avatarUrl || "/default-avatar.png";

        if (avatar === "preset") avatarUrl = presetAvatar;

        onUpdateUserProfile({
            name: username.trim(),
            avatarUrl
        });
    }

    function validatePassword() {

        const e = {};

        if (pwd1.length < 6) e.pwd1 = "Password must be at least 6 characters.";
        if (pwd2 !== pwd1) e.pwd2 = "Passwords do not match.";

        return e;

    }

    function handleSavePassword(e) {

        e.preventDefault();

        const eo = validatePassword();

        setErrors((prev) => ({ ...prev, ...eo }));

        if (Object.keys(eo).length > 0) return;

        onChangePassword(pwd1);

        setPwd1("");
        setPwd2("");
    }


    return (
        <section className="setting-page">
            <h1> Settings </h1>

            <form className="settings-section" onSubmit={handleSaveProfile} noValidate>
                <h2 className="settings-section-title"> Personal Profile </h2>

                {/*1. username */}
                <div className="form-group">
                    <label htmlFor="set-username" className="form-label"> User Name </label>
                    <input
                        id="set-username"
                        type="text"
                        value={username}

                        onChange={(e) => setUsername(e.target.value)}
                        aria-invalid={!!errors.username}
                        aria-describedby={errors.username ? "err-username" : undefined}
                    />

                    {errors.username && (
                        <div id="err-username" className="error"> {errors.username} </div>
                    )}

                </div>

                {/*2. avatar */}
                <fieldset className="form-group">

                    <legend> Avatar </legend>

                    <label className="radio-line">
                        <input
                          type="radio"
                          name="avatar"
                          value="default"
                          checked={avatar === "default"}
                          onChange={() => setAvatar("default")}
                        />
                            Use current avatar
                    </label>

                    <label className="radio-line">

                        <input
                          type="radio"
                          name="avatar-choice"
                          value="preset"
                          checked={avatar === "preset"}
                          onChange={() => setAvatar("preset")}
                        />

                        Choose a new avatar
                    </label>


                    {avatar === "preset" && (

                        <div className="preset-strip" role="list">

                          {presetList.map((src) => (

                              <button
                                  key={src}
                                  type="button"
                                  className={`preset-avatar${presetAvatar === src ? " is-selected" : ""}`}
                                  onClick={() => setPresetAvatar(src)}

                                  aria-pressed={presetAvatar === src ? "true" : "false"}
                                  aria-label="Select preset avatar"
                              >
                                  <img src={src} alt="Preset avatar option" />

                              </button>

                          ))}

                        </div>
                    )}

                </fieldset>

                <div className="form-actions">
                    <button type="submit"> Save </button>
                </div>

            </form>

            {/*3. password */}
            <form className="settings-section" onSubmit={handleSavePassword} noValidate>
                <h2 className="settings-section-title"> Password: </h2>

                <div className="form-group">

                  <label htmlFor="pwd-1"> New Password </label>

                    <input
                        id="pwd-1"
                        type="password"
                        value={pwd1}

                        onChange={(e) => setPwd1(e.target.value)}

                        aria-invalid={!!errors.pwd1}
                        aria-describedby={errors.pwd1 ? "err-pwd1" : undefined}
                    />

                    {errors.pwd1 && <div id="err-pwd1" className="error">{errors.pwd1}</div>}

                </div>

                <div className="form-group">

                  <label htmlFor="pwd-2">Confirm Password</label>

                  <input
                    id="pwd-2"
                    type="password"
                    value={pwd2}

                    onChange={(e) => setPwd2(e.target.value)}

                    aria-invalid={!!errors.pwd2}
                    aria-describedby={errors.pwd2 ? "err-pwd2" : undefined}
                  />

                  {errors.pwd2 && <div id="err-pwd2" className="error">{errors.pwd2}</div>}

                </div>

                <div className="form-actions">
                  <button type="submit">Save Password</button>

                </div>

            </form>

            {/*4. upload avatar */}


            {/*5. theme change  */}
            {typeof onSetTheme === "function" && (
                <form className="settings-section" onSubmit={(e) => e.preventDefault()} noValidate>

                    <h2 className="settings-section-title"> Theme Settings </h2>

                    <fieldset>
                        <legend className="form-label"> Choose Theme </legend>

                        <label className="radio-line">

                            <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={theme === "light"}
                            onChange={() => onSetTheme("light")}
                            />
                                Light Theme
                        </label>

                        <label className="radio-line">

                            <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={theme === "dark"}
                            onChange={() => onSetTheme("dark")}
                            />
                                Dark Theme
                        </label>

                    </fieldset>

                </form>

            )
            }

        </section>

    );





}
export default SettingsPage;