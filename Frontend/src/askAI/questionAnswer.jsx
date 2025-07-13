import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useApi } from "../utils/api";
import { useAuth } from "@clerk/clerk-react";


export default function QuestionAnswer() {
    const { userId } = useAuth();
    const location = useLocation();
    const { docId } = location.state || {};
    const { makeRequest } = useApi();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const textareaRef = useRef(null); // 👈 Add textarea ref

    useEffect(() => {
        const fetchEntry = async () => {
            if (!userId || !docId) return;
            try {
                const res = await makeRequest(`user-history/${docId}`);
                if (res.status === "success") {
                    setData(res.data);
                } else {
                    console.warn("Entry not found");
                }
            } catch (err) {
                console.error("Failed to fetch entry:", err);
            } finally {
                setLoading(false);
            }
        };



        fetchEntry();
    }, [userId, docId]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [data]);

    if (loading)
        return (
            <div className="status-message loading">
                <p>🧠 Loading...</p>
            </div>
        );

    if (!data)
        return (
            <div className="status-message error">
                <p>🚫 Signal lost. Unable to retrieve data fragment.</p>
            </div>
        );


    const { question, explanation, answer, sources } = data;

    return (
        <div className="container">
            <div className="layout">
                <div className="content">

                    <div className="search-wrapper">
                        <div className="search-bar">
                            <div className="search-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                                </svg>
                            </div>
                            <textarea
                                className="search-input"
                                name="text"
                                wrap="soft"
                                defaultValue={question}
                                disabled={true}
                                style={{ overflow: 'hidden', resize: 'none' }}
                                ref={textareaRef}
                            />


                            {/* <input className="search-input" type="text" defaultValue={question} disabled={true} /> */}
                            <div className="search-clear">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Show explanation if question was invalid */}
                    {explanation && (
                        <><p className="description">
                            ⚠️ {explanation}
                        </p><button onClick={() => window.location.reload()} className="ask-again-button">
                                <p className='try-another-question-button'>Ask another question</p>
                                <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginTop: '0.15rem' }}></i>
                            </button></>

                    )}

                    {/* Show valid answer and research papers */}
                    {answer && (
                        <div>
                            <p className="description">{answer}</p>

                            <h2 className="heading">Relevant Research Papers</h2>

                            {sources.slice(0, 5).map((paper, index) => (
                                <div className="result" key={index}>
                                    <div className="result-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                                        </svg>
                                    </div>
                                    <div className="result-content">
                                        <a className="result-title" href={paper.web_link} target="_blank" rel="noopener noreferrer">
                                            {paper.title}
                                        </a>
                                        <p className="result-meta"><span>Published:</span> {paper.year || "Unknown"}</p>
                                        <p className="result-meta">
                                            <span>Author(s):</span> {paper.authors && paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown"}
                                        </p>



                                        <p className="result-desc">
                                            {paper.summary.length > 500
                                                ? paper.summary.slice(0, 500) + "..."
                                                : paper.summary}
                                        </p>




                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
