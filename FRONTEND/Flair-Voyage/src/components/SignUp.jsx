import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const SignUp = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAgent: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox separately
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://flair-voyage-backend.onrender.com/api/register",
        //`${import.meta.env.VITE_APP_API_URL}/api/register`,
        formData
      );
      if (response.status === 201) {
        setAlertMessage({
          severity: "success",
          text: "Signup successful!",
        });
        setSuccessMessage("Signup successful! You can now log in.");
        setErrorMessage("");
      } else {
        setErrorMessage("Signup failed. Please try again.");
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      if (error.message && error.status === 400) {
        setAlertMessage({
          severity: "error",
          text: "Email already exists. Please log in.",
        });
        // 400 Conflict: User already exists
        setErrorMessage("Email already exists. Please log in.");
      } else {
        setErrorMessage("Failed to signup. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading either way
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
        <p className="text-2xl font-semibold mb-4">Sign Up</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">
              Name:
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Email:
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Password:
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isAgent"
                className="mr-2"
                checked={formData.isAgent}
                onChange={handleChange}
                // onClick={handleCheckboxClick}
              />
              Boat Agent
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-500">
              Already have an account? Log In
            </Link>
          </p>
        </form>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>

      {alertMessage !== null && (
        <Stack
          sx={{
            width: { xs: "100%", md: "30%" }, // 100% on mobile, 20% on larger screens
            position: "fixed",
            top: 20,
            left: "100%",
            transform: "translateX(-100%)",
            zIndex: 9999,
          }}
          spacing={2}
        >
          <Alert
            sx={{ bgcolor: "background.paper" }}
            variant="outlined"
            severity={alertMessage.severity}
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage.text}
          </Alert>
        </Stack>
      )}
    </>
  );
};

export default SignUp;
