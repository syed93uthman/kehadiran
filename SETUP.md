# Worker Attendance System - Setup Guide

## Project Overview

This is a complete admin dashboard application for managing worker attendance and generating payslips. Built with Next.js 15, TypeScript, MySQL, Prisma ORM, and ShadCN UI components.

### Key Features

- **Worker Management**: Add, edit, and delete workers with name and hourly rate
- **Attendance Tracking**: Record attendance as Full Day, Half Day, or Day Off
- **Payslip Generation**: Automatically calculate and generate payslips based on date ranges
- **Modern UI**: Beautiful, responsive interface with ShadCN components
- **Type-Safe**: Full TypeScript support throughout

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18.0 or higher (download from https://nodejs.org)
- **MySQL**: Version 8.0 or higher (download from https://mysql.com)
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Text Editor**: VS Code recommended (https://code.visualstudio.com)

## Step 1: Database Setup

### 1a. Create MySQL Database

Open a terminal and connect to MySQL:

```bash
mysql -u root -p
```

Create the database:

```sql
CREATE DATABASE kehadiran;
EXIT;
```

### 1b. Update Database URL

Edit the `.env.local` file in the project root and update the database connection string:

```env
DATABASE_URL="mysql://root:password@localhost:3306/kehadiran"
```

Replace `root` and `password` with your MySQL username and password.

## Step 2: Install Dependencies

From the project root directory, install all required packages:

```bash
npm install
```

This will install:
- Next.js 15
- React 19
- Prisma 5 (ORM)
- MySQL2 driver
- ShadCN UI components
- Tailwind CSS
- TypeScript
- ESLint

## Step 3: Initialize Database Schema

Generate the Prisma client and create tables:

```bash
npx prisma generate
```

Then run migrations to create the database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `workers` table
- Create the `attendances` table
- Create the `payslips` table
- Generate the Prisma client

### Schema Structure

**Workers Table**
- `id`: Auto-incrementing integer
- `fullName`: Worker's full name (string)
- `hourlyRate`: Hourly wage (decimal)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Attendances Table**
- `id`: Auto-incrementing integer
- `workerId`: Foreign key to workers
- `date`: Date of attendance
- `status`: "FULL_DAY" | "HALF_DAY" | "DAY_OFF"
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Payslips Table**
- `id`: Auto-incrementing integer
- `workerId`: Foreign key to workers
- `startDate`: Payslip period start
- `endDate`: Payslip period end
- `totalHours`: Calculated total hours
- `totalAmount`: Calculated total payment
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Step 4: Start Development Server

Run the development server:

```bash
npm run dev
```

You should see output like:

```
> kehadiran@0.1.0 dev
> next dev

  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
```

Open your browser and navigate to: **http://localhost:3000**

## Step 5: Using the Application

### Workers Tab

**Adding a Worker:**
1. Click "Add Worker" button
2. Enter worker's full name
3. Enter hourly rate (e.g., 15.50)
4. Click "Add"

**Editing a Worker:**
1. Click the edit icon on any worker card
2. Modify the details
3. Click "Update"

**Deleting a Worker:**
1. Click the delete icon on any worker card
2. Confirm the deletion

### Attendance Tab

**Recording Attendance:**
1. Select a worker from the dropdown
2. Select a date
3. Select status (Full Day/Half Day/Day Off)
4. Click "Record"

**Viewing Attendance:**
- Recent attendance records are displayed below
- Shows worker name, date, and status
- Scroll to see more records

### Payslip Tab

**Generating a Payslip:**
1. Select a worker from the dropdown
2. Select start date for payslip period
3. Select end date for payslip period
4. Click "Generate"

**Viewing Payslip Details:**
- Hourly rate
- Total hours worked (Full Day = 8 hours, Half Day = 4 hours, Day Off = 0 hours)
- Total amount to be paid
- Breakdown of work days vs days off

**Payslip Actions:**
- **Preview**: View detailed payslip in a dialog
- **Download**: Export payslip as text file
- **Save to Database**: Store the payslip record permanently

## Development Commands

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
npm run lint -- --fix
```

### View Database (Prisma Studio)

```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

### Reset Database (Caution: Deletes All Data)

```bash
npx prisma migrate reset
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Project Structure

```
kehadiran/
├── src/
│   ├── app/
│   │   ├── api/                    # API Route Handlers
│   │   │   ├── workers/
│   │   │   │   ├── route.ts        # GET all, POST new
│   │   │   │   └── [id]/route.ts   # PUT update, DELETE
│   │   │   ├── attendance/
│   │   │   │   └── route.ts        # GET records, POST new
│   │   │   └── payslip/
│   │   │       └── route.ts        # GET preview, POST save
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Main dashboard page
│   │   ├── globals.css             # Global Tailwind styles
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/                     # ShadCN UI Components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── select.tsx
│   │   ├── WorkersTab.tsx          # Workers management component
│   │   ├── AttendanceTab.tsx       # Attendance tracking component
│   │   └── PayslipTab.tsx          # Payslip generation component
│   └── lib/
│       ├── db.ts                   # Prisma client singleton
│       └── utils.ts                # Utility functions (cn, classnames)
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migration files
├── public/                         # Static assets
├── .env.local                      # Environment variables (local)
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── next.config.js                  # Next.js configuration
├── README.md                       # Project overview
└── SETUP.md                        # This file
```

## Common Issues & Solutions

### Issue: Database Connection Error

**Symptoms**: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Solutions**:
1. Verify MySQL is running
2. Check DATABASE_URL in .env.local
3. Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Test connection: `mysql -u root -p -h localhost kehadiran -e "SELECT 1;"`

### Issue: Prisma Client Not Found

**Symptoms**: "Cannot find module '@prisma/client'"

**Solutions**:
```bash
npx prisma generate
npm install
```

### Issue: Port 3000 Already in Use

**Symptoms**: "Error: listen EADDRINUSE :::3000"

**Solutions**:
```bash
# Run on different port
npm run dev -- -p 3001

# Or kill process using port 3000
lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9
```

### Issue: Build Fails with TypeScript Errors

**Solution**:
```bash
# Clear build cache
rm -rf .next
npm run build
```

### Issue: Changes Not Reflecting

**Solution**:
- Stop dev server (Ctrl+C)
- Clear cache: `rm -rf .next node_modules/.cache`
- Restart: `npm run dev`

## API Endpoints

All API endpoints return JSON responses.

### Workers API

**Get All Workers**
```
GET /api/workers
Response: Worker[]
```

**Create Worker**
```
POST /api/workers
Body: { fullName: string, hourlyRate: number }
Response: Worker
```

**Update Worker**
```
PUT /api/workers/[id]
Body: { fullName: string, hourlyRate: number }
Response: Worker
```

**Delete Worker**
```
DELETE /api/workers/[id]
Response: { success: boolean }
```

### Attendance API

**Get Attendance Records**
```
GET /api/attendance?workerId=[id]&startDate=[date]&endDate=[date]
Response: Attendance[] with worker details
```

**Record Attendance**
```
POST /api/attendance
Body: { workerId: number, date: string, status: string }
Response: Attendance
```

### Payslip API

**Generate Payslip (Preview)**
```
GET /api/payslip?workerId=[id]&startDate=[date]&endDate=[date]
Response: PayslipData
```

**Save Payslip**
```
POST /api/payslip
Body: { workerId: number, startDate: string, endDate: string }
Response: Payslip
```

## Calculation Logic

### Hours Calculation
- Full Day: 8 hours
- Half Day: 4 hours
- Day Off: 0 hours

### Payslip Amount
```
Total Amount = Total Hours × Hourly Rate
```

### Example
- Worker hourly rate: $20
- Period: 10 work days (80 hours) + 2 days off
- Total: 80 × $20 = $1,600

## Next Steps & Enhancements

Consider implementing:

1. **Authentication**
   - User login/logout
   - Role-based access control
   - Admin and user roles

2. **Advanced Features**
   - Dashboard with statistics
   - Attendance charts and graphs
   - PDF payslip generation
   - Email delivery of payslips
   - Attendance export (CSV, Excel)

3. **Improvements**
   - Batch attendance upload
   - Recurring payslips
   - Deductions and allowances
   - Tax calculations
   - Bank integration

4. **UI/UX**
   - Dark mode toggle
   - Mobile app version
   - Offline support
   - Real-time updates (WebSocket)

5. **Performance**
   - Database indexing
   - Query optimization
   - Caching layer
   - Pagination

## Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **ShadCN/UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MySQL Docs**: https://dev.mysql.com/doc

## Troubleshooting

For additional help:

1. Check the terminal output for error messages
2. Review the browser console (F12) for client-side errors
3. Check Prisma logs: `npx prisma debug`
4. Enable detailed logging in environment variables
5. Review commit history in git for recent changes

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Last Updated**: December 2025
**Version**: 1.0.0
