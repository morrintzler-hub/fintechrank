'use client'
import { useEffect, useRef, useState } from 'react'

// Deterministic pseudo-random to avoid hydration mismatches
function seededRandom(seed) {
  let s = seed
  return function() {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateMesh(width, height) {
  const rand = seededRandom(42)
  const cols = Math.ceil(width / 120) + 2
  const rows = Math.ceil(height / 100) + 2
  const nodes = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jitterX = (rand() - 0.5) * 60
      const jitterY = (rand() - 0.5) * 50
      nodes.push({
        id: `${row}-${col}`,
        x: col * 120 - 60 + jitterX,
        y: row * 100 - 50 + jitterY,
        size: rand() * 2 + 1,
        opacity: rand() * 0.4 + 0.15,
      })
    }
  }

  // Connect nearby nodes
  const edges = []
  const maxDist = 180
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < maxDist && edges.length < 200) {
        edges.push({
          id: `${i}-${j}`,
          x1: nodes[i].x, y1: nodes[i].y,
          x2: nodes[j].x, y2: nodes[j].y,
          opacity: Math.max(0.03, 0.12 - (dist / maxDist) * 0.09),
        })
      }
    }
  }

  // Pulse paths — long diagonal traversals
  const pulses = []
  const pulseCount = Math.min(12, Math.floor(width / 120))
  for (let i = 0; i < pulseCount; i++) {
    const r = seededRandom(i * 99 + 7)
    const startX = r() * width * 1.2 - width * 0.1
    const startY = r() * height * 1.2 - height * 0.1
    const angle = r() * 60 - 30 // -30 to +30 degrees from horizontal
    const len = width * (0.4 + r() * 0.5)
    const rad = angle * Math.PI / 180
    pulses.push({
      id: i,
      x1: startX, y1: startY,
      x2: startX + Math.cos(rad) * len,
      y2: startY + Math.sin(rad) * len,
      duration: 3 + r() * 4,
      delay: r() * 6,
      size: 2.5 + r() * 2,
    })
  }

  return { nodes, edges, pulses }
}

export default function MeshBackground({ height = 560 }) {
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ width: 1400, height })
  const [mesh, setMesh] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth
      setDims({ width: w, height })
      setMesh(generateMesh(w, height))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [height])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes pulse-move {
          0%   { offset-distance: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes node-twinkle {
          0%, 100% { opacity: var(--node-op); transform: scale(1); }
          50%       { opacity: calc(var(--node-op) * 1.8); transform: scale(1.5); }
        }
        .mesh-pulse {
          will-change: offset-distance, opacity;
          animation: pulse-move var(--dur) ease-in-out var(--delay) infinite;
        }
        .mesh-node {
          will-change: opacity, transform;
          transform-box: fill-box;
          transform-origin: center;
          animation: node-twinkle var(--twinkle-dur) ease-in-out var(--twinkle-delay) infinite;
        }
      `}</style>

      {mounted && mesh && (
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${dims.width} ${height}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Soft bloom filter for pulses */}
            <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Fade edges at top and bottom */}
            <linearGradient id="fade-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="12%"  stopColor="white" stopOpacity="1" />
              <stop offset="88%"  stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fade-mask">
              <rect width="100%" height="100%" fill="url(#fade-v)" />
            </mask>

            {/* Pulse path definitions */}
            {mesh.pulses.map(p => (
              <path
                key={`pdef-${p.id}`}
                id={`ppath-${p.id}`}
                d={`M ${p.x1} ${p.y1} L ${p.x2} ${p.y2}`}
                fill="none"
              />
            ))}
          </defs>

          <g mask="url(#fade-mask)">
            {/* Connection edges */}
            {mesh.edges.map(e => (
              <line
                key={e.id}
                x1={e.x1} y1={e.y1}
                x2={e.x2} y2={e.y2}
                stroke="#94a3b8"
                strokeWidth="0.6"
                opacity={e.opacity}
              />
            ))}

            {/* Nodes */}
            {mesh.nodes.map((n, i) => (
              <circle
                key={n.id}
                cx={n.x} cy={n.y}
                r={n.size}
                fill="#cbd5e1"
                className="mesh-node"
                style={{
                  '--node-op': n.opacity,
                  '--twinkle-dur': `${4 + (i % 7)}s`,
                  '--twinkle-delay': `${(i % 11) * 0.4}s`,
                  opacity: n.opacity,
                }}
              />
            ))}

            {/* Data pulses */}
            {mesh.pulses.map(p => (
              <circle
                key={p.id}
                r={p.size}
                fill="#38bdf8"
                filter="url(#bloom)"
                className="mesh-pulse"
                style={{
                  '--dur': `${p.duration}s`,
                  '--delay': `${p.delay}s`,
                  offsetPath: `path('M ${p.x1} ${p.y1} L ${p.x2} ${p.y2}')`,
                  offsetRotate: '0deg',
                }}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}
