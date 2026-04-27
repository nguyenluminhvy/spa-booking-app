import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  _activateUser,
  _createStaff,
  _deactivateUser,
  _getStaffInfo, _getStaffs,
  _getUsers, _resetPasswordStaff,
  _updateStaff
} from "@/lib/services/api/users";
import {useAuth} from "@/lib/context/AuthContext";
import {_getAvailableStaffByAppointment} from "@/lib/services/api/appointments";

type AdminContextType = {
  users: [] | null;
  staffs: [] | null;
  availableStaffByAppointment: [] | null;
  appointments: [] | null;
  fetchUsers: (params?: any) => Promise<void>;
  fetchStaffs: () => Promise<void>;
  deactivateUser: (id: any) => Promise<void>;
  activateUser: (id: any) => Promise<void>;
  getStaffInfo: (id: any) => Promise<void>;
  createStaff: (data: any) => Promise<void>;
  updateStaff: (id: any, data: any) => Promise<void>;
  resetPasswordStaff: (id: any) => Promise<void>;
  fetchAvailableStaffByAppointment: (id: any) => Promise<void>;
};

const defaultContext: AdminContextType = {
  users: [],
  staffs: [],
  availableStaffByAppointment: [],
  appointments: [],
  fetchUsers: async (params?: any) => {},
  fetchStaffs: async () => {},
  deactivateUser: async (id: any) => {},
  activateUser: async (id: any) => {},
  getStaffInfo: async (id: any) => {},
  createStaff: async (data: any) => {},
  updateStaff: async (id: any, data: any) => {},
  resetPasswordStaff: async (id: any) => {},
  fetchAvailableStaffByAppointment: async (id: any) => {},
};

const AdminContext = createContext<AdminContextType>(defaultContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const {setLoading} = useAuth()

  const [users, setUsers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [availableStaffByAppointment, setAvailableStaffByAppointment] = useState([]);

  const fetchUsers = async (params?: any) => {
    setLoading(true)
    const response = await _getUsers(params);

    if (response) {
      setTimeout(() => {
        setUsers(response);
        setLoading(false)
      }, 0)
    }
  }

  const fetchStaffs = async () => {
    const response = await _getStaffs();

    if (response) {
      setStaffs(response);
    }
  }

  const fetchAvailableStaffByAppointment = async (appointmentId: any) => {
    const response = await _getAvailableStaffByAppointment(appointmentId);

    if (response) {
      setAvailableStaffByAppointment(response);
    }
  }

  const activateUser = async (id: any) => {
    const response = await _activateUser(id)

    return response
  }

  const deactivateUser = async (id: any) => {
    const response = await _deactivateUser(id)

    return response
  }

  const createStaff = async (payload: any) => {
    const response = await _createStaff(payload)

    await fetchUsers()

    return response
  }

  const updateStaff = async (id: any, payload: any) => {
    const response = await _updateStaff(id, payload)

    // await fetchUsers()

    return response
  }

  const resetPasswordStaff = async (id: any) => {
    const response = await _resetPasswordStaff(id)

    return response
  }

  const getStaffInfo = async (id: any) => {
    const response = await _getStaffInfo(id)

    return response
  }

  const value: AdminContextType = {
    users,
    staffs,
    availableStaffByAppointment,
    fetchUsers,
    fetchStaffs,
    activateUser,
    deactivateUser,
    createStaff,
    updateStaff,
    getStaffInfo,
    resetPasswordStaff,
    fetchAvailableStaffByAppointment,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
