import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CreatingListing() {
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const navigate = useNavigate();
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
        regularPrice, discountedPrice, images, latitude, longitude } = formData;
    const isMounted = useRef(true);
    useEffect(() => {
        if (isMounted) {

        }

        return () => { isMounted.current = false }
    }, [isMounted])


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (discountedPrice > regularPrice) {
            toast.error("discounted price must be less than regular price");
            return;
        }

        let geoLocation = {};
        let location;
        if (geoLocationEnabled) {
            setLoading(true);
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json();
            setLoading(false);
            if (data.status === "REQUEST_DENIED") {
                toast.error("This feature isn't added yet. Please type geolocation manually");
                return;
            }
        } else {
            geoLocation.lat = latitude;
            geoLocation.lng = longitude;
            location = address;
        }

        if (images.length > 6) {
            toast.error("Max image number is 6");
            return;
        }

        const storeImage = (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = "images/" + image.name + uuidv4();
                const storageRef = ref(storage, fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log('Upload is ' + progress + '% done');
                        // switch (snapshot.state) {
                        //     case 'paused':
                        //         // console.log('Upload is paused');
                        //         break;
                        //     case 'running':
                        //         // console.log('Upload is running');
                        //         break;
                        // }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            })
        }

        const imageUrls = await Promise.all([...images].map(async (image) => {
            try {
                return await storeImage(image);
            } catch (err) {
                return console.log(err);
            }
        }))

        // console.log(imageUrls);
        const filestoreData = { ...formData };
        filestoreData.geoLocation = geoLocation;
        filestoreData.location = location;
        filestoreData.imageUrls = imageUrls;
        filestoreData.timestamp = Timestamp.fromDate(new Date());

        if (!offer) {
            console.log(offer);
            delete filestoreData.discountedPrice;
        }
        delete filestoreData.address;
        delete filestoreData.images;

        console.log(filestoreData);
        const docRef = collection(db, "listings")
        setLoading(true);
        await addDoc(docRef, filestoreData);
        setLoading(false);
        setGeoLocationEnabled(false);
        navigate("/");
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

    if (loading) {
        return <Spinner />
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