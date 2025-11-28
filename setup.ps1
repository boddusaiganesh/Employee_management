# Employee Management System - Setup Script
Write-Host "=== Employee Management System Setup ===" -ForegroundColor Cyan

# Install root dependencies
Write-Host "`nInstalling root dependencies..." -ForegroundColor Yellow
npm install

# Setup backend
Write-Host "`nSetting up backend..." -ForegroundColor Yellow
Set-Location server
npm install
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
Write-Host "Seeding database..." -ForegroundColor Yellow
npm run prisma:seed
Set-Location ..

# Setup frontend
Write-Host "`nSetting up frontend..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "`nTo start the application:" -ForegroundColor Cyan
Write-Host "1. Backend:  cd server && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "`nOr run both: npm run dev" -ForegroundColor White
Write-Host "`nLogin with: admin@example.com / admin123" -ForegroundColor Yellow
