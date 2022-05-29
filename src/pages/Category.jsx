import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase.config"
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore"
import Spinner from "../components/Spinner"
import ListingItem from "./ListingItem"

function Category() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(10));
            const result = await getDocs(q);

            const listings = [];

            result.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchListings();
    })
    return <div className="category">

        <header>
            <p className="pageHeader">Category of {params.categoryName}</p>
        </header>

        <main>
            {loading ? <Spinner /> : listings.length > 0 ? <>
                <div className="categoryListings">
                    {listings.map((listing) => {
                       return <ListingItem key={listing.id} id={listing.id} data={listing.data} />
                    })}
                </div>
            </> : <p>listing is empty</p>}
        </main>

    </div>
}

export default Category;