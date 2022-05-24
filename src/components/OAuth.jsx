// import { useEffect } from "react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { db } from "../firebase.config"
import { useLocation, useNavigate } from "react-router-dom"
import GoogleIcon from "../assets/svg/googleIcon.svg"

function OAuth() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleAuth = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user)
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.exists())
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: Timestamp.fromDate(new Date())
                })

                // await updateProfile(user, {
                //     displayName: user.displayName
                // })
            }

            navigate("/");
            console.log("navigate");
        } catch (error) {
            console.log(error);
        }

    }
    return <div className="oauthDiv">
        <p >google sign {("/sign-in" === location.pathname) ? "in" : "up"} </p>

        <button type="button" className="oauth-btn" onClick={handleGoogleAuth}>
            <img src={GoogleIcon} alt="googleIcon" width="34px" length="34px" />
        </button>
    </div>
}

export default OAuth;