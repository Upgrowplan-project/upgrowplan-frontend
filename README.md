# Upgrowplan Frontend

Upgrowplan is a comprehensive platform for business planning, financial modeling, and market analytics. Built with Next.js and TypeScript.

## Features

- **Solutions Pages**: OpenAbroad (business relocation), PlanMaster AI (business plan generation)
- **Click Analytics**: Integrated user interaction tracking
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Real-time Updates**: Connected to backend APIs for dynamic content

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap, CSS Modules
- **Icons**: React Icons
- **Backend**: FastAPI (solutions-backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see [solutions-backend](https://github.com/Upgrowplan-project/solutions-backend))

### Environment Variables

Create `.env.local` for development:

```bash
# Solutions Backend API (local development)
NEXT_PUBLIC_SOLUTIONS_API_URL=http://localhost:8002

# Other API configurations
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082
NEXT_PUBLIC_WS_BASE_URL=http://localhost:8082
```

Create `.env.production` for production:

```bash
# Solutions Backend API (production - Heroku)
NEXT_PUBLIC_SOLUTIONS_API_URL=https://solutions-backend-f900a16e5ff6.herokuapp.com
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── solutions/           # Solutions pages
│   ├── page.tsx        # Solutions overview
│   ├── openAbroad/     # Business relocation solution
│   └── plan/           # PlanMaster AI solution
components/              # Reusable UI components
├── Header.tsx
├── Footer.tsx
├── Grade.tsx
└── Tips.tsx
hooks/                   # Custom React hooks
└── useClickAnalytics.ts # Click tracking integration
public/                  # Static assets
```

## Click Analytics

The application includes integrated click analytics to track user interactions:

- **Hook**: `useClickAnalytics()` in `hooks/useClickAnalytics.ts`
- **Usage**: Automatically tracks clicks on solution cards
- **Backend**: Data stored in PostgreSQL (AWS RDS)
- **Privacy**: No personal data collected, only interaction patterns

Example usage:
```typescript
const { trackClick } = useClickAnalytics();

<button onClick={() => trackClick('button-id', 'button')}>
  Click Me
</button>
```

## Backend Integration

This frontend connects to the following backend services:

- **Solutions Backend**: https://github.com/Upgrowplan-project/solutions-backend
  - Click Analytics API (port 8002)
  - OpenAbroad API (port 8001)

## Deployment

### Production URL
https://www.upgrowplan.com

### Deployment Steps

1. Update `.env.production` with production API URLs
2. Build the application: `npm run build`
3. Deploy to your hosting platform (Vercel, Netlify, etc.)
4. Ensure backend services are deployed and accessible

## Development

```bash
# Start backend services first
cd ../solutions-backend
python start_services.py

# Then start frontend
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Solutions page: http://localhost:3000/solutions
- OpenAbroad: http://localhost:3000/solutions/openAbroad

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/Upgrowplan-project/upgrowplan-frontend/issues
- Website: https://www.upgrowplan.com
