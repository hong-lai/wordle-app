import React, { useMemo } from 'react';

function Key({
  keyContent,
  onClick,
}: {
  keyContent: string;
  onClick: (key: string) => void;
}) {
  const keyStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      border: '2px solid #474747',
      padding: '0 6px',
      height: '50px',
      minWidth: '36px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#b7b7b7',
      backgroundColor: '#1a1a1a',
      userSelect: 'none',
    };

    if (keyContent.length > 1) {
      styles.fontSize = '12px';
    }

    return styles;
  }, [keyContent.length]);

  return (
    <button style={keyStyles} onClick={() => onClick(keyContent)}>
      {keyContent}
    </button>
  );
}

export default Key;
