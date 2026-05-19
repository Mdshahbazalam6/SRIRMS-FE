import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { useContext, useEffect, useState } from "react";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { adminToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };
      const dashboard = await API.get("/analytics/dashboard", headers);

      const categories = await API.get("/analytics/categories", headers);

      const monthly = await API.get("/analytics/monthly-trends", headers);

      const feedback = await API.get("/analytics/feedback", headers);

      setDashboardData(dashboard.data);

      setCategoryData(categories.data);

      setMonthlyData(monthly.data);

      setFeedbackData(feedback.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* <h1 className="text-4xl font-bold mb-10">Analytics Dashboard</h1> */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-10">Analytics Dashboard</h1>
        <div className="flex justify-between items-start gap-5">
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            onClick={() => {
              navigate("/admin/dashboard");
            }}
          >
            Dashboard
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 border-2 border-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 hover:border-red-600 transition-all active:scale-95 shadow-sm"
            onClick={() => logout("ADMIN")}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Dashboard Cards */}

      <div className="grid grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Complaints</h2>

          <p className="text-3xl font-bold">{dashboardData.totalComplaints}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Pending</h2>

          <p className="text-3xl font-bold">
            {dashboardData.pendingComplaints}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Assigned</h2>

          <p className="text-3xl font-bold">
            {dashboardData.assignedComplaints}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Resolved</h2>

          <p className="text-3xl font-bold">
            {dashboardData.resolvedComplaints}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Rejected</h2>

          <p className="text-3xl font-bold">
            {dashboardData.rejectedComplaints}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">In Progress</h2>

          <p className="text-3xl font-bold">
            {dashboardData.inProgressComplaints}
          </p>
        </div>
      </div>

      {/* Category Analytics */}

      <div className="bg-white p-5 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-5">Complaint Categories</h2>

        <BarChart width={700} height={300} data={categoryData}>
          <XAxis dataKey="_id" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="count" />
        </BarChart>
      </div>

      {/* Monthly Trends */}

      <div className="bg-white p-5 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-5">Monthly Trends</h2>

        <LineChart width={700} height={300} data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id.month" />

          <YAxis />

          <Tooltip />

          <Line type="monotone" dataKey="total" />
        </LineChart>
      </div>

      {/* Feedback Analytics */}

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-5">Feedback Analytics</h2>

        <p className="text-xl">
          Average Rating: {feedbackData?.averageRating?.[0]?.avgRating}
        </p>

        <PieChart width={400} height={300}>
          <Pie
            data={feedbackData?.ratingDistribution}
            dataKey="total"
            nameKey="_id"
            outerRadius={100}
            fill="#8884d8"
          >
            {feedbackData?.ratingDistribution?.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Analytics;
