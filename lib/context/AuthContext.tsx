import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode, useCallback,
} from 'react';
import {_getProfile, _signUp, _updatePassword, _updateProfile} from "@/lib/services/api/auth";


type AuthContextType = {
  user: null;
  isAdminRole: boolean;
  isStaffRole: boolean;
  fetchProfile: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
  updatePassword: (oldPassword: any, newPassword: any) => Promise<void>;
  updateProfile: (name: any, phone: any) => Promise<void>;
  setLoading: any
};

const defaultContext: AuthContextType = {
  user: null,
  fetchProfile: async () => {},
  isAdminRole: false,
  isStaffRole: false,
  signUp: async (data: any) => {},
  updatePassword: async (oldPassword: any, newPassword: any) => {},
  updateProfile: async (name: any, phone: any) => {},
  setLoading: async () => {
  },
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {

    const response = await _getProfile()

    if (response?.id) {
      setUser(response);
    }
  }, []);

  useEffect(() => {
    ;(async () => {
      await fetchProfile()
    })()
  }, []);

  const signUp = async (payload: any) => {
    setLoading(true);
    try {
      const newUser = await _signUp(payload);

      return newUser
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (oldPassword: any, newPassword: any) => {
    setLoading(true);
    try {
      const payload = {
        oldPassword,
        newPassword
      }

      return await _updatePassword(payload);

    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name: any, phone: any) => {
    setLoading(true);
    try {
      const payload = {
        name,
        phone
      }

      return await _updateProfile(payload);

    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdminRole = user?.role === 'ADMIN'
  const isStaffRole = user?.role === 'STAFF'

  const value: AuthContextType = {
    user,
    setUser,
    fetchProfile,
    loading,
    setLoading,
    isAdminRole,
    isStaffRole,
    signUp,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
