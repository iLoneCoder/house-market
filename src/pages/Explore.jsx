import { Link } from "react-router-dom";
import SaleImage from "../assets/jpg/sellCategoryImage.jpg"
import RentImage from "../assets/jpg/rentCategoryImage.jpg"

function Explore() {
    return <div className="explore">
        <header className="pageHeader">
            <p className="exploreHeading">Explore</p>
        </header>

        <main>
            <p className="exploreCategoryHeading">Categories</p>
            <div className="exploreCategories">

                <Link to="/category/sale">
                    <img src={SaleImage} alt="sale" className="exploreCategoryImg" />
                    <p className="exploreCategoryName">Sale category</p>
                </Link>

                <Link to="/category/rent">
                    <img src={RentImage} alt="rent" className="exploreCategoryImg" />
                    <p className="exploreCategoryName">Rent category</p>
                </Link>


            </div>

        </main >

    </div>

}

export default Explore;