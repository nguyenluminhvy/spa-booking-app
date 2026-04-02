import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode, useCallback,
} from 'react';
import {getStringData} from "@/lib/utils/AsyncStorage";
import {_getProfile} from "@/lib/services/api/auth";


type AuthContextType = {
  user: null;
  isAdminRole: boolean;
  isStaffRole: boolean;
  fetchProfile: () => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  fetchProfile: async () => {},
  isAdminRole: false,
  isStaffRole: false,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
