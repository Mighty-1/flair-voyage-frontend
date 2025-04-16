import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../ToolKit/authSlice";
import "../styles/myBoats.css";
import { Alert, CircularProgress, Stack, Typography } from "@mui/material";

const MyBoats = () => {
  const token = useSelector((state) => state.auth.token);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boats, setBoats] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteBoat = async (id) => {
    if (!window.confirm("Are you sure you want to delete yacht?")) return;
    try {
      await axios.delete(
        `https://flair-voyage-backend.onrender.com/api/delete-a-yacht/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAlertMessage({
          severity: "error",
          text: "Session expired. Please log in again.",
        });
        dispatch(logout());
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setAlertMessage({
          severity: "success",
          text: "Yacht deleted successfully.",
        });
      }
      return error;
    }
  };

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await axios.get(
          "https://flair-voyage-backend.onrender.com/api/fetch-agent-yachts",
          //`${import.meta.env.VITE_APP_API_URL}/api/fetch-agent-yachts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(response.data)) {
          setBoats(response.data); // ✅ Directly set if it's an array
        } else if (Array.isArray(response.data.yachts)) {
          setBoats(response.data.yachts); // ✅ If array is inside "bookings"
        } else {
          setBoats([]); // ✅ Default to empty array to prevent errors
        }
      } catch (error) {
        setAlertMessage({
          severity: "error",
          text: "Failed to load yachts.",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchBoats();
  }, [token]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : boats.length === 0 ? (
        <Typography variant="h6" className="text-center text-gray-500">
          No Yacht found.
        </Typography>
      ) : (
        <div className="my-boats-container">
          <h1 className="my-boats-title">My Boats</h1>
          {boats.map((boat) => (
            <div key={boat._id} className="boat-card">
              <img
                src={boat.images[0]}
                alt={boat.name}
                className="boat-image"
              />
              <div className="boat-details">
                <h2 className="boat-name">{boat.name}</h2>
                <p className="boat-description">{boat.description}</p>
              </div>
              <img
                onClick={() => handleDeleteBoat(boat._id)}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAKRJREFUSEvtlUEKgCAQRV93CYK6TsdpGXSZrlPQaYpAXVjDt8xd7mR03v8z6FQUXlXh/ChAD4xAYwjZgAGYLaEKsACtcLkC3VvA7i5aQlRclkglUPELwF/I7X1wHFsvDvDKpfXIonn+dfO+BsQK1T7wUx2ohNkl+gGXd/W0JH8P5NeUXSJFeAxIGTQx9HbwWC/5HJUTUCvpLm6OTjUyE/Pbx4oDDlBhOBmYaWrOAAAAAElFTkSuQmCC"
              />
            </div>
          ))}
        </div>
      )}

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

export default MyBoats;
