'use client';

import { useEffect, useRef } from 'react';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Trail particles
    interface TrailParticle {
      x: number;
      y: number;
      life: number;
    }

    const trail: TrailParticle[] = [];
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Add new trail particle
      trail.push({
        x: mouseX,
        y: mouseY,
        life: 1
      });

      // Limit trail length
      if (trail.length > 20) {
        trail.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      trail.forEach((particle, index) => {
        particle.life -= 0.05;

        if (particle.life > 0) {
          const size = 8 * particle.life;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size
          );
          
          gradient.addColorStop(0, `rgba(0, 255, 136, ${particle.life * 0.3})`);
          gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Remove dead particles
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life <= 0) {
          trail.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}
