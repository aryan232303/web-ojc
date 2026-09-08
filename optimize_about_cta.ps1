Add-Type -AssemblyName System.Drawing
$curr = Get-Location
$srcPath = Join-Path $curr 'more photos\DSC_5259.JPG.jpeg'
$src = [System.Drawing.Image]::FromFile($srcPath)
$w = 2160
$h = [int]($src.Height * ($w / $src.Width))
$dest = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.DrawImage($src, 0, 0, $w, $h)

$codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
$jpegCodec = $null
foreach ($c in $codecs) {
    if ($c.MimeType -eq 'image/jpeg') {
        $jpegCodec = $c
        break
    }
}
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ($encoder, [long]88)

$outPath = Join-Path $curr 'assets\images\selected\about-cta-bg.jpg'
$dest.Save($outPath, $jpegCodec, $encoderParams)
$g.Dispose()
$dest.Dispose()
$src.Dispose()
Write-Host "Done optimize about image! File size:" (Get-Item $outPath).Length
