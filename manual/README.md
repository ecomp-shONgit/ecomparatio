# Anleitung Inhalt
1. [eComparatio Darstellungen](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#ecomparatio-darstellungen) 
2. [eComparatio Eingabe](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#ecomparatio-eingabe) 
3. [eComparatio Ausgabe](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#ecomparatio-ausgabe) 
4. [eComparatio Customizing](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#ecomparatio-customizing) 
5. [Navigation](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#browser-bedienen) 
6. [Unterschiede / Anderes](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#browser-bedienen) 
7. [Browser bedienen](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#browser-bedienen) 
8. [About Help](https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#about-help)

 
# eComparatio Darstellungen

## Synopse (![ScreenShot](menu1.png))
Eine spaltenweise Darstellung der Vergleiche.

### Interaktionen
Die Synopse bietet keine versteckten Funktionen, darum soll an dieser Stelle auf die immer möglichen Interaktionen hingewiesen werden. Der Basistext, zu dem die Vergleiche angezeigt werden sollen, kann in der dritten Menüebene stets gewechselt werden. Der Basistext wird im Menü durch den Editor repräsentiert. In Bezug auf die Textinteraktion sind folgende *Features* möglich:
Man kann den Text scrollen, entweder mit den Peilen im Menü (![ScreenShot](menu192921.png)), oder mit der Tastenkombination Shift+Alt+Scroll(rad,pad). Gescrollt wird um die Einheit und ihre Anzahl, die zurzeit im Menü festgelegt sind. Um dies zu ändern, klicken Sie auf die "Steckdose" zwischen den Pfeilen. Mit der Angabe der Anzahl von Zeilen, die dargestellt werden, können Sie ebenfalls die Menge an dargestelltem Text variieren. Auch überall zur Verfügung steht das Einfärben / Auswählen von Unterschiedsarten. Das geschieht über den Menüpunkt (![ScreenShot](menu18.png)). Dabei verhält sich die Synopse so, dass die ausgewählten Unterschiede eingefärbt oder entfärbt werden.

## Detail-Darstellung (![ScreenShot](menu2.png))
Die Idee zu dieser Darstellung bestand darin, die Unterschiede zu den anderen Texten direkt in den
Referenztext einzutragen.

### Interaktion
Es besteht die Möglichkeit die Unterschiede sich einfärben zu lassen. Die Unterschiede verbergen sich innerhalb von in den Basistext gesetzten Kästchen. Verbirgt das Kästchen unter anderem einen Unterschied der ausgewählten Unterschiedsart, dann wird auf dem Kästchen ein kleines Dreieck angezeigt. Beim Klicken auf das Kästchen (![ScreenShot](inter1.png)) werden die Wörter angezeigt, die in den jeweiligen Vergleichstexten zum Unterschied geführt haben. Ein erneuerter Klick verbirgt die Anzeige wieder. Das Kästen, da schon angesehen, wird ab jetzt grau dargestellt. 

## Buch-Darstellung (![ScreenShot](menu3.png))
Die Buchdarstellung übernimmt die Ordnung des Variantenapparats.


### Interaktion
Die Darstellung bietet eine wesentliche Funktion: Klickt man entweder auf die Zeilennummer des Basistextes, oder auf die Zeilennummer im Variantenapparat, dann werden die korrespondierenden Zeilen markiert. Nutzt man die Funktion, die Unterschiede einzufärben, dann äußert sich dies nicht farblich, wie in den übrigen Darstellungen, sondern streicht diese aus dem Apparat oder nimmt die Unterschiede der gewählten Art hinzu.

## Matrix-Darstellung (![ScreenShot](menu4.png))
Die Matrixdarstellung ist eine Erweiterung der Synopse, bei der alle Texte in einer Matrix
gegenübergestellt werden.

### Interaktion
Die Matrix-Darstellung bietet, wie die horizontale Juxtaposition, die Möglichkeit die Unterschiede farblich zu markieren. Darüber hinaus, ist es möglich in dieser vollständigen Darstellung aller Vergleichsreihen das Auftauchen von Wörtern mit den Funktionen des Browsers darzustellen.

## Diagramm-Darstellung (![ScreenShot](menu5.png))
Diese Darstellung gibt den Vergleich in Diagrammen wieder.

### Interaktion
Zwei Diagramme und einen Tabelle werden für eine Teilvergleich angegeben. Dabei stellt die Tabelle die Auszählung der Unterschiedsklassen nach ihrer Häufigkeit dar. Absolute Häufigkeit und relative Häufigkeit bezogen auf die Länge des Vergleichstextes können abgelesen werden.

Das erste Diagramm ist ein Balkendiagramm der relativen Häufigkeit, nach Unterschiedsklassen sortiert. Hält man den Maus-Zeiger auf einen Balken, bekommt man den Editor des Textes angezeigt, wie auch im eComparatio Menü verwendet.

Das zweite Diagramm ist eine Visualisierung des Vergleichs. Dabei stellt jedes Kästchen ein Wort dar. Die Farben und Striche stellen die Bewertung auf ungleich und gleich dar. Das Halten des Maus-Zeigers über ein Kästchen zeigt das Wort, welches "dahinter steht". Die Darstellung kann als SVG exportiert werden, ein Button findet sich am unteren Rand der Darstellung.

## Interlinear-Darstellung (![ScreenShot](menu6.png))
Die Darstellung ist der Synopse natürlich ähnlich, nur werden die verglichenen Texte interlinear angeordnet.

### Interaktion
Eine synoptische Darstellung muss natürlich nicht die horizontale Gegenüberstellung anbieten, sondern kann die Wörter auch vertikal gegenüberstellen. Der Vorteil einer Übersichtlichkeit bleibt der Gleiche. Der Unterschied der beiden Darstellungen besteht darin, dass die eine mehr Text des Basistextes, mehr Text aber weniger Vergleichstexten gegenüberstellt (natürlich in Abhängigkeit von der Bildschirmgröße und Textanzahl überhaupt). Die vertikale Gegenüberstellung oder interlineare Organisation zeigt weniger Text jedoch noch genauer gegenübergestellt. Hier ist es wichtig Lücken und das entsprechende Mehr im anderen Text visuell praktikabel aufzubereiten. Die Interaktion mit der Darstellung beschränkt sich wiederum auf die farbliche Markierung der Unterschiede.

# eComparatio Eingabe
## Hinzufügen (![ScreenShot](menu12.png))
Die neuerliche Eingabe von Textreihen umfasst eine *autosave* Funktion. Sie werden beim Aufruf der *ADD* Funktion gefragt, ob Sie die gespeicherten Daten benutzen wollen. Falls Sie das tun wollen, wird aus dem Speicher geholt, was dort zuletzt gelandet ist. Landen kann etwas im Speicher im Sinne eines Abbildes Ihrer vormaligen Eingabe. Zu jeder Eingabe wird zu jeden vergangen 10 Sekunden ein solches Abbild erstellt und ersetzt das vorhandene Abbild. Auf diese Weise sind Ihre Arbeitsschritte bei Problemen nicht verloren. Benötigen Sie die *autosave* Daten nicht mehr, dann entscheiden Sie sich gegen eine Nutzung, wenn das Programm nachfragt. Implizit werden so die Daten wieder auf einen leeren Ausgangspunkt zurück geführt.

Die mit Stern gekennzeichneten Felder müssen eingegeben werden. Wichtig ist die Benennung der Textreihe, diese Benennung wird dann auch im Menü von eComparatio angezeigt. Zwei Werte verdienen zudem Erklärung: Der Synchronisierungsabstand muss der größte ihnen bekannten Textlücke entsprechen. Ist diese nicht bekannt, dann lassen Sie den Wert niedrig. Zeigt das Vergleichsergebnis, dass sich der Vergleich "verirrt hat", werden also deutlich gleiche Textstellen nicht richtig gegenübergestellt und dies auf ausgedehnteren Abschnitten des Textes. Dann sollten Sie diesen Wert erhöhen. Das Programm wird dann die richtigen Ergebnisse liefern. Dieser Wert ist für die Performance der Software kritisch, es ist nicht unbedingt ratsam, diesen massiv zu erhöhen, wenn nicht Texteinschübe großen Umfangs zwischen den Vergleichstexten zu erwarten sind.
Der nächste zu erklärende Wert ist jener der "Alternativen Sortierung". Wenn bei einem Vergleich nur festgestellt werden kann, dass die Texte ungleich sind, dann ist dies als sehr informationsarmer Zustand anzusehen. Dieser Programmzustand kennt, bezogen auf genau diese Vergleichsposition, nicht wie sich der Anschluss an gleiche Textstellen gestalten wird. Das Programm hat zwei Möglichkeiten, entweder einem sehr künstlichen Kriterium zu folgen und auf diese Weise die Texte zu vergleichen, oder einfach mit den nächsten beiden Wörtern weiterzumachen. Entsprechend ergeben sich andere Sortierungen der verglichenen Wörter im Bereich von Ungleichheit. 

Die Reihenfolge der Texte, wie diese im Menü erscheinen und wie sie in Bezug auf den Basistext dargestellt werden, legen Sie durch die Eingabereihenfolge fest. Dies ermöglicht chronologische und andere Ordnungsprinzipien, je nachdem welche Prinzipien Sie verfolgen wollen.

## Ändern (![ScreenShot](menu13.png))
Für das Editieren können Sie ebenfalls die *autosave* Funktion nutzen. Dazu wählen Sie, nachdem Sie die Textreihe zur Modifikation ausgewählt haben, *Ok* aus. Anschließend können Sie die Modifikation vornehmen. Die *autosave* Daten entsprechen Ihren Änderungen. Sollte ein Problem auftauchen und wollen Sie den Zustand der Texte fortsetzen, dann wählen Sie nicht erneut die Modifikation und die Textreihe sondern *ADD* und lassen sich die *autosave* Daten in ihr Formular übernehmen, wenn Sie gefragt werden. Für die Änderung gilt, was sonst auch für die neue Eingabe gilt. Wollen Sie Textreihen kopieren, dann können sie das ebenfalls über die Modifizieren Funktion bewerkstelligen, indem sie einfach einen anderen Namen für die Textreihe vergeben. Sie können nun die beiden Textreihen getrennt voneinander bearbeiten.

## Löschen (![ScreenShot](menu14.png))
Das Löschen lässt die Datenreihe aus dem eComparatio Menü verschwinden und macht die Speicherung wieder überschreibbar. Falls Ihnen einfallen sollte, dass Sie die Daten noch einmal benötigen, dann können diese wiederhergestellt werden, solange Sie den Cache des Browsers nicht löschen. Wie dies zu bewerkstelligen ist, entnehmen Sie bitte dem Abschnitt über den Browser.

## IN (![ScreenShot](menu15.png))
Im Abschnitt *JSON-/-Dump* wird erklärt, wie man einen Dump im JSON Format exportieren kann. Dies stellt gleichzeitig die Möglichkeit zum Austausch von Daten bei der Testversion dar, bzw. eine Möglichkeit zur Datensicherung. Wählt man nach der Betätigung des Buttons eine entsprechende *.json* eComparatio Datei aus, dann erhält man einen Eintrag im eComparatio Menü und die Texte und Vergleichsergebnisse werden in eComparatio angezeigt, wenn man diesen Menüeintrag auswählt. Die so importierte Textreihe kann anschließend erweitert und bearbeitet werden.

# eComparatio Ausgabe
Die Ausgaben stellen entweder Grundgerüste dar (XML HTML), dienen der Weiterverarbeitung und dem Austausch (LATEX, CSV, JSON) oder dienen der schnellen Ausgabe (PDF Drucken).

## LATEX (![ScreenShot](menu8.png))
Diese Ausgabe stellt ein komplettes LaTeX Dokument zur Verfügung, was in Abhängigkeit zur eigenen LaTeX Umgebung direkt oder nach Eingriffen kompiliert wird. Man kann aber lediglich die Tabellendarstellung der Synopse in eigene Dokumente übernehmen. Die mühevolle Herstellung solcher Tabellen soll erspart werden.

## JSON / Dump (![ScreenShot](menu10.png))
Diese Funktion erstellt ein persistentes Abbild der Textreihe. Man kann diese dann mit anderen Programmen weiterverarbeiten, zum Beispiel eigene graphische Ausgaben programmieren oder die Daten wieder in eComparatio eingeben.

## TEI (![ScreenShot](menu11.png))
Das ausgebbare TEI XML validiert und stellt ein Grundgerüst zur Annotation von Textzeugen und deren Reihendarstellung bereit. Die XML Dateien können als Ergebnis, oder als Ausgangspunkt betrachtet werden.

## Drucken (![ScreenShot](menu7.png))
Es gibt zwei Varianten des Druckens, einmal mittels des eComparatio Menüs, was einen Druck mit reduzierten Farben erlaubt und ein Drucken mittels der Browser Funktion Drucken. Die Einrichtung des Drucks geschieht wie allgemein bekannt.

## CSV (![ScreenShot](menu9.png))
Der Export von CSV Dateien, also durch Trenner separierte Dateien (Trenner können selbst eingestellt werden, siehe Abschnitt *eComparatio Customizing*) der Synopse, richtet sich an jene, die Ergebnisse gern in ihrer Textverarbeitung weiterverwenden wollen. 

## Digitale Edition (![ScreenShot](menu25.png))
Die neuerdings hinzugefügte Funktion, hier mit dem richtigen Index *digitale Edition* versehen, um die entsprechenden Zielsetzungen zu adressieren, erlaubt es, funktionsfähige *digitale Editionen* auszugeben. Dabei handelt es sich um HTML Ausgaben der Darstellungen von eComparatio, die jeweils ausgewählt wurden (außer der Diagrammdarstellung). Dabei ist das HTML rudimentär mit CSS Styling versehen und die geringste mögliche JS Interaktion ist beigefügt. Damit lassen sich die Ausgaben in andere Projekte der digitalen Edition integrieren oder eigenständig zu einer dieser fortführen.

# eComparatio Customizing (![ScreenShot](menu16.png))
Bedient man das entsprechende Menü, dann bekommt man eine Eingabemaske, welche die Legende der Unterschiedsklassen editierbar macht, es ermöglicht die Hervorhebung der Unterschiede mit anderen Farben zu gestalten. Zudem kann das Trenner-Zeichen für den CSV Datei Export festgelegt werden. Berücksichtigen Sie, dass die Kurzformen der Unterschiedsklassen im Text als Siglen auftauchen werd.

# Navigation (![ScreenShot](menu192921.png))
Die Navigation längerer Texte gelingt durch die Pfeiltasten im Menü. Ein Klick auf einen Pfeil setzt den Text um die angegebene Zeilenzahl weiter (Screen-Zeilen sind nicht die Zeilen Ihrer Ausgangsdokumente). Sehr hilfreich ist es, dass auch mit der Tastenkombination Shift + Alt + Scroll(rad) der Text navigiert werden kann. 

# Unterschiede / Anderes 
Die Darstellung der Unterschiedsklassen im Text kann "An" und "Aus" geschaltet werden. Dazu rufen Sie die Legende auf (![ScreenShot](menu18.png)), wählen aus und verbergen diese wieder.
Das Menü kann gezoomt werden, dazu verwenden Sie die Lupen (![ScreenShot](menu2223.png)).
Wenn es Probleme gibt, die Sie auch in älteren [Handbüchern](http://139.18.121.15/ecomparatio/) oder in den [Videotutorials](http://139.18.121.15/ecomparatio/) nicht klären können, dann benutzen Sie die Rückmeldefunktion (![ScreenShot](menu24.png)) (Sie können zwischen github und *email* als Rückmeldung wählen.).

# Browser bedienen
## Console
eComparatio in der hier angebotenen Version, bzw. der Online Testversion, ist eine JavaScript (JS) Anwendung. JavaScript ist eine Programmiersprache, die im Browser ausgeführt wird, also dem Programm, mit dem man des WWW Teils des Internets Ansichtig werden kann. Der Browser bietet die Möglichkeit, die Ausgaben von JS Programmen auf einer Console anzuzeigen, die durch eConmparatio genutzt wird. Die sinnvollen oder nützlichen Hinwiese oder einfache Rückmeldungen können dort abgelesen werden. Lassen Sie sich die Console anzeigen, dieser [Beschreibung](https://webmasters.stackexchange.com/questions/8525/how-do-i-open-the-javascript-console-in-different-browsers) können Sie dabei folgen.

## Vergleiche beobachten
Die Vergleiche lassen Sie wissen, ob noch einer arbeitet oder ob es einen Fehler gegeben hat. Beobachten Sie die Console und rufen Sie diese schon nach Ihrer Eingabe auf.

## Caches (Datenbanken)
Wollen Sie sich die Datenbanken von eComparatio ansehen, dann öffnen Sie die localStorage Ansicht, wie zum Beispiel in dieser [Beschreibung](https://stackoverflow.com/questions/9404813/how-to-view-or-edit-localstorage). Sie können hier Daten retten. 

# About Help
Die *Help* Funktion, die darin besteht mit dem Handbuch direkt verlinkt zu sein, kann durch Doppelklick auf die Menüpunkte angesprochen werden.
