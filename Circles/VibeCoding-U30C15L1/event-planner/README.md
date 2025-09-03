# Event Planner

A full-stack event planning application built with modern web technologies. This application allows users to create, manage, and RSVP to events with a beautiful and intuitive user interface.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Event Management**: Create, edit, and delete events
- **RSVP System**: Users can RSVP to events with different status options
- **User Profiles**: Manage user information and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live updates for event changes and RSVPs

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Supabase** - Backend as a Service for authentication and database

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Reliable relational database
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **Alembic** - Database migration tool

## 📁 Project Structure

```
event-planner/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── db/
│       └── migrations/     # Database migrations
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── app/           # App Router pages
    │   ├── components/    # React components
    │   ├── lib/          # Utility libraries
    │   └── types/        # TypeScript type definitions
    └── public/           # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database
- Supabase account

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/event_planner
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Run database migrations:**

   ```bash
   alembic upgrade head
   ```

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the frontend directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 📖 API Documentation

Once the backend is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts and profiles
- **events**: Event information and details
- **rsvps**: RSVP responses from users to events

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Formatting

```bash
# Backend
cd backend
black .
isort .

# Frontend
cd frontend
npm run lint
npm run format
```

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to various platforms:

- **Railway**: Easy deployment with PostgreSQL
- **Heroku**: Traditional platform with add-ons
- **DigitalOcean**: App Platform or Droplets
- **AWS**: ECS, Lambda, or EC2

### Frontend Deployment

The frontend can be deployed to:

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **AWS Amplify**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Nayan-b/event-planner-private/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

Built with ❤️ using Next.js, FastAPI, and Supabase
