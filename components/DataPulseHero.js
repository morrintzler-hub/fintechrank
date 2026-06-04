'use client'
import { useEffect, useRef, useState } from 'react'

// Lightweight SVG-based pulse animation
// No framer-motion dependency for this component - pure CSS animations
// for maximum FCP performance. Framer Motion used only in FeatureWidgets.

const NODES = [
  { id: 'payments',  label: 'Payments',  angle: 0,   color: '#2563eb', icon: '💳' },
  { id: 'banking',   label: 'Banking',   angle: 60,  color: '#009e80', icon: '🏦' },
  { id: 'crypto',    label: 'Crypto',    angle: 120, color: '#7c3aed', icon: '₿'  },
  { id: 'investing', label: 'Investing', angle: 180, color: '#d97706', icon: '📈' },
  { id: 'lending',   label: 'Lending',   angle: 240, color: '#dc2626', icon: '💰' },
  { id: 'business',  label: 'Business',  angle: 300, color: '#16a34a', icon: '🏢' },
]

const R = 130  // orbit radius
const CX = 220 // center x
const CY = 220 // center y

function toXY(angle, radius = R) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

export default function DataPulseHero({ accentColor = '#009e80' }) {
  const [mounted, setMounted] = useState(false)
  const [activeNode, setActiveNode] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{
      width: '100%', maxWidth: 440, margin: '0 auto',
      position: 'relative', userSelect: 'none',
    }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes data-travel {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes core-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes node-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .pulse-ring {
          animation: pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .core-circle {
          animation: core-breathe 3s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .data-dot {
          animation: data-travel 2s ease-in-out infinite;
          offset-rotate: 0deg;
        }
        .node-group {
          animation: node-float 4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
          cursor: pointer;
        }
      `}</style>

      <svg viewBox="0 0 440 440" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          {NODES.map((node) => {
            const pos = toXY(node.angle)
            return (
              <path
                key={`path-${node.id}`}
                id={`orbit-${node.id}`}
                d={`M ${pos.x} ${pos.y} Q ${CX} ${pos.y} ${CX} ${CY}`}
                fill="none"
              />
            )
          })}
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind core */}
        <circle cx={CX} cy={CY} r="80" fill="url(#core-grad)" />

        {/* Connection lines */}
        {NODES.map((node) => {
          const pos = toXY(node.angle)
          const isActive = activeNode === node.id
          return (
            <line
              key={`line-${node.id}`}
              x1={pos.x} y1={pos.y}
              x2={CX} y2={CY}
              stroke={isActive ? node.color : '#e2e6ea'}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray="4 4"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
          )
        })}

        {/* Animated data pulses */}
        {NODES.map((node, i) => {
          const pos = toXY(node.angle)
          const d = `M ${pos.x} ${pos.y} Q ${CX} ${pos.y} ${CX} ${CY}`
          return (
            <circle
              key={`dot-${node.id}`}
              r="4"
              fill={node.color}
              filter="url(#glow)"
              style={{
                offsetPath: `path('${d}')`,
                animation: `data-travel ${2.2 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          )
        })}

        {/* Peripheral category nodes */}
        {NODES.map((node, i) => {
          const pos = toXY(node.angle)
          const isActive = activeNode === node.id
          return (
            <g
              key={node.id}
              className="node-group"
              style={{ animationDelay: `${i * 0.5}s` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => window.location.href = `/category/${node.id}`}
            >
              {/* Pulse ring on hover */}
              {isActive && (
                <circle
                  cx={pos.x} cy={pos.y} r="22"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  className="pulse-ring"
                  style={{ opacity: 0.5 }}
                />
              )}
              {/* Node circle */}
              <circle
                cx={pos.x} cy={pos.y} r="20"
                fill={isActive ? node.color : '#ffffff'}
                stroke={node.color}
                strokeWidth={isActive ? 0 : 1.5}
                style={{ transition: 'all 0.25s', filter: isActive ? 'url(#glow)' : 'none' }}
              />
              {/* Icon */}
              <text
                x={pos.x} y={pos.y + 6}
                textAnchor="middle"
                fontSize="14"
                style={{ pointerEvents: 'none' }}
              >
                {node.icon}
              </text>
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + (node.angle > 90 && node.angle < 270 ? 38 : -26)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fontFamily="Manrope,sans-serif"
                fill={isActive ? node.color : '#6a85a8'}
                style={{ transition: 'fill 0.25s' }}
              >
                {node.label}
              </text>
            </g>
          )
        })}

        {/* Core node */}
        <g className="core-circle">
          <circle cx={CX} cy={CY} r="42" fill={accentColor} opacity="0.08" />
          <circle cx={CX} cy={CY} r="34" fill="#ffffff" stroke={accentColor} strokeWidth="1.5" />
          <text
            x={CX} y={CY - 6}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fontFamily="Manrope,sans-serif"
            fill={accentColor}
            letterSpacing="1"
          >
            THE
          </text>
          <text
            x={CX} y={CY + 8}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fontFamily="Manrope,sans-serif"
            fill={accentColor}
            letterSpacing="1"
          >
            FINTECH
          </text>
          <text
            x={CX} y={CY + 22}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fontFamily="Manrope,sans-serif"
            fill={accentColor}
            letterSpacing="1"
          >
            RANK
          </text>
        </g>

        {/* Orbit ring */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="#e8eaed"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      </svg>
    </div>
  )
}
