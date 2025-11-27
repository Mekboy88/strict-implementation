import { Link } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className="text-gray-700 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
};