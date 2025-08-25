import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ New loading flag
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  useEffect(() => {
    // Check auth once on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      setAuthChecked(true); // ✅ Mark check complete
      
      // Check if user is admin
      if (user?.email) {
        checkIfAdmin(user.email);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setCurrentUser(session?.user || null);
      setAuthChecked(true);
      
      // Check if user is admin
      if (session?.user?.email) {
        checkIfAdmin(session.user.email);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (error) {
        console.log('Admin check error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.log('Admin check failed:', error);
      setIsAdmin(false);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Reports", path: "/reports" },
  ];

  // Add Dashboard item only for admin users
  if (isAdmin) {
    navItems.push({ name: "Dashboard", path: "/dashboard" });
  }

  const ProfileIcon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="text-red-600 bg-white rounded-full p-1 border border-red-200"
      style={{ boxShadow: "0 0 3px rgba(220,38,38,0.10)" }}
    >
      <circle
        cx="14"
        cy="10"
        r="5.5"
        fill="white"
        stroke="#DC2626"
        strokeWidth="1.6"
      />
      <ellipse
        cx="14"
        cy="20"
        rx="8.5"
        ry="5"
        fill="white"
        stroke="#DC2626"
        strokeWidth="1.6"
      />
      <circle
        cx="14"
        cy="10"
        r="3.3"
        fill="#DC2626"
        stroke="white"
        strokeWidth="1.2"
      />
    </svg>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <Shield className="h-8 w-8 text-red-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-2 w-2 text-white" />
              </div>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              RedZone
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Profile/Register button */}
            {!isAuthPage &&
              authChecked && ( // ✅ Don't render until auth status is known
                isAuthenticated ? (
                  <NavLink
                    to="/profile"
                    className="p-0 m-0"
                    aria-label="User Profile"
                  >
                    {ProfileIcon}
                  </NavLink>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, scale: 0.85, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <NavLink
                      to="/auth"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-red-700 text-white"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`
                      }
                    >
                      Register
                    </NavLink>
                  </motion.div>
                )
              )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-red-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav items */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? "text-red-600 bg-red-50"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}

              {!isAuthPage &&
                authChecked && ( // ✅ Wait for auth check
                  isAuthenticated ? (
                    <NavLink
                      to="/profile"
                      className="p-2 m-0 flex items-center"
                      aria-label="User Profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {ProfileIcon}
                      <span className="ml-2 text-sm font-medium text-red-600">
                        Profile
                      </span>
                    </NavLink>
                  ) : (
                    <motion.div
                      key="register-mobile"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NavLink
                        to="/auth"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded-lg text-sm font-medium transition ${
                            isActive
                              ? "bg-red-700 text-white"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </NavLink>
                    </motion.div>
                  )
                )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
