
export function Input({ type = "text", value, onChange }) {
  return <input type={type} value={value} onChange={onChange} className="border rounded px-2 py-1 w-full" />;
}
