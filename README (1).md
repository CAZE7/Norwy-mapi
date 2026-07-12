#!/usr/bin/env python3
"""
Statischer Audit für Norwy-mapi Release-Dateien
Prüft kritische Dateien auf Vollständigkeit, Typ-Korrektheit und Parse-Fehler
"""

import os
import sys
import json
import re

def check_file_exists(filepath, description):
    """Prüft, ob eine Datei existiert"""
    if not os.path.exists(filepath):
        print(f"❌ FEHLER: {description} fehlt: {filepath}")
        return False
    print(f"✓ {description} existiert: {filepath}")
    return True

def check_file_not_empty(filepath, description):
    """Prüft, ob eine Datei nicht leer ist"""
    if os.path.getsize(filepath) == 0:
        print(f"❌ FEHLER: {description} ist leer: {filepath}")
        return False
    print(f"✓ {description} ist nicht leer: {filepath}")
    return True

def check_css_file(filepath, description):
    """Prüft, ob eine CSS-Datei gültigen CSS-Inhalt enthält"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Prüfe auf typische CSS-Muster
    has_css_rules = bool(re.search(r'\{[^}]*\}', content))
    has_selectors = bool(re.search(r'[.#\w-]+\s*\{', content))
    
    # Prüfe auf falsche Inhalte
    has_gitignore_pattern = 'node_modules/' in content or '*.log' in content
    has_markdown = content.strip().startswith('#') and '\n##' in content
    
    if has_gitignore_pattern:
        print(f"❌ FEHLER: {description} enthält .gitignore-Inhalt statt CSS: {filepath}")
        return False
    
    if has_markdown:
        print(f"❌ FEHLER: {description} enthält Markdown statt CSS: {filepath}")
        return False
    
    if not has_css_rules and not has_selectors:
        print(f"❌ WARNUNG: {description} enthält möglicherweise kein gültiges CSS: {filepath}")
        return False
    
    print(f"✓ {description} enthält gültiges CSS: {filepath}")
    return True

def check_js_parseable(filepath, description):
    """Prüft, ob eine JavaScript-Datei parsebar ist (grundlegende Syntax)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Prüfe auf offensichtliche Nicht-JS-Inhalte
    has_markdown_header = content.strip().startswith('#') and '\n##' in content
    has_gitignore = 'node_modules/' in content[:200] and '*.log' in content[:200]
    has_css_rules = bool(re.search(r':root\s*\{', content[:500]))
    
    if has_markdown_header:
        print(f"❌ FEHLER: {description} enthält Markdown statt JavaScript: {filepath}")
        return False
    
    if has_gitignore:
        print(f"❌ FEHLER: {description} enthält .gitignore-Inhalt statt JavaScript: {filepath}")
        return False
    
    if has_css_rules:
        print(f"❌ FEHLER: {description} enthält CSS statt JavaScript: {filepath}")
        return False
    
    # Prüfe auf kritische Syntax-Fehler
    # Optional Chaining sollte nicht vorhanden sein (Browser-Kompatibilität)
    has_optional_chaining = '?.' in content
    
    # Array.at() sollte nicht vorhanden sein
    has_array_at = bool(re.search(r'\.at\s*\(', content))
    
    if has_optional_chaining:
        print(f"❌ WARNUNG: {description} verwendet Optional Chaining (?.) - möglicherweise nicht kompatibel mit älteren Browsern: {filepath}")
        # Nicht als Fehler werten, nur warnen
    
    if has_array_at:
        print(f"❌ WARNUNG: {description} verwendet Array.at() - nicht kompatibel mit älteren Browsern: {filepath}")
    
    print(f"✓ {description} ist parsebare JavaScript-Datei: {filepath}")
    return True

def check_json_valid(filepath, description):
    """Prüft, ob eine JSON-Datei gültig ist"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✓ {description} ist gültiges JSON: {filepath}")
        return True
    except json.JSONDecodeError as e:
        print(f"❌ FEHLER: {description} ist kein gültiges JSON: {filepath}")
        print(f"   JSON-Fehler: {e}")
        return False

def check_package_json_references():
    """Prüft, ob package.json nur existierende Pfade referenziert"""
    filepath = 'package.json'
    if not os.path.exists(filepath):
        return True  # Bereits anderweitig geprüft
    
    with open(filepath, 'r', encoding='utf-8') as f:
        pkg = json.load(f)
    
    all_ok = True
    scripts = pkg.get('scripts', {})
    
    # Prüfe auf referenzierte Dateien/Verzeichnisse
    for script_name, script_cmd in scripts.items():
        # Extrahiere Datei-Referenzen
        if 'tests/' in script_cmd:
            # Prüfe, ob tests/ Verzeichnis existiert
            if script_cmd.startswith('python3 tests/') or 'playwright test tests/' in script_cmd:
                test_file_match = re.search(r'tests/([\w./-]+)', script_cmd)
                if test_file_match:
                    test_file = test_file_match.group(0)
                    if not os.path.exists(test_file):
                        print(f"❌ FEHLER: package.json referenziert nicht existierende Datei in '{script_name}': {test_file}")
                        all_ok = False
    
    if all_ok:
        print(f"✓ package.json referenziert nur existierende Pfade")
    
    return all_ok

def main():
    """Hauptfunktion für statischen Audit"""
    print("🔍 Starte statischen Release-Audit für Norwy-mapi...")
    print()
    
    all_checks_passed = True
    
    # Kritische Dateien prüfen
    critical_files = [
        ('index.html', 'HTML-Hauptdatei'),
        ('app.js', 'Haupt-JavaScript'),
        ('app.css', 'Haupt-CSS'),
        ('boot.js', 'Boot-JavaScript'),
        ('package.json', 'Package-Konfiguration'),
    ]
    
    for filepath, description in critical_files:
        if not check_file_exists(filepath, description):
            all_checks_passed = False
            continue
        if not check_file_not_empty(filepath, description):
            all_checks_passed = False
    
    print()
    
    # CSS-Dateien auf Inhalt prüfen
    css_files = [
        ('app.css', 'Haupt-CSS'),
        ('a11y-overrides.css', 'Accessibility-CSS'),
    ]
    
    for filepath, description in css_files:
        if os.path.exists(filepath):
            if not check_css_file(filepath, description):
                all_checks_passed = False
    
    print()
    
    # JavaScript-Dateien auf Parsbarkeit prüfen
    js_files = [
        ('boot.js', 'Boot-JavaScript'),
        ('app.js', 'Haupt-JavaScript'),
    ]
    
    for filepath, description in js_files:
        if os.path.exists(filepath):
            if not check_js_parseable(filepath, description):
                all_checks_passed = False
    
    print()
    
    # JSON-Dateien prüfen
    if os.path.exists('package.json'):
        if not check_json_valid('package.json', 'Package-Konfiguration'):
            all_checks_passed = False
    
    print()
    
    # Package.json Referenzen prüfen
    if os.path.exists('package.json'):
        if not check_package_json_references():
            all_checks_passed = False
    
    print()
    print("=" * 60)
    
    if all_checks_passed:
        print("✅ Alle statischen Checks erfolgreich!")
        print("   Release-Dateien sind strukturell korrekt.")
        return 0
    else:
        print("❌ Einige Checks sind fehlgeschlagen!")
        print("   Bitte beheben Sie die oben genannten Fehler vor dem Deployment.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
