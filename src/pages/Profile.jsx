import { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { updateDoc, doc, query, where, limit, collection, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../assets/svg/homeIcon.svg";
import rightArrowIcon from "../assets/svg/keyboardArrowRightIcon.svg"
import ListingItem from "./ListingItem";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

function Profile() {
    const auth = getAuth();
    const curUser = auth.currentUser;
    const navigate = useNavigate();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(false);
    const [formData, setFormData] = useState({
        name: curUser.displayName,
        email: curUser.email
    })

    const { name, email } = formData;

    useEffect(() => {
        const fetchListings = async () => {
            const docRef = collection(db, "listings");
            const q = query(docRef, where("userRef", "==", curUser.uid, orderBy("timestamp", "desc"), limit(10)));

            const listingsSnap = await getDocs(q);
            const listings = [];
            listingsSnap.forEach((listing) => {
                return listings.push({
                    id: listing.id,
                    data: listing.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchListings();
    }, [curUser.uid])

    const handleLogout = async () => {
        try {
            signOut(auth);
            console.log("sign out successfully");
            navigate("/");
        } catch (error) {
            console.log(error);
        }

    }

    const handleUpdate = () => {
        setStatus(prevState => !prevState);
    }

    const handleDone = async () => {
        setStatus(prevState => !prevState);
        try {
            await updateProfile(curUser, {
                displayName: name
            })

            await updateDoc(doc(db, "users", curUser.uid), {
                name
            })

        } catch (error) {
            console.log(error);
        }

    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) => {
        try {
            if (window.confirm("Do you want to delete listing ?")) {
                await deleteDoc(doc(db, "listings", listingId))
                toast.success("listing was Deleted!")

                const updatedListing = listings.filter(listing => toString(listing.uid) !== toString(listingId));
                // console.log(updatedListing);
                setListings(updatedListing);
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return <Spinner />
    }

    return curUser !== null ? <div className="profile">
        <div className="profileHeader">
            <h1>Logged in</h1>
            <button type="button" className="logOut" onClick={handleLogout}>log out</button>
        </div>

        <div className="profileDetailsHeader">
            <p className="personalDetailsText">Update profile</p>
            {status ? <p className="changePersonalDetails" onClick={handleDone}>done</p> : <p className="changePersonalDetails" onClick={handleUpdate}>update</p>}
        </div>

        <div className="profileCard">
            <div className={!status ? "profileDetails" : "profileNameActive profileDetails"}>
                <input type="text" className="profileName" id="name" value={name} onChange={onChange} disabled={!status} />
                <input type="email" className="profileEmail" id="email" value={email} readOnly />
            </div>
        </div>

        <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="" />
            {/* <button type="button" className="createListingButton">Create your own listing</button> */}
            <p className="createListingButton">create listing page</p>
            <img src={rightArrowIcon} alt="" />
        </Link>

        <div style={{ marginTop: "15px" }} className="categoryListings">
            {listings?.map((listing) => {
                return <ListingItem key={listing.id} id={listing.id} data={listing.data} onDelete={() => onDelete(listing.id)} />
            })}
        </div>

    </div> : <h1>not logged in</h1>
}

export default Profile;