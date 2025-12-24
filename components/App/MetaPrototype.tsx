/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../../Theme.tsx';
import ThemeToggleButton from '../Core/ThemeToggleButton.tsx';
import FloatingWindow from '../Package/FloatingWindow.tsx';
import Dock from '../Section/Dock.tsx';
import Stage from '../Section/Stage.tsx';
import ControlPanel from '../Package/ControlPanel.tsx';
import CodePanel from '../Package/CodePanel.tsx';
import ConsolePanel from '../Package/ConsolePanel.tsx';
import UndoRedo from '../Package/UndoRedo.tsx';
import { WindowId, WindowState, LogEntry, MetaButtonProps } from '../../types/index.tsx';

/**
 * 🏎️ Meta Prototype App
 * Acts as the main state orchestrator for the application.
 */
const MetaPrototype = () => {
  const { theme } = useTheme();
  
  // -- App State --
  const [btnProps, setBtnProps] = useState<MetaButtonProps>({
    label: 'Interactive',
    variant: 'primary',
    size: 'M',
    icon: 'ph-sparkle',
    customFill: '',
    customColor: '',
    customRadius: '999px',
  });

  // -- Real-time MotionValue for live UI updates --
  const radiusMotionValue = useMotionValue(parseInt(btnProps.customRadius) || 0);
  const radiusStringMotionValue = useTransform(radiusMotionValue, (v) => `${Math.round(v)}px`);

  // Sync MotionValue when state is changed by other means (e.g., undo/redo)
  useEffect(() => {
    radiusMotionValue.set(parseInt(btnProps.customRadius) || 0);
  }, [btnProps.customRadius, radiusMotionValue]);


  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // -- History State --
  const [history, setHistory] = useState<MetaButtonProps[]>([]);
  const [future, setFuture] = useState<MetaButtonProps[]>([]);

  // -- Window Management --
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    control: { id: 'control', title: 'Control', isOpen: false, zIndex: 1, x: -220, y: -200 },
    code: { id: 'code', title: 'Code I/O', isOpen: false, zIndex: 2, x: 0, y: -250 },
    console: { id: 'console', title: 'Console', isOpen: false, zIndex: 3, x: 220, y: -200 },
  });

  // -- Code Editor State --
  const [codeText, setCodeText] = useState('');
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  
  // Sync code text when btnProps changes (if not editing)
  useEffect(() => {
    if (!isCodeFocused) {
      setCodeText(JSON.stringify(btnProps, null, 2));
    }
  }, [btnProps, isCodeFocused]);

  // -- Actions --

  const updateBtnProps = (newProps: MetaButtonProps, saveHistory: boolean = true) => {
    if (saveHistory) {
      setHistory(prev => [...prev, btnProps]);
      setFuture([]);
    }
    setBtnProps(newProps);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setFuture(prev => [btnProps, ...prev]);
    setBtnProps(previous);
    setHistory(newHistory);
    logEvent('Undo performed');
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory(prev => [...prev, btnProps]);
    setBtnProps(next);
    setFuture(newFuture);
    logEvent('Redo performed');
  };

  const bringToFront = (id: WindowId) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex));
      if (prev[id].zIndex === maxZ) return prev;
      return { ...prev, [id]: { ...prev[id], zIndex: maxZ + 1 } };
    });
  };

  const toggleWindow = (id: WindowId) => {
    setWindows(prev => {
      const isOpen = !prev[id].isOpen;
      const next = { ...prev, [id]: { ...prev[id], isOpen } };
      if (isOpen) {
        const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex));
        next[id].zIndex = maxZ + 1;
      }
      return next;
    });
  };

  const logEvent = (msg: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message: msg,
    };
    setLogs(prev => [entry, ...prev].slice(0, 50));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(btnProps, null, 2));
    logEvent('JSON copied to clipboard');
  };
  
  // Generic handler for most props
  const handlePropChange = (key: string, value: any) => {
    updateBtnProps({ ...btnProps, [key]: value });
    logEvent(`Prop updated: ${key} = ${value}`);
  };

  // Specific handler for committing the radius value to state
  const handleRadiusCommit = (value: number) => {
    handlePropChange('customRadius', `${value}px`);
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setCodeText(newVal);
    try {
      const parsed = JSON.parse(newVal);
      updateBtnProps(parsed, true);
    } catch (err) {
      // Invalid JSON, just update text
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.Color.Base.Surface[1],
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ThemeToggleButton />

      <Stage
        btnProps={{...btnProps, customRadius: radiusStringMotionValue}}
        onButtonClick={() => logEvent('Button Clicked! (Triggered Action)')}
      />

      {/* --- WINDOWS --- */}
      <FloatingWindow
        {...windows.control}
        onClose={() => toggleWindow('control')}
        onFocus={() => bringToFront('control')}
        initialPos={{ x: windows.control.x, y: windows.control.y }}
        footer={<UndoRedo onUndo={handleUndo} onRedo={handleRedo} canUndo={history.length > 0} canRedo={future.length > 0} />}
      >
        <ControlPanel
            btnProps={btnProps}
            onPropChange={handlePropChange}
            radiusMotionValue={radiusMotionValue}
            onRadiusCommit={handleRadiusCommit}
        />
      </FloatingWindow>

      <FloatingWindow
        {...windows.code}
        onClose={() => toggleWindow('code')}
        onFocus={() => bringToFront('code')}
        initialPos={{ x: windows.code.x, y: windows.code.y }}
      >
        <CodePanel
          codeText={codeText}
          onCodeChange={handleCodeChange}
          onCopyCode={handleCopyCode}
          onFocus={() => setIsCodeFocused(true)}
          onBlur={() => setIsCodeFocused(false)}
          btnProps={btnProps}
        />
      </FloatingWindow>

      <FloatingWindow
        {...windows.console}
        onClose={() => toggleWindow('console')}
        onFocus={() => bringToFront('console')}
        initialPos={{ x: windows.console.x, y: windows.console.y }}
      >
        <ConsolePanel logs={logs} />
      </FloatingWindow>

      <Dock windows={windows} toggleWindow={toggleWindow} />
    </div>
  );
};

export default MetaPrototype;