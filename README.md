# eComparatio
The software development starts at the point of the question, if we could achieve a extremely accurate alignment of a text diff. Maybe in a synoptic representation. It turned out that most text diff algorithm are not capable of putting out results of that strength. We wanted a output that could be uses as a starting point to enhancing the ideas of digital edition. We wanted something that lets the user focus on the text and to be aware of differences and their clustering among the base text, we wanted a traditional representation that could be found in scientific editions, for example a apparatus of variants (but with the space and interactive benefits of the screen live), we wanted a synoptic representation, straight aligned word by word. After we were able of building a comparison program (text diff, differential text analysis etc. etc.), that was able of suppling the needed results, we find out that comparing is much harder than expected. We started to add classes of reasons for the diff, the program has found (this classes are: ganzer Unterschied, Unterschied d. Gr.- und Kl.schreibung, Unterschied d. diakritischen Zeichen, Ligatur Unterschied, Umbruch Unterschied, Unterschied d. Interpunktion, Unterschied d. Zählung, Mehr als im anderen Text, Weniger als im anderen Text, Klammerung unterschiedlich, lateinisches U und V, Vertauschung Verdrehung, Verdrehung von Passagen, Mehr im Referenztext, einzelner Buchstabe, wenige Buchstaben anders, Trennung). To evaluate all this classes, and to generate all needed results, we were forced to give up most of the speed coming out of the efficient algorithms, moreover we were forced to evaluate possible errors, to align the most probable text positions, that means we added a optimization like part to the software. To integrate well with other projects we decided to deliver a primary URN output, to get references to eComparatio, and a CTS URN Input mechanism, to get text from CTS resources (and to refernece them).

# How to
Please look into the handbook (currently just in german language), technical specification, use cases, example installation, installation instruction and video tutorials on the documenting page:

http://85.214.109.153/~ecomparatio/

# Change Log / Software Version
Look into the change log for the pre-GitHub Development. This Github Repository starts with the version 1.0.

# Try not you can only loose
Try the open example installation (quick test cases included):

http://85.214.109.153/~ecomparatio/a/

# Who is Who
The program evolved from projects concerning digital editions at the University Leipzig, Chair of ancient history. It reached a development state that can be seen as stable software version. NAMEN???


