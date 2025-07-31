import KeyboardKey from './KeyboardKey';

function KeyboardKeyRow({ keyRow, onClick }: { keyRow: string[], onClick: (key: string) => void }) {
  const keyRowStyles: React.CSSProperties = {
    display: "flex",
    columnGap: "2px"
  };

  return (
    <div style={keyRowStyles}>
      {keyRow.map((keyContent) => (
        <KeyboardKey key={keyContent} keyContent={keyContent} onClick={onClick} />
      ))}
    </div>
  );
}

export default KeyboardKeyRow;
