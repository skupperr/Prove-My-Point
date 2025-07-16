import React from 'react';
import './questionAnswer.css';

export default function searchAnswer({ data }) {
  if (!data) return null;

  const { question, explanation, answer, sources } = data;



  return (

    <div className="container">
      <div className="layout">
        <div className="content">

          <div className="search-wrapper">
            <div className="search-bar">

              <h1>{question}</h1>
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
