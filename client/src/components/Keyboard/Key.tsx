import React, { useMemo } from 'react';

function Key({
  keyContent,
  onClick,
  bgColor
}: {
  keyContent: string;
  onClick: (key: string) => void;
  bgColor: string
}) {
  const keyStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      textShadow: '1px 1px #474747',
      border: '2px solid #474747',
      padding: '0 6px',
      height: '50px',
      minWidth: '36px',
      fontSize: '18px',
      fontWeight: '900',
      color: '#d7d7d7',
      backgroundColor: bgColor,
      userSelect: 'none',
      transition: 'background 1s',
      transitionDelay: '1.3s'
    };

    if (keyContent.length > 1) {
      styles.fontSize = '12px';
    }

    return styles;
  }, [keyContent.length, bgColor]);

  return (
    <button style={keyStyles} onClick={() => onClick(keyContent)}>
      {keyContent}
    </button>
  );
}

export default Key;
