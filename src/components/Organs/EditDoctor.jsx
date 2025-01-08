import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import FormField from '../Atoms/FormField';
import { editDoctor } from '../../services/dataManager';

function EditDoctor() {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;

  useEffect(() => {
    if (doctor) {
      setImagePreview(doctor.image);
    }
  }, [doctor]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number()
      .required('Age is required')
      .positive('Age must be a positive number')
      .integer('Age must be an integer'),
    specialization: Yup.string().required('Specialization is required'),
    contactNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact number must be a 10 digit number')
      .required('Contact number is required'),
    registrationNumber: Yup.string().required('Registration number is required'),
    qualification: Yup.string().required('Qualification is required'),
    image: Yup.mixed()
      .nullable()
      .test('fileFormat', 'Unsupported File Format', (value) =>
        !value || ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)
      )
      .test('fileSize', 'File Size is too large', (value) => !value || value.size <= 5 * 1024 * 1024),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: doctor?.name || '',
      age: doctor?.age || '',
      specialization: doctor?.specialization || '',
      qualification: doctor?.qualification || '',
      contactNumber: doctor?.contactNumber || '',
      registrationNumber: doctor?.registrationNumber || '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('age', values.age);
        formData.append('specialization', values.specialization);
        formData.append('qualification', values.qualification);
        formData.append('contactNumber', values.contactNumber);
        formData.append('registrationNumber', values.registrationNumber);

        if (values.image) {
          formData.append('image', values.image);
        } else if (doctor?.image) {
          formData.append('image', doctor.image);
        }

        await editDoctor(doctor._id, formData);
        toast.success('Doctor details updated successfully!');
        navigate('/');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update doctor details');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && isValidImage(file.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        formik.setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image (JPG, JPEG, PNG)');
    }
  };

  const isValidImage = (fileName) => {
    const validFormats = ['.jpg', '.jpeg', '.png'];
    return validFormats.some((format) => fileName.toLowerCase().endsWith(format));
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-8">Edit Doctor</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
              helperText={formik.errors.name}
            />
            <FormField
              label="Age"
              type="number"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && formik.errors.age}
              helperText={formik.errors.age}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Specialization"
              type="text"
              name="specialization"
              value={formik.values.specialization}
              onChange={formik.handleChange}
              error={formik.touched.specialization && formik.errors.specialization}
              helperText={formik.errors.specialization}
            />
            <FormField
              label="Qualification"
              type="text"
              name="qualification"
              value={formik.values.qualification}
              onChange={formik.handleChange}
              error={formik.touched.qualification && formik.errors.qualification}
              helperText={formik.errors.qualification}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact Number"
              type="text"
              name="contactNumber"
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
              error={formik.touched.contactNumber && formik.errors.contactNumber}
              helperText={formik.errors.contactNumber}
            />
            <FormField
              label="Registration Number"
              type="text"
              name="registrationNumber"
              value={formik.values.registrationNumber}
              onChange={formik.handleChange}
              error={formik.touched.registrationNumber && formik.errors.registrationNumber}
              helperText={formik.errors.registrationNumber}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Doctor Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Doctor" className="w-24 h-24 object-cover rounded-full border" />
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditDoctor;
