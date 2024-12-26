import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const TeacherContext = createContext();

const TeacherContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [profileData, setProfileData] = useState(false);
    const [classes, setClasses] = useState(null);

    const getAllClasses = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/teacher/classes`,
                { headers: { dToken } }
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
                `${backendUrl}/api/teacher/cancel-class/${classId}`,
                {},
                { headers: { dToken } }
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

    const completeClass = async (classId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/teacher/complete-class/${classId}`, // Add classId as a route parameter
                {}, // Empty request body
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllClasses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {
            const config = {
                headers: {
                    'dToken': dToken,
                    'Content-Type': 'application/json'
                }
            };
    
            console.log('Making request with config:', {
                url: `${backendUrl}/api/teacher/profile`,
                headers: config.headers
            });
    
            const response = await axios.get(
                `${backendUrl}/api/teacher/profile`,
                config
            );
    
            console.log('Response:', response.data);
            
            if (response.data.success) {
                setProfileData(response.data.profileData);
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            toast.error('Failed to fetch profile');
        }
    };

    const updateProfileData = async (updateData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/teacher/update-profile`,
                updateData,
                { headers: { dToken } }
            );
            
            if (data.success) {
                setProfileData(data.profileData); // Update local state directly
                toast.success(data.message);
                return true;
            }
            toast.error(data.message);
            return false;
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
            return false;
        }
    };




    const value = {
        dToken,
        setDToken,
        backendUrl,
        profileData,
        setProfileData,
        getProfileData,
        getAllClasses,
        classes, // Added to context value
        cancelClass,
        completeClass,
        updateProfileData
    };

    return (
        <TeacherContext.Provider value={value}>
            {props.children}
        </TeacherContext.Provider>
    );
};

export default TeacherContextProvider;