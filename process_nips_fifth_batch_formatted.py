
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "7962956314": "Przychodnia Centrum Spółka z Ograniczoną Odpowiedzialnością",
    "1250931792": "Szpital Matki Bożej Nieustającej Pomocy w Wołominie",
    "7123229838": "Arion Med Spółka z Ograniczoną Odpowiedzialnością",
    "8221372974": "Beamed Przychodnia Lekarska Beata Bielecka",
    "5291468241": "Biovena Sp. z o.o",
    "5671034098": "Mikołajewska Jolanta, NZOZ Poradnia Rodzinna \"Eskulap\"",
    "5322043124": "Fam Medica Sp. z o.o.",
    "7743219768": "Centrum Medyczne Borowiczki Spółka z Ograniczoną Odpowiedzialnością",
    "9562304388": "Świat Zdrowia Operator Medyczny Spółka z Ograniczoną Odpowiedzialnością", # Appears multiple times, handling as unique key
    "5372553241": "Medica Spółka Jawna",
    "8381034708": "Centrum Optyczno-Okulistyczne Szeliga Anna Szeliga-Wójcik",
    "5361371677": "Eskulap Sławomir Konstantynowicz",
    "5311191312": "Bożena Borkowska-Rączka",
    "7581050982": "Zerhau Igor - Przychodnia Lekarska \"Medical\"",
    "5311422527": "Garnizonowa Przychodnia Lekarska SPZOZ w Modlinie",
    "5250007425": "Niepubliczny Zakład Opieki Zdrowotnej SGGW",
    "5242758370": "Stołeczne Centrum Opiekuńczo-Lecznicze Sp. z o.o.",
    "5242469588": "Krajowa Fundacja Medyczna",
    "8222206574": "PHU \"Jaśminova\" S.C. Dariusz Wiącek, Mariola Siedlczyńska-Wiącek",
    "1251108505": "Vital Sp. z o.o.",
    "8381031650": "Emilia Kotewska-Avramčeva NZOZ Przychodnia Lekarska Neuromedyka",
    "9482131483": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Przytyku",
    "8241545030": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Węgrowie", # Appears multiple times, handling as unique key
    "7971019721": "NZOZ Amed"
}

csv_file_path = "podmioty.csv"
results_list = []

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
            result_string = (f"Nazwa placówki: {provided_name}\n"
                             f"Tel: {csv_data['Telefon']}\n"
                             f"E-mail: {csv_data['E-mail']}\n"
                             f"Strona: {csv_data['Strona WWW']}\n"
                             f"NIP: {nip_to_find}\n\n---\n\n")
            results_list.append(result_string)
        else:
            result_string = (f"Nazwa placówki: {provided_name}\n"
                             f"Tel: Brak danych\n"
                             f"E-mail: Brak danych\n"
                             f"Strona: Brak danych\n"
                             f"NIP: {nip_to_find}\n\n---\n\n")
            results_list.append(result_string)

except FileNotFoundError:
    results_list.append(f"Błąd: Plik {csv_file_path} nie został znaleziony.")
except ValueError as ve:
    results_list.append(f"Błąd konfiguracji CSV: {ve}")
except Exception as e:
    results_list.append(f"Wystąpił błąd podczas przetwarzania pliku CSV: {e}")

for res in results_list:
    sys.stdout.buffer.write(res.encode('utf-8'))
