# Supabase Setup Guide

This guide will help you set up Supabase for the School Management System.

## Prerequisites

- A Supabase account (free tier is sufficient for development)
- Basic understanding of PostgreSQL

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: school-management-system
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose a region close to your users
   - **Pricing Plan**: Free tier is fine for development

5. Click "Create new project"
6. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready, go to:

1. **Project Settings** → **API**
2. Copy the following credentials:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (keep this secret!)

## Step 3: Configure Environment Variables

### Frontend (frontend/.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (backend/.env)

```env
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Important**: Replace the placeholders with your actual Supabase credentials.

## Step 4: Database Connection String

The DATABASE_URL format for Supabase is:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

You can find this in:
- Project Settings → **Database** → **Connection string** → **URI**
- Copy the URI and replace `[YOUR-PASSWORD]` with your database password

## Step 5: Configure Supabase Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email settings if needed for development

## Step 6: Create Storage Buckets

1. Go to **Storage** → **Create a new bucket**
2. Create these buckets:
   - `documents` (for school documents)
   - `profiles` (for user profile photos)
   - `certificates` (for generated certificates)
   - `report-cards` (for report card PDFs)

3. For each bucket:
   - Make them **Private** (not public)
   - Configure appropriate RLS policies (will be added via Prisma schema)

## Step 7: Run Database Migrations

Once Supabase is configured:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## Security Notes

- **NEVER** commit `.env` files to version control
- **NEVER** expose `service_role` key to the frontend
- Use `anon` key only in frontend
- Use `service_role` key only in backend server-side code
- Enable Row Level Security (RLS) on all tables
- Use storage buckets with private access for sensitive files

## Next Steps

After setting up Supabase:

1. Run Prisma migrations to create the database schema
2. Seed initial data (Super Admin, sample schools)
3. Test the authentication flow
4. Implement the remaining Phase 1 features

## Troubleshooting

### Connection Issues

If you can't connect to the database:
- Check your DATABASE_URL format
- Verify your database password
- Ensure your IP is not blocked (Supabase allows all IPs by default)
- Check Supabase status page for outages

### Authentication Issues

If auth is not working:
- Verify email provider is enabled
- Check email confirmation settings
- Ensure JWT secret is set correctly
- Verify CORS settings in Supabase

### Storage Issues

If file uploads fail:
- Check bucket permissions
- Verify RLS policies
- Ensure bucket exists
- Check file size limits
