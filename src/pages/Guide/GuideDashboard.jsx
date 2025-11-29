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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Rating,
  Chip
} from '@mui/material';
import {
  Add,
  Place,
  Edit,
  Delete,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { attractionService } from '../../utils/storage';
import { validators } from '../../utils/validation';

const GuideDashboard = () => {
  const { user } = useAuth();
  const [attractions, setAttractions] = useState([]);
  const [myAttractions, setMyAttractions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    category: 'Historical',
    rating: 4,
    distance: '',
    images: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Historical',
    'Natural',
    'Cultural',
    'Adventure',
    'Religious',
    'Entertainment'
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const allAttractions = attractionService.getAll();
    const guideAttractions = allAttractions.filter(a => a.guideId === user.id);

    setAttractions(allAttractions);
    setMyAttractions(guideAttractions);
  };

  const handleOpenDialog = (attraction = null) => {
    if (attraction) {
      setEditingAttraction(attraction);
      setFormData({
        name: attraction.name,
        location: attraction.location,
        description: attraction.description,
        category: attraction.category,
        rating: attraction.rating,
        distance: attraction.distance,
        images: attraction.images[0] || ''
      });
    } else {
      setEditingAttraction(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        category: 'Historical',
        rating: 4,
        distance: '',
        images: ''
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttraction(null);
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.distance.trim()) newErrors.distance = 'Distance is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const attractionData = {
      name: formData.name,
      location: formData.location,
      description: formData.description,
      category: formData.category,
      rating: parseFloat(formData.rating),
      distance: formData.distance,
      guideId: user.id,
      images: formData.images ? [formData.images] : []
    };

    if (editingAttraction) {
      attractionService.update(editingAttraction.id, attractionData);
    } else {
      attractionService.create(attractionData);
    }

    loadData();
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this attraction?')) {
      attractionService.delete(id);
      loadData();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Local Guide Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Attraction
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'primary.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    My Recommendations
                  </Typography>
                  <Typography variant="h3" component="div">
                    {myAttractions.length}
                  </Typography>
                </Box>
                <Place sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Total Attractions
                  </Typography>
                  <Typography variant="h3" component="div">
                    {attractions.length}
                  </Typography>
                </Box>
                <LocationOn sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          My Recommendations
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myAttractions.map((attraction) => (
                <TableRow key={attraction.id}>
                  <TableCell>{attraction.name}</TableCell>
                  <TableCell>{attraction.location}</TableCell>
                  <TableCell>
                    <Chip label={attraction.category} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Rating value={attraction.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>{attraction.distance}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(attraction)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(attraction.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {myAttractions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No recommendations yet. Add your first attraction!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Tourist Attractions
        </Typography>
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
                  <Typography variant="body2" color="text.secondary" noWrap>
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
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAttraction ? 'Edit Attraction' : 'Add New Attraction'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Attraction Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="category"
                label="Category"
                select
                fullWidth
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="distance"
                label="Distance"
                type="text"
                fullWidth
                value={formData.distance}
                onChange={handleChange}
                error={!!errors.distance}
                helperText={errors.distance || "e.g., 2 km, 500 m"}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            name="rating"
            label="Rating"
            type="number"
            fullWidth
            value={formData.rating}
            onChange={handleChange}
            inputProps={{ min: 0, max: 5, step: 0.1 }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAttraction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GuideDashboard;
