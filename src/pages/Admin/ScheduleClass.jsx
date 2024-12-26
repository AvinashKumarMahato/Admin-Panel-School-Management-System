import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import RelatedTeachers from '../../components/RelatedTeachers';
import axios from 'axios';
import { toast } from 'react-toastify';

const ScheduleClass = () => {
    const { teacherId } = useParams();
    const { teachers, aToken } = useContext(AdminContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const selectClass = ['CLASS 1', 'CLASS 2', 'CLASS 3', 'CLASS 4', 'CLASS 5', 'CLASS 6', 'CLASS 7', 'CLASS 8', 'CLASS 9', 'CLASS 10']
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [teacherInfo, setTeacherInfo] = useState(null);
    const [teacherSlots, setTeacherSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [selectedClass, setSelectedClass] = useState('CLASS 1');

    const navigate = useNavigate();

    const fetchDocInfo = () => {
        const teacherInfo = teachers.find((teacher) => teacher._id === teacherId);
        setTeacherInfo(teacherInfo);
    };

    const getAvailableSolts = () => {
        setTeacherSlots([]);
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(16, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;

                const isSlotAvailable = teacherInfo.slots_booked[slotDate]?.includes(formattedTime) ? false : true;

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setTeacherSlots(prev => [...prev, timeSlots]);
        }
    };

    // const handleScheduleClass = async () => {
    //     console.log("Schedule class function triggered");

    //     if (!aToken) {
    //         toast.warning('Login to schedule class');
    //         return navigate('/login');
    //     }

    //     if (!slotTime) {
    //         toast.warning('Please select time slot');
    //         return;
    //     }

    //     const date = teacherSlots[slotIndex][0].datetime;
    //     const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    //     // Add this console.log to see the exact payload
    //     const payload = {
    //         teacherId,
    //         slotDate,
    //         slotTime,
    //         teacherData: teacherInfo,
    //         selectedClass, // Make sure this is included
    //     };
    //     console.log("Payload being sent:", payload);

    //     try {
    //         const { data } = await axios.post(
    //             `${backendUrl}/api/admin/schedule-class`,
    //             payload,
    //             { headers: { aToken } }
    //         );

    //         console.log("API Response:", data);

    //         if (data.message === 'Class scheduled successfully!' && data.class) {
    //             toast.success(data.message);
    //             console.log("Navigating to /my-classes...");
    //             navigate('/my-classes');
    //         } else {
    //             console.log("Condition not met: Data does not match expected structure.");
    //         }
    //     } catch (error) {
    //         console.error("Error occurred:", error);
    //         toast.error(error.response?.data?.message || 'Scheduling failed');
    //     }
    // };

    // ScheduleClass.jsx - modify handleScheduleClass
    const handleScheduleClass = async () => {
        console.log("Schedule class function triggered");
    
        if (!aToken) {
            toast.warning('Login to schedule class');
            return navigate('/login');
        }
    
        if (!slotTime) {
            toast.warning('Please select time slot');
            return;
        }
    
        const date = teacherSlots[slotIndex][0].datetime;
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    
        // Create the class data object
        const classData = {
            teacherId,
            slotDate,
            slotTime,
            teacherData: teacherInfo,
            selectedClass: selectedClass // Make sure this is explicitly set
        };
    
        console.log("Class Data being sent:", classData);
    
        try {
            // Try calling the scheduleClass function from context instead of direct API call
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
    
            console.log("Full API Response:", response);
    
            if (response.data.message === 'Class scheduled successfully!') {
                toast.success('Class scheduled successfully!');
                navigate('/my-classes');
            }
        } catch (error) {
            console.error("Full error object:", error);
            toast.error(error.response?.data?.message || 'Scheduling failed');
        }
    };

    useEffect(() => {
        console.log("Selected class changed:", selectedClass);
    }, [selectedClass]);


    useEffect(() => {
        if (teachers.length > 0) fetchDocInfo();
    }, [teachers, teacherId]);

    useEffect(() => {
        if (teacherInfo) getAvailableSolts();
    }, [teacherInfo]);

    if (!teacherInfo) return null;

    return (
        <div className="px-4 sm:px-8 lg:px-16">
            <div className="flex flex-col sm:flex-row gap-6 mt-6">
                <div>
                    <img className="bg-primary w-full sm:max-w-xs rounded-lg shadow-md" src={teacherInfo.image} alt="" />
                </div>

                <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white">
                    <p className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                        {teacherInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="" />
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <p>{teacherInfo.degree} - {teacherInfo.expert}</p>
                        <button className="py-0.5 px-2 border border-gray-300 text-xs rounded-full">
                            {teacherInfo.experience}
                        </button>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-700 mt-3">
                            About
                            <img className="w-4" src={assets.info_icon} alt="" />
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{teacherInfo.about}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <p className="font-medium text-gray-700">Class Timing</p>
                <div className="mt-4">
                    <label className="block text-gray-700 font-medium">Select Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-2 border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                    >
                        {selectClass.map((classOption, index) => (
                            <option key={index} value={classOption}>
                                {classOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-3 overflow-x-auto mt-4">
                    {teacherSlots?.length > 0 && teacherSlots.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`text-center py-4 min-w-20 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300 text-gray-700'
                                }`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 overflow-x-auto mt-4">
                    {teacherSlots?.length > 0 && teacherSlots[slotIndex]?.map((item, index) => (
                        <p
                            key={index}
                            onClick={() => setSlotTime(item.time)}
                            className={`text-sm px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-400 text-gray-700'
                                }`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={handleScheduleClass}
                    className="bg-primary text-white px-8 py-3 rounded-full mt-6 shadow hover:opacity-90"
                >
                    Schedule Class
                </button>
            </div>

            <RelatedTeachers expert={teacherInfo.expert} teacherId={teacherId} />
        </div>
    );
};

export default ScheduleClass;