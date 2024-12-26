import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate, useParams } from 'react-router-dom';

const AssignClasses = () => {
  const { expert } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { teachers } = useContext(AdminContext);

  const applyFilter = () => {
    if (expert) {
      setFilterDoc(teachers.filter((teacher) => teacher.expert === expert));
    } else {
      setFilterDoc(teachers);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [teachers, expert]);

  return (
    <div className="px-6 py-8">
      <p className="text-gray-600 text-base">Browse through the subject matter experts.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filters Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 border rounded-lg text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Filters
        </button>
        {/* Filters Section */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {['English', 'Hindi', 'Maths', 'Science', 'Social Science', 'Sanskrit'].map((subject) => (
            <p
              key={subject}
              onClick={() =>
                expert === subject
                  ? navigate('/assign-class')
                  : navigate(`/assign-class/${subject}`)
              }
              className={`w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-all ${
                expert === subject ? 'bg-[#E2E5FF] text-black font-semibold' : 'bg-white'
              }`}
            >
              {subject}
            </p>
          ))}
        </div>
        {/* Teachers Section */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/schedule-class/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
            >
              <img className="bg-[#EAEFFF] w-full h-40 object-cover" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    item.available ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                  <span>{item.available ? 'Available' : 'Not Available'}</span>
                </div>
                <p className="text-[#262626] text-lg font-medium mt-2">{item.name}</p>
                <p className="text-[#5C5C5C] text-sm">{item.expert}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignClasses;
