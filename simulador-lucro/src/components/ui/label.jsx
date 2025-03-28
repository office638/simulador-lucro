export function Label({ children, ...props }) {
  return (
    <label className="block font-semibold mb-1" {...props}>
      {children}
    </label>
  );
}
