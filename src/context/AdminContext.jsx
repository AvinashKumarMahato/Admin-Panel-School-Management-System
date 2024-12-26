import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'; // Fallback URL if the env variable is not set


    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [teachers, setTeachers] = useState([])
    const [dashData, setDashData] = useState(false)
    const [classes, setClasses] = useState([]);



    // Add these functions to your existing context
    const getAllClasses = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/get-classes`,
                { headers: { aToken } }
            );
            
            if (data.success) {
                setClasses(data.classes);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Failed to fetch classes');
        }
    };

    const cancelClass = async (classId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/cancel-class/${classId}`,
                {},
                { headers: { aToken } }
            );
            
            if (data.success) {
                toast.success('Class cancelled successfully');
                return true;
            }
        } catch (error) {
            console.error('Error cancelling class:', error);
            toast.error('Failed to cancel class');
            return false;
        }
    };

    // Getting all Teachers data from Database using API
    const getAllTeachers = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-teachers', { headers: { aToken } })
            if (data.success) {
                setTeachers(data.teachers)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // Function to change doctor availablity using API
    const changeAvailability = async (teacherId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { teacherId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllTeachers()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // AdminContext.jsx
const scheduleClass = async (classData) => {
    try {
        const response = await axios.post(
            `${backendUrl}/api/admin/schedule-class`,
            classData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    aToken
                }
            }
        );

        if (response.data.message === 'Class scheduled successfully!') {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Schedule class error:', error);
        throw error;
    }
};


    const value = {
        aToken, setAToken,
        teachers,
        getAllTeachers,
        changeAvailability,
        getDashData,
        dashData,
        scheduleClass,
        classes,
        getAllClasses,
        cancelClass,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider