/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StateLayerProps {
  color: string;
  isActive: boolean;
  sessionKey?: number; // Unique key to identify hover session
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

/**
 * 🔮 STATE LAYER (Hover / Touch Spotlight)
 * An interactive soul that provides organic feedback relative to touch/cursor position.
 * Handles persistent 'active' state (Hover) with graceful exit/entry transitions.
 */
const StateLayer: React.FC<StateLayerProps> = ({ 
  color, 
  isActive, 
  sessionKey = 0,
  x, 
  y, 
  width, 
  height,
  opacity = 0.3, 
}) => {
  // Calculate diameter to ensure full coverage
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
        {isActive && (
          <motion.div
            key={sessionKey} // Crucial: Ensures new hover session creates a NEW element, allowing the old one to exit gracefully
            style={{
              position: 'absolute',
              top: y,
              left: x,
              backgroundColor: color,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0,
            }}
            animate={{
              width: maxDiameter,
              height: maxDiameter,
              opacity: opacity,
            }}
            exit={{
              opacity: 0,
              // We maintain the size or even expand slightly to feel "released"
              // Importantly, it stays at the Last Known Position (LKP) because props don't update on exiting nodes
            }}
            transition={{
              duration: 3.0, // Slow, premium hover effect
              ease: [0.2, 0, 0, 1], // Custom deep ease-out curve
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StateLayer;