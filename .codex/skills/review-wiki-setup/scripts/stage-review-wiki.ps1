param(
    [string]$WorkspaceRoot = (Get-Location).Path,
    [string]$SourceWikiRoot = (Join-Path $HOME ".codex\reviewWiki\wiki"),
    [string]$DestinationRoot = (Join-Path $WorkspaceRoot ".codex\review-wiki\sync\current")
)

$ErrorActionPreference = "Stop"

$resolvedWorkspaceRoot = [System.IO.Path]::GetFullPath($WorkspaceRoot)
$resolvedSourceWikiRoot = [System.IO.Path]::GetFullPath($SourceWikiRoot)
$resolvedDestinationRoot = [System.IO.Path]::GetFullPath($DestinationRoot)

if (-not (Test-Path -LiteralPath $resolvedSourceWikiRoot -PathType Container)) {
    throw "Review wiki source root not found: $resolvedSourceWikiRoot"
}

# Refuse to delete or recreate a sync path outside the active workspace.
$workspacePrefix = $resolvedWorkspaceRoot.TrimEnd("\") + "\"
if (-not $resolvedDestinationRoot.StartsWith($workspacePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Destination root must stay inside the workspace: $resolvedDestinationRoot"
}

if (Test-Path -LiteralPath $resolvedDestinationRoot) {
    Remove-Item -LiteralPath $resolvedDestinationRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $resolvedDestinationRoot -Force | Out-Null
Copy-Item -Path (Join-Path $resolvedSourceWikiRoot "*") -Destination $resolvedDestinationRoot -Recurse -Force

$manifest = [ordered]@{
    source_root = $resolvedSourceWikiRoot
    destination_root = $resolvedDestinationRoot
    synced_at_utc = [DateTime]::UtcNow.ToString("o")
}

$manifestPath = Join-Path $resolvedDestinationRoot "synced.json"
$manifest | ConvertTo-Json | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Output "Refreshed review wiki planning sync at $resolvedDestinationRoot"
