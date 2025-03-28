export function Card({ children }) {
  return (
    <div className="border rounded bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  const classes = ["p-4", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
