@echo off
echo Repairing migration history...
echo.

supabase migration repair --status applied 20241028000001
supabase migration repair --status applied 20241028000002
supabase migration repair --status applied 20241029000001
supabase migration repair --status applied 20241029000002
supabase migration repair --status applied 20241029000003
supabase migration repair --status applied 20241030000001

echo.
echo Migration repair complete!
echo Now run: supabase db push
pause
