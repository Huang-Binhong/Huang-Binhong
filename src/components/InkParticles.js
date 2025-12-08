import React, { useEffect, useRef } from 'react';
import './InkParticles.css';

class InkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.size = Math.random() * 4 + 2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.color = color;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.size *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 水墨形状
        ctx.fillStyle = this.color;
        ctx.beginPath();

        // 不规则水墨形状
        const points = 6;
        for (let i = 0; i < points; i++) {
            const angle = (Math.PI * 2 * i) / points;
            const radius = this.size * (0.8 + Math.random() * 0.4);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();

        // 水墨晕染效果
        ctx.globalAlpha = this.life * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

function InkParticles() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 更新和绘制粒子
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.update();
                particle.draw(ctx);
                return !particle.isDead();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        // 创建粒子效果的函数
        const createInkEffect = (x, y, color = '#3B4F3A') => {
            const particleCount = 20 + Math.random() * 15;
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new InkParticle(x, y, color));
            }
        };

        // 监听点击事件
        const handleClick = (e) => {
            createInkEffect(e.clientX, e.clientY, '#3B4F3A');
        };

        // 监听滚动事件（节流）
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
                const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
                createInkEffect(x, y, 'rgba(59, 79, 58, 0.6)');
            }, 100);
        };

        // 监听按钮点击（通过自定义事件）
        const handleButtonClick = (e) => {
            const { x, y, color } = e.detail;
            createInkEffect(x, y, color || '#D4A451');
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('inkEffect', handleButtonClick);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('inkEffect', handleButtonClick);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="ink-particles-canvas" />;
}

export default InkParticles;
