
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "7121215157": "Jacek Witold Woliński",
    "9181765247": "Praktyka Lekarska Konsylium S.C.",
    "5371979802": "NZOZ Przychodnia Rejonowa Nr 1 S.C.",
    "7132450206": "SPZOZ w Bychawie",
    "9721323005": "Osasuna Sp. z o.o.",
    "9462728893": "Jo-Med Sp. z o.o.",
    "5632081952": "Zdrovita Med Sp. z o.o.",
    "8621643253": "Panaceum S.J. - Maciej Widz Piotr Grygiel",
    "7132440840": "SPZOZ w Garbowie",
    "7122686568": "NZOZ Puls-Med Lekarze S.P.",
    "9211766755": "Poradnia Rodzinna Biachow-Fus Dolanowski Krawczyk Podoba S.J.",
    "9221571160": "NZOZ - Re-Med Janusz Rejman",
    "5391019620": "Przychodnia w Ostrowie / Transport Dariusz Kubiniec",
    "9223039357": "Novamed Sp. z o.o.",
    "9462219068": "Lekarz Rodzinny S.C. Agata Bałys Tomasz Bałys",
    "8212025575": "Centrum Medyczno-Diagnostyczne Sp. z o.o.",
    "8621463284": "NZOZ Nasza Przychodnia S.C.",
    "7121630838": "NZOZ Waldemar Knyba",
    "7122812895": "Uni-Med Sp. z o.o.",
    "5060104993": "NZOZ Stężyca S.C.",
    "5391331866": "Medical MCZ Renata Dominik",
    "7162270294": "6 Szpital Wojskowy z Przychodnią SP ZOZ",
    "9223072521": "Wysomed Sp. z o.o.",
    "7123082447": "Okulistyka s.c.",
    "7132846648": "SPZOZ Nr 1 w Bełżycach",
    "7151949763": "NZOZ \"Lekarz\" Dariusz Chmiel Sp. z o.o.",
    "9222282854": "SPZPOZ w Szczebrzeszynie",
    "9462657437": "Medycyna Polska Sp. z o.o.",
    "7162818438": "Puławska Akademia Kobiet Małgorzata Kukiełka Sp. K.",
    "5641800843": "Gr Medical Sp. z o.o.",
    "9191551513": "Niel - Med Sp. z o.o.",
    "9223034070": "Resort-Med Sp. z o. o.",
    "5651337789": "SPZOZ We Włodawie",
    "9221129665": "Elżbieta Paszkowska NZOZ \"Terapia\"",
    "7162353040": "NZOZ Medivita Sp. z o.o.",
    "7122679456": "Alvita Zabielska i Partnerzy S.P. Lekarzy",
    "7122742189": "Vis Vitalis - S.P. Lekarzy",
    "7122797374": "Gnyp Marcin Poleskie Centrum Medyczne",
    "7122684919": "NZOZ Ośrodek Zdrowia Bystrzejowice S.J.",
    "9223051861": "Przychodnia Rodzinna w Sitnie S.C.",
    "8522525013": "Kmw-Centrum Sp. z o.o.",
    "8542299270": "NOZ Asklepios w Suchaniu - S.C.",
    "8391758299": "Mariusz Paczkowski NZOZ Ars Medica",
    "6731376266": "Przychodnia Lekarska \"Amelia\" Piotr Burgieł",
    "6721791934": "NZOZ \"Folk-Med\" Sp. z o. o.",
    "9860088571": "NZPZOZ Medyk S.C.",
    "9860255543": "Szpital w Kamieniu Pomorskim Sp. z o.o.",
    "6731113012": "Medycyna Rodzinna Elżbieta Malik-Rucińska",
    "6151800374": "ZLR Wysoczańscy Sp. z o.o.",
    "8561112539": "Polmed - Przychodnia Sp. z o.o.",
    "8542410141": "Przychodnia Na Zdrowie Sp. z o.o.",
    "5971509097": "Przychodnia Im. Jana Pawła II Sp. z o.o.",
    "7641798998": "Włodzimierz Maniszewski CMR \"Puls\"",
    "6731617439": "Marek Szczytkowski",
    "9860259216": "Sedinamed s.c.",
    "8512670268": "Medika Usługi Medyczne Sp. z o.o.",
    "8513161801": "Akademia Zdrowia PRM S.C.",
    "8513189395": "Bmk Zoz Marzena Wilk, Krzysztof Wilk, Sp. J.",
    "8561846307": "Szpitalne Centrum Medyczne w Goleniowie Sp. z o.o.",
    "7651495874": "107 Szpital Wojskowy z Przychodnią SPZOZ",
    "8542068168": "WSPL SPZOZ w Stargardzie",
    "6711271819": "Jacek Zaleski",
    "8522576022": "Gcc Sp. z o.o.",
    "7651700328": "Konmed Sp. z o.o.",
    "8521088059": "NZOZ PRM Salus Sylwia Napiontek-Balińska"
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
