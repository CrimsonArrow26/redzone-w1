# ClockTower 🏛️

A comprehensive community safety and crime tracking application that provides real-time crime monitoring, emergency alerts, and community awareness tools.

## 🌟 Features

### 🗺️ Real-Time Crime Tracking
- Interactive maps with animated visual zones
- Crime incident calculations within 1km radius
- Risk level assessment (High/Medium/Low) based on incident counts
- Dynamic zone updates with color-coded risk indicators
- Criminal data mapping based on last known locations
- Historical crime pattern analysis and heat mapping

### 🚨 Emergency Alert System
- Instant SOS alerts to trusted contacts
- Emergency contact management
- Real-time notification system
- Quick emergency response coordination

### 📰 Safety News & Updates
- Crime-related news aggregation
- Local safety updates
- Priority-based content categorization
- Location-specific information

### 👥 Community Features
- User authentication and profiles
- Community safety reports
- User-generated content
- Community engagement tools

### 🔍 Advanced Face Recognition System
- Live face recognition and identification
- Multiple face scanning support for crowd monitoring
- Criminal database integration with facial biometrics
- Real-time suspect identification and alerting
- Secure dataset storage for criminal images and personal information
- Privacy-compliant facial recognition processing

### 📱 Modern User Interface
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation
- Beautiful, modern UI components

## 🏗️ Architecture

This project follows a **full-stack architecture** with:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Flask (Python) API
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Supabase integration
- **Styling**: Tailwind CSS + Radix UI components
- **Maps**: Leaflet.js integration
- **Animations**: Framer Motion + GSAP
- **AI/ML**: Face recognition and computer vision
- **Security**: Encrypted data storage and biometric processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PostgreSQL database
- Supabase account

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/clocktower
   NEWS_API_KEY=your_news_api_key
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

## 📁 Project Structure

```
ClockTower/
├── src/                    # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── sign/             # Authentication components
│   ├── styles/           # CSS and styling files
│   └── App.tsx          # Main application component
├── app.py                # Flask backend API
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── package.json         # Node.js dependencies
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🔧 Key Technologies

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **GSAP** - Professional animation library
- **Leaflet.js** - Interactive maps

### Backend
- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **PostgreSQL** - Robust, open-source database
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - WSGI HTTP Server

### Authentication & Database
- **Supabase** - Open source Firebase alternative
- **JWT** - JSON Web Token authentication
- **Flask-JWT-Extended** - JWT support for Flask

## 🌐 API Endpoints

### News API
- `GET /api/news` - Fetch crime-related news articles

### Red Zones API
- `GET /api/red_zones` - Retrieve high-risk areas

### Face Recognition API
- `POST /api/face/scan` - Process live face recognition
- `GET /api/face/criminal/{id}` - Retrieve criminal facial data
- `POST /api/face/identify` - Identify suspects from images

### User Management
- User registration and login
- Profile management
- Emergency contact management

## 🎨 UI Components

The application includes a comprehensive set of UI components:
- Navigation bars and modals
- Forms and input components
- Cards and layout components
- Interactive maps and markers
- Animation components
- Responsive design elements

## 🔒 Security Features

- Secure authentication system
- Password hashing
- JWT token management
- CORS configuration
- Environment variable protection
- **Biometric Data Protection**: Encrypted storage of facial recognition data
- **Criminal Database Security**: Secure dataset management for sensitive information
- **Privacy Compliance**: GDPR and privacy law adherence for biometric data
- **Access Control**: Role-based permissions for criminal data access

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Using Heroku (Procfile included)
git push heroku main

# Using other platforms
gunicorn app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Community chat features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered risk assessment
- [ ] Integration with law enforcement APIs
- [ ] Real-time video monitoring
- [ ] Community safety workshops
- [ ] Advanced facial recognition algorithms
- [ ] Multi-modal biometric identification
- [ ] Predictive crime analytics using AI
- [ ] Integration with national criminal databases

---

**Built with ❤️ for community safety and awareness**
