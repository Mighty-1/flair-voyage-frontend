import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setWishlist } from "../ToolKit/wishlistSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  CardContent,
  Button,
} from "@mui/material";
import { logout } from "../ToolKit/authSlice";

const WishList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items); // wishlist stored in redux
  const token = useSelector((state) => state.auth.token);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from backend on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          "https://flair-voyage-backend.onrender.com/api/wishlists",
          // "http://localhost:3000/api/wishlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const wishlistData = response.data;

        dispatch(setWishlist(wishlistData));
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
            severity: "error",
            text: "Failed to load Wishlists.",
          });
        }
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [dispatch, navigate, token, wishlist]);

  // Function to add an item to wishlist using /add-item endpoint
  // const handleAddItem = async (yachtId) => {
  //   try {
  //     const response = await axios.post(
  //       // "https://flair-voyage-backend.onrender.com/api/wishlists/add-item",
  //       `${import.meta.env.VITE_APP_API_URL}/api/wishlists/add-item`,
  //       { yachtId },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     dispatch(setWishlist(response.data)); // Update wishlist state
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       dispatch(logout());
  //       navigate("/login");
  //     } else {
  //       console.error("Error adding item to wishlist:", error);
  //     }
  //   }
  // };

  // Function to remove an item from wishlist using /remove-item endpoint
  const handleRemoveItem = async (yachtId) => {
    try {
      const response = await axios.post(
        "https://flair-voyage-backend.onrender.com/api/wishlists/remove-item",
        // `${import.meta.env.VITE_APP_API_URL}/api/wishlists/remove-item`,
        { yachtId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setWishlist(response.data)); // Update wishlist state
      setAlertMessage({
        severity: "info",
        text: "Yacht removed from wishlist",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        console.error("Error removing item from wishlist:", error);
      }
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        My Wishlist
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ p: { xs: 2, md: 4 }, mb: 10 }}>
          {wishlist && wishlist.length > 0 ? (
            <Grid container spacing={2}>
              {wishlist.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={{ maxWidth: 345, m: "auto" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item?.images?.[0]}
                      alt={item.name || "Yacht"}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {item.name || "Yacht Name"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description || "Description of yacht"}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item._id)}
                          sx={{ flexGrow: 1, mr: 1 }}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ flexGrow: 1 }}
                        >
                          <Link to={`/book-now/${item._id}`}>Book Now</Link>
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary">
              Your wishlist is empty.
            </Typography>
          )}
        </Box>
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

export default WishList;
