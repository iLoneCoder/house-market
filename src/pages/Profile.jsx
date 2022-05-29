import { useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../assets/svg/homeIcon.svg";
import rightArrowIcon from "../assets/svg/keyboardArrowRightIcon.svg"

function Profile() {
    const auth = getAuth();
    const curUser = auth.currentUser;
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const [formData, setFormData] = useState({
        name: curUser.displayName,
        email: curUser.email
    })

    const { name, email } = formData;

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
            <button type="button" className="createListingButton">Create your own listing</button>
            <img src={rightArrowIcon} alt="" />
        </Link>


    </div> : <h1>not logged in</h1>
}

export default Profile;