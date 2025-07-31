function KeyboardKey({ keyContent, onClick }: { keyContent: string, onClick: (key: string) => void }) {
  const keyStyles: React.CSSProperties = {
    border: '2px solid #474747',
    padding: "0 6px",
    height: '50px',
    minWidth: '40px',
    fontSize: "18px",
    fontWeight: '600',
    color: '#b7b7b7',
    backgroundColor: "#1a1a1a",
    userSelect: "none"
  };

  if (keyContent.length > 1) {
    keyStyles.fontSize = "12px"
  }

  return (
    <>
      <button style={keyStyles} onClick={() => onClick(keyContent)}>
        {keyContent}
      </button>
    </>
  );
}

export default KeyboardKey;
