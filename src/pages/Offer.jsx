import { useState, useEffect } from "react"
import { db } from "../firebase.config"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import Spinner from "../components/Spinner"
import ListingItem from "./ListingItem"
function Offer() {
    const [loading, setLoading] = useState(true);
    const [listings, setListing] = useState(null);
    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(10));

            const listings = [];
            const docSnap = await getDocs(q)
            docSnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            // console.log(listings)
            setListing(listings);
            setLoading(false);
        }
        fetchListings();
    })

    return <div className="category">

        <header>
            <p className="pageHeader" > Offer page</p>
        </header>

        <main>
            {loading ? <Spinner /> : <>
                {listings.length > 0 ? <>
                    {listings.map(listing => {
                        return <ListingItem key={listing.id} id={listing.id} data={listing.data} />
                    })}
                </> :
                    <p>Offer isn't available</p>}
            </>}
        </main>
    </div>
}

export default Offer;