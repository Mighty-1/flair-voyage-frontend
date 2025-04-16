import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../ToolKit/authSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Login = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // For navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://flair-voyage-backend.onrender.com/api/login",
        // "http://localhost:3000/api/login",
        loginData
      );
      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          text: "Login successful!",
        });
        const { token, user } = response.data;
        // console.log(response), console.log(token);

        // localStorage.setItem("token", (token)); // Store token
        dispatch(login({ user, token })); // Update Redux state
        setErrorMessage("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000); // Wait 3 seconds before navigating
      }
    } catch (error) {
      if (error.message && error.status === 400) {
        setAlertMessage({
          severity: "error",
          text: "Invalid email or password",
        });
        setErrorMessage("Invalid email or password");
      } else {
        setAlertMessage({
          severity: "error",
          text: "Failed to login. Please try again.",
        });
        setErrorMessage("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lg-form-div">
        <form action="" className="lg-login-form">
          <h1 className="lg-title">Welcome</h1>
          <label className="lg-lb">Email :</label>
          <input
            type="email"
            className="lg-input"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <label className="lg-lb">Password :</label>
          <input
            type="password"
            className="lg-input"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="lg-submitBtn" onClick={handleSubmit}>
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
              "Login"
            )}
          </button>
          <Link to={"/signup"} className="lg-signup-link">
            Don&apos;t have an account? Sign Up
          </Link>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
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

export default Login;
