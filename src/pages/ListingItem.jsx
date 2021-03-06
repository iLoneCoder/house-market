import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import bedIcon from "../assets/svg/bedIcon.svg"
import bathtubIcon from "../assets/svg/bathtubIcon.svg"
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg"
// import { useEffect } from "react"

function ListingItem({ id, data, onDelete }) {
    // useEffect(() => {
    //     console.log(data);
    // }, [])

    return <div className="categoryListing">

        <img src={data.imageUrls[0]} alt="" className="categoryListingImg" />


        <div className="categoryListingDetails">
            <p className="categoryListingLocation">{data.location}</p>
            <Link to={`/category/${data.type}/${id}`} className="categoryListingName">{data.name}</Link>
            <p className="categoryListingPrice">  ${data.regularPrice} {data.type === "rent" ? "/ Month" : ""} </p>
            <div className="categoryListingInfoDiv">

                <img src={bedIcon} alt="" />
                <p className="">{data.bedrooms > 1 ? "bedrooms:" : "bedroom:"} {data.bedrooms}</p>

                <img src={bathtubIcon} alt="" />
                <p className="">{data.bathrooms > 1 ? "bathrooms:" : "bathroom:"} {data.bathrooms}</p>

                {onDelete && <DeleteIcon className="removeIcon" onClick={onDelete} />}
            </div>
        </div>

    </div>
}

ListingItem.propTypes = {
    id: PropTypes.string,
    data: PropTypes.object
}


export default ListingItem;