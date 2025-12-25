/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useTheme } from '../../Theme.tsx';
import { motion, type MotionValue } from 'framer-motion';
import StateLayer from './StateLayer.tsx';
import RippleLayer, { Ripple } from './RippleLayer.tsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'S' | 'M' | 'L';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  icon?: string;
  onClick?: () => void;
  customFill?: string;
  customColor?: string;
  customRadius?: string | MotionValue<string>;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'M',
  label,
  icon,
  onClick,
  customFill,
  customColor,
  customRadius,
  disabled = false,
}, ref) => {
  const { theme } = useTheme();
  
  // Interaction State
  const [isHovered, setIsHovered] = useState(false);
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Helper to calculate relative coordinates
  const getCoords = (e: React.PointerEvent | React.MouseEvent) => {
    const buttonEl = e.currentTarget as HTMLButtonElement;
    const rect = buttonEl.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  // Pointer Event Handlers
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (disabled) return;
    const { x, y, width, height } = getCoords(e);
    setCoords({ x, y });
    setDimensions({ width, height });
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled) return;
    const { x, y } = getCoords(e);
    setCoords({ x, y });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const { x, y, width, height } = getCoords(e);
    setCoords({ x, y });
    setDimensions({ width, height });
    // Note: We do NOT trigger ripples here anymore to avoid 'touch' start ripples.
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Trigger Ripple on valid Click/Tap only
    const { width, height } = getCoords(e);
    let { x, y } = getCoords(e);

    // Handle Keyboard click (coordinates are 0)
    if (e.detail === 0) {
       x = width / 2;
       y = height / 2;
    }

    setRipples(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);

    // Forward event
    if (onClick) onClick();
  };

  const handleRippleComplete = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  // Style Logic
  const getVariantStyles = () => {
    const baseContent = customColor || theme.Color.Base.Content[1];
    
    switch (variant) {
      case 'primary':
        return {
          background: customFill || theme.Color.Accent.Surface[1],
          color: customColor || theme.Color.Accent.Content[1],
          border: 'none',
          boxShadow: theme.effects['Effect.Shadow.Drop.2'],
        };
      case 'secondary':
        return {
          background: customFill || theme.Color.Base.Surface[2],
          color: baseContent,
          border: 'none',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: baseContent,
          border: `1px solid ${theme.Color.Base.Content[3]}`,
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: baseContent,
          border: 'none',
        };
      default:
        return {
          background: theme.Color.Accent.Surface[1],
          color: theme.Color.Accent.Content[1],
          border: 'none',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'S': return { height: '32px', padding: `0 ${theme.spacing['Space.M']}`, fontSize: theme.Type.Readable.Label.S.fontSize };
      case 'L': return { height: '56px', padding: `0 ${theme.spacing['Space.XL']}`, fontSize: theme.Type.Readable.Label.L.fontSize };
      case 'M': 
      default: return { height: '44px', padding: `0 ${theme.spacing['Space.L']}`, fontSize: theme.Type.Readable.Label.M.fontSize };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Combined Styles
  const styles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing['Space.S'],
    // borderRadius is handled dynamically below
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
    fontWeight: 600,
    fontFamily: theme.Type.Readable.Label.M.fontFamily,
    transition: `transform ${theme.time['Time.1x']} ease, box-shadow ${theme.time['Time.1x']} ease`,
    ...variantStyles,
    ...sizeStyles,
  };

  // Feedback Color Derivation
  const feedbackColor = variant === 'primary' ? theme.Color.Accent.Content[1] : theme.Color.Base.Content[1];
  
  // State Layer Opacity (Hover/Active presence only)
  const stateLayerOpacity = 0.1; 

  // New styles for content to prevent selection/dragging
  const contentStyles: React.CSSProperties = {
    zIndex: 1,
    position: 'relative',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  return (
    <motion.button
      ref={ref}
      style={{
        ...styles,
        borderRadius: customRadius || theme.radius['Radius.Full'],
      }}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      whileTap={{ scale: 0.96 }}
    >
      {/* 
        Decoupled Layers:
        1. StateLayer: Persistent active state. Physics-based spotlight.
        2. RippleLayer: Transient tap burst.
      */}
      <StateLayer 
        color={customColor || feedbackColor} 
        isActive={isHovered} 
        opacity={stateLayerOpacity}
        x={coords.x} 
        y={coords.y} 
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      <RippleLayer
        color={customColor || feedbackColor}
        ripples={ripples}
        onRippleComplete={handleRippleComplete}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {icon && <i className={`ph-bold ${icon}`} draggable={false} style={{ ...contentStyles, fontSize: '1.25em' }} />}
      <span draggable={false} style={contentStyles}>{label}</span>
    </motion.button>
  );
});

export default Button;