import Shape from "../Shape.js";
import {Text} from 'pixi.js';

class Collapse {
	constructor () {
		this.shape = new Shape();
        this.container;
	}

	async create (label) {
		let params = {
			regX : 0,
			regY : 0,
			width : 80,
			height : 25,
			x : 0,
			y : 0,
			radius : 0,
			color : '0x1eb3d9'
		}

        this.container = await this.shape.drawRect(params);
		this.container.buttonMode = true;
		this.container.interactive = true;

        let text = new Text(label, {
            fontFamily : 'Arial', 
            fontSize: 12, 
            fill : 0x00000
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

export default Collapse;