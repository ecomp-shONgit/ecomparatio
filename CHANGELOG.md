# Changelog
All notable changes to this project will be documented in this file.

The format is NEU: for new features/functions, Änderung: for something existing changes (also deprecation or deletion) and Fehler: for something worng working was fixed.

## bis 29.01.2018
- Neu: JSON import 
- Test: Browser Version Test Chrome / Chromium Issue
- Fehler: no bibvars Error - textnames array as fallback

## bis 23.10.2017
- Neu: Online Spielplatz einrichten, verschiedenen Beispiele (PLAIN WEBSITE und WORDPRESS INTEGRATION)
- Änderung: Code Bereinigung und Kommentare; Ziel: erster reduzierter Bruder von eComparatio full für github
- Neu: Screenshots machen vom Löschen der Daten
- Neu: Screemshots machen von der Console
- Änderung: Schriftart "intome" container - jetzt nur Helvetical (GentiumPlus nur auf mothership)
- Fehler: LATEX EXPORT CHECKEN - polytonic greek and some unicode chars not working
- Neu: Tastatur + Mousrad = Scrollen des Textes
- Fehler: ERROR ERROR ZEILEN SCROLLEN bei Synopse "zurück" ist Problem (prevStep wrong)
- Fehler: Firefox - JSON 404 aber kein Download
- Fehler: TEI parallel geht und dann aber kein Download - Firefox
- Neu: Latex display und Download, newlines
- Neu: export svg für die Diagramme
- Fehler: Bildschirmtastatur fehler (fkt fehlt ist in tools.js)
- Änderung: Darstellung der Eingabehilfe + Erklärungstext in der Eingabe
- Änderung: Menu Farbe bei der Eingabe 
- Neu: Back Button bei der Eingabe
- Fahler: Darstellungsfehler (inline alle Diagramme) bei Diagrammdarstellung Firefox
- Neu: free and open version
- Fehler: Einfärben in der Detaildarstellung
- Ändeurng: closediv function aus tools.js übernommen
- Änderung: "alledmenu" aus sameed9.js kam die falsche farbe für die spans

## bis 17.10.2017
- Neu: Verdrehung und Vertauschung in der Diagrammdarstellung duchprogrammieren
- Neu: Verdrehung!?! als Unterschiedsklasse hinzugefügt
- Änderung: alle html loads ajax in strings verwandeln!
- Neu: file a bug as email button - with email text prepared - test text and browser version (Eingabe)
- Neu: submitneweds has a data collection config now (returned as string)
- Fehler: online und offline edmod fixed
- Neu: moddes offline
- Fehler: upload broken - why (deprecaded array of textnames used )
- Fehler: SCHRITTWEITE WIRD Nicht mehr übernommen !!!
- Neu: JSON direkt download!!! mit onnline und offline version

## bis 03.10.2017
- Änderung: load von jquery ersetzen, und andere jquery functionen - 
- Fehler: chromium scroll function geht nicht mehr 
- Neu: Lesbarkeit der Menüpunkte und Lesbarkeit der Erklärungen im Menü (Zoom) 
- Änderung: Farbanpassung an die Uni CI - na so was!
- Neu: Darstellung von Lücken in den Vergleichstexten (wenn da etwas nicht ist)
- Änderung: Vereinfachen der Menüs und Tooltips anzeigen
- Änderung: Zoom am Bildschirm verändert die darstellung zu nachhaltig -- nun wird immer das emnü neu aufgebaut -- 
- Änderung: menü wächst durch das scrollen!!! hier wird irgendwo ungenau gemessen - gelöst mit overflow auto für alledmenu

## 2017 NEU
- Neu: JavaScript Version
- Änderung: Menü umgebaut
- Änderung: Online PHP
- Änderung: Offline rendering JS
- Neu: WebDB als Datenspeicher und Ergebnisspeicher
- Änderung: Depricated: Clone

## bis 04.05.2016
- Fehler: ind der Matrix-Darstellung das Einfärben des Gleichen
- Fehler: DIV-Kontainerlänge anpassen beim Übergang von Synops auf Matrix-Darstellung
- NEU: Matrix Darstellung, dessen Prinzip es ist alle Texte untereinander und dann die Vergleiche dazu horizontal abzubilden - aber mit Warnung, das es für lange Texte der browser zu langsam ist (Lösungsvorschläge, andere CSS Anwendung, verminderung der benutzen HTML Kontainer, Reduktion des Funktionsumfangs der Darstellung)
- NEU: Stemmer gr(iechisch) und la(tein) fertig, geht in die Testphase
- NEU: das Einziehen der langen Zeilen in der Synopse kann ausgestellt werden
- NEU: Video Tutorials
- ÄNDERUNG: das Archivieren muß im Javascript ins Menü geschrieben werden nicht im Python (zu unflexibel)
- NEU: mehrer gleich benannte Editornamen möglich - werden nun durchgezählt zur Unterscheidung
- FEHLER: Archiv.txt nicht vorhanden erzeugt Fehler
- FEHLER: Archivierungsfunktion für eComparatio Clone - falscher Pfad für archiv.txt
- NEU: color picker für die Anpassung der Darstellung der Unterschiede 
- ÄNDERUNG: vorher (wenn man was an den Darstellungsoptionen verändert hat, dann muß man en Projekt rendern), jetzt direkte Modifikation
- Änderung: Bildview nur für Anaximander - ist ganz raus genommen, automatische Layoutanalyse geht in die Testphase
- FEHLER: beim Laden der .js beim Wechseln vom Menü ++ zur normalen Darstellung
- ÄNDERUNG: Keine Leeren TEXTE schreiben! Die Aufrufe dürfen gar nicht erst aus JavaScript raus gehen!
- FEHLER: Wechsel von 100 auf 1 Zeile als Schritte und dann zurück gehen, da wird dann nur eine Zeile angezeigt
- ÄNDERUNG: mobile Version zum Downloaden funktioniert nicht im Clonemodus: Clonen und Mobile Version nur für komplette Installation (Sicherheitsaspekt)
- ÄNDERUNG: Reset und Aufräum-Funktion, Install in Python, Update Inastanzen script - überflüssig, wenn alles auf Javascript umgestellt ist; 
- NEU: Greek and Latin Letters Unterscheidung für LATEX und PERSEUS WORD Study tool link
- ÄNDERUNG: Unterschiede gleich einfärben

## bis 10.03.2016
- ÄNDERUNG: gleiches einfärben verbessert

## bis 01.02.2016
- NEU: Diagramme für die Textunterschiedsauszählung!
- FEHLER: einfärben des eComparatio Reiters in der reduzierten ansicht der Tools!!!
- FEHLER: URN setzen funkntioniert gerade nicht? - typographic messure kam zu spät - linewidth = 0
- ÄNDERUNG: Frabe der Unterschiede änderbar machen.
- FEHLER: Anaximander "Undefined" Problem - kam, wenn der Vergleichstext kürzer ist als der Reftext - vielleicht leeres Wort am Ende
- ÄNDERUNG: Verbesserung der Darstellung im Parallelview
- ÄNDERUNG: Reihenfolger der Texte verändern - DIE IST SO WIE MAN SIE EINGIBT (AUCH NACH DEM EDITIEREN), NUN WIRD AUCH DAS EDMENÜ richtig geordnet
- ÄNDERUNG: richtige Bezeichnung für MIAT- und M-Unterschiedslklassen 
- ÄNDERUNG: Klammersysteme sollen keine Rolle bei der Wortabstandsuntersuchung spielen
- FEHLER: spitze Klammern werden falsch behandelt - es ging um das Escape für HTML und XML
- FEHLER: Leerzeichen vor Komma fürht zu leerem Wort im Vergleich siehe "Maxime" in (instanzen/grzywacz)
- FEHLER: Unterstriche im Menü beim Anaximander Beispiel sind diese mit eingegeben
- FEHLER: overflow y für die reditorP DIV Boxen (geht nicht anders, jetzt ist da ja noch der Titel drin)
- ÄNDERUNG: in der Paralleldarstellung soll der Titel nicht nur der Editor angezeigt werden
- FEHLER: initialer Aufruf zu einer Editionsserie darf nicht auf eine archivierte gehen
- FEHLER: Vert bei Vertauschung; anaximander Wöhrle erster Fall - kai und archän -- VERT ist raus, muß im Metavergleich gemacht werden (Python, Vergleichsprogramm Version 8)
- FEHLER: letzte Zeile zu lang (Alkmaion)

## bis 30.09.2015
- NEU: Online gestell die Veröffentlichungen / reduziertes Frontend mit geringerem Menü (bezieht sich auf die ganzen Tools)
- ÄNDERUNG: Eingabe wieder verändert
- ÄNDERUNG: Screenshots erneuert
- FEHLER: Navigation am Ende der Texte in der Paralleldarstellung funktioniert nicht
- FEHLER: Unterstriche im Menü
- ÄNDERUNG: 0,0 soll 1,1 werden bei der urn in eComparatio (Screenshots neu machen)
- NEU: technische Beschreibung anfertigen
- ÄNDERUNG: Vergleichsfunktion erweitern, so das die Fehler aus Hänsel und Gretel gehandhabt werden (!!!!)

## bis 06.09.2015
- FEHLER: oberes Menü der Editierbutton verschwindet beim Wechsel vom Archiv
- NEU: Vertauschung / Verdrehung spezifiziert (Python)
- NEU: Weitersetzen der Suchposition im hypothetischen Fall verbessert (Python, Vergleichsprogramm Version Nummer 7)

## bis 25.08.2015
- Fehler: Bindestriche bei Hiparchus
- NEU: abgeterennter Bereich / Clonen von eComparatio
- Änderung: alledmenu neue Definition der Blöcke
- FEHLER: Richten der Speicherfehler
- ÄNDERUNG: Mobilisierung eComparatios - hier muß alles in zwei Ordner und eine Konfigurationsdatei, ZIP
- FEHLER: Unterer Balken manchmal vor dem Text (erstes Laden der Scripte)
- FEHLER: Anklicken des Unterschiedes im Buchview im Text sichtbar
- FEHLER: Auswahl der Unterschiede beim Ändern des Basistextes nicht zurücksetzen!!!
- FEHLER: Klammerung und Ligatur wird nicht zusammen angezeigt
- FEHLER: kryptsiche Zeichen nach dem Vergleich ausschalten
- ÄNDERUNG: totaler Escape aller Eingaben
- ÄNDERUNG: Klammern und alle unerlaubten Zeichen in der Eingabe checken oder im php entfernen
- FEHLER: Eingabe - uneindeutige Benennungen (Editoren, Editionsreihenbv)
- FEHLER: bei der Auszählung der oneed DIVs beim Hinzufügen von einer neuen Editionsreihe
- ÄNDERUNG: Unterschiedsmenü in der Länge definieren, damit sich das beim scrollen nicht einschiebt
- ÄNDERUNG: Alkmaoin muß Alkmaion sein
- ÄNDERUNG: edmenu die Namen sollen getrennt sein - ISt so, wenn die Daten aus den bibvars kommen

## bis 23.06.2015
- ÄNDERUNG: aus CTS Referenz die (online) Quelle herausnehmen
- NEU: Eingabe mittels CTS getpassage von Hand
- FEHLER: beim Textblättern im Buchview - mehrer Zeilen, da wird immer nur ein oben weggenommen!!!
- FEHLER: beim Referenzieren in tieferer Zeile, da rutscht das eingezeichnete Wort zu weit nach oben?
- NEU: CTS URN nun doch (herstellen der CTS URN und Anzeige, Eingabe via input und URL)
- NEU: ref overlay vorbereitet für offline/mobile version
- NEU: Gleiches einfärben / und umgekehrt
- ÄNDERUNG: header erneuert

## bis 13.05.2015
- NEU: bibvars (neues Speicherformat der bibliographischen Daten) in der referenz verwenden !!! - direkter Link!!! 
- NEU: im Referenzbereich persues Textsuche - unicode zu betacode
- FEHLER: bibvars letze klammer oft falsch bei deladd (php)
- FEHLER: undefined in alkmaion als letztes Wort???
- FEHLER: falsche Rückübertragung der Daten in die edit-Funktion durch php, sehr unschön, dadurch eine Störung der indices innerhalb einer Editionsserie

## bis 10.04.2015
- ÄNDERUNG: bib.js zurück in die Editierfunktion 
- ÄNDERUNG: bib.js im deladd.php
- ÄNDERUNG: Dartsellung der Quellenangabe: 
- NEU: Kommata und Punkte nicht aus der bibliographsichen Angabe entferenen
- NEU: Parallelansicht: Name des Editors und Titel der Edition, Belegstelle
- NEU: Verwednung der onlinesource Angabe innnerhalb der Referenzen
- NEU: Bibliographie als Javascript Dynvars speichern und dann anstelle der alten Sache verwenden
- ÄNDERUNG: Detail / Buchansicht Belegstelle auch darstellen
- ÄNDERUNG: Quellenagaben verbessern (erweitern der Quellenangab) (Feld für die Belegstelle)
- FEHLER: Parallelview schneidet manchmal letztes Wort ab
- FEHLER: D und I Klassifikation scheinen sind logisch nicht unabhängig
- ÄNDERUNG: Text Statistik Darstellung anpassen (alle Unterschiede werden ausgezählt)

## bis 30.03.2015
- FEHLER: beim Hinzufügen muss in der Bearbeitenfunktion der Hintergrund sich mit strecken
- ÄNDERUNG: fehlender Text am wirklichen einblenden (vorzeitig endender Referenz Text)
- FEHLER: beim Archivieren behoben (Menü musste neu geschrieben werden)
- FEHLER: zu viele Zeilen in der Paralleldarstellung
- NEU: Einfärben der neune Unterschiedsklasse dynamisch machen
- FEHLER: beim Wechseln von der Parallelansicht kommt die prozentuale Größe des Hintergrundes zu spät
- Vergleich: Einzelbuchstaben Ebene
- Vergleich: grammatische Regeln
- Vergleich: unterschiedliche Reihenfolge
- FEHLER: Vermehrfachungsdarstellungsfehler
- FEHLER: bei der Klassifizierung der Unterschiede, z.B. erstes Alkmion 
- FEHLER: Eingabemasken php Verarbeitung Fehler für add und bearbeiten behoben
- NEU: vert, getrennt, dist als Unterschiedsklassen
- NEU: neue Farben für M, MIAT, G
- neuer Vergleich (Python, Vergleichssoftware Version 6)
- FEHLER: Apparat flißt breit nach Wechsel aus der Parallel Ansicht.
- NEU: neue Unterschiedsklassen

## bis 02.03.2015
- FEHLER: \xa0 Leerzeichen aus latin1 behandelt (- Vergleich: Fehler nach totalem Unterschied, wenn das nächste Wort nicht gefunden wird - das wir nicht gespeichert - wurde dadurch mit verursacht)
- ÄNDERUNG: wortteil-[nummer]wortteil Trennung behandelt
- Vergleich: Bindestriche werden gelöscht und mit Leerzeichen zusammnengesetzt (Leerzeichen removal)
- NEU: "löschen" von Editionsreihen
- ÄNDERUNG: Texhintergrund muß sich in der größe anpassen - immer richtig (Detrail und Buchview)
- FEHLER: Buchview Unterschied an letzter Wortstelle / letzter Zeile kommt in die falsche Apparatzeile
- FEHLER: letztes Wort in der Buch- und Detail-Darstellung fehlt
- NEU: Buchview Unterschiede komplett aus dem Apparat ausblenden
- NEU: URN auf Titel, Editor und und und
- FEHLER: REFERENZ Fehlerhafte Javascript Abfrage - bei Gilgamesh und anderen
- ÄNDERUNG: rucken CSS verbessern!!!!
- FEHLER: parallelview INfo-Bereich richtige position
- ÄNDERUNG: Parallview Zeilenzahlen mit etwas mehr Abstand versehen

## bis 22.02.2015
- FEHLER: Darstellungsfehler erstes Wort URN
- ÄNDERUNG: Ist der Referenztext kürzer als der Vergleichstext - diesen trotzdem ganz anzeigen
- FEHLER: alledmenu Reiter verschwindet, beim unsynchronen Aufruf der Seite
- ÄNDERUNG: Textmenü zu klein
- ÄNDERUNG: Schreibfehler Referenzen "eCoparatio"
- NEU: Suche bei Persues / bei google / bei Suchmaschinen .../ Perseus und Google in Referenz verlinken (Suche in sepaeraten Tab starten)

## bis 22.01.2015
- ÄNDERUNG: Footer: Lehrstuhl FÜR alte Geschichte + offizelle Siete verlinken
- ÄNDERUNG: Footer: copyright weg, khk weg

## bis 08.01.2015
- NEU: Bild-View einfärben der Unterschiede
- FEHLER: Bild-View kai Fehler bei Diels ob ich das im Online-Code verursache (build wico) -- NEIN
- NEU: Bild-View erstes Styling
- NEU: Bild-View onclick zum Ausschnitt get a bigger region / Zeile
- NEU: Bild View Menu zum zeigen des Ganzen Bildes
- FEHLER: Darstellungsfehler Menü Buchview bei URN URL geht nicht mit
- NEU: Bibtex Bookreferenz / Bibtex Online Referenz
- ÄNDERUNG: Bild-Darstellung, Bild-View - Schriftgröße automatisch anpassen
- NEU: Bild-View Initial

## bis 22.12.2014
- FEHLER: zu lange Zeilen - Letzte Zeile Bug
- NEU: JSON REQUEST ermöglichen 
- ÄNDERUNG: FARBEN WIE im Entwurf
- ÄNDERUNG: Umstellen der Menüs
- NEU: TEI Export 
- NEU: LATEX Export 
- FEHLER: obere Meüs haben kein Mouse Over mehr

## bis 20.11.2014
- FEHLER: ein Diakritisches Zeichen war unbekannt 
- NEU: Zeilen in Paralleldarstellung zu lang,, Zeile verstecken, mit blauem Pfeil als Kennzeichnung der versteckten Zeile
- FEHLER: Bei der Text-Navigation nicht über die letzte Zeile hinaus und solche Fehler abfangen 
- FEHLER: Menü darf nicht nur Detail-View anzeigen, wenn Edition gewechselt wird, sondern den tatsächlichen View
- NEU: Einfärben bei URN
- NEU: Text-Navigation bei URN 
- FEHLER: txt Erschweinung bei Alkmaion ergründen 
- ÄNDERUNG: Farbe der Hervorherbung von Unterschieden 
- ÄNDERUNG: Umbruch am Ende des Textes einfügen, damit das Programm bis zum Ende auswertet 
- NEU: eigene Bezeichnung für Unterschiede 

## vor 11.2014
- Entwicklung des Vergleichsprogramms in mehreren Zyklen
- Weiterentwicklung des Prototypen
