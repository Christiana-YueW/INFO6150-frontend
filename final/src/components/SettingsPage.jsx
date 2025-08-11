import { useState, useEffect, useRef } from "react";
import SettingsCard from "./SettingsCard.jsx";
import SettingsCardPassword from "./SettingsCardPassword.jsx";

import "../styles/settings.css"

function SettingsPage({userProfile, onUpdateUserProfile, onChangePassword, theme, onSetTheme}) {


    // const [username, setUsername] = useState(userProfile?.name || "");
    // const [avatar, setAvatar] = useState("default");
    // const [presetAvatar, setPresetAvatar] = useState("/avatar1-white.jpg");
    //
    //
    // const [pwd1, setPwd1] = useState("");
    // const [pwd2, setPwd2] = useState("");
    //
    // const [errors, setErrors] = useState({});


    const avatarOptions = [
        "/avatar1-white.jpg",
        "/avatar2-scarf.jpg",
        "/avatar3-orange.jpg",
        "/avatar-default.jpg",

    ]

    // function validateProfile() {
    //     const e = {};
    //
    //     if (!username.trim())
    //         e.username = "Username cannot be empty.";
    //     return e;
    // }
    //
    // function handleSaveProfile(e) {
    //
    //     e.preventDefault();
    //
    //     const eo = validateProfile();
    //
    //     setErrors(eo);
    //     if (Object.keys(eo).length > 0) return;
    //
    //     let avatarUrl = userProfile?.avatarUrl || "/default-avatar.jpg";
    //
    //     if (avatar === "preset") avatarUrl = presetAvatar;
    //
    //     onUpdateUserProfile({
    //         name: username.trim(),
    //         avatarUrl
    //     });
    // }
    //
    // function validatePassword() {
    //
    //     const e = {};
    //
    //     if (pwd1.length < 6) e.pwd1 = "Password must be at least 6 characters.";
    //     if (pwd2 !== pwd1) e.pwd2 = "Passwords do not match.";
    //
    //     return e;
    //
    // }
    //
    // function handleSavePassword(e) {
    //
    //     e.preventDefault();
    //
    //     const eo = validatePassword();
    //
    //     setErrors((prev) => ({ ...prev, ...eo }));
    //
    //     if (Object.keys(eo).length > 0) return;
    //
    //     onChangePassword(pwd1);
    //
    //     setPwd1("");
    //     setPwd2("");
    // }


    return (
        <section className="setting-page">
            <h1> Settings </h1>

            <div className="settings-section" >
                <h2 className="settings-section-title"> Personal Profile </h2>

                {/*1. username */}
                <SettingsCard
                    label="User Name"
                    type="text"

                    value={userProfile?.name || ""}

                    validate={(v) => (!v.trim() ? "Username cannot be empty." : "")}
                      onSave={(v) =>
                        onUpdateUserProfile({
                          name: v.trim(),
                        })
                      }
                />


                {/*2. avatar */}
                <div className="settings-card">
                    <div className="settings-label-row">
                        <span className="settings-label"> Avatar: </span>

                    </div>

                    <div className="settings-value">
                        <SettingsCard
                            label="Avatar"
                            type="select"
                            value={userProfile?.avatarUrl || "/avatar-default.jpg"}
                            options={avatarOptions}

                            onSave={(v) => onUpdateUserProfile({ avatarUrl: v })}
                        />

                        <div className="avatar-preview-row">

                            <img
                                className="avatar-preview"
                                src={userProfile?.avatarUrl || "/avatar-default.jpg"}
                                alt="My Avatar"
                            />

                            <span className="avatar-current-label">
                                Current Avatar
                            </span>

                        </div>

                    </div>

                </div>
            </div>

            <div className="settings-section">
                <h2 className="settings-section-title"> Password </h2>

                <SettingsCardPassword
                    label="Password"
                    onSave={(pwd) => onChangePassword(pwd)}
                />

            </div>



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