# School Management System

A production-ready, multi-tenant School Management System (SMS) built as a SaaS platform.

## 🎯 Current Status: Phase 1 Complete ✅

The foundation of the School Management System has been successfully implemented with:

- ✅ Multi-tenant architecture with complete tenant isolation
- ✅ Supabase authentication integration
- ✅ School Code generation system
- ✅ Comprehensive database schema (30+ models)
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control
- ✅ Next.js frontend with shadcn/ui
- ✅ NestJS backend with Prisma ORM
- ✅ JWT authentication and authorization
- ✅ API documentation with Swagger

**Next Steps**: Set up Supabase and continue with Phase 2 (Super Admin & School Portals)

## Architecture

This system serves multiple independent schools from one centralized platform with complete tenant isolation.

### Key Features

- **Multi-Tenant Architecture**: Each school operates independently with complete data isolation
- **School Code Login**: Unique school codes for secure tenant identification
- **Role-Based Access Control**: SUPER_ADMIN (platform) and USER (school-level with profiles)
- **Defense-in-Depth Security**: Frontend + Backend + PostgreSQL RLS
- **Comprehensive Modules**: Academics, Finance, Operations, Reporting, and more

### Technology Stack

**Frontend:**
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React icons
- TanStack Query
- Zustand

**Backend:**
- NestJS
- TypeScript
- REST API
- Swagger/OpenAPI
- class-validator
- class-transformer
- JWT authentication

**Database & Infrastructure:**
- PostgreSQL (Supabase)
- Prisma ORM
- Supabase Auth
- Supabase Storage
- Supabase Realtime

## Project Structure

```
sms/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI components
│   │   └── lib/             # Utilities and Supabase client
│   └── package.json
├── backend/                  # NestJS backend API
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── schools/         # Schools management module
│   │   ├── common/          # Guards, decorators, utilities
│   │   ├── prisma/          # Prisma service
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Seed data
│   │   └── rls_policies.sql # RLS policies
│   └── package.json
├── SUPABASE_SETUP.md         # Supabase configuration guide
├── PHASE1_COMPLETION.md      # Phase 1 completion details
├── .gitignore
├── package.json              # Root workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account (free tier works for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the detailed guide in `SUPABASE_SETUP.md`
   - Create a Supabase project
   - Configure environment variables

4. **Configure environment variables**

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=7d
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. **Create Supabase Auth users**
   - Create Super Admin user in Supabase Auth:
     - Email: `admin@platform.com`
     - Password: `Admin@123456` (or your choice)
   - Create school admin users as needed

7. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Development URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- API Documentation: http://localhost:3001/api/docs
- Prisma Studio: `cd backend && npm run prisma:studio`

## Security

This system implements defense-in-depth security:

- **Tenant Isolation**: Frontend + Backend + PostgreSQL RLS
- **School Code System**: Unique tenant identification
- **Role-Based Access**: SUPER_ADMIN and USER with profiles
- **JWT Authentication**: Secure token-based auth
- **Row Level Security**: Database-level data isolation
- **Comprehensive Guards**: NestJS guards for authorization
- **Audit Logging**: Complete audit trail for sensitive operations

## Database Schema

The system includes 30+ database models covering:

- **Core**: Users, Schools, Memberships, Permissions
- **Academic**: Years, Terms, Departments, Classes, Subjects
- **People**: Students, Teachers, Parents, Staff
- **Academics**: Attendance, Results, Assignments
- **Finance**: Fees, Payments, Expenses
- **Operations**: Notifications, Documents, Calendar
- **System**: Audit Logs, Settings

## Implementation Phases

### ✅ Phase 1: Foundation (Complete)
- Project structure and configuration
- Authentication system
- Database schema and RLS
- School Code generation
- Basic API endpoints
- Security guards and middleware

### 🔄 Phase 2: School Management (Next)
- Super Admin portal
- School portal
- User management
- Academic structure management
- Student/teacher/parent management

### 📋 Phase 3: Academics
- Assessment management
- Results and grading
- Report cards
- Attendance tracking

### 📋 Phase 4: Finance
- Fee structures
- Payment processing
- Financial reports

### 📋 Phase 5: Operations
- Timetable management
- Assignments
- Communication
- Calendar events

### 📋 Phase 6: Reporting
- Analytics dashboards
- Custom reports
- Data export

### 📋 Phase 7: Hardening
- Security testing
- Performance optimization
- Backup and restore

### 📋 Phase 8: SaaS Readiness
- Subscription management
- Billing integration
- Feature flags

## Documentation

- `SUPABASE_SETUP.md` - Detailed Supabase configuration guide
- `PHASE1_COMPLETION.md` - Phase 1 implementation details
- `backend/prisma/schema.prisma` - Database schema documentation
- `backend/prisma/rls_policies.sql` - RLS policies documentation

## Development Commands

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev

# Start only frontend
cd frontend && npm run dev

# Start only backend
cd backend && npm run start:dev

# Database operations
cd backend
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:seed       # Seed database
npm run prisma:studio     # Open Prisma Studio

# Build for production
npm run build

# Run tests
npm test
```

## License

Proprietary - All rights reserved

## Support

For detailed setup instructions and implementation guidance, refer to:
- `SUPABASE_SETUP.md` for Supabase configuration
- `PHASE1_COMPLETION.md` for Phase 1 details
- API documentation at `/api/docs` when backend is running
