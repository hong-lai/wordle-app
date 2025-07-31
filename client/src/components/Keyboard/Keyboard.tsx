import KeyboardKeyRow from './KeyboardKeyRow';

const upperKeyRow = 'QWERTYUIOP'.split('');
const middleKeyRow = 'ASDFGHJKL'.split('');
const bottomKeyRow = ['Enter', ...'ZXCVBNM'.split(''), 'Delete'];

function Keyboard({ onClick }: { onClick: (key: string) => void }) {
  const keyboardStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '8px',
  };

  return (
    <div style={keyboardStyles}>
      <KeyboardKeyRow onClick={onClick} keyRow={upperKeyRow} />
      <KeyboardKeyRow onClick={onClick} keyRow={middleKeyRow} />
      <KeyboardKeyRow onClick={onClick} keyRow={bottomKeyRow} />
    </div>
  );
}

export default Keyboard;
