import type { Letter } from "../../App";

function Box({ letter }: { letter?: Letter }) {
  const boxStyles: React.CSSProperties = {
    height: '60px',
    width: '60px',
    border: '4px solid #3d3627',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '600',
    userSelect: "none"
  };

  if (letter?.status === 'MISS') {
    boxStyles.backgroundColor = 'gray';
  } else if (letter?.status === 'PRESENT') {
    boxStyles.backgroundColor = 'yellow';
  } else if (letter?.status === 'HIT') {
    boxStyles.backgroundColor = 'green';
  }

  return (
    <div style={boxStyles}>
      {letter?.letter ?? ''}
    </div>
  );
}

export default Box;
