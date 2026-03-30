#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import json

# Lista NIP-ów do wyszukania
nips_to_find = [
    "5751669574",  # NZOZ Przychodnia Lekarska "MEDYK" w Lublińcu
    "9492236290",  # NZOZ Przychodnia Lekarska Sp. z o.o., Kłomnice
    "6422702816",  # NZOZ AXIS Sp. z o.o., Rybnik
    "6422743258",  # NZOZ Kaczmarczyk, Rak i Partnerzy Spółka Partnerska
    "9691610348",  # Centrum Medyczne MEDAN Śliwa Rak Sp. J.
    "5691896271",  # ALFAMEDIC, Dzierzgowo
    "8371551804",  # VALMED S.C., Rybno
    "5271316284",  # ADKM Zdrowie Andrzej Osiński, Piastów
    "8111525632",  # SPZOZ Gminy Przyłęk, Przyłęk
    "5321662517",  # SPZZLO w Karczewie
]

# Wczytaj plik CSV
results = []
with open('C:\\Users\\aplik\\.openclaw\\workspace\\extracted_data\\podmioty.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file, delimiter=';')
    for row in reader:
        if row['NIP'] in nips_to_find:
            results.append({
                'NIP': row['NIP'],
                'Nazwa': row['Nazwa'],
                'Miejscowość': row['Miejscowość'],
                'Ulica': row['Ulica'],
                'Budynek': row['Budynek'],
                'Telefon': row['Telefon'],
                'Email': row['Email'],
                'Strona WWW': row['Strona WWW']
            })

# Zapisz wyniki do pliku JSON
with open('C:\\Users\\aplik\\.openclaw\\workspace\\nowe_wyniki_placowek.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Znaleziono {len(results)} placówek.")
print(json.dumps(results, ensure_ascii=False, indent=2))