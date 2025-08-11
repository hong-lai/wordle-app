import Key from './Key';

const keyRowStyles: React.CSSProperties = {
  display: 'flex',
  columnGap: '2px',
};

function KeyRow({
  keyRow,
  onClick,
  highlightMap,
}: {
  keyRow: string[];
  onClick: (key: string) => void;
  highlightMap: Record<string, string>;
}) {
  return (
    <div style={keyRowStyles}>
      {keyRow.map((keyContent) => (
        <Key
          key={keyContent}
          keyContent={keyContent}
          onClick={onClick}
          bgColor={highlightMap[keyContent] ?? '#1a1a1a'}
        />
      ))}
    </div>
  );
}

export default KeyRow;
