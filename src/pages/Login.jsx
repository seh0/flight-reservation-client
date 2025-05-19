import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../apiClient.jsx";
import { login } from "../store/authSlice.js";

import "../styles/Login.css"

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 서버 요청: 이제 사용자 정보 대신 accessToken만 반환한다고 가정
            const res = await apiClient.post(
                "api/users/login",
                { email, password }
            );
            const { accessToken } = res.data;

            const decoded = jwtDecode(accessToken);
            const userEmail = decoded.sub; // 토큰 발급 시 setSubject(email) 했던 값

            // Redux를 통해 로그인 상태 업데이트 (필요한 경우 decoded 전체를 저장해도 됨)
            dispatch(login({ email: userEmail, accessToken, user: decoded }));

            alert("로그인 성공");
            navigate("/");
        } catch (err) {
            console.error("로그인 오류", err);
            setError("이메일 또는 비밀번호를 확인해 주세요");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="img-panel"></div>
                <div className="form-panel">
                    <div className="login-form">
                        <h1 onClick={() => navigate("/")} className="login-logo">
                            Airplanit
                        </h1>   
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email">이메일</label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요"
                                required
                            />
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                            <button type="submit">로그인</button>
                            {error && <p className="error">{error}</p>}
                        </form>
                        <p className="link" onClick={() => navigate("/findAccount")}>
                            아이디/비밀번호 찾기
                        </p>
                        <p className="link" onClick={() => navigate("/signup")}>
                            계정이 없으신가요? 회원가입
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;