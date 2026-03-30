
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "8631531952": "Zdrowie Sp. z o.o.",
    "6561856026": "Miejsko - Gminny Zespół Ośrodków Zdrowia",
    "6641974897": "Stowarzyszenie Eskulap",
    "9591293701": "Samorządowy ZPOZ w Piekoszowie",
    "6611961915": "SPGZOZ w Nowej Słupi",
    "7412155224": "Zaniewski Bilski Sp. z o.o.",
    "5671926313": "Grupa Zdrowie Sp. z o.o.",
    "7421944015": "SNZOZ \"Mazur-Med.\" Pomiećko",
    "9840121443": "MEDYK - Kacała, Powroźnik i Zakrzewska S.P.",
    "7441316032": "NZOZ Gabinet Lekarza Rodzinnego Błażej Boguta",
    "5811960920": "Medipunkt Sp. z o.o. Sp. k.",
    "8771315792": "PZOZ w Grodzicznie",
    "8771450225": "NZOZ Eskulap Spółka z o.o.",
    "7441516966": "ZOZ - Miejski Ośrodek Zdrowia w Lubawie",
    "8451995130": "Giżycka Ochrona Zdrowia Sp. z o.o.",
    "8471011119": "NZOZ Gamed Ilona Gajewska Olecko",
    "7431094363": "Ewa Steckiewicz Lidzbark Warmiński",
    "8481018933": "NZOZ Centrum Robert Węgłowski Ełk",
    "7393042386": "Pantamed Sp. z o.o.",
    "7392963227": "Miejska Przychodnia Zdrowia w Barczewie",
    "5821487655": "MEDYK Kardasz-Kopytko i Wspólnicy S.J.",
    "6791040558": "Arkadiusz Strus Euromed NZOZ",
    "8732695394": "Centermed Sp. z o.o.",
    "9512355024": "Allmedica Sp. z o.o.",
    "6782732541": "Medic-Kolor Sp. z o.o.",
    "6772075248": "SPZOZ MSWiA w Krakowie",
    "6783125814": "Ratmedica Sp. z o.o.",
    "9441800059": "NZOZ S.C. M. Ostrowska-Dumnicka, K. Średniawa",
    "8733135562": "Centrum Zdrowia Tuchów Sp. z o.o.",
    "8711544046": "Gminny Zakład Opieki Zdrowotnej w Oleśnie",
    "7343558337": "NZOZ Medyk Spółka z o.o.",
    "7361488831": "SPZOZ w Poroninie",
    "7352377871": "CMR S.P. - Grzywacz & Ligęza & Czepiel-Pajerska",
    "6782728315": "NZOZ \"Osiedle Urocze\" sp. z o.o.",
    "7361583601": "NZOZ Medicatio - S.P. Lekarzy",
    "7352366956": "Przychodnia Lekarzy Rodzinnych Jurek i Partnerzy",
    "5512188771": "Puls Adam i Beata Rauk S.J.",
    "7382144605": "Ośrodek Zdrowia w Moszczenicy Sp. z o.o.",
    "7352184333": "SPGOZ w Maniowach",
    "8942908910": "Hospital Service",
    "7371198655": "NZOZ Przychodnia Lekarska Lesław Szot",
    "9930297097": "Setkiewicz, Gniadek-Jakson - S.P.",
    "7361642031": "PRZYCHODNIA LEKARSKA ANNA GALICA i WSPÓLNICY Sp.J.",
    "8691663456": "SP Zespół Opieki Zdrowotnej w Brzesku",
    "6762346332": "Queen Medicine Sp. z o.o.",
    "7343032440": "NZOZ Esculap Anna Tokarczyk Adam Gębka S.J.",
    "8732370982": "Przychodnia Rodzinna Skomed",
    "6792598280": "Klimed Spółka z o.o.",
    "9441989111": "NZOZ w Świątnikach Górnych Sp. z o.o.",
    "7341667476": "Hipokrates - NZOZ Bogdan Krzykwa"
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
