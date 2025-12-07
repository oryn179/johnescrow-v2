import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { THEME_KEY } from '../constants';
import { Menu, X, Sun, Moon, ShieldCheck, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-brand-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-brand-gold/20 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
               <div className="bg-brand-gold/10 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300">
                 <img src="/photo_2025-12-06_20_22-11.jpg" alt="Johnescrow Logo" className="h-8 w-8 object-contain" />
               </div>
               <span className="text-xl font-bold tracking-tight text-brand-dark dark:text-white">
                 John<span className="text-brand-gold">escrow</span>
               </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                    location.pathname === link.path 
                      ? 'text-brand-gold' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to={user.role === UserRole.ADMIN ? "/admin-dashboard" : "/dashboard"}
                    className="flex items-center space-x-2 text-sm font-medium text-brand-gold hover:text-brand-goldHover transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>{user.role === UserRole.ADMIN ? "Admin" : "Dashboard"}</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="h-8 w-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-darker font-bold overflow-hidden hover:ring-2 hover:ring-brand-gold hover:ring-offset-2 hover:ring-offset-brand-dark transition-all"
                    title="View Profile"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-brand-dark dark:text-white hover:text-brand-gold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-medium bg-brand-gold hover:bg-brand-goldHover text-brand-darker rounded-full shadow-lg hover:shadow-brand-gold/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-4">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-white hover:text-brand-gold focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-brand-darker border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-brand-gold hover:bg-gray-50 dark:hover:bg-white/5 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-3 py-2 mb-2">
                      <div className="h-10 w-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-darker font-bold mr-3 overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user?.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-base font-medium text-brand-dark dark:text-white">{user?.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                     <Link
                      to={user?.role === UserRole.ADMIN ? "/admin-dashboard" : "/dashboard"}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-brand-gold hover:bg-gray-50 dark:hover:bg-white/5 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 mb-2 text-brand-dark dark:text-white font-medium border border-gray-300 dark:border-gray-600 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center px-4 py-2 bg-brand-gold text-brand-darker font-bold rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-4 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-brand-darker border-t border-gray-200 dark:border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/photo_2025-12-06_20_22-11.jpg" alt="Logo" className="h-6 w-6 object-contain" />
                <span className="text-xl font-bold text-brand-dark dark:text-white">John<span className="text-brand-gold">escrow</span></span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                The world's most secure and reliable escrow service. Protecting buyers and sellers with banking-grade security and automated fund release.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-dark dark:text-white uppercase tracking-wider mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Domain Names</Link></li>
                <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Vehicles</Link></li>
                <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">General Merchandise</Link></li>
                <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Freelance Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-dark dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-dark dark:text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Terms of Service</Link></li>
                <li><Link to="/security" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold text-sm">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Johnescrow, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};