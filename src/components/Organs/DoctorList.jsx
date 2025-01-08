import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { getDoctor, deleteDoctor } from '../../services/dataManager';
import { useNavigate } from 'react-router-dom';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 1, limit: 10 });
  const [query, setQuery] = useState('');
  const [totalDoctors, setTotalDoctors] = useState(0);

  const navigate = useNavigate();

  const handleEdit = (doctor) => {
    navigate('/editDoctor', { state: { doctor } });
  };

  const handleDelete = async (doctorId) => {
    const confirmation = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmation) return;

    try {
      setLoading(true);
      await deleteDoctor(doctorId);
      toast.success('Doctor deleted successfully!');
      fetchDoctors(paginationModel.page, query);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to delete doctor.');
      } else {
        toast.error(error.message || 'An error occurred while deleting the doctor.');
      }
    }
  };

  // Fetch the doctor list with pagination
  const fetchDoctors = async (page, query) => {
    setLoading(true);
    try {
      const response = await getDoctor(page, query);
      const doctorsData = response?.data?.doctors;
      const total = response?.data?.total;

      if (doctorsData && Array.isArray(doctorsData)) {
        setDoctors(doctorsData);
      } else {
        setDoctors([]);
      }

      setTotalDoctors(total);
      setLoading(false);
    } catch (err) {
      setError(err?.message || 'An error occurred while fetching the doctor list.');
      setLoading(false);
      toast.error(err?.message || 'Failed to fetch doctors');
    }
  };

  useEffect(() => {
    fetchDoctors(paginationModel.page, query);
  }, [paginationModel.page, query]);

  const totalPages = Math.ceil(totalDoctors / paginationModel.limit);

  const handleNextPage = () => {
    if (paginationModel.page < totalPages) {
      setPaginationModel({ ...paginationModel, page: paginationModel.page + 1 });
    }
  };

  const handlePrevPage = () => {
    if (paginationModel.page > 1) {
      setPaginationModel({ ...paginationModel, page: paginationModel.page - 1 });
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full lg:max-w-6xl bg-white p-4 lg:p-8 rounded-lg shadow-lg">
          <h2 className="text-xl lg:text-2xl font-semibold text-center text-indigo-600 mb-4 lg:mb-8">
            Doctors List
          </h2>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search by name, specialization, or qualification"
              className="w-full lg:w-1/3 p-2 border border-gray-300 rounded-lg"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPaginationModel({ ...paginationModel, page: 1 });
              }}
            />
          </div>
          {loading ? (
            <div className="text-center text-sm lg:text-lg text-gray-500">Loading doctors...</div>
          ) : error ? (
            <div className="text-center text-sm lg:text-lg text-red-600">{error}</div>
          ) : doctors.length === 0 ? (
            <div className="text-center text-sm lg:text-lg text-gray-500">No doctors available.</div>
          ) : (
            <>
              <div className="block lg:hidden space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.registrationNumber}
                    className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    {doctor.image && (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-24 h-24 object-cover rounded-full self-center mb-4"
                      />
                    )}
                    <div>
                      <p className="text-lg font-medium text-indigo-600">{doctor.name}</p>
                      <p className="text-sm text-gray-600">Age: {doctor.age}</p>
                      <p className="text-sm text-gray-600">Specialization: {doctor.specialization}</p>
                      <p className="text-sm text-gray-600">Qualification: {doctor.qualification}</p>
                      <p className="text-sm text-gray-600">
                        Registration No.: {doctor.registrationNumber}
                      </p>
                      <p className="text-sm text-gray-600">Contact: {doctor.contactNumber}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="text-indigo-600 hover:text-indigo-800 mr-4"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(doctor._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="px-6 py-3 text-left">Image</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Age</th>
                      <th className="px-6 py-3 text-left">Specialization</th>
                      <th className="px-6 py-3 text-left">Qualification</th>
                      <th className="px-6 py-3 text-left">Registration No.</th>
                      <th className="px-6 py-3 text-left">Contact Number</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.registrationNumber} className="border-b">
                        <td className="px-6 py-3">
                          {doctor.image && (
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          )}
                        </td>
                        <td className="px-6 py-3">{doctor.name}</td>
                        <td className="px-6 py-3">{doctor.age}</td>
                        <td className="px-6 py-3">{doctor.specialization}</td>
                        <td className="px-6 py-3">{doctor.qualification}</td>
                        <td className="px-6 py-3">{doctor.registrationNumber}</td>
                        <td className="px-6 py-3">{doctor.contactNumber}</td>
                        <td className="py-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={() => handleEdit(doctor)}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-4 text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(doctor._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="flex flex-col lg:flex-row justify-between mt-4 lg:mt-8">
            <button
              onClick={handlePrevPage}
              disabled={paginationModel.page === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray mb-2 lg:mb-0"
            >
              Previous
            </button>
            <span className="self-center text-sm lg:text-lg">
              Page {paginationModel.page} of {Math.ceil(totalDoctors / paginationModel.limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={paginationModel.page === Math.ceil(totalDoctors / paginationModel.limit)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorList;
