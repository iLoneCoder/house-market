import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/svg/personOutlineIcon.svg";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const checkLocation = (path) => {
        // console.log(path);
        return path === location.pathname;
    }
    return <>
        <footer className="navbar">
            <nav className="navbarNav">
                <ul className="navbarListItems">
                    <li className="navbarListItem" onClick={e => navigate("/")}>
                        <ExploreIcon fill={checkLocation("/") ? "#2c2c2c" : "#8f8f8f"} />
                        <p className={checkLocation("/") ? "navbarListItemNameActive" : "navbarListItemName"}>Explore</p>
                    </li>
                    <li className="navbarListItem" onClick={e => navigate("/offer")}>
                        <OfferIcon fill={checkLocation("/offer") ? "#2c2c2c" : "#8f8f8f"} />
                        <p className={checkLocation("/offer") ? "navbarListItemNameActive" : "navbarListItemName"}>Offer</p>
                    </li>
                    <li className="navbarListItem" onClick={e => navigate("/sign-in")}>
                        <ProfileIcon fill={checkLocation("/sign-in") ? "#2c2c2c" : "#8f8f8f"} />
                        <p className={checkLocation("/sign-in") ? "navbarListItemNameActive" : "navbarListItemName"} >Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
    </>
}

export default Navbar;