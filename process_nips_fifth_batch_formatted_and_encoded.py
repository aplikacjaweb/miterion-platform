
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "7272408670": "Miejskie Centrum Medyczne \"Polesie\" w Łodzi",
    "7272373552": "Poradnia Lekarzy Rodzinnych Hanna Boguszewska, Agnieszka Jocz-Minich, Agata Płusa-Żak S.J.",
    "7271783897": "Ewa Wróbel-Nadel NZOZ \"Ledan\"",
    "7251753539": "Miejskie Centrum Medyczne Sp. z o.o.",
    "7262343555": "NZOZ Ewa i Krzysztof Sterniczuk S.C.",
    "7292386368": "Poradnia Lekarzy Rodzinnych Mejamed Sp. z o.o.",
    "7312002395": "Pabianickie Centrum Medyczne",
    "6010091102": "NZOZ Regionalne Centrum Medyczne Sp. z o.o.",
    "7712925347": "SUL-MED Sp. z o.o.",
    "7282839816": "Zakład Opieki Zdrowotnej Andrzejów Sp. z o.o.",
    "8291716516": "NZOZ EB-MED Sp. z o.o.",
    "7261197732": "NZOZ Poradnia Specjalistyczna Dr Ewa Anna Menes",
    "7272785906": "Usamed K. Kralkowska-Sowa, M Kralkowska s.c.",
    "8361855891": "Przychodnia Rawka Sp. z o.o.",
    "7282352913": "Gminna Przychodnia Zdrowia w Rzgowie",
    "7251019093": "SPZOZ USK Nr 1 im. Norberta Barlickiego UM w Łodzi",
    "7732128312": "Miejskie Centrum Zdrowia",
    "5741529452": "NZOZ \"Spec Med.\" Mariusz Błachowski",
    "8321850462": "SPZPOZ w Białej",
    "7282289592": "Miejskie Centrum Medyczne Im. Dr. Karola Jonschera w Łodzi",
    "7282392255": "NZOZ \"Kalmia\" L. Sowińska-Neuman, M. Czupryńska-Borkowska S.P.",
    "8291500621": "Lessman i Przybysławski Spółka Cywilna",
    "7282799531": "Family-Med Spółka Jawna M. Gawora - Ziółek Tomasz Ziółek NZOZ",
    "7282837349": "Centrum Medyczne \"Olmed\" Sp. z o.o., Sp. k.",
    "9562304388": "Świat Zdrowia Operator Medyczny Sp. z o.o.",
    "5272759026": "Centrum Medyczne Evista Sp. z o.o.",
    "7751152228": "NZOZ Medar Dariusz Skudlarski",
    "7252049943": "Lepszy Wzrok Zdzieszyńska i Zdzieszyński S.J.",
    "7311820105": "SPZOZ Mediksa",
    "7272307029": "Wojewódzki Specjalistyczny Szpital Im. Pirogowa w Łodzi",
    "8331315782": "NZOZ Eskulap S.C. Piotr Stachlewski, Tomasz Chejchman",
    "8272234437": "Gminny Ośrodek Zdrowia w Burzeninie",
    "7272843839": "Globalmedic Sp. z o.o. Sp. k.",
    "7291337758": "Medigab Marian Gabrysiak",
    "7312002403": "Gminny Ośrodek Zdrowia w Petrykozach",
    "7250003003": "Centrum Barbara Ciesielska w Spadku",
    "9591294669": "Gminny Ośrodek Zdrowia w Mniowie",
    "7491346265": "Iwona Szwach NZOZ \"Is-Med-Ps\"",
    "6612113721": "Rodzina Spółka z O.O.",
    "9591310606": "Samorządowy Ośrodek Zdrowia w Miedzianej Górze",
    "6641873185": "Powiatowy Zakład Opieki Zdrowotnej",
    "6551733279": "SPZOZ w Gnojnie",
    "7811648537": "Przychodnia Sołacz Sp. z o.o.",
    "8641962257": "NZOZ - Ośrodek Zdrowia Wilczyce Sp. z o.o.",
    "6562334028": "NZOZ Przychodnia Lekarska Multimed Sp. z o.o.",
    "6631669589": "SPZOZ w Skarżysku Kościelnym",
    "6571509042": "NZOZ Bilcza Bożena Domagała",
    "6581733769": "SPZOZ w Stąporkowie",
    "6561859510": "Gminny Zakład Opieki Zdrowotnej w Sobkowie",
    "8641583488": "Gminny Samodzielny ZPOZ w Obrazowie"
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
