import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { History } from './history';


export default function AskAI({ inputText, setInputText, onSubmit }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputText.trim()) {
            onSubmit(inputText);
        }
    };


    return (
        <div className="ask-ai-container">
            {/* Sidebar */}
            <History sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />


            {/* Main Content */}
            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                {!sidebarOpen && (
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars" style={{ color: '#ffffff' }}></i>
                    </button>
                )}


                <div className='question-section'>
                    <h1>How can I assist you to prove your point?</h1>
                    <div className='question-box'>
                        <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginRight: '0.5rem' }}></i>
                        <input
                            type="text"
                            placeholder="Ask a question"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <p>Powered by AI, answers are based on published research papers.</p>

                    <div className='sample-search'>
                        <div
                            className="sample-search-1"
                            onClick={() => {
                                const question = "Can solar flares disrupt GPS?";
                                setInputText(question);
                                onSubmit(question);
                            }}
                        >
                            <p>Can solar flares disrupt GPS?</p>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginRight: '1rem', marginTop: '0.4rem' }}></i>
                        </div>

                        <div
                            className="sample-search-1"
                            onClick={() => {
                                const question = "What is the impact of AI on education?";
                                setInputText(question);
                                onSubmit(question);
                            }}
                        >
                            <p>What is the impact of AI on education?</p>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginRight: '1rem', marginTop: '0.4rem' }}></i>
                        </div>

                    </div>
                    <div className='sample-search'>
                        <div
                            className="sample-search-1"
                            onClick={() => {
                                const question = "Can local birds recognize human faces?";
                                setInputText(question);
                                onSubmit(question);
                            }}
                        >
                            <p>Can local birds recognize human faces?</p>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginRight: '1rem', marginTop: '0.4rem' }}></i>
                        </div>

                        <div
                            className="sample-search-1"
                            onClick={() => {
                                const question = "Why do phone screens affect our sleep?";
                                setInputText(question);
                                onSubmit(question);
                            }}
                        >
                            <p>Why do phone screens affect our sleep?</p>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: '#8f9194', marginRight: '1rem', marginTop: '0.4rem' }}></i>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
