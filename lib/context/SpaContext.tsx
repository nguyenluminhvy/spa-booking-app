import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  _cancelAppointment,
  _completeAppointment,
  _confirmAppointment,
  getAppointments
} from "@/lib/services/api/appointments";

type SpaContextType = {
  services: [] | null;
  appointments: [] | null;
  // loading: boolean;
  // setLoading: any;
  // signIn: (email: string, password: string) => Promise<boolean | any>;
  // signUp: (email: string, password: string) => Promise<void>;
  // signOut: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  confirmAppointment: (id: any) => Promise<void>;
  cancelAppointment: (id: any) => Promise<void>;
  completeAppointment: (id: any) => Promise<void>;
  // sendEmailResetPassword: (email: string) => Promise<void>;
};

const defaultContext: SpaContextType = {
  services: [],
  appointments: [],
  fetchAppointments: async () => {},
  confirmAppointment: async (id: any) => {},
  cancelAppointment: async (id: any) => {},
  completeAppointment: async (id: any) => {},
};

const SpaContext = createContext<SpaContextType>(defaultContext);

export const SpaProvider = ({ children }: { children: ReactNode }) => {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //
    //   if (firebaseUser) {
    //     setUser(firebaseUser);
    //   }
    //   setLoading(false);
    //
    //   console.log('firebaseUser: ', firebaseUser)
    //
    // });
    //
    // return unsubscribe;
  }, []);

  const fetchAppointments = async () => {
    const response = await getAppointments()

    if (response) {
      setAppointments(response);
    }
  }

  const confirmAppointment = async (id: any) => {
    const response = await _confirmAppointment(id)

    await fetchAppointments()

    return response
  }

  const cancelAppointment = async (id: any) => {
    const response = await _cancelAppointment(id)

    await fetchAppointments()

    return response
  }

  const completeAppointment = async (id: any) => {
    const response = await _completeAppointment(id)

    await fetchAppointments()

    return response
  }

  const value: SpaContextType = {
    appointments,
    fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    // setLoading,
    // signIn,
    // signUp,
    // reSendEmailVerification,
    // sendEmailResetPassword,
    // signOut
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = () => useContext(SpaContext);
