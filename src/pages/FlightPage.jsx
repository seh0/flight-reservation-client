import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import SearchFlight from "../components/flight/SearchFlight.jsx";
import apiClient from "../apiClient.jsx";
import FlightList from "../components/flight/FlightList.jsx";

import "../styles/FlightPage.css"

function FlightPage() {
    const location = useLocation(); // ✅ 전달받은 state 읽기
    const searchData = location.state; // ✅ navigate로 전달된 데이터
    const navi = useNavigate();

    const [filters, setFilters] = useState(null);
    const [selectedFlights, setSelectedFlights] = useState([]);

    const isLoggedIn = () => {
        const token = localStorage.getItem("accessToken");
        return !!token;
    }

    useEffect(() => {
        if (searchData) {
            setFilters(searchData); // ✅ 검색 조건 반영
        } else {
            setFilters(null); // 새로고침 시 초기화
        }
    }, [searchData]);

    const handleSearch = (searchData) => {
        setFilters(searchData);
    };

    const sendTokafka = async () =>{
        if (!isLoggedIn()) {
            alert("로그인이 필요합니다.");
            navi("/login"); // 또는 로그인 페이지로 이동
            return;
        }
        if (selectedFlights.length === 0) {
            alert("선택된 항공편이 없습니다.");
            return;
        }

        try {
            for (const flight of selectedFlights) {
                await apiClient.post("/api/kafka/publish" ,flight)
            }
            navi("/loading");
        } catch (error) {
            console.error("Kafka 전송실패:", error);
            alert("전송실패");
        }
    }

    const goToDetail = () => {
        if (!isLoggedIn()) {
            alert("로그인이 필요합니다.");
            navi("/login");
            return;
        }

        if (selectedFlights.length === 0) {
            alert("선택된 항공편이 없습니다.");
            return;
        }

        // 편도일 경우
        if (selectedFlights.length === 1) {
            navi(`/flight/${selectedFlights[0].id}`);
        }

        // 왕복일 경우는 선택사항: 쿼리스트링이나 상태(state)로 backFlight 넘길 수 있음
        else if (selectedFlights.length === 2) {
            navi(`/flight/${selectedFlights[0].id}`, {
                state: { backFlight: selectedFlights[1] }, // 선택 사항
            });
        }
    };


    return (
        <div className="flight-page-container">
            <SearchFlight onSearch={handleSearch} />

            <div className="flight-page-selection-wrapper">
                <div className="flight-page-selected-box">
                    <h3 className="flight-page-title">선택된 항공편</h3>

                    <div className="flight-page-selected-list">
                        {selectedFlights.length === 2 ? (
                            <>
                                <div className="flight-page-flight-card">
                                    <p className="flight-page-route">
                                        ✈ {selectedFlights[0].departureName} → {selectedFlights[0].arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {selectedFlights[0].departureTime?.split("T")[0]}
                                    </p>
                                </div>

                                <div className="flight-page-flight-card">
                                    <p className="flight-page-route">
                                        ✈ {selectedFlights[1].departureName} → {selectedFlights[1].arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {selectedFlights[1].departureTime?.split("T")[0]}
                                    </p>
                                </div>
                            </>
                        ) : (
                            selectedFlights.map((flight, idx) => (
                                <div className="flight-page-flight-card" key={idx}>
                                    <p className="flight-page-route">
                                        ✈ {flight.departureName} → {flight.arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {flight.departureTime?.split("T")[0]}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="flight-page-reserve-btn" onClick={goToDetail}>
                        예약하기
                    </button>
                </div>
            </div>

            <FlightList
                filters={filters}
                onSelectedFlights={setSelectedFlights}
                selectedFlights={selectedFlights}
            />
        </div>
    );

}

export default FlightPage;
