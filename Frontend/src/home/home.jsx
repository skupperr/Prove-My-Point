import 'react'
import "./home.css";
import { useNavigate } from "react-router-dom";



export function Home() {

    const navigate = useNavigate();

    return (

        <div className="container">
            <div className="layout-container">
                <div className="layout-inner">
                    <div className="layout-content-container">

                        {/* Hero Section */}
                        <div className="hero-section">
                            <div className="text-center">
                                <h1>
                                    Back your arguments with facts, not opinions.
                                </h1>
                                <h2>
                                    Prove My Point is an AI-powered research assistant that helps you find credible, science-backed answers to your questions — instantly. Whether you're debating a topic, writing a paper, or just curious, Prove My Point helps you prove your point with real research.
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/sign-in")}
                                className="hero-button"
                            >
                                <span className="truncate">Get Started</span>
                            </button>

                        </div>

                        {/* Methodology Section */}
                        <div className="section">
                            <div>
                                <h1 className="section-title">🔍 Our Methodology</h1>
                                <p className="section-description">
                                    We leverage advanced AI techniques to extract knowledge from research papers and present it in a clear and concise manner.
                                </p>
                            </div>

                            <div className="card-grid">
                                <div className="card">
                                    <div className="text-white" data-icon="MagnifyingGlass" data-size="24px"
                                        data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2>Question Analysis</h2>
                                        <p>Our AI analyzes your question to understand its intent and identify relevant
                                            research areas</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="text-white" data-icon="Brain" data-size="24px" data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,1-36-36V80a8,8,0,0,1,16,0v4a20,20,0,0,0,20,20h4A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1,0-16h4A20,20,0,0,0,80,84V80a8,8,0,0,1,16,0v4A36,36,0,0,1,60,120Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2>Knowledge Extraction</h2>
                                        <p>We extract key information and insights from a vast database of research papers.</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="text-white" data-icon="PresentationChart" data-size="24px"
                                        data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2>Answer Synthesis</h2>
                                        <p>We synthesize the
                                            extracted knowledge to provide a comprehensive and accurate answer.</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div class="text-white" data-icon="File" data-size="24px" data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2>Source Attribution</h2>
                                        <p>We provide clear citations and links to the original research papers used to
                                            generate the answer, ensuring transparency and allowing for further exploration.</p>
                                    </div>
                                </div>

                            </div>

                            {/* Why Use */}
                            <h2 className="benefit-title">✅ Why Use Prove My Point?</h2>
                            <div className="card-grid">
                                {["Research-backed answers", "Source citations included", "Personalized, private history", "No fluff, no deception", "Beautiful & intuitive interface"].map((label, i) => (
                                    <div key={i} className="benefit">
                                        <div class="text-white" data-icon="Check" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <h2>{label}</h2>
                                    </div>
                                ))}
                            </div>

                            {/* Who is it for */}
                            <div>
                                <h2 className="benefit-title">👥 Who Is It For?</h2>
                                {[['🎓 Students & Researchers', 'Find reliable sources and insights for your assignments or projects.'], ['🎙️ Debaters, Podcasters & Creators', 'Strengthen your arguments with research-based facts.'], ['🤔 Curious Minds', 'Explore big questions and get trustworthy answers without the noise.']].map(([title, desc], i) => (
                                    <div key={i} className="target-group">
                                        <div>
                                            <p>{title}</p>
                                            <p>{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="footer-separator">---</p>

                        </div>

                        <footer className="footer-wrapper">
                            <div className="footer-container">
                                <footer className="footer-content">
                                    <div className="footer-links">
                                        <a className="footer-link" href="https://github.com/skupperr">Made with 💖 by Asif</a>
                                        <a className="footer-link" href="https://github.com/skupperr/Prove-My-Point">GitHub</a>
                                    </div>
                                    <p className="footer-copy">© 2025 Prove My Point. All rights reserved.</p>
                                </footer>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        </div>

    );


}