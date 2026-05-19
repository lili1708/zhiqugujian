$scriptContent = @'
cd "D:\开发\zhiqugujian"
npm run dev
'@
$scriptContent | Out-File -FilePath "$env:TEMP\start-vite.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-File", "$env:TEMP\start-vite.ps1" -WindowStyle Normal