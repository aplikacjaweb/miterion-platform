
import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

nip_to_provided_name = {
    "5792133296": "Powiatowe Centrum Zdrowia",
    "5552076156": "Therapeutica Sp. z o.o.",
    "5881951872": "Niepubliczny Zakład Opieki Zdrowotnej Zdrowy Checz Sp. z o. o.",
    "5811980348": "Palmed Nova Spółka z Ograniczoną Odpowiedzialnością",
    "5921854774": "Medpharma Zakład Opieki Zdrowotnej S.A.",
    "5832631044": "Przychodnia Lekarska \"Jasień \" Spółka z Ograniczoną Odpowiedzialnością",
    "8392558119": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Smołdzinie",
    "9581371457": "Przychodnia Lekarska Grabówek Sp. z o.o.",
    "5881951949": "Niepubliczny Zakład Opieki Zdrowotnej Cormed Sp. z o. o.",
    "5811960920": "Medipunkt Spółka z Ograniczoną Odpowiedzialnością Spółka Komandytowa",
    "5921963724": "Polmed Spółka Akcyjna",
    "5932181971": "Niepubliczny Zakład Opieki Zdrowotnej Pelmed Sp. z o.o.",
    "5922013870": "Niepubliczny Zakład Opieki Zdrowotnej Medyk Spółka z Ograniczoną Odpowiedzialnością",
    "5882134537": "Niepubliczny Zakład Opieki Zdrowotnej Nr 1, Katarzyna Szalewska",
    "5881962901": "Niepubliczny Zakład Opieki Zdrowotnej Nr 1 Bukowa Spółka z Ograniczoną Odpowiedzialnością",
    "9581371411": "Przychodnia Lekarska Obłuże II Spółka z Ograniczoną Odpowiedzialnością",
    "5833152707": "Przychodnia Na Wzgórzu Spółka z Ograniczoną Odpowiedzialnością",
    "5932639588": "Doktormed Sp. z o.o.",
    "5921871206": "Gminny Ośrodek Zdrowia w Skarszewach",
    "5911533956": "Niepubliczny Zakład Opieki Zdrowotnej \"Przychodnia\" Spółka z Ograniczoną Odpowiedzialnością",
    "5881955781": "Medycyna Rodzinna Hanna Cywińska, Mirosław Ruciński Spółka Jawna",
    "5891639679": "Samodzielny Publiczny Zakład Opieki Zdrowotnej z Siedzibą w Stężycy",
    "8393226678": "Medunit",
    "5871512881": "Remedia Spółka z Ograniczoną Odpowiedzialnością",
    "5881957739": "Panaceum Spółka z Ograniczoną Odpowiedzialnością",
    "5862059413": "Przychodnia Orłowo Spółka z Ograniczoną Odpowiedzialnością",
    "5791183056": "Grażyna Pietrzak, \"Życie\" Niepubliczny Zakład Opieki Zdrowotnej",
    "6751031872": "Kadłuczka Sławomir NZOZ \"Centrum Promocji i Ochrony Zdrowia\"",
    "9562304388": "Świat Zdrowia Operator Medyczny Spółka z Ograniczoną Odpowiedzialnością",
    "6412186201": "Przychodnia Rejonowa SPZOZ w Rudzie Śląskiej",
    "6412186885": "Przychodnia Rejonowa SPZOZ z Siedzibą Przy Ul. Makuszyńskiego 7",
    "6461285618": "Awicenna Sp. z o.o.",
    "6441026339": "Inter-Med. S.C.",
    "6271104571": "Mirosław Daniluk",
    "6411091800": "Med-Dental Wieczorek i Wspólnicy Spółka Jawna",
    "6462441569": "Centrum Medyczne Im. Janusza Mierzwy Sp. z o.o.",
    "6462455689": "Vita Med Spółka z Ograniczoną Odpowiedzialnością"
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
