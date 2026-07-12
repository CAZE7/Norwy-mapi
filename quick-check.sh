#!/bin/bash

# Quick Check Script für Norwy-mapi
# Führt alle wichtigen Checks vor einem Deployment durch

set -e

echo "🔍 Quick Check für Norwy-mapi v26.1"
echo "===================================="
echo ""

# 1. Statischer Audit
echo "📋 1. Statischer Audit..."
npm test
echo ""

# 2. Prüfe kritische Dateien auf Größe
echo "📏 2. Dateigrößen prüfen..."
echo "   app.js:    $(wc -c < app.js) Bytes"
echo "   app.css:   $(wc -c < app.css) Bytes"
echo "   boot.js:   $(wc -c < boot.js) Bytes"
echo ""

# 3. Prüfe auf problematische Syntax
echo "🔎 3. Syntax-Prüfung..."
if grep -q "\?\." boot.js app.js 2>/dev/null; then
    echo "   ⚠️  WARNUNG: Optional Chaining (?.) gefunden!"
    grep -n "\?\." boot.js app.js
else
    echo "   ✓ Kein Optional Chaining gefunden"
fi

if grep -q "\.at(" boot.js app.js 2>/dev/null; then
    echo "   ⚠️  WARNUNG: Array.at() gefunden!"
    grep -n "\.at(" boot.js app.js
else
    echo "   ✓ Kein Array.at() gefunden"
fi
echo ""

# 4. Git Status
echo "📦 4. Git Status..."
git status --short
echo ""

# 5. Empfehlungen
echo "✅ Quick Check abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "  1. Falls Warnungen: Beheben und erneut prüfen"
echo "  2. Server testen: npm run serve"
echo "  3. Browser-Tests: npm run test:e2e (optional)"
echo "  4. Deployment: git push origin main"
echo ""
