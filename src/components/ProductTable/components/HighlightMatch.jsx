
export default function HighlightMatch({ text, term }) {
  if (!term) return <>{text}</>;
  const regex = new RegExp(`(${term})`, 'gi');
  return (
    <>
      {text.split(regex).map((part,i) =>
        part.toLowerCase() === term.toLowerCase()
          ? <span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span>
          : part
      )}
    </>
  );
}
