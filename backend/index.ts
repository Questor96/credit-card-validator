import express, {RequestHandler, Request, Response, NextFunction} from 'express';
import cors from "cors";
import {validate} from "class-validator";
import {plainToClass} from 'class-transformer';
import {CardRequestBody, CardResponseBody} from 'common';

const app = express();
app.use(express.json() as RequestHandler);
app.use(cors()); // Disable in production, don't have a production flag yet tho

/**
 * Validates that an integer passes the Luhn algorithm and is therefore a
 *   potentially valid credit card number
 * 
 *   Luhn algorithm: https://en.wikipedia.org/wiki/Luhn_algorithm
 * 
 * @param cardNum integer of any length
 * @returns true if cardNum passes Luhn algorithm check
 */

function luhnValidator(cardNum: number): boolean {
    const cardStr = String(cardNum)
    const lastNum: number = +cardStr.charAt(cardStr.length - 1);
    let checkSum: number = 0;
    let doubleThisDigit: boolean = true;  // double the first digit encountered
    
    for (let i = cardStr.length - 2; i >= 0; i--) {
        // get the appropriate info for updating the checksum
        let localDigitInfo: String
        if (doubleThisDigit) {
            localDigitInfo = String(2 * +cardStr.charAt(i));
        } else {
            localDigitInfo = cardStr.charAt(i);
        }

        // Update checkSum using localDigitInfo
        for (let j = 0; j < localDigitInfo.length; j++) {
            checkSum += +localDigitInfo.charAt(j);
        }
        
        // Flip doubling bit
        doubleThisDigit = !doubleThisDigit;
    }
    //console.log('expected checksum: ' + (10 - (checkSum % 10)));
    return lastNum == (10 - (checkSum % 10));
};


/**
 * Determine if a given string of integers is a valid credit card number
 * 
 * req.body.cardNum - an int
 */
app.post('/api/validate-card', async function (req: Request, res: Response) {
    let body = plainToClass(CardRequestBody, req.body as Object);
    //console.log(body)
    let validationErrors = await validate(body);
    if (validationErrors.length > 0) {
        //console.log('validation errors: ' + validationErrors);
        
        // TODO: pass validation errors forward to user
        res.status(400);
    } else {
        const result: boolean = luhnValidator(body.cardNum);
        const validationResponseBody: CardResponseBody = new CardResponseBody(result);
        res.contentType('boolean');
        res.status(200);
        res.send(validationResponseBody);
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Press Ctrl+C to quit')
});