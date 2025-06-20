import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // Ajustar para alta densidad de píxeles (retina):
    const dpr = window.devicePixelRatio || 1;

    function resize(ctx: CanvasRenderingContext2D) {
      if (!canvas) return;
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx.scale(dpr, dpr);
    }
    resize(ctx);
    window.addEventListener('resize', () => resize(ctx));

    // Crear estrellas
    const stars: Star[] = [];
    const numStars = 200; // ajusta cantidad: más = más densidad
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const radius = Math.random() * 1.2 + 0.3; // tamaños variados
      // velocidad según tamaño para simular profundidad: más grande => más rápido
      const speed = (radius / 1.5) * 0.5 + 0.2;
      const opacity = Math.random() * 0.5 + 0.5;
      stars.push({ x, y, radius, speed, opacity });
    }

    function draw() {
      if (!ctx) return;
      // Pinta un fondo semitransparente para efecto de “estelas suaves”:
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Dibuja cada estrella:
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Actualizar posición: por ejemplo moverse hacia abajo:
        star.y += star.speed;
        // Si sale de pantalla, reingresar por arriba:
        if (star.y > window.innerHeight) {
          star.y = 0;
          star.x = Math.random() * window.innerWidth;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
}
