import Shape from "../Shape.js";

class HpBar {
	constructor () {
		this._shape = new Shape();
        this._containerBlack;
        this._containerRed;
        this.lastWidth = 80;
	}

	async create () {
        let paramsBlack = {
			regX : 0,
			regY : 0,
			width : 80,
			height : 20,
			x : 10,
			y : 0,
			radius : 0,
			color : '0x000000'
		}

        let paramsRed = {
			regX : 0,
			regY : 0,
			width : 80,
			height : 15,
			x : 10,
			y : 2.5,
			radius : 0,
			color : '0x3c7526'
		}

        this._containerBlack = await this._shape.drawRect(paramsBlack);
        this._containerRed = await this._shape.drawRect(paramsRed);
        this._containerBlack.addChild(this._containerRed);
        this._containerBlack.y = 120;
        
        return this._containerBlack;
    }

    async decrease (percent) {
        this._containerBlack.removeChild(this._containerRed);
        let result = (percent / 100) * this.lastWidth;
        this.lastWidth -= result;
        let params= {
			height : 15,
			x : 10,
			y : 2.5,
			radius : 0,
			color : '0x3c7526'
		}

        if (this.lastWidth < this._containerBlack.width / 2 && this.lastWidth > this._containerBlack.width / 10 ) {
            params.color = '0xd1cf4d';
        }
        if (this.lastWidth < this._containerBlack.width / 10) {
            params.color = '0xFF0000';
        }

        params.width = this.lastWidth;
        this._containerRed = await this._shape.drawRect(params);
        this._containerBlack.addChild(this._containerRed);
    }

    removeContainerRed () {
        this._containerRed.width = 0;
    }
}

export default  HpBar;