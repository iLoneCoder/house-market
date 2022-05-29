import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";

function CreatingListing() {
    const auth = getAuth();

    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
        userRef: auth.currentUser.uid
    });

    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer,
        regularPrice, discountedPrice, latitude, longitude } = formData;
    const isMounted = useRef(true);
    useEffect(() => {
        if (isMounted) {

        }

        return () => { isMounted.current = false }
    }, [isMounted])


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const handleChange = (e) => {
        let bool = null;

        if (e.target.value === "true") {
            bool = true;
        }

        if (e.target.value === "false") {
            bool = false;
        }

        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.files
            }))
        }

        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: bool ?? e.target.value
            }))
        }
    }

    return <div className="profile">
        <header>
            <p className="pageHeader">Create a listing</p>
        </header>

        <main>
            <form onSubmit={handleSubmit}>
                <label className="formLabel">Sell/Rent</label>
                <div className="formButtons">
                    <button type="button" className={type === "sale" ? "formButtonActive" : "formButton"} id="type" value="sale" onClick={handleChange} >Sell</button>
                    <button type="button" className={type === "rent" ? "formButtonActive" : "formButton"} id="type" value="rent" onClick={handleChange} >Rent</button>
                </div>

                <label className="formLabel">Name</label>
                <input type="text" className="formInputName" id="name" value={name} onChange={handleChange} required />

                <div className="formRooms">
                    <div>
                        <label className="formLabel">Bedrooms</label>
                        <input type="number" className="formInputSmall" id="bedrooms" value={bedrooms} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="formLabel">Bathrooms</label>
                        <input type="number" className="formInputSmall" id="bathrooms" value={bathrooms} onChange={handleChange} required />
                    </div>
                </div>

                <label className="formLabel">Parking spot</label>
                <div className="formButtons">
                    <button type="button" className={parking ? "formButtonActive" : "formButton"} id="parking" value={true} onClick={handleChange}>Yes</button>
                    <button type="button" className={!parking ? "formButtonActive" : "formButton"} id="parking" value={false} onClick={handleChange}>No</button>
                </div>

                <label className="formLabel">Furnished</label>
                <div className="formButtons">
                    <button type="button" className={furnished ? "formButtonActive" : "formButton"} id="furnished" value={true} onClick={handleChange}>Yes</button>
                    <button type="button" className={!furnished ? "formButtonActive" : "formButton"} id="furnished" value={false} onClick={handleChange}>No</button>
                </div>

                <label className="formLabel">Offer</label>
                <div className="formButtons">
                    <button type="button" className={offer ? "formButtonActive" : "formButton"} id="offer" value={true} onClick={handleChange}>Yes</button>
                    <button type="button" className={!offer ? "formButtonActive" : "formButton"} id="offer" value={false} onClick={handleChange}>No</button>
                </div>

                <label className="formLabel">Regular price</label>
                <div className="formPriceDiv">
                    <input type="number" className="formInputSmall" id="regularPrice" value={regularPrice} onChange={handleChange} />
                    <p className="formPriceText">{type === "rent" ? "$/ MONTH" : ""}</p>
                </div>

                {offer && <>
                    <label className="formLabel">Discounted price</label>
                    <div className="formPriceDiv">
                        <input type="number" className="formInputSmall" id="discountedPrice" value={discountedPrice} onChange={handleChange} />
                        <p className="formPriceText">{type === "rent" ? "$/ MONTH" : ""}</p>
                    </div>
                </>}

                <label className="formLabel">Address</label>
                <textarea className="formInputAddress" id="address" value={address} onChange={handleChange} cols="15" rows="4"></textarea>

                {!geoLocationEnabled && <div className="formCoordinates">
                    <div>
                        <label className="formLabel">Latitude</label>
                        <input type="number" className="formInputSmall" id="latitude" value={latitude} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="formLabel">Longitude</label>
                        <input type="number" className="formInputSmall" id="longitude" value={longitude} onChange={handleChange} />
                    </div>
                </div>}


                <label className="formLabel">Images</label>
                <p className="imagesInfo">First image will be used as a display</p>
                <input type="file" className="formInputFile" id="images" max="6" accept=".jpg, .png, jpeg" onChange={handleChange} multiple required />

                <button type="submit" className="primaryButton">Create listing</button>
            </form>
        </main>
    </div>
}

export default CreatingListing;