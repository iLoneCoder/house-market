import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
function Contact() {
    const [landlord, setLandlord] = useState(null);
    const [text, setText] = useState("");
    const [searchParams] = useSearchParams();
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", params.landlordId);
            const docSnap = await getDoc(docRef);
            console.log(params.landlordId)
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Landlord missing!")
                return;
            }

        }

        fetchData();

    }, [params.landlordId])

    const handleChange = e => {
        setText(e.target.value)
    }

    return <div className="pageContainer">
        <header>
            <p className="pageHeader">Contact Landlord</p>
        </header>

        <main>
            <div className="contactLandlord">
                <p className="landlordName">{landlord?.name}</p>
            </div>

            <div className="messageDiv">
                <label className="messageLabel">Message</label>
                <form className="messageForm">
                    <textarea className="textarea" value={text} onChange={handleChange}></textarea>
                </form>
            </div>

            <a  href={`mailto:${landlord?.email}?subject=${searchParams?.listingName}&body=${text}`} className="primaryButton">Send Email</a>



        </main>

    </div>
}

export default Contact;