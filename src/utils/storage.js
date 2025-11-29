// Local Storage utility functions for data persistence

const STORAGE_KEYS = {
  USERS: 'homestay_users',
  HOMESTAYS: 'homestay_listings',
  BOOKINGS: 'homestay_bookings',
  ATTRACTIONS: 'tourist_attractions',
  REVIEWS: 'homestay_reviews',
  GUIDES: 'local_guides',
  CURRENT_USER: 'current_user'
};

// Generic storage operations
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Initialize default data if not exists
export const initializeStorage = () => {
  // Initialize users if not exists
  if (!storage.get(STORAGE_KEYS.USERS)) {
    storage.set(STORAGE_KEYS.USERS, [
      {
        id: '1',
        email: 'admin@homestay.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Initialize homestays with sample data
  if (!storage.get(STORAGE_KEYS.HOMESTAYS)) {
    storage.set(STORAGE_KEYS.HOMESTAYS, [
      {
        id: '1',
        hostId: '2',
        title: 'Cozy Mountain Retreat',
        description: 'Beautiful homestay nestled in the mountains with stunning views',
        location: 'Manali, Himachal Pradesh',
        price: 2500,
        capacity: 4,
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Mountain View'],
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
        rating: 4.5,
        reviews: 23,
        available: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        hostId: '2',
        title: 'Beachside Paradise',
        description: 'Relaxing homestay right by the beach',
        location: 'Goa',
        price: 3000,
        capacity: 6,
        amenities: ['WiFi', 'Beach Access', 'Pool', 'BBQ Area'],
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811'],
        rating: 4.8,
        reviews: 45,
        available: true,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Initialize bookings
  if (!storage.get(STORAGE_KEYS.BOOKINGS)) {
    storage.set(STORAGE_KEYS.BOOKINGS, []);
  }

  // Initialize tourist attractions
  if (!storage.get(STORAGE_KEYS.ATTRACTIONS)) {
    storage.set(STORAGE_KEYS.ATTRACTIONS, [
      {
        id: '1',
        name: 'Hadimba Temple',
        location: 'Manali, Himachal Pradesh',
        description: 'Ancient cave temple dedicated to Hadimba Devi',
        category: 'Historical',
        rating: 4.6,
        guideId: '4',
        distance: '2 km',
        images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5']
      },
      {
        id: '2',
        name: 'Basilica of Bom Jesus',
        location: 'Goa',
        description: 'UNESCO World Heritage Site',
        category: 'Historical',
        rating: 4.7,
        guideId: '4',
        distance: '5 km',
        images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2']
      }
    ]);
  }

  // Initialize reviews
  if (!storage.get(STORAGE_KEYS.REVIEWS)) {
    storage.set(STORAGE_KEYS.REVIEWS, []);
  }

  // Initialize guides
  if (!storage.get(STORAGE_KEYS.GUIDES)) {
    storage.set(STORAGE_KEYS.GUIDES, []);
  }
};

// User operations
export const userService = {
  getAll: () => storage.get(STORAGE_KEYS.USERS) || [],

  getById: (id) => {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    return users.find(user => user.id === id);
  },

  getByEmail: (email) => {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    return users.find(user => user.email === email);
  },

  create: (userData) => {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  update: (id, userData) => {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      storage.set(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  delete: (id) => {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    const filtered = users.filter(user => user.id !== id);
    storage.set(STORAGE_KEYS.USERS, filtered);
    return true;
  }
};

// Homestay operations
export const homestayService = {
  getAll: () => storage.get(STORAGE_KEYS.HOMESTAYS) || [],

  getById: (id) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    return homestays.find(h => h.id === id);
  },

  getByHostId: (hostId) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    return homestays.filter(h => h.hostId === hostId);
  },

  create: (homestayData) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    const newHomestay = {
      id: Date.now().toString(),
      ...homestayData,
      createdAt: new Date().toISOString()
    };
    homestays.push(newHomestay);
    storage.set(STORAGE_KEYS.HOMESTAYS, homestays);
    return newHomestay;
  },

  update: (id, homestayData) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    const index = homestays.findIndex(h => h.id === id);
    if (index !== -1) {
      homestays[index] = { ...homestays[index], ...homestayData };
      storage.set(STORAGE_KEYS.HOMESTAYS, homestays);
      return homestays[index];
    }
    return null;
  },

  delete: (id) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    const filtered = homestays.filter(h => h.id !== id);
    storage.set(STORAGE_KEYS.HOMESTAYS, filtered);
    return true;
  },

  search: (query) => {
    const homestays = storage.get(STORAGE_KEYS.HOMESTAYS) || [];
    const searchLower = query.toLowerCase();
    return homestays.filter(h =>
      h.title.toLowerCase().includes(searchLower) ||
      h.location.toLowerCase().includes(searchLower) ||
      h.description.toLowerCase().includes(searchLower)
    );
  }
};

// Booking operations
export const bookingService = {
  getAll: () => storage.get(STORAGE_KEYS.BOOKINGS) || [],

  getById: (id) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    return bookings.find(b => b.id === id);
  },

  getByUserId: (userId) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    return bookings.filter(b => b.userId === userId);
  },

  getByHostId: (hostId) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    const homestays = homestayService.getByHostId(hostId);
    const homestayIds = homestays.map(h => h.id);
    return bookings.filter(b => homestayIds.includes(b.homestayId));
  },

  create: (bookingData) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    storage.set(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  },

  update: (id, bookingData) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...bookingData };
      storage.set(STORAGE_KEYS.BOOKINGS, bookings);
      return bookings[index];
    }
    return null;
  },

  delete: (id) => {
    const bookings = storage.get(STORAGE_KEYS.BOOKINGS) || [];
    const filtered = bookings.filter(b => b.id !== id);
    storage.set(STORAGE_KEYS.BOOKINGS, filtered);
    return true;
  }
};

// Attraction operations
export const attractionService = {
  getAll: () => storage.get(STORAGE_KEYS.ATTRACTIONS) || [],

  getById: (id) => {
    const attractions = storage.get(STORAGE_KEYS.ATTRACTIONS) || [];
    return attractions.find(a => a.id === id);
  },

  getByLocation: (location) => {
    const attractions = storage.get(STORAGE_KEYS.ATTRACTIONS) || [];
    return attractions.filter(a =>
      a.location.toLowerCase().includes(location.toLowerCase())
    );
  },

  create: (attractionData) => {
    const attractions = storage.get(STORAGE_KEYS.ATTRACTIONS) || [];
    const newAttraction = {
      id: Date.now().toString(),
      ...attractionData,
      createdAt: new Date().toISOString()
    };
    attractions.push(newAttraction);
    storage.set(STORAGE_KEYS.ATTRACTIONS, attractions);
    return newAttraction;
  },

  update: (id, attractionData) => {
    const attractions = storage.get(STORAGE_KEYS.ATTRACTIONS) || [];
    const index = attractions.findIndex(a => a.id === id);
    if (index !== -1) {
      attractions[index] = { ...attractions[index], ...attractionData };
      storage.set(STORAGE_KEYS.ATTRACTIONS, attractions);
      return attractions[index];
    }
    return null;
  },

  delete: (id) => {
    const attractions = storage.get(STORAGE_KEYS.ATTRACTIONS) || [];
    const filtered = attractions.filter(a => a.id !== id);
    storage.set(STORAGE_KEYS.ATTRACTIONS, filtered);
    return true;
  }
};

// Review operations
export const reviewService = {
  getAll: () => storage.get(STORAGE_KEYS.REVIEWS) || [],

  getByHomestayId: (homestayId) => {
    const reviews = storage.get(STORAGE_KEYS.REVIEWS) || [];
    return reviews.filter(r => r.homestayId === homestayId);
  },

  create: (reviewData) => {
    const reviews = storage.get(STORAGE_KEYS.REVIEWS) || [];
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    storage.set(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  delete: (id) => {
    const reviews = storage.get(STORAGE_KEYS.REVIEWS) || [];
    const filtered = reviews.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.REVIEWS, filtered);
    return true;
  }
};

// Current user session
export const sessionService = {
  getCurrentUser: () => storage.get(STORAGE_KEYS.CURRENT_USER),

  setCurrentUser: (user) => storage.set(STORAGE_KEYS.CURRENT_USER, user),

  clearCurrentUser: () => storage.remove(STORAGE_KEYS.CURRENT_USER)
};

export { STORAGE_KEYS };
