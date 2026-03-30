
import csv

nip_to_provided_name = {
    "6932175190": "Głogowski Szpital Powiatowy Spółka z Ograniczoną Odpowiedzialnością",
    "8822120987": "Dobicka-Laskowska&Zadorski Lekarska Spółka Partnerska",
    "6151706942": "Wielospecjalistyczny Szpital - Samodzielny Publiczny Zespół Opieki Zdrowotnej w Zgorzelcu",
    "6941514409": "Gminny Zespół Zakładów Opieki Podstawowej w Złotoryi",
    "8982231810": "Międzywojewódzka Przychodnia Sportowo-Lekarska Spółka Akcyjna",
    "6121545598": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Nowogrodźcu",
    "8842752466": "Medimex Sp z o.o.",
    "9131633644": "Hipokrates Środa Śląska Sp. z o.o.",
    "8971661719": "Niepubliczny Zakład Opieki Zdrowotnej Staromiejskie Centrum Medyczne -Starmed Sp. z o.o.",
    "9161393038": "Milickie Centrum Zdrowia Spółka z Ograniczoną Odpowiedzialnością Spółka Komandytowa",
    "6951532509": "NZOZ Arm-Med Spółka z Ograniczoną Odpowiedzialnością",
    "9251711950": "Praktyka Lekarzy Rodzinnych D. Gocha Chmielewska, J. Chmielewski Spółka z Ograniczoną Odpowiedzialnością",
    "9141419154": "Samodzielny Publiczny Gminny Zespół Opieki Zdrowotnej w Przewornie",
    "6951354002": "Ośrodek Zdrowia w Wądrożu Wielkim",
    "6131480564": "Niepubliczny Zakład Opieki Zdrowotnej Łużyckie Centrum Medyczne w Lubaniu Sp. z o.o.",
    "8942908910": "Hospital Service",
    "6121846897": "Gemini-Med. Sp. z o.o.",
    "8821191672": "Niepubliczny Zakład Opieki Zdrowotnej \"Na Skałkach\" Joanna Grzesiak Dynowska",
    "9160001036": "Praktyka Lekarska Andrzej Krężlewicz",
    "5891639550": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Żukowie",
    "8431032330": "Niepubliczny Zakład Opieki Zdrowotnej Przychodnia Lekarska Hipokrates Grażyna Herbowska",
    "5811936436": "Fundacja Delta",
    "5792128243": "Indywidualna Specjalistyczna Praktyka Lekarska Karolina Omańska",
    "8391732549": "Niepubliczny Zakład Opieki Zdrowotnej Krystyna Stus",
    "9570954882": "Przychodnia Słonimskiego B. Domosławski i Wsp. Sp. J.",
    "5811945300": "Niepubliczny Zakład Opieki Zdrowotnej Im. Św. Łukasza S.C."
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
