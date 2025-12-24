/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import Button from '../Core/Button.tsx';
import { MetaButtonProps } from '../../types/index.tsx';
import { useElementAnatomy, ElementAnatomy, NormalizedRect } from '../../hooks/useElementAnatomy.tsx';

// --- HELPER TYPES & COMPONENTS ---

type StageButtonProps = Omit<MetaButtonProps, 'customRadius'> & {
  customRadius: any; // Allow MotionValue
}

interface StageProps {
  btnProps: StageButtonProps;
  onButtonClick: () => void;
  showMeasurements: boolean;
  showTokens: boolean;
}

/**
 * 📐 Technical Dimension Line
 * Renders a crisp SVG line with end ticks and a centered label.
 */
const DimensionLine = ({ 
    x1, y1, x2, y2, label, offset = 0, color, position = 'top' 
}: { 
    x1: number; y1: number; x2: number; y2: number; label: string; offset?: number; color: string; position?: 'top' | 'bottom' | 'left' | 'right' 
}) => {
    const { theme } = useTheme();
    
    // Calculate perpendicular offset
    let dx = 0, dy = 0;
    if (position === 'top') dy = -offset;
    if (position === 'bottom') dy = offset;
    if (position === 'left') dx = -offset;
    if (position === 'right') dx = offset;

    const ox1 = x1 + dx, oy1 = y1 + dy;
    const ox2 = x2 + dx, oy2 = y2 + dy;
    
    // Label Position
    const lx = (ox1 + ox2) / 2;
    const ly = (oy1 + oy2) / 2;
    
    // Tick Marks (Perpendicular small lines at ends)
    const TICK_SIZE = 4;
    let tx = 0, ty = 0;
    if (position === 'top' || position === 'bottom') ty = TICK_SIZE;
    if (position === 'left' || position === 'right') tx = TICK_SIZE;

    const style: React.CSSProperties = {
        ...theme.Type.Expressive.Data,
        fontSize: '10px',
        fill: color,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        fontWeight: 500,
        letterSpacing: '0.05em',
        pointerEvents: 'none',
    };
    
    // Label Background to clear lines
    const bgStyle: React.CSSProperties = {
        fill: theme.Color.Base.Surface[1],
        opacity: 0.9,
    };

    const textWidth = label.length * 6 + 8; // Approx width

    return (
        <g>
             {/* Guide Lines (from object to dimension line) */}
            <line x1={x1} y1={y1} x2={ox1} y2={oy1} stroke={color} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 2" />
            <line x1={x2} y1={y2} x2={ox2} y2={oy2} stroke={color} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 2" />

            {/* Main Dimension Line */}
            <line x1={ox1} y1={oy1} x2={ox2} y2={oy2} stroke={color} strokeWidth="1" />
            
            {/* End Ticks */}
            <line x1={ox1 - tx} y1={oy1 - ty} x2={ox1 + tx} y2={oy1 + ty} stroke={color} strokeWidth="1" />
            <line x1={ox2 - tx} y1={oy2 - ty} x2={ox2 + tx} y2={oy2 + ty} stroke={color} strokeWidth="1" />
            
            {/* Label */}
            <rect x={lx - textWidth/2} y={ly - 6} width={textWidth} height={12} style={bgStyle} />
            <text x={lx} y={ly} style={style}>{label}</text>
        </g>
    );
};

/**
 * 🧱 Blueprint Overlay
 * A technical drawing overlay that visualizes the anatomy of the component.
 */
const BlueprintOverlay: React.FC<{ anatomy: ElementAnatomy }> = ({ anatomy }) => {
    const { theme } = useTheme();
    const { width, height, padding, children, gap } = anatomy;
    
    const LINE_OFFSET = 24;
    const colorDim = theme.Color.Warning.Content['1']; // Orange for physical dimensions
    const colorLayout = theme.Color.Signal.Surface['1']; // Purple for layout/anatomy

    // Canvas bounds - slightly larger than component
    const CANVAS_PAD = 100;
    
    return (
      <div style={{ 
          position: 'absolute', 
          top: -CANVAS_PAD, 
          left: -CANVAS_PAD, 
          width: width + CANVAS_PAD * 2, 
          height: height + CANVAS_PAD * 2, 
          pointerEvents: 'none',
          zIndex: 10 
      }}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
                <pattern id="hatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="4" style={{ stroke: colorLayout, strokeWidth: 1, opacity: 0.2 }} />
                </pattern>
            </defs>

            {/* Shift Origin to Component Top-Left */}
            <g transform={`translate(${CANVAS_PAD}, ${CANVAS_PAD})`}>
                
                {/* --- PADDING ZONES --- */}
                {/* Left */}
                <rect x="0" y="0" width={padding.left} height={height} fill="url(#hatch)" />
                {/* Right */}
                <rect x={width - padding.right} y="0" width={padding.right} height={height} fill="url(#hatch)" />
                
                {/* --- CONTENT BOXES (Children) --- */}
                {Object.entries(children).map(([key, rect]) => {
                    const r = rect as NormalizedRect | null;
                    return r ? (
                        <rect 
                            key={key}
                            x={r.x} y={r.y} width={r.width} height={r.height}
                            fill="none" stroke={colorLayout} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"
                        />
                    ) : null;
                })}

                {/* --- DIMENSIONS (Outer) --- */}
                <DimensionLine 
                    x1={0} y1={0} x2={width} y2={0} 
                    label={`${Math.round(width)}`} 
                    offset={LINE_OFFSET} color={colorDim} position="top" 
                />
                <DimensionLine 
                    x1={0} y1={0} x2={0} y2={height} 
                    label={`${Math.round(height)}`} 
                    offset={LINE_OFFSET} color={colorDim} position="left" 
                />

                {/* --- ANATOMY (Inner) --- */}
                {/* Padding Labels */}
                {padding.left > 0 && (
                     <DimensionLine 
                        x1={0} y1={height} x2={padding.left} y2={height} 
                        label={`${Math.round(padding.left)}`} 
                        offset={LINE_OFFSET} color={colorLayout} position="bottom" 
                    />
                )}

                {/* Gap Label (Only if we have a gap) */}
                {gap > 1 && children.icon && children.text && (
                    <DimensionLine 
                        x1={children.icon.x + children.icon.width} y1={height} 
                        x2={children.text.x} y2={height} 
                        label={`${Math.round(gap)}`} 
                        offset={LINE_OFFSET} color={colorLayout} position="bottom" 
                    />
                )}

                {/* Padding Right Label */}
                {padding.right > 0 && (
                     <DimensionLine 
                        x1={width - padding.right} y1={height} x2={width} y2={height} 
                        label={`${Math.round(padding.right)}`} 
                        offset={LINE_OFFSET} color={colorLayout} position="bottom" 
                    />
                )}

            </g>
        </svg>
      </div>
    );
};

/**
 * 🏷️ Token Overlay
 * Visualizes the Design Tokens used by pointing to the relevant parts of the component.
 */
type FeedbackVariant = 'Success' | 'Warning' | 'Error' | 'Focus' | 'Signal';

interface TokenBadgeProps {
  label: string;
  variant: FeedbackVariant;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  delay: number;
}

const TokenBadge: React.FC<TokenBadgeProps> = ({ label, variant, x, y, targetX, targetY, delay }) => {
  const { theme } = useTheme();
  
  // Use Feedback tokens exclusively
  const colors = theme.Color[variant];
  const strokeColor = colors.Content[1];
  const fillColor = colors.Surface[1];

  // Calculate control points for a smooth curved line
  const cp1x = x;
  const cp1y = targetY;
  
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Connector Line */}
      <motion.path
        d={`M ${x} ${y} C ${cp1x} ${cp1y}, ${targetX} ${y}, ${targetX} ${targetY}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      />
      
      {/* Target Dot */}
      <motion.circle
        cx={targetX}
        cy={targetY}
        r="3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.5, type: 'spring' }}
      />

      {/* Badge Pill */}
      <motion.g
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ delay, type: 'spring' }}
      >
        <rect
          x={x - (label.length * 3.5 + 8)}
          y={y - 10}
          width={label.length * 7 + 16}
          height="20"
          rx="10"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        <text
          x={x}
          y={y}
          fill={strokeColor}
          fontSize="10"
          fontFamily={theme.Type.Expressive.Data.fontFamily}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </motion.g>
    </motion.g>
  );
};

const TokenOverlay: React.FC<{ anatomy: ElementAnatomy; btnProps: StageButtonProps }> = ({ anatomy, btnProps }) => {
  const { width, height, children, gap, padding } = anatomy;
  
  // Canvas padding for placing badges outside component
  const PAD = 100;
  
  // Helper to determine active tokens based on props
  const getPaddingToken = (s: string) => {
    if (s === 'S') return 'Space.M';
    if (s === 'L') return 'Space.XL';
    return 'Space.L';
  };

  const getTypographyToken = (s: string) => {
    if (s === 'S') return 'Label.S';
    if (s === 'L') return 'Label.L';
    return 'Label.M';
  };

  const getFillToken = (v: string) => {
     if (v === 'secondary') return 'Base.Surface.2';
     if (v === 'ghost' || v === 'outline') return 'Transparent';
     return 'Accent.Surface.1';
  };
  
  const getTextToken = (v: string) => {
     if (v === 'secondary' || v === 'ghost' || v === 'outline') return 'Base.Content.1';
     return 'Accent.Content.1';
  };

  // Logic to assign semantic feedback colors to token categories
  const getTokenVariant = (label: string): FeedbackVariant => {
    if (label.includes('Space') || label.includes('Gap')) return 'Warning'; // Orange for Spacing
    if (label.includes('Radius')) return 'Focus'; // Blue for Radius
    if (label.includes('Color') || label.includes('Fill') || label.includes('Accent') || label.includes('Base') || label.includes('Transparent')) return 'Signal'; // Purple for Colors
    if (label.includes('Type') || label.includes('Label')) return 'Success'; // Green for Typography
    return 'Error'; // Red fallback
  };

  const tokens = [
    // 1. Radius (Top Left)
    {
       label: 'Radius.Full',
       x: -40, y: -40,
       targetX: 8, targetY: 8,
       delay: 0.1
    },
    // 2. Padding (Left)
    {
       label: getPaddingToken(btnProps.size),
       x: -60, y: height / 2,
       targetX: padding.left / 2, targetY: height / 2,
       delay: 0.2
    },
    // 3. Fill Color (Bottom Right)
    {
       label: getFillToken(btnProps.variant),
       x: width + 50, y: height + 40,
       targetX: width - 20, targetY: height - 10,
       delay: 0.3
    },
  ];

  // Conditional Tokens
  
  // 4. Typography (Top Center - pointing to text)
  if (children.text) {
     const textCenter = children.text.x + children.text.width / 2;
     tokens.push({
        label: `Type.${getTypographyToken(btnProps.size)}`,
        x: textCenter, y: -50,
        targetX: textCenter, targetY: children.text.y + 4,
        delay: 0.4
     });
     
     // 5. Content Color (Right - pointing to text)
     tokens.push({
        label: getTextToken(btnProps.variant),
        x: width + 60, y: height / 2 - 10,
        targetX: children.text.x + children.text.width - 2, targetY: children.text.y + children.text.height / 2,
        delay: 0.5
     });
  }

  // 6. Gap (Bottom - pointing up between elements)
  if (gap > 0 && children.icon) {
     const gapCenter = children.icon.x + children.icon.width + gap / 2;
     tokens.push({
        label: 'Space.S',
        x: gapCenter, y: height + 50,
        targetX: gapCenter, targetY: height / 2,
        delay: 0.6
     });
  }

  return (
    <div style={{ 
        position: 'absolute', 
        top: -PAD, 
        left: -PAD, 
        width: width + PAD * 2, 
        height: height + PAD * 2, 
        pointerEvents: 'none',
        zIndex: 11 
    }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <g transform={`translate(${PAD}, ${PAD})`}>
          {tokens.map((t, i) => (
            <TokenBadge key={i} {...t} variant={getTokenVariant(t.label)} />
          ))}
        </g>
      </svg>
    </div>
  );
};

// --- MAIN COMPONENT ---

const Stage: React.FC<StageProps> = ({ btnProps, onButtonClick, showMeasurements, showTokens }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Using the new Library Hook
  const anatomy = useElementAnatomy(buttonRef, { icon: 'i', text: 'span' }, [btnProps, showMeasurements, showTokens]);

  return (
    <div style={{ 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        transform: 'scale(1.5)', 
        padding: '80px',
        transformOrigin: 'center'
    }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button ref={buttonRef} {...btnProps} onClick={onButtonClick} />
            {showMeasurements && anatomy && <BlueprintOverlay anatomy={anatomy} />}
            {showTokens && anatomy && <TokenOverlay anatomy={anatomy} btnProps={btnProps} />}
        </div>
    </div>
  );
};

export default Stage;