$nipList = @(
    "9671181909", "5621014484", "5541834593", "8781680056", "5562237224",
    "5591697046", "5540239670", "5571520586", "8881702797", "8791207410",
    "8881047364", "8791207410", "8792072136", "5571033863", "8792072627",
    "8762001172", "6151341096", "8841447488", "9111699350", "8992124286",
    "8961554436", "8811013437", "9151557449", "8951799946", "6932190396",
    "6931848712"
)

$csvPath = "podmioty.csv"

# Read the CSV file, assuming semicolon as delimiter
$data = Import-Csv -Path $csvPath -Delimiter ';'

foreach ($nipToFind in $nipList) {
    $found = $false
    foreach ($row in $data) {
        $currentNIP = $row.NIP.Trim(' "')
        if ($currentNIP -eq $nipToFind) {
            $nazwa = $row."Nazwa podmiotu".Trim(' "') -replace "NULL", "Brak danych"
            $telefon = $row.Telefon.Trim(' "') -replace "NULL", "Brak danych"
            $stronaWWW = $row."Strona WWW".Trim(' "') -replace "NULL", "Brak danych"
            $email = $row.Email.Trim(' "') -replace "NULL", "Brak danych"
            
            Write-Output "Nazwa placówki: $nazwa"
            Write-Output "Tel: $telefon"
            Write-Output "E-mail: $email"
            Write-Output "Strona: $stronaWWW"
            Write-Output "NIP: $currentNIP"
            Write-Output "---"
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Output "Brak danych dla NIP: $nipToFind"
        Write-Output "---"
    }
}