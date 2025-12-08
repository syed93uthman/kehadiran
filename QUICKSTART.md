# Quick Start Guide - Worker Attendance System

Get the application up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- This project folder

## 5-Minute Setup

### 1. Create Database (2 minutes)

```bash
mysql -u root -p
```

In MySQL shell:
```sql
CREATE DATABASE kehadiran;
EXIT;
```

### 2. Configure Environment (1 minute)

Edit `.env.local`:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/kehadiran"
```

Replace `your_password` with your MySQL password.

### 3. Setup & Run (2 minutes)

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open browser: **http://localhost:3000**

## Done! 🎉

You now have a fully functional worker attendance system!

---

## First Steps

### 1. Add Workers
- Click "Workers" tab
- Click "Add Worker"
- Enter name and hourly rate
- Click "Add"

### 2. Record Attendance
- Click "Attendance" tab
- Select worker and date
- Choose Full Day/Half Day/Day Off
- Click "Record"

### 3. Generate Payslip
- Click "Payslip" tab
- Select worker and date range
- Click "Generate"
- View summary and click "Save to Database"

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start

# View database
npx prisma studio

# Reset everything (CAREFUL - deletes all data)
npx prisma migrate reset
```

## Features

✅ Manage workers (add/edit/delete)
✅ Track attendance (Full Day/Half Day/Day Off)
✅ Generate payslips automatically
✅ Beautiful, modern UI
✅ Type-safe with TypeScript
✅ MySQL database persistence

## Troubleshooting

**Database won't connect?**
- Check MySQL is running: `mysql -u root -p -e "SELECT 1;"`
- Verify DATABASE_URL in .env.local

**npm install fails?**
- Delete node_modules: `rm -rf node_modules`
- Run again: `npm install`

**Port 3000 in use?**
- Run on different port: `npm run dev -- -p 3001`

## Next Steps

- Read SETUP.md for detailed documentation
- Explore src/ folder to understand code structure
- Check API endpoints in SETUP.md for integration

---

Need help? See SETUP.md for comprehensive documentation.
