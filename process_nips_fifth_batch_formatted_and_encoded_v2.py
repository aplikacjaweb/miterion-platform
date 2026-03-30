
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "7372209527": "Krymed Sp. z o.o.",
    "6482555572": "Mateusz Gałuszka Ośrodek Zdrowia Gamed",
    "9281005174": "Ośrodek Terapii Grunwald Stanisław Bojkowski",
    "5993265403": "Almed Andrzej Marciniak Sp. z o.o.",
    "9721190768": "Centrum Medyczne Mediraj Sp. z o.o.",
    "5993259319": "Nikap Sp. z o.o.",
    "5961062223": "NZOZ Praktyka Lekarza Rodzinnego \"Sanvita\"",
    "9251713251": "Przychodnia Lekarska \"Zdrowie\" S.C.",
    "5961537212": "NZOZ \"PRO VITA\" S.C.",
    "9731084335": "Livia Med.",
    "8151763728": "Centrum Medyczne w Łańcucie Sp. z o.o.",
    "7922288786": "DANFARM MED Sp. z o.o.",
    "8151613762": "PW \"GABMED\" Sp. z o.o.",
    "8151815046": "VITAE - NZOZ Sp. z o.o.",
    "7922321383": "Med.-Jar Sp. z o.o.",
    "6842132478": "Samodzielny Publiczny Gminny Zakład Opieki Zdrowotnej",
    "8161634085": "Małecki, Woźnica, Lekarska Spółka Partnerska",
    "7952218833": "NZOZ \"Res Medica\" S.C.",
    "7941090401": "Konrad Józef Myszor",
    "6842128637": "Samodzielny Publiczny Gminny Zakład Opieki Zdrowotnej",
    "6851073824": "Wiesława Lasik-Leśniak CMR L-Med Kołaczyce",
    "6842641748": "Centrum Medyczne Zdrowy Styl Sp. z o.o.",
    "8191008412": "Marek Ziajor Przychodnia \"MEDIMAR\" Frysztak",
    "7931399717": "ZOZ R-36 Sp. z o.o.",
    "8172209606": "Carpathia Medica Sp. z o.o.",
    "8161527751": "NZOZ \"Medyk\" Sp. J.",
    "7952145755": "NZOZ Asklepios Wojciech Tomaka i Wspólnicy S.J.",
    "8132901483": "WSPL SP ZOZ w Rzeszowie",
    "9452186433": "Medycyna Sp. z o.o.",
    "5213165443": "NZOZ Medica-1 Beata Jurczak-Malinowska",
    "6842246822": "Zdrowie Sp. z o.o.",
    "8133273296": "BUD-MED NZOZ w Rzeszowie",
    "8191538831": "NZOZ Eskulap S.P. Lekarzy - Zabrzycka i Partnerzy",
    "8161000400": "Panorama Sp. z o.o.",
    "8131375928": "NZOZ \"Remedium\" Kinga Januszewska",
    "8141463545": "NZOZ \"Prywatna Praktyka Lekarzy\" S.C.",
    "6972392166": "4med Leszno Sp. z o.o.",
    "7861720722": "Tech Farm Bis S.J.",
    "7812057241": "Rodzina Med Sp. z o.o.",
    "5991273516": "Centrum Położnicze Agnieszka Kamińska-Nowak",
    "7831899952": "Fileo Sp. z o.o.",
    "7772293678": "Przychodnia Lekarza Rodzinnego",
    "7792083932": "Praktyka Lekarzy Rodzinnych \"Zdrowie\"",
    "6222833092": "NZPZOZ \"Sanus\" Sp. z o.o.",
    "7881834854": "Przychodnia \"Hipokrates\" Barbara Szymańska",
    "9680783772": "Przychodnia Ceków Lekarze S.P.",
    "5140157572": "Ryszard Kupidura, Magdalena Szymczak-Płonka",
    "5140159453": "Wiesław Maciejewski, Przemysław Skorwider",
    "7773083842": "Dom Zdrowia i Urody Sp. z o.o.",
    "7842489347": "Apimed Sp. z o.o."
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
