export function Card({ children }) {
  return (
    <div className="border rounded bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={"p-4 " + className}>
      {children}
    </div>
  );
}