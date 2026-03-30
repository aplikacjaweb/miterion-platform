
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "7661990463": "Zenon Borucki, Edyta Newska",
    "9721252765": "Wielkopolskie Centrum Medycyny Rodzinnej Sp. z o.o.",
    "9720911674": "Poznański Ośrodek Specjalistycznych Usług Medycznych",
    "6661796878": "NZOZ \"Vita - Med\" Lekarze S.P.",
    "6661889172": "SPZOZ w Kole",
    "7842131663": "Przychodnia \"Vitamed\" S.J.",
    "7790018994": "Dariusz Pużak",
    "6342846217": "Twoje Zdrowie S. A.",
    "5272523080": "Lux Med Sp. z o.o.",
    "7851810582": "Przychodnia Familia Sp. z o.o.",
    "7792431273": "Nts Pharma Sp. z o.o.",
    "6671537859": "WSPL SP ZOZ w Witkowie",
    "7891731446": "Przychodnia Medinet S.J.",
    "7871798542": "Jerzy Kwartalski, Barbara Kwartalska",
    "7811850291": "Poznańskie Centrum Otolaryngologii Sp. z o.o.",
    "6991966042": "Przychodnia Lekarska B. Bogacka-Gancarczyk Sp. z o.o.",
    "7671451331": "Wojciech Liwandowski, Marta Liwandowska",
    "6681673699": "Violetta Kahtan",
    "7811648000": "Magdalena Hauser-Michalska",
    "7861438517": "Wiesław Grobelny, Małgorzata Fertała",
    "9721236832": "Błażej Klauza, Marcin Schmidt",
    "7773238262": "Bonus 2001 Sp. z o.o. Sp. k.",
    "6211394134": "Maria Kownacka, Wiesław Kownacki",
    "6971976267": "Ośrodek Zdrowia w Lipnie K. Tomaszyk Sp. k.",
    "7891760011": "Wielkopolskie Centra Medyczne Remedium Sp. z o.o.",
    "7891692746": "Szpital Powiatowy We Wrześni Sp. z o.o.",
    "7781343849": "WSPL SP ZOZ",
    "7831516773": "Centrum Medyczne HCP Sp. z o.o.",
    "9231701782": "Cm Wolsztyn Sp. z o.o.",
    "7792081755": "ZLR \"Promyk\" Sp. z o.o.",
    "7851611664": "Jarosław Kończewski, Stanisław Koliński",
    "6181883577": "Zespół Lekarzy \"Śródmieście\" Sp. z o.o.",
    "6991495358": "Ewa Cempel-Nowak",
    "7861700286": "Nasmedica S.J.",
    "7871797028": "Medicus Sp z o.o.",
    "7481514241": "Zdrowie Rodziny Sp. z o.o.",
    "7880003855": "Elwira Katarzyna Wasiak",
    "6681971190": "Rodamed Sp. z o.o.",
    "6181022303": "Kaliska Agencja Medyczna \"Medix\" Sp. z o. o.",
    "7780116376": "Termedia Sp. z o.o.",
    "7861483848": "Arm-Med Korbecka - Paczkowska S.J.",
    "7811967308": "Piotr Sobański, Marlena Sobańska",
    "7822126966": "A. Targońska, W. Szymaniak, H. Witkowska-Szafałowicz",
    "7773358902": "Centrum Medyczne Komorniki Sp. z o.o.",
    "6652605933": "Marcin Winkler, Jolanta Winkler",
    "7841975258": "Przychodnia Promed Pajączkowska i Wspólnicy S.J.",
    "7792083056": "V. Fiedler-Łopusiewicz, M. Łukaszewicz, M. Piechowiak",
    "7872147812": "Klinika Mama Tata i Ja Sp. z o.o.",
    "9720601407": "Mariola Karolak-Tomczuk",
    "5632030191": "Miejski SPZOZ w Chełmie"
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
