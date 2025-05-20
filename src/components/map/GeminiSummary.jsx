import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const GeminiSummary = ({ city }) => {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const result = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: `여행지 ${city}에 대해 주의사항, 추천 명소, 이벤트를 3줄씩 요약해줘.`,
            });

            const text = await result.text;
            setSummary(text);
        } catch (err) {
            console.error("Gemini 오류:", err);
            setSummary("요약을 불러오지 못했습니다.");
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={fetchSummary} disabled={loading}>
                {loading ? "불러오는 중..." : `${city} 요약 받기`}
            </button>
            <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{summary}</pre>
        </div>
    );
};

export default GeminiSummary;
