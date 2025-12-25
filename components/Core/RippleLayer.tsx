/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleLayerProps {
  color: string;
  ripples: Ripple[];
  onRippleComplete: (id: number) => void;
  width: number;
  height: number;
}

/**
 * 💧 RIPPLE LAYER
 * Handles transient burst animations (ripples) for click/tap interactions.
 * Decoupled from the persistent state layer for better performance and separation of concerns.
 */
const RippleLayer: React.FC<RippleLayerProps> = ({ 
  color, 
  ripples, 
  onRippleComplete,
  width,
  height
}) => {
  // Calculate the diameter needed to cover the component from the center or furthest corner.
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

  return (
    <div style={styles}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.35, // Visible start opacity
            }}
            animate={{
              width: maxDiameter,
              height: maxDiameter,
              opacity: 0,
              filter: 'blur(16px)', // Soft blur on expansion
            }}
            exit={{ opacity: 0 }}
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
              duration: 3.0, // Ultra-gentle duration (Premium feel)
              ease: [0.16, 1, 0.3, 1], // Very soft ease-out
            }}
            onAnimationComplete={() => onRippleComplete(ripple.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RippleLayer;