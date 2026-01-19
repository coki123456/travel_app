@echo off
echo Resolviendo migracion fallida...
npx prisma migrate resolve --rolled-back 20260119_add_users_and_sharing
echo.
echo Eliminando la migracion duplicada...
rd /s /q prisma\migrations\20260119_add_users_and_sharing
echo.
echo Aplicando migraciones...
npx prisma migrate deploy
echo.
echo Generando Prisma Client...
npx prisma generate
echo.
echo Listo!
