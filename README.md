# Homestay Platform

A comprehensive web platform connecting travelers with homestay options and providing information about nearby tourist attractions. Built with React, Material-UI, and local storage for data persistence.

## Features

### Authentication System
- User registration and login with form validation
- Role-based access control (Admin, Host, Tourist, Guide)
- Secure session management with localStorage
- Password visibility toggle

### User Roles & Dashboards

#### 1. Admin Dashboard
- Manage platform users
- Oversee all homestay listings
- Monitor bookings and platform statistics
- Delete inappropriate content
- View comprehensive analytics

#### 2. Homestay Host Dashboard
- List and manage homestay properties
- Full CRUD operations for listings
- Accept/reject booking requests
- Track revenue and booking statistics
- Update property availability and pricing

#### 3. Tourist Dashboard
- Browse and search homestay listings
- Book stays with date selection
- View booking history
- Explore nearby tourist attractions
- Filter by location, price, and amenities

#### 4. Local Guide Dashboard
- Add and manage tourist attractions
- Share local insights and recommendations
- Categorize attractions (Historical, Natural, Cultural, etc.)
- Provide ratings and distance information

## Technical Implementation

### Technologies Used
- **Frontend**: React 18+ with Vite
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage
- **Form Validation**: Custom validators
- **Styling**: Material-UI theming + CSS

### Key Features Implemented

✅ **UI/UX Design & Visual Aesthetics**
- Modern, responsive design with Material-UI
- Custom color palette and theming
- Card-based layouts for content
- Intuitive navigation and user flows

✅ **Routing & Navigation**
- Protected routes with role-based access
- Automatic redirects based on authentication state
- Clean URL structure
- Breadcrumb navigation in dashboards

✅ **Form Validation & Error Handling**
- Real-time validation for all forms
- Custom validation rules (email, password, phone, dates)
- User-friendly error messages
- Field-level error highlighting

✅ **Authentication (Registration & Login)**
- Secure user registration with role selection
- Email and password authentication
- Session persistence across page refreshes
- Automatic role-based routing after login

✅ **API Integration (LocalStorage)**
- Service layer for data operations
- CRUD operations for all entities
- Data relationships (bookings to homestays, etc.)
- Sample data initialization

✅ **CRUD Operations**
- Homestay listings (Create, Read, Update, Delete)
- Bookings management
- Tourist attractions
- User management (Admin only)

✅ **Data Persistence**
- LocalStorage for all data
- Structured storage with service layers
- Data initialization with sample content
- Session management

✅ **Git Usage**
- Version control ready
- Clean project structure
- Modular component organization

✅ **Clean Code & React Best Practices**
- Functional components with hooks
- Context API for global state
- Reusable components
- Proper prop validation
- Code organization by feature

## Project Structure

```
homestay-platform/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login & Register components
│   │   ├── Common/         # ProtectedRoute
│   │   ├── Layout/         # Navbar
│   │   ├── Admin/
│   │   ├── Host/
│   │   ├── Tourist/
│   │   └── Guide/
│   ├── pages/
│   │   ├── Admin/          # AdminDashboard
│   │   ├── Host/           # HostDashboard
│   │   ├── Tourist/        # TouristDashboard
│   │   ├── Guide/          # GuideDashboard
│   │   └── Home.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication state
│   ├── utils/
│   │   ├── storage.js      # LocalStorage services
│   │   └── validation.js   # Form validators
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
cd homestay-platform
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage Guide

### Demo Credentials

**Admin Account:**
- Email: admin@homestay.com
- Password: admin123

### Creating New Accounts

1. Click "Register" from the home page
2. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number (10 digits)
   - Select Role (Tourist, Homestay Host, or Local Guide)
   - Password (minimum 6 characters)
3. Confirm your password
4. Click "Create Account"

### As a Tourist
1. Browse available homestays
2. Search by location or keywords
3. Click "Book Now" on a listing
4. Select check-in and check-out dates
5. Enter number of guests
6. Confirm booking
7. View bookings in "My Bookings" tab
8. Explore tourist attractions

### As a Host
1. Click "Add New Listing"
2. Fill in property details:
   - Title and description
   - Location
   - Price per night
   - Guest capacity
   - Amenities (comma-separated)
   - Image URL (optional)
3. Manage incoming bookings
4. Accept or reject booking requests
5. Update listings as needed

### As a Local Guide
1. Click "Add New Attraction"
2. Enter attraction details:
   - Name and location
   - Description
   - Category
   - Rating
   - Distance from main area
   - Image URL (optional)
3. Share local knowledge
4. Update recommendations

### As an Admin
1. Monitor all users and statistics
2. View all homestays and bookings
3. Delete inappropriate content
4. Manage platform integrity

## Data Storage

All data is stored in browser localStorage under the following keys:
- `homestay_users` - User accounts
- `homestay_listings` - Homestay properties
- `homestay_bookings` - Booking records
- `tourist_attractions` - Tourist attractions
- `homestay_reviews` - Reviews (future feature)
- `current_user` - Active session

**Note:** Clearing browser data will reset all stored information.

## Key Features Breakdown

### 1. Search & Filter
- Real-time search across homestays
- Filter by location, title, or description
- Available properties only

### 2. Booking System
- Date range validation (no past dates)
- Guest capacity checking
- Automatic price calculation
- Booking status management (pending, confirmed, cancelled)

### 3. Dashboard Analytics
- Real-time statistics
- Revenue tracking for hosts
- Booking summaries
- User management metrics

### 4. Form Validation
- Email format validation
- Password strength requirements
- Phone number format (10 digits)
- Date range validation
- Required field checking
- Custom error messages

### 5. Responsive Design
- Mobile-friendly layouts
- Grid-based responsive system
- Touch-friendly buttons
- Optimized for all screen sizes

## Future Enhancements

Potential features for future versions:
- Real backend API integration
- Payment gateway integration
- Real-time chat between hosts and guests
- Review and rating system
- Advanced search filters (price range, amenities)
- Image upload functionality
- Email notifications
- Calendar availability view
- Multi-language support
- Map integration for locations
- Admin analytics dashboard

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.

## Contributing

This is a demonstration project. For improvements or suggestions, please create an issue or submit a pull request.

## Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React and Material-UI**
# literate-umbrella
