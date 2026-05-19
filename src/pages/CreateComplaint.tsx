import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertCircle, Loader2, Crosshair } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCurrentLocation } from "../utils/getCurrentLocation";

// Simple reusable error component for clean code
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
      <AlertCircle size={12} /> {message}
    </p>
  );
};

const CreateComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false); // Track GPS loading state separately
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { userToken } = useContext(AuthContext);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("image", data.image[0]);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);

      await API.post("/complaints", formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the auto-fetch trigger
  const handleAutoLocation = async () => {
    setLocating(true);
    try {
      const coords: any = await getCurrentLocation();

      // Programmatically update form fields
      setValue("latitude", coords.latitude.toString());
      setValue("longitude", coords.longitude.toString());

      // Clear manual errors once data is inserted successfully
      trigger(["latitude", "longitude"]);
    } catch (error: any) {
      console.error("Error fetching location:", error);
      alert(
        "Permission denied or GPS unavailable. Please type your coordinates manually.",
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mt-10 mr-10">
        <button
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          onClick={() => navigate("/dashboard")}
        >
          Home
        </button>
      </div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Left Side: Instructions Panel */}
          <div className="bg-black text-white p-10 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold mb-6">File a Report</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Accurate details ensure faster resolution. Please double-check
                your coordinates.
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">
                Patna Municipal Area
              </span>
              <p className="text-gray-500 text-[10px] mt-1">
                Authorized for local civic reports only.
              </p>
            </div>
          </div>

          {/* Right Side: The Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:w-3/5 space-y-5"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Complaint Details
              </h1>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                  Title
                </label>
                <input
                  type="text"
                  className={`w-full border-2 p-3.5 rounded-2xl outline-none transition-all mt-1 ${errors.title ? "border-red-200 bg-red-50 focus:border-red-400" : "border-gray-100 focus:border-black"}`}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                />
                <FieldError message={errors.title?.message as string} />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className={`w-full border-2 p-3.5 rounded-2xl outline-none transition-all mt-1 resize-none ${errors.description ? "border-red-200 bg-red-50 focus:border-red-400" : "border-gray-100 focus:border-black"}`}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Please provide a more detailed description",
                    },
                  })}
                />
                <FieldError message={errors.description?.message as string} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Category
                  </label>
                  <select
                    className={`w-full border-2 p-3.5 rounded-2xl outline-none transition-all mt-1 bg-white ${errors.category ? "border-red-200 bg-red-50" : "border-gray-100 focus:border-black"}`}
                    {...register("category", {
                      required: "Please select a category",
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="WATER">Water</option>
                    <option value="ROAD">Road</option>
                    <option value="SANITATION">Sanitation</option>
                  </select>
                  <FieldError message={errors.category?.message as string} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Photo Evidence
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`w-full border-2 p-2.5 rounded-2xl mt-1 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-black file:text-white ${errors.image ? "border-red-200 bg-red-50" : "border-gray-100"}`}
                    {...register("image", {
                      required: "A photo is required for proof",
                    })}
                  />
                  <FieldError message={errors.image?.message as string} />
                </div>
              </div>

              {/* Location Section */}
              <div className="pt-4 border-t border-gray-50">
                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-red-500" />
                      <span className="font-bold text-xs text-gray-700 uppercase tracking-tighter">
                        Location Coordinates
                      </span>
                    </div>

                    {/* Auto Detect Button */}
                    <button
                      type="button"
                      onClick={handleAutoLocation}
                      disabled={locating}
                      className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black border border-gray-200 hover:border-black px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      {locating ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Locating...
                        </>
                      ) : (
                        <>
                          <Crosshair size={12} />
                          Detect Location
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Latitude"
                      className={`w-full border-2 p-3.5 rounded-2xl outline-none transition-all ${errors.latitude ? "border-red-200 bg-red-50" : "border-gray-100 focus:border-black"}`}
                      {...register("latitude", {
                        required: "Required",
                        pattern: {
                          value: /^-?\d+(\.\d+)?$/,
                          message: "Invalid format",
                        },
                      })}
                    />
                    <FieldError message={errors.latitude?.message as string} />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Longitude"
                      className={`w-full border-2 p-3.5 rounded-2xl outline-none transition-all ${errors.longitude ? "border-red-200 bg-red-50" : "border-gray-100 focus:border-black"}`}
                      {...register("longitude", {
                        required: "Required",
                        pattern: {
                          value: /^-?\d+(\.\d+)?$/,
                          message: "Invalid format",
                        },
                      })}
                    />
                    <FieldError message={errors.longitude?.message as string} />
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900 shadow-xl shadow-black/10"}`}
            >
              {loading ? "Processing..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
