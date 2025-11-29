import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  LocationOn,
  People,
  AttachMoney,
  BookOnline,
  Place
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { homestayService, bookingService, attractionService } from '../../utils/storage';
import { validators } from '../../utils/validation';

const TouristDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [homestays, setHomestays] = useState([]);
  const [filteredHomestays, setFilteredHomestays] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterHomestays();
  }, [searchQuery, homestays]);

  const loadData = () => {
    const allHomestays = homestayService.getAll().filter(h => h.available);
    const allAttractions = attractionService.getAll();
    const userBookings = bookingService.getByUserId(user.id);

    setHomestays(allHomestays);
    setFilteredHomestays(allHomestays);
    setAttractions(allAttractions);
    setMyBookings(userBookings);
  };

  const filterHomestays = () => {
    if (!searchQuery.trim()) {
      setFilteredHomestays(homestays);
      return;
    }

    const filtered = homestayService.search(searchQuery);
    setFilteredHomestays(filtered.filter(h => h.available));
  };

  const handleOpenBookingDialog = (homestay) => {
    setSelectedHomestay(homestay);
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: 1
    });
    setErrors({});
    setOpenBookingDialog(true);
  };

  const handleCloseBookingDialog = () => {
    setOpenBookingDialog(false);
    setSelectedHomestay(null);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateBooking = () => {
    const newErrors = {};

    const dateError = validators.dateRange(bookingData.checkIn, bookingData.checkOut);
    if (dateError) {
      newErrors.checkIn = dateError;
    }

    if (parseInt(bookingData.guests) > selectedHomestay.capacity) {
      newErrors.guests = `Maximum ${selectedHomestay.capacity} guests allowed`;
    }

    const guestsError = validators.positiveNumber(parseInt(bookingData.guests), 'Guests');
    if (guestsError) newErrors.guests = guestsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * selectedHomestay.price;
  };

  const handleBookingSubmit = () => {
    if (!validateBooking()) return;

    const booking = {
      userId: user.id,
      homestayId: selectedHomestay.id,
      guestName: user.name,
      guestEmail: user.email,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: parseInt(bookingData.guests),
      totalPrice: calculateTotal(),
      status: 'pending'
    };

    bookingService.create(booking);
    loadData();
    handleCloseBookingDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tourist Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Browse Homestays" />
        <Tab label="My Bookings" />
        <Tab label="Tourist Attractions" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by location, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Paper>

          <Grid container spacing={3}>
            {filteredHomestays.map((homestay) => (
              <Grid item xs={12} sm={6} md={4} key={homestay.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={homestay.images[0] || 'https://via.placeholder.com/400x200'}
                    alt={homestay.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {homestay.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {homestay.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={homestay.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({homestay.reviews} reviews)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {homestay.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {homestay.amenities.slice(0, 3).map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" />
                      ))}
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ₹{homestay.price}/night
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <People fontSize="small" sx={{ verticalAlign: 'middle' }} /> {homestay.capacity} guests
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BookOnline />}
                      onClick={() => handleOpenBookingDialog(homestay)}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            My Bookings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Homestay</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell>Check-out</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myBookings.map((booking) => {
                  const homestay = homestayService.getById(booking.homestayId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>{homestay?.title}</TableCell>
                      <TableCell>{homestay?.location}</TableCell>
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
                    </TableRow>
                  );
                })}
                {myBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No bookings yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {attractions.map((attraction) => (
            <Grid item xs={12} sm={6} md={4} key={attraction.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={attraction.images[0] || 'https://via.placeholder.com/400x200'}
                  alt={attraction.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {attraction.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {attraction.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {attraction.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={attraction.category} size="small" color="primary" />
                    <Rating value={attraction.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Distance: {attraction.distance}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Book {selectedHomestay?.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="checkIn"
            label="Check-in Date"
            type="date"
            fullWidth
            value={bookingData.checkIn}
            onChange={handleBookingChange}
            error={!!errors.checkIn}
            helperText={errors.checkIn}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="checkOut"
            label="Check-out Date"
            type="date"
            fullWidth
            value={bookingData.checkOut}
            onChange={handleBookingChange}
            error={!!errors.checkOut}
            helperText={errors.checkOut}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="guests"
            label="Number of Guests"
            type="number"
            fullWidth
            value={bookingData.guests}
            onChange={handleBookingChange}
            error={!!errors.guests}
            helperText={errors.guests || `Maximum: ${selectedHomestay?.capacity} guests`}
          />
          {bookingData.checkIn && bookingData.checkOut && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                Nights: {calculateNights()}
              </Typography>
              <Typography variant="body2">
                Price per night: ₹{selectedHomestay?.price}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total: ₹{calculateTotal()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDialog}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TouristDashboard;
