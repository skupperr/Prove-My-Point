import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/api";
import { useAuth, SignInButton } from "@clerk/clerk-react";

export function History({ sidebarOpen, toggleSidebar }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { makeRequest } = useApi();
    const { userId } = useAuth();

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!userId) {
                setLoading(false); // Prevent infinite loader
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const res = await makeRequest("user-history");
                if (res.status === "success") {
                    setQuestions(res.history);
                } else {
                    setError("Failed to load history.");
                }
            } catch (err) {
                console.error("❌ Error fetching history:", err.message);
                setError("Permission denied or network error.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [userId]);

    const handleQuestionClick = (docId) => {
        navigate("/questionAnswer", { state: { docId } });
        toggleSidebar();
    };

    return (
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={toggleSidebar}>
                ✖
            </button>
            <h2 className="sidebar-title">🧠 Your History</h2>

            <ul className="sidebar-menu">
                {!userId && (

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <SignInButton mode="modal">
                            <button className="nav-button">🔐 Sign In to view history</button>
                        </SignInButton>
                    </div>

                )}
                {loading && userId && <li>⏳ Loading...</li>}
                {error && <li className="error-msg">❌ {error}</li>}
                {!loading && !error && userId && questions.length === 0 && <li>No questions yet.</li>}
                {!loading &&
                    userId &&
                    questions.map((q) => (
                        <li key={q.id} onClick={() => handleQuestionClick(q.id)}>
                            {q.question}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
