import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import {
  People,
  Home,
  BookOnline,
  Place,
  Delete,
  Edit
} from '@mui/icons-material';
import { userService, homestayService, bookingService, attractionService } from '../../utils/storage';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHomestays: 0,
    totalBookings: 0,
    totalAttractions: 0
  });
  const [users, setUsers] = useState([]);
  const [homestays, setHomestays] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = userService.getAll();
    const allHomestays = homestayService.getAll();
    const allBookings = bookingService.getAll();
    const allAttractions = attractionService.getAll();

    setStats({
      totalUsers: allUsers.length,
      totalHomestays: allHomestays.length,
      totalBookings: allBookings.length,
      totalAttractions: allAttractions.length
    });

    setUsers(allUsers);
    setHomestays(allHomestays);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      userService.delete(userId);
      loadData();
    }
  };

  const handleDeleteHomestay = (homestayId) => {
    if (window.confirm('Are you sure you want to delete this homestay?')) {
      homestayService.delete(homestayId);
      loadData();
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', bgcolor: `${color}.50` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Homestays"
            value={stats.totalHomestays}
            icon={<Home />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bookings"
            value={stats.totalBookings}
            icon={<BookOnline />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attractions"
            value={stats.totalAttractions}
            icon={<Place />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={
                            user.role === 'admin' ? 'error' :
                            user.role === 'host' ? 'primary' :
                            user.role === 'guide' ? 'success' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Homestays
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {homestays.map((homestay) => (
                    <TableRow key={homestay.id}>
                      <TableCell>{homestay.title}</TableCell>
                      <TableCell>{homestay.location}</TableCell>
                      <TableCell>₹{homestay.price}/night</TableCell>
                      <TableCell>{homestay.capacity} guests</TableCell>
                      <TableCell>
                        <Chip
                          label={homestay.available ? 'Available' : 'Unavailable'}
                          color={homestay.available ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteHomestay(homestay.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
