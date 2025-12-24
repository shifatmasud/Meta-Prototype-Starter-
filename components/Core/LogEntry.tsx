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

  const getLogColor = (msg: string) => {
    const lower = msg.toLowerCase();
    
    // Error
    if (lower.includes('error') || lower.includes('failed')) {
        return theme.Color.Error.Content[1];
    }
    
    // Warning
    if (lower.includes('warning') || lower.includes('warn')) {
        return theme.Color.Warning.Content[1];
    }
    
    // Success / Actions
    if (lower.includes('clicked') || lower.includes('triggered') || lower.includes('performed') || lower.includes('success')) {
        return theme.Color.Success.Content[1];
    }
    
    // Signal / Info / Updates
    if (lower.includes('updated') || lower.includes('toggled') || lower.includes('copied') || lower.includes('changed')) {
        return theme.Color.Signal.Content[1];
    }

    // Default
    return theme.Color.Base.Content[1];
  };

  return (
    <div style={{ display: 'flex', gap: '8px', ...theme.Type.Expressive.Data, fontSize: '11px' }}>
      <span style={{ color: theme.Color.Base.Content[3], flexShrink: 0 }}>[{log.timestamp}]</span>
      <span style={{ color: getLogColor(log.message) }}>{log.message}</span>
    </div>
  );
};

export default LogEntry;