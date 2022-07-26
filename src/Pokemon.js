import  Server from "./Server.js";
import Loader from "./lib/Loader.js";
import HpBar from "./ui/bars/HpBar.js";
import Shape from "./ui/Shape.js";
import Button from "./ui/buttons/Collapse.js";

import {Text, Container} from 'pixi.js';

export default class Pokemon {	

	constructor (store, app) {
		this.name;
        this.ability;
        this.speed;
        this.specialDefense;
        this.specialAttack;
        this.defense;
        this.attack;
        this.sprites;
        this.index;
        this.collapseBtn;
        this.hp;
        this.hpOrigin;
        this.collapseBox;
        this.collapseBoxState = 'close';
        this.movesMargin  = 4;
        this.name = store.name;
        this.app  = app;
        this.url  = store.url;

        this._server   = new Server();
        this._loader   = new Loader();
        this._button   = new Button();
        this._shape    = new Shape();
        this.hpBarObj  = new HpBar();
	}

    async create (posX, posY) {
        this.container   = new Container();
        this.container.x = posX;
        this.container.y = posY;
       

        let result  = await this._server.fetch(this.url);
        this.sprites = result.sprites;

        this._setAbility(result.abilities);
        this._setSprite();
        this._setName();
        this._setMoves(result.moves.slice(result.moves.length - this.movesMargin));
        this._setStats(result.stats);
        this._setCollapseBtn(result.stats);
        this._setCollapseBox();
        this.hpBar = await this.hpBarObj.create();

        this.container.addChild(this.pokemanName);
        this.container.addChild(this.sprite);
        this.container.addChild(this.hpBar);
        this.container.addChild(this.collapseBtn);

        return this.container;
    }

    async addAttackerSprite () {
        this.spriteAttack   = await this._loader.loadSprite(this.sprites.front_default);
        this.spriteAttack.x = this.container.x;
        this.spriteAttack.y = this.container.y;
        this.spriteAttack.alpha = 0;
    }

    _setAbility (abilities) {
        if (this._getAbility(abilities)) {
            let abilityName = this._getAbility(abilities);
            this.abilityName = new Text(`Ability: ${abilityName}`, {fontFamily : 'Arial', fontSize: 12, fill : 'white'});
            this.abilityName.x   = this.movesMargin;
            this.abilityName.y   = 0;
        }
    }

    _setName () {
        this.pokemanName = new Text(`Name: ${this.name}`, {fontFamily : 'Arial', fontSize: 12, fill : 'yellow'});
		this.pokemanName.x   = this.movesMargin;
        this.pokemanName.y   = 90;
    }

    _setSprite (abilities) {
        this.textureDefault     = PIXI.Texture.from(this.sprites.front_default);
        this.sprite             = new PIXI.Sprite(this.textureDefault);
        this.sprite.interactive = true;
        this.sprite.buttonMode  = true
    }

    _setMoves (moves) {
        this.moves = [];
        let step = 1;
        let stepSize = 5;
        const startPosMoveY = 10;
        
        moves.forEach((item, index) => {
            let moveText = new Text(`Move ${index + 1}: ${item.move.name}`, {fontFamily: 'Arial', fontSize: 12, fill: 'white'});
            moveText.x   = 4;
            moveText.y   = startPosMoveY + 3 * step;
            step += stepSize;
            this.moves.push(moveText);
        });
    }

    async _setCollapseBox () {
        this.collapseBox = new Container();
        this.collapseBox.y = 10;
        let params = {
			regX : 0,
			regY : 0,
			width : 230,
			height : 260,
			x : 0,
			y : 0,
			radius : 0,
			color : '0x7f8aad'
		}
       
        this.collapseBoxShape = await this._shape.drawRect(params);
        this.collapseBox.addChild(this.collapseBoxShape);
        this.collapseBox.addChild(this.abilityName);
        this.moves.forEach( (item) => {
            this.collapseBox.addChild(item);
        });
        
        this.stats.forEach( (item) => {
            this.collapseBox.addChild(item);
        });
        
    }

    _onCollapseBtnClick () {
        this.collapseBox.x = this.container.x + this.collapseBtn.x;
        this.collapseBox.y = this.container.y + this.collapseBtn.y + 40;

        if (this.collapseBoxState == 'close') {
            this.app.app.stage.addChild(this.collapseBox);
            this.collapseBoxState = 'open';
        } else {
            this.app.app.stage.removeChild(this.collapseBox);
            this.collapseBoxState = 'close';
        }
    }

    async _setCollapseBtn () {
        this.collapseBtn   = await this._button.create('More Details');
        this.collapseBtn.on('click', () => {
            this._onCollapseBtnClick();
        });
        this.collapseBtn.x = 10;
        this.collapseBtn.y = 145;
    }

    _setStats (stats) {
        this.stats          = [];
        let step            = 1;
        let stepSize        = 5;
        const startPosMoveY = 72;
        const stepIncrease  = 3;

        stats.forEach( (item) => {
            this[item.stat.name] = item.base_stat;
            let statText = new Text(`${item.stat.name.toUpperCase()}: ${item.base_stat}`, {fontFamily : 'Arial', fontSize: 12, fill : 'white'});
            statText.x   = 3;
            statText.y   = startPosMoveY + (stepIncrease * step);
            step += stepSize;
            this.stats.push(statText);
        });
        this.hpOrigin = this.hp;
    }

    _getAbility (abilities) {
        let result = abilities.find(function(ability) {return !ability.is_hidden;});
        if (result) {
            return result.ability.name;
        }
    }

}