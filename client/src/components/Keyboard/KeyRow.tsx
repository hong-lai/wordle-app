import Key from './Key';

const keyRowStyles: React.CSSProperties = {
  display: "flex",
  columnGap: "2px"
};

function KeyRow({ keyRow, onClick }: { keyRow: string[], onClick: (key: string) => void }) {
  return (
    <div style={keyRowStyles}>
      {keyRow.map((keyContent) => (
        <Key key={keyContent} keyContent={keyContent} onClick={onClick} />
      ))}
    </div>
  );
}

export default KeyRow;
