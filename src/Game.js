import {Application} from "pixi.js";
import {Text} from 'pixi.js';

import Pokemon from "./Pokemon.js";
import Server from "./Server.js";
import Loader from "./lib/Loader.js";
import Animator from "./lib/Animator.js";
import Battle from "./ui/modals/Battle.js";

import {FETCH_API_URL} from './Config.js';


export default class Game {	

	constructor () {
		this._server   = new Server();
        this._loader   = new Loader();
		this._battle   = new Battle();
		this._animator = new Animator();
	}

	init () {
		this.pokemons = [];
		this.app = new Application( {width : 1460, height : 750, backgroundColor: 0x1e1f1d});
		this.app.stage.interactive = true;
		document.body.appendChild(this.app.view);
		document.querySelector('.filter-pokemans').addEventListener('click', () => {this._onFilterPokemansClick()});
		this._play();
	} 

	async _play () {
		this._pokemans    = [];
		this._battleModal = null;
		this._isBattle 	  = false;

		let response = await this._server.fetch(FETCH_API_URL);
		this.pokemons = response.results;
		this._create(this.pokemons);
	}

	async _onPokemanClick (e, index) {
		if (this._isBattle) return;
		
		let opponentIndex, min, max;
		this._isBattle = true;

		if (index == 0) {
			min = Math.ceil(index);
			max = Math.floor(this._pokemans.length -1);
			opponentIndex = this._generateRandNumber(min, max);
		} else if (index == this._pokemans.length - 1) {
			min = 0;
			max = Math.floor(this._pokemans.length -2);
			opponentIndex = this._generateRandNumber(min, max);
		} else {
			let opponentIndexes = [];
			let opponentIndexUp   = this._generateRandNumber(index + 1, this._pokemans.length - 1);
			let opponentIndexDown = this._generateRandNumber(0, index - 1);

			opponentIndexes.push(opponentIndexUp);
			opponentIndexes.push(opponentIndexDown);
			opponentIndex = opponentIndexes[Math.floor(Math.random() * 2)];
		}
		
		this._showBattleModal(index, opponentIndex);
	}
	
	async _showBattleModal (selectedIndex, opponentIndex) {
		this._battleModal = await this._battle.create();
		this.app.stage.addChild(this._battleModal);
		this.pokemanSelected = new Pokemon(this.pokemons[selectedIndex], this);
		this.pokemanOpponent = new Pokemon(this.pokemons[opponentIndex], this);
		
		let pokemanSelectedContainer = await this.pokemanSelected.create(200, 100);
		let pokemanOpponentContainer = await this.pokemanOpponent.create(1100, 100);
		
		this._battleModal.addChild(pokemanSelectedContainer);
		this._battleModal.addChild(pokemanOpponentContainer);
		
		this._startBattle();
	}

	async _startBattle () {
		this._addBattleMessageText();
		this._battleModal.addChild(this.startBattleMessage);
		this.attakerName = this.pokemanOpponent.name;
		await this.pokemanOpponent.addAttackerSprite();
		await this.pokemanSelected.addAttackerSprite();
		this.app.stage.addChild(this.pokemanOpponent.spriteAttack);
		this.app.stage.addChild(this.pokemanSelected.spriteAttack);
		await this._attack(0);
	}

	async _attack (index) {
		let isOpponentAttack = false;
		let defenseHp = 0;
		let attackerName;
		let hpOrigin;
		let defensObj;
		
		if (this.attakerName == this.pokemanSelected.name) {
			this.startBattleMessage.text = `${this.pokemanSelected.name} attack`;
			this.attakerName = this.pokemanOpponent.name;
			await this._animator.attack(this.pokemanOpponent, this.pokemanSelected);
			isOpponentAttack = true;
		} else {
			this.startBattleMessage.text = `${this.pokemanOpponent.name} attack`;
			this.attakerName = this.pokemanSelected.name;
			await this._animator.attack(this.pokemanSelected, this.pokemanOpponent);
		}
		
		if (isOpponentAttack) {
			defenseHp = this._calculateAttackedPokemanHP(this.pokemanSelected, this.pokemanOpponent);
			attackerName = this.pokemanSelected.name;
			hpOrigin = this.pokemanSelected.hpOrigin;
			defensObj = this.pokemanOpponent;
		} else {
			defenseHp = this._calculateAttackedPokemanHP(this.pokemanOpponent, this.pokemanSelected);
			attackerName = this.pokemanOpponent.name;
			hpOrigin = this.pokemanOpponent.hpOrigin;
			defensObj = this.pokemanSelected;
		}
		
		if (defenseHp > 0) {
			let damagePercent = this._calculateDamagePercent(defenseHp, hpOrigin);
			defensObj.hpBarObj.decrease(damagePercent);
			this._attack(index);
		} else {
			this._gameOver(attackerName);
			defensObj.hpBarObj.removeContainerRed();
		}
	}

	_calculateDamagePercent (curentHP, originHP) {
		return (curentHP / originHP) * 100;
	}

	_gameOver (attackerName) {
		if (attackerName == this.pokemanSelected.name) {
			this.startBattleMessage.text = `Game over.You win`;
		} else {
			this.startBattleMessage.text = `Game over.You loose`;
		}
		
		this._battle.showPlayAgainBtn();
		this._battle.playAgainBtn.on('click', () => {
			this._onPlayAgainBtnClick();
		});
	}

	_onPlayAgainBtnClick () {
		this._clear();
		this._play();
	}

	_clear () {
		while (this.app.stage.children.length > 0) {   
			var child = this.app.stage.getChildAt(0);  
			this.app.stage.removeChild(child);
		}
	}

	_calculateAttackedPokemanHP (defensObj, pokemonAttack) {
		let randNumberDevided = Math.floor(Math.random() * 1) + 200;
		defensObj.hp -= (pokemonAttack.attack * defensObj.defense) / randNumberDevided;

		return defensObj.hp;
	}

	_generateRandNumber (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min)) + min;
	}

	_addBattleMessageText () {
		this.startBattleMessage = new Text(`The battle start. ${this.pokemanOpponent.name} attack`, {
            fontFamily : 'Arial', 
            fontSize: 22, 
            fill : 0xffffff
        });
		
		this.startBattleMessage.anchor.set(0.5, 0.5);
		this.startBattleMessage.x = this._battleModal.width / 2;
		this.startBattleMessage.y = 100;
	}

	_onFilterPokemansClick () {
		if (this._isBattle) return;
		this.pokemonsFiltered = [];
		this._clear();
		let searchStringPokaman = document.querySelector('.filter-pokemans-input').value;
		
		this.pokemons.forEach((pokeman) => {
			if (!pokeman.name.indexOf(searchStringPokaman)) {
				this.pokemonsFiltered.push(pokeman);
			}
		});

		this._create(this.pokemonsFiltered );
	}

	_create (pokemons) {
		let posX 	 = 0;
		let posY 	 = 70;

		pokemons.forEach(async (pokemon, index) => {
			if (index> 0) posX += 150;
			if (index == 10) {
				posY += 200;
				posX = 0;
			}
			
			let pokemanObj = new Pokemon(pokemon, this);
			this._pokemans.push(pokemanObj);
			let pokemanContainer = await pokemanObj.create(posX, posY);
			this.app.stage.addChild(pokemanContainer);

			pokemanObj.sprite.on('click', (e) => {
				this._onPokemanClick(e, index);
			});
		});
	}
	
}