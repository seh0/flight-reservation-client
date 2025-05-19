import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home.jsx";
import PublicRoute from "./PublicRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import FindAccount from "../pages/FindAccount.jsx";
import MyPage from "../pages/MyPage.jsx";
import PlaceByRegion from "../pages/PlaceByRegion.jsx";
import PlaceBySearch from "../pages/PlaceBySearch.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import FlightPage from "../pages/FlightPage.jsx";
import MapPage from "../pages/MapPage.jsx";
import HelpPage from "../pages/HelpPage.jsx";
import FlightDetail from "../pages/reservation/FlightDetail.jsx";
import ReservationPage from "../pages/reservation/ReservationPage.jsx";
import SeatSelectionPage from "../pages/reservation/SeatSelectionPage.jsx";
import SeatInfoFormPage from "../pages/reservation/SeatInfoFormPage.jsx";
import SeatConfirmationPage from "../pages/reservation/SeatConfirmationPage.jsx";
import ReservationComplete from "../pages/reservation/ReservationComplete.jsx";
import Payment from "../pages/reservation/Payment.jsx";
import ReservationLayout from "../layouts/ReservationLayout.jsx";

const RouteSetup = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const isAuthenticated = isLoggedIn;
    const isAdmin = user && user.admin === true;

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/flight" element={<FlightPage />} />
                <Route path="/rPlace" element={<PlaceByRegion />} />
                <Route path="/sPlace" element={<PlaceBySearch />} />
                <Route path="/help" element={<HelpPage />} />
                <Route element={<ReservationLayout/>}>
                    <Route path="/flight/:id" element={<FlightDetail />} />
                    <Route path="/loading" element={<ReservationPage />} />
                    <Route path="/select/:key" element={<SeatSelectionPage />} />
                    <Route path="/form/:key" element={<SeatInfoFormPage />} />
                    <Route path="/confirm/:key" element={<SeatConfirmationPage />} />
                    <Route path="complete" element={<ReservationComplete />} />
                </Route>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/findAccount"
                element={
                    <PublicRoute>
                        <FindAccount />
                    </PublicRoute>
                } />
        </Routes>
    );
};

export default RouteSetup;