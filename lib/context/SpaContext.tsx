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
import {_createService, _updateService, getServices} from "@/lib/services/api/services";
import {useAuth} from "@/lib/context/AuthContext";
import {_createReview} from "@/lib/services/api/reviews";
import {
  _activateCoupon,
  _createCoupon,
  _deactivateCoupon,
  _getCoupons,
  _updateCoupon,
  _validateCoupon
} from "@/lib/services/api/coupon";

type SpaContextType = {
  services: [] | null;
  appointments: [] | null;
  coupons: [] | null;
  fetchAppointments: () => Promise<void>;
  createService: (formData?: any) => Promise<void>;
  updateService: (id: any, formData?: any) => Promise<void>;
  fetchServices: (query?: any) => Promise<void>;
  filterByToday: () => Promise<void>;
  filterByDone: () => Promise<void>;
  filterByStatus: (status: any) => Promise<void>;
  initAppointments: () => Promise<void>;
  confirmAppointment: (id: any) => Promise<void>;
  cancelAppointment: (id: any) => Promise<void>;
  completeAppointment: (id: any) => Promise<void>;
  ratingAppointment: (data: any) => Promise<void>;
  assignStaff: (id: any, staffId: any) => Promise<void>;
  createCoupon: (payload?: any) => Promise<void>;
  validateCoupon: (payload?: any) => Promise<void>;
  updateCoupon: (id: any, payload?: any) => Promise<void>;
  fetchCoupons: (query?: any) => Promise<void>;
  activateCoupon: (id: any, payload?: any) => Promise<void>;
  deactivateCoupon: (id: any, payload?: any) => Promise<void>;
  queryCoupon: {};
  setQueryCoupon: (data?: any) => Promise<void>;
};

const defaultContext: SpaContextType = {
  services: [],
  appointments: [],
  coupons: [],
  fetchAppointments: async () => {},
  fetchServices: async (query?: any) => {},
  createService: async (formData?: any) => {},
  updateService: async (id: any, formData?: any) => {},
  filterByToday: async () => {},
  filterByDone: async () => {},
  filterByStatus: async (status: any) => {},
  initAppointments: async () => {},
  confirmAppointment: async (id: any) => {},
  cancelAppointment: async (id: any) => {},
  completeAppointment: async (id: any) => {},
  ratingAppointment: async (data: any) => {},
  assignStaff: async (id: any, staffId: any) => {},
  createCoupon: async (payload?: any) => {},
  validateCoupon: async (payload?: any) => {},
  updateCoupon: async (payload?: any) => {},
  fetchCoupons: async (query?: any) => {},
  activateCoupon: async (id: any) => {},
  deactivateCoupon: async (id: any) => {},
  queryCoupon: {},
  setQueryCoupon: async (data: any) => {},
};

const SpaContext = createContext<SpaContextType>(defaultContext);

export const SpaProvider = ({ children }: { children: ReactNode }) => {
  const {setLoading} = useAuth()

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  const [coupons, setCoupons] = useState([]);
  const [queryCoupon, _setQueryCoupon] = useState({
    status: undefined,
    state: undefined,
    orderBy: undefined,
  });


  const fetchAppointments = async (query?: any) => {
    setLoading(true)
    const response = await getAppointments(query)

    if (response) {
      setAppointments(response);
    }
    setLoading(false)
  }

  const createService = async (formData: any) => {
    return await _createService(formData);
  }

  const updateService = async (id: any, formData: any) => {
    return await _updateService(id, formData);
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

  const ratingAppointment = async (payload: any) => {
    const response = await _createReview(payload)

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

  const createCoupon = async (payload: any) => {
    const response = await _createCoupon(payload);
    await fetchCoupons()

    return response
  }

  const validateCoupon = async (payload: any) => {
    const response = await _validateCoupon(payload);

    return response
  }

  const updateCoupon = async (id: any, payload: any) => {
    const response = await _updateCoupon(id, payload);
    await fetchCoupons()

    return response
  }

  const fetchCoupons = async (query?: any) => {
    try {
      setLoading(true)

      const data = await _getCoupons({
        ...queryCoupon,
        ...query
      });

      if (data?.length >= 0) {
        setCoupons(data);
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const activateCoupon = async (payload: any) => {
    const response = await _activateCoupon(payload);
    await fetchCoupons()

    return response
  }

  const deactivateCoupon = async (payload: any) => {
    const response = await _deactivateCoupon(payload);
    await fetchCoupons()

    return response
  }

  const setQueryCoupon = async (query: any) => {
    _setQueryCoupon(prevState => ({
      ...prevState,
      ...query,
    }))
  }

  const value: SpaContextType = {
    appointments,
    services,
    coupons,
    fetchAppointments,
    createService,
    updateService,
    fetchServices,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    ratingAppointment,
    assignStaff,
    filterByToday,
    filterByDone,
    filterByStatus,
    initAppointments,
    createCoupon,
    validateCoupon,
    updateCoupon,
    fetchCoupons,
    activateCoupon,
    deactivateCoupon,
    setQueryCoupon,
    queryCoupon
  };

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
};

export const useSpa = () => useContext(SpaContext);
