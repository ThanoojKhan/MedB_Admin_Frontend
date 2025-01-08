import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import FormField from '../Atoms/FormField';
import { addDoctor } from '../../services/dataManager';
import { useNavigate } from 'react-router-dom';

function DoctorForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer'),
    specialization: Yup.string().required('Specialization is required'),
    contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Contact number must be a 10 digit number').required('Contact number is required'),
    registrationNumber: Yup.string().required('Registration number is required'),
    qualification: Yup.string().required('Qualification is required'),
    image: Yup.mixed()
      .nullable()
      .required('Image is required')
      .test('fileFormat', 'Unsupported File Format', (value) => {
        return value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type);
      })
      .test('fileSize', 'File Size is too large', (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB limit
      }),
  });

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      name: '',
      age: '',
      specialization: '',
      qualification: '',
      contactNumber: '',
      registrationNumber: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true); 
      try {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("age", values.age);
        formData.append("specialization", values.specialization);
        formData.append("qualification", values.qualification);
        formData.append("contactNumber", values.contactNumber);
        formData.append("registrationNumber", values.registrationNumber);
        formData.append("image", values.image);

        await addDoctor(formData);
        toast.success('Doctor details added successfully!');
        formik.resetForm();
        setImagePreview(null);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || 'Failed to add doctor.');
        } else {
          toast.error(error.message || 'An error occurred while adding doctor.');
        }
      } finally {
        setLoading(false); 
      }
    },
  });

  const handleImageChange = (img) => {
    const file = img.target.files[0];
    if (file && isValidImage(file.name)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImagePreview(reader.result);
        formik.setFieldValue('image', file);
      };
      reader.onerror = (err) => {
        console.log(err);
      };
    } else {
      toast.error('Please select a valid image (JPG, JPEG, PNG)');
    }
  };

  // Helper function to validate image type
  const isValidImage = (fileName) => {
    const validFormats = ['.jpg', '.jpeg', '.png'];
    return validFormats.some((format) => fileName.toLowerCase().endsWith(format));
  };

  // Function to handle close button click
  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center bg-gray relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-lg z-50">
            <div className="text-white text-lg font-semibold">
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-transparent rounded-full animate-spin border-indigo-600"></div>
              </div>
              <p className="mt-4">Adding Doctor...</p>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg z-10 relative">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-8">Add New Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
            <FormField
              label="Age"
              type="number"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.age && formik.errors.age}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Specialization"
              type="text"
              name="specialization"
              value={formik.values.specialization}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.specialization && formik.errors.specialization}
            />
            <FormField
              label="Qualification"
              type="text"
              name="qualification"
              value={formik.values.qualification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.qualification && formik.errors.qualification}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact Number"
              type="text"
              name="contactNumber"
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contactNumber && formik.errors.contactNumber}
            />
            <FormField
              label="Registration Number"
              type="text"
              name="registrationNumber"
              value={formik.values.registrationNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.registrationNumber && formik.errors.registrationNumber}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Doctor Image</label>
            {imagePreview && (
              <div className="flex items-center justify-center mt-4">
                <img src={imagePreview} alt="Doctor Preview" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.image && formik.errors.image && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.image}</div>
            )}
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-4 h-4 border-4 border-t-4 border-transparent rounded-full animate-spin border-indigo-600"></div>
                </div>
              ) : (
                'Add Doctor'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-950"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default DoctorForm;
