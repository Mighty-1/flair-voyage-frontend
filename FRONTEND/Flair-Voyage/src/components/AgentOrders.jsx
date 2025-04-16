import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  CircularProgress,
  Table,
  Stack,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AgentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token); // Get token from Redux

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://flair-voyage-backend.onrender.com/api/agent/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
        return err;
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const confirmOrder = async (orderId) => {
    try {
      await axios.put(
        `https://flair-voyage-backend.onrender.com/api/orders/${orderId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "confirmed" } : order
        )
      );
    } catch (err) {
      setError("Failed to confirm order.");
      return err;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.put(
        `https://flair-voyage-backend.onrender.com/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (error) {
        setError("Failed to cancel order.");
        return error;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
          <CircularProgress />
    </div>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2} sx={{ px: { xs: 1, md: 3 }, py: 2 }}>
      <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
        Orders
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", width: "100%" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Yacht</strong>
              </TableCell>
              <TableCell>
                <strong>Customer</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Time</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Payment</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.yacht?.name}</TableCell>
                <TableCell>
                  {order.user.name} <br />
                  <Typography variant="body2" color="text.secondary">
                    {order.user.email}
                  </Typography>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.time}</TableCell>
                <TableCell>₦{order.yacht?.price}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: order.status === "confirmed" ? "green" : "red",
                      //   fontWeight: "bold"
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.status !== "confirmed" &&
                  order.status !== "cancelled" ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => confirmOrder(order._id)}
                        sx={{ minWidth: "80px", mr: 1 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => cancelOrder(order._id)}
                        sx={{ minWidth: "80px" }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : order.status === "confirmed" ? (
                    <Button variant="outlined" size="small" disabled>
                      Confirmed
                    </Button>
                  ) : (
                    <Button variant="outlined" size="small" disabled>
                      Cancelled
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AgentOrders;
