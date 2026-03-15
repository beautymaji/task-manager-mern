import { createContext, useState, useContext, useEffect } from 'react';
// REMOVED: useNavigate (causes errors if used outside Router immediate children)
import { loginUser, registerUser, logoutUser } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    // Note: With HTTP-only cookies, we can't check localStorage.
    // Ideally, you would make a request to a '/api/auth/me' endpoint here to verify the cookie.
    // For this demo, we just set loading false initially.
    setLoading(false);
  }, []);

  const login = async (formData) => {
    try {
      const { data } = await loginUser(formData);
      setUser(data);
      toast.success('Login Successful!');
      return true; // Return true to signal success to the Login page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await registerUser(formData);
      setUser(data);
      toast.success('Registration Successful!');
      return true; // Return true to signal success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.info('Logged out');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);