import { useState} from "react";

import '../styles/add.css'

function AddItemPage({ onAddItem, onNavigate}) {


    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [otherLocation, setOtherLocation] = useState('')

    const [photoPreview, setPhotoPreview] = useState(null)
    const [errors, setErrors] = useState({})

    const presentLocations = ['Living Room', 'Kitchen', 'Office', 'Black Cabinet', 'Bedroom', 'Garage'];

    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            setPhotoPreview(null);
            return;
        }
            const reader = new FileReader();
            reader.onload = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);

    }

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {};

        if (name.trim().length === 0) {
            newErrors.name = 'Item name is required';
        }

        if (!location) {
            newErrors.location = 'Please select a location';
        } else if (location === 'Other' && otherLocation.trim().length === 0) {
            newErrors.otherLocation = 'Please enter a custom location';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const finalLocation = location === 'Other' ? otherLocation.trim() : location;

        onAddItem({
            name: name.trim(),
            location: finalLocation,
            photo: photoPreview || null,
        });
            onNavigate('browse');
    }

    return (

        <section className="add-page">
            <h1> Add Your New Item </h1>

            <form className="add-form" onSubmit={handleSubmit} noValidate>

                    {/*name */}
                <div className="form-group">
                    <label htmlFor="item-name"> Item Name: </label>
                    <input
                            type="text"
                            value={name}
                            id="item-name"
                            name="name"

                            onChange={(e) => setName(e.target.value)}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'error-name' : undefined}
                            aria-required="true"

                    />

                    {errors.name && (
                        <div id="error-name" className="error" role="alert">
                            {errors.name}
                        </div>
                    )}
                </div>

                    {/*location */}
                <div className="form-group">
                    <label htmlFor="item-location"> Item Location: </label>
                    <select

                        value={location}
                        id="item-location"

                        onChange={(e) => setLocation(e.target.value)}
                        aria-invalid={!!errors.location}
                        aria-describedby={errors.location ? 'error-location' : undefined}
                        aria-required="true"
                    >

                        <option value="">Select a Location</option>
                        {presentLocations.map(loc => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                        <option value="Other"> Other </option>
                    </select>

                    {errors.location && (
                        <div id="error-location" className="error" role="alert">
                            {errors.location}
                        </div>
                    )}


                </div>

                {/*if Other location */}
                {location === 'Other' && (
                    <div className="form-group">
                        <label htmlFor="other-location"> Other Location: </label>
                        <input
                        type="text"
                        value={otherLocation}
                        id="other-location"

                        onChange={(e) => setOtherLocation(e.target.value)}
                        aria-invalid={!!errors.otherLocation}
                        aria-describedby={errors.otherLocation ? 'error-otherLocation' : undefined}
                        aria-required="true"
                        />
                        {errors.otherLocation && (
                            <div id="error-otherLocation" className="error" role="alert">
                                {errors.otherLocation}
                            </div>
                        )}

                    </div>
                )}

                {/* photo upload */}
                <div className="form-group">
                    <label htmlFor="item-photo"> Photo(Optional): </label>
                    <input
                        type="file"
                        id="item-photo"

                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />

                    {photoPreview && (
                        <div className="photo-preview">
                            <img
                                src={photoPreview}
                                alt="Photo Preview"
                            />
                        </div>
                    )}
                </div>

                    {/* Submit */}
                <div className="form-actions">
                    <button type="submit" className="btn-primary"> Add Item </button>
                    <button type="button" className="btn-secondary" onClick={() => onNavigate('home')}> Cancel </button>
                </div>


                </form>

            </section>

        )

}

export default AddItemPage;