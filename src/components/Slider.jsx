import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "../firebase.config"
import { Pagination, Navigation, A11y, Scrollbar } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import Spinner from "../components/Spinner"
import { useNavigate } from "react-router-dom"

function Slider() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchListing = async () => {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
            const docSnap = await getDocs(q);

            const listings = [];
            docSnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setLoading(false);
            setListings(listings);
        }

        fetchListing();
        console.log(listings)
        // eslint-disable-next-line
    }, [])

    if (loading) {
        return <Spinner />
    }

    return listings && <div>
        <p className="exploreHeading">Recommended</p>
        <div className="swiper-container">
            <Swiper
                slidesPerView={1}
                className="swiper-container"
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
            >
                {listings.map(({ id, data }) => {
                    return <SwiperSlide key={id}>
                        <div style={{ background: `url("${data.imageUrls[0]}") center no-repeat`, backgroundSize: "cover" }} className="swiperSlideDiv">
                        </div>
                        <h1 className="swiperSlideText" style={{cursor: "pointer"}} onClick={() => { navigate(`/category/${data.type}/${id}`) }}>{data.location}</h1>
                        <p className="swiperSlidePrice">${data.regularPrice} {data.type === "rent" ? "Month" : ""}</p>
                    </SwiperSlide>
                })}
            </Swiper>

        </div>

    </div>
}

export default Slider;