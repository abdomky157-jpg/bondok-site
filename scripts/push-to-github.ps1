param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    [string]$CommitMessage = "Update file"
)

# Read token from .env.local
$envFile = Join-Path $PSScriptRoot "..\.env.local"
$token = $env:GITHUB_TOKEN

if (-not $token -and (Test-Path $envFile)) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*GITHUB_TOKEN\s*=\s*(.+)$") {
            $token = $matches[1].Trim()
        }
    }
}

if (-not $token) {
    Write-Error "GITHUB_TOKEN not found in environment or .env.local"
    exit 1
}

$owner = "abdomky157-jpg"
$repo = "bondok-site"
$branch = "main"

$fullPath = (Resolve-Path $FilePath).Path
$baseDir = (Get-Item (Join-Path $PSScriptRoot "..")).FullName
$relPath = $fullPath.Substring($baseDir.Length).TrimStart('\', '/').Replace('\', '/')

# Get existing file SHA if it exists
$sha = $null
try {
    $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/contents/$relPath?ref=$branch" -Headers @{
        Authorization = "Bearer $token"
        "User-Agent" = "PowerShell"
    } -ErrorAction Stop
    $sha = $existing.sha
} catch {
    # File doesn't exist yet or is new
}

$bytes = [System.IO.File]::ReadAllBytes($fullPath)
$base64 = [Convert]::ToBase64String($bytes)

$body = @{
    message = $CommitMessage
    content = $base64
    branch = $branch
}
if ($sha) {
    $body["sha"] = $sha
}

$json = $body | ConvertTo-Json -Depth 5

$result = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/contents/$relPath" -Method Put -Headers @{
    Authorization = "Bearer $token"
    "User-Agent" = "PowerShell"
    "Content-Type" = "application/json"
} -Body ([System.Text.Encoding]::UTF8.GetBytes($json))

Write-Output "Pushed $relPath successfully: commit $($result.commit.sha.Substring(0,7))"
