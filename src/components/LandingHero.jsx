import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IconRocket, IconNeural, IconAgent, IconBolt } from './TerminalIcons';
import './LandingHero.css';

/* ── Neural Network Canvas ─────────────────────────────────── */
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const particlesRef = useRef([]);
  const [status, setStatus] = useState({ storage: 'SYNC', chain: 'SYNC', compute: 'SYNC', memory: 'INIT' });

  const ACCENT = '#7c3aed';
  const ACCENT_DIM = 'rgba(124, 58, 237, 0.15)';
  const ACCENT_GLOW = 'rgba(124, 58, 237, 0.4)';
  const NODE_COUNT = 18;
  const PARTICLE_COUNT = 35;

  // Initialize nodes
  const initNodes = useCallback((w, h) => {
    const nodes = [];
    // Central core node
    nodes.push({
      x: w * 0.5, y: h * 0.45,
      baseX: w * 0.5, baseY: h * 0.45,
      radius: 18, type: 'core', label: 'MEMORIA',
      vx: 0, vy: 0, phase: 0,
    });

    // Inner ring — 0G components
    const innerLabels = ['0G_STORAGE', '0G_CHAIN', '0G_COMPUTE'];
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
      const r = Math.min(w, h) * 0.22;
      nodes.push({
        x: w * 0.5 + Math.cos(angle) * r,
        y: h * 0.45 + Math.sin(angle) * r,
        baseX: w * 0.5 + Math.cos(angle) * r,
        baseY: h * 0.45 + Math.sin(angle) * r,
        radius: 12, type: 'infra', label: innerLabels[i],
        vx: 0, vy: 0, phase: i * 2.1,
      });
    }

    // Outer ring — agents/partners
    const outerLabels = ['AGENT_01', 'AGENT_02', 'ALPHA_J', 'SOLTUTOR', 'OPENCLAW'];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 6;
      const r = Math.min(w, h) * 0.38;
      nodes.push({
        x: w * 0.5 + Math.cos(angle) * r,
        y: h * 0.45 + Math.sin(angle) * r,
        baseX: w * 0.5 + Math.cos(angle) * r,
        baseY: h * 0.45 + Math.sin(angle) * r,
        radius: 8, type: 'agent', label: outerLabels[i],
        vx: 0, vy: 0, phase: i * 1.3,
      });
    }

    // Floating ambient nodes
    for (let i = nodes.length; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        radius: 3 + Math.random() * 3, type: 'ambient',
        vx: 0, vy: 0, phase: Math.random() * Math.PI * 2,
      });
    }
    return nodes;
  }, []);

  // Initialize particles
  const initParticles = useCallback((w, h) => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.3 + Math.random() * 1.2,
        targetNode: Math.floor(Math.random() * 4), // target inner nodes
        progress: Math.random(),
        fromNode: 0,
        size: 1.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * 2; // retina
      canvas.height = h * 2;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(2, 2);
      nodesRef.current = initNodes(w, h);
      particlesRef.current = initParticles(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // Boot sequence
    const bootTimers = [
      setTimeout(() => setStatus(s => ({ ...s, storage: 'OK' })), 600),
      setTimeout(() => setStatus(s => ({ ...s, chain: 'OK' })), 1200),
      setTimeout(() => setStatus(s => ({ ...s, compute: 'OK' })), 1800),
      setTimeout(() => setStatus(s => ({ ...s, memory: 'LIVE' })), 2400),
    ];

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // ── Update node positions (floating + mouse repulsion) ──
      nodes.forEach((node) => {
        // Gentle floating
        node.x = node.baseX + Math.sin(time * 0.8 + node.phase) * (node.type === 'core' ? 2 : 5);
        node.y = node.baseY + Math.cos(time * 0.6 + node.phase * 1.3) * (node.type === 'core' ? 2 : 5);

        // Mouse attraction/repulsion
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            if (node.type === 'core') {
              // Core is attracted slightly
              node.x += dx * force * 0.01;
              node.y += dy * force * 0.01;
            } else {
              // Others are repelled
              node.x -= dx * force * 0.03;
              node.y -= dy * force * 0.03;
            }
          }
        }
      });

      // ── Draw connections ──
      // Core to infra
      for (let i = 1; i <= 3; i++) {
        const from = nodes[0];
        const to = nodes[i];
        const pulse = (Math.sin(time * 3 + i) + 1) / 2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 + pulse * 0.2})`;
        ctx.lineWidth = 1 + pulse * 0.5;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -time * 30;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Infra to agents
      for (let i = 1; i <= 3; i++) {
        for (let j = 4; j < 9; j++) {
          const from = nodes[i];
          const to = nodes[j];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < Math.min(w, h) * 0.45) {
            const alpha = Math.max(0, 0.06 - (dist / (Math.min(w, h) * 0.45)) * 0.06);
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Ambient connections
      nodes.forEach((a, i) => {
        if (a.type !== 'ambient') return;
        nodes.forEach((b, j) => {
          if (i >= j) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Connect to mouse
        if (mouse.active) {
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // ── Draw particles (flowing data) ──
      particles.forEach((p) => {
        const from = nodes[p.fromNode];
        const to = nodes[p.targetNode];
        if (!from || !to) return;

        p.progress += p.speed * 0.008;
        if (p.progress >= 1) {
          p.progress = 0;
          p.fromNode = p.targetNode;
          p.targetNode = Math.floor(Math.random() * Math.min(9, nodes.length));
          if (p.fromNode === p.targetNode) p.targetNode = 0;
        }

        p.x = from.x + (to.x - from.x) * p.progress;
        p.y = from.y + (to.y - from.y) * p.progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity * (0.5 + Math.sin(time * 4 + p.progress * Math.PI) * 0.5)})`;
        ctx.fill();
      });

      // ── Draw nodes ──
      nodes.forEach((node) => {
        if (node.type === 'core') {
          // Pulsing glow
          const pulseR = node.radius + Math.sin(time * 2) * 3;
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseR * 2.5);
          grad.addColorStop(0, ACCENT_GLOW);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseR * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Core ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.fill();

          // Inner dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = ACCENT;
          ctx.fill();

        } else if (node.type === 'infra') {
          // Square node for infra
          const s = node.radius;
          ctx.fillStyle = '#fff';
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 1.5;
          ctx.fillRect(node.x - s, node.y - s, s * 2, s * 2);
          ctx.strokeRect(node.x - s, node.y - s, s * 2, s * 2);

          // Label
          ctx.font = '600 7px "Space Mono", monospace';
          ctx.fillStyle = ACCENT;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + s + 12);

        } else if (node.type === 'agent') {
          // Diamond shape for agents
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(Math.PI / 4);
          const s = node.radius * 0.7;
          ctx.fillStyle = ACCENT_DIM;
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 1;
          ctx.fillRect(-s, -s, s * 2, s * 2);
          ctx.strokeRect(-s, -s, s * 2, s * 2);
          ctx.restore();

          // Label
          ctx.font = '600 6px "Space Mono", monospace';
          ctx.fillStyle = 'rgba(124, 58, 237, 0.6)';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + node.radius + 10);

        } else {
          // Ambient dots
          const pulse = (Math.sin(time * 1.5 + node.phase) + 1) / 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * (0.6 + pulse * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${0.08 + pulse * 0.12})`;
          ctx.fill();
        }
      });

      // ── Mouse cursor node ──
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT_GLOW;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      bootTimers.forEach(clearTimeout);
    };
  }, [initNodes, initParticles]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div className="neural-canvas-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="neural-canvas" />

      {/* System Status Overlay */}
      <div className="neural-status-overlay terminal-font">
        <div className="status-header">
          <span className="status-dots">● ● ●</span>
          <span className="status-title">SISTEMA_NEURAL</span>
        </div>
        <div className="status-body">
          <div className={`status-line ${status.storage === 'OK' ? 'ok' : 'sync'}`}>
            STORAGE: [{status.storage}]
          </div>
          <div className={`status-line ${status.chain === 'OK' ? 'ok' : 'sync'}`}>
            CHAIN:   [{status.chain}]
          </div>
          <div className={`status-line ${status.compute === 'OK' ? 'ok' : 'sync'}`}>
            COMPUTE: [{status.compute}]
          </div>
          <div className={`status-line ${status.memory === 'LIVE' ? 'live' : 'sync'}`}>
            MEMORY:  [{status.memory}]
          </div>
        </div>
        <div className="status-footer">
          ❯ NEURAL_LINK<span className="cursor-blink">▮</span>
        </div>
      </div>
    </div>
  );
};

/* ── Hero Component ────────────────────────────────────────── */
const LandingHero = () => {
  return (
    <section className="landing-hero" id="hero">
      <div className="hero-grid-container">
        {/* Left Content */}
        <div className="hero-content-left">
          <div className="hero-badge terminal-font">
            <span className="blink">●</span> SYSTEM_READY: 0G_ARISTOTLE_MAINNET
          </div>
          
          <h1 className="hero-main-title heading-font cyber-glitch-text" data-text="DECENTRALIZED MEMORY STANDARD">
            DECENTRALIZED<br/>
            <span className="text-gradient-cyan">MEMORY STANDARD</span>
          </h1>
          
          <p className="hero-desc terminal-font">
            The permanent memory layer for the AI Agent economy.<br/>
            Secure, verifiable, and perpetually searchable neural storage powered by 0G.
          </p>

          <div className="hero-cta-wrapper">
            <Link to="/app" className="btn-hero-primary heading-font">
              ENTER_SYSTEM__❯
            </Link>
            <Link to="/docs" className="btn-hero-secondary terminal-font">
              VIEW_DOCS__❯
            </Link>
          </div>

          <div className="hero-metrics terminal-font">
            <div className="metric">
              <span className="m-label">THROUGHPUT_</span>
              <span className="m-val"><IconRocket size={12} className="icon-accent" /> MAX</span>
            </div>
            <div className="metric">
              <span className="m-label">LATENCY_</span>
              <span className="m-val">~42ms</span>
            </div>
            <div className="metric">
              <span className="m-label">VERSION_</span>
              <span className="m-val">v0.1.0-α</span>
            </div>
          </div>
        </div>

        {/* Right Visual — Interactive Neural Network */}
        <div className="hero-visual-right">
          <NeuralCanvas />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
