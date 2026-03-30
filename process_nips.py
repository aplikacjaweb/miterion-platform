
import csv

nip_list = [
    "9671181909", "5621014484", "5541834593", "8781680056", "5562237224",
    "5591697046", "5540239670", "5540239670", "5571520586", "8881702797",
    "8791207410", "8881047364", "8791207410", "8792072136", "5571033863",
    "8792072627", "8762001172", "6151341096", "8841447488", "9111699350",
    "8992124286", "8961554436", "8811013437", "9151557449", "8951799946",
    "6932190396", "6931848712"
]

healthcare_providers = {}
try:
    with open("podmioty.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=';')
        header = [h.strip().replace('"', '') for h in next(reader)] # Clean headers
        
        # Find column indices
        nip_idx = header.index("NIP")
        name_idx = header.index("Nazwa podmiotu")
        phone_idx = header.index("Telefon")
        website_idx = header.index("Strona WWW")

        for row in reader:
            if len(row) > max(nip_idx, name_idx, phone_idx, website_idx): # Ensure row has enough columns
                nip = row[nip_idx].strip().replace('"', '')
                healthcare_providers[nip] = {
                    "Nazwa placówki": row[name_idx].strip().replace('"', ''),
                    "Telefon": row[phone_idx].strip().replace('"', ''),
                    "Strona WWW": row[website_idx].strip().replace('"', ''),
                    "NIP": nip
                }
except FileNotFoundError:
    print("Error: podmioty.csv not found.")
except Exception as e:
    print(f"Error reading CSV: {e}")

results = []
for nip_to_find in nip_list:
    data = healthcare_providers.get(nip_to_find)
    if data:
        results.append(
            f"Nazwa placówki: {data['Nazwa placówki']}, "
            f"Telefon: {data['Telefon']}, "
            f"Strona WWW: {data['Strona WWW']}, "
            f"NIP: {data['NIP']}"
        )
    else:
        results.append(f"Brak danych dla NIP: {nip_to_find}")

print("\n".join(results))
