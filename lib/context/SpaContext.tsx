import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  _assignStaff,
  _cancelAppointment,
  _completeAppointment,
  _confirmAppointment,
  getAppointments
} from "@/lib/services/api/appointments";

type SpaContextType = {
  services: [] | null;
  appointments: [] | null;
  fetchAppointments: () => Promise<void>;
  confirmAppointment: (id: any) => Promise<void>;
  cancelAppointment: (id: any) => Promise<void>;
  completeAppointment: (id: any) => Promise<void>;
  assignStaff: (id: any, staffId: any) => Promise<void>;
};

const defaultContext: SpaContextType = {
  services: [],
  appointments: [],
  fetchAppointments: async () => {},
  confirmAppointment: async (id: any) => {},
  cancelAppointment: async (id: any) => {},
  completeAppointment: async (id: any) => {},
  assignStaff: async (id: any, staffId: any) => {},
};

const SpaContext = createContext<SpaContextType>(defaultContext);

export const SpaProvider = ({ children }: { children: ReactNode }) => {

  const [appointments, setAppointments] = useState([]);

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

  const assignStaff = async (id: any, staffId: any) => {
    const response = await _assignStaff(id, {staffId})

    await fetchAppointments()

    return response
  }

  const value: SpaContextType = {
    appointments,
    fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    assignStaff
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = () => useContext(SpaContext);
