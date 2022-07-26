import {gsap} from "gsap";

export default class Animator {

	async attack (targetPokeman, currentPokeman) {
        let initX = currentPokeman.container.x;
        let initY = currentPokeman.container.y;
        let tl = gsap.timeline({paused: false});
        
        currentPokeman.spriteAttack.alpha = 0.5;

		await tl.to(currentPokeman.spriteAttack,  {delay: 1, x: targetPokeman.container.x, y: targetPokeman.container.y, duration: 2});
        await tl.to(currentPokeman.spriteAttack,  {delay: 1, x: initX, y: initY, duration: 2});
        await this._blinkTargetPokeman(targetPokeman, tl);
	}

    async _blinkTargetPokeman (targetPokeman, tl) {
        for (let i = 0; i < 3; i++) {
            await tl.fromTo(targetPokeman.sprite,  {alpha: 0},{alpha: 1, duration: 1})
        }
    }
}