import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify"
import shareIcon from "../assets/svg/shareIcon.svg";
import { MapContainer, TileLayer, Marker, Popup, } from "react-leaflet"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css';
function Listing() {
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const params = useParams()
    const auth = getAuth();
    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data());
            } else {
                toast.error("Listing wasn't found");
            }

            setLoading(false);
        }

        fetchData();
    }, [params.listingId])

    if (loading) {
        return <Spinner />
    }

    // const position = [51.505, -0.09]

    return <main>
        <div className="swiper-container">
            {/* <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
               
                slidesPerView={1}
              
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}>
                {listing.imageUrls.map((url, index) => {
                  return  <SwiperSlide key={index}>
                        <div style={{background: `url(${url}) center no-repeat`}} className="swiperSlideDiv"></div>
                    </SwiperSlide>
                })}
            </Swiper> */}

            <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat` }} className="swiperSlideDiv"></div>
        </div>
        <div className="profile" >
            <p className="pageHeader">Item of {listing.type}</p>
            <div className="listingDetails" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShowMessage(true);
                setTimeout(() => { setShowMessage(false) }, 2000)
            }}>
                <div className="shareIconDiv">
                    <img src={shareIcon} alt="" className="" />
                    {showMessage && <p className="linkCopied">Link copied</p>}
                </div>

                <p className="listingName">{listing.name}</p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">{listing.type}</p>
                {listing.offer && <p className="discountPrice">{listing.discountedPrice}</p>}

                <ul className="listingDetailsList">
                    <li>{listing.bedrooms > 1 ? "Bedrooms:" : "Bedroom:"} {listing.bedrooms}</li>
                    <li>{listing.bathrooms > 1 ? "Bathrooms:" : "Bathroom:"} {listing.bathrooms}</li>
                    <li>Furnished: {listing.furnished ? "Yes" : "No"}</li>
                    <li>Parking: {listing.parking ? "Yes" : "No"}</li>
                    <li>Regular Price: ${listing.regularPrice}</li>

                </ul>

                <p className="listingLocationTitle">Geolocation</p>

                <div className="leafletContainer">
                    <MapContainer style={{ widht: "100%", height: "100%" }} center={[listing?.geolocation.lat, listing?.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing?.geolocation.lat, listing?.geolocation.lng]}>
                            <Popup>
                                {listing?.location}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {listing.userRef !== auth.currentUser?.uid &&
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton"> Contact Landlord</Link>}
            </div>
        </div>
    </main >
}

export default Listing;