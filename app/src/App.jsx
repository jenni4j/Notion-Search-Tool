import { useState } from 'react'

import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const callCohereAPI = async () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    // Create a FormData object to send the file and the question to the backend
    const formData = new FormData();
    formData.append("question", question);


    try {
      const response = await fetch('http://localhost:3000/api/ask', {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
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
          <button onClick={callCohereAPI}>Get Results</button>
        </div>
      {answer && (
        <div className="answer-section">
          <h3>Here are some links:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}


export default App
