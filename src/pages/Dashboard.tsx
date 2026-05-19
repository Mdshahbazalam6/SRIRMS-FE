import { useContext, useEffect, useState } from "react";
import { Plus, MessageSquare, Tag, Info, ClipboardList } from "lucide-react";
import API from "../api/axios";
import Dialog from "../components/Dialog";
import FeedbackForm from "../components/FeedbackForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { userToken, logout } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      const response = await API.get("/complaints", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setComplaints(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/");
      } else {
        alert("Error in getting complaints!");
        console.log("An error occurred:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    console.log(complaints, "complaints");
  }, []);

  const handleFeedback = (id: string) => {
    setIsFeedbackOpen(true);
    setSelectedComplaintId(id);
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Rural Civic Complaints
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage community issues in real-time.
          </p>
        </div>

        <div className="flex gap-5 items-center">
          <a
            href="/create-complaint"
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Create Complaint
          </a>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 border-2 border-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 hover:border-red-600 transition-all active:scale-95 shadow-sm"
            onClick={() => {
              logout("USER");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {complaints.length > 0 ? (
        <>
          {/* Grid Section */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complaints.map((complaint: any) => (
              <div
                key={complaint._id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={
                      complaint.imageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={complaint.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <Tag size={12} />
                      {complaint.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {complaint.title}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(complaint.status)}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-0 mt-auto">
                  <button
                    onClick={() => handleFeedback(complaint._id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors border border-gray-200 disabled:hover:cursor-not-allowed"
                    disabled={
                      !["RESOLVED", "REJECTED"].includes(complaint.status) ||
                      (["RESOLVED", "REJECTED"].includes(complaint.status) &&
                        complaint.feedbackSubmitted)
                    }
                  >
                    <MessageSquare size={16} />
                    {!complaint.feedbackSubmitted
                      ? "Add Feedback"
                      : "Feedback Submitted"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SINGLE Dialog outside the loop */}
          <Dialog
            isOpen={isFeedbackOpen}
            onClose={() => setIsFeedbackOpen(false)}
            title="Submit Feedback"
          >
            <div className="p-2">
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <Info size={16} />
                Your feedback helps us improve rural services.
              </p>
              <FeedbackForm complaintId={selectedComplaintId} />
            </div>
          </Dialog>
        </>
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
              It looks like there are no civic issues reported yet. Be the first
              to help improve your community by reporting an issue.
            </p>

            <a
              href="/create-complaint"
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-black/10 hover:shadow-black/20 active:scale-95"
              onClick={() => navigate("/create-complaint")}
            >
              <Plus size={20} />
              Report New Issue
            </a>
          </div>
        </>
      )}
    </div>
  );

  // return (
  //   <div className="p-10">
  //     <div className="flex justify-between mb-10">
  //       <h1 className="text-3xl font-bold">Rural Civic Complaints</h1>

  //       <a
  //         href="/create-complaint"
  //         className="bg-black text-white px-5 py-3 rounded-lg"
  //       >
  //         Create Complaint
  //       </a>
  //     </div>

  //     <div className="grid grid-cols-3 gap-5">
  //       {complaints.map((complaint: any) => (
  //         <div key={complaint._id} className="bg-white p-5 rounded-xl shadow ">
  //           <img
  //             src={complaint.imageUrl}
  //             alt="Complaint"
  //             style={{ width: "100%", borderRadius: "8px" }}
  //             className="h-75 object-contain"
  //           />

  //           <h2 className="text-xl font-semibold">{complaint.title}</h2>

  //           <p className="text-gray-500 mt-2">{complaint.description}</p>

  //           <div className="mt-4 flex justify-between">
  //             <span className="bg-yellow-100 px-3 py-1 rounded">
  //               {complaint.category}
  //             </span>

  //             <span className="bg-green-100 px-3 py-1 rounded">
  //               {complaint.status}
  //             </span>
  //             <span
  //               onClick={() => handleFeedback(complaint._id)}
  //               className="bg-green-100 px-3 py-1 rounded"
  //             >
  //               Add FeedBack
  //             </span>
  //           </div>
  //           <Dialog
  //             isOpen={isFeedbackOpen}
  //             onClose={() => setIsFeedbackOpen(false)}
  //             title="Confirm Submission"
  //           >
  //             <FeedbackForm complaintId={selectedComplaintId} />
  //           </Dialog>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default Dashboard;
