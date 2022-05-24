import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth"

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const auth = getAuth();
    const navigate = useNavigate();
    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleClick = () => {
        setShowPassword((prevState) => (!prevState));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log(auth);
            navigate("/profile");
        } catch (error) {
            console.log(error);
            toast.error("can't log in", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    return <div className="pageContainer">
        <p className="pageHeader">
            Welcome here!
        </p>

        <form onSubmit={handleSubmit}>
            <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={handleChange} />

            <div className="passwordInputDiv" >
                <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="password" id="password" value={password} onChange={handleChange} />
                <img src={visibilityIcon} alt="visibility" className="showPassword" onClick={handleClick} />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">Forgot password</Link>

            <div className="signInBar">
                <p className="signInText">Sign in</p>

                <button type="submit" className="signInButton">
                    <ArrowIcon />
                </button>

            </div>

            <OAuth />

            <Link to="/sign-up" className="signUpInstead">Sign up instead</Link>
        </form>

    </div>
}

export default SignIn;