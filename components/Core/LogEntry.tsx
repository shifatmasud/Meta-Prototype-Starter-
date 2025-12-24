/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useTheme } from '../../Theme.tsx';
import { LogEntry as LogEntryType } from '../../types/index.tsx';

interface LogEntryProps {
  log: LogEntryType;
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', gap: '8px', ...theme.Type.Expressive.Data, fontSize: '11px' }}>
      <span style={{ color: theme.Color.Base.Content[3], flexShrink: 0 }}>[{log.timestamp}]</span>
      <span style={{ color: theme.Color.Accent.Content[2] }}>{log.message}</span>
    </div>
  );
};

export default LogEntry;
