import ProfileCard from './ProfileCard.jsx';
import '../styles/profile.css';

function Profile({profile, setProfile}) {

    return (
        <section className="profile-page">
            <h1 className="profile-title"> Profile </h1>

            <ProfileCard label="Profile Picture" type="select" value={profile.pic} onSave={(v) => setProfile({ ...profile, pic: v })} options={['profile1.png', 'profile2.png', 'profile3.png']} />

            <ProfileCard label="Username" type="text" value={profile.username} onSave={(v) => setProfile({ ...profile, username: v })} validate={(v) => {
                const trimmed = v.trim();
                if (!trimmed) return 'Username is required';
                if (trimmed.toLowerCase() === 'dog') return "You're kidding, right?";
                return '';
            }}
            />

            <ProfileCard label="Actual Name" type="text" value={profile.actualName} onSave={(v) => {

                setProfile({ ...profile, actualName: v.trim() });
                }}
                         validate={(v) => {
                             const trimmed = v.trim();

                            if ( v.length > 0 && trimmed === '') {
                                return 'Cannot be only whitespace';
                            }
                            return '';
            }}
            />

            <ProfileCard label="Verified Dog Free" type="checkbox" value={profile.dogFree} onSave={(v) => setProfile({ ...profile, dogFree: v })}
            />

        </section>

    );

}

export default Profile;