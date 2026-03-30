import csv
import io
import unicodedata
import re

def normalize_name(name):
    if name is None: 
        return ""
    name = name.lower().strip()
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('utf-8')
    name = re.sub(r'[\"”“„'']', '', name) 
    name = re.sub(r'[^a-z0-9\s]', '', name) 
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# --- Step 1: Parse user facilities list from file ---
user_facilities = []
try:
    with open('user_facilities.csv', 'r', encoding='utf-8') as f:
        user_reader = csv.reader(f, delimiter=',')
        header = next(user_reader) 
        for row in user_reader:
            user_facilities.append({
                'Lp.': row[0],
                'NIP': row[1].strip(),
                'Nazwa placówki': row[2].strip(),
                'Normalized_Nazwa': normalize_name(row[2].strip())
            })
except FileNotFoundError:
    print("Błąd: Plik 'user_facilities.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku user_facilities.csv: {e}")
    exit()

# --- Step 2: Create NIP to ID_Księgi mapping from podmioty.csv ---
# Store a list of NIPs for each ID_Księgi.
# Also store original name from podmioty to help with matching
id_ksiegi_to_nip_map = {}
nip_to_id_ksiegi_map = {}

try:
    with open('podmioty.csv', 'r', encoding='utf-8') as f:
        csv_reader = csv.reader(f, delimiter=';')
        header = next(csv_reader)
        col_indices_podmioty = {
            'ID Księgi': header.index('ID Księgi'),
            'NIP': header.index('NIP'),
        }

        for row in csv_reader:
            id_ksiegi = row[col_indices_podmioty['ID Księgi']].strip()
            nip = row[col_indices_podmioty['NIP']].strip()

            if id_ksiegi != 'NULL':
                if id_ksiegi not in id_ksiegi_to_nip_map:
                    id_ksiegi_to_nip_map[id_ksiegi] = []
                if nip != 'NULL' and nip not in id_ksiegi_to_nip_map[id_ksiegi]:
                    id_ksiegi_to_nip_map[id_ksiegi].append(nip)
            
            if nip != 'NULL':
                if nip not in nip_to_id_ksiegi_map:
                    nip_to_id_ksiegi_map[nip] = []
                if id_ksiegi != 'NULL' and id_ksiegi not in nip_to_id_ksiegi_map[nip]:
                    nip_to_id_ksiegi_map[nip].append(id_ksiegi)

except FileNotFoundError:
    print("Błąd: Plik 'podmioty.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku podmioty.csv: {e}")
    exit()

# --- Step 3: Process zaklady.csv and match with user facilities ---
found_facilities = []
matched_user_items = set() # To track which user facilities have at least one match

try:
    with open('zaklady.csv', 'r', encoding='utf-8') as f:
        csv_reader = csv.reader(f, delimiter=';')
        header = next(csv_reader)
        col_indices_zaklady = {
            'ID Księgi': header.index('ID Księgi'),
            'Nazwa': header.index('Nazwa'),
            'Ulica': header.index('Ulica'),
            'Budynek': header.index('Budynek'),
            'Lokal': header.index('Lokal'),
            'Kod pocztowy': header.index('Kod pocztowy'),
            'Miejscowość': header.index('Miejscowość'),
            'Telefon': header.index('Telefon'),
            'Email': header.index('Email'),
            'Strona WWW': header.index('Strona WWW')
        }

        for row_idx, row in enumerate(csv_reader): # Add row_idx for debugging
            current_id_ksiegi = row[col_indices_zaklady['ID Księgi']].strip()
            current_nazwa_zakladu = row[col_indices_zaklady['Nazwa']].strip()
            normalized_current_nazwa_zakladu = normalize_name(current_nazwa_zakladu)

            possible_nips_for_zaklad = id_ksiegi_to_nip_map.get(current_id_ksiegi, [])

            for user_item in user_facilities:
                user_nip = user_item['NIP']
                user_normalized_name = user_item['Normalized_Nazwa']
                user_lp = user_item['Lp.']
                user_original_name = user_item['Nazwa placówki']

                # Match if user_nip is one of the possible NIPs for this zaklad
                # AND user_normalized_name is contained in normalized_current_nazwa_zakladu
                if user_nip in possible_nips_for_zaklad and user_normalized_name in normalized_current_nazwa_zakladu:
                    address_parts = [
                        row[col_indices_zaklady['Ulica']],
                        row[col_indices_zaklady['Budynek']],
                        row[col_indices_zaklady['Lokal']],
                        row[col_indices_zaklady['Kod pocztowy']],
                        row[col_indices_zaklady['Miejscowość']]
                    ]
                    address = " ".join([part for part in address_parts if part and part != 'NULL']).strip()

                    found_facilities.append({
                        'Lp.': user_lp,
                        'NIP': user_nip,
                        'Nazwa placówki (z listy użytkownika)': user_original_name,
                        'Nazwa placówki (z pliku)': current_nazwa_zakladu,
                        'Adres': address if address else 'Brak danych w bazie',
                        'Telefon': row[col_indices_zaklady['Telefon']].replace('NULL', 'Brak danych w bazie'),
                        'Email': row[col_indices_zaklady['Email']].replace('NULL', 'Brak danych w bazie'),
                        'Strona WWW': row[col_indices_zaklady['Strona WWW']].replace('NULL', 'Brak danych w bazie')
                    })
                    matched_user_items.add(user_lp) # Mark this user item as having found at least one match

except FileNotFoundError:
    print("Błąd: Plik 'zaklady.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku zaklady.csv: {e}")
    exit()

# --- Step 4: Format results and handle truly not found items ---

final_output_list = []

# Add found facilities, group by Lp. and then sort by Nazwa placówki (z pliku) for consistency
# Convert to a dictionary to group multiple matches under one Lp if needed, but for now just list all

# Sort found facilities by Lp.
found_facilities_sorted = sorted(found_facilities, key=lambda x: (int(x['Lp.']), x['Nazwa placówki (z pliku)'] if 'Nazwa placówki (z pliku)' in x else ''))

for res in found_facilities_sorted:
    final_output_list.append(f"**Lp.: {res['Lp.']}**")
    final_output_list.append(f"**NIP:** {res['NIP']}")
    final_output_list.append(f"**Nazwa placówki (z listy użytkownika):** {res['Nazwa placówki (z listy użytkownika)']}")
    final_output_list.append(f"**Nazwa placówki (z pliku):** {res['Nazwa placówki (z pliku)']}")
    final_output_list.append(f"**Adres:** {res['Adres']}")
    final_output_list.append(f"**Telefon:** {res['Telefon']}")
    final_output_list.append(f"**Email:** {res['Email']}")
    final_output_list.append(f"**Strona WWW:** {res['Strona WWW']}")
    final_output_list.append("---")

# Add truly not found facilities
truly_not_found_items = [
    item for item in user_facilities if item['Lp.'] not in matched_user_items
]

for item in sorted(truly_not_found_items, key=lambda x: int(x['Lp.'])):
    final_output_list.append(f"**Lp.: {item['Lp.']}**")
    final_output_list.append(f"**NIP:** {item['NIP']}")
    final_output_list.append(f"**Nazwa placówki:** {item['Nazwa placówki']}")
    final_output_list.append(f"**Adres:** Brak danych w bazie")
    final_output_list.append(f"**Telefon:** Brak danych w bazie")
    final_output_list.append(f"**Email:** Brak danych w bazie")
    final_output_list.append(f"**Strona WWW:** Brak danych w bazie")
    final_output_list.append("---")

# Write results to a file
with open('results.txt', 'w', encoding='utf-8') as outfile:
    outfile.write("\n".join(final_output_list))

print("Wyniki zostały zapisane do pliku results.txt")
