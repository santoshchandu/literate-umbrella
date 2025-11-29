import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  Home as HomeIcon,
  PersonAdd,
  Login,
  Explore,
  TravelExplore,
  LocalOffer
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Authentic Homestays',
      description: 'Experience local culture and hospitality in comfortable homestays'
    },
    {
      icon: <Explore sx={{ fontSize: 60, color: 'success.main' }} />,
      title: 'Discover Attractions',
      description: 'Explore nearby tourist spots with local guide recommendations'
    },
    {
      icon: <LocalOffer sx={{ fontSize: 60, color: 'warning.main' }} />,
      title: 'Best Prices',
      description: 'Book directly with hosts and get the best deals'
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user?.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'host':
          navigate('/host/dashboard');
          break;
        case 'tourist':
          navigate('/tourist/dashboard');
          break;
        case 'guide':
          navigate('/guide/dashboard');
          break;
        default:
          navigate('/register');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to Nestara
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Connect with local hosts, discover authentic experiences, and explore amazing destinations
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PersonAdd />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Login />}
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'grey.100', bgcolor: 'rgba(255,255,255,0.1)' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<TravelExplore />}
                onClick={handleGetStarted}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 4,
                  py: 1.5
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Why Choose Us?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need for an unforgettable travel experience
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* User Roles Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            Join Our Community
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Whether you're a host, tourist, or local guide, we have something for you
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Homestay Host
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    List your property and earn by hosting travelers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <TravelExplore sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Tourist
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find and book unique homestay experiences
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Explore sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Local Guide
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Share your local knowledge and attractions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <PersonAdd sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Admin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage the platform and user interactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{ px: 6, py: 2 }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
