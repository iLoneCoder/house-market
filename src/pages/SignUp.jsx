import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { db } from "../firebase.config";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore"
import  OAuth  from "../components/OAuth"

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const { name, email, password } = userData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleClick = () => {
        setShowPassword(prevState => !prevState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            const docData = { ...userData };
            delete docData.password;
            docData.timestamp = Timestamp.fromDate(new Date())
            await setDoc(doc(db, "users", user.uid), docData)

            updateProfile(user, {
                displayName: name
            });

            navigate("/");
        } catch (error) {
            console.log(error);
            console.log("asd")
        }

    }

    return <div className="pageContainer">
        <p className="pageHeader">
            Sign up here!
        </p>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" className="nameInput" placeholder="Name" id="name" value={name} onChange={handleChange} />
            <input type="text" className="emailInput" placeholder="Email" id="email" value={email} onChange={handleChange} />
            <div className="passwordInputDiv">
                <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={handleChange} />
                <img src={visibilityIcon} alt="visibilityIcon" className="showPassword" onClick={handleClick} />
            </div>

            <div className="signUpBar">
                <p className="signUpText">
                    Sign up
                </p>
                <button type="submit" className="signUpButton"><ArrowIcon /></button>
            </div>

            <OAuth />

        </form>
        <Link to="/sign-in" className="signUpInstead">
            sign in instead
        </Link>
    </div>
}

export default SignUp;