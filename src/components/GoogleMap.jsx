import { GoogleMap, useLoadScript, OverlayView } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { allAirports } from "../data/allAirports.js";
import "../styles/FlightOverlay.css";
import { filterAirportsByDistance } from "../data/fucntionDistance.js";

const containerStyle = {
    width: "100%",
    height: "100%",
};


const softDarkStyle = [/* 생략: 기존 스타일 */];

const center = { lat: 35, lng: 130 };
const continentHubCodes = ["SIN", "DXB", "LHR", "JFK", "GRU", "JNB", "SYD"];

function GoogleMapInternational() {
    const [departure] = useState(() =>
        allAirports.find((airport) => airport.code === "ICN")
    );
    const [arrival, setArrival] = useState(null);
    const [visibleAirports, setVisibleAirports] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(2);
    const [hoveredAirport, setHoveredAirport] = useState(null);
    const mapRef = useRef(null);
    const polylineRef = useRef(null);
    const animationRef = useRef(null); // ✅ animation clear용 ref

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const handleClick = (airport) => {
        if (!airport || airport.code === departure.code) return;
        setArrival(prev => prev?.code === airport.code ? null : airport);
    };

    const updateVisibleAirports = (map) => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        setZoomLevel(zoom);
        if (!bounds) return;

        const inBounds = allAirports.filter((airport) => {
            const pos = new window.google.maps.LatLng(airport.lat, airport.lng);
            return bounds.contains(pos);
        });

        const minDistance = zoom >= 6 ? 50 : zoom >= 4 ? 200 : 300;
        const filtered = filterAirportsByDistance(inBounds, minDistance, continentHubCodes)
            .filter((airport) =>
                airport.code !== departure.code &&
                (airport.code !== "GMP" || zoom >= 4) // 김포 제외 조건
            );

        setVisibleAirports(filtered);
    };

    // ✅ 비행기 애니메이션 + 경로 그리기
    useEffect(() => {
        if (!mapRef.current) return;

        // 이전 선 제거
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }
        if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }

        if (arrival) {
            const planeSymbol = {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                strokeColor: "#ff6f00",
            };

            const line = new window.google.maps.Polyline({
                path: [
                    { lat: departure.lat, lng: departure.lng },
                    { lat: arrival.lat, lng: arrival.lng },
                ],
                geodesic: true,
                strokeColor: "#ff6f00",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                icons: [{
                    icon: planeSymbol,
                    offset: "0%",
                }],
            });

            line.setMap(mapRef.current);
            polylineRef.current = line;

            let count = 0;
            animationRef.current = setInterval(() => {
                count = (count + 1) % 100;
                const icons = line.get("icons");
                icons[0].offset = `${count}%`;
                line.set("icons", icons);
            }, 50); // 속도: 50ms마다 1% 이동
        }

        return () => {
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [arrival]);

    if (!isLoaded) return <div>지도 로딩 중...</div>;

    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={2.7}
                onLoad={(map) => {
                    mapRef.current = map;
                    updateVisibleAirports(map);
                }}
                onIdle={() => updateVisibleAirports(mapRef.current)}
                options={{
                    minZoom: 2,
                    maxZoom: 10,
                    styles: softDarkStyle,
                }}
            >
                {/* 출발지 마커 */}
                <OverlayView
                    position={{ lat: departure.lat, lng: departure.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="fixed-departure-marker" title={departure.name}>
                        <div className="fixed-marker-label"> {departure.name}</div>
                    </div>
                </OverlayView>

                {/* 도착지 마커 */}
                {visibleAirports.map((airport) => (
                    <OverlayView
                        key={airport.code}
                        position={{ lat: airport.lat, lng: airport.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        {continentHubCodes.includes(airport.code) || zoomLevel >= 6 ? (
                            <div
                                className={`flight-overlay ${airport.code === arrival?.code ? "active" : ""}`}
                                onClick={() => handleClick(airport)}
                                onMouseEnter={() => setHoveredAirport(airport)}
                                onMouseLeave={() => setHoveredAirport(null)}
                                title={airport.name}
                            >
                                <div className="airport-name">{airport.name}</div>
                                <div className="airport-price">₩{airport.price.toLocaleString()}~</div>
                            </div>
                        ) : (
                            <div
                                className={`airport-dot ${airport.code === arrival?.code ? "active" : ""}`}
                                onClick={() => handleClick(airport)}
                                onMouseEnter={() => setHoveredAirport(airport)}
                                onMouseLeave={() => setHoveredAirport(null)}
                                title={airport.name}
                            />
                        )}
                    </OverlayView>
                ))}

                {/* 마커 말풍선 */}
                {(hoveredAirport || arrival) && (
                    <OverlayView
                        position={{
                            lat: (hoveredAirport ?? arrival).lat,
                            lng: (hoveredAirport ?? arrival).lng,
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="hover-box">
                            <div className="airport-name">{(hoveredAirport ?? arrival).name}</div>
                            <div className="airport-price">₩{(hoveredAirport ?? arrival).price.toLocaleString()}~</div>
                        </div>
                    </OverlayView>
                )}
            </GoogleMap>
        </div>
    );
}

export default GoogleMapInternational;
