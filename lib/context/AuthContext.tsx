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
  // user: User | null;
  // loading: boolean;
  // setLoading: any;
  // signIn: (email: string, password: string) => Promise<boolean | any>;
  // signUp: (email: string, password: string) => Promise<void>;
  // signOut: () => Promise<void>;
  // reSendEmailVerification: () => Promise<void>;
  // sendEmailResetPassword: (email: string) => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  fetchProfile: async () => {
  },
  isAdminRole: false,
  // loading: false,
  // signIn: async () => false,
  // signUp: async () => {
  // },
  // signOut: async () => {
  // },
  // reSendEmailVerification: async () => {
  // },
  // sendEmailResetPassword: async () => {
  // },
  // setLoading: async () => {
  // }
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

  const value: AuthContextType = {
    user,
    setUser,
    fetchProfile,
    loading,
    setLoading,
    isAdminRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
