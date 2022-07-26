import { utils} from "pixi.js";

class Loader {

    constructor () {
        this.loader = new PIXI.Loader();
    }
    
    loadSprite(url){
        return new Promise( (resolve, reject) => {
            let rudder = PIXI.Sprite.from(url);
            resolve(rudder);
        });
    }

    clearCache(){
		utils.clearTextureCache();
		this.loader.reset();
    }

}

export default  Loader;
