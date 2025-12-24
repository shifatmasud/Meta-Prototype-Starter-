/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { MotionValue } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import { MetaButtonProps } from '../../types/index.tsx';
import Input from '../Core/Input.tsx';
import Select from '../Core/Select.tsx';
import RangeSlider from '../Core/RangeSlider.tsx';
import ColorPicker from '../Core/ColorPicker.tsx';
import Toggle from '../Core/Toggle.tsx';

interface ControlPanelProps {
  btnProps: MetaButtonProps;
  onPropChange: (key: string, value: any) => void;
  radiusMotionValue: MotionValue<number>;
  onRadiusCommit: (value: number) => void;
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
  showTokens: boolean;
  onToggleTokens: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  btnProps, 
  onPropChange, 
  radiusMotionValue, 
  onRadiusCommit, 
  showMeasurements, 
  onToggleMeasurements, 
  showTokens,
  onToggleTokens
}) => {
  const { theme } = useTheme();

  return (
    <>
      <Input
        label="Label"
        value={btnProps.label}
        onChange={(e) => onPropChange('label', e.target.value)}
      />
      <div style={{ display: 'flex', gap: theme.spacing['Space.M'], marginTop: theme.spacing['Space.L'] }}>
        <div style={{ flex: 1 }}>
          <Select
            label="Variant"
            value={btnProps.variant}
            onChange={(e) => onPropChange('variant', e.target.value)}
            options={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'outline', label: 'Outline' },
            ]}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select
            label="Size"
            value={btnProps.size}
            onChange={(e) => onPropChange('size', e.target.value)}
            options={[
              { value: 'S', label: 'Small (S)' },
              { value: 'M', label: 'Medium (M)' },
              { value: 'L', label: 'Large (L)' },
            ]}
          />
        </div>
      </div>
      <div style={{ marginTop: theme.spacing['Space.L'] }}>
          <Select
            label="Icon (Phosphor)"
            value={btnProps.icon || ''}
            onChange={(e) => onPropChange('icon', e.target.value)}
            options={[
                { value: '', label: 'None' },
                { value: 'ph-sparkle', label: 'Sparkle' },
                { value: 'ph-heart', label: 'Heart' },
                { value: 'ph-bell', label: 'Bell' },
                { value: 'ph-rocket', label: 'Rocket' },
                { value: 'ph-gear', label: 'Gear' },
            ]}
          />
      </div>
      <div style={{ marginTop: theme.spacing['Space.L'] }}>
          <RangeSlider
            label="Corner Radius"
            motionValue={radiusMotionValue}
            onCommit={onRadiusCommit}
            min={0}
            max={56}
          />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['Space.M'], marginTop: theme.spacing['Space.L'], width: '100%' }}>
        <ColorPicker
          label="Fill Color"
          value={btnProps.customFill || (theme.themeName === 'dark' ? '#ffffff' : '#000000')}
          onChange={(e) => onPropChange('customFill', e.target.value)}
        />
        <ColorPicker
          label="Text Color"
          value={btnProps.customColor || (theme.themeName === 'dark' ? '#000000' : '#ffffff')}
          onChange={(e) => onPropChange('customColor', e.target.value)}
        />
      </div>
      <div style={{ borderTop: `1px solid ${theme.Color.Base.Surface[3]}`, margin: `${theme.spacing['Space.L']} 0` }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['Space.M'] }}>
        <Toggle
          label="Show Measurements"
          isOn={showMeasurements}
          onToggle={onToggleMeasurements}
        />
        <Toggle
          label="Show Tokens"
          isOn={showTokens}
          onToggle={onToggleTokens}
        />
      </div>
    </>
  );
};

export default ControlPanel;