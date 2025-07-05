import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTasks = async (token) => {
    const response = await fetch(
      "https://todobackend-bi77.onrender.com/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log("Fetched tasks:", data); // Ensure tasks is always an array
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    const response = await fetch(
      "https://todobackend-bi77.onrender.com/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority: "medium" }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`https://todobackend-bi77.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(
      `https://todobackend-bi77.onrender.com/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://todobackend-bi77.onrender.com/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  ); // Main app UI for authenticated users

  const MainApp = () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Navbar */}
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium transition hover:bg-orange-200"
            >
              Home
            </a>
          </li>
        </ul>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-12 py-10">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-8 drop-shadow-sm">
          MERN To-Do App
        </h1>

        {/* Add Task Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <input
            type="text"
            placeholder="Add a task"
            className="flex-1 p-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            Add
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            className="p-3 border border-orange-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            value={filterPriority}
            className="p-3 border border-orange-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-orange-100 transition"
            >
              <div className="flex-1">
                <span className="text-lg font-medium text-orange-800">
                  {task.text}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({task.status}, {task.priority})
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  className={`px-3 py-1 rounded-full font-medium transition ${
                    task.status === "pending"
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                      : "bg-green-400 text-green-900 hover:bg-green-500"
                  }`}
                >
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>

                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                  className="p-2 border border-orange-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <button
                  onClick={() => deleteTask(task._id)}
                  title="Delete Task"
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 text-white text-center py-4 shadow-inner">
        © 2025 Your To-Do App
      </footer>
    </div>
  );

  return (
    <Router>
           {" "}
      <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/signup" element={<Signup />} />       {" "}
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
             {" "}
      </Routes>
         {" "}
    </Router>
  );
}

export default App;
