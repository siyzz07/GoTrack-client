import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { addTrip } from '../../services/apiService.ts/tripApiService'

interface IAddtrip {
  closePopup: (value: boolean) => void
}

const validationSchema = Yup.object({
  tripName: Yup.string()
    .required('Trip name is required')
    .min(3, 'Must be at least 3 characters'),
})

const AddTrip = ({ closePopup }: IAddtrip) => {
  const [file, setFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      tripName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const added = await addTrip({ ...values, file });
      
      console.log(values, file)

      closePopup(false)
      resetForm()
      setFile(null)
    },
  })

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 relative">

          <button
            onClick={() => closePopup(false)}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Trip
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">

            {/* Trip Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Trip Name
              </label>

              <input
                type="text"
                name="tripName"
                placeholder="e.g. Kakkanad"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                value={formik.values.tripName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.tripName && formik.errors.tripName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.tripName}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Upload Log / CSV
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 relative cursor-pointer">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />

                <CloudUploadIcon
                  className={file ? 'text-blue-600' : 'text-gray-300'}
                />

                <p className="mt-2 text-sm text-gray-600">
                  {file ? file.name : 'Click or drop log file here'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700"
            >
              Save Trip Details
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddTrip