/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useState, useMemo } from 'react';
import { useTheme } from '../../Theme.tsx';
import { motion, MotionValue } from 'framer-motion';
import StateLayer from './StateLayer.tsx';

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

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'M',
  label,
  icon,
  onClick,
  customFill,
  customColor,
  customRadius,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Interaction State
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Interaction Logic
  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      
      setCoords({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
      setIsActive(true);
    }
  };

  const handleInteractionEnd = () => {
    setIsActive(false);
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
    transition: `transform ${theme.time['Time.1x']} ease`, // Removed border-radius transition for smoother MotionValue updates
    ...variantStyles,
    ...sizeStyles,
  };

  // State Layer Color derivation
  const stateLayerColor = variant === 'primary' ? theme.Color.Accent.Content[1] : theme.Color.Base.Content[1];

  return (
    <motion.button
      ref={buttonRef}
      style={{
        ...styles,
        borderRadius: customRadius || theme.radius['Radius.Full'],
      }}
      onClick={onClick}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      whileTap={{ scale: 0.96 }}
    >
      <StateLayer 
        color={customColor || stateLayerColor} 
        isActive={isActive} 
        x={coords.x} 
        y={coords.y} 
        width={dimensions.width} 
        height={dimensions.height} 
      />
      
      {icon && <i className={`ph-bold ${icon}`} style={{ fontSize: '1.25em', zIndex: 1, position: 'relative' }} />}
      <span style={{ zIndex: 1, position: 'relative' }}>{label}</span>
    </motion.button>
  );
};

export default Button;