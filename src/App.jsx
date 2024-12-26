import React, { useContext } from 'react'
import { TeacherContext } from './context/TeacherContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AddTeacher from './pages/Admin/AddTeacher';
import AssignClasses from './pages/Admin/AssignClasses';
import TeachersList from './pages/Admin/TeachersList';
import Login from './pages/Login';
import ScheduleClass from './pages/Admin/ScheduleClass';
import MyClasses from './pages/Admin/MyClasses';
import AssignedClasses from './pages/Teacher/AssignedClasses';
import TeacherProfile from './pages/Teacher/TeacherProfile';
// import DoctorAppointments from './pages/Doctor/DoctorAppointments';
// import DoctorDashboard from './pages/Doctor/DoctorDashboard';
// import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const { dToken } = useContext(TeacherContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/assign-class' element={<AssignClasses />} />
          <Route path='/assign-class/:expert' element={<AssignClasses />} />
          <Route path='/schedule-class/:teacherId' element={<ScheduleClass />} />
          <Route path='/my-classes' element={<MyClasses />} />
          <Route path='/add-teacher' element={<AddTeacher />} />
          <Route path='/teacher-list' element={<TeachersList />} />
          <Route path='/teacher-classes' element={<AssignedClasses />} />
          <Route path='/teacher-profile' element={<TeacherProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App