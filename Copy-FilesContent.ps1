function Copy-FilesContent {
    param (
        [string]$Directory,
        [string]$OutputFile
    )

    # Clear output file if it exists
    if (Test-Path -Path $OutputFile) {
        try {
            Remove-Item -Path $OutputFile -Force
            Write-Host "Existing output file removed."
        }
        catch {
            Write-Host "Error deleting $($OutputFile): $($_.Exception.Message)"
            return
        }
    }

    try {
        New-Item -Path $OutputFile -ItemType File -Force | Out-Null
        Write-Host "New output file created."
    }
    catch {
        Write-Host "Error creating $($OutputFile): $($_.Exception.Message)"
        return
    }

    # Include package.json, tsconfig, and eslint files first
    $filePaths = @("package.json", "tsconfig.json", ".eslintrc.json", "apps\web\tsconfig.json")

    foreach ($fileName in $filePaths) {
        $filePath = Join-Path -Path $Directory -ChildPath $fileName
        if (Test-Path -Path $filePath) {
            Add-Content -Path $OutputFile -Value "`n`n// $filePath"
            $fileContent = Get-Content -Path $filePath -Raw
            Add-Content -Path $OutputFile -Value $fileContent
        }
    }

    # Loop through files and directories recursively
    Get-ChildItem -Path $Directory -Recurse | ForEach-Object {
        $file = $_.FullName
        $extension = [System.IO.Path]::GetExtension($file)

        # Exclude specific file types and directories
        if ($extension -match "\.(ico|jpg|jpeg|png|svg|bmp|gif|db|gz)" -or
            $file -like "*node_modules*" -or
            $file -like "*settings.json" -or
            $file -like "*.next*" -or
            $file -like "*ssr*" -or
            $file -like "*vendor-chunks*" -or
            $file -like "*next.config.js" -or
            $file -like "*package-lock.json" -or
            $file -like "C:\Users\israe\Documents\GitHub\webapp\apps\server*") {
            Write-Host "Skipping file: $file"
            return
        }

        # Include text-based file types
        if ($extension -in @(".tsx", ".js", ".ts", ".config.mjs", ".json", ".alo")) {
            try {
                Add-Content -Path $OutputFile -Value "`n`n// $file"
                $fileContent = Get-Content -Path $file -Raw | Where-Object { $_ -notmatch 'node_modules' -and $_ -notmatch 'webpack' }
                Add-Content -Path $OutputFile -Value $fileContent
            }
            catch {
                Write-Host "Error writing to $($OutputFile): $($_.Exception.Message)"
                return
            }
        }
    }
}

# Main script
$outputFile = "output.txt"
Copy-FilesContent -Directory "." -OutputFile $outputFile

Write-Host "Text files content copied to $($outputFile)"
