$nipList = @(
    "9671181909", "5621014484", "5541834593", "8781680056", "5562237224",
    "5591697046", "5540239670", "5571520586", "8881702797", "8791207410",
    "8881047364", "8791207410", "8792072136", "5571033863", "8792072627",
    "8762001172", "6151341096", "8841447488", "9111699350", "8992124286",
    "8961554436", "8811013437", "9151557449", "8951799946", "6932190396",
    "6931848712"
)

$csvPath = "podmioty.csv"
$results = @()

# Read the CSV file, assuming semicolon as delimiter
Import-Csv -Path $csvPath -Delimiter ';' | ForEach-Object {
    $currentNIP = $_.NIP.Trim(' "')
    if ($nipList -contains $currentNIP) {
        $results += [PSCustomObject]@{ 
            "Nazwa placówki" = $_."Nazwa podmiotu".Trim(' "')
            "Telefon" = $_.Telefon.Trim(' "')
            "Strona WWW" = $_."Strona WWW".Trim(' "')
            "NIP" = $currentNIP
        }
    }
}

# Output results
if ($results.Count -gt 0) {
    $results | Format-Table -AutoSize | Out-String
} else {
    "Brak wyników dla podanych NIP-ów."
}