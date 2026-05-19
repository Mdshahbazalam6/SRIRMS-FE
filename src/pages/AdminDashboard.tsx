import { useContext, useEffect, useState } from "react";

import API from "../api/axios";
import Dialog from "../components/Dialog";
import { ClipboardList, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedBack, setFeedBack] = useState<any>(null);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] =
    useState(false);
  const [departmentData, setDepartmentData] = useState<any>();

  const { register, handleSubmit } = useForm();

  const { adminToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const response = await API.get("/admin/complaints", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setComplaints(response.data);
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        alert("Unauthorized Access");
        navigate("/admin-login");
      } else {
        alert("An error occurred");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/departments", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setDepartmentData(response.data);
    } catch (error: any) {
      console.log(error);
      if (error.response && [401, 403].includes(error.response.status)) {
        alert("Unauthorized Access");
        navigate("/admin-login");
      } else {
        alert("An error occurred");
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await API.patch(
        `/complaints/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      fetchComplaints();
    } catch (error: any) {
      console.log(error);
      alert("Error in Updating the Status");
      if (error.response && [401, 403].includes(error.response.status)) {
        alert("Unauthorized Access");
        navigate("/admin-login");
      } else {
        alert("An error occurred");
      }
    }
  };

  const assignDepartment = async (
    departmentId: string,
    complaintId: string,
  ) => {
    console.log(complaintId, "complainet");
    try {
      await API.patch(
        `/complaints/department/assign/${departmentId}/${complaintId}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      fetchComplaints();
    } catch (error) {
      console.log(error);
      alert("Error occurred in assigning department");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchDepartments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "RESOLVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const createDepartment = async (data: any) => {
    try {
      await API.post("/departments", data, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      alert("Department created!");
    } catch (error: any) {
      console.log(error);
      if (error.response && [400].includes(error.response.status)) {
        alert("Department already exist with this name");
      } else {
        alert("Error in creating the department");
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
        <div className="flex justify-between items-start gap-5">
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            onClick={() => {
              navigate("/admin/analytics");
            }}
          >
            Show Analytics
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            onClick={() => setShowCreateDepartmentForm(true)}
          >
            Create Department
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 border-2 border-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 hover:border-red-600 transition-all active:scale-95 shadow-sm"
            onClick={() => {
              logout("ADMIN");
              navigate("/admin-login");
            }}
          >
            Logout
          </button>
          <Dialog
            isOpen={showCreateDepartmentForm}
            onClose={() => setShowCreateDepartmentForm(false)}
            title="Create Department"
          >
            <form
              onSubmit={handleSubmit(createDepartment)}
              className="bg-white p-8 rounded-xl w-full"
            >
              <input
                type="text"
                placeholder="Department name"
                className="w-full border p-3 rounded mb-4"
                {...register("departmentName")}
              />

              <button className="w-full bg-black text-white py-3 rounded">
                Create
              </button>
            </form>
          </Dialog>
        </div>
      </div>

      {complaints.length > 0 ? (
        <div className="grid gap-5">
          {complaints.map((complaint: any) => (
            <div key={complaint._id} className="bg-white p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">{complaint.title}</h2>

                <div className="flex gap-5 items-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(complaint.status)}`}
                  >
                    {complaint.status}
                  </span>
                  {complaint.departmentId && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                      {complaint.departmentId.departmentName}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3">{complaint.description}</p>

              <div className="flex flex-wrap gap-4 mt-6 items-center border-t pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Update Status
                  </label>
                  <select
                    className={`border-2 p-2.5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(status)}`}
                    // value={status}
                    onChange={(e: any) => {
                      updateStatus(complaint._id, e.target.value);
                    }}
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="ASSIGNED">Assigned to Staff</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assign Department
                  </label>
                  <select
                    className={`border-2 p-2.5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1`}
                    onChange={(e: any) => {
                      assignDepartment(e.target.value, complaint._id);
                    }}
                  >
                    <option value="">Department</option>
                    {departmentData?.map((ele: any) => (
                      <option key={ele._id} value={ele._id}>
                        {ele.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Evidence
                  </label>
                  <button
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
                    onClick={() => {
                      setImageUrl(complaint.imageUrl);
                      setShowImage(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    View Attachment
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Review
                  </label>
                  <button
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
                    onClick={() => {
                      setShowFeedback(true);
                      setFeedBack(complaint.feedBackId);
                    }}
                    disabled={!complaint.feedbackSubmitted}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    See Review
                  </button>
                </div>

                <Dialog
                  isOpen={showImage}
                  onClose={() => setShowImage(false)}
                  title="Feedback"
                >
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={imageUrl}
                      alt="Complaint"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </Dialog>

                <Dialog
                  isOpen={showFeedback}
                  onClose={() => setShowFeedback(false)}
                  title="Feedback"
                >
                  <div className="rounded-lg overflow-hidden">
                    {/* Star Rating System */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="transition-all duration-200 transform hover:scale-110"
                        >
                          <Star
                            size={36}
                            className={`${
                              star <= feedBack?.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 fill-transparent"
                            } transition-colors duration-200`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-lg font-bold text-gray-400 self-center">
                        {feedBack?.rating}/5
                      </span>
                    </div>
                    <p className="mt-3">{feedBack?.comment}</p>
                  </div>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Empty State UI  */}
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ClipboardList size={48} className="text-gray-300" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No complaints found
            </h2>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              It looks like there are no civic issues reported yet.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
