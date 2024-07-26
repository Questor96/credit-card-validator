import React, { useState, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import {validate} from "class-validator"
import {plainToClass} from "class-transformer"
import {CardRequestBody, CardResponseBody} from "common"

function App() {
  // initialize state variables
  const cardResponseBody: CardResponseBody = {response: false};
  const [cardNum, setCardNum] = useState("Card Number");
  const [response, setResponse] = useState<CardResponseBody>(cardResponseBody);

  // Better to use generic typing if we were validating other response types as well
  // Leaving as single-use function for now
  async function handleCardValidationApiResponse(resJson: any) {
    let body = plainToClass(CardResponseBody, resJson as Object);
    let validationErrors = await validate(body);
    if (validationErrors.length > 0) {
      setResponse({response: false});
    } else {
      setResponse(body);
    }
  };

  async function fetchCardValidation() {
    const cardRequestBody: CardRequestBody = new CardRequestBody(+cardNum);

    try {
      const response = await fetch(
        'http://localhost:8080/api/validate-card',
        {
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
          method: "POST",
          body: JSON.stringify(cardRequestBody)
      });

      if (response.status === 200) {
          response.json().then(handleCardValidationApiResponse);
      } else {
          setResponse({response: false})
      }
    } catch (e) {
      setResponse({response: false})
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <label>Name</label><br/>
            <input
              id="name"
              type="text"
              value={cardNum} 
              onChange={(changeEvent: ChangeEvent<HTMLInputElement>) => {
                setCardNum(changeEvent.target.value)
            }}/>
            <br/><br/>
            <button onClick={() => fetchCardValidation()}>Call API</button>
            <br/><br/>
            <textarea readOnly={true} style={{height: "200px"}} value={String(response.response)}></textarea>
    </div>
  );
}

export default App;
