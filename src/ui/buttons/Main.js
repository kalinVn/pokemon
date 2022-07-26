import Shape from "../Shape.js";
import {Text} from 'pixi.js';

class Main {
	constructor () {
		this.shape = new Shape();
        this.container;
	}

	async create (label) {
		let params = {
			regX : 0,
			regY : 0,
			width : 140,
			height : 60,
			x : 0,
			y : 0,
			radius : 0,
			color : '0x00000'
		}

        this.container = await this.shape.drawRect(params);
		this.container.buttonMode = true;
		this.container.interactive = true;

        let text = new Text(label, {
            fontFamily : 'Arial', 
            fontSize: 27, 
            fill : 0xffffff
        });

		text.anchor.set(0.5, 0.5);
		text.x = this.container.width / 2;
		text.y = this.container.height / 2;
        this.container.addChild(text);

		return this.container;
	}

    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }
}

export default  Main;