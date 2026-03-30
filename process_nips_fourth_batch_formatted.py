
import csv
import sys

sys.stdout.buffer.write("\ufeff".encode('utf-8')) # BOM for some Windows terminals

nip_to_provided_name = {
    "9542823435": "Silmedica Spółka z Ograniczoną Odpowiedzialnością",
    "6431620911": "Nzla \"Alfamed\" Niedźwiedzki, Pietrzycki, Trzaska. Lekarska Sp. Partnerska",
    "6412283588": "Lux-Med Spółka z Ograniczoną Odpowiedzialnością",
    "6342457154": "Urovita Spółka z Ograniczona Odpowiedzialnością",
    "4980236072": "Niepubliczny Zakład Opieki Zdrowotnej \"Moja Poradnia\" Sp. z o.o.",
    "6342616279": "Holsamed Spółka z Ograniczoną Odpowiedzialnością",
    "9541015153": "Amanda Lux Marek Papis",
    "6351836833": "Podmiot Leczniczy \"Nasza Poradnia\" Kalisz Dziuban Spółka Jawna",
    "6521019933": "Przybyła Majka Łucja NZOZ \"Simed\"",
    "5482286999": "Iwona Stępień, Bogdan Stępień Praktyka Grupowa Lekarzy S.C.",
    "5482659638": "Lekarska Praktyka Pierściec S.C. NZOZ",
    "5532514618": "Niepubliczny Zakład Opieki Zdrowotnej \"Vita\" T.Janota, B.Noga-Piecuch Spółka Jawna",
    "5482677240": "Salus Ustroń Spółka z Ograniczoną Odpowiedzialnością",
    "5771808027": "NZOZ \"Medicor\" Kowalski, Pilarski, Janas Spółka Jawna",
    "5771359842": "NZOZ Przychodnia Zdrowia \"Światowit\" - Jakubiec Adam",
    "5732577457": "Sanus Spółka z o. o.",
    "6272773096": "Centrum Medyczne Chorzów Stary Sp. z o.o.",
    "6391764005": "SP Zakład Lecznictwa Ambulatoryjnego z Siedzibą w Krzyżanowicach",
    "6332008041": "Salus Spółka z Ograniczoną Odpowiedzialnością",
    "6442868974": "Zakład Lecznictwa Ambulatoryjnego w Sosnowcu",
    "6492118494": "SPZOZ w Porębie",
    "6492297539": "Promed Łazy Spółka z Ograniczoną Odpowiedzialnością",
    "6492030753": "Medyk Daniel, Ciępka Spółka Jawna",
    "6442350160": "Deńca-Kuziemko Izabella NZOZ Praktyka Stomatologiczna, NZOZ \"Nasza Przychodnia\"",
    "6292077483": "Drzewiecka Wioletta NZOZ Duomedic Im. Św. Jana Pawła II",
    "9691226466": "Usługi Medyczne Pro-Med Spółka z Ograniczoną Odpowiedzialnością",
    "9691205518": "NZOZ Centrum Usług Medycznych Aa Remedium Awramienko Sp. J.",
    "9691258928": "Sano Sp. z o.o.",
    "6482772996": "Rw Medica Sp. z o.o.",
    "9371533209": "NZOZ Lekarz Rodzinny Andrzej Sieroń",
    "5361051381": "NZOZ Ber-Med. Wieliszew",
    "9562304388": "Świat Zdrowia Operator Medyczny Spółka z Ograniczoną Odpowiedzialnością", # Duplikat usunięty ręcznie, tylko jedna instancja.
    "9512367317": "Warszawskie Centrum Zdrowia Sp.Z o.o.",
    "1182232402": "Centrum Medyczne \"Fm Clinic\" Sp z o.o.",
    "7962274448": "NZOZ Lekarze Rodzinni \"Salus Aegroti\" Sp. z o.o.",
    "9710725467": "Dr Medyk",
    "5661019200": "Szpital Wojewódzki w Ciechanowie",
    "5321726683": "Primo Sp. z o.o.",
    "5711331691": "Ceryn Grzegorz Przychodnia Rodzinna 'Panaceum'",
    "1230955789": "Centrum Medyczne Puławska Spółka z Ograniczoną Odpowiedzialnością",
    "1130018111": "Lecznica Gocław Maria Kamela",
    "9512343110": "Centrum Medyczne Puławska Spółka z Ograniczoną Odpowiedzialnością Spółka Komandytowa",
    "5212953687": "Teragra S.C.",
    "5321743500": "NZOZ Przychodnia Medycyny Rodzinnej \"Centrum\" S.C.",
    "5361671675": "Niepubliczny Zakład Opieki Zdrowotnej \"Sanitas\" Sp. z o.o.",
    "9522209554": "Medical Dynamics Spółka z Ograniczoną Odpowiedzialnością",
    "7962309158": "Niepubliczny Zakład Opieki Zdrowotnej \"Śródmieście 1\" Sp. z o.o.",
    "6010008710": "Vita Medyk Spółka z Ograniczoną Odpowiedzialnością",
    "7971920764": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Goszczynie",
    "7581274457": "Przychodnia Lekarska \"Zdrowie\" Małgorzata Nawrot",
    "5222586517": "SPZOZ Bemowo- Włochy",
    "1251156869": "MSPZOZ Nr 1",
    "5291800439": "Niepubliczny Zakład Opieki Zdrowotnej Malvita Tuszyński i Wspólnicy Spółka Jawna",
    "7581091998": "NZOZ Przychodnia Lekarska w Rzekuniu Iwona Malinowska- Paździor",
    "7591447712": "Mak-Med Spółka z Ograniczoną Odpowiedzialnością",
    "5291613677": "Medicus S.C. Zofia Lipińska, Weronika Lipińska",
    "9511874710": "Samodzielny Zespół Publicznych Zakładów Lecznictwa Otwartego Warszawa-Mokotów",
    "1251165265": "Esculap Sp. z o.o.",
    "8111526610": "Samodzielny Publiczny Zakład Podstawowej Opieki Zdrowotnej w Lipsku",
    "5422004891": "Przychodnia Lekarza Rodzinnego Sylwia Figura-Mirońska",
    "1180059744": "Wojskowy Instytut Medycyny Lotniczej",
    "1131960020": "Samodzielny Zespół Publicznych Zakładów Lecznictwa Otwartego Warszawa Praga-Północ",
    "5361729127": "NZOZ \"Zdrowie\"",
    "5214004558": "Państwowy Instytut Medyczny MSWiA",
    "8121713654": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Gniewoszowie",
    "5340027058": "Zakład Opieki Zdrowotnej Przychodnia Lekarska Dom-Med",
    "7981480172": "Samorządowy Publiczny Zakład Opieki Zdrowotnej w Białobrzegach Sp. z o.o.",
    "5242748756": "Samodzielny Zespół Publicznych Zakładów Lecznictwa Otwartego Warszawa Białołęka Targówek",
    "8331406846": "Centrum Medyczne Polskie Zdrowie",
    "8221847147": "Samodzielny Zespół Publicznych Zakładów Lecznictwa Otwartego Warszawa Wesoła",
    "5681474060": "NZOZ Eskulap Sp. z o.o. Sp. K.",
    "9512349868": "Arnica Olszewski i Wspólnik",
    "7621348370": "Przychodnia Medyk Hanna Jachacy",
    "1130103905": "SZPZLO Warszawa Praga Południe",
    "1132045690": "Centrum Medyczne Med.-Expert Spółka z Ograniczoną Odpowiedzialnością",
    "7962956314": "Przychodnia Centrum Spółka z Ograniczoną Odpowiedzialnością",
    "1250931792": "Szpital Matki Bożej Nieustającej Pomocy w Wołominie",
    "7123229838": "Arion Med Spółka z Ograniczoną Odpowiedzialnością",
    "8221372974": "Beamed Przychodnia Lekarska Beata Bielecka",
    "5291468241": "Biovena Sp. z o.o",
    "5671034098": "Mikołajewska Jolanta, NZOZ Poradnia Rodzinna \"Eskulap\"",
    "5322043124": "Fam Medica Sp. z o.o.",
    "7743219768": "Centrum Medyczne Borowiczki Spółka z Ograniczoną Odpowiedzialnością",
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
    "8241545030": "Samodzielny Publiczny Zakład Opieki Zdrowotnej w Węgrowie",
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
