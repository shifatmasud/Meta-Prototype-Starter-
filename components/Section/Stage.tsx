/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useTheme } from '../../Theme.tsx';
import Button from '../Core/Button.tsx';
import { MetaButtonProps } from '../../types/index.tsx';

// The btnProps passed to Stage will now have its `customRadius`
// replaced with a MotionValue for real-time updates.
type StageButtonProps = Omit<MetaButtonProps, 'customRadius'> & {
  customRadius: any; // Allow MotionValue
}

interface StageProps {
  btnProps: StageButtonProps;
  onButtonClick: () => void;
}

const Stage: React.FC<StageProps> = ({ btnProps, onButtonClick }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing['Space.L'],
        zIndex: 0,
        transform: 'scale(1.5)',
      }}
    >
      <Button {...btnProps} onClick={onButtonClick} />
    </div>
  );
};

export default Stage;
