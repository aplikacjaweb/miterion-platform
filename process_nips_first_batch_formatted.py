
import csv

nip_to_provided_name = {
    "9671181909": "Centrum Medyczne \" Ikar\" Sp.J.",
    "5621014484": "Agamed Agnieszka Łasecka",
    "5541834593": "Katarzyna Wysocka-Nowakowska",
    "8781680056": "Samodzielny Publiczny Zakład Opieki Zdrowotnej we Wrockach",
    "5562237224": "Gminna Przychodnia w Złotnikach Kujawskich",
    "5591697046": "Miejsko-Gminna Przychodnia w Świeciu",
    "5540239670": "Centrum Medyczne Intercor",
    "5571520586": "Samodzielny Publiczny Zakład Opieki Zdrowotnej",
    "8881702797": "NZOZ Primed Wiesława Kaczorowska",
    "8791207410": "NZOZ Praktyka Lekarza Rodzinnego Konrad Włodarczyk",
    "8881047364": "Witold Radzikowski",
    "8792072136": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Obrowie z Siedzibą w Dobrzejewicach",
    "5571033863": "Bogumiła Kabata",
    "8792072627": "Samodzielny Publiczny Ośrodek Zdrowia w Zelgnie",
    "8762001172": "Wojskowa Specjalistyczna Przychodnia Lekarska SPZOZ w Grudziądzu",
    "6151341096": "Niepubliczny Zakład Opieki Zdrowotnej Artmed",
    "8841447488": "NZOZ ,,Centrum Medyczne Serafinmed\" Halina Serafin",
    "9111699350": "Zespół Publicznych Zakładów Opieki Zdrowotnej w Bierutowie",
    "8992124286": "Dolnośląskie Centrum Medycyny Profilaktycznej i Bezpieczeństwa Pracy \"Pro-Med\" Sp. z o.o.",
    "8961554436": "Dr Ewa Spółka z Ograniczoną Odpowiedzialnością",
    "8811013437": "Elżbieta Nowicka",
    "9151557449": "NZOZ \"Medyk\" Spółka Partnerska- Lekarzy: B. Węgrzyn i J. Zielonka",
    "8951799946": "Praktyka Lekarza Rodzinnego A-Med",
    "6932190396": "Medica Głogów Spółka z Ograniczoną Odpowiedzialnością",
    "6931848712": "Niepubliczny Zakład Opieki Zdrowotnej Spółka z Ograniczoną Odpowiedzialnością"
}

csv_file_path = "podmioty.csv"
results = []

try:
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file, delimiter=';')
        header = [h.strip().replace('"', '') for h in next(reader)]

        def get_col_index(col_name):
            for i, h in enumerate(header):
                if h.lower() == col_name.lower():
                    return i
            raise ValueError(f"Column '{col_name}' not found in CSV header.")

        nip_idx = get_col_index("NIP")
        phone_idx = get_col_index("Telefon")
        email_idx = get_col_index("Email")
        website_idx = get_col_index("Strona WWW")

        data_from_csv = {}
        for row in reader:
            if len(row) > max(nip_idx, phone_idx, email_idx, website_idx):
                current_nip = row[nip_idx].strip().replace('"', '')
                data_from_csv[current_nip] = {
                    "Telefon": (row[phone_idx].strip().replace('"', '') or "Brak danych").replace("NULL", "Brak danych"),
                    "E-mail": (row[email_idx].strip().replace('"', '') or "Brak danych").replace("NULL", "Brak danych"),
                    "Strona WWW": (row[website_idx].strip().replace('"', '') or "Brak danych").replace("NULL", "Brak danych")
                }

    for nip_to_find, provided_name in nip_to_provided_name.items():
        if nip_to_find in data_from_csv:
            csv_data = data_from_csv[nip_to_find]
            results.append(f"Nazwa placówki: {provided_name}\n"
                           f"Tel: {csv_data['Telefon']}\n"
                           f"E-mail: {csv_data['E-mail']}\n"
                           f"Strona: {csv_data['Strona WWW']}\n"
                           f"NIP: {nip_to_find}\n\n---\n\n")
        else:
            results.append(f"Nazwa placówki: {provided_name}\n"
                           f"Tel: Brak danych\n"
                           f"E-mail: Brak danych\n"
                           f"Strona: Brak danych\n"
                           f"NIP: {nip_to_find}\n\n---\n\n")

except FileNotFoundError:
    results.append(f"Błąd: Plik {csv_file_path} nie został znaleziony.")
except ValueError as ve:
    results.append(f"Błąd konfiguracji CSV: {ve}")
except Exception as e:
    results.append(f"Wystąpił błąd podczas przetwarzania pliku CSV: {e}")

print('\n'.join(results))
