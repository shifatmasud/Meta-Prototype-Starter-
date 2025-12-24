/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useTheme } from '../../Theme.tsx';
import { LogEntry as LogEntryType } from '../../types/index.tsx';
import LogEntry from '../Core/LogEntry.tsx';

interface ConsolePanelProps {
  logs: LogEntryType[];
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs }) => {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {logs.length === 0 && <span style={{ ...theme.Type.Expressive.Data, color: theme.Color.Base.Content[3] }}>No events yet...</span>}
      {logs.map(log => <LogEntry key={log.id} log={log} />)}
    </div>
  );
};

export default ConsolePanel;
