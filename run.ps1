node "D:\agent freelancer\connect_ws.js" 2>&1 | Tee-Object -Variable out
Write-Output "---DONE---"
Write-Output $out | Select-Object -Last 30