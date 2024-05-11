import React, { useEffect, useRef } from 'react';
import "./style.css"

const Index = () => {
    const particleContainer = useRef(null);

    const createParticle = () => {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // Randomize particle size and position
        const size = Math.random() * 2 + 5; // Between 5px and 10px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random();

        // Randomize animation duration and delay
        particle.style.animationDuration = `${Math.random() * 2 + 1}s`; // 1 to 3 seconds
        particle.style.animationDelay = `-${Math.random() * 2}s`; // Start at different times

        return particle;
    };

    useEffect(() => {
        for (let i = 0; i < 50; i++) { // Create 50 particles
            const particle = createParticle();
            particleContainer.current.appendChild(particle);
        }
    }, []);

    return <div ref={particleContainer} className="particles-background"></div>;
};

export default Index;
