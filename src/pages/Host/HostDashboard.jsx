import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Add,
  Home,
  BookOnline,
  AttachMoney,
  Edit,
  Delete,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { homestayService, bookingService } from '../../utils/storage';
import { validators } from '../../utils/validation';

const HostDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    capacity: '',
    amenities: '',
    images: '',
    available: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const myHomestays = homestayService.getByHostId(user.id);
    const myBookings = bookingService.getByHostId(user.id);

    const revenue = myBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setStats({
      totalListings: myHomestays.length,
      totalBookings: myBookings.length,
      totalRevenue: revenue
    });

    setHomestays(myHomestays);
    setBookings(myBookings);
  };

  const handleOpenDialog = (homestay = null) => {
    if (homestay) {
      setEditingHomestay(homestay);
      setFormData({
        title: homestay.title,
        description: homestay.description,
        location: homestay.location,
        price: homestay.price,
        capacity: homestay.capacity,
        amenities: homestay.amenities.join(', '),
        images: homestay.images[0] || '',
        available: homestay.available
      });
    } else {
      setEditingHomestay(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        price: '',
        capacity: '',
        amenities: '',
        images: '',
        available: true
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHomestay(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    const priceError = validators.positiveNumber(parseFloat(formData.price), 'Price');
    if (priceError) newErrors.price = priceError;

    const capacityError = validators.positiveNumber(parseInt(formData.capacity), 'Capacity');
    if (capacityError) newErrors.capacity = capacityError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const homestayData = {
      hostId: user.id,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      images: formData.images ? [formData.images] : [],
      available: formData.available,
      rating: editingHomestay?.rating || 0,
      reviews: editingHomestay?.reviews || 0
    };

    if (editingHomestay) {
      homestayService.update(editingHomestay.id, homestayData);
    } else {
      homestayService.create(homestayData);
    }

    loadData();
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this homestay?')) {
      homestayService.delete(id);
      loadData();
    }
  };

  const handleBookingAction = (bookingId, status) => {
    bookingService.update(bookingId, { status });
    loadData();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Host Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Listing
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Listings"
            value={stats.totalListings}
            icon={<Home />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<BookOnline />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={<AttachMoney />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Listings
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
                        <IconButton size="small" onClick={() => handleOpenDialog(homestay)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(homestay.id)}>
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
              Recent Bookings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Guest</TableCell>
                    <TableCell>Homestay</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => {
                    const homestay = homestayService.getById(booking.homestayId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.guestName}</TableCell>
                        <TableCell>{homestay?.title}</TableCell>
                        <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>₹{booking.totalPrice}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === 'confirmed' ? 'success' :
                              booking.status === 'pending' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleBookingAction(booking.id, 'confirmed')}
                              >
                                <CheckCircle />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleBookingAction(booking.id, 'cancelled')}
                              >
                                <Cancel />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingHomestay ? 'Edit Homestay' : 'Add New Homestay'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="price"
                label="Price per night"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="capacity"
                label="Capacity (guests)"
                type="number"
                fullWidth
                value={formData.capacity}
                onChange={handleChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            name="amenities"
            label="Amenities (comma separated)"
            type="text"
            fullWidth
            value={formData.amenities}
            onChange={handleChange}
            helperText="e.g., WiFi, Kitchen, Parking, Mountain View"
          />
          <TextField
            margin="dense"
            name="images"
            label="Image URL"
            type="text"
            fullWidth
            value={formData.images}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="available"
            label="Availability"
            select
            fullWidth
            value={formData.available}
            onChange={handleChange}
          >
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Unavailable</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingHomestay ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HostDashboard;
