import { useContext, useState } from "react";
import API from "../api/axios";
import { Star, Send, CheckCircle2 } from "lucide-react"; // Using lucide-react for a premium feel
import { AuthContext } from "../context/AuthContext";

const FeedbackForm = ({ complaintId }: { complaintId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0); // For star hover effect
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { userToken } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post(
        `/feedback/${complaintId}`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Feedback error:", error);
      if (error.response && [401, 403].includes(error.response.status)) {
        setError("Authorization Error");
      }
      if (error.response && [400].includes(error.response.status)) {
        setError("Feedback allowed only for resolved/rejected complaints");
      } else {
        console.log("An error occurred:", error.message);
      }
    } finally {
      setLoading(false);
      // onClose();
    }
  };

  //   const handleSubmit = async (e: any) => {
  //     e.preventDefault();
  //     console.log({ rating, comment, complaintId });
  //     try {
  //       await API.post(`/feedback/${complaintId}`, {
  //         rating,
  //         comment,
  //       });

  //       alert("Feedback submitted");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  // Show success state after submission
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="text-green-600 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
        <p className="text-gray-500 mt-2">
          Your feedback has been successfully submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
          How would you rate the resolution?
        </label>

        {/* Star Rating System */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-all duration-200 transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={36}
                className={`${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 fill-transparent"
                } transition-colors duration-200`}
              />
            </button>
          ))}
          <span className="ml-4 text-lg font-bold text-gray-400 self-center">
            {rating}/5
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Your Comments
        </label>
        <textarea
          placeholder="What could we do better? (Optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none transition-all resize-none bg-gray-50"
        />
      </div>

      <button
        disabled={loading}
        className={`w-full group relative overflow-hidden bg-black text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-black/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
            Submit Feedback
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-3 p-4 w-full sm:w-10/12 mx-auto mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Alert Icon */}
          <div className="shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
        This feedback is anonymous and helps improve civic services.
      </p>
    </form>
  );
};

export default FeedbackForm;
// import { useState } from "react";

// import API from "../api/axios";

// const FeedbackForm = ({ complaintId }: { complaintId: string }) => {
//   const [rating, setRating] = useState(5);

//   const [comment, setComment] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     console.log({ rating, comment, complaintId });
//     try {
//       await API.post(`/feedback/${complaintId}`, {
//         rating,
//         comment,
//       });

//       alert("Feedback submitted");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-5 rounded-xl shadow mt-5"
//     >
//       <h2 className="text-xl font-bold mb-4">Give Feedback</h2>

//       <select
//         value={rating}
//         onChange={(e: any) => setRating(e.target.value)}
//         className="border p-3 rounded w-full mb-4"
//       >
//         <option value="5">Excellent</option>

//         <option value="4">Good</option>

//         <option value="3">Average</option>

//         <option value="2">Poor</option>

//         <option value="1">Very Poor</option>
//       </select>

//       <textarea
//         placeholder="Write your feedback..."
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         className="border p-3 rounded w-full mb-4"
//       />

//       <button className="bg-black text-white px-5 py-3 rounded">
//         Submit Feedback
//       </button>
//     </form>
//   );
// };

// export default FeedbackForm;
