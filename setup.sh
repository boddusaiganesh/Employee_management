#!/bin/bash

# Employee Management System - Setup Script
echo "=== Employee Management System Setup ==="

# Install root dependencies
echo -e "\nInstalling root dependencies..."
npm install

# Setup backend
echo -e "\nSetting up backend..."
cd server
npm install
echo "Generating Prisma client..."
npx prisma generate
echo "Running database migrations..."
npx prisma migrate dev --name init
echo "Seeding database..."
npm run prisma:seed
cd ..

# Setup frontend
echo -e "\nSetting up frontend..."
cd client
npm install
cd ..

echo -e "\n=== Setup Complete! ==="
echo -e "\nTo start the application:"
echo "1. Backend:  cd server && npm run dev"
echo "2. Frontend: cd client && npm run dev"
echo -e "\nOr run both: npm run dev"
echo -e "\nLogin with: admin@example.com / admin123"
