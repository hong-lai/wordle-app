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

function Keyboard({
  onClick,
  highlightMap,
}: {
  onClick: (key: string) => void;
  highlightMap: Record<string, string>;
}) {
  return (
    <div style={keyboardStyles}>
      <KeyRow
        onClick={onClick}
        highlightMap={highlightMap}
        keyRow={upperKeyRow}
      />
      <KeyRow
        onClick={onClick}
        highlightMap={highlightMap}
        keyRow={middleKeyRow}
      />
      <KeyRow
        onClick={onClick}
        highlightMap={highlightMap}
        keyRow={bottomKeyRow}
      />
    </div>
  );
}

export default Keyboard;
