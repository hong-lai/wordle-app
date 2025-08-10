import KeyRow from './KeyRow';

const upperKeyRow = 'QWERTYUIOP'.split('');
const middleKeyRow = 'ASDFGHJKL'.split('');
const bottomKeyRow = ['Enter', ...'ZXCVBNM'.split(''), 'Delete'];

const keyboardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '8px',
};

function Keyboard({ onClick }: { onClick: (key: string) => void }) {
  return (
    <div style={keyboardStyles}>
      <KeyRow onClick={onClick} keyRow={upperKeyRow} />
      <KeyRow onClick={onClick} keyRow={middleKeyRow} />
      <KeyRow onClick={onClick} keyRow={bottomKeyRow} />
    </div>
  );
}

export default Keyboard;
