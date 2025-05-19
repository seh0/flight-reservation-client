import {useEffect, useState} from "react";
import apiClient from "../../apiClient.jsx";

import "./AirportSelectModal.css"

const AirportSelectModal = ({ onClose, onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim() !== "") {
                apiClient.get(`/api/autocomplete?keyword=${query}`)
                    .then(res => {
                        const data = res.data;
                        console.log("자동완성 응답:", data);
                        setResults(Array.isArray(data) ? data : []);
                    })
                    .catch(err => console.error("자동완성 오류", err));
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <span>✈ 공항 선택</span>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <input
                    type="text"
                    autoFocus
                    className="modal-input"
                    placeholder="공항명 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="modal-list">
                    {results.length > 0 ? (
                        results.map((airport, idx) => (
                            <div
                                key={idx}
                                className="modal-list-item"
                                onClick={() => {
                                    onSelect({ name: airport.nameKo, code: airport.code }); // nameKo, code 함께 전달
                                    onClose();
                                }}
                            >
                                {airport.nameKo} ({airport.code})
                            </div>
                        ))
                    ) : (
                        query && <div className="modal-empty">검색 결과가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AirportSelectModal;
