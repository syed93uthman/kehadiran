# Worker Attendance System

A modern admin dashboard for managing worker attendance and generating payslips. Built with Next.js 15, MySQL, Prisma ORM, and ShadCN UI.

## Features

✅ **Worker Management**
- Add, edit, and delete workers
- Store worker full name and hourly rate

✅ **Attendance Tracking**
- Record daily attendance (Full Day, Half Day, Day Off)
- View attendance history
- Edit past attendance records

✅ **Payslip Generation**
- Generate payslips for a selected period
- Automatic calculation of total hours and amount
- Preview and download payslips
- Save payslips to database for record keeping

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: ShadCN/UI, Radix UI
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **ORM**: Prisma
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Installation & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Edit `.env.local` and update your database connection string:

```env
DATABASE_URL="mysql://user:password@localhost:3306/kehadiran"
```

### 3. Setup database

Create the MySQL database:

```bash
mysql -u root -p -e "CREATE DATABASE kehadiran;"
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create database tables (workers, attendances, payslips)
- Generate Prisma client

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── workers/          # Worker CRUD endpoints
│   │   ├── attendance/        # Attendance recording endpoints
│   │   └── payslip/          # Payslip generation endpoints
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main dashboard page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # ShadCN UI components
│   ├── WorkersTab.tsx        # Workers management tab
│   ├── AttendanceTab.tsx     # Attendance tracking tab
│   └── PayslipTab.tsx        # Payslip generation tab
└── lib/
    ├── db.ts                 # Prisma client instance
    └── utils.ts              # Utility functions

prisma/
└── schema.prisma             # Database schema
```

## Database Schema

### Workers Table
- `id`: Integer (Primary Key)
- `fullName`: String
- `hourlyRate`: Float
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Attendances Table
- `id`: Integer (Primary Key)
- `workerId`: Integer (Foreign Key)
- `date`: DateTime
- `status`: String (FULL_DAY, HALF_DAY, DAY_OFF)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Payslips Table
- `id`: Integer (Primary Key)
- `workerId`: Integer (Foreign Key)
- `startDate`: DateTime
- `endDate`: DateTime
- `totalHours`: Float
- `totalAmount`: Float
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Workers
- `GET /api/workers` - List all workers
- `POST /api/workers` - Create new worker
- `PUT /api/workers/[id]` - Update worker
- `DELETE /api/workers/[id]` - Delete worker

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Record attendance

### Payslip
- `GET /api/payslip` - Generate payslip (preview)
- `POST /api/payslip` - Save payslip to database

## Usage

### Adding a Worker

1. Go to the "Workers" tab
2. Click "Add Worker"
3. Enter full name and hourly rate
4. Click "Add"

### Recording Attendance

1. Go to the "Attendance" tab
2. Select worker, date, and status (Full Day/Half Day/Day Off)
3. Click "Record"
4. View recent attendance records below

### Generating Payslip

1. Go to the "Payslip" tab
2. Select worker, start date, and end date
3. Click "Generate"
4. Review payslip summary:
   - Hourly rate
   - Total hours worked
   - Total amount to be paid
   - Work days and days off breakdown
5. Options:
   - **Preview**: View detailed payslip
   - **Download**: Export as text file
   - **Save to Database**: Store payslip record

## Calculation Logic

### Hours Calculation
- Full Day: 8 hours
- Half Day: 4 hours
- Day Off: 0 hours

### Total Amount
```
Total Amount = Total Hours × Hourly Rate
```

## Development

### Building for production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Database management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (caution: deletes all data)
npx prisma migrate reset
```

## Common Issues

### Database connection fails
- Ensure MySQL service is running
- Verify DATABASE_URL in `.env.local`
- Check credentials and database name

### Prisma migration errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Reset Prisma: `npx prisma generate`

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Future Enhancements

- 📊 Dashboard with attendance statistics
- 📧 Email payslip delivery
- 📄 PDF payslip generation
- 👥 Multi-user admin support
- 🔐 User authentication & authorization
- �� Mobile app
- 📈 Detailed analytics and reports

## License

MIT
