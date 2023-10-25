# BotBoard

Web application for managing various applications.

## Technologies
- (React)[https://react.dev/]
- (SCSS)[https://sass-lang.com/]
- (Express)[https://expressjs.com/]
- (Prisma)[https://www.prisma.io/]
- (tRPC)[https://trpc.io/]
- (Lucia)[https://lucia-auth.com/]

## Getting Started
Running the application locally requires a few steps.
```bash
# Install dependencies
pnpm i

# Push the database schema to the database
pnpm db:push

# Start the development server
pnpm dev
```

To build and run the production app:
```bash
# Build the app
pnpm build

# Start the production server
pnpm start
```