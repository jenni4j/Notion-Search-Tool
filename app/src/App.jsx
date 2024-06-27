import { useState } from 'react'

import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);

  const callAPIs = async () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    // Create a FormData object to send the question to the backend
    const formData = new FormData();
    formData.append("question", question);


    try {
      const response = await fetch('http://localhost:8000/api/ask', {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error calling the API", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Notion Link Search</h1>
      </header>
        <div className="question-input">
          <textarea
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What subject do you want to dive into?"
            cols={100}
            rows={3}
          />
        </div>
        <div className="submit-button">
          <button onClick={callAPIs}>Get Results</button>
        </div>
        {results.length > 0 && (
        <div className="answer-section">
          <h3>Here are some links:</h3>
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


export default App
