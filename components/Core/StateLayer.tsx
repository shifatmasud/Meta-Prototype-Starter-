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
  opacity?: number;
}

/**
 * 🔮 STATE LAYER
 * An interactive soul that provides organic feedback relative to touch/cursor position.
 * Handles the persistent 'active' state (Hover/Press) that follows the user's pointer.
 */
const StateLayer: React.FC<StateLayerProps> = ({ 
  color, 
  isActive, 
  x, 
  y, 
  width, 
  height,
  opacity = 0.15,
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
      {/* Persistent Active State (Hold & Hover) */}
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
    </div>
  );
};

export default StateLayer;