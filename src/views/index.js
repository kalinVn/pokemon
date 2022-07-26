import * as PIXI from 'pixi.js';
import Game from "../Game.js";
import "./style.css";

global.PIXI = PIXI;

let game = new Game();
game.init();
