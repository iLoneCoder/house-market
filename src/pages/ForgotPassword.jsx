import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import {Link} from "react-router-dom"
import { ReactComponent as ArrowIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Email was sent");
        } catch (error) {
            toast.error("Email wasn't sent");
        }
    }

    return <div className="pageContainer">
        <p className="pageHeader">
            Forgot Password
        </p>

        <form onSubmit={handleSubmit}>
            <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={handleChange} />
            <div className="signInBar">
                <p className="signInText">Update password</p>

                <button type="submit" className="signInButton"><ArrowIcon /></button>
            </div>

        <Link to="/sign-in" className="signInInstead">Sign in instead</Link>
        </form>

    </div>
}

export default ForgotPassword;