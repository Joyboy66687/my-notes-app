export default function Card({ className="", children }) {
  return <div className={`card-glass ${className}`}>{children}</div>;
}
