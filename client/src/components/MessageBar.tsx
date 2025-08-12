import { useEffect, useState } from 'react';

function MessageBar({
  message,
}: {
  message: string;
}) {
  const [animatedMessage, setAnimatedMessage] = useState('');

  useEffect(() => {
    if (!message) {
      setAnimatedMessage('');
      return;
    }

    const msg = [...message];
    const duration = msg.length;
    const delay = 100;
    let start: number | undefined;

    const step = (timestamp: number) => {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - delay - start;
      if (elapsed > 0) {
        const i = Math.trunc(elapsed / duration);
        setAnimatedMessage(msg.slice(0, i).join(''));

        if (i === msg.length) {
          return;
        }
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [message]);

  return (
    <div style={MessageBarStyles}>
      {animatedMessage}
    </div>
  );
}

const MessageBarStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '24px',
  gap: '12px',
  fontSize: '14px',
  fontWeight: '700',
  backgroundColor: '#161616',
  padding: '6px',
  borderRadius: '6px',
  position: 'sticky',
  top: '36px',
  zIndex: 10,
};

export default MessageBar;
