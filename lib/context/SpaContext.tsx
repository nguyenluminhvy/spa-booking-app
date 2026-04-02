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
  filterByToday: () => Promise<void>;
  filterByDone: () => Promise<void>;
  initAppointments: () => Promise<void>;
  confirmAppointment: (id: any) => Promise<void>;
  cancelAppointment: (id: any) => Promise<void>;
  completeAppointment: (id: any) => Promise<void>;
  assignStaff: (id: any, staffId: any) => Promise<void>;
};

const defaultContext: SpaContextType = {
  services: [],
  appointments: [],
  fetchAppointments: async () => {},
  filterByToday: async () => {},
  filterByDone: async () => {},
  initAppointments: async () => {},
  confirmAppointment: async (id: any) => {},
  cancelAppointment: async (id: any) => {},
  completeAppointment: async (id: any) => {},
  assignStaff: async (id: any, staffId: any) => {},
};

const SpaContext = createContext<SpaContextType>(defaultContext);

export const SpaProvider = ({ children }: { children: ReactNode }) => {

  const [appointments, setAppointments] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  const fetchAppointments = async (query?: any) => {
    const response = await getAppointments(query)

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

  const filterByToday = async () => {
    const filterParams = { date: 'today' }
    setTimeout(() => {
      fetchAppointments(filterParams)
    }, 0)
  }

  const filterByDone = async () => {
    const filterParams = { status: 'DONE' }
    setTimeout(() => {
      fetchAppointments(filterParams)
    }, 0)
  }

  const initAppointments = async () => {
    fetchAppointments({})
  }

  const value: SpaContextType = {
    appointments,
    fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    assignStaff,
    filterByToday,
    filterByDone,
    initAppointments,
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = () => useContext(SpaContext);
