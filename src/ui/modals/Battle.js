import Shape from "../Shape.js";
import Button from "../buttons/Main.js";

import {Container} from 'pixi.js';


class Battle {

	constructor(){
		this.shape = new Shape();
        this.button = new Button();
	}

	async create () { 
        let params = {
            regX: 0,
            regY: 0,
            width: 1460,
            height: 750,
            color: 0x224144

        }

        let container = new Container();
        let shape = await this.shape.drawRect(params);
        container.addChild(shape);

        this.playAgainBtn = await this.button.create('PlayAgain');
        this.playAgainBtn.alpha = 0;
        let x = container.width / 2 - this.playAgainBtn.width / 2;
        let y = 200
        this.button.setPosition(x, y);
        container.addChild(this.playAgainBtn);

        return container;
	}

    showPlayAgainBtn () { 
        this.playAgainBtn.alpha = 1;
    }

}

export default Battle;