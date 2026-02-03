# Aura Designs - Custom Decors & Gifts

A beautiful, Candly-inspired website for showcasing custom decors, candles, and gifts. Features an elegant dark theme with sophisticated typography, color-changing glow animations, and a complete admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)

## ✨ Features

### Public Website
- 🎨 **Elegant Dark Theme** - Candly-inspired design with Cormorant Garamond serif and Inter sans-serif fonts
- 🌈 **Color-Changing Glow Effects** - Animated glowing borders on hero images
- ⭐ **Customer Testimonials** - Submit and display testimonials with star ratings
- 📱 **Fully Responsive** - Beautiful on desktop, tablet, and mobile
- 🔗 **Social Media Integration** - Configurable Instagram, Facebook, and Pinterest links

### Admin Dashboard
- 🔐 **Multi-Admin Support** - Multiple Gmail accounts can access the dashboard
- 📦 **Product Management** - Add, edit, and delete products with image uploads
- 🖼️ **Site Configuration** - Manage hero images, about page image, and social media handles
- 💬 **Testimonial Moderation** - Approve, filter, search, and paginate customer testimonials
- ☁️ **Cloud Storage** - Google Cloud Storage for production image uploads

### Technical
- 🚀 **Next.js 14 App Router** - Server-side rendering and API routes
- 🔒 **NextAuth.js** - Secure Google OAuth authentication
- 🗄️ **Prisma ORM** - SQLite for development, PostgreSQL for production
- 🐳 **Docker Ready** - Containerized for Google Cloud Run deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_32_char_secret
NEXTAUTH_URL=http://localhost:3000

# Admin emails (comma-separated for multiple admins)
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com

# Database (SQLite for local development)
DATABASE_URL="file:./dev.db"

# Optional: Google Cloud Storage bucket for production
# GCS_BUCKET_NAME=your-bucket-name
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your website!

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** to your `.env` file

## 📁 Project Structure

```
aura-designs/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── products/       # Product CRUD
│   │   ├── settings/       # Site settings
│   │   ├── testimonials/   # Testimonial management
│   │   └── upload/         # Image upload handler
│   ├── about/              # About page
│   ├── shop/               # Shop page
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── Header.tsx          # Navigation header
│   ├── HeroSection.tsx     # Homepage hero with glow effects
│   ├── Testimonials.tsx    # Testimonial carousel
│   ├── TestimonialModal.tsx # Testimonial submission form
│   └── TestimonialsManager.tsx # Admin testimonial management
├── lib/                    # Utilities
│   ├── auth.ts             # NextAuth configuration
│   └── prisma.ts           # Prisma client singleton
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── Dockerfile              # Docker configuration
└── deploy-gcloud.ps1       # Google Cloud deployment script
```

## 🗄️ Database Schema

### Models
- **Product** - Products with name, description, price, category, and images
- **Image** - Product images with URLs and order
- **SiteSettings** - Hero images, about image, social media handles
- **Testimonial** - Customer testimonials with name, message, rating, and approval status

## 👩‍💼 Admin Dashboard

Access the admin dashboard at `/admin` (requires Google sign-in with an authorized email).

### Tabs
1. **Products** - Manage your product catalog
2. **Site Configuration** - Update hero images, about page image, and social media links
3. **Testimonials** - Review, approve, and manage customer testimonials
   - Filter by status (Pending/Approved/All)
   - Search by name or message
   - Pagination with configurable page size

## ☁️ Production Deployment (Google Cloud)

### Prerequisites
- Google Cloud account with billing enabled
- `gcloud` CLI installed and authenticated

### Environment Variables

Set these before running the deployment script:

```powershell
$env:GCP_PROJECT_ID = "your-gcp-project-id"
$env:DB_PASSWORD = "your_secure_database_password"
$env:NEXTAUTH_SECRET = "your_32_char_secret"
$env:GOOGLE_CLIENT_ID = "your_google_client_id"
$env:GOOGLE_CLIENT_SECRET = "your_google_client_secret"
$env:ADMIN_EMAILS = "admin1@gmail.com,admin2@gmail.com"
# Optional: $env:GCP_REGION = "us-central1"
```

### Deploy

```powershell
.\deploy-gcloud.ps1
```

This script will:
1. Enable required Google Cloud APIs
2. Create a Cloud SQL PostgreSQL instance (if not exists)
3. Build and deploy to Cloud Run
4. Configure environment variables and Cloud SQL connection

### Google Cloud Storage (for images)

1. Create a GCS bucket in Google Cloud Console
2. Set the `GCS_BUCKET_NAME` environment variable
3. Ensure the Cloud Run service account has Storage Object Admin permissions

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color palette:

```js
colors: {
  dark: { 100: '#1a1a1a', 200: '#2d2d2d', 300: '#404040' },
  surface: { 50: '#f5f5f5', 100: '#e8e8e8' },
  accent: { primary: '#d4a574', secondary: '#c9956c' },
  // ...
}
```

### Fonts
Fonts are configured in `app/layout.tsx`:
- **Cormorant Garamond** - Elegant serif for headings
- **Inter** - Clean sans-serif for body text

### Social Media
Update social media handles in the Admin Dashboard under **Site Configuration**.

## 🔒 Security Notes

- **Never commit `.env` files** - They contain secrets
- **`env-vars.yaml` is gitignored** - Use for Cloud Run deployments
- **Rotate secrets regularly** - Especially `NEXTAUTH_SECRET` and database passwords
- **Review `.gitignore`** - Ensure sensitive files are excluded

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Design inspired by [Candly](https://candly.com)
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Prisma](https://prisma.io)
