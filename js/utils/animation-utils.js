// ===========================================
// Animation Utilities
// ===========================================
// Generic animation helpers for interactive visualizations.
// These are subject-agnostic and can be used as-is.
// ===========================================

const AnimationUtils = {
    // Currently running animations
    animations: new Map(),
    
    // Start an animation loop
    startAnimation: (id, updateFn, renderFn) => {
        if (AnimationUtils.animations.has(id)) {
            AnimationUtils.stopAnimation(id);
        }
        
        let lastTime = performance.now();
        let running = true;
        
        const loop = (currentTime) => {
            if (!running) return;
            
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            updateFn(deltaTime);
            renderFn();
            
            requestAnimationFrame(loop);
        };
        
        AnimationUtils.animations.set(id, { stop: () => { running = false; } });
        requestAnimationFrame(loop);
    },
    
    // Stop an animation
    stopAnimation: (id) => {
        const anim = AnimationUtils.animations.get(id);
        if (anim) {
            anim.stop();
            AnimationUtils.animations.delete(id);
        }
    },
    
    // Stop all animations
    stopAll: () => {
        AnimationUtils.animations.forEach(anim => anim.stop());
        AnimationUtils.animations.clear();
    },
    
    // --- EASING FUNCTIONS ---
    
    easingFunctions: {
        linear: t => t,
        easeIn: t => t * t,
        easeOut: t => t * (2 - t),
        easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        elastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 :
                Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
        bounce: t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) return n1 * t * t;
            if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
            if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    },
    
    // --- UTILITY FUNCTIONS ---
    
    // Tween a value over time (returns current value each frame)
    tween: (from, to, duration, easingName = 'easeInOut', onUpdate) => {
        const startTime = performance.now();
        const easingFn = AnimationUtils.easingFunctions[easingName];
        
        const update = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const easedProgress = easingFn(progress);
            const value = from + (to - from) * easedProgress;
            
            if (onUpdate) onUpdate(value, progress);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },
    
    // Animate canvas with progress callback
    animateCanvas: (canvas, ctx, duration, drawFrameFn) => {
        return new Promise(resolve => {
            const startTime = performance.now();
            
            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawFrameFn(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    },
    
    // Pulse effect (0 → 1 → 0)
    pulse: (t, frequency = 1) => {
        return 0.5 * (1 - Math.cos(2 * Math.PI * frequency * t));
    },
    
    // Oscillate between min and max values
    oscillate: (t, min, max, frequency = 1) => {
        const normalized = 0.5 * (1 + Math.sin(2 * Math.PI * frequency * t));
        return min + (max - min) * normalized;
    },
    
    // Interpolate between two value arrays
    interpolateArrays: (arr1, arr2, t) => {
        return arr1.map((v1, i) => v1 + (arr2[i] - v1) * t);
    },
    
    // Create a path follower
    followPath: (path, speed = 1) => {
        let currentIndex = 0;
        let segmentProgress = 0;
        
        return {
            update: (deltaTime) => {
                if (currentIndex >= path.length - 1) return path[path.length - 1];
                
                const p1 = path[currentIndex];
                const p2 = path[currentIndex + 1];
                const segmentLength = Math.sqrt(
                    (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
                );
                
                segmentProgress += (speed * deltaTime) / segmentLength;
                
                if (segmentProgress >= 1) {
                    currentIndex++;
                    segmentProgress = 0;
                }
                
                const t = Math.min(segmentProgress, 1);
                return {
                    x: p1.x + (p2.x - p1.x) * t,
                    y: p1.y + (p2.y - p1.y) * t
                };
            },
            reset: () => {
                currentIndex = 0;
                segmentProgress = 0;
            },
            isComplete: () => currentIndex >= path.length - 1
        };
    }
};

// Make available globally
window.AnimationUtils = AnimationUtils;
