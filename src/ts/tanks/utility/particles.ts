import { Tank } from "../objects/tank";
import { ITheme } from "../themes/iTheme";

export class Particles {
    private static getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 
     * @param tank The tank that WILL EXPLODE
     * @param duration The duration of the explosion animation
     * @param numParticles The number of particles in the explosion
     * @param maxDistance The maximum distance that the particles will travel
     */
    static explosion(tank: Tank, duration = 800, numParticles = 24, maxDistance = 240) {
        // create a holder div element, with an ABSOLUTE position inside the body
        // the absolute position is (about) the center of the tank
        const particleContainer = document.createElement("div");
        particleContainer.style.top = `${tank.position.y - Tank.WIDTH}px`;
        particleContainer.style.left = `${tank.position.x - Tank.WIDTH}px`;
        // NOTE: position MUST be set after the top & left coordinates are set, otherwise the element is not on the correct place!
        particleContainer.style.position = "absolute";

        const color = tank.colors.explosion;

        // create all the particles, each one 
        for (let i = 0; i < numParticles; ++i) {
            // add N child elements which are the particles
            // add the correct animation to each child
            const particle = document.createElement("div");
            particle.classList.add("tanks-explosion-particle");
            particle.style.backgroundColor = color;

            particle.animate([
                { // from
                    opacity: 1,
                    transform: `translate(0px, 0px)`,
                    width: "32px",
                    height: "32px"
                },
                { // to
                    opacity: 0.3,
                    transform: `translate(${this.getRandomInt(0, maxDistance) - maxDistance / 2}px, ${this.getRandomInt(0, maxDistance) - maxDistance / 2}px)`,
                    width: "8px",
                    height: "8px"
                }
            ], {
                    duration: duration,
                    easing: "cubic-bezier(.15,.87,.72,.9)",
                });
            particleContainer.appendChild(particle);
        }
        document.body.appendChild(particleContainer);

        // After the end of the animation the particles will go inside the particleContainer, but will be invisible
        // with the CSS they have after the end of the animation. This will remove the particle elements from the DOM.
        // Do not use the 'animationend' event on each particle, as it does NOT SEEM to ever get triggered, thus the 
        // elements are never removed from the DOM and are wasting memory
        setTimeout(() => {
            document.body.removeChild(particleContainer);
        }, duration + 500);
    }

    static smoke(tank: Tank, duration = 3000) {
        const particle = document.createElement("div");
        particle.style.top = `${tank.position.y - Tank.WIDTH * 2 - 2}px`;
        particle.style.left = `${tank.position.x - Tank.WIDTH - 2}px`;
        // NOTE: position MUST be set after the top & left coordinates are set, otherwise the element is not on the correct place!
        particle.style.position = "absolute";
        particle.style.fontSize = "36px";
        particle.style.opacity = "0";
        particle.style.zIndex = "-1";
        particle.style.color = tank.colors.smoke;
        particle.textContent = "O";
        particle.animate([
            {
                transform: `rotate(0deg) translateY(0px)`,
                opacity: 1,
                filter: `blur(0px)`
            },
            {
                transform: `rotate(45deg) translateY(-200px)`,
                opacity: 0,
                filter: `blur(20px)`
            }
        ], duration);

        document.body.appendChild(particle);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, duration + 100);
    }
}