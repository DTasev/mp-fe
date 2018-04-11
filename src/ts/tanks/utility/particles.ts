import { Tank } from "../objects/tank";

export class Particles {
    private static getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static explosion(tank: Tank, duration = 400) {
        //create div element, and do not position
        const p = document.createElement("div");
        p.style.top = `${tank.position.y - Tank.WIDTH}px`;
        p.style.left = `${tank.position.x - Tank.WIDTH}px`;
        // NOTE: position MUST be set after the top & left coordinates are set, otherwise the element is not on the correct place!
        p.style.position = "absolute";


        const numParticles = 24;

        for (let i = 0; i < numParticles; ++i) {
            // add N child elements which are the particles
            // add the correct animation to each child
            const particle = document.createElement("div");
            particle.classList.add("tanks-explosion-particle");

            particle.animate([
                { // from
                    opacity: 1,
                    transform: `translate(0px, 0px)`,
                    width: "32px",
                    height: "32px"
                },
                { // to
                    opacity: 0.3,
                    transform: `translate(${this.getRandomInt(0, 240) - 120}px, ${this.getRandomInt(0, 240) - 120}px)`,
                    width: "8px",
                    height: "8px"
                }
            ], {
                    duration: duration,
                    easing: "cubic-bezier(.15,.87,.72,.9)",
                });
            p.appendChild(particle);
        }
        document.body.appendChild(p);

        // Remove the particle elements from the DOM
        // using the 'animationend' event on each particle does not seem
        // to ever get triggered, so this is a workaround to remove the elements 
        // from the DOM some time after the animation is over
        setTimeout(() => {
            document.body.removeChild(p);
        }, duration + 500);
    }
}