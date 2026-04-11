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
import {getServices} from "@/lib/services/api/services";
import {useAuth} from "@/lib/context/AuthContext";

type SpaContextType = {
  services: [] | null;
  appointments: [] | null;
  fetchAppointments: () => Promise<void>;
  fetchServices: (query?: any) => Promise<void>;
  filterByToday: () => Promise<void>;
  filterByDone: () => Promise<void>;
  filterByStatus: (status: any) => Promise<void>;
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
  fetchServices: async (query?: any) => {},
  filterByToday: async () => {},
  filterByDone: async () => {},
  filterByStatus: async (status: any) => {},
  initAppointments: async () => {},
  confirmAppointment: async (id: any) => {},
  cancelAppointment: async (id: any) => {},
  completeAppointment: async (id: any) => {},
  assignStaff: async (id: any, staffId: any) => {},
};

const SpaContext = createContext<SpaContextType>(defaultContext);

export const SpaProvider = ({ children }: { children: ReactNode }) => {
  const {setLoading} = useAuth()

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  const fetchAppointments = async (query?: any) => {
    setLoading(true)
    const response = await getAppointments(query)

    if (response) {
      setAppointments(response);
    }
    setLoading(false)
  }

  const fetchServices = async (query: any) => {
    const data = await getServices(query);

    if (data?.length > 0) {
      setServices(data);
    }
  }

  const confirmAppointment = async (id: any) => {
    const response = await _confirmAppointment(id)

    return response
  }

  const cancelAppointment = async (id: any) => {
    const response = await _cancelAppointment(id)

    await fetchAppointments()

    return response
  }

  const completeAppointment = async (id: any) => {
    const response = await _completeAppointment(id)

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

  const filterByStatus = async (status: any) => {
    const filterParams = { status: status }
    setTimeout(() => {
      fetchAppointments(filterParams)
    }, 0)
  }

  const initAppointments = async () => {
    fetchAppointments({})
  }

  const value: SpaContextType = {
    appointments,
    services,
    fetchAppointments,
    fetchServices,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    assignStaff,
    filterByToday,
    filterByDone,
    filterByStatus,
    initAppointments,
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = () => useContext(SpaContext);
