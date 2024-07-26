import {IsInt, IsBoolean} from "class-validator";

// request and response classes
export class CardRequestBody {
    @IsInt()
    cardNum: number;

    constructor(cardNum: number) {
        this.cardNum = cardNum;
    }
}
export class CardResponseBody {
    @IsBoolean()
    response: boolean;

    constructor(response: boolean) {
        this.response = response;
    }
}
