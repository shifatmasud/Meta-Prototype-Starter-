/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useEffect } from 'react';
import { MotionValue } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';

interface RangeSliderProps {
  label: string;
  motionValue: MotionValue<number>;
  onCommit: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * 🏎️ MotionValue-Driven Range Slider for Real-time Feedback
 * This component is now driven by a `motionValue` prop from its parent.
 *
 * How it works:
 * 1. On user interaction, it calls `.set()` on the shared `motionValue`. This provides
 *    instant feedback to any other component listening to the same `motionValue`.
 * 2. An effect listens to changes and updates this component's own input DOM elements,
 *    preventing internal re-renders.
 * 3. When the user finishes the interaction (`onMouseUp`, `onBlur`), it calls the
 *    `onCommit` prop to save the final value to the main application state.
 */
const RangeSlider: React.FC<RangeSliderProps> = ({ label, motionValue, onCommit, min = 0, max = 100 }) => {
  const { theme } = useTheme();
  
  const rangeInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This effect subscribes to the motion value and manually updates the DOM
    // of the input elements. This makes the slider's own display update
    // without needing to re-render the component itself.
    const unsubscribe = motionValue.onChange(latest => {
      const stringValue = String(Math.round(latest));
      if (rangeInputRef.current && rangeInputRef.current.value !== stringValue) {
        rangeInputRef.current.value = stringValue;
      }
      if (numberInputRef.current && numberInputRef.current.value !== stringValue) {
        numberInputRef.current.value = stringValue;
      }
    });
    return unsubscribe;
  }, [motionValue]);
  
  const handleCommit = () => {
    onCommit(Math.round(motionValue.get()));
  };
  
  const handleLiveChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    motionValue.set(clampedValue);
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommit();
      (e.target as HTMLInputElement).blur();
    }
  };

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing['Space.S'],
    borderRadius: theme.radius['Radius.S'],
    border: `1px solid ${theme.Color.Base.Surface[3]}`,
    backgroundColor: theme.Color.Base.Surface[2],
    color: theme.Color.Base.Content[1],
    fontFamily: theme.Type.Readable.Body.M.fontFamily,
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div onPointerDown={(e) => e.stopPropagation()}>
      <label style={{ ...theme.Type.Readable.Label.S, display: 'block', marginBottom: theme.spacing['Space.S'], color: theme.Color.Base.Content[2] }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing['Space.S'] }}>
        <input
          ref={rangeInputRef}
          type="range"
          min={min}
          max={max}
          defaultValue={motionValue.get()}
          onChange={(e) => handleLiveChange(parseInt(e.target.value, 10))}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          style={{ flex: 1, accentColor: theme.Color.Accent.Surface[1], cursor: 'pointer', touchAction: 'none' }}
        />
        <input
          ref={numberInputRef}
          type="number"
          min={min}
          max={max}
          defaultValue={motionValue.get()}
          onChange={(e) => handleLiveChange(parseInt(e.target.value, 10) || 0)}
          onBlur={handleCommit}
          onKeyDown={handleNumberKeyDown}
          style={{ ...baseInputStyle, width: '60px', textAlign: 'center', padding: theme.spacing['Space.XS'] }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
