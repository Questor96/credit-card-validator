import React, { useState, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import {validate} from "class-validator"
import {plainToClass} from "class-transformer"
import {CardRequestBody, CardResponseBody} from "common"

function App() {
  // initialize state variables
  const cardResponseBody: CardResponseBody = {response: false};
  const [cardNum, setCardNum] = useState("");
  const [response, setResponse] = useState<CardResponseBody>(cardResponseBody);
  const [errMsg, setErrMsg] = useState("");
  const [resultDisplay, setResultDisplay] = useState("");

  // emoji pointers, for reference
  const check: string = "0x2705"
  const cross: string = "0x274C"
  const warning: string = "0x26A0"

  // handle visual updates for valid response
  // invalid responses left to individual handlers
  async function updateResultDisplay(body: CardResponseBody) {
    setErrMsg("")
    if (body.response) {
      setResultDisplay(check)
    } else {
      setResultDisplay(cross)
    }
  };

  // Better to use generic typing if we were validating other response types as well
  // Leaving as single-use function for now
  async function handleCardValidationApiResponse(resJson: any) {
    let body = plainToClass(CardResponseBody, resJson as Object);
    let validationErrors = await validate(body);
    if (validationErrors.length > 0) {
      setResultDisplay(warning)
      setErrMsg("Received an invalid response from server")
    } else {
      setResponse(body);
      updateResultDisplay(body);
    }
  };

  async function fetchCardValidation() {
    const cardRequestBody: CardRequestBody = new CardRequestBody(+cardNum);
    const validationErrors = await validate(cardRequestBody)
    if (validationErrors.length > 0) {
      setResultDisplay(warning)
      setErrMsg("Please enter a positive integer")
    }
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
          setResultDisplay(warning)
          setErrMsg("Server denied request")
      }
    } catch (e) {
      setResultDisplay(warning)
      setErrMsg("Failed to fetch from API")
    }
  }
  return (
    <div className="App">
      <label>Credit Card Number</label>
      <br/>
      <input
        type="text"
        name="number"
        value={cardNum}
        onChange={(changeEvent: ChangeEvent<HTMLInputElement>) => {
          setCardNum(changeEvent.target.value)
      }}/>
      <button onClick={() => fetchCardValidation()}>Check If Valid</button>
      <br/>
      <div className="resultDisplayEmoji">
        {String.fromCodePoint(+resultDisplay)}
      </div>
      <div>
        {errMsg}
      </div>
    </div>
  );
}

export default App;
