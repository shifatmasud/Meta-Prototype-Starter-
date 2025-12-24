/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { motion } from 'framer-motion';

interface StateLayerProps {
  color: string;
  isActive: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 🔮 THE STATE LAYER
 * An interactive soul that provides organic feedback relative to touch/cursor position.
 */
const StateLayer: React.FC<StateLayerProps> = ({ color, isActive, x, y, width, height }) => {
  // Calculate the diameter needed to cover the button from the furthest corner.
  // We multiply by 2.5 to ensure the radius comfortably covers the entire area with margin.
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

  const rippleStyles: React.CSSProperties = {
    position: 'absolute',
    top: y,
    left: x,
    width: 0,
    height: 0,
    backgroundColor: color,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.15, // Visual rule: 15% opacity for state layer interactions
    pointerEvents: 'none',
  };

  return (
    <div style={styles}>
      <motion.div
        style={rippleStyles}
        initial={false}
        animate={{
          width: isActive ? maxDiameter : 0,
          height: isActive ? maxDiameter : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 25,
          mass: 0.5,
        }}
      />
    </div>
  );
};

export default StateLayer;
