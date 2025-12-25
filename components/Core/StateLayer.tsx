/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { motion } from 'framer-motion';

export interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface StateLayerProps {
  color: string;
  isActive: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  ripples?: Ripple[];
  onRippleComplete?: (id: number) => void;
}

/**
 * 🔮 THE STATE LAYER
 * An interactive soul that provides organic feedback relative to touch/cursor position.
 * Now features both a persistent 'active' state and transient 'ripple' bursts.
 */
const StateLayer: React.FC<StateLayerProps> = ({ 
  color, 
  isActive, 
  x, 
  y, 
  width, 
  height,
  opacity = 0.15,
  ripples = [],
  onRippleComplete
}) => {
  // Calculate the diameter needed to cover the button from the furthest corner.
  const maxDiameter = Math.hypot(width, height) * 2.5;

  const styles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    zIndex: 0,
  };

  // The existing persistent press layer (User likes this)
  const activeLayerStyles: React.CSSProperties = {
    position: 'absolute',
    top: y,
    left: x,
    width: 0,
    height: 0,
    backgroundColor: color,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  };

  return (
    <div style={styles}>
      {/* 1. Persistent Active State (Hold & Hover) */}
      <motion.div
        style={activeLayerStyles}
        initial={false}
        animate={{
          width: isActive ? maxDiameter : 0,
          height: isActive ? maxDiameter : 0,
          opacity: isActive ? opacity : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 25,
          mass: 0.5,
        }}
      />

      {/* 2. Transient Ripples (Click/Tap) */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{
            width: 0,
            height: 0,
            opacity: 0.35, // Increased opacity for better visibility
          }}
          animate={{
            width: maxDiameter,
            height: maxDiameter,
            opacity: 0,
            filter: 'blur(16px)', // Softer blur
          }}
          style={{
            position: 'absolute',
            top: ripple.y,
            left: ripple.x,
            backgroundColor: color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
          transition={{
            duration: 3.0, // Ultra-gentle duration
            ease: [0.16, 1, 0.3, 1], // Very soft ease-out
          }}
          onAnimationComplete={() => onRippleComplete && onRippleComplete(ripple.id)}
        />
      ))}
    </div>
  );
};

export default StateLayer;