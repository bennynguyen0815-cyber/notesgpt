@echo off
for /f "tokens=1,2 delims==" %%a in (.env.local) do set %%a=%%b
npx prisma migrate dev