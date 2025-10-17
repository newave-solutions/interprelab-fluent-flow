import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}