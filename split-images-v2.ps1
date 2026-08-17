[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

try {
    $imagePath = "images/ChatGPT Image Aug 16, 2026, 07_06_07 PM.png"
    Write-Host "Loading image: $imagePath"
    
    $img = New-Object System.Drawing.Bitmap($imagePath)
    $width = $img.Width
    $height = $img.Height
    $midPoint = [int]($width / 2)
    
    Write-Host "Dimensions: $width x $height"
    Write-Host "Midpoint: $midPoint"
    
    # Left half (bus wash)
    $leftBitmap = New-Object System.Drawing.Bitmap($midPoint, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($leftBitmap)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $midPoint, $height)
    $graphics.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Dispose()
    $leftBitmap.Save("images/hero-bus-wash.png")
    $leftBitmap.Dispose()
    Write-Host "Saved: hero-bus-wash.png"
    
    # Right half (steam cleaner)  
    $rightBitmap = New-Object System.Drawing.Bitmap(($width - $midPoint), $height)
    $graphics = [System.Drawing.Graphics]::FromImage($rightBitmap)
    $rect = New-Object System.Drawing.Rectangle($midPoint, 0, ($width - $midPoint), $height)
    $graphics.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Dispose()
    $rightBitmap.Save("images/hero-steam-cleaner.png")
    $rightBitmap.Dispose()
    Write-Host "Saved: hero-steam-cleaner.png"
    
    $img.Dispose()
    Write-Host "Complete"
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
}
