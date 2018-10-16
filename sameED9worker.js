//**************************************************
// 2016/2017 ecomparatio Core JavaScript Version, Prof. Charlotte Schubert Alte Geschichte Leipzig
// this programm takes string input, representing versions of a digital text, and 
// compares them, than outputs JSON representations of the 
// results, planin text and a html menu involved in the browser display
// TOC:
// Section 1: Unicode handling
// Section 2: deleting as equality preprocessing
// Section 3: string equality checks
// Section 4: string proximity check
// Section 5: comparison and searching
// Section 5a: meta comparison for locating VERTAUSCHUNg UND DREHUNG
// Section 6: html menu (deprecated)
// Section 7: offline database communication
// Section 8: main function, data getting, data setting, control variables
//**************************************************

/*
GPLv3 copyrigth

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// using the strict statement, results in a stronger typing and scope checking done by the Interpreter 
"use strict"; 

//**************************************************
// Section 1 
// unicode related comparing and norming, handling of diacritics
//**************************************************

//array of unicode diacritics (relevant for polytonic greek)
var diacriticsunicode = new Array( "\u0313", "\u0314", "\u0300","\u0301", "\u00B4", "\u02CA", "\u02B9", "\u0342", "\u0308", "\u0304", "\u0306");
// precompiled regular expressions
var diacriticsunicodeRegExp = new Array( 
	new RegExp('\u{0313}', 'g'), 
	new RegExp("\u{0314}", 'g'), 
	new RegExp("\u{0300}", 'g'), 
	new RegExp("\u{0301}", 'g'), 
	new RegExp("\u{00B4}", 'g'), 
	new RegExp("\u{02CA}", 'g'), 
	new RegExp("\u{02B9}", 'g'), 
	new RegExp("\u{0342}", 'g'), 
	new RegExp("\u{0308}", 'g'), 
	new RegExp("\u{0304}", 'g'), 
	new RegExp("\u{0306}", 'g')
);

//function takes sting and normalform string (for example "NFD")
function sameuninorm( aword, wichnorm ){
    return aword.normalize( wichnorm ) 
}

//function takes string, splits it with jota subscriptum and joins ths string again using jota adscriptum
//split join is easy to use and seams to be one of the fastes methodes: https://jsperf.com/replace-all-vs-split-join/63
var regJotaSub = new RegExp('\u{0345}', 'g');
function iotasubiotoad( aword ){
 	return aword.split("\u0345").join("ι");
}

//function takes "one word"
function ohnediakritW( aword ){
    for( var dia in diacriticsunicodeRegExp ){
		aword = aword.replace( diacriticsunicodeRegExp[ dia ], "" );
	}
	return aword;
}

function capitali( astring ) {
    return astring.charAt(0).toUpperCase() + astring.slice(1).toLowerCase();
}

//precompiled regular expressions
var strClean1 = new RegExp('’', 'g');
var strClean2 = new RegExp('\'', 'g');
var strClean3 = new RegExp('᾽', 'g');
var strClean4 = new RegExp('´', 'g');
//function takes a string replaces some signs with regexp and oth
function nodiakinword( aword ){
    var spt = ((aword.replace(strClean1, "").replace(strClean2, "").replace(strClean3, "").replace(strClean4, "")).normalize( 'NFD' ));
    return iotasubiotoad( ohnediakritW( spt ) );
}

function normatext( text, wichnorm ){
    var spt = text.split( " " )
    for( var w = 0; w < spt.length; w++ ){
        var nw = sameuninorm( spt[ w ], wichnorm );
        spt[ w ] = nw;
    }
    return spt.join( " " )
}

//**************************************************
// Section 2: deleting things that could be not same in two texts
//**************************************************

//function take a string and deletes diacritical signes, ligatures, remaining interpunction, line breaks, capital letters to small ones, equalizes sigma at the end of greek words, and removes brakets; if the two text are not similar in this sense, they may be proximitly similar, or unequal
function delall( text ){
    if( doUVlatin ){ // convert u to v in classical latin text
        text = deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  text))))))));
    } else {
        text = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  text  ) ) ) ) ) ) );
    }
    return text;
}

//precompiled regular expressions of the relevant ligatures 
var regEstigma = new RegExp( '\u{03DA}', 'g' ); 
var regEstigmakl = new RegExp( '\u{03DB}', 'g' );
var regEomikonyplsi = new RegExp( 'Ȣ', 'g' );
var regEomikonyplsiK = new RegExp( 'ꙋ', 'g' );
var regEkai = new RegExp( 'ϗ', 'g' );
var regEl1 = new RegExp( '\u{0223}', 'g' );
var regEl2 = new RegExp( '\u{0222}', 'g' );
var regEl3 = new RegExp( '\u{03DB}', 'g' );
//function take a string and replaces all occorences of a regular expression
function delligaturen( text ){
    return text.replace( regEstigma, "στ").replace( regEstigmakl, "στ").replace(regEomikonyplsi, "ου").replace(regEomikonyplsiK, "ου").replace(regEkai, "καὶ").replace(regEl1, "\u039F\u03C5" ).replace(regEl2, "\u03BF\u03C5" ).replace( regEl3, "\u03C3\u03C4" );
}

//function takes string and splits it into words, than normalizes each word, joins the string again
function deldiak( text ){
    var spt = text.split( " " ); //seperate words
    for( var wi = 0; wi < spt.length; wi++ ){
        spt[ wi ] = nodiakinword( spt[ wi ] );
    }
    return  spt.join( " " );
}    

var regEdoppelP = new RegExp( ':', 'g' );
var regEeinfahP = new RegExp( '\\.', 'g' );
var regEkomma = new RegExp( ',', 'g' );
var regEsemiK = new RegExp( ';', 'g' );
var regEhochP = new RegExp( '·', 'g' );
var regEausr = new RegExp( '!', 'g' );
var regEfarge = new RegExp( '\\?', 'g' );
var regEan1 = new RegExp( '“', 'g' );
var regEan5 = new RegExp( '„', 'g' );
var regEan2 = new RegExp( '”', 'g' );
var regEan3 = new RegExp( '"', 'g' );
var regEan4 = new RegExp( "'", 'g' );
//function takes a string and replaces interpunction
function delinterp( text ){
    return text.replace(regEdoppelP, "").replace(regEeinfahP, "").replace(regEkomma, "").replace(regEsemiK, "").replace(regEhochP, "").replace(regEausr, "").replace(regEfarge, "").replace(regEan1, "").replace(regEan2, "").replace(regEan3, "").replace(regEan4, "").replace(regEan5, "");
}

var regEbr1 = new RegExp( "<br/>", 'g' );
var regEbr2 = new RegExp( "<br/>", 'g' );
//function takes string and replace html line breakes
function delumbrbine( text ){
    return text.replace(regEbr1, "").replace(regEbr2, "");
}

//...
function delgrkl( text ){
    return text.toLowerCase();
}

//function takes string and converts tailing sigma to inline sigma (greek lang)
var regEtailingsig = new RegExp( "ς", 'g' );
function sigmaistgleich( text ){
    return text.replace(regEtailingsig, "σ");
}

var regEkla1 = new RegExp( "\\(", 'g' );
var regEkla2 = new RegExp( "\\)", 'g' );
var regEkla3 = new RegExp( "\\{", 'g' );
var regEkla4 = new RegExp( "\\}", 'g' );
var regEkla5 = new RegExp( "\\[", 'g' );
var regEkla6 = new RegExp( "\\]", 'g' );
var regEkla7 = new RegExp( "\\<", 'g' );
var regEkla8 = new RegExp( "\\>", 'g' );
var regEkla9 = new RegExp( "⌈", 'g' );
var regEkla10 = new RegExp( "⌉", 'g' );
var regEkla11 = new RegExp( "‹", 'g' );
var regEkla12 = new RegExp( "›", 'g' );
var regEkla13 = new RegExp( "«", 'g' );
var regEkla14 = new RegExp( "»", 'g' );
//function take sstring and replaces the brakets
function delklammern( text ){
    return text.replace(regEkla1, "").replace(regEkla2, "").replace(regEkla3, "").replace(regEkla4,"").replace(regEkla5,"").replace(regEkla6,"").replace(regEkla7,"").replace(regEkla8,"").replace(regEkla9,"").replace(regEkla10,"").replace(regEkla11,"").replace(regEkla12,"").replace(regEkla13,"").replace(regEkla14,"");
}

var regEuv = new RegExp( "u", 'g' );
//function takes string and replaces u by v, used in classical latin texts
function deluv( text ){
    return text.replace( regEuv, "v" );
}

//**************************************************
// Section 3: equality checks
//if a check is true: 
// it means, that in a from all other influences cleaned text - the search string could not be found
// so the differenc (only remaining) is the checked one
// vorbereitung - check, ob es sich um total anders geschrieben/mehr/ weniger handelt
// ausgenommen checkall - is true if a diffence does not remain - so one could check in detail
//**************************************************

//function takes two strings a ref and a search string, if searchstring is contained in ref string it throws a True other wise False
var cheDiakDirectTT = [ ];
var cheDiakDirectRT = [ ];
function checkDiakDirect( wri, wti, inTorR ){
    /*var rps = deldiak( rp ); //clean from diacritics 
    var ssss = deldiak( sss );
    return rps.includes( ssss );
    */
    return (cheDiakDirectRT[ wri ] == cheDiakDirectTT[ wti ] )
}

//function applies all delet function instet of the removal od diacritics - returns true if strings does still not match - taht means that a string that is checked with checkall and could be considdered equal, s inequal because of the diacritics
var cheDiakTT = [ ];
var cheDiakRT = [ ];
function checkDiak( wri, wti, inTorR ){ 
    /*var rps = delklammern( sigmaistgleich( delgrkl( delinterp( delumbrbine( delligaturen( rp ) ) ) ) ) );
    var ssss = delklammern( sigmaistgleich( delgrkl( delinterp( delumbrbine( delligaturen( sss ) ) ) ) ) );
    
    return !rps.includes( ssss ); //
    */
    return !( cheDiakRT[ wri ] == cheDiakTT[ wti ] );
}

//functions applies all delet functions but the removal of ligatures, strings that are considered to be equal, will return a true, if they are unequal acording to the ligatures
var cheLigatRT = [ ];
var cheLigatTT = [ ];
function checkLigat( wri, wti, inTorR ){ //this is same to typographic differences
    //var ssss = delklammern( sigmaistgleich(delgrkl( delinterp( delumbrbine(  deldiak( sss ) )  ) ) ) );
    //var rps = delklammern( sigmaistgleich(delgrkl( delinterp( delumbrbine(  deldiak(  rp  ) )  ) ) ) );
    /*if( rps.indexOf( ssss ) == -1 ){
        return true;
    } else {
        return false;
    }*/
    //return !rps.includes( ssss );
    return !( cheLigatRT[ wri ] == cheLigatTT[ wti ] );
}

//function take string, calles delet fkt on the input, only interpunction remains, returns true if interpunction is reason for inequality
var cheInterpRT = [ ];
var cheInterpTT = [ ];
function checkInterp( wri, wti, inTorR ){
    /*var ssss = delklammern( sigmaistgleich( delgrkl( delligaturen( delumbrbine( deldiak( sss ) ) ) ) ) );
    var rps = delklammern( sigmaistgleich( delgrkl( delligaturen( delumbrbine(  deldiak( rp  ) ) ) ) ) );
    if( !rps.includes( ssss ) || !ssss.includes( rps ) ){
        return true;
    } else {
        return false;
    }*/
    return !( cheInterpRT[ wri ] == cheInterpTT[ wti ] );
}
  
//function takes two strings, calls delet functions, true if strings still unequal      
var cheUmbrRT = [ ];
var cheUmbrTT = [ ];
function checkUmbr( wri, wti, inTorR ){
    /*var ssss = delklammern( sigmaistgleich( delgrkl( delligaturen( delinterp( deldiak(  sss )  ) ) ) ) );
    var rps = delklammern( sigmaistgleich( delgrkl( delligaturen( delinterp(  deldiak(  rp  )  ) ) ) ) );
    return !rps.includes( ssss );*/
    return !( cheUmbrRT[ wri ] == cheUmbrTT[ wti ] );
}

//...
var chegrklRT = [ ];
var chegrklTT = [ ];
function checkgrkl( wri, wti, inTorR ){ //eine weiter Unterschiedsklasse ist groß und klein Schr.
    /*var ssss = delklammern( sigmaistgleich( delumbrbine( delligaturen( delinterp( deldiak( sss ) ) ) ) ) );
    var rps =  delklammern( sigmaistgleich( delumbrbine( delligaturen( delinterp( deldiak( rp  ) ) ) ) ) );
    return !rps.includes( ssss );*/
    return !( chegrklRT[ wri ] == chegrklTT[ wti ] );
}

//...
var cheklammernRT = [ ];
var cheklammernTT = [ ];
function checkklammern( wri, wti, inTorR ){
    /*var ssss = sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  sss  ) ) ) ) ) ); 
    var rps = sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  rp  ) ) ) ) ) ); 
    if( !rps.includes( ssss )  || !ssss.includes( rps ) ){
        return true; //wenn du alles außer klammern raus ist und ist ungleich
    } else {
        return false;
    }*/
    return !( cheklammernRT[ wri ] == cheklammernTT[ wti ] );
}

//...
var cheUVRT = [ ];
var cheUVTT = [ ];
function checkUV( wri, wti, inTorR ){
    /*var ssss = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(sss)))))));
    var rps = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(rp)))))));
    return !rps.includes( ssss );
    */
    return !( cheUVRT[ wri ] == cheUVTT[ wti ] );
}

//function takes two strings, removes everything (see delet functions) from it and returns true if they are nummericaly equal
var cheALLofRT = [];
var cheALLofTT = [];
function checkall( wri, wti, inTorR ){
    /*var ss = "0000"; //init value
    var rr = "1111";

    if( doUVlatin ){ // classical latin
        
        ss = deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  s ))))))));
        rr = deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  r ))))))));
    } else {
        ss = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  s  ) ) ) ) ) ) );
        rr = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  r  ) ) ) ) ) ) ); 
    }*/
    //return rr.includes( ss );
    return ( cheALLofRT[ wri ] == cheALLofTT[ wti ] );
}

//**************************************************
//Section 4: string proximity functions
//**************************************************

//function takes two strings and computes proximity messure after levenstein
function levenshtein( s1, s2 ){
    if( s1.length < s2.length ){
        return levenshtein(s2, s1);
    }
    
    var m = []; // is matrix
    var i;
    var j;
    if(s1.length === 0){ return s2.length; }
    if(s2.length === 0){ return s1.length; }
    // increment along the first column of each row
    for (i = 0; i <= s2.length; i++){
      m[i] = [i];
    }
    // increment each column in the first row
    for (j = 0; j <= s1.length; j++){
      m[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (i = 1; i <= s2.length; i++){
      for (j = 1; j <= s1.length; j++){
        if (s2.charAt(i-1) === s1.charAt(j-1)){
          m[i][j] = m[i-1][j-1];
        } else {
          m[i][j] = Math.min(m[i-1][j-1] + 1, // substitution
                    Math.min(m[i][j-1] + 1, // insertion
                    m[i-1][j] + 1)); // deletion
        }
      }
    }
    return m[s2.length][s1.length];
}

//function wraps levenstein dist
function wortabst( wr, wt ){
    return levenshtein( wr, wt );
}

//**************************************************
//Section 5: comparison and equality
//**************************************************
// naming the inequality
function welcheErsetzung( wri, wti, inTorR ){
    var diffdesc = "";
    if( doUVlatin && checkUV( wri, wti, inTorR ) ){
        diffdesc += " V"; //uv Probleme Latin Text
    } else {
        if( checkgrkl( wri, wti, inTorR ) ){
            diffdesc += " C"; //case, groß/klein 
        }
        if( checkInterp( wri, wti, inTorR ) ){
            diffdesc += " I"; //interpunktion
        }
        if( checkUmbr( wri, wti, inTorR ) ){
            diffdesc += " U"; //umbruch bindestrich
        }
        if( checkklammern( wri, wti, inTorR ) ){
            diffdesc += " K"; //klammern
        }
        if( checkLigat( wri, wti, inTorR ) ){
            diffdesc += " L"; //ligaturen 
        } else if( checkDiak( wri, wti, inTorR ) ){
            diffdesc += " D"; //diakritische zeichen / iota sub
        }
    }
    return diffdesc;
}

//function takes reference word -1, refrence word, rference word +1 and search word -1, search word and search word +1
// function returns array with bool (equal or not), a description string, a word dirstance
function gleich( wrvi, wri, wrni, wtvi, wti, wtni, inTorR ){ // is 0 for search in Ref and 1 for search in Tex
    /*
       Am gegebenen Ort des Vergleichs innerhalb der Textlisten.
        1 Übereinstimmung Lexeme
        2 Übereinstimmung durch Enthaltensein der Lexeme
        3 Übereinstimmung bei Zusammenziehung benachbarter Worte

        4 Übereinstimmung durch Ersetzung (Zeichen, Trennung, GrKl, grammatische Regeln, ...) bzw Löschen
        5 Enthaltensein der Ersetzungen ineinander - not done anymore
        6 Zusammenziehung der Ersetzungen

        7 Übereinstimmung durch Lemmatisierung - futur
        8 Übereinstimmung nach Wortabstand (Enthaltensein, Position der unterschiedlichen Buchstaben, gleich ist 
          ein Wort, wenn es einen Buchstaben oder einen Prozentsatz an Buchstaben unterschiedlich hat)
    */
    //ERGEBNISSE, i.e. Rückgabewerte, werden als Array zurück gegeben
    var gefunden = true;
    var diffdesc = "";
    var diffresuLOGIK = 1;

    //AUSWERTUNG DER VERGLEICHE
    //(A) NICHT ENTHALTENSEIN IDENTITÄT DUCH ----------------------------------------------
    
    //LEXEM EBENE - keine Suche
    var wr = r[ wri ];
    var wt = t[ wti ];
    if( wr == wt ){ 
        return [ gefunden, diffdesc, diffresuLOGIK ]; //Rückgabe des Ergebnsarrays: True, Keine Beschreibung, Abstand 1
    }
    
    
    //ERSETZUNGSEBEN
    if( checkall( wri, wti, inTorR )  ){ //zu 4; nach check all eine Übereinstimmung, bei gleiche Länge der Strings = Übereinstimmung 
        // unterschiedlich weil ...
        diffdesc = welcheErsetzung( wri, wti, inTorR ); // Auswahl der Gründe für die Ungleicheit
        return [gefunden, diffdesc, diffresuLOGIK]; // Rückgabe: True, Unterschiedsbeschreibung, Abstand 1
    }

    //ZUSAMMENZIEHUNG
    //Anmerkung: zusammengezogen = getrennt im Reftext! hier muß dann der andere Index weiter gesett werden,
    //es handelt sich um die Strings vor und nach den wr und wt strings
    var dwt  = cheALLofTT[ wti ];
    var dwtv = cheALLofTT[ wtvi ]; //Abzug aller Ungleichheitsgründe
    var dwtn = cheALLofTT[ wtni ]; //"
    var vWT = dwtv + dwt; //Strings zusammenziehen
    var WTn = dwt + dwtn; //Strings zusammenziehen
    var dwr  = cheALLofRT[ wri ];
    if( dwr == vWT ){ //zu 3, gefunden checken
        //console.log("GG vWR") 
        diffdesc = " vwt"; //Unterschiedsbeschreibung
        return [gefunden, diffdesc, 0.5]; // Rückgabe: True, Unterschiedsbeschreibung, Abstand 1
    } else if( dwr == WTn ){ //zu 3
        //console.log("GG WRn") 
        diffdesc = " wtn"; 
        return [gefunden, diffdesc, 0.5];
    }

    //WORTABSTAND
    //Wortabstand zu zusammengezogenen worten
    var wrOhneK = dwr;//DAS GEHT NICHT WEIL KLAMMER SIND DA DRIN -> cheklammernRT[ wri ]; // Referenzwort ohne Klammern
    if(!wrOhneK){
        wrOhneK = "111111111111";
    }
    var wtOhneK = dwt;//cheklammernTT[ wti ]; // Vergleichswort ohne Klammern
    if(!wtOhneK){
        wtOhneK = "111111111111";
    }
    var verglWA = wortabst( wrOhneK, wtOhneK ); //Wortabstand berechnen
    var ma = Math.max( wrOhneK.length, wtOhneK.length ); //Länge des längeren Wortes
    var mi = Math.min( wrOhneK.length, wtOhneK.length ); //Länge des kürzeren Wortes
    var lwr = wrOhneK.length; //Länge des Refrenzwortes
    if( lwr == 0 ){ //wegen Null Division
        lwr = 1;
    }
    var lwt = wtOhneK.length; //Länge des Vergleichswortes
    if( lwt == 0 ){ //wegen Null Division
        lwt = 1;
    }
    var proz = ( (verglWA/lwr) + (verglWA/lwt) )/2; //Wortabstand zu der Wortlänge, 
    var bborder = ( (mi/ma) * 0.5 ); //grenze ab der Wort als nach dem Abstand gleich gilt
    if( verglWA == 1 && mi > 3 ){ //ein Buchstabe anders, mi>3 - heißt dies wird nur für Worte ab der Länge 3 Buchstaben vorgeschlagen
        //console.log("GG Distanz") 
        diffdesc = " EiN"; 
        //diffresuLOGIK = proz
        return [gefunden, diffdesc, diffresuLOGIK];
    } else if( proz < bborder && mi > 3 ){ //prozentuale Gleiche, Einsatz der Grenze
        //console.log("GG Distanz Proz") 
        diffdesc = " dist"; 
        diffresuLOGIK = proz;
        return [gefunden, diffdesc, diffresuLOGIK];
    }

    //nee nicht gleich - unter allen Gesichtspunkten - das heißt: Suche
    gefunden = false;
    diffdesc = " T";
    diffresuLOGIK = 0;
    return [gefunden, diffdesc, diffresuLOGIK];
}

//function take three search words, a text array containing refrence words, a max indiex of it and a dirction value    
function suche( wrvi, wri, wrni, wtvi, wti, wtni, vz, inTorR ){
    //console.log("Suche zur Synchronisation der Vergleichsposition im Nächsten.")
    var sindex = null;
    var vdas = null;
    var das = null;
    var dasn = null;
    var maxindex = null;
    var indem = null;
    if( inTorR == 0 ){ // 
        vdas = wtvi;//(fix) dieses wt
        das = wti;
        dasn = wtni;
        indem = r;//(var)
        sindex = wri;
        maxindex = r.length;
    } else {
        vdas = wrvi;//(fix) dieses wt
        das = wri;
        dasn = wrni;
        indem = t;//(var)
        sindex = wti;
        maxindex = t.length;
    }
    var dosearch = true; //steuerung der While schleife
    var findex = -1; //Index in Text Array, an dem Übereinstimmung gefunden wurde
    var gret = [ true, "", ""]; //Array der Gleichheit, gibt zurück, wie die gleich() Funktion zurück gibt
    var allotherresults = []; //Seicherarray für alle Zwischen Ergebnisse der Suche, zu Kontrolle
    var count = 0; //wie viel worte wurden bereits duchsucht
    while( dosearch ){ //while schleife bewegt durch das Text Array
        var awo = indem[ sindex ]; // nimm Refrenzwort an Index

        if( !awo ){
            dosearch = false;
            break;
        }
        while( awo.length < 1 || awo == " " ){ //Leerstellen und Leerworte weitersetzen
            if( vz > 0 ){ // vz ist eine Richtungsangabe, ob vorwärts, oder rückwärts im Array gegangen wird
                sindex = sindex + 1; //vorwärts
            } else {
                sindex = sindex - 1; //oder rückwärts
            }
            if( sindex >= maxindex || sindex <= 0 || count >= border ){ //falls das Array zuende ist, oder genug worte vegleichen - bestimmt durch border (global)
                dosearch = false; // genereller Abbruch der Suche
                break; //Abbruch dieser While Schleife
            }
            awo = indem[ sindex ]; // nicht leeres Wort, ist Abbruch dieser while Schleife, sonst geht es weiter
        }
        if( awo.length < 1 || awo == " " || !awo  ){ //letzer Index erreicht im nicht leeres Wort suchen!!!
            dosearch = false;
            break;
        } // IST DAS NÖTIG SIEHT NICHT SO AUS

        //Auswahl der Worte vor und nach diesem Wort, aus Referenztext
        var sindexv = sindex;
        if( sindex > 0 ){
            sindexv = sindex-1; //hier vielleicht auch einen while schleife, dann auch in der suche()
        }
        var sindexn = sindex;
        if( sindex < maxindex ){
            sindexn = sindex+1;
        }
        
        //An der neu erreichten Stelle im Text
        var g = [null];
        if( inTorR == 0 ){ //wt fix
            g = gleich( sindexv, sindex, sindexn, vdas, das, dasn, inTorR ); //interface gets global REF and Texindex and a switch value for direktion of comparisson!!!
        } else { //wr fix
            g = gleich( vdas, das, dasn, sindexv, sindex, sindexn, inTorR );
        }
        //console.log("gg", g, "WR", wrv , wr, wrn,"DAS", vdas, das, dasn, "SINDEX", sindex)
        gret = g; // Rückgabewert merken; IST DAS NÖTIG
        //console.log(g, "wrv", wrv ,"wr", wr, "wrn", wrn, "vdas", vdas, "das", das, "dasn", dasn, "----", sindex, maxindex)
        if( g[0] ){ //remember the first find
            dosearch = false; // Abbruch der While Schleife
            findex = sindex; //merken des Rückgabe Index der Fundstelle
        } else { //erinnern der Vergleichsergebnisse
            allotherresults.push( [sindex, g]  );
            //check if at end else goon
            if( vz > 0 ){ //Richtung der Suche im Array
                if( sindex >= maxindex || count >= border ){ //MUSS HIER NICHT BORDER REIN, UM SUCHE EINZUDÄMMEN, WIR SUCHEN DOCH GERADE ALLES DURCH
                    dosearch = false; //Abbruch der Suche durch Ende des Arrays
                }
                sindex = sindex + 1; //index vorwärts setzen
            } else {
                if( sindex <= 0  || count >= border ){
                    dosearch = false; //Ende d Suche
                }
                sindex = sindex - 1; // rückwärts
            }
        }
        count += 1; //zählen der Anzahl der Worte, die durchsucht werden - nicht ganzer Text
    }
    return [ findex, gret, allotherresults ];
}

//function takes three search words, a text array of words, a start index, 
//a end index, an index of search word, and a seach text as array of words
//function compares between the next three equal possitiona of search word in reference text
//die beste Möglichkiet ist die Stelle an der die meisten gleichen Folgevergleiche zustande kommen
//gibt -1 für nicht gefunden und index des fundes sonst
function suchenVorwaerts( wrvi, wri, wrni, wtvi, wti, wtni, inTorR ){
    var vonderstelle = null;

    if( inTorR == 0 ){
        vonderstelle = wti;
    } else {
        vonderstelle = wri;
    }

    var c1 = suche( wrvi, wri, wrni, wtvi, wti, wtni, 1, inTorR ); //suche nächste Übereinstimmung
      
    var naechstes1  = c1[ 0 ]; //nächste übereinstimmende Stelle
    var anzahlgl1 = 0; // Speicher für die Azahl gleicher folgender Funde für diesen Fundindex
    var c2 = [-1]; //Init Array
    if( naechstes1 != -1 && naechstes1 != vonderstelle ){ //wenn es eine nächste Fundstelle gibt
        //hier kommt es auf den REF oder TEXT bezug an
        if( inTorR == 0 ){ //this wt in rt naechstesWTinR, iTex, 0
            anzahlgl1 = anzahlgleiche( naechstes1, wti, inTorR ); //zählen der gleichen folgenden vergleiche, erster Fund
            c2 = suche( naechstes1, naechstes1+1, naechstes1+2, wtvi, wti, wtni, 1, inTorR ); //zweiten Fund Suchen
        } else { //this wr in wt
            anzahlgl1 = anzahlgleiche( wri, naechstes1, inTorR ); //zählen der gleichen folgenden vergleiche, erster Fund
            c2 = suche( wrvi, wri, wrni, naechstes1, naechstes1+1, naechstes1+2, 1, inTorR ); 
        }
    }
    var naechstes2  = c2[0]; //zweite Fundstelle speichern
    var anzahlgl2 = 0; //fundindex2
    var c3 = [-1]; //init
    if( naechstes2 != -1 && naechstes2 != vonderstelle){
        //hier kommt es auf den REF oder TEXT bezug an
        if( inTorR == 0 ){ //this wt in rt naechstesWTinR, iTex, 0
            anzahlgl2 = anzahlgleiche( naechstes2, wti, inTorR ); //zählen der gleichen folgenden vergleiche, zweiter Fund
            c3 = suche( naechstes2, naechstes2+1, naechstes2+2, wtvi, wti, wtni, 1, inTorR ); //zweiten Fund Suchen
        } else { //this wr in wt
            anzahlgl2 = anzahlgleiche( wri, naechstes2, inTorR ); //zählen der gleichen folgenden vergleiche, zweiter Fund
            c3 = suche( wrvi, wri, wrni, naechstes2, naechstes2+1, naechstes2+2, 1, inTorR ); 
        }
    }
    var naechstes3  = c3[0];
    var anzahlgl3 = 0;
    if( naechstes3 != -1 && naechstes3 != vonderstelle ){
        //hier kommt es auf den REF oder TEXT bezug an
        if( inTorR == 0 ){ //this wt in rt naechstesWTinR, iTex, 0
            anzahlgl3 = anzahlgleiche( naechstes3, wti, inTorR ); //zählen der gleichen folgenden vergleiche, dritter Fund
        } else { //this wr in wt
            anzahlgl3 = anzahlgleiche( wri, naechstes3, inTorR ); //zählen der gleichen folgenden vergleiche, dritter Fund
        }
    }

    //SELEKTION der besser passenden Stelle, Nach Anzahl der folgenden Gleichheit
    if( degugggg ){
        if( inTorR == 0 ){
            console.log(vonderstelle, "IN REF:", "(c1)", naechstes1, r[naechstes1], anzahlgl1, "c2", naechstes2, r[naechstes2], anzahlgl2, "c3", naechstes3, r[naechstes3], anzahlgl3, "(t)", t[wti], );
        } else {
            console.log("IN TEXT:");
        }
        console.log( vonderstelle, "c1", naechstes1, anzahlgl1, "c2", naechstes2, anzahlgl2, "c3", naechstes3, anzahlgl3 );
    }

    if( anzahlgl1 > anzahlgl2 && anzahlgl1 > anzahlgl3 ){
        if( degugggg ){
            console.log("c1");
        }
        return [ c1[0], anzahlgl1 ];
    } else if( anzahlgl2 > anzahlgl1 && anzahlgl2 > anzahlgl3 ){
        if( degugggg ){
            console.log("c2");
        }
        return [ c2[0], anzahlgl2 ];
    } else if( anzahlgl3 > anzahlgl1 && anzahlgl3 > anzahlgl2 ){
        if( degugggg ){
            console.log("c3");
        }
        return [ c3[0], anzahlgl3 ];
    } else {
        if( anzahlgl1 == anzahlgl2 ){
            if( degugggg ){
                console.log("c1");
            }
            return [ c1[0], anzahlgl1 ];
        } else if( anzahlgl1 == anzahlgl3 ){
            if( degugggg ){
                console.log("c1");
            }
            return [ c1[0], anzahlgl1 ];
        } else if( anzahlgl2 == anzahlgl3 ){
            if( degugggg ){
                console.log("c2");
            }
            return [ c2[0], anzahlgl2 ];
        } else {
            if( degugggg ){
                console.log("c1");
            }
            return [ c1[0], anzahlgl1 ];
        }
    }
	//suche alle(?) vorkommen und bewerte diese noch. die bewertung erfolgt, wie beim wandern des vergleichs
    //return suche(vdas, das, dasn, indem, vonderstelle, maxindex, 1)
}

//synonyme function für gleich(), jedoch zählt sie nur gleiche ergebnisse, keine Suche und
function anzahlgleiche( wri, wti, inTorR ){
    /*Anmerkung: Das wird verwendet um zwischen den zwei Möglichkeiten, quasis vertikal, den Index des einen oder des anderen Textes weiter zu setzen. Das ist richtig. Genau genommen könnte diese Funktion aber auch eingesetzt werden, um innerhalb eines Textes die aufeinderfolgenden möglichen Fundstellen untereinander zu bewerten. Das würde dann auch ermöglichen, daß das ähnliche aufeinanderfolgende Stellen richtig zugeordnet werden. Das muß dann in der Funktion gemacht werden, die nach der nächsten Fundstelle Sucht. Oh und ich glaube, die Bewegung des Vergleichs mitgedacht, muß man das kontrollieren, wenn man eine Übereinstimmung hat. Gibt es eine Stelle, wo diese Übereinstimmung zu einer noch größeren globen Übereinstimmung führt?!!! Alter, so isses. Das erfüllt die Logik des Vergleichs und die Logik der Bewegung. Man man man.*/
    var ir = wri;
    var it = wti;
    
    
    var dovergleich = true;
    var howmuchgleiche = 0;
    var lt = t.length - 1;
    var lr = r.length - 1;
    var count = 0;
    
    while( dovergleich ){
        if( ir < lr && it < lt ){ // index checken sonst abbruch (in else)
            //vergleiche
            //console.log("anzgl", r[ir], t[it]);
            var e = gleich( ir-1, ir, ir+1, it-1, it, it+1, inTorR );
            if( e[0] ){ //übereinstimmung
                howmuchgleiche += 1; //dann zähle diese Gleichheit
            } else { // keine übereinstimmung - abbruch  - das könnte man auch weg lassen und ein Verhältnis aus übereinstimmung und nicht zurücg geben
                dovergleich = false;
            }
            if( count >= border ){ //abbruch auch nach Anzahl border (blobal definiert)
                dovergleich = false;
            }
            count += 1;
            ir += 1;
            it += 1;
        } else {
            dovergleich = false;
        }
    }
    return howmuchgleiche;
}

/*
Anmerkung 1: Es ist irgendwie so, wie mit den Bildern von Buchseiten in denen ein Mensch Text erkennen kann. Mit dem rechner kontrolliert man dei Abbildungen von Abdrücken. Die Verbindung zum Buchstaben ist eine Behauptung bestimmten / graduell bestimmbaren Grades. So ist es auch mit dem Vergleich. Man Vergleicht Codezeichen, nicht unbedingt das, was man unter einem lesbaren Zeichen versteht. Nehmen wir an ein Spaßvogel hätte ein einfaches Wort in zwei Varianten eingetippt, nämlich einmal mit Akzenten über jedem Buchstaben. Das hätte für die Levinsteindistanz zwei mögliche Folgen - in Abhängigkeit von der Unicode Codierungs Normalform - bei vollständig kombnierenden Codezeichen, müßte die Distanz maximal werden und bei nicht kombinierenden Codezeichen sind genau doppelt so viele Codezeichen im Wort, so daß die Distanz bei der hälfte der größeren Länge ankommen müßte, denn je einmal muß hoch gezählt werden (je nach Implementierung der Distanz)! Wenn man etwas genau wissen will, dann muß man es auch als logischen Fall in einer Software behandeln, man erfährt nichts ohne zu fragen. Alle indirekten Maße habe ihre Grenzen.

Anmerkung 2: Bitte hören sie auf meinen Wortlaut. Ich vergleiche keine Texte, sondern Worte. Mein Annahme besteht in der grundsätzlichen Ähnlichkeit der Organisationform der Worte, so das sich eine Suche innerhalb der Wortlist, die der sequnezellen Materialisierung von dem was man Text nennet, entspricht, anbietet. 

Anmerkung 3: Zu den altgriechischen Texten: Ich habe wieder und wieder ihre Struktur gelesen, Lettern und das zwischen Leerzeichen und das in Beziehung zu anderem zwischen Leerzeichen. Aber es ist eine Struktur über die man nur der Stuktur nach sprechen kann. Es ist eine gedankliche Sackgasse. Strukturlogik, den Zahlen nach, ist keine vermittelbare Erkenntnis. Es ist so gut wie nichts.

Anmerkung 4: Ich schätze die Imperfektion, der Bruch der Ebenmäßigkeit, der Gleiche und Fortführung. Erkennbar ist etwas nicht am Gleichen, sondern am Bruch, dessen Imperfektion sich in seiner Antisymetrie und dessen Steigerung der Unsymetrie.

Anmerkung 5: Die Erweiterung des Gleichheitsbegriffs, so das in der Vorstellung Differenzen verschiedener Art in der Gleichheit aufgehen können, eine bestimmte Gleichheit darstellen, eröffnet den Blick auf die Natur des Textes, der Sequnez viel mehr. Die Aufeinanderfolge von Worten wird das definitorische Element von UNgleichheit. Die Lage zueinander bestimmt die Ungleichheit.

Anmerkung 6: Es ist so, das es beim Vergleich zweier Dinge, die vielzählig sind und in sich gleiche und ungleiche Folgen bergen, zu sicheren und unsicheren Ergebnissen kommt. Die sicheren Ergebnisse sind, wenn zwei Teile der Dinge an dieser Stelle als bezülich der Bestimmung des Vergleichs gleich sind. Wenn sie nicht gleich sind, dann könnte eins der Teile im anderen Ding nicht mehr vorkommen. Das ist dann mit Sichereheit ein Unterschied, der aus einem Mehr und Anders erwächst. Ein unsicherer Fall ist, wenn etwas an dieser Stelle nicht gleich ist, aber als Teil im Ding trotzdem existiert. Es kann dann nicht gewußt werden ist es trotzdem Mehr, gehört es an einen anderen Ort oder kann der Unterschied auf eine dritte Weise zustandekommmen? 
*/

//function takes a reference text array of words, a index of this array, a search text arry of words and a index of this array, a result array
var r = [];
var t = [];
function differentiellervergleich3( rin, ri, tin, ti ){
    r = rin;
    t = tin;
    var comparatio = [ ]; //result array
    comparatio.push( [ri, ti] ); //first in comparatio array is index of ref and text in altextarray

    var iRef = 0; //lauf index refernce text
    var iTex = 0; //lauf index  Vergleichstext
    var maxiRef = r.length - 1;
    var maxiTex = t.length - 1;
    var goon = true; //while steuerung
    //speicher für die 
    var naechstesWTinRprev = 0;
    var vorherigesWTinRprev = 0;
    var naechstesWRinTprev = 0;
    var vorherigesWRinTprev = 0;

    while( goon ){
        //LEERE Stellen//
        //////////////////////////////
        var wr = r[ iRef ]; //refrence wort herausnehmen
        while( (wr.length < 1 || wr == " " || wr == "   "  ) && iRef < maxiRef ){
            iRef += 1; //Index des Refrenztextes weitersetzen, wenn wort leer
            wr = r[ iRef ]; //neu holen
        }
        var wrv = "";
        var wrvi = iRef-1;
        if( iRef > 0 ){ //wenn vergleich schon an min 2. Stelle
            wrv = r[ iRef-1 ]; //refrenzwort vorher
        }
        var wrn = "";
        var wrni = iRef+1;
        if( iRef < maxiRef ){ // wenn Vergleich noch nicht an letzer Stelle
            wrn = r[ iRef+1 ]; //refrenzwort nachher
        }
        ////////
        var wt = t[ iTex ]; //wort aus dem Vergleichstext holen
        while( (wt.length < 1 || wt == " " || wt == "   " ) && iTex < maxiTex){
            iTex += 1;
            wt = t[ iTex ]; 
        }
        var wtv = "";
        var wtvi = iTex-1;
        if( iTex > 0 ){
            wtv = t[ iTex-1 ]; //vergleichswort vorher
        }
        var wtn = "";
        var wtni = iTex+1;
        if(iTex < maxiTex){
            wtn = t[ iTex+1 ]; //vergleichswort nachher
        }

        //GLEICHHEIT 
        var g = gleich( wrvi, iRef, wrni, wtvi, iTex, wtni, 0 ); //vergleichsergebnis dieser worte
        var pushIREF = iRef; //speichern der indices
        var pushITEX = iTex; //speichern index
        var pushDIFFDESC = g[1]; //speichern des Ergebnisses
        
        //Bewertung des Vergleichsergebnisses
        if( g[0] ){ //GLEICHHEIT
            if( degugggg ){
                console.log( "gleich", "WR", wrv ,wr, wrn, iRef, "WT", wtv, wt, wtn, iTex, g );
            }
            //hier muß unächst mal ausgewertet werden, wie genau das gefunden wurde
            //if(pushDIFFDESC.find( "wtn", 0, len( pushDIFFDESC ) ) != -1): //in???
            if( pushDIFFDESC.indexOf( "wtn" ) != -1 ){ //be zusammenziehung nur Vergleichstext weiter setzen
                iTex += 1;
            } else { //bei andere Gleichheit beide indices weiter setzen
                /* hie rmuesste ich eigentlich noch kontrollieren, ob es noch einen besser assenden fall gibt - zum BeispielSatz: was ich weiß. Was mich freut - es wird "was" aus "was mich freut" gesucht - dann stimmt das mit GrKl Unterschied */
                iRef += 1;
                iTex += 1;
            }
        } else {
            
            //SUCHE bester gleichheit
            var a = suchenVorwaerts( wrvi, iRef, wrni, wtvi, iTex, wtni, 0 ); //bestes nächstes auftreten wt in wr
            //benennen der Ergebnisse der Suche
            var naechstesWTinR  = a[0];
            var anzahlglWTinR = a[1];
            var c = suchenVorwaerts( wrvi, iRef, wrni, wtvi, iTex, wtni, 1 ); //bestes nächstes auftreten wt in wr
            var naechstesWRinT  = c[0];
            var anzahlglWRinT = c[1];
            if( degugggg ){
                console.log( "ungleich", "WR", wrv ,wr, wrn, iRef, "WT", wtv, wt, wtn, iTex, g );
                console.log( "suche wt",  wt, "an Stelle in r ", iRef, a );
                console.log( "suche wr", wr, "an Stelle in t ", iTex, c );
            }
            //0gefdittevergleichsfunktion
            if( naechstesWTinR == -1 && naechstesWRinT == -1 ){ //weder wr tritt in T auf, noch wt in R
                iRef += 1; // beide indices weiter setzen
                iTex += 1;
                pushDIFFDESC = " M mIAT";
            
            //WT nicht mehr gefunden
            } else if( naechstesWTinR == -1 && naechstesWRinT != -1  ){
                iTex += 1; //nur den vergleichstext weiter setzen
                pushDIFFDESC = " M";
            //WR nicht mehr gefunden
            } else if( naechstesWTinR != -1 && naechstesWRinT == -1  ){
                iRef += 1; //nur den refrenztext weiter setzen
                pushDIFFDESC = " mIAT";
            //zusammenfassung anderer ungleichheit mit G
            } else {
                //ermitteln der folgenden gleichheit an der neu gefundenen stelle, wenn wr in T und wt in R gefunden
                //index weiter setzen, aber wie:
                //var anzahlglWTinR = anzahlgleiche( naechstesWTinR, iTex, 0 );
                //var anzahlglWRinT = anzahlgleiche( iRef, naechstesWRinT, 1 );

                if(degugggg){
                    console.log( "anzahlglWTinR", anzahlglWTinR, naechstesWTinR,  r[naechstesWTinR],"anzahlglWRinT", anzahlglWRinT, naechstesWRinT, t[naechstesWRinT] );
                }

                if( anzahlglWTinR > anzahlglWRinT ){ //anzahl gleiches bei wt in R größe, dann setz index des reference textes weiter
                    iRef += 1; 
                } else if( anzahlglWTinR < anzahlglWRinT ){//anzahl gleiche bei wr in T größer, dann setz lieber den vergleichstext weiter
                    iTex += 1;  
                } else {// gleiche anzahl von Gleichheit
                    if( naechstesWTinR < naechstesWRinT && !altSorting){ //passe die indeces wieder einander an (sollte da snciht der kleinere Schritt sein)
                        iRef += 1;
                    } else if( naechstesWTinR > naechstesWRinT && !altSorting){
                        iTex += 1;
                    } else {
                        iRef += 1; //wenn man keine Entscheidung treffen kann, dann muß aber wieter gesetzt werden, ergibt auch eine alternative Sortierung
                        iTex += 1;
                    }
                }

                //2 bennenung
                pushDIFFDESC += " T";
            }
        }
        if(degugggg){
            console.log("Erg: ", [ pushITEX, pushIREF, pushDIFFDESC, g[2] ]);
        }

        if( pushITEX == comparatio[ comparatio.length-1 ][0] && comparatio.length > 2){
            comparatio.pop();
        }
        comparatio.push( [ pushITEX, pushIREF, pushDIFFDESC, g[2] ] );

        //Index Kontrolle zum while Beenden
        if( iRef > maxiRef || iTex > maxiTex ){
            goon = false;
        }
    } //end while
    console.log("Differentieller Vergleich beendet.", ri, ti, iRef, maxiRef, iTex, maxiTex);
    //console.log(comparatio)
    
    return comparatio;
}

var border = 20;
var degugggg = false; 
var doUVlatin = false;
var altSorting = false; //comparisson sorting
function EV(e){ //wrapper for the central function - just to keep it celan from worker specific operations 
    //setting border and getting data from event
    degugggg = e.data.degugggg;
    if(degugggg){
        console.log("in worker");
    }
    border = e.data.border;
    doUVlatin = e.data.doUVlatin;
    altSorting = e.data.altSorting;
    //data preparation ONCE ****************************************************
    //even better to do it in the calling thread, but that would result in a 
    //strong restructuring of the program, first do it in the thread

    //claer prev array - worker is used more than once
    
    cheALLofRT = [ ]; 
    cheDiakDirectRT = [ ];
    cheDiakRT = [ ];
    cheLigatRT = [ ];
    cheInterpRT = [ ];
    cheUmbrRT = [ ];
    chegrklRT = [ ];
    cheklammernRT = [ ];
    cheUVRT = [ ];
    //itt the ref data
    for( var inTHE in e.data.r ){
            var itemin = e.data.r[ inTHE ];
            if( doUVlatin ){ // classical latin
                cheALLofRT.push( deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  
                                    itemin)))))))));
            } else {
                cheALLofRT.push( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  
                                     itemin))))))));
            }
            cheDiakDirectRT.push( deldiak( itemin ) );
            cheDiakRT.push( delklammern( sigmaistgleich( delgrkl( delinterp( delumbrbine( delligaturen( itemin )))))));
            cheLigatRT.push( delklammern( sigmaistgleich(delgrkl( delinterp( delumbrbine(  deldiak( itemin )))))));
            cheInterpRT.push( delklammern( sigmaistgleich( delgrkl( delligaturen( delumbrbine(  deldiak( itemin  )))))));
            cheUmbrRT.push( delklammern( sigmaistgleich( delgrkl( delligaturen( delinterp(  deldiak(  itemin  )))))));
            chegrklRT.push( delklammern( sigmaistgleich( delumbrbine( delligaturen( delinterp( deldiak( itemin  )))))));
            cheklammernRT.push( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  itemin  ))))))); 
            cheUVRT.push( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak( itemin ))))))));
    }
    //clear rev data
    cheALLofTT = [ ];
    cheDiakDirectTT = [ ];
    cheDiakTT = [ ];
    cheLigatTT = [ ];
    cheInterpTT = [ ];
    cheUmbrTT = [ ];
    chegrklTT = [ ];
    cheklammernTT = [ ];
    cheUVTT = [ ];
    //itt text data
    for( var inTHE in e.data.t ){
        var itemin = e.data.t[ inTHE ];
        if( doUVlatin ){ // classical latin
            cheALLofTT.push( deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  
                                itemin)))))))));
        } else {
            cheALLofTT.push( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  
                                itemin ))))))));
        }
        cheDiakDirectTT.push( deldiak( itemin ));
        cheDiakTT.push( delklammern( sigmaistgleich( delgrkl( delinterp( delumbrbine( delligaturen( itemin )))))));
        cheLigatTT.push( delklammern( sigmaistgleich(delgrkl( delinterp( delumbrbine(  deldiak( itemin )))))));
        cheInterpTT.push( delklammern( sigmaistgleich( delgrkl( delligaturen( delumbrbine(  deldiak( itemin  )))))));
        cheUmbrTT.push( delklammern( sigmaistgleich( delgrkl( delligaturen( delinterp(  deldiak(  itemin  )))))));
        chegrklTT.push( delklammern( sigmaistgleich( delumbrbine( delligaturen( delinterp( deldiak( itemin  )))))));
        cheklammernTT.push( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak(  itemin  )))))));
        cheUVTT.push( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( deldiak( itemin )))))))); 
    }
    
    //gestae 198072.34692382812ms, 183357.96997070312 NEU 67167 faster 2.7x / 30951 5.7x
    //Es kann, kurz gesagt, keine angewandte Mathematik geben. Es kann nur Mathematik und Anwendung geben. Die Ausführungen der Mathematik sind regelhafte sprachliche Konstrukte, das trifft auch auf die Zahlen zu, die eine Sonderstellung einnehmen, die bestimmte Probleme formulieren können und diese entweder lösen, also eine Vorschrift zur Wandlung der Ausdrücke in Ausdrücke geändertem Grundgehalt angeben, oder nicht. Die unlösbaren Probleme sind formal unlösbar, also durch die Termumformung oder Äquivalenzangaben der Mathematik, sind aber Grundsätzlich immer der praktischen Lösung zugänglich. So ist jedes nur mathematisch lösbare Problem ganz gewiss eine Redultion, auch wenn die Faktoren einezogen, viele sind. Der ermöglichte Erkenntnis Bereich bezieht das regelhaft ausdrückbare ein. Zu der Ungewissheit innerhalb von Aussagen in der Realität, kommt die oder steht an Stelle dessen, ob solche Formulierung überhaupt endlich und sinnvoll umgeformt werden kann. Die Mathematik suggeriert die Möglichkeit komplexer Operation, in Wahrheit ist die Mathematik aber immer eine Operation der Masse. Das heißt nicht die vollständige Abbildung eines Problems ist möglich, noch nicht mal die systematsiche, im Sinne anderer Wissenschaften, sondern nur die einfachste aber qunatitaiv umfänglichste Modellierung. Die Übertragung der mathematsichen Ergebnisse gelingt nur, weil die Zahl die Rückübertragung nahelegt, aber auch nur in bestimmten Grenzen. Darin besteht auch ihre Sonderrolle innerhalb der Mathematik. 
    //end and up it goes************************************************************

    //call the comparison function
    var result = differentiellervergleich3( e.data.r, e.data.ri, e.data.t, e.data.ti );
    //post back the results
    self.postMessage( { "vergl": result , "workerid": e.data.workerid } );
    //teminate the webworker process
	//self.close();
}

self.onmessage = function(event) { //input data and compute
        switch ( event.data.cmd ) {
            case 'eval': EV( event ); break;
            case 'terminate': self.close(); break;
        };
}
