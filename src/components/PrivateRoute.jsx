import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hook/useAuthStatus"
import Spinner from "./Spinner";
function PrivateRoute() {
    const { loggedIn, loading } = useAuthStatus();

    if (loading) {
        return <Spinner />
    }

    return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute;