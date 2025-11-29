import { useEffect, useState } from 'react';
import useAxios from './useAxios';
import useAuth from './useAuth';



const useUserRole = () => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const axiosSecure = useAxios()

    useEffect(() => {
        if (user?.email && !loading) {
            const fetchRole = async () => {
                try {
                    const response = await axiosSecure.get(`/api/users/email/${user.email}`);
                    setRole(response.data.data.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('user'); 
                } finally {
                    setRoleLoading(false);
                }
            };
            fetchRole();
        } else if (!loading && !user) {
            setRoleLoading(false);
        }
    }, [user, loading, axiosSecure]);

    return { role, roleLoading };
};

export default useUserRole;