import Navbar from '../components/layout/navbar.jsx';
import HeroSection from '../components/heroSection/HeroSection.jsx';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particles = [];
    const colors = ['#4C6FFF', '#22D3EE', '#8B5CF6', '#FFB547'];

    class DataNode {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 6 + 3;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalSize = this.size;
        this.pulse = Math.random();
      }

      update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          this.size = this.originalSize * 1.7;
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        } else {
          this.size = this.originalSize;
          this.x += this.speedX;
          this.y += this.speedY;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        this.pulse += 0.02;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;

        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color;

        const pulseSize = this.size + Math.sin(this.pulse) * 1.2;

        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 60; i++) {
      particles.push(new DataNode());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            const strength = 1 - distance / 160;
            ctx.strokeStyle = `rgba(76, 111, 255, ${strength * 0.4})`;
            ctx.lineWidth = strength * 2;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);

            const cpX = (particles[i].x + particles[j].x) / 2;
            const cpY = (particles[i].y + particles[j].y) / 2;

            ctx.quadraticCurveTo(cpX, cpY, particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      particles.forEach((p) => {
        p.update(mousePosition);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Dark premium background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A0F1F] via-[#101B33] to-[#0A0F1F]" />

      {/* Canvas animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-1" />

      {/* Soft overlay for depth */}
      <div className="absolute inset-0 z-2 bg-gradient-to-b from-transparent to-[#0A0F1F]/60" />

      {/* Micro pulses */}
      <div className="absolute inset-0 z-3">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              width: '4px',
              height: '4px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: '#4C6FFF',
              borderRadius: '50%',
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-52 pb-12 min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <HeroSection />
        </main>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
