//******************************************************************************
// 2016/2017 eComparatio Frontend, Prof. Charlotte Schubert Alte Geschichte Leipzig
// Function: DATA GETTING (Text and comparison results from online storage, and local browser storage, or as JSON file input), 
// DATA SETTING (mostly local storage and a server transaction) and DISPLAY of comparison results
// further functions: URN, CTS, JSON, LATEX, PRINTING  ...
//******************************************************************************


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

/*GLOBALS*/
let theautosavelet = null;
let autosaveinervall = 10000; //10 secF
let IdoliveIN = null;
//transmitted from local store or server store (via json saved as html doc), holding the bibliographical data
let bibdynvars = new Object(); 
//coloring of differences between text, also a storage of switches (if colored or not)
let TU ='G';
let TUleg ='ganzer Unterschied';
let GK ='C';
let GKleg ='Unterschied d. Gr.- und Kl.schreibung';
let DK ='D';
let DKleg ='Unterschied d. diakritischen Zeichen';
let LI ='L';
let LIleg ='Ligatur Unterschied';
let UM ='U';
let UMleg ='Umbruch Unterschied';
let INTERP ='I';
let INTERPleg ='Unterschied d. Interpunktion';
let ZK ='Z';
let ZKleg ='Unterschied d. Z&auml;hlung';
let ME ='M';
let MEleg ='Mehr als im anderen Text';
let WE ='W';
let WEleg ='Weniger als im anderen Text';
let KK ='K';
let KKleg ='Klammerung unterschiedlich';
let UV ='V';
let UVleg ='lateinisches U und V';
let VERT='VERT'; 
let VERTleg = 'Vertauschung Verdrehung'; 
let VERDRE = "VERD";
let VERDREleg = "Verdrehung von Passagen.";
let MIAT='MIAT'; 
let MIATleg='Mehr im Referenztext'; 
let EIN='E'; 
let EINleg='einzelner Buchstabe'; 
let DIST='DIST'; 
let DISTleg='wenige Buchstaben anders'; 
let WTN='get'; 
let WTNleg='erster Teil einer Trennung'; 
let VWT='get'; 
let VWTleg='zweiter Teil einer Trennung'; 
let colorofdiffclasses = 'rgb(0, 0, 255)';
let bonbon = "¿";
let bonbonT = "Lücken";
let csvtrenner = ";;";

let coloerdclass = new Object();
coloerdclass["T"] = 1; //sign of the compleat dissence between texts
coloerdclass["C"] = 1; //sign of capitalization difference
coloerdclass["D"] = 1; //sign of the difference of diacritica
coloerdclass["L"] = 1; //ligature
coloerdclass["U"] = 1; //
coloerdclass["I"] = 1; //interpunction
coloerdclass["Z"] = 1; //counting via []
coloerdclass["W"] = 1; //
coloerdclass["M"] = 1; //
coloerdclass["K"] = 1; //
coloerdclass["V"] = 1; //
coloerdclass["vERT"] = 1; //vertauschung
coloerdclass["vErdRE"] = 1; //vertauschung
coloerdclass["mIAT"] = 1; //
coloerdclass["EiN"] = 1; //
coloerdclass["dist"] = 1; //
coloerdclass["wtn"] = 1; //
coloerdclass["vwt"] = 1; //
let colorindex = null;

//global values repersenting the fitting of text to screen
let moretextoffset = 0;
let lineheight = 0;
let linewidth = 0;
let textscreenheight = 0;
let textscreenwidth = 0;
let parallelpartwidth = 300; //also hard coded in css
let maxlines = 0;
let howlogtowaitfirstlineheightrender = 500;//wait alittel until everything is loaded, than scale every column
let offlineedit = false; //controll if edit is done localy - than overwrite, else copy
let notmodiffunction = true;

//selected text series
let currentedseries = 0; //index or string !!! not the 
let currented = 0;
let currentvergleicht = 0;
let alltexts = null;
let textnames = null;

//data store of comparison results
let comparatiotogether = [];
let comparatiotogethertemp = [];
let tog = undefined;
let wico = undefined;
let comparatio = null;

//menu rendering
let oncemenu = 0;

//text view and render options
let whichview = 0; //0 - detailview, 1 - parallel view, 2 Buch view, 3 Bild, 4 Digramm, 5 Matrix, 6 interlinear
let renderstyle = 0;
let rendercount = 1;
let oldrendercount = 1;

//current postion in thext
let lastwordindex = 0;
let firstwordindex = 0;
let linecount = 0;
let lastvisibleline = 0;
let firstvisibleline = 0;
let linehinstory = [];
let blockhistory = [];


let pos0 = [10,10];
let doverk = true;
let rscrollconfig = 0; //scroll config

let ctsanswersXML = []; //CTS Request results

let buchstGRI = {"α":1, "β": 1, "γ":1, "δ":1, "ε":1, "ζ":1, "η":1, "θ":1, "ι":1, "κ":1, "λ":1, "μ":1, "ν":1, "ξ":1, "ο":1, "π":1, "ρ":1, "σ":1, "ς": 1, "τ":1, "υ":1, "φ":1, "χ":1, "ψ":1, "ω":1};


let dodebug = 0;
let menuzoom = 100; //in %

/*BETACODE TO UNICODE first VERSION*/
/*we use total canonical representation - no combined unicode letters*/
let betacode = new Array("a","b","g","d","e","z","h","q","i","k","l","m","n","c","o","p","r","s","j","t","u","f","x","y","w");
let smallunicode = new Array("\u03B1", "\u03B2", "\u03B3", "\u03B4",  "\u03B5",
"\u03B6",  "\u03B7",  "\u03B8",  "\u03B9",  "\u03BA",  "\u03BB",
"\u03BC",  "\u03BD",  "\u03BE",  "\u03BF",  "\u03C0", "\u03C1",
"\u03C3","\u03C2", "\u03C4", "\u03C5", "\u03C6", "\u03C7",
"\u03C8", "\u03C9");
let bigunicode = new Array("\u0391", "\u0392", "\u0393", "\u0394",  "\u0395",
"\u0396",  "\u0397",  "\u0398",  "\u0399",  "\u039A",  "\u039B",
"\u039C",  "\u039D",  "\u039E",  "\u039F",  "\u03A0", "\u03A1",
"\u03A3","\u03C2", "\u03A4", "\u03A5", "\u03A6", "\u03A7",
"\u03A8", "\u03A9");
let disnames = new Array("Spiritus lenis", "Spiritus asper", "Akut","Gravis", "Zirkumflex", "Iota subscriptum", "Dihaeresis", "Macron" , "Breve", "Perispomeni", "PRechts");
let diacritics = new Array(")", "(", "\\","\/", "=", "|", "+","%", "&", "$", "!");
let diacriticsunicode = new Array( "\u0313", "\u0314", "\u0300","\u0301", "\u0302", "\u0345", "\u0308", "\u0304", "\u0306", "\u0342", "\u2027");
let logicop = new Array( "-", "\u2217", "\u2227","\u2228");

let ligatur = new Array("\u0222", "\u03DB", "\u03D7", "\uA64B");
let ligaturB = new Array("\u0223", "\u03DA", "\u03CF", "\uA64A");

let useunicode = 0; //grosz-klein buchsaben umschalter
let lasttextuni = "";
let lasttextbeta = "";

/*precompiled regexp*/
let cleanundamplt = new RegExp('&amp;amp;amp;lt;', 'g');
let cleanundampgt = new RegExp('&amp;amp;amp;gt;', 'g');
let cleanundamplt2 = new RegExp('&amp;lt;', 'g');
let cleanundampgt2 = new RegExp('&amp;gt;', 'g');
let cleanundamplt3 = new RegExp('&lt;', 'g');
let cleanundampgt3 = new RegExp('&gt;', 'g');
let cleanundamponly = new RegExp('&amp;amp;amp;', 'g');
let cleanundamponly2 = new RegExp('&amp;', 'g');
let regBonBon = new RegExp( '🍬', 'g' );

/*INITIAL FUNCTION BUILDS BASE HTML AND CALL THE CHAIN of ecomparatio*/
function restartecomparatio( ){
    startecomparatio( IdoliveIN );
}

function requestfirstrender( ){
    if(localStorage.getItem( 'ECOMPfirstrun' ) == null ){
        
        //request php
        //get result and run  res )
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 ){
                if(xmlHttp.status == 200){
                    console.log( xmlHttp.responseText );

                    let asarr = xmlHttp.responseText.trim().split( "###############" );
                    let ia = [];
                    for(let g = 0; g < asarr.length-1; g+=1){
                        ia.push( asarr[g].split("#########") );
                    }
                    inpastextarray(  ia );
                    
                
                    let r = window.confirm("Wollen Sie ein Beispiel gleich rechnen lassen? Ansonsten finden Sie die Beispiele im Menü 'ADD' -> 'Test Cases ...'! (Diese Nachricht wird nur beim ersten Start von eComparatio angezeigt.)");
                    if( r ) {
                      
                      addED( );
                      loadtestcase1( );
                    } 
                    localStorage.setItem( 'ECOMPfirstrun', true ); //end first run alert
                }
            }
        }
        xmlHttp.open("GET", 'gp.php', true); // true for asynchronous 
        xmlHttp.send(null);
    }
}

function startecomparatio( elemIDtoputitin ){ //untested by 17.10.2017 - is pure AJAX VERSION
    IdoliveIN = elemIDtoputitin;
    let toputinelem = document.getElementById( IdoliveIN );

    //get elementtoput in
    let div1 = document.createElement('div');
    div1.id = "intome"; 
    toputinelem.appendChild( div1 );

    //append all needed to intome 
    let d10 = document.createElement( 'div');
    d10.id = "allmenu";

    //create static main menu
    d10.innerHTML = '<nav id="nnav"><p style="margin-top: 1px; background: rgb(176, 47, 44);">'
    +'<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'
	 +'width="20px" height="20px" viewBox="0 0 600 600" enable-background="new 0 0 600 600" xml:space="preserve">'
     +'<rect fill-rule="evenodd" clip-rule="evenodd" fill="#AF2D2B" width="600" height="600"/>'
     +'<g id="Logo-1-Vorlage-AI-b.psd"><g><g><g>'
				+'<path fill-rule="evenodd" clip-rule="evenodd" fill="#D6433C" d="M490.955,528.266c-2.588,0.004-6.055-3.844-10.805-10.045'
					+'c-0.563-0.738-1.006-1.314-1.27-1.621c-1.523-1.746-3.398-3.969-5.145-6.102l-0.543-0.676c-0.965-1.215-2.76-3.471-3.785-3.965'
					+'c-0.496-0.238-1.701-0.656-2.682-0.77c-1.936-0.23-4.676-0.342-8.383-0.342c-2.303,0-4.605,0.041-6.602,0.076'
					+'c-1.537,0.031-2.889,0.055-3.916,0.055H133.467c-1.29,0-2.847-0.055-4.363-0.109c-1.429-0.049-2.822-0.098-3.931-0.098'
					+'c-0.77,0-1.213,0.021-1.467,0.049c-0.322,0.742-0.914,2.453-1.287,3.541c-0.389,1.131-0.747,2.152-0.941,2.598'
					+'c-4.125,9.43-11.13,14.41-20.248,14.41c-1.204,0-2.462-0.09-3.742-0.256c-0.104-0.01-10.252-1.639-12.694-6.121'
					+'c-0.682-1.246-0.713-2.605-0.085-3.934c0.94-2.006,3.542-2.006,4.656-2.006c0.637,0,1.319,0.035,2.021,0.066'
					+'c0.756,0.037,1.462,0.068,2.169,0.068c1.319,0,2.298-0.117,3.083-0.375c5.538-1.795,10.061-7.564,10.99-14.031'
					+'c0.801-5.564-1.048-13.021-2.682-19.605l-0.491-1.998c-6.084-24.893-10.691-45.73-14.084-63.701'
					+'c-2.342-12.418-3.299-25.896-4.314-40.168l-0.501-6.98c-3.805-51.465,7.736-96.096,31.655-122.438'
					+'c9.289-10.221,29.546-27.813,60.917-30.775l1.011-0.099c2.169-0.207,4.401-0.427,6.586-0.427c1.98,0,3.612,0.184,4.989,0.563'
					+'c3.483,0.958,7.917,5.851,11.479,9.78c0.965,1.066,1.82,2.012,2.496,2.691l2.169,2.151c3.677,3.632,7.145,7.057,9.796,10.795'
					+'l0.99,1.397l-1.636,0.488c-46.869,14.02-78.445,43.669-93.851,88.132c-4.395,12.674-7.12,24.479-8.574,37.152'
					+'c-3.814,33.115,1.573,67.586,6.323,98l1.026,6.566c0.164,1.08,0.391,2.457,0.646,4.023c0.288,1.779,0.621,3.795,0.95,5.887'
					+'c0.106,0.672,0.25,2.084,0.41,3.646c0.178,1.732,0.452,4.473,0.655,5.539c0.603,0.127,2.181,0.303,6.29,0.303'
					+'c3.488,0,7.592-0.131,10.302-0.211c1.508-0.051,2.667-0.082,3.2-0.082h306.042l1.723,0.01l2.551,0.008'
					+'c2.141,0,3.389-0.039,4.113-0.086c-0.82-1.688-2.934-4.977-3.719-6.215c-0.424-0.652-0.756-1.17-0.928-1.453'
					+'c-4.229-7.143-7.482-13.078-10.631-20.621c-0.715-1.725-1.213-3.564-1.691-5.344c-0.596-2.209-1.158-4.293-2.094-6.074'
					+'c-0.869-1.656-3.631-4.32-5.85-6.459c-0.693-0.666-1.355-1.305-1.932-1.881c-30.059-30.141-60.514-60.467-89.961-89.791'
					+'c-32.383-32.242-65.87-65.585-99.037-98.888c-12.89-12.943-25.55-25.68-38.406-38.615l-18.839-18.95'
					+'c-0.468-0.473-1.08-1.101-1.762-1.8c-1.87-1.924-5.362-5.506-6.125-5.92c-0.79,0.054-3.317,3.011-4.397,4.273'
					+'c-0.625,0.736-1.192,1.397-1.651,1.852c-0.473,0.477-1.004,1.058-1.566,1.674c-2.279,2.498-4.631,5.085-6.832,5.085h-0.058'
					+'l-0.194-0.009c-2.448-0.225-4.428-3.924-6.762-8.747c-0.481-0.99-0.896-1.856-1.224-2.408'
					+'c-9.959-16.99-19.55-33.171-29.396-49.783l-13.128-22.166c-0.065-0.108-0.191-0.283-0.345-0.506'
					+'c-1.298-1.861-3.472-4.971-1.712-6.739c0.459-0.459,1.08-0.693,1.861-0.693c2.534,0,6.852,2.602,10.736,5.149'
					+'c0.349,0.225,0.603,0.394,0.727,0.468c8.896,5.275,17.577,10.448,26.207,15.592c14.667,8.74,29.83,17.78,45.426,26.938'
					+'c0.414,0.243,0.92,0.5,1.443,0.765c2.041,1.031,3.969,2.007,4.26,3.587c0.466,2.534-2.673,5.225-5.189,7.39'
					+'c-0.617,0.531-1.17,0.999-1.548,1.377c-0.432,0.437-1.073,1.015-1.795,1.661c-1.229,1.105-3.985,3.578-4.492,4.626'
					+'c0.731,0.927,3.427,3.443,5.099,5c1.098,1.031,2.12,1.98,2.786,2.642c30.651,30.532,61.489,61.521,91.314,91.488'
				  +' c31.803,31.966,64.694,65.015,97.368,97.515c8.32,8.275,16.871,16.701,25.508,25.203c10.637,10.473,21.637,21.301,32.373,32.043'
					+'c1.135,1.135,2.219,2.404,3.262,3.633c1.637,1.926,3.186,3.744,4.479,4.482c1.771,1.008,3.975,1.557,6.303,2.139'
					+'c1.811,0.453,3.676,0.922,5.393,1.633c9.537,3.965,19.225,9.734,28.363,15.518V133.001c0-1.053,0.053-2.453,0.109-3.879'
					+'c0.063-1.832,0.162-4.482,0.063-5.513c-1.109-0.301-4.211-0.63-5.963-0.814c-1.383-0.148-2.648-0.284-3.418-0.414l-3.566-0.585'
					+'c-28.229-4.643-57.422-9.442-86.211-9.442c-21.361,0-40.139,2.642-57.4,8.069c-43.422,13.66-75.282,44.281-89.709,86.213'
					+'c-0.205,0.599-0.457,1.553-0.747,2.617c-1.048,3.922-1.64,5.851-2.511,6.569c-0.308,0.252-0.686,0.382-1.1,0.382'
					+'c-1.438,0-3.313-1.712-6.267-4.87c-0.291-0.311-0.518-0.558-0.673-0.713l-12.791-12.791c-0.412-0.407-0.929-0.889-1.487-1.402'
					+'c-2.597-2.417-4.467-4.249-4.91-5.855c-1.956-7.115,1.458-21.859,2.552-26.207c5.131-20.349,16.776-38.16,33.691-51.518'
					+'c19.139-15.108,50.157-25.226,85.095-27.76c4.746-0.342,9.846-0.518,15.148-0.518c9.816,0,20.721,0.59,33.348,1.803'
					+'c31.654,3.036,59.783,9.113,92.279,17.302c1.225,0.309,2.482,0.642,3.766,0.99c5.225,1.397,11.139,2.979,16.541,2.979'
					+'c1.016,0,1.996-0.054,2.918-0.165c6.936-0.826,12.955-5.461,14.635-11.276c0.283-0.977,0.215-2.575,0.145-4.116'
					+'c-0.115-2.597-0.238-5.277,1.17-6.747c0.625-0.662,1.467-0.99,2.486-0.99c0.354,0,0.736,0.041,1.139,0.119'
					+'c3.492,0.711,4.813,4.379,5.518,6.344l0.186,0.502c2.506,6.616,2.482,12.989-0.074,18.428'
					+'c-2.684,5.711-8.031,10.178-15.066,12.586c-0.137,0.049-0.543,0.16-1.053,0.294c-0.578,0.148-1.768,0.457-2.42,0.671'
					+'c-0.078,1.163,0.008,4.1,0.061,6.134c0.047,1.478,0.084,2.892,0.084,3.895v324.911c0,0.877-0.014,1.777-0.025,2.684'
					+'c-0.037,2.861-0.074,5.818,0.285,7.578c0.221,1.049,2.055,2.357,3.531,3.412c0.646,0.463,1.283,0.912,1.838,1.367'
					+'c3.641,2.971,5.67,4.861,8.477,7.471c1.084,1.014,2.279,2.121,3.721,3.443c0.389,0.355,0.891,0.734,1.432,1.135'
					+'c2.074,1.561,4.662,3.506,4.055,6.125c-0.328,1.418-2.402,2.232-9.381,4.307c-1.795,0.541-3.492,1.039-4.08,1.324'
					+'c-10.387,4.949-16.869,12.744-19.811,23.83l-0.232,0.908c-0.902,3.543-1.609,5.896-3.17,6.352'
					+'C491.438,528.234,491.199,528.266,490.955,528.266L490.955,528.266z"/>'
			+'</g></g></g></g></svg>'
            +'</p><p class="clickable" id="ecompbutton" onclick="editionsaction( this );" style="background: rgb(216, 65, 62);">eComparatio</p><p class="clickable" onclick="hilfeaktion( this );" style="background: rgb(176, 47, 44);">Hilfe / Dokumentation</p></nav>';

    let d11 = document.createElement( 'div');
    d11.id = "edinto";
    let d12 = document.createElement( 'div');
    d12.id = 'alledmenu';
    let d13 = document.createElement( 'div');
    d13.id = 'edmenu';
    let d14 = document.createElement( 'div');
    d14.id = 'viewmenu';
    let d15 = document.createElement( 'div');
    d15.id = 'info';
    let d16 = document.createElement( 'div');
    d16.id = 'vergleich';
    let d17 = document.createElement( 'div');
    d17.id = 'comparatiodata';
    div1.appendChild( d10 );
    div1.appendChild( d11 );
    div1.appendChild( d12 );
    div1.appendChild( d13 );
    div1.appendChild( d14 );
    div1.appendChild( d15 );
    div1.appendChild( d16 );
    div1.appendChild( d17 );

    //append the help divs
    
    
    let hi1 = document.createElement( 'div');
    hi1.id = "hilfe";
    let hi2 = document.createElement( 'div');
    hi2.id = 'hilfe2';
    let hi3 = document.createElement( 'div');
    hi3.id = 'hilfe3';
    let hi4 = document.createElement( 'div');
    hi4.id = 'hilfe4';
    let hi5 = document.createElement( 'div');
    hi5.id = 'hilfe5';
    let hi6 = document.createElement( 'div');
    hi6.id = 'hilfe6';
    let hi7 = document.createElement( 'div');
    hi7.id = 'hilfe7';
    toputinelem.appendChild( hi1 );
    toputinelem.appendChild( hi2 );
    toputinelem.appendChild( hi3 );
    toputinelem.appendChild( hi4 );
    toputinelem.appendChild( hi5 );
    toputinelem.appendChild( hi6 );
    toputinelem.appendChild( hi7 );

    //check for the configuration
    if( localStorage.getItem( 'TU' ) == null ){
        localStorage.setItem('TU', TU );
        localStorage.setItem('TUleg', TUleg );
        localStorage.setItem('GK', GK );
        localStorage.setItem('GKleg', GKleg );
        localStorage.setItem('DK', DK );
        localStorage.setItem('DKleg', DKleg );
        localStorage.setItem('LI', LI );
        localStorage.setItem('LIleg', LIleg );
        localStorage.setItem('UM', UM );
        localStorage.setItem('UMleg', UMleg );
        localStorage.setItem('INTERP', INTERP );
        localStorage.setItem('INTERPleg', INTERPleg );
        localStorage.setItem('ZK', ZK );
        localStorage.setItem('ZKleg', ZKleg );
        localStorage.setItem('ME', ME );
        localStorage.setItem('MEleg', MEleg );
        localStorage.setItem('WE', WE );
        localStorage.setItem('WEleg', WEleg );
        localStorage.setItem('KK', KK );
        localStorage.setItem('KKleg', KKleg );
        localStorage.setItem('UV', UV );
        localStorage.setItem('UVleg', UVleg );
        localStorage.setItem('VERT', VERT );
        localStorage.setItem('VERTleg', VERTleg );
        localStorage.setItem('VERDRE', VERDRE );
        localStorage.setItem('VERDREleg', VERDREleg );
        localStorage.setItem('MIAT', MIAT );
        localStorage.setItem('MIATleg', MIATleg );
        localStorage.setItem('EIN', EIN );
        localStorage.setItem('EINleg', EINleg );
        localStorage.setItem('DIST', DIST );
        localStorage.setItem('DISTleg', DISTleg );
        localStorage.setItem('WTN', WTN );
        localStorage.setItem('WTNleg', WTNleg );
        localStorage.setItem('VWT', VWT );
        localStorage.setItem('VWTleg', VWTleg );
        localStorage.setItem('colorofdiffclasses', colorofdiffclasses );
        
        localStorage.setItem('bonbon', bonbon );
        localStorage.setItem('bonbonT', bonbonT );
        localStorage.setItem('csvtrenner', csvtrenner );
        localStorage.setItem('AS', "" );
        
    } else {
        TU = localStorage.getItem('TU');
        TUleg = localStorage.getItem('TUleg' );
        GK = localStorage.getItem('GK' );
        GKleg = localStorage.getItem('GKleg' );
        DK = localStorage.getItem('DK' );
        DKleg = localStorage.getItem('DKleg' );
        LI = localStorage.getItem('LI' );
        LIleg = localStorage.getItem('LIleg' );
        UM = localStorage.getItem('UM' );
        UMleg = localStorage.getItem('UMleg' );
        INTERP = localStorage.getItem('INTERP' );
        INTERPleg = localStorage.getItem('INTERPleg' );
        ZK = localStorage.getItem('ZK' );
        ZKleg = localStorage.getItem('ZKleg' );
        ME = localStorage.getItem('ME' );
        MEleg = localStorage.getItem('MEleg' );
        WE = localStorage.getItem('WE' );
        WEleg = localStorage.getItem('WEleg' );
        KK = localStorage.getItem('KK' );
        KKleg = localStorage.getItem('KKleg' );
        UV = localStorage.getItem('UV' );
        UVleg = localStorage.getItem('UVleg' );
        VERT = localStorage.getItem('VERT' );
        VERTleg = localStorage.getItem('VERTleg' );
        VERDRE = localStorage.getItem('VERDRE'  );
        VERDREleg = localStorage.getItem('VERDREleg' );
        MIAT = localStorage.getItem('MIAT' );
        MIATleg = localStorage.getItem('MIATleg' );
        EIN = localStorage.getItem('EIN' );
        EINleg = localStorage.getItem('EINleg' );
        DIST = localStorage.getItem('DIST' );
        DISTleg = localStorage.getItem('DISTleg' );
        WTN = localStorage.getItem('WTN' );
        WTNleg = localStorage.getItem('WTNleg' );
        VWT = localStorage.getItem('VWT' );
        VWTleg = localStorage.getItem('VWTleg' );
        colorofdiffclasses = localStorage.getItem('colorofdiffclasses' );
        bonbon = localStorage.getItem( 'bonbon' );
        bonbonT = localStorage.getItem( 'bonbonT' );
        csvtrenner = localStorage.getItem('csvtrenner' );
    }

    //add scroll handler
    if ( d16.addEventListener ) {
        d16.addEventListener("wheel", function(e) { UPorDOWNtext(e) }, true);
    } else if (el.attachEvent)  {
        d16.attachEvent( 'wheel', function(e) { UPorDOWNtext(e) } );
    }
    //set autosave mode to ADD
    notmodiffunction = true;
    //run
    loadallmenu();

    
}


/**************************************************************/
/*HELPER FKT*/
/**************************************************************/
//external manual
function hilfeaktion( elem ){
    window.open( 'https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#anleitung-inhalt', '_blank' ); // backlink
}

function openHelpAdd(){
    window.open( 'https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#hinzuf%C3%BCgen-', '_blank' );
}

//bildschirmtastatur
function setchar( index, idoftextfeald, historxdivid ){
    let cursorpos = document.getElementById( idoftextfeald ).selectionStart;
    let text = "";
    try{
         text = lasttextuni;
    } catch( err ){ }

    let token = "";
    let makebig = 0;
    if( useunicode == 0 ){
        token = smallunicode[ index ];
    }
    if( useunicode == 1 ){
        token = bigunicode[index];
        useunicode = 0;
	    makebig = 1;
    }
    let textfirst = text.slice( 0, cursorpos );
    let textsecond = text.slice( cursorpos, text.length );
    let resulttext = textfirst + token + textsecond;
    document.getElementById( idoftextfeald ).value = resulttext;
    setCursor( document.getElementById( idoftextfeald ), cursorpos+1, cursorpos+1 );
    lasttextuni = resulttext;

    //betacode history
    let textbeta = "";
    try{
         textbeta = lasttextbeta;
    } catch( err ){ }

    let textfirstbeta = textbeta.slice( 0, cursorpos );    
    let textsecondbeta = textbeta.slice( cursorpos, textbeta.length );

    
    let resulttextbeta = "";
    if( makebig == 1 ){
         resulttextbeta = textfirstbeta + betacode[index].toUpperCase() + textsecondbeta;
         document.getElementById( historxdivid ).value = resulttextbeta;
         makebig = 0;
      } else {
         resulttextbeta = textfirstbeta + betacode[index] + textsecondbeta;
         document.getElementById( historxdivid ).value = resulttextbeta; 
      }
      lasttextbeta = resulttextbeta;
}

function setbig( ){
    useunicode = 1;
}

function setdia( index, idoftextfeald, historxdivid ){
    let cursorpos = document.getElementById( idoftextfeald ).selectionStart;
    let text = "";
    try{
         text = lasttextuni;
    } catch( err ){ }
    
    let textfirst = text.slice( 0, cursorpos );
    let textsecond = text.slice( cursorpos, text.length );
    let resulttext = textfirst + diacriticsunicode[index] + textsecond;
    document.getElementById( idoftextfeald ).value = resulttext;
    setCursor( document.getElementById( idoftextfeald ), cursorpos+1, cursorpos+1 );
    lasttextuni = resulttext;

    //betacode history
    let textbeta = lasttextbeta;
    let textfirstbeta = textbeta.slice( 0, cursorpos );    
    let textsecondbeta = textbeta.slice( cursorpos, textbeta.length );
    let resulttextbeta = textfirstbeta + diacritics[index] + textsecondbeta;
    document.getElementById( historxdivid ).value = resulttextbeta;
    lasttextbeta = resulttextbeta;
}

function setligatur( index, idoftextfeald, historxdivid ){
    let cursorpos = document.getElementById( idoftextfeald ).selectionStart;
    let text = "";
    try{
         text = lasttextuni;
    } catch( err ){ }

    let token = "";
    let makebig = 0;
    if( useunicode == 0 ){
        token = ligatur[ index ];
    }
    if( useunicode == 1 ){
        token = ligaturB[ index ];
        useunicode = 0;
	    makebig = 1;
    }
    let textfirst = text.slice( 0, cursorpos );
    let textsecond = text.slice( cursorpos, text.length );
    let resulttext = textfirst + token + textsecond;
    document.getElementById( idoftextfeald ).value = resulttext;
    setCursor( document.getElementById( idoftextfeald ), cursorpos+1, cursorpos+1 );
    lasttextuni = resulttext;

    //betacode history
    let textbeta = "";
    try{
         textbeta = lasttextbeta;
    } catch( err ){ }
    let textfirstbeta = textbeta.slice( 0, cursorpos );    
    let textsecondbeta = textbeta.slice( cursorpos, textbeta.length );

    
    let resulttextbeta = "";
    if( makebig == 1 ){
         resulttextbeta = textfirstbeta + ligaturB[ index ] + textsecondbeta;
         document.getElementById( historxdivid ).value( resulttextbeta );
         makebig = 0;
      } else {
         resulttextbeta = textfirstbeta + ligatur[ index ] + textsecondbeta;
         document.getElementById( historxdivid ).value = resulttextbeta; 
      }
      lasttextbeta = resulttextbeta;
}

function delallTast( idoftextfeald, historxdivid ) {
    document.getElementById( idoftextfeald ).value = "";
    document.getElementById( historxdivid ).innerHTML = "";
    lasttextuni = "";
    lasttextbeta = "";
}

function delone( idoftextfeald, historxdivid ) {
    let text = document.getElementById( idoftextfeald ).value;
    let cursorpos = document.getElementById( idoftextfeald ).selectionStart;
    let textfirst = text.slice( 0, cursorpos-1 );
    let textsecond = text.slice( cursorpos, text.length );
    let resulttext = textfirst + textsecond;
    document.getElementById( idoftextfeald).value = resulttext;
    setCursor( document.getElementById( idoftextfeald ), cursorpos-1, cursorpos-1 );
    lasttextuni = resulttext;

    let textbeta = "";
    try{
         textbeta = lasttextbeta;
    } catch( err ){ }
    
    let textfirstbeta = textbeta.slice( 0, cursorpos-1 );    
    let textsecondbeta = textbeta.slice( cursorpos, textbeta.length );
    let resulttextbeta = textfirstbeta + textsecondbeta;
    document.getElementById( historxdivid ).value = resulttextbeta; 
    lasttextbeta = resulttextbeta;
}

function makebildschirmtatstatur( useunicode, idnameofdiv, idoftextfeald, historxdivid ){
    let st = "<ul>";
    for(let i = 0; i < betacode.length; i++){
        st = st + "<li class='clickable' style='border: 1px solid gray; border-right: 3px solid gray;border-bottom: 2px solid gray;'onclick='setchar("+i+",\""+idoftextfeald+"\",\""+historxdivid+"\");'>"+betacode[i]+ "<br>" +smallunicode[i]+ "</li>";
    }
    st = st + "</ul><ul><li class='clickable' style='border: 1px solid gray;border-right: 3px solid gray;border-bottom: 2px solid gray;'onclick='setbig();'>*<br>Gr</li>";
    for(let i = 0; i < diacritics.length; i++){
        st = st + "<li class='clickable' style='border: 1px solid gray;border-right: 3px solid gray;border-bottom: 2px solid gray;' onclick='setdia("+i+",\""+idoftextfeald+"\",\""+historxdivid+"\");'>" +diacritics[i]+"<br>"+diacriticsunicode[i]+ "</li>";
    }
    //delete
    st = st + "</ul><ul><li class='clickable' style='border: 1px solid gray;border-right: 3px solid gray;border-bottom: 2px solid gray;'onclick='delone(\""+idoftextfeald+"\",\""+historxdivid+"\");'><br>Del</li>";
    st = st + "</ul><ul><li class='clickable' style='border: 1px solid gray;border-right: 3px solid gray;border-bottom: 2px solid gray;'onclick='delallTast(\""+idoftextfeald+"\",\""+historxdivid+"\");'><br>Clear</li>";
    st = st + "</ul>";
    document.getElementById( idnameofdiv ).innerHTML = st ;
}

function changeTastatur( idoftextfeald, historxdivid ){
    if( document.getElementById("betacode").checked == false ){
	    document.getElementById( "betacodemapping" ).innerHTML = "";
    } else {
	    makebildschirmtatstatur( "useunicode","betacodemapping","searchinput", "betacodehistory" );
    }

    let st = document.getElementById( "betacodemapping").innerHTML;
	st = st + "<ul>";
    let refreshdiv = 0;
    if( document.getElementById("uselogic").checked == true ){
	    refreshdiv = 1;
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setlog( 0,\""+idoftextfeald+"\",\""+historxdivid+"\");'>NOT<br>-</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setlog( 2,\""+idoftextfeald+"\",\""+historxdivid+"\");'>.<br>"+logicop[2]+"</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setlog( 3,\""+idoftextfeald+"\",\""+historxdivid+"\");'>:<br>"+logicop[3]+"</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setlog( 1,\""+idoftextfeald+"\",\""+historxdivid+"\");'>#<br>"+logicop[1]+"</li>";
    }

	if( document.getElementById("useligatur").checked == true ){
	    refreshdiv = 1;
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setligatur( 0,\""+idoftextfeald+"\",\""+historxdivid+"\");'>?<br>"+ligatur[0]+"</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setligatur( 2,\""+idoftextfeald+"\",\""+historxdivid+"\");'>?<br>"+ligatur[2]+"</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setligatur( 3,\""+idoftextfeald+"\",\""+historxdivid+"\");'>?<br>"+ligatur[3]+"</li>";
	    st = st + "<li class='clickable' style='border: 1px solid gray;' onclick='setligatur( 1,\""+idoftextfeald+"\",\""+historxdivid+"\");'>?<br>"+ligatur[1]+"</li>";
    }

	if( refreshdiv == 1 ){
		st = st + "</ul>";
		document.getElementById( "betacodemapping").innerHTML = st;
	}
}

/*Scroll and other events*/
function UPorDOWNtext( event ) {//SCROLL TEXT VIA MOUSE WHEEL AND SHIFT KEY
    if( event.deltaY < 0  && event.shiftKey && event.altKey ){
        event.preventDefault();
        prevSTEP(); 
    } else if( event.deltaY > 0  && event.shiftKey && event.altKey ){
        event.preventDefault();
        nextSTEP();
    } else {
    
    }
    return false;
}

function setCursor( el, st, end ){
    if( el.setSelectionRange){
        el.focus( );
        el.setSelectionRange( st, end );
    } else {
        if( el.createTextRange ){
            range = el.createTextRange( );
            range.collapse( true );
            range.moveEnd( 'character', end );
            range.moveStart( 'character', st );
            range.select( );
        }
    }
}

window.onscroll = function(e) {
	let therefdiv = document.getElementById( "ref" );
	if( therefdiv ){
        let refauthordiv = document.getElementById( "info" ).children[0];
        if(rscrollconfig == 0){
            let wid =  therefdiv.offsetWidth;
            refauthordiv.style.display = "block";
	        refauthordiv.style.position = "absolute";	
            refauthordiv.style.marginLeft = "8px";
            refauthordiv.style.zIndex = "5";
            therefdiv.style.display = "block";
	        therefdiv.style.position = "absolute";	
            therefdiv.style.marginLeft = "-4px";
            let tdivs = document.getElementsByClassName( "verglt" );
            tdivs[0].style.paddingLeft = wid.toString() + "px";
            rscrollconfig = 1;
        }
        
        let scroL = document.body.scrollLeft || window.pageXOffset || document.documentElement.scrollLeft;
        refauthordiv.style.left = scroL.toString() + "px";
	    therefdiv.style.left = (pos0[1] +2+ scroL).toString() + "px";
	}
};

function getpositiononpage( element ){
    if( element.nodeType ){
        let rect = element.getBoundingClientRect( );
        let elementLeft, elementTop; //x F y
        let scrollTop = document.documentElement.scrollTop ?
                        document.documentElement.scrollTop:document.body.scrollTop;
        let scrollLeft = document.documentElement.scrollLeft ?                   
                         document.documentElement.scrollLeft:document.body.scrollLeft;
        elementTop = rect.top+scrollTop;
        elementLeft = rect.left+scrollLeft;
        return [ elementTop, elementLeft ];
    } else {
        return false;
    }
}

String.prototype.insertAt = function( index, string ){ 
  return this.substr( 0, index ) + string + this.substr( index );
}

function nextel( elem ) {
    do {
        elem = elem.nextSibling;
    } while ( elem && elem.nodeType !== 1 );
    return elem;        
}

function showhelpwithstr( str ){
    let hilf1 = document.getElementById("hilfe");
    hilf1.style.visibility = "visible";
    hilf1.style.position = "absolute";
    hilf1.style.top = (window.pageYOffset+100).toString() +"px";
    hilf1.style.left = (window.pageXOffset+20).toString() + "px";
	hilf1.innerHTML = str;
}

function showelemname( elem ){
	let hilf1 = document.getElementById("hilfe");
    hilf1.style.visibility = "visible";
    hilf1.style.position = "absolute";
	let pooo = getpositiononpage( elem );
    hilf1.style.top = pooo[0].toString() +"px";
    hilf1.style.left = (pooo[1]+10).toString() +"px";
    hilf1.style.width = "200px";
	hilf1.innerHTML = elem.name;
}

function closediv( idname ){
    document.getElementById( idname ).style.visibility = 'hidden';
    document.getElementById( idname ).innerHTML = "";
}

function hideelemname( ){
	closediv( "hilfe" );
}

function escapeAStr(str) {
    let div = document.createElement('div');
    div.appendChild( document.createTextNode(str) );
    return div.innerHTML;
}

function log10(val) {
  return Math.log( val ) / Math.LN10;
}

function dodownit( contentof, nameoffile, type ){
    let af = new Blob( [ contentof ], {type: type} );
    let theIE = false || !!document.documentMode;
    if ( theIE ){
        window.navigator.msSaveOrOpenBlob( af, nameoffile );
    } else {
        let alink = document.createElement( 'a' );
        alink.href = URL.createObjectURL( af );
        alink.download = nameoffile;
        document.body.appendChild( alink )
        alink.click( );
        document.body.removeChild( alink );
    }
}

function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

/**************************************************************/
/*showing buttons (hiding menus), showing menus (hiding buttons) 
- buildsection of initial menus is given below */
/**************************************************************/
function showinputstyle( ){
      let s = "<b>Eingabe</b><br/>Mit * gekennzeichnete Felder m&uuml;ssen ausgef&uuml;llt werden.<br/><br/><b>Eingabe Konvention (<i>Namen/Titel</i> ):</b><div>a) erleubte Zeichen: ., Leerzeichen, Großbuchstaben, Kleinbuchstaben, andere Sonderzeichen und Zahlen</div><div>b) unbrauchbare Zeichen: /, \<, \>, |, :, \&</div><br/><b>Eingabe Konvention (<i>Text</i> ):</b> <br/><div>a) Zeilenumbruch = ein Zeilenumbruch</div><div>b) Absatz = zwei Zeilenumbrüche</div><div>c) Spaltenumbruch = drei Zeilenumbrüche</div><div>d) Seite = vier Zeilenumbrüche</div> <br/><i>(Dient zur expliziten Paginierung und Navigation - es geht auch ohne.)</i><br/><br/><div class='clickableED' onclick='closediv( \"hilfe\" );'>&#9746;</div>";
      showhelpwithstr(s);
}

function coloralledmenu( posinmenu ){
    //decolor
    let menuelem = document.getElementById( "alledmenu" );
    if(oncemenu == 0){
        menuelem.style.height = (menuelem.offsetHeight+10).toString() + "px";
        oncemenu = 1;
    }
    for( let c in menuelem.children ){
        if( menuelem.children[ c ].style ){
            menuelem.children[ c ].style.background = "#D8413E";
            menuelem.children[ c ].style.position = "relative";
            menuelem.children[ c ].style.top = "";
            menuelem.children[ c ].style.left = "";
        }
    }
    //color selected
    if( posinmenu.toLowerCase ){ //string to index
        let chi = document.getElementById( posinmenu );
        document.getElementById( posinmenu ).style.background = "#8AC2D1";
        document.getElementById( posinmenu ).style.position = "absolute";
        let hl = getpositiononpage( document.getElementById( "edmenu" ) );
        document.getElementById( posinmenu ).style.top = (hl[0]-16).toString() + "px"; 
        document.getElementById( posinmenu ).style.left = (hl[1]+10).toString() + "px";
        
    } else {
        menuelem.children[ posinmenu ].style.background = "#8AC2D1";
        menuelem.children[ posinmenu ].style.position = "absolute";
        let hl = getpositiononpage( document.getElementById( "edmenu" ) );
        menuelem.children[ posinmenu ].style.top = (hl[0]-16).toString() + "px"; 
        menuelem.children[ posinmenu ].style.left = (hl[1]+10).toString() + "px";
    }
}

function decolorviewmenu( ){
    let edmenu = document.getElementById( "viewmenu" );
    for( let i = 0; i < edmenu.children.length; i += 1){
        edmenu.children[ i ].style.background = "#D8413E";//"rgb(249, 249, 249)";
    }
}

function showAllEdMenu( ){
    let menuelem = document.getElementById( "alledmenu" );
    menuelem.style.display = 'block';
    document.getElementById( "edmenu" ).style.display = 'block';
}

function hideAllEdMenu( ){
    let menuelem = document.getElementById( "alledmenu" );
    menuelem.style.display = 'none';
    document.getElementById( "edmenu" ).style.display = 'none';
}

function showViewMenu( ){
    let menuelem = document.getElementById( "viewmenu" );
    menuelem.style.display = 'block';
}

function hideViewMenu( ){
    let menuelem = document.getElementById( "viewmenu" );
    menuelem.style.display = 'none';
}

function showhelp2withmenu( e ){
    let hilf2 = document.getElementById("hilfe2");
    let viewmenucopydiv = document.getElementById( "hilfe2" );
    hilf2.style.visibility = "visible";
    hilf2.style.position = "absolute";
    hilf2.style.top = e.pageY.toString()+"px";
    hilf2.style.left = e.pageX.toString()+"px";
    hilf2.style.width = "500px";
    hilf2.innerHTML = "";
    let s = document.createElement("div");
    s.className = "clickableED";
    s.innerHTML = "Textstatistik"; 
    s.onclick = function(){ textSTAT( 0 ); };
    hilf2.appendChild( s );
    let de = document.createElement("div");
    de.className = "clickableED";
    de.innerHTML = "Debug (Indices einzeichnen)"; 
    de.onclick = function(){ if(dodebug == 1){dodebug=0;} else {dodebug=1;} };
    hilf2.appendChild( de );
    let zei = document.createElement("div");
    zei.className = "clickableED";
    zei.innerHTML = "Zeilen der Synopse nicht verkürzen<br><br>"; 
    zei.onclick = function(){ if(doverk){doverk=false;} else {doverk=true;}  comparatioparallel( 0 ); };
    
    hilf2.appendChild( zei );
    let c = document.createElement("div");
    c.className = "clickableED";
    c.innerHTML = "&#9746;"; 
    c.onmouseenter = function(){ closediv("hilfe2"); };
    hilf2.appendChild( c );
}

function showmenubuttonhilf2( ){
    let viewmenucopydiv = document.getElementById("hilfe2");
    viewmenucopydiv.innerHTML = "<div onmouseenter='showhelp2withmenu( e )'>&#9881;</div>";
}

function showhelp3withmenu( e ){
    let h = document.getElementById("hilfe3");
    h.style.visibility = "visible";
    h.style.position = "absolute";
    h.style.top = e.pageY.toString()+"px";
    h.style.left = e.pageX.toString()+"px";
    h.style.width = "500px";
    h.style.display = "block";
    h.innerHTML = "";
    let t = document.createElement("div");
    t.className = "clickableED";
    t.innerHTML = "<sup>"+TU+"</sup>"+TUleg;
    t.onclick = function(){ coloradiff("T"); };
    h.appendChild( t );
    let cc = document.createElement("div");
    cc.className = "clickableED";
    cc.innerHTML = "<sup>"+GK+"</sup>"+GKleg;
    cc.onclick = function(){ coloradiff("C"); };
    h.appendChild( cc );
    let d = document.createElement("div");
    d.className = "clickableED";
    d.innerHTML = "<sup>"+DK+"</sup>"+DKleg;
    d.onclick = function(){ coloradiff("D"); };
    h.appendChild( d );
    let l = document.createElement("div");
    l.className = "clickableED";
    l.innerHTML = "<sup>"+LI+"</sup>"+LIleg;
    l.onclick = function(){ coloradiff("L"); };
    h.appendChild( l );
    let i = document.createElement("div");
    i.className = "clickableED";
    i.innerHTML = "<sup>"+INTERP+"</sup>"+ INTERPleg;
    i.onclick = function(){ coloradiff("I"); };
    h.appendChild( i );
    let k = document.createElement("div");
    k.className = "clickableED";
    k.innerHTML = "<sup>"+KK+"</sup>"+KKleg;
    k.onclick = function(){ coloradiff("K"); };
    h.appendChild( k );
    let v = document.createElement("div");
    v.className = "clickableED";
    v.innerHTML = "<sup>"+UV+"</sup>"+UVleg;
    v.onclick = function(){ coloradiff("V"); };
    h.appendChild( v );
    let m = document.createElement("div");
    m.className = "clickableED";
    m.innerHTML = "<sup>"+ME+"</sup>"+MEleg;
    m.onclick = function(){ coloradiff("M"); };
    h.appendChild( m );
    let mia = document.createElement("div");
    mia.className = "clickableED";
    mia.innerHTML = "<sup>"+MIAT+"</sup>"+MIATleg;
    mia.onclick = function(){ coloradiff("mIAT"); };
    h.appendChild( mia );
    let ve = document.createElement("div");
    ve.className = "clickableED";
    ve.innerHTML = "<sup>"+VERT+"</sup>"+VERTleg;
    ve.onclick = function(){ coloradiff("vERT"); };
    h.appendChild( ve );
    let ved = document.createElement("div");
    ved.className = "clickableED";
    ved.innerHTML = "<sup>"+VERDRE+"</sup>"+VERDREleg;
    ved.onclick = function(){ coloradiff("vErdRE"); };
    h.appendChild( ved );
    let u = document.createElement("div");
    u.className = "clickableED";
    u.innerHTML = "<sup>"+DIST+"</sup>"+DISTleg;
    u.onclick = function(){ coloradiff("dist"); };
    h.appendChild( u );
    let w = document.createElement("div");
    w.className = "clickableED";
    w.innerHTML = "<sup>"+EIN+"</sup>"+EINleg;
    w.onclick = function(){ coloradiff("EiN"); };
    h.appendChild( w ); 
    let z = document.createElement("div");
    z.className = "clickableED";
    z.innerHTML = "<sup>"+WTN+"</sup>"+WTNleg;
    z.onclick = function(){ coloradiff("wtn"); };
    h.appendChild( z );
    let zd = document.createElement("div");
    zd.className = "clickableED";
    zd.innerHTML = "<sup>"+VWT+"</sup>"+VWTleg;
    zd.onclick = function(){ coloradiff("vwt"); };
    h.appendChild( zd );
    let gld = document.createElement( "div" );
    gld.className = "clickableED";
    gld.innerHTML = "Gleiches<br><br>";
    gld.onclick = function(){ colorasame(); };
    h.appendChild( gld );
    let c = document.createElement("div");
    c.className = "clickableED";
    c.innerHTML = "&#9746;";  
    c.onmouseenter = function(){ closediv("hilfe3"); };
    h.appendChild( c );
}

function showmenubuttonhilf3( ){
    let viewmenucopydiv = document.getElementById("hilfe3");
    viewmenucopydiv.style.width = "auto";
    viewmenucopydiv.innerHTML = "<div onmouseenter='showhelp3withmenu( e )'>&#9997;</div>";
}

function hidetextmenus( ){
    let m1 = document.getElementById( "hilfe2" );
    m1.style.visibility = "hidden";
	let m2 = document.getElementById( "hilfe3" );
    m2.style.visibility = "hidden";
	let m3 = document.getElementById( "hilfe4" );
    m3.style.visibility = "hidden";
	let m4 = document.getElementById( "hilfe5" );
    m4.style.visibility = "hidden";
	let m5 = document.getElementById( "hilfe6" );
    m5.style.visibility = "hidden";
}

function takedatafrommenuLC( ){ 
    rendercount = parseInt( document.getElementById("LC").value );
    let newrenderstyle = parseInt( document.getElementById("LS").value);

    if( renderstyle !=  newrenderstyle && newrenderstyle != 0 ){
        blockhistory = [];
        renderstyle = newrenderstyle;
        lastwordindex = 0;
        linecount = 0;
        nextSTEP();
    }
    renderstyle = newrenderstyle;
    closediv( "hilfe4" );
}

function showhelptextnav( e ){
    let m = document.getElementById( "hilfe4" );
    m.innerHTML = "";
    let hp = getpositiononpage(document.getElementById( "vergleich" ))[0];
    m.style.visibility = "visible";
    m.style.position = "absolute";

    m.style.top = e.pageY.toString()+"px";
    m.style.left = e.pageX.toString()+"px";
    let t = "<input style='margin-right:10px; width:120px;' id='LC' value='"+rendercount.toString()+"'/><select style='margin-right:20px; width:auto;' id='LS' >";

    if(renderstyle == 0){
        t = t + "<option value='0' selected>Bildschirmzeile</option><option value='1'>Absatz (d. Vorlage)</option><option value='2'>Spalte (d. Vorlage)</option><option value='3'>Seite (d. Vorlage)</option>";
    } else if(renderstyle == 1){
        t = t + "<option value='0'>Bildschirmzeile</option><option value='1' selected>Absatz (d. Vorlage)</option><option value='2'>Spalte (d. Vorlage)</option><option value='3'>Seite (d. Vorlage)</option> ";
    } else if(renderstyle == 2){
        t = t + "<option value='0'>Bildschirmzeile</option><option value='1'>Absatz (d. Vorlage)</option><option value='2' selected>Spalte (d. Vorlage)</option><option value='3'>Seite (d. Vorlage)</option>";
    } else if(renderstyle == 3){
        t = t + "<option value='0'>Bildschirmzeile</option><option value='1'>Absatz (d. Vorlage)</option><option value='2'>Spalte (d. Vorlage)</option><option value='3' selected>Seite (d. Vorlage)</option>";
    } 
    t = t + "</select> <span onmouseenter='takedatafrommenuLC()' class='clickableED'>&#9746;</span>";

    m.innerHTML = t;
}

function debuggemail( astring ){
    let concon = confirm("Wollen Sie ein Issue auf Github eröffnen (click OK) oder eine email an die Entwickler senden (click Cancel)");   
    if( concon == true ) {
        let somemore = prompt( "Beschreiben Sie den Fehler kurz." );
        if( somemore ){
            let nono = "OS: "+ window.navigator.platform +", Agent: "+window.navigator.userAgent+ ", Reason: " +astring+", Besch: "+ somemore;
            let ll = "https://github.com/ecomp-shONgit/ecomparatio/issues/new?title="+astring+"&body="+encodeURIComponent(nono); 
            window.open( ll, "_blank");   
        }       
    } else {
        let somemore = prompt( "Beschreiben Sie den Fehler, wenn Sie Rückmeldung wünschen geben Sie auch Ihre email an (die wird nicht gespeichert oder sich gemerkt)!" );
        if( somemore ){
            let nono = "OS: "+ window.navigator.platform +", Agent: "+window.navigator.userAgent+", Reason: "+astring +", Besch: "+ somemore;
            let l = "mailto:hannes.kahl@uni-leipzig.de?subject=eComparatio sagt&body=" + encodeURIComponent(nono); 
            window.open( l, "_blank");  
        } 
    }
}

function buggreport( ){ // buggreport from inputform
    let astring = submitneweds( true ); //collect data from input form  
    debuggemail( astring ); //call mailto
}

function zoommenu( ){  
    menuzoom += 20;
    document.getElementById( "viewmenu" ).style.fontSize = menuzoom.toString()+"%";
    document.getElementById( "hilfe3" ).style.fontSize = menuzoom.toString()+"%";
}

function dezoommenu( ){
    if(menuzoom > 40){
        menuzoom -= 20;
        document.getElementById( "viewmenu" ).style.fontSize = menuzoom.toString()+"%";
        document.getElementById( "hilfe3" ).style.fontSize = menuzoom.toString()+"%";
    }
}

/**************************************************************/
/*load and building main menus*/
/**************************************************************/
function loadallmenu( ){
    //load alledmenu from server
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 ){
            if(xmlHttp.status == 200){
                let elemtofill = document.getElementById( "alledmenu" );
                elemtofill.innerHTML = xmlHttp.responseText;
                //add offline information to menu, from local storage
                let menuadd = localStorage.getItem("ecompmenuADD");
                if( menuadd ){
                    elemtofill.innerHTML = elemtofill.innerHTML+'<span class="clickablesec offlmenu" style="display: inline-block; background: #D8413E none repeat scroll 0% 0%; position: relative;" id="delofflstore"  onclick="modEDoffline();">+&#1421;</span>';
                    elemtofill.innerHTML =  elemtofill.innerHTML + menuadd;  
                }

	            oncemenu = 0;
                let serc = window.location.href.split("?");
            
	            typographmessure();
                if( serc.length > 1 ){ //handel urn and cts input via url, BUT not availabl offline - clearly
                    eCompURN( serc[1] );
                } else {
		        //load first not archived ed series
		            for(let a = 0; a < elemtofill.children.length-8; a++){
			            if( elemtofill.children[ a ].style.display  == "inline-block" || 
                            elemtofill.children[ a ].className.indexOf("archive") == -1){ //take first edition series and load this comparatio
                            //load comarioson result
				            //loadcomparatio( a ); // do not call directly
                            elemtofill.children[ a ].click(); // call the loadcomparatio function attached to the menu elements
				            break;
			            } 
		            }
                }
            } else {
                console.log("Man man man da ist kein Menu auf dem Server Server. Hatter vielleicht eine Clientside only Installation?");
                try{
                    document.getElementById( "alledmenu" ).innerHTML = localStorage.getItem("ecompmenuADD");
                    typographmessure( );  
                    //chain reinkloppen und dann läuft es
                    execloadcomparatioCHAIN( );
                    //testcase wanted?
                    requestfirstrender( );
                } catch( err ){
                    //first run no data in menu db, menu nullm keep going
                    console.log( err, "DO NOT RENDER - Chromium Error ???" );
                    
                }
            }
        }
    } 
    xmlHttp.open("GET", 'pages/edout/m.html', true); // true for asynchronous 
    xmlHttp.send(null);
}

function buildcomparatiowico( ri ){
    wico = {};
    for( let R = 0; R <= comparatio.length-1; R = R +1 ){
      if( ri == comparatio[ R ][0] ){ //refid
      let co = comparatio[ R ][1]; //pro text
      for( let T in co ){
        let ti = co[T][0][1] //textid
        for( let w in co[T] ){
          if(w > 0){ //scip first just indices
            if( wico[ co[T][ w ][1].toString() ] ){
                wico[ co[T][ w ][1].toString() ].push([ti, co[T][ w ][0],co[T][ w ][2]]);
            } else {
                wico[ co[T][ w ][1].toString() ] = [[ti, co[T][ w ][0],co[T][ w ][2]]];
            }
          }
         }
        }
      }
    }
}

function buildcomparatiotogether( ri ){
  //comparatiotogether ist geordnet nach referenz index in 
  //dem index befindet sich das dict mit den unterschieden
  //an jeder dict stelle ein array aller unterschiede
  //ein unterschied ist ein tripel aus textindex, wortindex und unterschiedskalsse
    if( comparatio ){
        tog = {};
        for( let R = 0; R <= comparatio.length-1; R = R +1 ){
          if( ri == comparatio[ R ][0] ){ //refid
          let co = comparatio[ R ][1]; //pro text
          for( let T in co ){
            let ti = co[T][0][1] //textid
            for( let w in co[T] ){
              if(w > 0){ //scip first just indices
                if( co[T][ w ][2] != "" ){//take just differences
                  if( tog[ co[T][ w ][1].toString() ] ){
                    tog[ co[T][ w ][1].toString() ].push([ti, co[T][ w ][0],co[T][ w ][2]]);
                  } else {
                    tog[ co[T][ w ][1].toString() ] = [[ti, co[T][ w ][0],co[T][ w ][2]]];
                  }
                }
              }
             }
            }
          }
        }
   }
}

function execloadcomparatioCHAIN( ){
    cleanalltextarray();
    buildedmenu();
    buildviewmenu();
    selectEDbyID(0); 
}

function loadcomparatio( numofeds ){
    currentedseries = numofeds; //could be string or index
    coloralledmenu( numofeds );
    if( numofeds.toLowerCase ){ //offline data: index is a string
        bibdynvars[ numofeds ] = JSON.parse( localStorage.getItem( "ecompBIB"+numofeds ) );
        //console.log(localStorage.getItem("ecompTENAMES"+numofeds ).split(""));
        textnames = JSON.parse( localStorage.getItem("ecompTENAMES"+numofeds ) );
        
        alltexts = JSON.parse( localStorage.getItem( "ecompALLTEX"+numofeds ) );
        comparatio = JSON.parse( localStorage.getItem( "ecompRES"+numofeds ) );
        
        execloadcomparatioCHAIN( );
    } else { //online data
        let menuelem = document.getElementById( "alledmenu" );
        for( let c = 0; c < menuelem.children.length; c++ ){
            if( c == numofeds ){
                let xmlHttp = new XMLHttpRequest( );
                xmlHttp.onreadystatechange = function( ){ 
                    if( xmlHttp.readyState == 4 ){
                        if( xmlHttp.status == 200 ){
                            let s = document.createElement( "script" );
                            s.innerHTML = xmlHttp.responseText.replace( "<script>", "" ).replace( "</script>", "" );
                            document.getElementById( "comparatiodata" ).appendChild( s );
                            
                            execloadcomparatioCHAIN();
                        } else {
                            console.log( "LOAD COMPARATIO DATA AJAX ERROR" ); 
                        }
                    }
                }    
                xmlHttp.open( "GET", 'pages/edout/'+menuelem.children[c].innerHTML+'.html', true ); 
                xmlHttp.send( null );
                break;
            }
        }
    }
}

function cleanalltextarray( ){
    if( alltexts ){
	    for( let i = 0; i < alltexts.length; i++ ){
		    let last = "";
		    while( last == "" ){
			    last = alltexts[ i ].pop();
		    }
		    alltexts[ i ].push( last );
	    }
    }
}

function buildedmenu( ){
  	let edmenu = document.getElementById( "edmenu" );
	let menuelem = document.getElementById( "alledmenu" );
  	edmenu.innerHTML = "";
	let thebib = "";
    if( currentedseries.toLowerCase ){ //currentedseries is string
        thebib = bibdynvars[currentedseries];
    } else { //currentedseries is index
        for( let c in menuelem.children ){
    	    if( c == currentedseries ){
        	    thebib = bibdynvars[ menuelem.children[c].innerHTML ];
		    }
	    }
    }
	if( thebib ){
		for( let i = 0; i < thebib.length; i++ ){
			for( let ii = 0; ii < thebib.length; ii++ ){
				let b = thebib[ ii ];
				if( i == b[0] ){
  					let d = document.createElement("div");
    				d.className = "clickableED";
    				d.style.background = "#8AC2D1";
    				d.style.float = "left";
    				d.style.margin = "10px";
    				d.style.marginTop = "0px";
					let n =  b[2].split( "_" );
    				let nn = n.join( "." );
    				d.innerHTML = nn + " |"; //name author 
    				d.name = b[0].toString();
    				d.onclick = function(){ selectED( this ); };
					edmenu.appendChild( d );
				}
			}
		}
	} else {
  		for( let m in textnames ){
    		if( !textnames[ m ][1] ){
      			continue;
    		}
    		let n = textnames[ m ][1].split(" _ ");
    		let nn = n.join( ", " );
    		let nnn = nn.split( "_" );
    		let nnnn = nnn.join( "." );
    		let d = document.createElement("div");
    		d.className = "clickableED";
    		d.style.background = "#8AC2D1";
    		d.style.float = "left";
    		d.style.margin = "10px";
    		d.style.marginTop = "0px";
    		d.innerHTML = nnnn + " |"; //name author 
    		d.name = m.toString( );
    		d.onclick = function( ){ selectED( this ); };
    		edmenu.appendChild( d );
		}
  	}
}


function buildviewmenu( ){
    let edmenu = document.getElementById( "viewmenu" );
    edmenu.innerHTML = "";
    let p = document.createElement( "span" );
    p.className = "clickableED";
    p.title = "Die Darstellung legt die verglichenen Texte nebeneinander.";
    p.innerHTML = "Synopse";//"Paralell-Darstellung"; 
	if(whichview == 1){
    	p.style.background = "#8AC2D1";
	}
    p.onclick = function( ){ decolorviewmenu( ); this.style.background = "#8AC2D1"; comparatioparallel( 0 ); };
    p.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#synopse-", "_blank"); };
    edmenu.appendChild( p );
    let d = document.createElement( "span" );
    d.className = "clickableED";
    d.title = "Die Darstellung legt die verglichenen Texte zusammen.";
    d.innerHTML = "DetailD";  
    d.onclick = function(){ decolorviewmenu( ); this.style.background = "#8AC2D1";comparatiodetail( 0 ); };
    d.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#detail-darstellung-", "_blank"); };
	if( whichview == 0 ){
    	d.style.background = "#8AC2D1";
	}
    edmenu.appendChild( d );
    let b = document.createElement( "span" );
    b.className = "clickableED";
    b.title = "Die Darstellung bietet einen Variantenapparat an.";
    b.innerHTML = "BuchD"; 
	
	if(whichview == 2){
    	b.style.background = "#8AC2D1";
	}
    b.onclick = function( ){ decolorviewmenu( ); this.style.background = "#8AC2D1";comparatiobuch( 0 ); };
    b.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#buch-darstellung-", "_blank"); };
    edmenu.appendChild( b );
    let ma = document.createElement( "span" );
    ma.className = "clickableED";
    ma.title = "Die Darstellung zeigt die Vergleiche von allen zu allen anderen Texten in einer rechteckigen Matrix.";
    ma.innerHTML = "MatrixD";
	if(whichview == 5){
    	ma.style.background = "#8AC2D1";
	}
    ma.onclick = function(){ decolorviewmenu( ); this.style.background = "#8AC2D1"; comparatiomatrix( ); };
    ma.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#matrix-darstellung-", "_blank"); };
    edmenu.appendChild( ma );
	let dia = document.createElement( "span" );
    dia.className = "clickableED";
    dia.title = "Die Darstellung zeigt den Vergleich in Zahlen und Diagrammen."
    dia.innerHTML = "DiagrammD"; 
	if(whichview == 4){
    	dia.style.background = "#8AC2D1";
	}
    dia.onclick = function( ){ decolorviewmenu( ); this.style.background = "#8AC2D1";comparatiodiagramm( 0 ); };
    dia.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#diagramm-darstellung-", "_blank"); };
    edmenu.appendChild( dia );

    let intl = document.createElement( "span" );
    intl.className = "clickableED";
    intl.title = "Die Darstellung zeigt den Vergleich als interlinearen Text."
    intl.innerHTML = "InterlinearD"; 
	if(whichview == 6){
    	intl.style.background = "#8AC2D1";
	}
    intl.onclick = function( ){ decolorviewmenu( ); this.style.background = "#8AC2D1";comparatiointerlin( 0 ); };
    intl.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#interlinear-darstellung-", "_blank"); };
    edmenu.appendChild( intl );
    
    let e = document.createElement( "span" );
    e.className = "clickableED";
    e.title = "Drucken";
    e.innerHTML = "&#9113;"; 
    e.onclick = function( ){ printcomparatio( ); };
    e.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#drucken-", "_blank"); };
    
    edmenu.appendChild( e );
	let ee = document.createElement( "span" );
    ee.className = "clickableED";
    ee.title = "Die Synopse als Latex Tabelle exportieren.";
    ee.innerHTML = "LATEX"; 
    ee.onclick = function( ){ tolatex( ); };
    ee.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#latex-", "_blank"); };
    edmenu.appendChild( ee );
    let eVe = document.createElement( "span" );
    eVe.className = "clickableED";
    eVe.title = "Die Synopse im CSV Format exportieren.";
    eVe.innerHTML = "CSV"; 
    eVe.onclick = function( ){ tocsv( ); };
    eVe.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#csv-", "_blank"); };
    edmenu.appendChild( eVe ); 
    let eXe = document.createElement( "span" );
    eXe.className = "clickableED";
    eXe.title = "Die Synopse im xlsx Format exportieren.";
    eXe.innerHTML = "XLSX"; 
    eXe.onclick = function( ){ toxlsx( ); };
    eXe.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#xlsx-", "_blank"); };
    edmenu.appendChild( eXe );
    let jsonb = document.createElement( "span" );
    jsonb.className = "clickableED";
    jsonb.title = "Texte und Eregbnisse als JSON Exportieren.";
    jsonb.innerHTML = "JSON"; 
    jsonb.onclick = function( ){ calljsonphp( ); };
    jsonb.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#json--dump-", "_blank"); };
    edmenu.appendChild( jsonb );
	let teib = document.createElement( "span" );
    teib.className = "clickableED";
    teib.title = "Die Ergebnisse als TEI Apparatus Tag verwendendes XML exportieren.";
    teib.innerHTML = "TEI"; 
    teib.onclick = function( ){ buildteixml( ); };
    teib.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#tei-", "_blank"); };
    edmenu.appendChild( teib );
    let htmlb = document.createElement( "span" );
    htmlb.className = "clickableED";
    htmlb.title = "Die Ergebnisse werden als digitale Edition exportiert.";
    htmlb.innerHTML = "HTML"; 
    htmlb.onclick = function( ){ buildhtml( ); };
    htmlb.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#digitale-edition-", "_blank"); };
    edmenu.appendChild( htmlb );
    let addelem = document.createElement( "span" );
    addelem.className = "clickableED";
    addelem.title = "Textreihe in der verglichen werden soll hinzufügen und vergleichen.";
    addelem.innerHTML = "ADD"; 
    addelem.onclick = function( ){ addED( ); };
    addelem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#hinzuf%C3%BCgen-", "_blank"); };
    edmenu.appendChild( addelem );
    let modelem = document.createElement( "span" );
    modelem.className = "clickableED";
    modelem.title = "Texte einer Textreihe modifizieren und neu vergleichen.";
    modelem.innerHTML = "MOD"; 
    modelem.onclick = function( ){ modEDoffline( ); }; //that is just for the first version of ecomparatio - without server com
    modelem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#%C3%84ndern-", "_blank"); };
    edmenu.appendChild( modelem );
    let delelem = document.createElement( "span" );
    delelem.className = "clickableED";
    delelem.title = "Diese Textreihe löschen.";
    delelem.innerHTML = "DEL"; 
    delelem.onclick = function( ){ delED( ); };
    delelem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#l%C3%B6schen-", "_blank"); };
    edmenu.appendChild( delelem );
    
    let inelem = document.createElement( "span" );
    inelem.className = "clickableED";
    inelem.title = "Eingabe von Ergebnissen in Form von JSON files.";
    inelem.innerHTML = "IN"; 
    inelem.onclick = function( ){ inpJSON( ); };
    inelem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#in-", "_blank"); };
    edmenu.appendChild( inelem );

    let deselem = document.createElement( "span" );
    deselem.className = "clickableED";
    deselem.title = "Bezeichnung und Färbung der Unterschiede verändern.";
    deselem.innerHTML = "DES"; 
    deselem.onclick = function( ){ modDIFFDES( ); };
    deselem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#ecomparatio-customizing-", "_blank"); };
    edmenu.appendChild( deselem );
    let Einst1 = document.createElement( "span" );
    Einst1.className = "clickableED";
    Einst1.title = "Debug, Textstatistik etc.";
    Einst1.innerHTML = "&#9881;"; 
    Einst1.onclick = function( e ){ showhelp2withmenu( e ); };
    Einst1.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#unterschiede--anderes", "_blank"); };
    edmenu.appendChild( Einst1 );
    let unterschkl = document.createElement( "span" );
    unterschkl.className = "clickableED";
    unterschkl.title = "Unterschiede ein- und ausblenden.";
    unterschkl.innerHTML = "&#9997;"; 
    unterschkl.onclick = function( e ){ showhelp3withmenu( e ); };
    unterschkl.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#unterschiede--anderes", "_blank"); };
    edmenu.appendChild( unterschkl );
    let zurueckelem = document.createElement( "span" );
    zurueckelem.className = "clickableED";
    zurueckelem.innerHTML = "&#8593;"; 
    zurueckelem.titel = "Zurück, Text Scroll Funktion, auch via Mouserad und SHIFT+ALT"; 
    zurueckelem.onclick = function( ){ prevSTEP( ); };
    edmenu.appendChild( zurueckelem );
    let stepelem = document.createElement( "span" );
    stepelem.className = "clickableED";
    stepelem.title = "Schrittweite der Textnavigation einstellen.";
    stepelem.innerHTML = "&#9863;"; 
    stepelem.onclick = function( e ){ showhelptextnav( e ); };
    stepelem.ondblclick = function(){ window.open( "https://github.com/ecomp-shONgit/ecomparatio/blob/master/manual/README.md#navigation", "_blank"); };
    edmenu.appendChild( stepelem );
    let vorelem = document.createElement( "span" );
    vorelem.className = "clickableED";
    vorelem.innerHTML = "&#8595;"; 
    vorelem.titel = "Vor, Text Scroll Funktion, auch via Mouserad und SHIFT+ALT"; 
    vorelem.onclick = function( ){ nextSTEP( ); };
    edmenu.appendChild( vorelem );
    let zooelem = document.createElement( "span" );
    zooelem.className = "clickableED";
    zooelem.innerHTML = "&#128269;"; 
    zooelem.title = "Vergrößern der Menüs.";
    zooelem.onclick = function(){ zoommenu( ); };
    edmenu.appendChild( zooelem );
    let zooOelem = document.createElement( "span" );
    zooOelem.className = "clickableED";
    zooOelem.innerHTML = "-&#128270;"; 
    zooOelem.title = "Verkleinern der Menüs.";
    zooOelem.onclick = function( ){ dezoommenu( ); };
    edmenu.appendChild( zooOelem );
    let emailelem = document.createElement( "span" );
    emailelem.className = "clickableED";
    emailelem.innerHTML = "&#128231;"; 
    emailelem.title = "Email an den Admin bezüglich erkannter Fehler versenden.";
    emailelem.onclick = function( ){ debuggemail( "Fehler Frontend" ); };
    
    edmenu.appendChild( emailelem );
}

function buildtextmenu1( ){
    let viewmenucopydiv = document.getElementById( "hilfe2" );
    viewmenucopydiv.style.visibility = "visible";
    viewmenucopydiv.style.position = "absolute";
    let ih = "<div onmouseenter='showhelp2withmenu( e )' class='cklickableW'>&#9881;</div>";
    viewmenucopydiv.innerHTML = ih;
    let hp = getpositiononpage(document.getElementById( "vergleich" ))[0] + 3;
    viewmenucopydiv.style.top = hp.toString() +"px"; 
    viewmenucopydiv.style.left = (window.pageXOffset) +"px";
}

function buildtextmenu2( ){
    let md = document.getElementById( "hilfe3" );
    md.style.visibility = "visible";
    md.style.position = "absolute";
    let ih = "<div onmouseenter='showhelp3withmenu(e)' class='cklickableW'>&#9997;</div>";
    md.innerHTML = ih;
    let hp = getpositiononpage(document.getElementById( "vergleich" ))[0] + 30;
    md.style.top = hp.toString() +"px"; 
    md.style.left = (window.pageXOffset) +"px";
}

function buildtextmenu3( ){
    let hp = getpositiononpage(document.getElementById( "vergleich" ))[0];
    let mr = document.getElementById( "hilfe5" );
    mr.style.visibility = "visible";
    mr.style.position = "absolute";
    mr.innerHTML = "<div onclick='prevSTEP()' class='cklickableW'>&#8593;</div>";
    mr.style.top = (hp+105).toString() +"px"; 
    mr.style.left = window.pageXOffset +"px";
    let mt = document.getElementById( "hilfe6" );
    mt.style.visibility = "visible";
    mt.style.position = "absolute";
    mt.innerHTML = "<div onclick='nextSTEP()' class='cklickableW'>&#8595;</div>";
    mt.style.top = (hp+175).toString() +"px"; 
    mt.style.left = window.pageXOffset +"px";
}

/**************************************************************/
/*main View FKT*/
/**************************************************************/
function makeueberschriftDundB( ){
	document.getElementById( "info" ).innerHTML = "";
	let menuelem = document.getElementById( "alledmenu" );
    let thebib = "";
    if( currentedseries.toLowerCase ){ //currentedseries is string
        thebib = bibdynvars[ currentedseries ];
    } else {
        for( let c in menuelem.children ){
    	    if( c == currentedseries ){
        	    thebib = bibdynvars[ menuelem.children[c].innerHTML ];
		    }
	    }
    }
    
	if( thebib ){
		for( let i = 0; i < thebib.length; i++ ){
	        if( thebib[ i ][0] == currented ){
	            let b = thebib[ i ];
	            let ielem = document.getElementById( "info" );
	            ielem.style.height = "auto";
	            let editor = document.createElement("div");
	            editor.className = "reditor";
	            editor.innerHTML = b[2];
	            ielem.appendChild( editor );
	            let titel = document.createElement("div");
	            titel.className = "redtitle";
	            titel.innerHTML = b[3];
	            ielem.appendChild( titel );
	            let tuo = document.createElement("div");
	            tuo.className = "rtuo";
	            tuo.innerHTML = b[4] +" "+ b[5];
	            ielem.appendChild( tuo );
	            let beleg = document.createElement("div");
	            beleg.className = "beleg";
	            beleg.innerHTML = b[6];
	            ielem.appendChild( beleg );
	            let sou = document.createElement("div");
	            sou.className = "onlinesource";
	            sou.innerHTML = b[1];
	            ielem.appendChild( sou );
	        }
		}
	} else if( textnames ) {
  		let ielem = document.getElementById( "info" );
  		ielem.style.height = "auto";
  		let n = textnames[ currented ][1].split("_");
  		let nn = n.join( "." );
  		let editor = document.createElement("div");
  		editor.className = "reditor";
  		editor.innerHTML = nn;
  		ielem.appendChild( editor );
  		n = textnames[ currented ][2].split("_");
  		nn = n.join( "." );
  		let titel = document.createElement("div");
  		titel.className = "redtitle";
  		titel.innerHTML = nn;
  		ielem.appendChild( titel );
  		let nnn = textnames[ currented ][3].split(".");
        nnn.pop();
  		let tuo = document.createElement("div");
  		tuo.className = "rtuo";
  		tuo.innerHTML = nnn.join(".");
  		ielem.appendChild( tuo );
	}
}

function comparatiodetail( aindex ){
    buildcomparatiotogether( currented );
    whichview = 0;
    linecount = 0;
    linehinstory = [];
    let velem = document.getElementById( "vergleich" );
    velem.innerHTML = "";
    velem.style.height = "100%";
    velem.style.width = "99%";
    makeueberschriftDundB( );  
    firstwordindex = aindex;
    lastwordindex = renderlines( firstwordindex, maxlines ); 
    colornewonscreen();
}

function comparatiointerlin( aindex ){
    buildcomparatiowico( currented );
    whichview = 6;
    linecount = 0;
    linehinstory = [];
    document.getElementById( "info" ).innerHTML = "";
    let vergelem = document.getElementById( "vergleich" );
    vergelem.innerHTML = "";
    vergelem.style.width = "100000px";
    vergelem.style.height = "100%";
    firstwordindex = aindex;
    lastwordindex = renderlinesinterlin( firstwordindex, Math.floor(maxlines/2) ); 
    colornewonscreen();
}

function comparatiomatrix( ){
    let r = window.confirm("Diese Darstellung eignet sich nur für kürzere Text, denn alle Texte, werden mit all ihren Vergleichsergebnissen dargestellt. Bei großen Texten könnte dies ihren Browser erheblich belasten.");
    if (r == false) {
      comparatioparallel( 0 );
      return;
    } 
    linecount = 0;
    document.getElementById( "info" ).innerHTML = "";
    let vergelem = document.getElementById( "vergleich" );
    vergelem.innerHTML = "";
    vergelem.style.width = "100000px";
    vergelem.style.height = "100%";
    let menuelem = document.getElementById( "alledmenu" );
    whichview = 5;
    let savecurrented = currented;
    //renderlinesparallel for all
    for( let edid = 0; edid <= alltexts.length-1; edid = edid + 1 ){
            currented = edid;
            buildcomparatiowico( currented );
            let infoma = document.createElement("div");
            infoma.className = "mainfo";
            vergelem.appendChild( infoma );
            //info
            let thebib = "";
            if( currentedseries.toLowerCase ){ //currentedseries is string
                thebib = bibdynvars[currentedseries];
            } else {
                for( let c in menuelem.children ){
        	        if( c == currentedseries ){
            	        thebib = bibdynvars[ menuelem.children[c].innerHTML ];
		            }
	            }
            }
            

            if( thebib ){
                 let b = thebib[ currented ];
                 let editor = document.createElement("div");
      		        editor.className = "reditorPma";
      		        editor.innerHTML = b[2] +"; " + b[4] +" "+ b[5] + "<br/>"+ b[3] +"; "+b[6];
      		        infoma.appendChild( editor );
                for( let i = 0; i < thebib.length; i++ ){
			        if( i != currented ){
            		    b = thebib[ i ];
                        let editor = document.createElement("div");
      		            editor.className = "reditorPma";
      		            editor.innerHTML = b[2] +"; " + b[4] +" "+ b[5] + "<br/>"+ b[3] +"; "+b[6];
      		            infoma.appendChild( editor );
                    }
		        }
            } else {
                
                 let editor = document.createElement("div");
      		        editor.className = "reditorPma";
      		        editor.innerHTML = textnames[ currented ][1]+"; "+ textnames[ currented ][2] +" "+ textnames[ currented ][3].split(".txt")[0];
      		        infoma.appendChild( editor );
                for( let i = 0; i < textnames.length; i++ ){
			        if( i != currented ){
            		    let b = textnames[ i ];
                        let editor = document.createElement("div");
      		            editor.className = "reditorPma";
      		            editor.innerHTML =  b[1]+"; "+ b[2] +" "+ b[3].split(".txt")[0];
      		            infoma.appendChild( editor );
                    }
		        }

            }
            let zeile = document.createElement("div");
            zeile.className = "mazeile";
            vergelem.appendChild( zeile );
            let refspan = document.createElement("span");
            refspan.className = "maref";
            zeile.appendChild( refspan );
            for( let e = 0; e < alltexts.length; e = e + 1 ){
                if( e != currented ){
                    let elem = document.createElement("span");
                    elem.className = "maverglt";
                    elem.id = e.toString( );
                    zeile.appendChild( elem );
                }
            } 
            renderlinesparallel( 0, 100000000000, zeile.children );
            for( let e = 0; e < alltexts.length; e++ ){
                infoma.children[e].style.width = (zeile.children[e].offsetWidth-13).toString() + "px";
            }
     }
    colornewonscreen( );
}

function comparatioparallel( aindex ){
    rscrollconfig = 0;
    moretextoffset = 0;
    buildcomparatiowico( currented );
    let vergelem = document.getElementById( "vergleich" );
    vergelem.innerHTML = "";
    whichview = 1;
    linecount = 0;
    linehinstory = [];
    vergelem.style.width = "100000px";
    let thetextelems = [];
  
    let refspan = document.createElement("span");
    refspan.className = "ref";
    refspan.id = "ref";
    vergelem.appendChild( refspan );
      for( let edid = 0; edid <= alltexts.length-1; edid = edid + 1 ){
          if(edid != currented ){
                let elem = document.createElement("span");
                elem.className = "verglt";
                elem.id = edid.toString( );
                vergelem.appendChild( elem );
          }
      } 
    firstwordindex = aindex;
    lastwordindex = renderlinesparallel( firstwordindex, maxlines, vergelem.children );
    colornewonscreen();
    /*build the hearder*/
    document.getElementById( "info" ).innerHTML = "";
    let menuelem = document.getElementById( "alledmenu" );
    let ielem = document.getElementById( "info" );
    ielem.style.height = "50px";
    let thebib = "";
    if( currentedseries.toLowerCase ){ //currentedseries is string
        thebib = bibdynvars[currentedseries];
    } else {
        for( let c in menuelem.children ){
        	if( c == currentedseries ){
            	thebib = bibdynvars[ menuelem.children[c].innerHTML ];
		    }
	    }
    }
	if( thebib ){
		let b = thebib[currented];
        for(let i = 0; i < thebib.length; i++){
			if( thebib[ i ][0] == currented ){
        		b = thebib[ i ];
			}	
		}
  		let editor = document.createElement("div");
  		editor.className = "reditorP";
  		editor.style.position = "absolute";
  		let posofreftext = getpositiononpage( vergelem.children[0] );
  		editor.style.left = posofreftext[1].toString() + "px";
  		editor.innerHTML = b[2] +"; " + b[4] +" "+ b[5] + "<br/>"+ b[3] +"; "+b[6];
  		ielem.appendChild( editor );
  		for( let tn = 1; tn < vergelem.children.length; tn++ ){
			let indexverg = parseInt( vergelem.children[ tn ].id );

			for(let i = 0; i < thebib.length; i++){
				if( thebib[ i ][0] == indexverg ){
        			b = thebib[ i ];
				}
			}
     		let editor = document.createElement("div");
      		editor.className = "reditorP";
      		editor.style.position = "absolute";
      
      		let posofreftext = getpositiononpage( vergelem.children[ tn ] );
      		editor.style.left = posofreftext[1].toString() + "px";
      		editor.innerHTML = b[2] +"; " + b[4] +" "+ b[5] + "<br/>"+ b[3] +"; "+b[6];
      		ielem.appendChild( editor );
		}
    } else {
  		let n = textnames[ currented ][1].split("_");
  		let nn = n.join( "." );
        let nnn = textnames[ currented ][3].split(".");
        nnn.pop();
  		let rtuo = nnn.join(".");
  		let editor = document.createElement("div");
  		editor.className = "reditorP";
  		editor.style.position = "absolute";
  		let posofreftext = getpositiononpage( vergelem.children[0] );
  		editor.style.left = posofreftext[1].toString() + "px";

		let t = textnames[ currented ][2].split("_");
  		let tt = t.join( "." );
  		editor.innerHTML = nn +"; <br/> "+ tt + "; " + rtuo;
  		ielem.appendChild( editor );
  		for( let tn = 1; tn < vergelem.children.length; tn++ ){
            let number = parseInt( vergelem.children[ tn ].id );
      		n = textnames[ number ][1].split("_");
      		nn = n.join( "." );
            let nnn = textnames[ number ][3].split(".");
            nnn.pop();
      		rtuo = nnn.join( "." );
      		let editor = document.createElement("div");
      		editor.className = "reditorP";
      		editor.style.position = "absolute";
      		let t = textnames[ number ][2].split("_");
  			let tt = t.join( "." );
     		let posofreftext = getpositiononpage( vergelem.children[ tn ] );
      		editor.style.left = posofreftext[1].toString() + "px";
      		editor.innerHTML = nn +"; <br/> "+ tt + "; " + rtuo;
      		ielem.appendChild( editor );
  		}
    }
  	window.setTimeout(correctpositionofInfoparallel, howlogtowaitfirstlineheightrender);
	howlogtowaitfirstlineheightrender = 0;
}

function correctpositionofInfoparallel( ){
	let vergelem = document.getElementById( "vergleich" );
	let infoelem = document.getElementById( "info" );
	for( let tn = 0; tn < vergelem.children.length; tn++ ){
        let posofreftext = getpositiononpage( vergelem.children[ tn ] );
        if(tn == 1){
            infoelem.children[ tn ].style.width = (vergelem.children[ tn ].offsetWidth-16).toString() + "px";
            infoelem.children[ tn ].style.left = (posofreftext[1]+vergelem.children[ tn ].style.paddingLeft).toString() + "px";
        } else {
            infoelem.children[ tn ].style.width = (vergelem.children[ tn ].offsetWidth-16).toString() + "px";
            infoelem.children[ tn ].style.left = posofreftext[1].toString() + "px";
        }
    }
	//correct lenght of vergleich box
	let l = vergelem.children[0].children.length;
	lineheight = vergelem.children[0].children[0].offsetHeight;
  	vergelem.style.height = ((lineheight*l) +moretextoffset).toString() + "px";
}

function comparatiobuch( aindex ){
    buildcomparatiotogether( currented );
    linecount = 0;
    linehinstory = [];
    whichview = 2;
    let velem = document.getElementById( "vergleich" );
    velem.innerHTML = "";
    velem.style.height = "100%";
    velem.style.width = "99%";
    makeueberschriftDundB( );
    let apparatelem = document.createElement( "div" );
    apparatelem.id = "apparat";
    let al = document.createElement( "div" );
    al.id = "apparatline";
    let textverelem = document.createElement( "div" );
    textverelem.id = "textver";
    //define height of thext elems 
    apparatelem.style.height = "auto";
    apparatelem.style.width = "90%";
    textverelem.style.height = "auto"; 
    textverelem.style.width = "100%";
    velem.appendChild( textverelem );
    velem.appendChild( al );
    velem.appendChild( apparatelem );
    firstwordindex = aindex;
    lastwordindex = renderlinesBuch( firstwordindex, Math.floor( maxlines / 2 ) );
    colornewonscreen();
}

function comparatiodiagramm( aindex ){
	whichview = 4;
	let velem = document.getElementById( "vergleich" );
    velem.innerHTML = "";
	velem.style.height = "100%";
  	velem.style.width = "99%";
	makeueberschriftDundB( );
	//tabelle
  	let labeltabellendiv = document.createElement( "div" );
	labeltabellendiv.className = "dialabel";
	labeltabellendiv.innerHTML = "<br>Unterschiede in Zahlen:";
	let tabellendiv = document.createElement( "div" );
	tabellendiv.innerHTML = textSTAT( 1 );
	velem.appendChild( labeltabellendiv );
	velem.appendChild( tabellendiv );
	//balkendiagramm
	let labelXYdiv = document.createElement( "div" );
    labelXYdiv.style.width = "420px";
	labelXYdiv.className = "dialabel";
	labelXYdiv.innerHTML = "Nach Unterschieden gezählt:";
	let XYdiv = document.createElement( "div" );
	XYdiv.appendChild( getunterschSVG() );
	velem.appendChild( labelXYdiv );
	velem.appendChild( XYdiv );
	//dichte und lokalisation
	buildcomparatiowico( currented );
	let labelDichtediv = document.createElement( "div" );
	labelDichtediv.className = "dialabel";
	labelDichtediv.innerHTML = "Vergleich der Vergleiche:";
	let Dichtediv = document.createElement( "div" );
	Dichtediv.appendChild( getposdichteSVG() );
    Dichtediv.id = "svgtodownload";
	velem.appendChild( labelDichtediv );
	velem.appendChild( Dichtediv );
    let downbuttDivv = document.createElement( "div" );
    downbuttDivv.innerHTML = "Download SVG";
    downbuttDivv.className = "clickable";
    downbuttDivv.title = "Mit dieser Funktion können sie den Vergleich der Vergleiche herunter laden.";
	downbuttDivv.style.background = "lightgray";
	downbuttDivv.onclick = function() { dodownit( document.getElementById( "svgtodownload" ).innerHTML, currentedseries+'.svg','image/svg+xml' ); };
    velem.appendChild( downbuttDivv );
}

/**************************************************************/
/*EDITION TEXT FKT*/
/**************************************************************/

function typographmessure( ){
    let velem = document.getElementById( "vergleich" );
    velem.style.fontFamily = "gentiumplus";
    velem.innerHTML = "Test";
    lineheight = velem.offsetHeight;
    velem.innerHTML = "";
    velem.style.width = "70%";
    linewidth = velem.offsetWidth;
    velem.innerHTML = "";
    velem.style.width = "99%";
    let v = 0;
    try{
        v = document.getElementById( "allmenu" ).offsetHeight;
    } catch (e){ } //allmenu is only available in mothership 
    let vv = document.getElementById( "alledmenu" ).offsetHeight;
    let vvv = document.getElementById( "edmenu" ).offsetHeight;
    let vvvv = document.getElementById( "viewmenu" ).offsetHeight;
    textscreenheight = screen.height - (v + vv + vvv + vvvv + 50);
    textscreenwidth = screen.width;
    maxlines = Math.floor( textscreenheight / lineheight );
    velem.style.fontFamily = "Helvetica";
}

function selectED( elem ){
    selectEDbyID( parseInt( elem.name ) );
}

function selectEDbyID( indexofed ){
    lastwordindex = 0;
    firstwordindex = 0;
    linecount = 0;
    lastvisibleline = 0;
    firstvisibleline = 0;
    currented = indexofed;
    if( whichview == 0 ){
      comparatiodetail( 0 );
    } else if( whichview == 1) {
      comparatioparallel( 0 );
    } else if( whichview == 2 ){
      comparatiobuch( 0 );
    } else if( whichview == 5 ){
      comparatiomatrix( );
    } else if( whichview == 4 ){
		comparatiodiagramm( 0 );
	} else {
        comparatiointerlin( 0 );
    }
	colornewonscreen( );//coloring for the selection of diffs
}

function hidevarianten( id, elem, oldhtml ){
	document.getElementById( id ).style.display = "none";
	document.getElementById( id ).innerHTML = oldhtml;
	elem.style.background = "lightgray";
	elem.onclick = function( ) { showvarianten( this.getAttribute("name"), this); };
}

function showvarianten( id, elem ){
	document.getElementById( id ).style.display = "block";
	document.getElementById( id ).style.position = "absolute";
	let posofmarker = getpositiononpage( elem );
	document.getElementById( id ).style.left = (posofmarker[1]+10) + "px";
	document.getElementById( id ).style.top = (posofmarker[0]+10) + "px";
	let numberof = document.getElementById( id ).children[ 0 ].getAttribute("name");
	let theallhtml = "";
	let thetemphtml = "";
	let oldhtml = "";
	for( let c = 0; c < document.getElementById( id ).children.length; c++ ){
		if( document.getElementById( id ).children[ c ].getAttribute("name") != numberof ){
			let tn = textnames[ parseInt(numberof) ];
			let name = "<div class='st'>("+tn[1].replace(/ _ /g,",").replace(/_/g,".") +")</div>";
			let currenthtml = thetemphtml + name;
			theallhtml = theallhtml + currenthtml;
			thetemphtml = "";
		} 
		thetemphtml = thetemphtml + "<span class='"+document.getElementById( id ).children[ c ].getAttribute( "class" )+"' name='"+numberof+"'>" +document.getElementById( id ).children[ c ].innerHTML +"</span>";
		numberof = document.getElementById( id ).children[ c ].getAttribute( "name" );
	}
	if( thetemphtml != "" ){
		let tn = textnames[ parseInt(numberof) ];
			let name = "<div class='st'>("+tn[1].replace(/_/g,".") +")</div>";
			let currenthtml = thetemphtml+name;
			theallhtml = theallhtml + currenthtml.replace(/\<br\>\<\/br\>/g,"UMBRUCH<br></br>");
			thetemphtml = "";
	}
	oldhtml = document.getElementById( id ).innerHTML;
	document.getElementById( id ).innerHTML = theallhtml;
	if(document.getElementById( id ).className.indexOf( "shaped" ) == -1){
		document.getElementById( id ).className += " shaped";
	} 
	elem.onclick = function( ) { hidevarianten(id, this, oldhtml); };
}

function sizeline( id, sizeinpercent ){
    let elem = document.getElementById( id );
    elem.style.fontSize = sizeinpercent;
    for( let c = 0; c <= elem.children.length-1; c = c+1 ){
        if( elem.children[ c ].style != undefined && 
            elem.children[ c ] != undefined ){
                elem.children[ c ].style.fontSize = sizeinpercent;
        }
    }
}

function prevSTEP( ){
    //finde anzahl der worte in den lines zuvor
    let vergelem = document.getElementById( "vergleich" );
    if( whichview == 2 ){
        vergelem = document.getElementById( "textver" );
    }  
    let verl = vergelem.children.length;
    if( whichview == 1 ){
         verl = document.getElementById( "ref" ).children.length;
    }
    let ddd = rendercount; //how much is rendered
    let diffof = linehinstory.length - verl;
    
    if( rendercount > diffof ){
        ddd = diffof;
    }
    let NEWINDEX = 0;
    if( renderstyle == 0 ){
        for( let v = 0; v < verl+ddd; v += 1 ){
            if(linehinstory.length != 0){
                //console.log("eine");
                linehinstory.pop();
				linecount -= 1;        
            } 
                
        }
        if( linehinstory.length != 0 ){
            NEWINDEX = linehinstory[ linehinstory.length-1 ]+1;
        }
    } else {
        if( blockhistory.length > 0 ){
            let n = blockhistory.pop( );
            NEWINDEX = blockhistory[ blockhistory.length-1 ][0];
            verl = blockhistory[ blockhistory.length-1 ][1];
            linecount -= vergelem.children.length+verl-2;
        } else {
            NEWINDEX = 0;
            verl = 10;
            linecount = 0;
        }
    }

    //run the render functions on the whole do display
    if( whichview == 0 ){
        vergelem.innerHTML = "";
        lastwordindex = renderlines( NEWINDEX, verl );
    } else if( whichview == 1 ){ //parallelview
        for( let elemi = 0; elemi < vergelem.children.length; elemi = elemi + 1){
            while ( vergelem.children[elemi].hasChildNodes( ) ) { 
                vergelem.children[elemi].removeChild( vergelem.children[elemi].firstChild ); 
            }
        }
        lastwordindex = renderlinesparallel( NEWINDEX, verl, vergelem.children );
        vergelem.style.height = vergelem.offsetHeight + "px";
		correctpositionofInfoparallel( );
    } else if(whichview == 2){ //buchview
        document.getElementById( "textver" ).innerHTML = "";
        document.getElementById( "apparat" ).innerHTML = "";
        lastwordindex = renderlinesBuch( NEWINDEX, verl );
    } else if(whichview == 6){ //interlinear
        vergelem.innerHTML = "";
        //console.log(NEWINDEX, verl);
        lastwordindex = renderlinesinterlin( NEWINDEX, (verl*alltexts.length) );

    } else { //bild-view

    }
	colornewonscreen( );
}

function nextSTEP( ){
	//if last line is rendered - just do nothing:
    //console.log(lastwordindex, alltexts[ currented ].length-1);
	if( lastwordindex >= alltexts[ currented ].length-1 || lastwordindex == undefined ){
			return;
	}
    //render screenlines
    let vergelem = document.getElementById( "vergleich" );
    let goon = 0;
    let ddd = rendercount;
    if( oldrendercount != rendercount ){
        ddd = oldrendercount;
    }
    if( whichview == 0 ){
        while( vergelem.hasChildNodes( ) && goon < ddd ){ 
            vergelem.removeChild( vergelem.firstChild ); 
            if( renderstyle == 0 ){
                goon += 1; 
            }
        }
        let indexlength = [ lastwordindex ];
        lastwordindex = renderlines( lastwordindex, rendercount );
        indexlength.push( vergelem.children.length );
        if( renderstyle != 0 ){
            blockhistory.push( indexlength );
        }
    } else if( whichview == 1 ){ //parallelview
        for( let elemi = 0; elemi < vergelem.children.length; elemi = elemi + 1 ){
            goon = 0;
            while ( vergelem.children[elemi].hasChildNodes() && goon < ddd) { 
                vergelem.children[ elemi ].removeChild( vergelem.children[elemi].firstChild ); 
                if( renderstyle == 0 ){
                    goon += 1; 
                }                
            }
        }
        let indexlength = [ lastwordindex ];
        lastwordindex = renderlinesparallel( lastwordindex+1, rendercount, vergelem.children ); 
        indexlength.push( document.getElementById( "ref" ).children.length );
		correctpositionofInfoparallel( );
        if( renderstyle != 0 ){
            blockhistory.push( indexlength );
        }
    } else if( whichview == 2 ) { //buchview
        let aelem = document.getElementById( "apparat" );
        let indexlength = [lastwordindex];
        while( vergelem.children[0].hasChildNodes() && goon < ddd ){ 
            vergelem.children[0].removeChild( vergelem.children[0].firstChild ); 
            if( renderstyle == 0 ){
                goon += 1; 
            }
        }
        goon = 0;
        while( aelem.hasChildNodes( ) && goon < ddd ){
            aelem.removeChild( aelem.firstChild );
            if( renderstyle == 0 ){
                goon += 1; 
            }
        }        
        lastwordindex = renderlinesBuch( lastwordindex, rendercount );
        indexlength.push( vergelem.children[0].length );
        if( renderstyle != 0 ){
            blockhistory.push( indexlength );
        }
    } else if( whichview == 6 ) { // interlinear 

        while( vergelem.hasChildNodes( ) && goon < ddd ){ 
            vergelem.removeChild( vergelem.firstChild ); 
            if( renderstyle == 0 ){
                goon += 1; 
            }
        }
        //console.log("lastwordindex", lastwordindex, rendercount);
        let indexlength = [ lastwordindex ];
        lastwordindex = renderlinesinterlin( lastwordindex+1, rendercount );
        //console.log(lastwordindex);
        indexlength.push( vergelem.children.length );
        if( renderstyle != 0 ){
            blockhistory.push( indexlength );
        }

    } else { //bildview

    }
    oldrendercount = rendercount;
	colornewonscreen( );
}


function handelaTOOlonPline( elem ){
	if( document.getElementById( elem.name ).style.display.indexOf("inline") != -1 ){
		document.getElementById( elem.name ).style.display = "none";
		elem.innerHTML = " ⥤";
	} else {
		document.getElementById( elem.name ).style.display = "inline";
		elem.innerHTML = " ⥢";
	} 
}

function renderlinesinterlin( wordstart, howmanylines ){
    let templinecount = 0;
    let container = document.getElementById( "vergleich" );
    let perlinecontainer = document.createElement("div");
    perlinecontainer.className = "interlline";
    let templinewidth = 200;
    let wordnumtoreturn = 0;
    /**/
    
    let thebib = "";
    if( currentedseries.toLowerCase ){ //currentedseries is string
        thebib = bibdynvars[currentedseries];
    } else {
        for( let c in menuelem.children ){
        	if( c == currentedseries ){
            	thebib = bibdynvars[ menuelem.children[c].innerHTML ];
		    }
	    }
    }

    if( thebib == null ){
        thebib = textnames;
    }

    let editorstack = document.createElement("div");
        editorstack.className = "editorstack";
        
    let aed =  document.createElement("div");
        aed.innerHTML = thebib[ currented ][2];
        aed.style.height = lineheight.toString()+"px";
        aed.style.overflow = "hidden";
        aed.className = "stacked";
    editorstack.appendChild( aed );
    
    for(let reihe = 0; reihe < alltexts.length; reihe++ ){
        if( currented != reihe ){
            let aed =  document.createElement("div");
            aed.innerHTML = thebib[ reihe ][2];
            aed.style.height = lineheight.toString()+"px";
            aed.style.overflow = "hidden";
            aed.className = "stacked";
            editorstack.appendChild( aed );
        }
    }
    let linenumelem = document.createElement("span");
            linenumelem.className = "linenum wordstack";
            linenumelem.innerHTML = linecount+templinecount;
            
            perlinecontainer.appendChild( linenumelem );
    perlinecontainer.appendChild( editorstack );

    for( let wi = wordstart; wi < alltexts[ currented ].length; wi = wi+1 ){
        
        let wordstack = document.createElement("div");
        wordstack.className = "wordstack";
        perlinecontainer.appendChild( wordstack );
        let refword = document.createElement("div");
        refword.innerHTML = alltexts[ currented ][wi] + " ";
        refword.className = "stacked";
        refword.style.height = lineheight.toString()+"px";
        wordstack.appendChild( refword );
        templinewidth += (alltexts[ currented ][wi].length*9);//anzahl der buchstaben mal durch schnittliche 
        

        

        let Us = wico[ wi.toString() ];
        
        if( Us != undefined ){  
            for(let reihe = 0; reihe < alltexts.length; reihe++ ){
            
            if( currented != reihe  ){
                let dispan = document.createElement("div");
                dispan.className = "stacked";
                dispan.style.height = lineheight.toString()+"px";
                for( let di in Us ){

                
                    if( reihe == Us[di][0] ){
			            if(alltexts[ Us[di][0] ][ Us[di][1] ] == undefined){
                            dispan.innerHTML = "GAB";
				            continue;
			            }

                
                dispan.setAttribute("name", Us[di][0].toString()); 
                dispan.setAttribute("title", wi.toString());
                if(dodebug == 1){
                    dispan.innerHTML = dispan.innerHTML+" " + alltexts[ Us[di][0] ][ Us[di][1] ] + "<sub>"+wi.toString()+","+Us[di][1].toString()+"</sub>";
                } else {
                    dispan.innerHTML = dispan.innerHTML+ " " + alltexts[ Us[di][0] ][ Us[di][1] ];
                }
				if( Us[di][2] != "" ){
                    let disup = document.createElement("sup");
				    let tempclasssup = "";
				    let givvenclasssup = Us[di][2];
				    if( givvenclasssup.indexOf(" T") != -1 ){
					    tempclasssup = tempclasssup + " " + TU;
						dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" C") != -1 ){
						tempclasssup = tempclasssup + " " + GK;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" D") != -1 ){
						tempclasssup = tempclasssup + " " + DK;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" L") != -1 ){
						tempclasssup = tempclasssup + " " + LI;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" U") != -1 ){
						tempclasssup = tempclasssup + " " + UM;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" Z") != -1 ){
					    tempclasssup = tempclasssup + " " + ZK;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" M") != -1 ){
					    tempclasssup = tempclasssup + " " + ME;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" W") != -1 ){
					    tempclasssup = tempclasssup + " " + WE;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" I") != -1 ){
					    tempclasssup = tempclasssup + " " + INTERP;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" K") != -1 ){
					    tempclasssup = tempclasssup + " " + KK;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" V") != -1 ){
					    tempclasssup = tempclasssup + " " + UV;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" vERT") != -1 ){
					    tempclasssup = tempclasssup + " " + VERT;
					    dispan.className = "diffil" + Us[di][2];
				    }
                    if( givvenclasssup.indexOf(" vErdRE") != -1 ){
					    tempclasssup = tempclasssup + " " + VERDRE;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" mIAT") != -1 ){
					    tempclasssup = MIAT;
					    dispan.className = "diffil" + Us[di][2];
				    }
		    	    if( givvenclasssup.indexOf(" EiN") != -1 ){
					    tempclasssup = tempclasssup + " " + EIN;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" dist") != -1 ){
					    tempclasssup = tempclasssup + " " + DIST;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" wtn") != -1 ){
					    tempclasssup = tempclasssup + " " + WTN;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" vwt") != -1 ){
					    tempclasssup = tempclasssup + " " + VWT;
					    dispan.className = "diffil" + Us[di][2];
				    }
                    dispan.className = dispan.className +" stacked";
                    disup.innerHTML = tempclasssup;
                    dispan.appendChild( disup );
                }
                
                wordstack.appendChild( dispan );
				}//ifreihe zu
            }
            if( dispan.innerHTML == "" ){
                            dispan.className = "diffil T bonbon stacked"
                            dispan.innerHTML = " "+bonbon+" ";
                wordstack.appendChild( dispan );
            }
            }//icurrednum!=reihe zu
            }
        } 
        
        if( templinewidth >= linewidth ){
            linehinstory.push( wi );
            templinecount += 1;
            container.appendChild( perlinecontainer );
            perlinecontainer = document.createElement("div");
            perlinecontainer.className = "interlline";
            let linenumelem = document.createElement("span");
            linenumelem.className = "linenum wordstack";
            linenumelem.innerHTML = linecount+ templinecount;
            
            perlinecontainer.appendChild( linenumelem );
            perlinecontainer.appendChild( editorstack.cloneNode(true) );
            templinewidth = 200;
            
        }
        
        //länge des angezeigten textes
        wordnumtoreturn = wi;
        if( howmanylines <= (templinecount * alltexts.length) ){
            
            break;
    
        }
    }
    //console.log(perlinecontainer.children.length);
    if(perlinecontainer.children.length > 2){
        linehinstory.push( wordnumtoreturn );
        container.appendChild( perlinecontainer );
    }
    
    
    linecount += templinecount;
    
    return wordnumtoreturn;
}

function renderlinesparallel( wordstart, howmanylines, elemarray ){
    let templinecount = 0;
    let templinelength = 0;
    let wocount = 0;
    let linearray = []; 
    let countfreelines = 0;
    let howlong = alltexts[ currented ].length-1;
    if( !( wordstart < howlong ) ){
        return;
    }
    for( let elemi = 0; elemi < elemarray.length; elemi = elemi + 1 ){
        let linediv = document.createElement("div");
        linediv.className = "pline";
        let linenumelem = document.createElement("span");
        linenumelem.className = "linenum";
        linenumelem.innerHTML = linecount + templinecount;
        linediv.appendChild( linenumelem );
        elemarray[ elemi ].appendChild( linediv );
    }
    for( let wi = wordstart; wi < alltexts[ currented ].length; wi = wi+1 ){

        if( renderstyle == 0 ){
            if( Math.abs( howmanylines ) <= templinecount || wi ==  alltexts[ currented ].length ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
				for( let elemi = 0; elemi < elemarray.length; elemi = elemi + 1){
		            if(elemarray[ elemi ].lastChild.offsetWidth > (parallelpartwidth+140) && doverk ){
			            let toolongspan = document.createElement("span");
			            toolongspan.innerHTML = " ⥤";
			            toolongspan.style.cursor = "pointer";
			            toolongspan.className = "toolong";
			            let aid = elemarray[ elemi ].lastChild.firstChild.innerHTML+"toolo"+elemi.toString();
			            toolongspan.name = aid;
			            toolongspan.onclick = function(){ handelaTOOlonPline( this ); };
			            let hidetoolong = document.createElement("span");
			            hidetoolong.id = aid;
			            hidetoolong.style.display = "none";
			            while ( elemarray[ elemi ].lastChild.childNodes.length > 2 ) {
                			hidetoolong.appendChild( elemarray[ elemi ].lastChild.childNodes[2]);
			            }
			            elemarray[ elemi ].lastChild.appendChild( hidetoolong );
			            elemarray[ elemi ].lastChild.appendChild( toolongspan );
		            }
                }
                return wi;
            }
        } else if(renderstyle == 1){ //absatz
            if( countfreelines == 2 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                return wi;
            }
        } else if( renderstyle == 2 ){ //spalte
            if( countfreelines == 3 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                //console.log(countfreelines);
                return wi;
            }
        } else if( renderstyle == 3 ){ //seite
            if( countfreelines == 4 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                //console.log(countfreelines);
                return wi;
            }
        }
        let intoit = alltexts[ currented ][ wi ];
        if( intoit == "" || intoit == " " ){
            countfreelines += 1;
        } else {
            countfreelines = 0;
        }
        let cuwo = intoit;
        let refword = document.createElement("span");
        if(dodebug == 1){
            refword.innerHTML = " " + cuwo + "<sub> " + wi.toString() + "</sub>";
        } else {
            refword.innerHTML = " " + cuwo;
        }
	    if(colorindex != null && colorindex == wi){
	        refword.className = "urn";
	    }
        if( currentedseries.toLowerCase ){
            refword.id = "parallel:"+currentedseries+":"+(currented+1)+":"+(wi+1).toString();
        } else {
            refword.id = "parallel:"+(currentedseries+1)+":"+(currented+1)+":"+(wi+1).toString();
        }
        elemarray[ 0 ].lastChild.appendChild( refword );
        templinelength = templinelength + refword.offsetWidth;
        let Us = wico[ wi.toString() ]; //in der wico scheint das letzte wort zu fehlen
        let dojustonce = 0;
        if( Us != undefined ){  
            for( let di in Us ){
			    if(alltexts[ Us[di][0] ][ Us[di][1] ] == undefined){
                    let dispan = document.createElement("span");
                    dispan.innerHTML = "GAB";
				    continue;
			    }
				let dispan = document.createElement("span");
                dispan.setAttribute("name", Us[di][0].toString()); 
                dispan.setAttribute("title", wi.toString());
                if(dodebug == 1){
                    dispan.innerHTML = " " + alltexts[ Us[di][0] ][ Us[di][1] ] + "<sub>"+wi.toString()+","+Us[di][1].toString()+"</sub>";
                } else {
                    dispan.innerHTML = " " + alltexts[ Us[di][0] ][ Us[di][1] ];
                }
				if( Us[di][2] != "" ){
                    let disup = document.createElement("sup");
				    let tempclasssup = "";
				    let givvenclasssup = Us[di][2];
				    if( givvenclasssup.indexOf(" T") != -1 ){
					    tempclasssup = tempclasssup + " " + TU;
						dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" C") != -1 ){
						tempclasssup = tempclasssup + " " + GK;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" D") != -1 ){
						tempclasssup = tempclasssup + " " + DK;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" L") != -1 ){
						tempclasssup = tempclasssup + " " + LI;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" U") != -1 ){
						tempclasssup = tempclasssup + " " + UM;
						dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" Z") != -1 ){
					    tempclasssup = tempclasssup + " " + ZK;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" M") != -1 ){
					    tempclasssup = tempclasssup + " " + ME;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" W") != -1 ){
					    tempclasssup = tempclasssup + " " + WE;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" I") != -1 ){
					    tempclasssup = tempclasssup + " " + INTERP;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" K") != -1 ){
					    tempclasssup = tempclasssup + " " + KK;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" V") != -1 ){
					    tempclasssup = tempclasssup + " " + UV;
					    dispan.className = "diffilerwgl" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" vERT") != -1 ){
					    tempclasssup = tempclasssup + " " + VERT;
					    dispan.className = "diffil" + Us[di][2];
				    }
                    if( givvenclasssup.indexOf(" vErdRE") != -1 ){
					    tempclasssup = tempclasssup + " " + VERDRE;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" mIAT") != -1 ){
					    tempclasssup = MIAT;
					    dispan.className = "diffil" + Us[di][2];
				    }
		    	    if( givvenclasssup.indexOf(" EiN") != -1 ){
					    tempclasssup = tempclasssup + " " + EIN;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" dist") != -1 ){
					    tempclasssup = tempclasssup + " " + DIST;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" wtn") != -1 ){
					    tempclasssup = tempclasssup + " " + WTN;
					    dispan.className = "diffil" + Us[di][2];
				    }
				    if( givvenclasssup.indexOf(" vwt") != -1 ){
					    tempclasssup = tempclasssup + " " + VWT;
					    dispan.className = "diffil" + Us[di][2];
				    }
                    disup.innerHTML = tempclasssup;
                    dispan.appendChild( disup );
                }
				for( let e in elemarray ){
                    if( parseInt( elemarray[ e ].id ) == Us[di][0] ){
                        let miau = parseInt(dispan.title)- parseInt( elemarray[ e ].lastChild.children[ elemarray[ e ].lastChild.children.length-1 ].title);
                        
                        if( isNaN(miau) && elemarray[ e ].children.length > 1 ){
                            miau = parseInt(dispan.title) - parseInt(elemarray[ e ].children[elemarray[ e ].children.length-2].children[ elemarray[ e ].children[elemarray[ e ].children.length-2].children.length-1 ].title);
                        }
                        
                        
					    if( miau > 1 ){
                            let aa = document.createElement("span");
                            aa.className = "diffil T bonbon"
                            aa.innerHTML = " "+bonbon+" ";
                            elemarray[ e ].lastChild.appendChild(aa);
                        }
                        elemarray[ e ].lastChild.appendChild(dispan);

						if( wi == alltexts[ currented ].length-1 &&
							alltexts[ Us[di][0] ].length-1 > Us[di][1] &&
							dojustonce == 0 ){
							let t = getresttext( Us[di][0], Us[di][1] );
							elemarray[ e ].lastChild.lastChild.innerHTML = elemarray[ e ].lastChild.lastChild.innerHTML + "<br/><span class='moretext'> "+ t +" </span>";
							if( moretextoffset < t.length){
								moretextoffset = t.length;
							}
							dojustonce = 1; //workaround - cant figure out why this runs twice
						}
                    }
                }
            }
        } 
    
        if( templinelength >= (parallelpartwidth-60) ){
            linehinstory.push( wi );
            wocount = 0;
            templinecount += 1;
            if(templinecount == howmanylines && renderstyle == 0){
                linecount = linecount + templinecount;
                return wi;
            }
            for( let elemi = 0; elemi < elemarray.length; elemi = elemi + 1){
                if(elemarray[ elemi ].lastChild.offsetWidth > (parallelpartwidth+130) && doverk ){
			        let toolongspan = document.createElement("span");
			        toolongspan.innerHTML = " ⥤";
			        toolongspan.style.cursor = "pointer";
			        toolongspan.className = "toolong";
			        let aid = elemarray[ elemi ].lastChild.firstChild.innerHTML+"toolo"+elemi.toString();
			        toolongspan.name = aid;
			        toolongspan.onclick = function(){ handelaTOOlonPline(this); };
			
			        let hidetoolong = document.createElement("span");
			        hidetoolong.id = aid;
			        hidetoolong.style.display = "none";
			        while ( elemarray[ elemi ].lastChild.childNodes.length > 2 ) {
            			hidetoolong.appendChild( elemarray[ elemi ].lastChild.childNodes[2]);
			        }
			        elemarray[ elemi ].lastChild.appendChild( hidetoolong );
			        elemarray[ elemi ].lastChild.appendChild( toolongspan );
		        }
                let linediv = document.createElement("div");
                linediv.className = "pline";
                let linenumelem = document.createElement("span");
                linenumelem.className = "linenum";
                linenumelem.innerHTML = linecount + templinecount;
                linediv.appendChild( linenumelem );
                elemarray[ elemi ].appendChild( linediv );
            }
            templinelength = 0;
        }
        wocount += 1;
    }
}

function getresttext( tid, wid ){
	let thestring = "";
	for( let i = wid+1; i < alltexts[tid].length; i++ ){
		thestring = thestring + " " +alltexts[tid][i];
	}
	return thestring
}

function renderlines( wordstart, howmanylines ){
    if(alltexts){
        let velem = document.getElementById( "vergleich" );
        let templinelength = 0;
        let templinecount = 0;
        let wordcount = 0;
        let countempty = 0;
        let linediv = document.createElement("div");
        linediv.className = "line";
        let linenumelem = document.createElement("span");
        linenumelem.className = "linenum";
        linenumelem.innerHTML = linecount + templinecount;
        linediv.appendChild( linenumelem );
        let countfreelines = 0;
        let howlong = alltexts[ currented ].length-1;

        for( let wi = wordstart; wi <= howlong; wi = wi+1 ){

            if(renderstyle == 0){
                if( Math.abs( howmanylines ) <= templinecount || wi ==  alltexts[ currented ].length ){
                    linecount = linecount + templinecount;
                    lastvisibleline = linecount; 
                    return wi;
                }
            } else if(renderstyle == 1){ //absatz
                if( countfreelines == 2 ){
                    linecount = linecount + templinecount;
                    lastvisibleline = linecount; 
                    //console.log(countfreelines);
                    return wi;
                }
            } else if( renderstyle == 2 ){ //spalte
                if( countfreelines == 3 ){
                    linecount = linecount + templinecount;
                    lastvisibleline = linecount; 
                    //console.log(countfreelines);
                    return wi;
                }
            } else if( renderstyle == 3 ){ //seite
                if( countfreelines == 4 ){
                    linecount = linecount + templinecount;
                    lastvisibleline = linecount; 
                    //console.log(countfreelines);
                    return wi;
                }
            } 
            let intoit = alltexts[ currented ][ wi ];
            if( intoit == "" || intoit == " " ){
                countfreelines += 1;
            } else {
                countfreelines = 0;
            }

            let sspan = document.createElement("span");
            if(colorindex != null && colorindex == wi){
                sspan.className = "same urn";
            } else {
                sspan.className = "same";
            }
            if( currentedseries.toLowerCase ){
                sspan.id = "detail:"+currentedseries+":"+(currented+1)+":"+(wi+1).toString();
            } else {
                sspan.id = "detail:"+(currentedseries+1)+":"+(currented+1)+":"+(wi+1).toString();
            }
            sspan.innerHTML = " " + intoit;
            linediv.appendChild( sspan );
            velem.appendChild( linediv );
            templinelength += sspan.offsetWidth;
            let Us = tog[ wi.toString() ];
            if( Us != undefined ){
              templinelength += 5;
              let dmspan = document.createElement("span");
              dmspan.className = "diffmarker";
              dmspan.setAttribute("name", wi.toString()); 
              dmspan.setAttribute("onclick", "showvarianten(this.getAttribute('name'), this)");
              dmspan.innerHTML = "&#9660;";
              let dspan = document.createElement("span");
              dspan.className = "diffbundel";
              dspan.id = wi.toString();
              for( let di in Us ){
                let dispan = document.createElement("span");
                dispan.setAttribute("name", Us[di][0].toString()); 
                //dispan.className = "diff" + Us[di][2];
                let innertext = alltexts[ Us[di][0] ][ Us[di][1] ];
                if(innertext != undefined){
                dispan.innerHTML = innertext;
                let disup = document.createElement("sup");
                let tempclasssup = "";
                let givvenclasssup = Us[di][2];
                if( givvenclasssup.indexOf(" T") != -1 ){
	                tempclasssup = tempclasssup + " " + TU;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf("C") != -1 ){
	                tempclasssup = tempclasssup + " " + GK;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("D") != -1 ){
	                tempclasssup = tempclasssup + " " + DK;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("L") != -1 ){
	                tempclasssup = tempclasssup + " " + LI;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("U") != -1 ){
	                tempclasssup = tempclasssup + " " + UM;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("Z") != -1 ){
	                tempclasssup = tempclasssup + " " + ZK;
	                dispan.className = "differwgl" + Us[di][2];
                }

                if( givvenclasssup.indexOf("W") != -1 ){
	                tempclasssup = tempclasssup + " " + WE;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("I") != -1 ){
	                tempclasssup = tempclasssup + " " + INTERP;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("K") != -1 ){
	                tempclasssup = tempclasssup + " " + KK;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf("V") != -1 ){
	                tempclasssup = tempclasssup + " " + UV;
	                dispan.className = "differwgl" + Us[di][2];
                }
                if( givvenclasssup.indexOf(" vERT") != -1 ){
	                tempclasssup = tempclasssup + " " + VERT;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf(" vErdRE") != -1 ){
	                tempclasssup = tempclasssup + " " + VERDRE;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf(" mIAT") != -1 ){
	                tempclasssup = MIAT;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf("M") != -1 ){
	                tempclasssup = tempclasssup + " " + ME;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf("EiN") != -1 ){
	                tempclasssup = tempclasssup + " " + EIN;
	                dispan.className = "diff" + Us[di][2];
                }
                if( givvenclasssup.indexOf("dist") != -1 ){
	                tempclasssup = tempclasssup + " " + DIST;
	                dispan.className = "diffil" + Us[di][2];
                }
                if( givvenclasssup.indexOf("wtn") != -1 ){
	                tempclasssup = tempclasssup + " " + WTN;
	                dispan.className = "diffil" + Us[di][2];
                }
                if( givvenclasssup.indexOf("vwt") != -1 ){
	                tempclasssup = tempclasssup + " " + VWT;
	                dispan.className = "diffil" + Us[di][2];
                }
                disup.innerHTML = tempclasssup;//Us[di][2];
                dispan.appendChild( disup );
                dspan.appendChild( dispan );
                } 


              }
              if( dspan.children.length > 0 ){
                linediv.appendChild( dmspan );
              	linediv.appendChild( dspan );
              }
            }
            if( templinelength >= linewidth ){
                linehinstory.push( wi );
                let wc = document.createElement("span");
                wc.className = "wordsinline"; 
                wc.innerHTML = wordcount.toString();
                linediv.appendChild( wc );
                wordcount = 0;
                linediv.id = "l" + (linecount+templinecount).toString();
                velem.appendChild( linediv );
                linediv = document.createElement("div");
                linediv.className = "line";
                templinelength = 0;
                templinecount += 1;
                let linenumelem = document.createElement("span");
                linenumelem.className = "linenum";
                linenumelem.innerHTML = linecount + templinecount;
                linediv.appendChild( linenumelem );
            }
            wordcount += 1;
        }
        if(wordstart < howlong){
            velem.appendChild( linediv );
        }
    }
}

function renderlinesBuch( wordstart, howmanylines ){
    let aelem = document.getElementById( "apparat" ); //children of vergleich
    let velem = document.getElementById( "textver" );
    //contoll vars      
    let howlong = alltexts[ currented ].length-1;
    let templinelength = 0;
    let templinecount = 0;
    let wordcount = 0;
    let countfreelines = 0;
    let linediv = document.createElement("div");
    let appline = document.createElement("span");
    let reflinenum = document.createElement("span");
    reflinenum.className = "refline clickableED";
    let lnum = linecount + templinecount;
    reflinenum.innerHTML = lnum;
    reflinenum.onclick = function(){ showbuchline(this); };
    appline.appendChild( reflinenum );
    linediv.className = "line";
    let linenumelem = document.createElement("span");
    linenumelem.className = "linenum clickableED";
    linenumelem.onclick = function(){ showbuchline(this); };
    linenumelem.innerHTML = linecount + templinecount;
    linediv.appendChild( linenumelem );
    //line numerbers
    for( let wi = wordstart; wi < alltexts[ currented ].length; wi = wi+1 ){
        if( renderstyle == 0 ){
            if( Math.abs( howmanylines ) <= templinecount || wi ==  alltexts[ currented ].length ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                aelem.removeChild( aelem.lastChild );
                return wi;
            }
        } else if( renderstyle == 1 ){ //absatz
            if( countfreelines == 2 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                aelem.removeChild( aelem.lastChild );
                return wi;
            }
         } else if( renderstyle == 2 ){ //spalte
            if( countfreelines == 3 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                aelem.removeChild( aelem.lastChild );
                return wi;
            }
         } else if( renderstyle == 3 ){ //seite
            if( countfreelines == 4 ){
                linecount = linecount + templinecount;
                lastvisibleline = linecount; 
                aelem.removeChild( aelem.lastChild );
                return wi;
            }
         }
         let intoit = alltexts[ currented ][ wi ];
         if(intoit == "" || intoit == " "){
            countfreelines += 1;
         } else {
            countfreelines = 0;
         }
        //
        let sspan = document.createElement("span");
        if(colorindex != null && colorindex == wi){
			    sspan.className = "same urn";
		    } else {
			    sspan.className = "same";
		    }
        if( currentedseries.toLowerCase ){
            sspan.id = "buchv:"+currentedseries+":"+(currented+1)+":"+(wi+1).toString();
        } else {
            sspan.id = "buchv:"+(currentedseries+1)+":"+(currented+1)+":"+(wi+1).toString();
        }
        sspan.innerHTML = " " + intoit;
        linediv.appendChild( sspan );
        velem.appendChild( linediv );
        templinelength += sspan.offsetWidth;
        let Us = tog[ wi.toString() ];
        if( Us != undefined ){
          for( let di in Us ){
                let dispan = document.createElement("span");
                dispan.style.cursor = "pointer";
                if( currentedseries.toLowerCase ){
                    dispan.id = "buchv:app:"+currentedseries+":"+(Us[di][0]+1).toString()+":"+(Us[di][1]+1).toString();
			        dispan.name = "buchv:"+currentedseries+":"+(currented+1)+":"+(wi+1).toString();
                } else {
                    dispan.id = "buchv:app:"+(currentedseries+1)+":"+(Us[di][0]+1).toString()+":"+(Us[di][1]+1).toString();
			        dispan.name = "buchv:"+(currentedseries+1)+":"+(currented+1)+":"+(wi+1).toString();
                }
			    dispan.onclick = function(){ buchshowword( this ); };
                let ttn = textnames[ Us[di][0] ];

			    let innertext = alltexts[ Us[di][0] ][ Us[di][1] ];
			    if(innertext != undefined ){
                dispan.innerHTML = innertext;
                let disup = document.createElement("sup");
			    let tempclasssup = "";
			    let givvenclasssup = Us[di][2];
			    if( givvenclasssup.indexOf("T") != -1 ){
				    tempclasssup = tempclasssup + " " + TU;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("C") != -1 ){
				    tempclasssup = tempclasssup + " " + GK;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("D") != -1 ){
				    tempclasssup = tempclasssup + " " + DK;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("L") != -1 ){
				    tempclasssup = tempclasssup + " " + LI;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("U") != -1 ){
				    tempclasssup = tempclasssup + " " + UM;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("Z") != -1 ){
				    tempclasssup = tempclasssup + " " + ZK;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			
			    if( givvenclasssup.indexOf("W") != -1 ){
				    tempclasssup = tempclasssup + " " + WE;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("I") != -1 ){
				    tempclasssup = tempclasssup + " " + INTERP;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("K") != -1 ){
				    tempclasssup = tempclasssup + " " + KK;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("V") != -1 ){
				    tempclasssup = tempclasssup + " " + UV;
				    dispan.className = "diffilerwgl" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf(" vERT") != -1 ){
				    tempclasssup = tempclasssup + " " +VERT;
				    dispan.className = "diffil" + Us[di][2];
			    }
                if( givvenclasssup.indexOf(" vErdRE") != -1 ){
				    tempclasssup = tempclasssup + " " +VERDRE;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf(" mIAT") != -1 ){
				    tempclasssup = MIAT;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("M") != -1 ){
				    tempclasssup = tempclasssup + " " + ME;
				    dispan.className = "diffil" + Us[di][2];
			    }
		        if( givvenclasssup.indexOf("EiN") != -1 ){
				    tempclasssup = tempclasssup + " " +EIN;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("dist") != -1 ){
				    tempclasssup = tempclasssup + " " +DIST;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("wtn") != -1 ){
				    tempclasssup = tempclasssup + " " +WTN;
				    dispan.className = "diffil" + Us[di][2];
			    }
			    if( givvenclasssup.indexOf("vwt") != -1 ){
				    tempclasssup = tempclasssup + " " +VWT;
				    dispan.className = "diffil" + Us[di][2];
			    }
                disup.innerHTML = tempclasssup;//Us[di][2];
                dispan.appendChild( disup );
                let tedelem = document.createElement("span");
                tedelem.className = "st";
                //console.log(ttn)
                tedelem.innerHTML = " ("+ttn[1].replace(/ _ /g,",").replace(/_/g,".") +") ";
                //gconsole.log(" ("+ttn[1].replace(/ _ /g,",").replace(/_/g,".") +") ");
                appline.appendChild( dispan );
                appline.appendChild( tedelem );
			    }
              }
            
            
        }
          if( templinelength >= linewidth ){
                linehinstory.push( wi );
                let wc = document.createElement("span");
                wc.className = "wordsinline"; 
                wc.innerHTML = wordcount.toString();
                linediv.appendChild( wc );
                wordcount = 0;
                linediv.id = "l" + (linecount+templinecount).toString();
                velem.appendChild( linediv );
                aelem.appendChild( appline );
              linediv = document.createElement("div");
              linediv.className = "line";
              
              templinelength = 0;
              templinecount += 1;
              appline = document.createElement("span");
              let reflinenum = document.createElement("span");
              reflinenum.className = "refline clickableED";
              let lnum = linecount + templinecount;
          	  reflinenum.innerHTML = lnum;
          	  reflinenum.onclick = function(){ showbuchline(this); };
              appline.appendChild( reflinenum );
                
              aelem.appendChild( appline );
              let linenumelem = document.createElement("span");
              linenumelem.className = "linenum clickableED";
		      linenumelem.onclick = function(){ showbuchline(this); };
              linenumelem.innerHTML = linecount + templinecount;
              linediv.appendChild( linenumelem );
          }
          wordcount += 1;
    }
	if(wordstart < howlong){
      velem.appendChild( linediv );
	}
}

/**********************************************************************/
/*Analysis and drawing         ****************************************/
/**********************************************************************/
function mkTASTAT( ){
    document.getElementById( "tastetc" ).style.display = "block";
    document.getElementById( "tastbutton" ).onclick = function(){ killTASTAT() };
    makebildschirmtatstatur(useunicode, "tatst","greekout","betaout");
}

function killTASTAT( ){
    document.getElementById( "tatst" ).innerHTML = "";
    document.getElementById( "tastetc" ).style.display = "none";
    document.getElementById( "tastbutton" ).onclick = function(){ mkTASTAT() };
}

function svgline( x1, y1, x2, y2, w, c, xmlns ){
 	let aline = document.createElementNS( xmlns, 'line');
    aline.setAttribute('x1', x1);
    aline.setAttribute('y1', y1);
    aline.setAttribute('x2', x2);
    aline.setAttribute('y2', y2);
    aline.setAttribute('stroke', c);
    aline.setAttribute('stroke-width', w);
	return aline;
}
function svgtext( x, y, r, fs, texttext, c, xmlns ){
	let atextelem = document.createElementNS( xmlns, 'text');
	atextelem.setAttribute('x', x);
    atextelem.setAttribute('y', y);
	atextelem.setAttribute('fill', c);
	atextelem.setAttribute('font-size', fs);
	atextelem.setAttribute('transform', "rotate("+r.toString()+","+x.toString()+","+y.toString()+")");
	atextelem.textContent = texttext;
	return atextelem;
} 
function svgrect( x, y, w, h, c, xmlns ){
	let arec = document.createElementNS( xmlns, 'rect');
    arec.setAttribute('x', x);
    arec.setAttribute('y', y);
    arec.setAttribute('width', w);
    arec.setAttribute('height', h);
    arec.setAttribute('fill', c);
	return arec;
}
function getunterschSVG( ){
	let w = 2000;
	let h = 400;
	let xmlns = "http://www.w3.org/2000/svg";
	let mainsvgelem = document.createElementNS (xmlns, "svg");
	mainsvgelem.setAttributeNS(null, "viewBox", "0 0 " + w + " " + h);
    mainsvgelem.setAttributeNS(null, "width", w);
    mainsvgelem.setAttributeNS(null, "height", h);
    mainsvgelem.style.display = "block";
	mainsvgelem.style.background = "white";
	let cx = 15;
	let cy = 10;
	let cw = 16;
	let cd = 2;
	let diaH = 300;
	let diaW = ((cw+cd)*alltexts.length)*12;
	mainsvgelem.appendChild( svgline( 10, 5, 10, diaH, 1, "black", xmlns) ); //yachse
	mainsvgelem.appendChild( svgtext( 8, 22, -90, "10px", "0.0", "black", xmlns) ); //0.0 text
	mainsvgelem.appendChild( svgline( 5, Math.round(diaH/2), 10, Math.round(diaH/2)-1, 1, "black", xmlns) ); //0.5 strich
	mainsvgelem.appendChild( svgtext( 8, Math.round(diaH/2), -90, "10px", "0.5", "black", xmlns) ); //0.5 text

	let ml = svgline( 10, Math.round(diaH/2), diaW, Math.round(diaH/2), 1, "black", xmlns)
	ml.setAttribute( "stroke-dasharray","3, 3" );
	mainsvgelem.appendChild( ml );
	mainsvgelem.appendChild( svgline( 10, 10, diaW, 10, 1, "black", xmlns) ); //xachse
	mainsvgelem.appendChild( svgtext( 8, diaH, -90, "10px", "1.0", "black", xmlns) ); //1.0 text
	let ll = svgline( 10, diaH, diaW, diaH, 1, "black", xmlns)
	ll.setAttribute( "stroke-dasharray","3, 3" );
	mainsvgelem.appendChild( ll );

	let t = 0;
    let d = 0;
    let c = 0;
    let l = 0;
    let z = 0;
    let i = 0;
	let m = 0;
	let k = 0; 
	let v = 0;
	let vert = 0;
    let verdre = 0; 
	let miat = 0;
	let ein = 0;
    let dist = 0;
    let wtn = 0;
	let countpertext = [];
	for( let R = 0; R < comparatio.length; R++ ){
        if( currented == comparatio[ R ][0] ){ //refid
        	let co = comparatio[ R ][1]; //pro text
        	for( let T in co ){
           		let ti = co[T][0][1] //textid

		   		let cwordcount = alltexts[ ti ].length-1;
				let tt = 0;
      			let dd = 0;
      			let cc = 0;
      			let ll = 0;
      			let zz = 0;
      			let ii = 0;
				let mm = 0;
	 	 		let kk = 0; 
	  			let vv = 0;
	  			let miatmiat = 0;
	  			let einein = 0;
      			let distdist = 0;
      			let wtnwtn = 0;
                let vertvert = 0;
                let verdreverdre = 0;
           		for( let w in co[T] ){
            		if(w > 0){ //scip first elem in array is just indices
             
						if( co[T][ w ][2].indexOf(" T") != -1 ){
							t += 1;
                			tt += 1;
						}
						if( co[T][ w ][2].indexOf("C") != -1 ){
							c += 1; 
			    			cc += 1;
						}
						if( co[T][ w ][2].indexOf("D") != -1 ){
							d += 1; 
			    			dd += 1;
						}
						if( co[T][ w ][2].indexOf("L") != -1 ){
							l += 1; 
			    			ll += 1;
						}
						if( co[T][ w ][2].indexOf("U") != -1 ){
							u += 1;
							uu += 1;
						}
						if( co[T][ w ][2].indexOf("Z") != -1 ){
							z += 1; 
			    			zz += 1;
						}
						if( co[T][ w ][2].indexOf("M") != -1 ){
							m += 1; 
			    			mm += 1;
						}
						if( co[T][ w ][2].indexOf("W") != -1 ){
							w += 1; 
			    			ww += 1;
						}
						if( co[T][ w ][2].indexOf("I") != -1 ){
							i += 1; 
			    			ii += 1;
						}
						if( co[T][ w ][2].indexOf("K") != -1 ){
							k += 1; 
			    			kk += 1;
						}
						if( co[T][ w ][2].indexOf("V") != -1 ){
							v += 1; 
			    			vv += 1;
						}
						if( co[T][ w ][2].indexOf(" mIAT") != -1 ){
							miat += 1; 
			    			miatmiat += 1;
						}
		    			if( co[T][ w ][2].indexOf("EiN") != -1 ){
							ein += 1;
							einein += 1;
						}
						if( co[T][ w ][2].indexOf("dist") != -1 ){
							dist += 1; 
			    			distdist += 1;
						}
                        if( co[T][ w ][2].indexOf("vERT") != -1 ){
							vert += 1; 
			    			vertvert += 1;
						}
                        if( co[T][ w ][2].indexOf("vErdRE") != -1 ){
							verdre += 1; 
			    			verdreverdre += 1;
						}
						if( co[T][ w ][2].indexOf("wtn") != -1 || co[T][ w ][2].indexOf("vwt") != -1 ){
							wtnwtn += 1; 
			    			wtn += 1;
						}
             		}
           		}
				countpertext.push([cwordcount, tt,dd,cc,ll,zz,ii,mm,kk,vv,miatmiat,einein,distdist,wtnwtn, vertvert, verdreverdre, ti]);
       		}
		}
	}
	console.log(countpertext[0].length-2, "u klassen");
	for(let uk = 1; uk < 16; uk++ ){
		let randcolor = '#' + Math.random().toString(16).substring(2, 8);
		for(let pt = 0; pt < countpertext.length; pt++ ){
			let n = textnames[ countpertext[pt][16] ][2].split("_");
  			let nn = n.join( "." );
			let editorname = textnames[ countpertext[pt][16] ][1].split("_");
			let mh =  (diaH* (countpertext[pt][uk]/countpertext[pt][0]));
			let ccy = cy;
			if( countpertext[pt][uk] < 1){
				mh = 3;
				ccy = cy-4;
			}
			let balken = svgrect( cx, ccy, cw, mh, randcolor, xmlns );
			balken.name = editorname + "; " + nn;
			balken.onmouseout = function(){ hideelemname( ); };
			balken.onmouseenter = function(){ showelemname( this ); };
			mainsvgelem.appendChild( balken );
			cx += cw+cd;
		}
		mainsvgelem.appendChild( svgline( cx, 10, cx, diaH, 1, "black", xmlns) );

		let stringtodisp = "";
		if(uk == 1){
			stringtodisp = TUleg;
		} else if(uk == 2){
			stringtodisp = DKleg;
		} else if(uk == 3){
			stringtodisp = GKleg;
		} else if(uk == 4){
			stringtodisp = LIleg;
		} else if(uk == 5){
			stringtodisp = ZKleg;
		} else if(uk == 6){
			stringtodisp = INTERPleg;
		} else if(uk == 7){
			stringtodisp = MEleg;
		} else if(uk == 8){
			stringtodisp = KKleg;
		} else if(uk == 9){
			stringtodisp = UVleg;
		} else if(uk == 10){
			stringtodisp = MIATleg;
		} else if(uk == 11){
			stringtodisp = EINleg;
		} else if(uk == 12){
			stringtodisp = DISTleg;
		} else if(uk == 13){
			stringtodisp = VWTleg;
		} else if(uk == 14){
			stringtodisp = VERTleg;
		} else if(uk == 15){
			stringtodisp = VERDREleg;
		}
		mainsvgelem.appendChild( svgtext( cx-2, diaH-1, -90, "9px", stringtodisp, randcolor, xmlns) ); //0.0 text
		cx += (cd*3);
	}
	return mainsvgelem;
} 

function getposdichteSVG( ){
	let w = 10000;
	let h = 500;
	let xmlns = "http://www.w3.org/2000/svg";
	let mainsvgelem = document.createElementNS (xmlns, "svg");
	mainsvgelem.setAttributeNS (null, "viewBox", "0 0 " + w + " " + h);
    mainsvgelem.setAttributeNS (null, "width", w);
    mainsvgelem.setAttributeNS (null, "height", h);
    mainsvgelem.style.display = "block";
	mainsvgelem.style.background = "white";

	let cx = 3;
	let cy = 10;
	let hinc = 4;
	let vinc = 12;
	let hb = 6;
	let vb = 6;
	let maxtexts = alltexts.length-1;
	let currenttext = 0;
	let oldcx = 10000000;
	let nref = textnames[ currented ][2].split("_");
  	let nnref = nref.join( "." );
	let editornameref = textnames[ currented ][1].split("_");
	for( let currenttext = 0; currenttext < alltexts.length; currenttext++ ){
		if( currenttext != currented ){
			let randcolor = '#' + Math.random().toString(16).substring(2, 8);
			let wasin = false;
			//text einblenden
			let n = textnames[ currenttext ][2].split("_");
  			let nn = n.join( "." );
			let editorname = textnames[ currenttext ][1].split("_");
			mainsvgelem.appendChild( svgtext( cx, cy, 0, "9px", editornameref+"; "+ nnref +" MIT "+editorname+"; "+nn, "black", xmlns ) );
			//cy weiter setzen
			cy = cy+10;
			for( let wi = 0; wi < alltexts[ currented ].length; wi = wi+1 ){
				let Us = wico[ wi.toString() ]; 
				if( wasin ){
					randcolor = '#' + Math.random().toString(16).substring(2, 8);
					wasin = false;
				}
				let wordline = svgline( cx, cy, cx, cy+vb, hb, randcolor, xmlns);
				wordline.name = alltexts[ currented ][wi]; //+" ("+ wi.toString() +"), " + currented.toString();
				wordline.onmouseout = function(){ hideelemname( ); };
				wordline.onmouseenter = function(){ showelemname( this ); };
				mainsvgelem.appendChild( wordline );
    			if( Us != undefined ){
					//console.log( Us.length, Us, alltexts[ Us[1][0] ][ Us[1][1] ] );
					let ccx = cx;
					let ccy = cy+vb+vb;
					
					for(let v = 0; v < Us.length; v++){
						if( Us[v][0] == currenttext ){
							//alltexts[ Us[v][0] ][ Us[v][1] ] //diffil Us[0][2] 
							let wordl = svgline( ccx, ccy, ccx, ccy+vb, hb, randcolor, xmlns);
							wordl.name = alltexts[ Us[v][0] ][ Us[v][1] ]; //+ " ("+ Us[v][2] +"),"+Us[v][1].toString()+", "+currenttext.toString() ;
							wordl.onmouseout = function(){ hideelemname( ); };
							wordl.onmouseenter = function(){ showelemname( this ); };
							mainsvgelem.appendChild( wordl );
							if( Us[v][2] == "" ){
								let sameline = svgline( ccx, ccy, cx, cy+vb, 1, "black", xmlns);
								mainsvgelem.appendChild( sameline );
							}
							ccx += hb + hinc;
							wasin = true;
						} 
					}
					cx = ccx;
				} else {  
					cx += hb + hinc;
				}
				//falls es eine wico gibt und der text zum basistext aber shcon endete
				if(oldcx == cx){
					cx += hb + hinc;
				}
				oldcx = cx;
			}
			cy = cy+vb+vb+vb+vb+vb+vb+vb;
			cx = 3;
		}
		
	}
	return mainsvgelem;
}

function textSTAT( returnorschow ){
      let t = 0;
      let d = 0;
      let c = 0;
      let l = 0;
      let z = 0;
      let i = 0;

	  let m = 0;
	  let k = 0; 
	  let v = 0;
	  let vert = 0;
        let verdre = 0;
	  let miat = 0;
	  let ein = 0;
      let dist = 0;
      let wtn = 0;
      let vwt = 0;
	  let wordcount = alltexts[ currented ].length-1;
	  
      let texteinzeln = "";
      for( let R = 0; R < comparatio.length; R = R +1 ){
        if( currented == comparatio[ R ][0] ){ //refid
        	let co = comparatio[ R ][1]; //pro text
        	for( let T in co ){
           		let ti = co[T][0][1] //textid
		   		let cwordcount = alltexts[ ti ].length-1;
				let tt = 0;
      			let dd = 0;
      			let cc = 0;
      			let ll = 0;
      			let zz = 0;
      			let ii = 0;
			
				let mm = 0;
	 	 		let kk = 0; 
	  			let vv = 0;
	  			let vertvert = 0;
                let verdreverdre = 0;
	  			let miatmiat = 0;
	  			let einein = 0;
      			let distdist = 0;
      			let wtnwtn = 0;
      			let vwtvwt = 0;
           		for( let w in co[T] ){
            		if(w > 0){ //scip first elem in array is just indices
             
						if( co[T][ w ][2].indexOf(" T") != -1 ){
							t += 1;
                			tt += 1;
						}
						if( co[T][ w ][2].indexOf(" C") != -1 ){
							c += 1; 
			    			cc += 1;
						}
						if( co[T][ w ][2].indexOf(" D") != -1 ){
							d += 1; 
			    			dd += 1;
						}
						if( co[T][ w ][2].indexOf(" L") != -1 ){
							l += 1; 
			    			ll += 1;
						}
						if( co[T][ w ][2].indexOf(" U") != -1 ){
							u += 1;
							uu += 1;
						}
						if( co[T][ w ][2].indexOf(" Z") != -1 ){
							z += 1; 
			    			zz += 1;
						}
						if( co[T][ w ][2].indexOf(" M") != -1 ){
							m += 1; 
			    			mm += 1;
						}
						if( co[T][ w ][2].indexOf(" W") != -1 ){
							w += 1; 
			    			ww += 1;
						}
						if( co[T][ w ][2].indexOf(" I") != -1 ){
							i += 1; 
			    			ii += 1;
						}
						if( co[T][ w ][2].indexOf(" K") != -1 ){
							k += 1; 
			    			kk += 1;
						}
						if( co[T][ w ][2].indexOf(" V") != -1 ){
							v += 1; 
			    			vv += 1;
						}
						if( co[T][ w ][2].indexOf(" vERT") != -1 ){
							vert += 1; 
			    			vertvert += 1;
						}
                        if( co[T][ w ][2].indexOf("vErdRE") != -1 ){
							verdre += 1; 
			    			verdreverdre += 1;
						}
						if( co[T][ w ][2].indexOf(" mIAT") != -1 ){
							miat += 1; 
			    			miatmiat += 1;
						}
		    			if( co[T][ w ][2].indexOf(" EiN") != -1 ){
							ein += 1;
							einein += 1;
						}
						if( co[T][ w ][2].indexOf(" dist") != -1 ){
							dist += 1; 
			    			distdist += 1;
						}
						if( co[T][ w ][2].indexOf(" wtn") != -1 ){
							wtnwtn += 1; 
			    			wtn += 1;
						}
						if( co[T][ w ][2].indexOf(" vwt") != -1 ){
							vwt += 1;
							vwtvwt += 1;
						}
             		}
           		}
				let n = textnames[ ti ][2].split("_");
  				let nn = n.join( "." );
				let editorname = "";//textnames[ ti ][1].split("_");
				texteinzeln = texteinzeln+"<div class='tabellenspalte'><div class='tabellenkopf'>"+editorname+" "+nn+"</div><div class='tabellenzelle'><b>"+TU+"</b>: "+tt.toString()+" / "+(tt/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+DK+"</b>: "+dd.toString()+" / "+(dd/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+GK+"</b>: "+cc.toString()+" / "+(cc/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+LI+"</b>: "+ll.toString()+" / "+(ll/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+ZK+"</b>: "+zz.toString()+" / "+(zz/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+INTERP+"</b>: "+ii.toString()+" / "+(ii/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+ME+"</b>: "+mm.toString()+" / "+(mm/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+KK+"</b>: "+kk.toString()+" / "+(kk/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+UV+"</b>: "+vv.toString()+" / "+(vv/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+MIAT+"</b>: "+miatmiat.toString()+" / "+(miatmiat/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+EIN+"</b>: "+einein.toString()+" / "+(einein/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+DIST+"</b>: "+distdist.toString()+" / "+(distdist/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+VERT+"</b>: "+vertvert.toString()+" / "+(vertvert/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+VERDRE+"</b>: "+verdreverdre.toString()+" / "+(verdreverdre/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>"+VWT+"</b>: "+(wtnwtn+vwtvwt).toString()+" / "+((wtnwtn+vwtvwt)/cwordcount).toFixed(4).toString()+"</div><div class='tabellenzelle'><b>Wortanzahl</b>: "+cwordcount.toString()+"</div></div>"; 
 
       		}
		}
	}
	let ganzetabelle = "<div class='tabelle'><div class='tabellenspalte'><div class='tabellenkopf'>Insgesamt: </div><div class='tabellenzelle'><b>"+TU+"</b>: "+t.toString()+"</div><div class='tabellenzelle'><b>"+DK+"</b>: "+d.toString()+"</div><div class='tabellenzelle'><b>"+GK+"</b>: "+c.toString()+"</div><div class='tabellenzelle'><b>"+LI+"</b>: "+l.toString()+"</div><div class='tabellenzelle'><b>"+ZK+"</b>: "+z.toString()+"</div><div class='tabellenzelle'><b>"+INTERP+"</b>: "+i.toString()+"</div><div class='tabellenzelle'><b>"+ME+"</b>: "+m.toString()+"</div><div class='tabellenzelle'><b>"+KK+"</b>: "+k.toString()+"</div><div class='tabellenzelle'><b>"+UV+"</b>: "+v.toString()+"</div><div class='tabellenzelle'><b>"+MIAT+"</b>: "+miat.toString()+"</div><div class='tabellenzelle'><b>"+EIN+"</b>: "+ein.toString()+"</div><div class='tabellenzelle'><b>"+DIST+"</b>: "+dist.toString()+"</div><div class='tabellenzelle'><b>"+VERT+"</b>: "+vert.toString()+"</div><div class='tabellenzelle'><b>"+VERDRE+"</b>: "+verdre.toString()+"</div><div class='tabellenzelle'><b>"+VWT+"</b>: "+(wtn+vwt)+"</div><div class='tabellenzelle'><b>Wortanzahl</b>: "+wordcount.toString()+"</div></div>"+texteinzeln+"<div class='clear'></div></div><br><br><div onclick=\"closediv( 'hilfe' )\" class='clickableED'>&#9746;</div><br>";

	if( returnorschow == 0 ){
		showhelpwithstr( ganzetabelle );
	} else {
		return ganzetabelle;
	}
      
}

/**********************************************************************/
/*COLORING text****************************************/
/**********************************************************************/
function buchshowword( elem ){
	document.getElementById( elem.name ).style.color = "steelblue";
}

function showbuchline( num ){
    let velem = document.getElementById( "textver" );
    for( let lelem in velem.children ){
        if( velem.children[ lelem ].firstChild ){
            if( parseInt( velem.children[ lelem ].firstChild.innerHTML ) == parseInt( num.innerHTML ) ){
                    velem.children[ lelem ].style.background = "rgba(224, 224, 224, 1)";
            }
        }
    }
	let aelem = document.getElementById( "apparat" );
	for( let lelem in aelem.children ){
		if(aelem.children[ lelem ].firstChild){
            if( parseInt( aelem.children[ lelem ].firstChild.innerHTML ) == parseInt( num.innerHTML ) ){
			    aelem.children[ lelem ].style.background = "rgba(224, 224, 224, 1)";
		    }
		}
	}
}

function colorasame( ){
	let t = document.getElementsByClassName( "verglt" );
    if( whichview == 5 ){
        t = document.getElementsByClassName( "maverglt" );
    }
	let dothetrick = 0;
	for( let ti = 0; ti < t.length; ti++ ){
		if( t[ti].style ){
			if( t[ti].style.color == colorofdiffclasses ){
				dothetrick = 1;
				t[ti].style.color = "black";
			} else {
	 			t[ti].style.color = colorofdiffclasses;
			}
		} else {
			t[ti].style.color = colorofdiffclasses;
		}
	}
	if( dothetrick == 1 ){
		decolordiff( );
		coloralldiffs( );
	} else {
		decolordiff();
	}
}

function decolordiff( ){
	for( let d in coloerdclass ){
		let t = document.getElementsByClassName(  d  ); //just the keys are the classnames
		for( let ti in t ){
			if( t[ti].style ){
				t[ ti ].style.color = "black";
			}
		}
		coloerdclass[ d ] = 0;
	}
}

function colornewonscreen( ){ //auswahl der eingefärbten unterschiede für neu auf der Seite angezeigte inhalte herstellen, aufzu rufen, wenn neuer basistext, oder neue zeile erscheint
	for( let ci in coloerdclass ){
		if( coloerdclass[ci] == 1){
			coloerdclass[ci] = 0;
		} else {
			coloerdclass[ci] = 1;
		}

		coloradiff( ci );
	}
}

function coloradiff( classname ){
      let t = document.getElementsByClassName( classname );
      if( coloerdclass[ classname ] == 0 ){ //color it
            for( let ti in t ){
                  if( t[ ti ].style ){
                        t[ ti ].style.color = colorofdiffclasses;
                        if( whichview == 0 ){
                        	let idd = t[ ti ].parentNode.getAttribute( "id" );
                       		if( idd ){
                          		let marker = document.getElementsByName( idd )[0];
                          		marker.style.background = colorofdiffclasses;
                          		marker.style.color = colorofdiffclasses;
                        	}
                        } else if( whichview == 2 ){ //hide complete entrie in buchvie apparatus
							let apparatusline =  t[ti].parentNode;
							let indexofnext = Array.prototype.indexOf.call(apparatusline.children, t[ti]) + 1;
							t[ti].style.display = "inline";
							apparatusline.children[ indexofnext ].style.display = "inline";
				  		}
                  }
            }
       coloerdclass[ classname ] = 1;
      } else { //decolor it
			//console.log(t.length, "class divs diff")
            for( let ti in t ){
                 if( t[ ti ].style ){
                      if(whichview == 0){
                        t[ ti ].style.color = "gray";
                        let idd = t[ ti ].parentNode.getAttribute( "id" );
                        if( idd ){
                           let marker = document.getElementsByName( idd )[0];
                              marker.style.color = "gray";
                        }
                      } else if( whichview == 2 ){ //hide complete entrie in buchvie apparatus
					    let apparatusline =  t[ti].parentNode;
					    let indexofnext = Array.prototype.indexOf.call(apparatusline.children, t[ti]) + 1;
					    t[ti].style.display = "none";
					    apparatusline.children[ indexofnext ].style.display = "none";
				      } else {
                        t[ ti ].style.color = "black";
                      }
                }
            }
            coloerdclass[ classname ] = 0;
      }
      
}

function colorT( ){ coloradiff("T"); }
function colorC( ){ coloradiff("C"); }
function colorD( ){ coloradiff("D"); }
function colorL( ){ coloradiff("L"); }
function colorU( ){ coloradiff("U"); }
function colorI( ){ coloradiff("I"); }
function colorZ( ){ coloradiff("Z"); }
function colorM( ){ coloradiff("M"); }
function colorW( ){ coloradiff("W"); }
function colorV( ){ coloradiff("V"); }
function colorVERT( ){ coloradiff("vERT"); }
function colorVERDRE( ){ coloradiff("vErdRE"); }
function colorMIAT( ){ coloradiff("mIAT"); }
function colorEIN( ){ coloradiff("EiN"); }
function colorDIST( ){ coloradiff("dist"); }
function colorWTN( ){ coloradiff("wtn"); }
function colorVTW( ){ coloradiff("vwt"); }

function coloralldiffs( ){
    colorT();
    colorC();
    colorD();
    colorL();
    colorU();
    colorI();
    colorZ();
    colorM();
    colorW();
    colorV();
    colorVERT();
    colorVERDRE();
    colorMIAT();
    colorEIN();
    colorDIST();
    colorWTN();
    colorVTW();
}


/**************************************************************/
/*MOD DIFF DESCRIPTION*/
/**************************************************************/
function modDIFFDES( ){
	document.getElementById( "intome" ).innerHTML = " <form id='moddesform' name='moddesform'>\
 <input type='text' id='d1t' name='d1t' size='5'/> <input type='text' id='d1' name='d1' size='40'/><br/>\
 <input type='text' id='d2t' name='d2t' size='5'/> <input type='text' id='d2' name='d2' size='40' /><br/>\
 <input type='text' id='d3t' name='d3t' size='5'/> <input type='text' id='d3' name='d3' size='40' /><br/>\
 <input type='text' id='d4t' name='d4t' size='5'/> <input type='text' id='d4' name='d4' size='40' /><br/>\
 <input type='text' id='d5t' name='d5t' size='5'/> <input type='text' id='d5' name='d5' size='40' /><br/>\
 <input type='text' id='d6t' name='d6t' size='5'/> <input type='text' id='d6' name='d6' size='40' /><br/>\
 <input type='text' id='d7t' name='d7t' size='5'/> <input type='text' id='d7' name='d7' size='40' /><br/>\
 <input type='text' id='d8t' name='d8t' size='5'/> <input type='text' id='d8' name='d8' size='40' /><br/>\
 <input type='text' id='d9t' name='d9t' size='5'/> <input type='text' id='d9' name='d9' size='40' /><br/>\
 <input type='text' id='d10t' name='d10t' size='5'/> <input type='text' id='d10' name='d10' size='40' /><br/>\
 <input type='text' id='d11t' name='d11t' size='5'/> <input type='text' id='d11' name='d11' size='40' /><br/>\
 <input type='text' id='d12t' name='d12t' size='5'/> <input type='text' id='d12' name='d12' size='40' /><br/>\
 <input type='text' id='d19t' name='d19t' size='5'/> <input type='text' id='d19' name='d19' size='40' /><br/>\
 <input type='text' id='d13t' name='d13t' size='5'/> <input type='text' id='d13' name='d13' size='40' /><br/>\
 <input type='text' id='d14t' name='d14t' size='5'/> <input type='text' id='d14' name='d14' size='40' /><br/>\
 <input type='text' id='d15t' name='d15t' size='5'/> <input type='text' id='d15' name='d15' size='40' /><br/>\
 <input type='text' id='d16t' name='d16t' size='5'/> <input type='text' id='d16' name='d16' size='40' /><br/>\
 <input type='text' id='d17t' name='d17t' size='5'/> <input type='text' id='d17' name='d17' size='40' /><br/>\
 <input type='text' id='d20t' name='d20t' size='5'/> <input type='text' id='d20' name='d20' size='40' /><br/>\
 <input type='text' value='Farbcode' size='5'/> <input type='text' id='d18' name='d18' size='40' />\
 <span>\
 <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(255,0,0); color:rgb(255,0,0);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(0,255,0); color:rgb(0,255,0);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(0,0,255); color:rgb(0,0,255);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(255,0,255); color:rgb(255,0,255);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(255,255,0); color:rgb(255,255,0);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(0,255,255); color:rgb(0,255,255);'>c\
 </span>\
  <span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(49,79,79); color:rgb(49,79,79);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(25,25,112); color:rgb(25,25,112);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(72,61,139); color:rgb(72,61,139);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(85,107,47); color:rgb(85,107,47);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(50,205,50); color:rgb(50,205,50);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(255,215,0); color:rgb(255,215,0);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(218,165,32); color:rgb(218,165,32);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(219,112,147); color:rgb(219,112,147);'>c\
 </span>\
<span class='clickable' onclick='selectacolor(this)' style='width:10px; height:10px; background:rgb(255,105,180); color:rgb(255,105,180);'>c\
 </span>\
 </span>\
 <br/><br/>\
ANDERE DARSTELLUNGEN</br>\
<input type='text' value='CSV' size='5'/> <input type='text' id='d21' name='d21' size='40' />\
<br/><br/>\
 <div onclick='realymoddiffdes()' class='clickable'>Ändern</div> <span class='clickable' onclick='location.reload();' title='Zurück zur Hauptansicht.'>Zur&uuml;ck</span>\
</form>";
       
    document.getElementById( 'd1t' ).value = TU;
    document.getElementById( 'd1' ).value = TUleg;
    document.getElementById( 'd2t' ).value =  GK;
    document.getElementById( 'd2' ).value =  GKleg;
    document.getElementById( 'd3t' ).value =  DK;
    document.getElementById( 'd3' ).value =  DKleg;
    document.getElementById( 'd4t' ).value =  LI;
    document.getElementById( 'd4' ).value =  LIleg;
    document.getElementById( 'd5t' ).value =  UM;
    document.getElementById( 'd5' ).value =  UMleg;
    document.getElementById( 'd6t' ).value =  INTERP;
    document.getElementById( 'd6' ).value =  INTERPleg;
    document.getElementById( 'd7t' ).value =  ZK;
    document.getElementById( 'd7' ).value =  ZKleg;
    document.getElementById( 'd8t' ).value =  ME;
    document.getElementById( 'd8' ).value =  MEleg;
    document.getElementById( 'd9t' ).value =  WE;
    document.getElementById( 'd9' ).value =  WEleg;
    document.getElementById( 'd10t' ).value =  KK;
    document.getElementById( 'd10' ).value =  KKleg;
    document.getElementById( 'd11t' ).value =  UV;
    document.getElementById( 'd11' ).value =  UVleg;
    document.getElementById( 'd12t' ).value =  VERT;
    document.getElementById( 'd12' ).value =  VERTleg;
    document.getElementById( 'd19t' ).value =  VERDRE;
    document.getElementById( 'd19' ).value =  VERDREleg;
    document.getElementById( 'd13t' ).value =  MIAT;
    document.getElementById( 'd13' ).value =  MIATleg;
    document.getElementById( 'd14t' ).value =  EIN;
    document.getElementById( 'd14' ).value =  EINleg;
    document.getElementById( 'd15t' ).value =  DIST;
    document.getElementById( 'd15' ).value =  DISTleg;
    document.getElementById( 'd16t' ).value =  WTN;
    document.getElementById( 'd16' ).value =  WTNleg;
    document.getElementById( 'd17t' ).value =  VWT;
    document.getElementById( 'd17' ).value =  VWTleg;
    document.getElementById( 'd17t' ).value =  VWT;
    document.getElementById( 'd17' ).value =  VWTleg;
    document.getElementById( 'd18' ).value =  colorofdiffclasses;   
    document.getElementById( 'd20' ).value =  bonbon;
    document.getElementById( 'd20t' ).value =  bonbonT;
    document.getElementById( 'd21' ).value =  csvtrenner;
}

function selectacolor( elem ){
	document.getElementById( 'd18' ).value = elem.style.color.toString();
}

function realymoddiffdes( ){
    TU = document.getElementById( 'd1t' ).value;
    TUleg = document.getElementById( 'd1' ).value;
    GK = document.getElementById( 'd2t' ).value;
    GKleg = document.getElementById( 'd2' ).value;
    DK = document.getElementById( 'd3t' ).value;
    DKleg = document.getElementById( 'd3' ).value;
    LI = document.getElementById( 'd4t' ).value;
    LIleg = document.getElementById( 'd4' ).value;
    UM = document.getElementById( 'd5t' ).value;
    UMleg = document.getElementById( 'd5' ).value;
    INTERP = document.getElementById( 'd6t' ).value;
    INTERPleg = document.getElementById( 'd6' ).value;
    ZK = document.getElementById( 'd7t' ).value;
    ZKleg = document.getElementById( 'd7' ).value;
    ME = document.getElementById( 'd8t' ).value;
    MEleg = document.getElementById( 'd8' ).value;
    WE = document.getElementById( 'd9t' ).value;
    WEleg = document.getElementById( 'd9' ).value;
    KK = document.getElementById( 'd10t' ).value;
    KKleg = document.getElementById( 'd10' ).value;
    UV = document.getElementById( 'd11t' ).value;
    UVleg = document.getElementById( 'd11' ).value;
    VERT = document.getElementById( 'd12t' ).value;
    VERTleg = document.getElementById( 'd12' ).value;
    VERDRE = document.getElementById( 'd19t' ).value;
    VERDREleg = document.getElementById( 'd19' ).value;
    MIAT = document.getElementById( 'd13t' ).value;
    MIATleg = document.getElementById( 'd13' ).value;
    EIN = document.getElementById( 'd14t' ).value;
    EINleg = document.getElementById( 'd14' ).value;
    DIST = document.getElementById( 'd15t' ).value;
    DISTleg = document.getElementById( 'd15' ).value;
    WTN = document.getElementById( 'd16t' ).value;
    WTNleg = document.getElementById( 'd16' ).value;
    VWT = document.getElementById( 'd17t' ).value;
    VWTleg = document.getElementById( 'd17' ).value;
    VWT = document.getElementById( 'd17t' ).value;
    VWTleg = document.getElementById( 'd17' ).value;
    colorofdiffclasses = document.getElementById( 'd18' ).value;
    if(document.getElementById( 'd20' ).value.trim() != "" && document.getElementById( 'd20' ).value != "   " ){//mehr checken newlines oder so
        bonbon = document.getElementById( 'd20' ).value;
        bonbonT = document.getElementById( 'd20t' ).value;
    }
    csvtrenner = document.getElementById( 'd21' ).value;

    localStorage.setItem('TU', TU );
    localStorage.setItem('TUleg', TUleg );
    localStorage.setItem('GK', GK );
    localStorage.setItem('GKleg', GKleg );
    localStorage.setItem('DK', DK );
    localStorage.setItem('DKleg', DKleg );
    localStorage.setItem('LI', LI );
    localStorage.setItem('LIleg', LIleg );
    localStorage.setItem('UM', UM );
    localStorage.setItem('UMleg', UMleg );
    localStorage.setItem('INTERP', INTERP );
    localStorage.setItem('INTERPleg', INTERPleg );
    localStorage.setItem('ZK', ZK );
    localStorage.setItem('ZKleg', ZKleg );
    localStorage.setItem('ME', ME );
    localStorage.setItem('MEleg', MEleg );
    localStorage.setItem('WE', WE );
    localStorage.setItem('WEleg', WEleg );
    localStorage.setItem('KK', KK );
    localStorage.setItem('KKleg', KKleg );
    localStorage.setItem('UV', UV );
    localStorage.setItem('UVleg', UVleg );
    localStorage.setItem('VERT', VERT );
    localStorage.setItem('VERTleg', VERTleg );
    localStorage.setItem('VERDRE', VERDRE );
    localStorage.setItem('VERDREleg', VERDREleg );
    localStorage.setItem('MIAT', MIAT );
    localStorage.setItem('MIATleg', MIATleg );
    localStorage.setItem('EIN', EIN );
    localStorage.setItem('EINleg', EINleg );
    localStorage.setItem('DIST', DIST );
    localStorage.setItem('DISTleg', DISTleg );
    localStorage.setItem('WTN', WTN );
    localStorage.setItem('WTNleg', WTNleg );
    localStorage.setItem('VWT', VWT );
    localStorage.setItem('VWTleg', VWTleg );
    localStorage.setItem('colorofdiffclasses', colorofdiffclasses );
    localStorage.setItem('bonbon', bonbon );
    localStorage.setItem('bonbonT', bonbonT );
    localStorage.setItem('csvtrenner', csvtrenner );
}

/**************************************************************/
/*print / export*/
/**************************************************************/
function printstri( astri, aLINK ){
	//console.log(idoftextfeald);
	let childWindow = window.open('','childWindow','location=yes, menubar=yes, toolbar=yes');
        childWindow.document.open();
        childWindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="ed.css"></head><body>');
        childWindow.document.write(astri);
	    
        childWindow.document.write('</body></html>');
        childWindow.setTimeout( childWindow.print, 10 );
}

function printcomparatio( ){
    printstri( document.getElementById( "info" ).innerHTML + "<div><br><br><br></div>"+document.getElementById( "vergleich" ).innerHTML, "" );
}

function calljsonphp( ){
    //call PHP for online storage 
    let name = "";
    let menuelem = document.getElementById( "alledmenu" );
    for( let c = 0; c < menuelem.children.length; c += 1 ){
        if( c == currentedseries ){
            name = menuelem.children[c].innerHTML;
        }
    }
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 ){
            if( xmlHttp.status == 200){
                //GOT from PHP
                if( xmlHttp.responseText.includes( "ERROR JSON File nicht vorhanden" ) ){ //if JSON File not found
                    if( currentedseries.toLowerCase ){
                        let dadadad = "{'textnames' :"+ localStorage.getItem("ecompBIB"+currentedseries)+", "+
                        "'alltexts' :" + localStorage.getItem("ecompALLTEX"+currentedseries) + ", " +
                        "'comparatio' :" + localStorage.getItem("ecompRES"+currentedseries)  +"}";
                
                        dodownit( dadadad, currentedseries+'.json','text/json' );
                    } else {
                        console.log("Error JSON, not online or offline? Strange. File a Bug.");//try sned mail
                    }
                 } else {
                    dodownit(  xmlHttp.responseText, name+'.json','text/json' );
                }
            } else { //if php file not found
                //GO FOR THE DATABASE, ecompTENAMES
                let dadadad = "{'textnames' :"+ localStorage.getItem("ecompBIB"+currentedseries)+", "+
                "'alltexts' :" + localStorage.getItem("ecompALLTEX"+currentedseries) + ", " +
                "'comparatio' :" + localStorage.getItem("ecompRES"+currentedseries)  +"}";
        
                dodownit( dadadad, currentedseries+'.json','text/json' );
            }
        } else {
            console.log(xmlHttp.status);
        }
    }    
    xmlHttp.open("GET", 'scri/getedjson.php?name='+name, true); // true for asynchronous 
    xmlHttp.send(null);
}

function buildhtml( ){
    //set max lines to close to endless
    maxlines = 100000000;
    doverk = false; //richtiger render stil
    //undisplay elemt
    let vergelem = document.getElementById( "vergleich" );
    vergelem.style.display = "hidden";
    //render specific view
    if( whichview == 1 ){//synopse
        //render all
        comparatioparallel( 0 );
    } else if( whichview == 0 ){ //detail
        comparatiodetail( 0 );
    } else if( whichview == 2 ){ //buch
        comparatiobuch( 0 );
    } else if( whichview == 5 ){ //matrix
        //comparatiomatrix( 0 );
    } else if( whichview == 6 ){ //inline
        comparatiointerlin( 0 );
    } else {
        alert("Keine digitale Edition für diese Darstellung erstallbar. Wenden Sie sich an die Entwickler, wenn diese Funktion unbedingt erforderlich ist.");
    }
    //get innerHTML, put into index.html, export and done     
        let prehtml = '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8" />\n<title>'+currentedseries+'View'+whichview.toString()+'</title>\n<style>.toolong{\
	color:blue;\
}\
.mazeile{\
    display:block;\
    width: 100000px;\
    height:100%;\
    border-bottom: 1px solid lightgray;\
}\
.maref{\
    vertical-align:top;\
	padding:5px;\
	display:inline-block;\
	width:380px;\
	color:gray;\
	background: rgba(255,250,250,0.97);}\
.maverglt{\
    vertical-align:top;\
	padding:5px;\
	display:inline-block;\
}\
.mainfo{\
     width: 100000px;\
	display:block;\
}\
.reditorPma{\
    display:inline-block;\
	font-size: 70%;\
	font-weight: bold;\
	height: 38px;\
      padding:5px;\
	background: rgb(245, 245, 245);\
      border: 1px solid white;\
      border-top-right-radius:4px;\
      border-top-left-radius:4px;\
	overflow-y:hidden;\
}\
.diffbundel{\
	display:none;\
	background: gray;\
	z-index: 2;\
	padding:5px;\
}\
.diffmarker{\
      color:gray;\
	cursor:pointer;\
	width: 2px;\
	height: 5px;\
	padding:0px;\
	margin: 0px;\
	font-size: 10px;\
	font-weight: bold;\
      border-top-right-radius:2px;\
      border-top-left-radius:2px;\
}\
.diffilerwgl{\
	 min-width: 10px;\
}\
.diffilerwgl sup{\
      color:black;\
      font-size:40%;\
      font-family:Helvetica;\
}\
.diffil{\
    min-width: 10px;\
}\
.diffil sup{\
      color:black;\
      font-size:40%;\
      font-family:Helvetica;\
}\
.moretextavailable{\
	color:blue;\
}\
.moretext{\
	color:blue;\
	width: 340px;\
	height:auto;\
	display:block;\
}\
.pline{\
      width:auto;\
      border-bottom: 1px dotted lightgray;\
}\
.linenum{\
      display: inline-block;\
      color:steelblue;\
      padding-left: 5px;\
	  margin-left: 5px;\
      font-size:60%;\
      font-family: "Helvetica", sans-serif;\
}\
#parallelview{\
	width: 20000px;\
	background:white;\
}\
\
.ref{\
	padding:5px;\
	float:left;\
	width:380px;\
	color:gray;\
	background: rgba(255,250,250,0.97);\
      \
}\
.verglt{\
	padding:5px;\
	float:left;\
}\
.wordsinline{\
      display:none;\
}\
.wordstack{\
    display: inline-block;\
    padding-left: 8px;\
}\
.editorstack{\
    display: inline-block;\
    background: rgb(245, 245, 245);\
    width: 200px;\
}\
.stacked{\
    border-bottom: 1px dotted lightgray;\
}\
.interlline{\
      width:auto;\
    border-bottom: 4px solid gray;\
}</style>\n<script>\
let textnames = ' +JSON.stringify( textnames ) + ';\n \
    function hidevarianten( id, elem, oldhtml ){\n \
	document.getElementById( id ).style.display = "none";\n \
	document.getElementById( id ).innerHTML = oldhtml;\n \
	elem.style.background = "lightgray";\n \
	elem.onclick = function( ) { showvarianten( this.getAttribute("name"), this); };\n \
}\n \
    function showvarianten( id, elem ){\n\
	document.getElementById( id ).style.display = "block";\n\
	document.getElementById( id ).style.position = "absolute";\n\
	let posofmarker = getpositiononpage( elem );\n\
	document.getElementById( id ).style.left = (posofmarker[1]+10) + "px";\n\
	document.getElementById( id ).style.top = (posofmarker[0]+10) + "px";\n\
	let numberof = document.getElementById( id ).children[ 0 ].getAttribute("name");\n\
	let theallhtml = "";\n\
	let thetemphtml = "";\n\
	let oldhtml = "";\n\
	for( let c = 0; c < document.getElementById( id ).children.length; c++ ){\n\
		if( document.getElementById( id ).children[ c ].getAttribute("name") != numberof ){\n\
			let tn = textnames[ parseInt(numberof) ];\n\
			let name = "<div class=\'st>("+tn[1].replace(/ _ /g,",").replace(/_/g,".") +")</div>";\n\
			let currenthtml = thetemphtml + name;\n\
			theallhtml = theallhtml + currenthtml;\n\
			thetemphtml = "";\n\
		} \n\
		thetemphtml = thetemphtml + "<span class=\'"+document.getElementById( id ).children[ c ].getAttribute( "class" )+"\' name=\'"+numberof+"\'>" +document.getElementById( id ).children[ c ].innerHTML +"</span>";\n\
		numberof = document.getElementById( id ).children[ c ].getAttribute( "name" );\n\
	}\n\
	if( thetemphtml != "" ){\n\
		let tn = textnames[ parseInt(numberof) ];\n\
			let name = "<div class=\'st\'>("+tn[1].replace(/_/g,".") +")</div>";\n\
			let currenthtml = thetemphtml+name;\n\
			theallhtml = theallhtml + currenthtml.replace(/\<br\>\<\\/br\>/g,"UMBRUCH<br></br>");\n\
			thetemphtml = "";\n\
	}\n\
	oldhtml = document.getElementById( id ).innerHTML;\n\
	document.getElementById( id ).innerHTML = theallhtml;\n\
	if(document.getElementById( id ).className.indexOf( "shaped" ) == -1){\n\
		document.getElementById( id ).className += " shaped";\n\
	} \n\
	elem.onclick = function( ) { hidevarianten(id, this, oldhtml); };\n\
}\n\
</script></head>\n<body >';
       
let posthtml = '<script>\n\
    function handelaTOOlonPline( elem ){\n\
	if( document.getElementById( elem.name ).style.display.indexOf("inline") != -1 ){\n\
		document.getElementById( elem.name ).style.display = "none";\n\
		elem.innerHTML = " ⥤";\n\
	} else {\n\
		document.getElementById( elem.name ).style.display = "inline";\n\
		elem.innerHTML = " ⥢";\n\
	} \n\
}\n\
function getpositiononpage( element ){\n\
    if( element.nodeType ){\n\
        let rect = element.getBoundingClientRect( );\n\
        let elementLeft, elementTop; \n\
        let scrollTop = document.documentElement.scrollTop ?\n\
                        document.documentElement.scrollTop:document.body.scrollTop;\n\
        let scrollLeft = document.documentElement.scrollLeft ?                   \n\
                         document.documentElement.scrollLeft:document.body.scrollLeft;\n\
        elementTop = rect.top+scrollTop;\n\
        elementLeft = rect.left+scrollLeft;\n\
        return [ elementTop, elementLeft ];\n\
    } else {\n\
        return false;\n\
    }\n\
}\n\
let vergelem = document.getElementById( "vergleich" );\n\
	let infoelem = document.getElementById( "info" );\n\
let l = vergelem.children[0].children.length;\n\
	let lineheight = vergelem.children[0].children[0].offsetHeight;\n\
  	vergelem.style.height = (lineheight*l).toString() + "px";\n\
    for( let tn = 0; tn < vergelem.children.length; tn++ ){\n\
        let posofreftext = getpositiononpage( vergelem.children[ tn ] );\n\
        if(tn == 1){\n\
            infoelem.children[ tn ].style.width = (vergelem.children[ tn ].offsetWidth-16).toString() + "px";\n\
            infoelem.children[ tn ].style.left = (posofreftext[1]+vergelem.children[ tn ].style.paddingLeft).toString() + "px";\n\
        } else {\n\
            infoelem.children[ tn ].style.width = (vergelem.children[ tn ].offsetWidth-16).toString() + "px";\n\
            infoelem.children[ tn ].style.left = posofreftext[1].toString() + "px";\n\
        }\n\
    }\n\
</script></body>\n</html>';
        dodownit( prehtml +"<div id='parallelview'><div id='info' style='height: 70px;'>" +document.getElementById( "info" ).innerHTML +"</div><div id='vergleich'>"+ vergelem.innerHTML +'</div></div>'+ posthtml, currentedseries+'View'+whichview.toString()+'.html','text/xml' );      
    //reload
    location.reload();
    
}
 
function buildteixml( ){
	comparatioparallel( 0 );
	let TEIout = "<TEI xmlns='http://www.tei-c.org/ns/1.0'>\n<teiHeader>\n<fileDesc>\n<titleStmt><title></title><author>eComparatio</author><respStmt><resp>Text Encoding by </resp><name>eComparatio</name></respStmt></titleStmt><publicationStmt></publicationStmt><notesStmt></notesStmt><sourceDesc></sourceDesc></fileDesc>\n<encodingDesc><editorialDecl><p>eComparatio TEI Output</p></editorialDecl>\n<variantEncoding method='parallel-segmentation' location='internal'/></encodingDesc>\n</teiHeader>\n<text>\n<front>\n<div><listWit>";
	let wittnesseses = [];
	let infoelem = document.getElementById( "info" );
	for( let c = 0; c < infoelem.children.length; c += 1 ){
		let ih = infoelem.children[c].innerHTML.replace( /<br[^>]*>/gi, ";");
		wittnesseses.push(ih);
		TEIout = TEIout + "<witness xml:id='"+ih+"'>"+ih+"</witness>\n";
	}
	TEIout = TEIout + "</listWit></div>\n</front><head>\n<title><app></app></title>\n</head><body>\n<lg n='1'>";
	let vergelem = document.getElementById( "vergleich" );
	let numOline = vergelem.children[0].children.length;
	//get the shit and replace html markup with tei p5 markup
	for(let l = 0; l < numOline; l++){
		TEIout = TEIout + "<l n='"+l.toString()+"'><app>";
		for(let c = 0; c < vergelem.children.length; c++){
			let lineelem = vergelem.children[c].children[l];
			TEIout = TEIout + "<rdg wit='#"+wittnesseses[c]+"'>";
			for( let w = 0; w < lineelem.children.length; w++){
				if(lineelem.children[w].className.indexOf( "diffil" ) != -1){
				   TEIout = TEIout + " "+lineelem.children[w].innerHTML.split("<sup>")[0].replace( /<[^>]*span[^>]*>/gi, " ").replace( /<br[^>]*>/gi, ";")+"<note>Unterschied: "+lineelem.children[w].className+" </note>";
				} else {
					TEIout = TEIout + " "+lineelem.children[w].innerHTML.replace( /<[^>]*span[^>]*>/gi, " ").replace( /<br[^>]*>/gi, ";");
				}
			}
			TEIout = TEIout + "</rdg>";
		}
		TEIout = TEIout + "</app></l>\n";
	}
	TEIout = TEIout + "</lg>\n</body></text>\n</TEI>\n";
    dodownit( TEIout, currentedseries+'.xml','text/xml' );
}


function tocsv( ){
    comparatioparallel( 0 );
    let csvout = "";
    let infoelem = document.getElementById( "info" );
	for( let c = 0; c < infoelem.children.length; c += 1 ){
		csvout = csvout + csvtrenner;
	}
	for( let c = 0; c < infoelem.children.length; c += 1 ){
		csvout = csvout + (infoelem.children[c].innerHTML.split(";").join( " - " )).split("<br>").join( "" );
		csvout = csvout + csvtrenner;
	}
    csvout = csvout + "\n";
    let vergelem = document.getElementById( "vergleich" );
    let numOline = vergelem.children[0].children.length;
	for(let l = 0; l < numOline; l++){
		for(let c = 0; c < vergelem.children.length; c++){
			let lineelem = vergelem.children[c].children[l];
			for( let w = 0; w < lineelem.children.length; w++){
                if( lineelem.children[w].className.indexOf( "linenum" ) == -1){ //ksip lin numbers
				    if( lineelem.children[w].className.indexOf( "diffil" ) != -1 ){
                        let worrr = lineelem.children[w].innerHTML.split("<sup>")[0];
					    csvout = csvout + " " + worrr.toUpperCase( );
				    } else {
					    if(lineelem.children[w].className.indexOf( "toolong" ) == -1){
					        if(lineelem.children[w].style.display.indexOf( "none" ) != -1){
							    for(let r = 0; r < lineelem.children[w].children.length; r++){
								    if(lineelem.children[w].children[r].className.indexOf( "diffil" ) != -1){
									    let worrr = lineelem.children[w].children[r].innerHTML.split("<sup>")[0];
									    csvout = csvout + " " + worrr.toUpperCase();
								    } else {
									    let worrr = lineelem.children[w].children[r].innerHTML;
									    csvout = csvout + " " + worrr;
									
								    }
							    }
						    } else {
							    let worrr = lineelem.children[w].innerHTML;
							    csvout = csvout + " " + worrr;
							
						    }
					    } 
				    }
                }
			}
            csvout = csvout + csvtrenner;
		}
        csvout = csvout + "\n";
	}
	
	let wnd = window.open("about:blank", "", "_blank");
	wnd.document.write( csvout );	
    dodownit( csvout, currentedseries+'.csv','text/text' );
}

function toxlsx(){
    comparatioparallel( 0 );
    let csvout = "";
    let infoelem = document.getElementById( "info" );
	let allrows = [];
    let row = [];
	for( let c = 0; c < infoelem.children.length; c += 1 ){
		row.push( (infoelem.children[c].innerHTML.split(";").join( " - " )).split("<br>").join( "" ) );
	}
    allrows.push(row);
    let vergelem = document.getElementById( "vergleich" );
    let numOline = vergelem.children[0].children.length;
	for(let l = 0; l < numOline; l++){
        row = [];
		for(let c = 0; c < vergelem.children.length; c++){
			let lineelem = vergelem.children[c].children[l];
            let acell = "";
			for( let w = 0; w < lineelem.children.length; w++){
                if( lineelem.children[w].className.indexOf( "linenum" ) === -1){ //ksip lin numbers
				    if( lineelem.children[w].className.indexOf( "diffil" ) !== -1 ){
                        let worrr = lineelem.children[w].innerHTML;//.split("<sup>")[0];
					    acell = acell + " " + worrr;//.toUpperCase();
				    } else {
					    if(lineelem.children[w].className.indexOf( "toolong" ) == -1){
					        if(lineelem.children[w].style.display.indexOf( "none" ) != -1){
							    for(let r = 0; r < lineelem.children[w].children.length; r++){
								    if(lineelem.children[w].children[r].className.indexOf( "diffil" ) != -1){
									    let worrr = lineelem.children[w].children[r].innerHTML;//.split("<sup>")[0];
									    acell = acell + " " + worrr;//.toUpperCase();
								    } else {
									    let worrr = lineelem.children[w].children[r].innerHTML;
									    acell = acell + " " + worrr;
									
								    }
							    }
						    } else {
							    let worrr = lineelem.children[w].innerHTML;
							    acell = acell + " " + worrr;
							
						    }
					    } 
				    }
                }
			}
            row.push(  acell );
		}
        allrows.push(row);
	}
	
    let wb = XLSX.utils.book_new( );
    wb.Props = {
                Title: currentedseries,
                Subject: currentedseries,
                Author: "eComparatio",
                CreatedDate: new Date()
    };
    wb.SheetNames.push( currentedseries );
    let ws = XLSX.utils.aoa_to_sheet( allrows, {cellHTML:true} );
    wb.Sheets[ currentedseries ] = ws;
    
    let xlsxout = XLSX.write( wb, { bookType:'xlsx',  type: 'binary' } );
    dodownit( s2ab( xlsxout ), currentedseries+'.xlsx','application/octet-stream' );
}


function tolatex( ){
	comparatioparallel( 0 ); //does that mean only the first displayed lines could be rendered - do we need to reset the maxline count
	let LATEXout = "\\documentclass[a0paper]{article}\n" 
				  +"\\usepackage[utf8]{inputenc}"
				  +"\\usepackage[greek.polutoniko,ngerman]{babel}\n"
				  +"\\newcommand{\\pg}{\\textgreek} \n"
				  +"\\usepackage{longtable}\n"
				  +"\\usepackage{ltcaption}\n"
				  +"\\usepackage{graphicx}\n"
				  +"\\usepackage{hyperref}\n"
				  +"\\usepackage[landscape]{geometry}\n"
				  +"\\linespread{1.05} \n"
				  +"\\usepackage{tgpagella}\n"
				  +"\\begin{document}\n"
				+"\\small \\begin{center}\n"
				+"\\begin{longtable}{\n";
	let vergelem = document.getElementById( "vergleich" );
	for(let c = 0; c < vergelem.children.length; c++){
		LATEXout = LATEXout + "|l";
	}
	LATEXout = LATEXout + "|}\n";

	let infoelem = document.getElementById( "info" );
	LATEXout = LATEXout + "\\hline ";
	for( let c = 0; c < infoelem.children.length; c += 1 ){
		
		LATEXout = LATEXout + infoelem.children[c].innerHTML.split(";").join( " - " );
		if(c != infoelem.children.length-1){
			LATEXout = LATEXout + "&";
		}
	}
    //recompile reexp for bonbon
    regBonBon = new RegExp( bonbon, 'g' );
	LATEXout = LATEXout + "\\\\";
	let numOline = vergelem.children[0].children.length;
	for(let l = 0; l < numOline; l++){
		LATEXout = LATEXout + "\\hline \n";
		for(let c = 0; c < vergelem.children.length; c++){
			let lineelem = vergelem.children[c].children[l];
			for( let w = 0; w < lineelem.children.length; w++){
				if(lineelem.children[w].className.indexOf( "diffil" ) != -1){

					let worrr = lineelem.children[w].innerHTML.split("<sup>")[0];
					let buchsdewo = delall(worrr.replace(" ", "").replace(regBonBon, "---").normalize("NFD")).split( "" );
					let howmuchgreek = 0;
					for( let b = 0; b < buchsdewo.length; b++ ){
						if(buchstGRI[ buchsdewo[ b ].toLowerCase() ]){
							howmuchgreek++;
						}
					}
                    if( howmuchgreek == buchsdewo.length ){
						LATEXout = LATEXout + " {\\it \\pg{" + worrr + "}}";
					} else {
						LATEXout = LATEXout + " {\\it " + worrr + "}";
					}
				   	
				} else {
					if(lineelem.children[w].className.indexOf( "toolong" ) == -1){
					if(lineelem.children[w].style.display.indexOf( "none" ) != -1){
							for(let r = 0; r < lineelem.children[w].children.length; r++){
								if(lineelem.children[w].children[r].className.indexOf( "diffil" ) != -1){
									let worrr = lineelem.children[w].children[r].innerHTML.split("<sup>")[0];
									let buchsdewo = delall(worrr.replace(" ", "").replace(regBonBon, "---").normalize("NFD")).split( "" );
									let howmuchgreek = 0;
									for( let b = 0; b < buchsdewo.length; b++ ){
										if(buchstGRI[ buchsdewo[b].toLowerCase() ]){
											howmuchgreek++;
										}
									}
                                    if( howmuchgreek == buchsdewo.length ){
				   							LATEXout = LATEXout+" {\\it \\pg{"+ worrr + "}}";
									} else {
										LATEXout = LATEXout+" {\\it "+ worrr + "}";
									}
								} else {
									let worrr = lineelem.children[w].children[r].innerHTML;
									let buchsdewo = delall(worrr.replace(regBonBon, "---").normalize("NFD")).split( "" );
									let howmuchgreek = 0;
									for( let b = 0; b < buchsdewo.length; b++ ){
										if(buchstGRI[ buchsdewo[b].toLowerCase() ]){
											howmuchgreek++
										}
									}
                                    if( howmuchgreek == buchsdewo.length-1 ){
										LATEXout = LATEXout + " \\pg{" + worrr +"}";
									} else{
										LATEXout = LATEXout + " " + worrr;
									}
								}
							}
						} else {
							let worrr = lineelem.children[w].innerHTML;
							let buchsdewo = delall(worrr.replace(" ", "").normalize("NFD")).split( "" );
							let howmuchgreek = 0;
							for( let b = 0; b < buchsdewo.length; b++ ){
								if(buchstGRI[ buchsdewo[b].toLowerCase() ]){
									howmuchgreek++
								}
							}
                            if( howmuchgreek == buchsdewo.length ){
								LATEXout = LATEXout + " \\pg{" + worrr +"}";
							}else{
								LATEXout = LATEXout + " " + worrr;
							}
						}
					} 
				}
			}
            LATEXout = LATEXout + "\n";
			if(c != vergelem.children.length-1){
					LATEXout = LATEXout + "&";
			}
		}
		
		LATEXout = LATEXout + "\\\\";
	}
	LATEXout = LATEXout + "\\hline\\end{longtable}\\end{center}\\end{document}";
	let wnd = window.open("about:blank", "", "_blank");
	wnd.document.write(LATEXout.replace(regBonBon, "---"));	
    dodownit( LATEXout, currentedseries+'.tex','text/text' );
}

/**************************************************************/
/*Autosave for EDIT and NEW */
/**************************************************************/


function autosavethe(){
    //console.log("autodone");
    
    let allinp = document.getElementsByTagName('input');
    for( let index = 0; index < allinp.length; ++index ) {
        if( allinp[ index ].value != "" ){
            allinp[ index ].placeholder = allinp[ index ].value;
        }
    }
    let alltexe = document.getElementsByTagName('textarea');
    for( let index = 0; index < alltexe.length; ++index ) {
        if( alltexe[ index ].value != "" ){
            alltexe[ index ].placeholder = alltexe[ index ].value;
        }
    }
    localStorage.setItem('AS', document.getElementById("intome").innerHTML );
    
}

/**************************************************************/
/*NEW ED Series*/
/**************************************************************/
function addED( ){ //this loads the input forms for new eds
    hidetextmenus( );
    //earased cts inp  | <span class='clickable' id='ctsinputbutton' onclick='mkctsinput()' style='font-size:110%;' title='Wenn CTS Server abgefragt werden sollen, hier klicken.'>CTS Input</span> 
    let rconfirm = false;
    if( localStorage.getItem( 'AS' ) != "" && notmodiffunction ){

        rconfirm = confirm("Wollen Sie die Autosave Daten als Ausgangspunkt ihrer Eingabe nutzen?");
    }
	
    if( rconfirm ){
        document.getElementById("intome").innerHTML = localStorage.getItem('AS');
        let allinp = document.getElementsByTagName('input');
        for( let index = 0; index < allinp.length; ++index ) {
            if( allinp[ index ].value == "" ){
                allinp[ index ].value = allinp[ index ].placeholder;
            }
        }
        let alltexe = document.getElementsByTagName('textarea');
        for( let index = 0; index < alltexe.length; ++index ) {
            if( alltexe[ index ].value == "" ){
                 alltexe[ index ].value = alltexe[ index ].placeholder;
            }
        }
        //daten müssen aus der 
    } else {
    document.getElementById("intome").innerHTML = "<div id='inpmenu'> <span class='clickable' onclick='location.reload();' title='Zurück zur Hauptansicht.'>Zur&uuml;ck</span> | <span class='clickable' onclick='showinputstyle()' style='font-size:140%;' title='Eingaberichtlinien'>&#9995;</span> | <span class='clickable' id='tastbutton' onclick='mkTASTAT()' style='font-size:140%;' title='Inline Tastatur für polytonisches Griechisch. (Betacode Umwandlung)'>&#9000;</span> | <span class='clickable' id='tcbutton' onclick='loadtestcase1()' style='font-size:110%;'>Test Case 1 Anaximander</span> | <span class='clickable' id='tcbutton2' onclick='loadtestcase2()' style='font-size:110%;' title='Testcase kurz, Deutsch'>Test Case 2 Bruder Lustig</span> | <span class='clickable' id='tcbutton2' onclick='loadtestcase3()' style='font-size:110%;' title='Testcase länger, Latein'>Test Case 3 Res gestae</span> | <span class='clickable' id='buggbutton2' onclick='buggreport()' style='font-size:110%;' title='Email an den Admin.'>📧</span> | <span class='clickable' id='inputhelp' onclick='openHelpAdd();' style='font-size:110%;' title='Online Hilfe aufrufen.'>Hilfe</span></div><div id='tastetc' style='display:none;'><div id='tatst' class='tastat'></div><div class='clear'></div><textarea style='margin:2px; margin-left:50px;' id='greekout'></textarea><textarea style='margin:2px;' id='betaout'></textarea></div><div id='bildschtastat'></div><form id='newedform' name='newedform' method='post' action='scri/addED.php'><div class='persbez'><input type='text' id='aname' name='aname' placeholder='Ihr Vorname + Name*'/><input type='text' id='aemail' name='aemail' placeholder='Ihre Email-Adresse*'/><input type='text' name='edKname' id='edKname' placeholder='Kurzbezeichnung der Edition (ein Wort)*'/><br/><br/><lable>Synchronisierung der Suche im Wortabstand von </lable><input style='width:20%;' type='text' name='synchdist' id='synchdist' value='20'/><br/><lable>Latein U-V angleichen</lable> <input style='width:10px;' type='checkbox' id='latinuv' name='latinuv' value='1'/><br/><lable>Alternative Sortierung</lable> <input style='width:10px;' type='checkbox' id='altsort' name='altsort' value='1'/><br/></div><br/><div id='eds'><div class='oneed'><input type='hidden' name='ed0number' value='0' /><input type='text' name='ed0source' placeholder='Ursprung des digitalen Texts (URL / URN)'/><input type='text' name='ed0editor' placeholder='Editor(en) (Name1 Vorname1; Vorname2 Name2; ... )*'/><input type='text' name='ed0name' placeholder='Name der Edition*'/><input type='text' name='ed0publishingplace' placeholder='Erscheinungsort*'/><input type='text' name='ed0publishingdate' placeholder='Erscheinungsdatum*'/><input type='text' name='ed0belegst' placeholder='Belegstelle'/><textarea type='text' id='ed0text' name='ed0text' placeholder='Text der Edition*'></textarea></div><script></script> </div><!--eds--><div class='ednewmenu'><span class='clickable' onclick='addnewedtext()'>+ Edition</span> <span class='clickable' onclick='submitneweds( false )'>&Uuml;bernehmen!</span> <span class='clickable' onclick='editionsaction( null );'>Abbrechen</span></div></form>";
    }
    //TEXT IS IN newed.html, this is just string version
    theautosavelet = window.setInterval( autosavethe, autosaveinervall );
}


function addnewedtext( ){ //this assd a new inputfeald to a new ed set
      let numberofed = document.getElementById( "eds" ).children.length/2;
      let d = document.createElement("div");
      d.className = "oneed";
      let inputnumber = document.createElement("input");
      inputnumber.type = "hidden";
      inputnumber.name = "ed"+numberofed.toString()+"number";
      inputnumber.value = numberofed.toString();
      d.appendChild(inputnumber);
	  let inputsource = document.createElement("input");
      inputsource.type = "text";
      inputsource.name = "ed"+numberofed.toString()+"source";
      inputsource.placeholder = "Ursprung des digitalen Texts (URL / URN)";
      d.appendChild(inputsource);
      let inputeditor = document.createElement("input");
      inputeditor.type = "text";
      inputeditor.name = "ed"+numberofed.toString()+"editor";
      inputeditor.placeholder = "Editor(en) (Name1 Vorname1; Name2 Vorname2; ... )";
      d.appendChild(inputeditor);
      let inputname = document.createElement("input");
      inputname.type = "text";
      inputname.name = "ed"+numberofed.toString()+"name";
      inputname.placeholder = "Name der Edition";
      d.appendChild(inputname);
      let inputpp = document.createElement("input");
      inputpp.type = "text";
      inputpp.name = "ed"+numberofed.toString()+"publishingplace";
      inputpp.placeholder = "Erscheinungsort";
      d.appendChild(inputpp);
      let inputpd = document.createElement("input");
      inputpd.type = "text";
      inputpd.name = "ed"+numberofed.toString()+"publishingdate";
      inputpd.placeholder = "Erscheinungsdatum";
      d.appendChild(inputpd);
	  let inputbel = document.createElement("input");
      inputbel.type = "text";
      inputbel.name = "ed"+numberofed.toString()+"belegst";
      inputbel.placeholder = "Belegstelle";
      d.appendChild(inputbel);
      let text = document.createElement("textarea");
      text.id = "ed"+numberofed.toString()+"text";
      text.setAttribute("name", "ed"+numberofed.toString()+"text"); 
      text.placeholder = "Text der Edition";
      d.appendChild(text);
      document.getElementById( "eds" ).appendChild( d );
	  let dd = document.createElement("span");
	  document.getElementById( "eds" ).appendChild( dd );//im php wid ein script element hinzugefügt, das den inhalt läd, der index des textes sind die elemente in eds zur hälfte, dahe rkann diese funktion nicht nur eine element hinzufügen, sondern noch ein weiteres
	  document.getElementById( "intome" ).style.height = 
		(document.getElementById( "eds" ).offsetHeight+300).toString() + "px";
}


function submitneweds( justdata ){ //this submits the data to the server and checks for varius konventionen
    if( !justdata ){
        if( document.getElementById( "eds" ).children.length == 1){
                alert("Sie haben nur eine Edition eingeben, bitte geben Sie mindestens eine zweite ein.");
                    return;
        }
        if( document.getElementsByName( "edKname" )[0].value == ""){
                alert("Bitte Kurzbezeichung der Editionsserie angeben (ein Wort).");
                    return;
        }
	    let akurzbesch = document.getElementsByName( "edKname" )[0].value.split(" ");
	    if( akurzbesch.length > 1 ){
                alert("Bitte nur ein Wort als Kurzbezeichnung der Textserie angeben.");
                    return;
        }
	    if( bibdynvars[document.getElementsByName( "edKname" )[0].value] && !offlineedit ){ 
		    alert("Die Kurzbezeichung der Textserie existiert bereits.");
                    return;
	    }
        if( document.getElementsByName( "aname" )[0].value == ""){
                alert("Bitte geben Sie ihren Namen ein!");
                    return;
        }
        if( document.getElementsByName( "aemail" )[0].value == ""){
                alert("Bitte geben Sie ihren email Adresse an!");
                    return;
        }
    }
	//escape der Eingabe
	document.getElementsByName( "edKname" )[0].value = escapeAStr(document.getElementsByName( "edKname" )[0].value);
	document.getElementsByName( "aname" )[0].value = escapeAStr(document.getElementsByName( "aname" )[0].value);
	document.getElementsByName( "aemail" )[0].value = escapeAStr(document.getElementsByName( "aemail" )[0].value);
	console.log(escapeAStr(document.getElementsByName( "aname" )[0].value), document.getElementsByName( "aname" )[0].value)
	let editorennamen = {};
	for(let c = 0; c < document.getElementById( "eds" ).children.length; c++){

		let oneed = document.getElementById( "eds" ).children[ c ];
		
		for(let cc = 1; cc < oneed.children.length; cc++){
			//console.log(oneed.children[cc].value);

			if( cc == 2 ){
				if( oneed.children[cc].value == ""){
					alert("Bitte geben Sie für alle Einträge den Editor an!");
            	    return 0;
				} else {
					if( editorennamen[ oneed.children[cc].value ] ){
						oneed.children[cc].value = oneed.children[cc].value + editorennamen[ oneed.children[cc].value ].toString();
						editorennamen[ oneed.children[cc].value ] += 1; 
					} else {
						editorennamen[ oneed.children[cc].value  ] = 1;
					}
				}
			}
			if(cc == 3 && oneed.children[cc].value == ""){
				alert("Bitte geben Sie für alle Einträge den Titel an!");
                return 0;
			}
			if(cc == 7 && oneed.children[cc].value == ""){
				alert("Bitte geben Sie für alle Einträge den Text an!");
                return 0;
			}
			oneed.children[ cc ].value = escapeAStr( oneed.children[cc].value );
		}
	}
    let DOonline = false;
    if( DOonline ){
        document.getElementById( "newedform" ).submit();
    } else {
        let BibBib = [];
        let countrealelem = 0;
        let TExtText = [];
        let eeeddddsss = document.getElementsByClassName( "oneed" );
        for( let c = 0; c < eeeddddsss.length; c++ ){
            let oneed = eeeddddsss[c];
            if( oneed.nodeName != "SCRIPT" ){
                BibBib.push( [] );
                for(let cc = 0; cc < oneed.children.length; cc++){
                    if(cc == 0){
                        BibBib[countrealelem].push( parseInt( oneed.children[cc].value ) );
                    } else if(cc < 7){
                        BibBib[countrealelem].push( oneed.children[cc].value );
                    } else {
                        TExtText.push( oneed.children[cc].value.replace(cleanundamplt, "<").replace(cleanundamplt2, "<").replace(cleanundamplt3, "<").replace(cleanundampgt, ">").replace(cleanundampgt2, ">").replace(cleanundampgt3, ">").replace(cleanundamponly, " ").replace(cleanundamponly2, " ") );
                    }
                }
                countrealelem++;
            }
        }
        //sorting
        let TEnames = [];
        let orderedBib = [];
        let orderedText = [];
        for(let reihe = 0; reihe < BibBib.length; reihe++){
            for(let b in BibBib){
                if(BibBib[b][0] == reihe){
                    TEnames.push([BibBib[b][0], BibBib[b][2], BibBib[b][3], BibBib[b][4]+" "+BibBib[b][5]+".txt"]);
                    orderedBib.push(BibBib[b]);
                    orderedText.push(TExtText[b]);
                }
            }
        }
        if( !justdata ){
            //keeporiginaltexts
            
            localStorage.setItem("ecompPLAINTE"+document.getElementsByName( "edKname" )[0].value,  JSON.stringify( orderedText ));
            //run vergleiche
            ecomparatioVerg( document.getElementsByName( "edKname" )[0].value, TEnames, orderedBib, orderedText, document.getElementById("latinuv").checked,  parseInt(document.getElementById("synchdist").value), document.getElementById("altsort").checked );
            } else {
                return document.getElementsByName( "edKname" )[0].value +" ++ "+ JSON.stringify( TEnames ) +" ++ "+ JSON.stringify( orderedBib ) +" ++ "+ JSON.stringify( orderedText ) +" ++ "+ document.getElementById("latinuv").checked.toString() + " ++ " + document.getElementById("synchdist").value + " ++ " + document.getElementById("altsort").checked.toString();
        }
    }
}

/**************************************************************/
/*MODIFIE ED SERIES*/
/**************************************************************/
function modED( ){ 
    notmodiffunction = false;
    offlineedit = false;
    let menuelem = document.getElementById( "alledmenu" );
    let mstr = "Bearbeiten von:<br/><form  name='edited' action='scri/editED.php'><select name='edsn' style='width:auto;'>";
      for( let c in menuelem.children ){
            mstr = mstr + "<option value='"+menuelem.children[c].innerHTML +"'>"+ menuelem.children[c].innerHTML +"</option>";
      }
      mstr = mstr + "</select><br/><INPUT TYPE=submit VALUE='&Ouml;ffnen'></form><span class='clickableED' onclick='closediv( \"hilfe\" )'>&#9746;</span>";
      showhelpwithstr( mstr );
}

function modEDoffline( ){
    notmodiffunction =  false;
    let menuadd = localStorage.getItem("ecompmenuADD");
    if( menuadd ){
        let spaspa = menuadd.split( "</span>" );
        let mstr = "Offline bearbeiten von:<br/><select name='edsn' onchange='buildeditviewoffline(this);' style='width:auto;'><option value=''>?</option>";
        for( let spispa in spaspa ){
            if(spaspa[spispa].indexOf(">") != -1){
                mstr = mstr + "<option value='"+ spaspa[spispa].split(">")[1] +"'>"+spaspa[spispa].split(">")[1] +"</option>";
            }
        }
        mstr = mstr + "</select><br/><span class='clickableED' onclick='closediv( \"hilfe\" )'>&#9746;</span>";
        showhelpwithstr( mstr );
    }
} 

function buildeditviewoffline( aselection ){
    if( aselection.value != "" ){
        addED( );
        document.getElementById( "edKname" ).value = aselection.value;
        let te = JSON.parse(localStorage.getItem("ecompPLAINTE"+aselection.value ));
        if( te == null ){ //no plain version
            te = JSON.parse(localStorage.getItem("ecompALLTEX"+aselection.value ));
        }
        let bi = JSON.parse(localStorage.getItem("ecompBIB"+aselection.value ));
        if( bi == null ){
            bi = JSON.parse(localStorage.getItem("ecompTENAMES"+aselection.value ));
            for( let b in bi ){
                let num = bi[b][0].toString();
                document.getElementsByName("ed"+num+"editor")[0].value = bi[b][1];
                document.getElementsByName("ed"+num+"name")[0].value = bi[b][2];
                document.getElementsByName("ed"+num+"publishingplace")[0].value = bi[b][3].split(".txt")[0];
                try{
                    document.getElementsByName("ed"+num+"text")[0].value = te[b].join( " " ); //could be text or array fix it some times
                } catch( err ){ 
                    document.getElementsByName("ed"+num+"text")[0].value = te[b];
                }
                if(b < bi.length-1){
                    addnewedtext();
                }
            }
        } else { //if bib vars present - do it, if not use textnames
            for(let b in bi ){
                let num = bi[b][0].toString();
                document.getElementsByName("ed"+num+"source")[0].value = bi[b][1];
                document.getElementsByName("ed"+num+"editor")[0].value = bi[b][2];
                document.getElementsByName("ed"+num+"name")[0].value = bi[b][3];
                document.getElementsByName("ed"+num+"publishingplace")[0].value = bi[b][4];
                document.getElementsByName("ed"+num+"publishingdate")[0].value = bi[b][5];
                document.getElementsByName("ed"+num+"belegst")[0].value = bi[b][6];
                document.getElementsByName("ed"+num+"text")[0].value = te[b];

                if(b < bi.length-1){
                    addnewedtext();
                }
            }
        }
        offlineedit = true;
        closediv("hilfe");
    }
}

function addbibvalue( index, edsname ){
	let b = bibdynvars[edsname];
	for(let i = 0; i < b.length; i++){
		if( index == b[i][0] ){
			console.log( b[i] );
			document.getElementsByName( "ed"+index.toString()+"source" )[0].value = b[i][1];
			document.getElementsByName( "ed"+index.toString()+"editor" )[0].value = b[i][2];
			document.getElementsByName( "ed"+index.toString()+"name" )[0].value = b[i][3];
			document.getElementsByName( "ed"+index.toString()+"publishingplace" )[0].value = b[i][4];
			document.getElementsByName( "ed"+index.toString()+"publishingdate" )[0].value = b[i][5];
			document.getElementsByName( "ed"+index.toString()+"belegst" )[0].value = b[i][6];
		}
	}
}

/******************************************************************
Um die referentielle Integrität zu wahren wird bei eComparation nicht wirklich gelöscht, sondern unbrauchbares in ein Archiv verschoben
*******************************************************************/
function preparedelED( edname ){
    let mmenu = document.getElementById( "alledmenu" ).innerHTML;
    let menuparts = mmenu.split( edname );
    let parttomod = menuparts[0];

    let spanof = parttomod.split('<span ');
    let lastspan = spanof[spanof.length-1];
    let classsplit = lastspan.split('class="clickablesec"');
    //
    //console.log(lastspan);
    if(classsplit.length == 1){
        return; //edition ist bereits archiviert
    } else {
        classsplit[0] = 'class="clickablesec archive" ';
    }

    lastspan = classsplit.join("");
    let stylepart = lastspan.split('display: inline-block;');
    lastspan = stylepart.join('display: none;');
    spanof[spanof.length-1] = lastspan;
    parttomod = spanof.join('<span ');
    menuparts[0] = parttomod;
    mmenu = menuparts.join( edname );
    //console.log( mmenu );
    //
    document.getElementById( "mmmenutext" ).value = mmenu;
    document.getElementById( "deled" ).submit();
}

function delED( ){
      //
    let rconfirm = confirm("Sie sind dabei eine Textreihe zu löschen, wollen Sie das wirklich tun?");
	//get menu elem
    if( rconfirm ){
        //hier müssen wir nachbarbeiten - wenn es offline ist, dann richtig löschen
        
        let alledmenuelem = document.getElementById( "alledmenu" );
        
        for(let a = 0; a < alledmenuelem.children.length; a++){
            if( alledmenuelem.children[ a ].style.position == "absolute" ){
                
                if( currentedseries.toLowerCase ){
                    alledmenuelem.removeChild( alledmenuelem.children[ a ] ); //dump offline data
                    localStorage.removeItem( "ecompTENAMES"+currentedseries );
                    localStorage.removeItem( "ecompBIB"+currentedseries );
                    localStorage.removeItem( "ecompPLAINTE"+currentedseries );
                    localStorage.removeItem( "ecompRES"+currentedseries );
                    localStorage.removeItem( "ecompTENAMES"+currentedseries );
                    break;
                }else { 
                    alledmenuelem.children[ a ].style.position = "relative"; //just archive onlöine data
                    alledmenuelem.children[ a ].style.display = "none";
	                alledmenuelem.children[ a ].className = alledmenuelem.children[ a ].className + " archive";
                    break;
                }
            }
        }
        localStorage.setItem("ecompmenuADD", alledmenuelem.innerHTML );
        location.reload();
    }
}

function showdelED( ){
	let alledmenuelem = document.getElementById( "alledmenu" );
	for(let a = 0; a < alledmenuelem.children.length-8; a++){
		if( alledmenuelem.children[ a ].style.display  != "inline-block"){
			alledmenuelem.children[ a ].style.display = "inline-block";
		} else {
			alledmenuelem.children[ a ].style.display = "none";
		}
	}
}

/**************************************************************/
/*Helper for autosave AUTOSAVE AUTO SAVE EVAS OTUA*/
/**************************************************************/
//do it


/**************************************************************/
/*ED NEW + MOD HELPER FKT / INPUT                             */
/**************************************************************/
function inpJSON(){ //create dialog for fileinput
    
    if( window.File && window.FileReader && window.FileList && window.Blob ){

        
        showhelpwithstr( "<div onclick='closediv( \"hilfe\" );'>x</div>" );
        let inputelem = document.createElement("input");
        inputelem.id = "fs";
        inputelem.name = "file";
        inputelem.type = "file";
        //inputelem.multiple = "multiple";
        console.log('addevent');
        inputelem.addEventListener('change', inpfileselected, false);
        document.getElementById( "hilfe" ).appendChild( inputelem );
    } else {
        alert('Benutzen Sie einen jüngeren Browser, Dateiaufruf ist in Ihrem nicht implementiert.');
    }
}

function inpastextarray( astextarray ){
    for(let i = 0; i < astextarray.length; i += 1 ){
        let edseriename = astextarray[i][0].split( ".json" )[0];
        let drei = astextarray[i][1].split("'comparatio' :");
        let zwei = drei[ 0 ].split("'alltexts' :");

        let inpcomparatio =  drei[1].substring( 0, drei[1].lastIndexOf("}") ).trim();//noch letze klammer raus
        let inpalltexts = zwei[1].substring( 0, zwei[1].lastIndexOf(",")).trim(); //alltexts, noch letzes komma raus
        let inptextnames = zwei[0].split("'textnames' :")[1];
        inptextnames = inptextnames.substring( 0, inptextnames.lastIndexOf(",") ).trim();

        //console.log(inptextnames);
        //console.log(inpalltexts);
        //console.log(inpcomparatio);
        //put it to the local storage and do a menu add and reload page fertsch
        localStorage.setItem("ecompTENAMES"+edseriename, inptextnames );
        localStorage.setItem("ecompBIB"+edseriename, inptextnames );
        localStorage.setItem("ecompALLTEX"+edseriename, inpalltexts );
        localStorage.setItem("ecompRES"+edseriename, inpcomparatio );

        let oldadd = "";
        if( localStorage.getItem("ecompmenuADD") ){
            oldadd = localStorage.getItem("ecompmenuADD");
        }
        let newmenuadd = oldadd+' <span class="clickablesec offlmenu" style="position: relative;" id="'+edseriename+'" onclick="loadcomparatio(\''+edseriename+'\');">'+edseriename+'</span>';
        localStorage.setItem("ecompmenuADD", newmenuadd );
    }
}

function inpfileselected( ev ) {
    let files = ev.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    let output = [];
    for (let i = 0, f; f = files[i]; i++) {
        //let dadadad = "{'textnames' :"+ localStorage.getItem("ecompTENAMES"+currentedseries)+", "+
        //                "'alltexts' :" + localStorage.getItem("ecompALLTEX"+currentedseries) + ", " +
        //                "'comparatio' :" + localStorage.getItem("ecompRES"+currentedseries)  +"}";
        let edseriename = f.name.split( ".json" )[0]; 
        console.log(edseriename);

        //check if series exist??? - no why the hack

        let rere = new FileReader( );
       
        rere.onload = ( function( theFile ) {
            return function(e) {
                 if( e.target.readyState == FileReader.DONE ) {
                    //JSON.parse often not working, maby encoding issue, what ever, splitting willhit the problem
                    let drei = e.target.result.split("'comparatio' :");
                    let zwei = drei[ 0 ].split("'alltexts' :");
        
                    let inpcomparatio =  drei[1].substring( 0, drei[1].lastIndexOf("}") ).trim();//noch letze klammer raus
                    let inpalltexts = zwei[1].substring( 0, zwei[1].lastIndexOf(",")).trim(); //alltexts, noch letzes komma raus
                    let inptextnames = zwei[0].split("'textnames' :")[1];
                    inptextnames = inptextnames.substring( 0, inptextnames.lastIndexOf(",") ).trim();

                    //console.log(inptextnames);
                    //console.log(inpalltexts);
                    //console.log(inpcomparatio);
                    //put it to the local storage and do a menu add and reload page fertsch
                    localStorage.setItem("ecompTENAMES"+edseriename, inptextnames );
                    localStorage.setItem("ecompBIB"+edseriename, inptextnames );
                    localStorage.setItem("ecompALLTEX"+edseriename, inpalltexts );
                    localStorage.setItem("ecompRES"+edseriename, inpcomparatio );

                    let oldadd = "";
                    if( localStorage.getItem("ecompmenuADD") ){
                        oldadd =  localStorage.getItem("ecompmenuADD");
                    }
                    let newmenuadd = oldadd+' <span class="clickablesec offlmenu" style="position: relative;" id="'+edseriename+'" onclick="loadcomparatio(\''+edseriename+'\');">'+edseriename+'</span>';
                    localStorage.setItem("ecompmenuADD", newmenuadd );
                    location.reload();
                }
            };
        })( f );

        
        rere.readAsText(f);
    }
    

    closediv( "hilfe" );
  }

  

function mkctsinput( ){
    let intomeelem = document.getElementById( "intome" );
    intomeelem.style.height = (intomeelem.offsetHeight+10).toString() + "px";
    intomeelem.innerHTML = " <form id='ctsinpdialog'><input size='80' type='text' name='ctsinput1' id='ctsinput1' value='http://folio.furman.edu/ecomp-cts/api?request=GetPassage&urn='/><lable>(URL CTS Server)</lable><div id='ctsdirecttag'><div id='ctsurnlist'><input type='text' size='80' class='thectsurn' name='thectsurn0' id='thectsurn0' placeholder='CTS URN (getPassage)' value='urn:cts:greekLit:tlg0085.tlg003.schutz1782:1-400'/><input type='text' size='80' class='thectsurn' name='thectsurn1' id='thectsurn1' placeholder='CTS URN (getPassage)' value='urn:cts:greekLit:tlg0085.tlg003.fu:1-400'/></div>	<div><span class='clickable' onclick='morectspassages()'>+ CTS URN</span> |<span class='clickable' onclick='ctsdirektinput()'>Datenabfrage</span> |<span class='clickable' id='buttonshowctsxml' onclick='showctsxml()' style='display:none;'>XML Ergebnis</span> |<span class='clickable' id='buttonrequestverg' onclick='ctsTOtextTOrequest()' style='display:none;'>Vergleich</span></div></div></form><div id='ctsrequestrawresult'></div><form style='display:none;' id='newedform' name='newedform' method='post' action='scri/addED.php'><div class='persbez'><input type='text' id='aname' name='aname' placeholder='Ihr Vorname + Name*'/><input type='text' id='aemail' name='aemail' placeholder='Ihre Email-Adresse*'/><input type='text' name='edKname' id='edKname' placeholder='Kurzbezeichnung der Edition (ein Wort)*'/><br/><br/><lable>Synchronisierung der Suche im Wortabstand von </lable><input style='width:20%;' type='text' name='synchdist' id='synchdist' value='20'/><br/><lable>Latein U-V angleichen</lable> <input style='width:10px;' type='checkbox' id='latinuv' name='latinuv' value='1'/><br/><lable>Alternative Sortierung</lable> <input style='width:10px;' type='checkbox' id='altsort' name='altsort' value='1'/><br/></div><br/><div id='eds'></div><div id='edmenucts' class='ednewmenu' style='display:none;'><span class='clickable' onclick='addnewedtext()'>+ Edition</span> <span class='clickable' onclick='submitneweds( false )'>&Uuml;bernehmen!</span> <span class='clickable' onclick='editionsaction( null );'>Abbrechen</span></div></form>";

    //Text is in ctsinput.html, this is just string version
}

/*CTS INPUT AND REQUEST TO CTS SERVER*/

function ctsdirektinput(){
	ctsanswersXML = [];
	//"urn:cts:greekLit:tlg0085.tlg003.schutz1782:1-10"
	//"urn:cts:greekLit:tlg0085.tlg003.schutz1782:1-400"
	
	//"urn:cts:greekLit:tlg0085.tlg003.fu:1-10"
	//"urn:cts:greekLit:tlg0085.tlg003.fu:1-400"
	let urntags = document.getElementById( "ctsurnlist" ).children;
	
	let count = 0;
	
	for( let c = 0; c < urntags.length; c++ ){
        
		//console.log(document.getElementById( "ctsinput1" ).value + urntags[ c ].value);
		if( urntags[ c ].value ){
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() { 
                if (xmlHttp.readyState == 4 ){
                    if( xmlHttp.status == 200){
                        console.log( "uicki" );
                        document.getElementById("ctsrequestrawresult").innerHTML = xmlHttp.responseText;
                        ctsanswersXML.push( document.getElementById( "ctsrequestrawresult" ).innerHTML );
                        
					        count++;
					        if( count == urntags.length ){
						        document.getElementById( "ctsrequestrawresult" ).innerHTML = "";
						        document.getElementById( "eds" ).innerHTML = "";
						        document.getElementById( "buttonshowctsxml" ).style.display = "inline";
						        document.getElementById( "buttonrequestverg" ).style.display = "inline";
					        }
                    } else {
                        console.log("CTS dirct input. maby AJAX");
                    }
                } 
            }    
            console.log( c, urntags[ c ], urntags[ c ].value, document.getElementById( "ctsinput1" ).value + urntags[ c ].value );
            xmlHttp.open("GET", document.getElementById( "ctsinput1" ).value + urntags[ c ].value, false); // false for synchronous 
            xmlHttp.send(null);	
		}
	}
	
	let intomeelem = document.getElementById( "intome" );
	intomeelem.style.height = (intomeelem.offsetHeight+10).toString() + "px";

}

function morectspassages(){
	 let d = document.getElementById( "ctsurnlist" );
	 let inputsource = document.createElement("input");
     inputsource.type = "text";
	 inputsource.size = 80;	
     inputsource.placeholder = "CTS URN";
     d.appendChild(inputsource);
}

function showctsxml(){
	//console.log(ctsanswersXML);
	for( let x = 0; x < ctsanswersXML.length; x++ ){
		//console.log(x);
		//console.log(ctsanswersXML[x]);
		document.getElementById( "ctsrequestrawresult" ).innerHTML = document.getElementById( "ctsrequestrawresult" ).innerHTML + ctsanswersXML[x] + "<br/><br/><br/>";
	}
	//console.log("ende");
}

function ctsTOtextTOrequest(){
	//"urn:cts:greekLit:tlg0085.tlg003.schutz1782:1-10"
	//"urn:cts:greekLit:tlg0085.tlg003.schutz1782:1-400"
	
	//"urn:cts:greekLit:tlg0085.tlg003.fu:1-10"
	//"urn:cts:greekLit:tlg0085.tlg003.fu:1-400"
	document.getElementById( "ctsrequestrawresult" ).innerHTML = "";
	document.getElementById( "eds" ).innerHTML = "";
	document.getElementById( "edmenucts" ).style.display = "inline";
	document.getElementById( "newedform").style.display = "inline";
	console.log( ctsanswersXML );
	let allctstext = [];
	for( let x = 0; x < ctsanswersXML.length; x++ ){
		let ctsnodes = ctsanswersXML[ x ].split( "</l>" );
		let thewholetext = "";
		for( let z = 0; z < ctsnodes.length; z++ ){
			let lines = ctsnodes[ z ].split( "<l xmlns=" );
			let outlines = "";
			for( let y = 1; y < lines.length; y++ ){
				let linesbereiningt = lines[ y ].split(">");
				linesbereiningt.shift( );
				let linesbereiningtkurz = linesbereiningt.join(">");
				let zeichenin = linesbereiningtkurz.split("");
				let takeit = true;
				let nurdieworte = "";
				//console.log("zeichenin", zeichenin);
				for( let zei = 0; zei < zeichenin.length; zei ++){
					if( zeichenin[ zei ] == "<" ){
							takeit = false;
							continue;
					} else {
						if( zeichenin[ zei ] == ">" && takeit == false ){
							takeit = true;
							continue;
						}
					}
					
					if( takeit ){
						nurdieworte += zeichenin[ zei ];
					}
				}
				outlines += nurdieworte + "\n";
			}
			thewholetext += outlines;
		}
		//console.log( "thewholetext", thewholetext );
		allctstext.push( thewholetext );
	}
	let urntags = document.getElementById( "ctsurnlist" ).children;
	let baseurl = document.getElementById( "ctsinput1" ).value;
	
	for(let t = 0; t < allctstext.length; t++ ){
		let eddiv = document.createElement("div");
		eddiv.className = "oneed";	

		let ednuminp = document.createElement("input");
		ednuminp.type = "hidden";
		ednuminp.name = "ed"+t.toString()+"number";
		ednuminp.id = "ed"+t.toString()+"number";
		ednuminp.value = t.toString();
		eddiv.appendChild( ednuminp );

		let edquelleinp = document.createElement("input");
		edquelleinp.type = "text";
		edquelleinp.name = "ed"+t.toString()+"source";
		edquelleinp.id = "ed"+t.toString()+"source";
		edquelleinp.value = baseurl + urntags[ t ].value;
		eddiv.appendChild( edquelleinp );

	
		let ededitorinp = document.createElement("input");
		ededitorinp.type = "text";
		ededitorinp.name = "ed"+t.toString()+"editor";
		ededitorinp.id = "ed"+t.toString()+"editor";
		ededitorinp.placeholder = "Editor(en) (Name1 Vorname1; Vorname2 Name2; ... )*";
		eddiv.appendChild( ededitorinp );

		let ednameinp = document.createElement("input");
		ednameinp.type = "text";
		ednameinp.name = "ed"+t.toString()+"name";
		ednameinp.id = "ed"+t.toString()+"name";
		ednameinp.placeholder = "Name der Edition*";
		eddiv.appendChild( ednameinp );

		let edpublishingplaceinp = document.createElement("input");
		edpublishingplaceinp.type = "text";
		edpublishingplaceinp.name = "ed"+t.toString()+"publishingplace";
		edpublishingplaceinp.id = "ed"+t.toString()+"publishingplace";
		edpublishingplaceinp.placeholder = "Erscheinungsort*";
		eddiv.appendChild( edpublishingplaceinp );

      	let edpublishingdateinp = document.createElement("input");
		edpublishingdateinp.type = "text";
		edpublishingdateinp.name = "ed"+t.toString()+"publishingdate";
		edpublishingdateinp.id = "ed"+t.toString()+"publishingdate";
		edpublishingdateinp.placeholder = "Erscheinungsdatum*";
		eddiv.appendChild( edpublishingdateinp );

	  	let edbelegstinp = document.createElement("input");
		edbelegstinp.type = "text";
		edbelegstinp.name = "ed"+t.toString()+"belegst";
		edbelegstinp.id = "ed"+t.toString()+"belegst";
		edbelegstinp.placeholder = "Belegstelle";
		eddiv.appendChild( edbelegstinp );

      	let edtextinp = document.createElement("textarea");
		
		edtextinp.name = "ed"+t.toString()+"text";
		edtextinp.id = "ed"+t.toString()+"text";
		edtextinp.value = allctstext[ t ];
		eddiv.appendChild( edtextinp );

		document.getElementById( "eds" ).appendChild( eddiv );
	} 
	document.getElementById( "intome" ).style.height = 
		(document.getElementById( "eds" ).offsetHeight+300).toString() + "px";
}


/*USE CASE SECTION*/
function loadtestcase3(){
    let intomeelem = document.getElementById( "intome" );
intomeelem.style.height = (intomeelem.offsetHeight+10).toString() + "px";

document.getElementsByName("aname")[0].value = "hans im glück";
document.getElementsByName("aemail")[0].value = "hans@schwranz";
document.getElementsByName("edKname")[0].value = "Testcase3resgestae";
document.getElementById("synchdist" ).value = 100;
document.getElementById( "latinuv" ).checked = true;
document.getElementById( "altsort" ).checked = false;




document.getElementsByName("ed0editor")[0].value = "Hans Volkmann";
document.getElementsByName("ed0name")[0].value = "Res gestae divi Augusti";
document.getElementsByName("ed0publishingplace")[0].value = "Berlin";
document.getElementsByName("ed0publishingdate")[0].value = "1969";
document.getElementsByName("ed0text")[0].value = "Rerum gestarum divi Augusti,: quibus orbem terrarum imperio"
+"populi Romani subiecit, § et: impensarum, quas in rem publicam"
+"populumque Romanum fecit, incisarum § in duabus aheneis pilis,"
+"quae sunt Romae positae, exemplar subiectum."
+"1 Annos undeviginti natus exercitum privato consilio et privata"
+"impensa comparavi, § per quem rem publicam a dominatione factionis"
+"oppressam in libertatem vindicavi. Eo nomine senatus decretis "
+"honorificis in ordinem suum me adlegit, C. Pansa et A. Hirtio "
+"consulibus consularem locum sententiae dicendae tribuens et "
+"imperium mi :hi dedit. § Res publica ne quid detrimenti caperet, "
+"me pro praetore simul cum consulibus providere iussit. § Populus "
+"autem eodem anno me consulem, cum cos. uterque in bello cecidisset, "
+"et triumvirum rei publicae constituendae creavit. "
+"2 Qui parentem meum trucidaverunt, eos in exilium expuli iudiciis  "
+"legitimis ultus eorum facinus § et postea bellum inferentis rei "
+"publicae vici bis acie. "
+"3 Bella terra et mari civilia externaque toto in orbe terrarum "
+"saepe gessi, victorque omnibus veniam petentibus civibus peperci. "
+"§ Externas gentes, quibus tuto ignosci potuit, conservare quam "
+"excidere malui. § Millia civium Romanorum sub sacramento meo "
+"fuerunt circiter quingenta. § Ex quibus deduxi in colonias aut "
+"remisi in municipia sua stipendis emeritis millia aliquanto plura "
+"quam trecenta et iis omnibus agros adsignavi aut pecuniam pro "
+"praemiis militiae dedi. § Naves cepi sescentas praeter eas, si quae "
+"minores quam triremes fuerunt. "
+" 4 Bis ovans triumphavi et tris egi curulis triumphos et appellatus "
+"sum viciens et semel imperator, decernente pluris triumphos mihi  "
+"senatu quibus omnibus supersedi. § Laurum de fascibus deposui in "
+"Capitolio votis, quae quoque bello nuncupaveram, solutis. § Ob res "
+"a me aut per legatos meos auspicis meis terra marique prospere "
+"gestas quinquagiens et quinquiens decrevit senatus supplicandum "
+"esse dis immortalibus. § Dies autem per quos ex senatus consulto "
+"supplicatum est, fuere DCCCLXXXX. In triumphis meis ducti "
+"sunt ante currum meum reges aut regum liberi novem. Consul "
+"fueram terdeciens, cum scribebam haec, et eram septimum et "
+"tricensimum tribuniciae potestatis. "
+"5 Dictaturam et apsenti et praesenti mihi delatam et a populo et a "
+"senatu M. Marcello et L . Arruntio cos. non recepi. Non "
+"sum deprecatus in summa frumenti penuria curationem annonae, "
+"quam ita administravi, ut intra dies paucos metu et periclo praesenti "
+"civitatem universam liberarem impensa et cura mea. § Consulatum "
+"quoque tum annuum et perpetuum mihi delatum non recepi. "
+"6 Consulibus M. Vinicio et Q. Lucretio et postea P. Lentulo et Cn. "
+"Lentulo et tertium Paullo Fabio Maximo et Q. Tuberone senatu "
+"populoque Romano consentientibus ut curator legum et morum "
+"summa potestate solus crearer, nullum magistratum contra morem "
+"maiorum delatum recepi. § Quae tum per me geri senatus voluit, "
+"per tribuniciam potestatem perfeci, cuius potestatis conlegam et "
+"ipse ultro quinquiens a senatu depoposci et accepi. "
+"7 Triumvirum rei publicae constituendae fui per continuos annos "
+"decem.  Princeps senatus fui usque ad eum diem, quo scripseram "
+"haec, per annos quadraginta. Pontifex maximus, augur, XV "
+"virum sacris faciundis, VII virum epulonum, frater arvalis, sodalis "
+"Titius, fetialis fui. "
+"8 Patriciorum numerum auxi consul quintum iussu populi et "
+"senatus. § Senatum ter legi. Et in consulatu sexto censum populi "
+"conlega M. Agrippa egi. § Lustrum post annum alterum et quadragensimum "
+"feci. § Quo lustro civium Romanorum censa sunt capita "
+"quadragiens centum millia et sexaginta tria millia. § Tum iterum "
+"consulari cum imperio lustrum solus feci C. Censorino et C. Asinio "
+"cos., quo lustro censa sunt civium Romanorum capita quadragiens "
+"centum millia et ducenta triginta tria millia. Et tertium consulari "
+"cum imperio lustrum conlega Tib. Caesare filio meo feci Sex. "
+"Pompeio et Sex. Appuleio cos., quo lustro censa sunt civium Romanorum "
+"capitum quadragiens centum millia et nongenta triginta et "
+"septem millia. §Legibus novis me auctore latis multa exempla "
+"maiorum exolescentia iam ex nostro saeculo reduxi et ipse multarum "
+"rerum exempla imitanda posteris tradidi. "
+"9 Vota pro valetudine mea suscipi per consules et sacerdotes quinto "
+"quoque anno decrevit senatus. Ex iis votis saepe fecerunt vivo me "
+"ludos aliquotiens sacerdotum quattuor amplissima collegia, aliquotiens "
+"consules. Privatim etiam et municipatim universi cives "
+"unanimiter continenter apud omnia pulvinaria pro valetudine mea "
+"supplicaverunt. "
+"10 Nomen meum senatus consulto inclusum est in saliare carmen, "
+"et sacrosanctus in perpetum ut essem et, quoad viverem, tribunicia "
+"potestas mihi esset, per legem sanctum est. Pontifex maximus "
+"ne fierem in vivi conlegae mei locum, populo id sacerdotium "
+"deferente mihi, quod pater meus habuerat, recusavi. Quod sacerdotium "
+"aliquod post annos, eo mortuo qui civilis motus occasione "
+"occupaverat, cuncta ex Italia ad comitia mea confluente multitudine, "
+"quanta Romae nunquam fertur ante id tempus fuisse, recepi P. "
+"Sulpicio C. Valgio consulibus. "
+"11 Aram Fortunae Reducis ante aedes Honoris et Virtutis ad "
+"portam Capenam pro reditu meo senatus consacravit, in qua "
+"pontifices et virgines Vestales anniversarium sacrificium facere "
+"iussit eo die, quo consulibus Q. Lucretio et M. Vinicio in urbem "
+"ex Syria redieram, et diem Augustalia ex cognomine nostro appellavit.  "
+"12 Ex senatus auctoritate pars praetorum et tribunorum plebi  "
+"cum consule Q. Lucretio et principibus viris obviam mihi missa est "
+"in Campaniam, qui honos ad hoc tempus nemini praeter me est "
+"decretus. Cum ex Hispania Galliaque, rebus in iis provincis "
+"prospere gestis, Romam redi Ti. Nerone P. Quintilio consulibus, "
+"aram Pacis Augustae senatus pro reditu meo consacrandam censuit "
+"ad campum Martium, in qua magistratus et sacerdotes virginesque "
+"Vestales anniversarium sacrificium facere iussit. "
+"13 Ianum Quirinum, quem claussum esse maiores nostri voluerunt, "
+"cum per totum imperium populi Romani terra marique esset parta "
+"victoriis pax, cum, priusquam nascerer, a condita urbe bis omnino "
+"clausum fuisse prodatur memoriae, ter me principe senatus claudendum "
+"esse censuit. "
+"14 Filios meos, quos iuvenes mihi eripuit fortuna, Gaium et "
+"Lucium Caesares honoris mei caussa senatus populusque Romanus "
+"annum quintum et decimum agentis consules designavit, ut eum "
+"magistratum inirent post quinquennium. Et ex eo die, quo deducti sunt "
+"in forum, ut interessent consiliis publicis decrevit senatus. § Equites "
+"autem Romani universi principem iuventutis utrumque eorum "
+"parmis et hastis argenteis donatum appellaverunt. "
+"15 Plebei Romanae viritim HS trecenos numeravi ex testamento "
+"patris mei et nomine meo HS quadringenos ex bellorum manibiis "
+"consul quintum dedi, iterum autem in consulatu decimo ex patrimonio "
+"meo HS quadringenos congiari viritim pernumeravi, et "
+"consul undecimum duodecim frumentationes frumento privatim "
+"coempto emensus sum, et tribunicia potestate duodecimum quadringenos "
+"nummos tertium viritim dedi. Quae mea congiaria pervenerunt "
+"ad hominum millia nunquam minus quinquaginta et "
+"ducenta. § Tribuniciae potestatis duodevicensimum consul XII "
+"trecentis et viginti millibus plebis urbanae sexagenos denarios "
+"viritim dedi. § Et colonis militum meorum consul quintum ex "
+"manibiis viritim millia nummum singula dedi; acceperunt id "
+"triumphale congiarium in colonis hominum circiter centum et "
+"viginti millia. § Consul tertium decimum sexagenos denarios  "
+"plebei, quae tum frumentum publicum accipiebat, dedi; ea millia "
+"hominum paullo plura quam ducenta fuerunt. "
+"16 Pecuniam pro agris, quos in consulatu meo quarto et postea "
+"consulibus M. Crasso et Cn. Lentulo Augure adsignavi militibus, "
+"solvi municipis. Ea summa sestertium circiter sexsiens milliens fuit, "
+"quam pro Italicis praedis numeravi, et circiter bis milliens et sescentiens, "
+"quod pro agris provincialibus solvi. § Id primus et solus omnium, "
+"qui deduxerunt colonias militum in Italia aut in provincis, ad "
+"memoriam aetatis meae feci. Et postea Ti. Nerone et Cn. Pisone "
+"consulibus itemque C. Antistio et D. Laelio cos. et C. Calvisio "
+"et L . Pasieno consulibus et L . Lentulo et M. Messalla consulibus et "
+"L. Caninio et Q. Fabricio cos. militibus, quos emeriteis stipendis in "
+"sua municipia deduxi, praemia numerato persolvi, quam in rem "
+"sestertium quater milliens circiter impendi.  "
+"17 Quater pecunia mea iuvi aerarium ita, ut sestertium milliens  "
+"et quingentiens ad eos, qui praerant aerario, detulerim. Et M.  "
+"Lepido et L. Arruntio cos. in aerarium militare, quod ex consilio  "
+"meo constitutum est, ex quo praemia darentur militibus, qui vicena  "
+"aut plura stipendia emeruissent, HS milliens et septingentiens ex  "
+"patrimonio meo detuli.  "
+"18 Ab eo anno, quo Cn. et P. Lentuli consules fuerunt, cum  "
+"deficerent vectigalia, tum centum millibus hominum tum pluribus  "
+"multo frumentarios et nummarios tributus ex horreo et patrimonio  "
+"meo edidi.  "
+"19 Curiam et continens ei Chalcidicum templumque Apollinis in  "
+"Palatio cum porticibus, aedem divi Iuli, Lupercal, porticum ad circum  "
+"Flaminium, quam sum appellari passus ex nomine eius, qui  "
+"priorem eodem in solo fecerat, Octaviam, pulvinar ad circum  "
+"maximum, aedes in Capitolio Iovis Feretri et Iovis Tonantis,  "
+"aedem Quirini, aedes Minervae et Iunonis Reginae et Iovis Libertatis  "
+"in Aventino, aedem Larum in summa sacra via, aedem deum   "
+"Penatium in Velia, aedem Iuventatis, aedem Matris Magnae in  "
+"Palatio feci.  "
+"20 Capitolium et Pompeium theatrum utrumque opus impensa  "
+"grandi refeci sine ulla inscriptione nominis mei. § Rivos aquarum  "
+"compluribus locis vetustate labentes refeci, et aquam, quae Marcia  "
+"appellatur, duplicavi fonte novo in rivum eius inmisso. § Forum  "
+"Iulium et basilicam, quae fuit inter aedem Castoris et aedem  "
+"Saturni, coepta profligata que opera a patre meo, perfeci et eandem  "
+"basilicam consumptam incendio ampliato eius solo sub titulo nominis  "
+"filiorum meorum incohavi et, si vivus non perfecissem, perfici  "
+"ab heredibus meis iussi. Duo et octoginta templa deum in urbe  "
+"consul sextum ex auctoritate senatus refeci, nullo praetermisso, quod  "
+"eo tempore refici debebat. Consul septimum viam Flaminiam ab  "
+"urbe Ariminum refeci pontesque omnes praeter Mulvium et  "
+"Minucium.  "
+"21 In privato solo Martis Ultoris templum forumque Augustum  "
+"ex manibiis feci. § Theatrum ad aedem Apollinis in solo magna ex  "
+"parte a privatis empto feci, quod sub nomine M. Marcelli generi mei  "
+"esset. § Dona ex manibiis in Capitolio et in aede divi Iuli et in  "
+"aede Apollinis et in aede Vestae et in templo Martis Ultoris consacravi,  "
+"quae mihi constiterunt HS circiter milliens. § Auri coronari  "
+"pondo triginta et quinque millia municipiis et colonis Italiae conferentibus  "
 +"ad triumphos meos quintum consul remisi et postea,  "
 +"quotienscumque imperator appellatus sum, aurum coronarium non  "
 +"accepi decernentibus municipiis et colonis aeque benigne adque  "
 +"antea decreverant.  "
 +"22 Ter munus gladiatorium dedi meo nomine et quinquiens  "
 +"filiorum meorum aut nepotum nomine, quibus muneribus depugnaverunt  "
 +"hominum circiter decem millia. § Bis athletarum undique  "
 +"accitorum spectaculum populo praebui meo nomine et tertium  "
 +"nepotis mei nomine. § Ludos feci meo nomine quater, aliorum  "
 +"autem magistratuum vicem ter et viciens. § Pro conlegio XV virorum  "
 +"magister conlegii collega M. Agrippa ludos saeclares C. Furnio   "
 +"C. Silano cos. feci. Consul XIII ludos Martiales primus feci, quos post  "
 +"id tempus deinceps insequentibus annis s.c. et lege fecerunt consules.  "
 +"§ Venationes bestiarum Africanarum meo nomine aut  "
 +"filiorum meorum et nepotum in circo aut in foro aut in amphitheatris  "
 +"populo dedi sexiens et viciens, quibus confecta sunt bestiarum  "
 +"circiter tria millia et quingentae.  "
 +"23 Navalis proeli spectaclum populo dedi trans Tiberim, in quo  "
 +"loco nunc nemus est Caesarum, cavato solo in longitudinem mille et  "
 +"octingentos pedes, in latitudinem mille et ducenti. In quo triginta  "
 +"rostratae naves triremes aut biremes, plures autem minores inter se  "
 +"conflixerunt. Quibus in classibus pugnaverunt praeter remiges millia  "
 +"hominum tria circiter.  "
 +"24 In templis omnium civitatium provinciae Asiae victor ornamenta  "
 +"Reposui, quae spoliatis templis is, cum quo bellum gesseram,  "
 +"privatim possederat. § Statuae meae pedestres et equestres et in  "
 +"quadrigeis argenteae steterunt in urbe XXC circiter, quas ipse sustuli  "
 +"exque ea pecunia dona aurea in aede Apollinis meo nomine et  "
 +"illorum, qui mihi statuarum honorem habuerunt, posui.  "
 +"25 Mare pacavi a praedonibus. Eo bello servorum, qui fugerant a  "
 +"dominis suis et arma contra rem publicam ceperant, triginta fere  "
 +"millia capta dominis ad supplicium sumendum tradidi. § Iuravit  "
 +"in mea verba tota Italia sponte sua et me belli, quo vici ad Actium,  "
 +"ducem depoposcit. Iuraverunt in eadem verba provinciae Galliae,  "
 +"Hispaniae, Africa, Sicilia, Sardinia. § Qui sub signis meis tum  "
 +"militaverint, fuerunt senatores plures quam DCC, in iis qui vel  "
 +"antea vel postea consules facti sunt ad eum diem, quo scripta sunt  "
 +"haec, LXXXIII, sacerdotes circiter CLXX.  "
 +"26 Omnium provinciarum populi Romani, quibus finitimae fuerunt  "
 +"gentes, quae non parerent imperio nostro, fines auxi. Gallias  "
 +"et Hispanias provincias, item Germaniam, qua includit Oceanus a  "
 +"Gadibus ad ostium Albis fluminis, pacavi. Alpes a regione ea,  "
 +"quae proxima est Hadriano mari, ad Tuscum pacari feci nulli genti   "
 +"bello per iniuriam inlato. § Classis mea per Oceanum ab ostio  "
 +"Rheni ad solis orientis regionem usque ad fines Cimbrorum navigavit,  "
 +"quo neque terra neque mari quisquam Romanus ante id tempus  "
 +"adit, Cimbrique et Charydes et Semnones et eiusdem tractus alii  "
 +"Germanorum populi per legatos amicitiam meam et populi Romani  "
 +"petierunt. § Meo iussu et auspicio ducti sunt duo exercitus eodem  "
 +"fere tempore in Aethiopiam et in Arabiam, quae appellatur Eudaemon,  "
 +"magnaeque hostium gentis utriusque copiae caesae sunt in acie  "
 +"et complura oppida capta: In Aethiopiam usque ad oppidum Nabata  "
 +"perventum est, cui proxima est Meroe. In Arabiam usque in fines  "
 +"Sabaeorum processit exercitus ad oppidum Mariba.  "
 +"27 Aegyptum imperio populi Romani adieci. § Armeniam  "
 +"maiorem interfecto rege eius Artaxe cum possem facere provinciam,  "
 +"malui maiorum nostrorum exemplo regnum id Tigrani, regis Artavasdis  "
 +"filio, nepoti autem Tigranis regis, per Ti. Neronem tradere,  "
 +"qui tum mihi privignus erat. Et eandem gentem postea desciscentem  "
 +"et rebellantem domitam per Gaium filium meum regi Ariobarzani,  "
 +"regis Medorum Artabazi filio, regendam tradidi et post eius mortem  "
 +"filio eius Artavasdi. Quo interfecto Tigrane, qui erat ex regio  "
 +"genere Armeniorum oriundus, in id regnum misi. § Provincias  "
 +"omnis, quae trans Hadrianum mare vergunt ad Orientem, Cyrenasque,  "
 +"iam ex parte magna regibus ea possidentibus, et antea Siciliam  "
 +"et Sardiniam occupatas bello servili reciperavi.  "
 +"28 Colonias in Africa, Sicilia, Macedonia, utraque Hispania,  "
 +"Achaia, Asia, Syria, Gallia Narbonensi, Pisidia militum deduxi.  "
 +"§ Italia autem XXVIII colonias, quae vivo me celeberrimae et  "
 +"frequentissimae fuerunt, mea auctoritate deductas habet.  "
 +"29 Signa militaria complura per alios duces amissa devictis hostibus  "
 +"recepi ex Hispania et Gallia et a Dalmateis. § Parthos trium  "
 +"exercitum Romanorum spolia et signa reddere mihi supplicesque  "
 +"amicitiam populi Romani petere coegi. § Ea autem signa in penetrali,  "
 +"quod est in templo Martis Ultoris, reposui.  "
 +"30 Pannoniorum gentes, quas ante me principem populi Romani  "
 +"exercitus nunquam adit, devictas per Ti. Neronem, qui tum erat   "
 +"privignus et legatus meus imperio populi Romani subieci protulique  "
 +"fines Illyrici ad ripam fluminis Danui. Citra quod Dacorum  "
 +"transgressus exercitus meis auspicis victus profligatusque est et  "
 +"postea trans Danuvium ductus exercitus meus Dacorum gentes  "
 +"imperia populi Romani perferre coegit.  "
 +"31 Ad me ex India regum legationes saepe missae sunt non visae  "
 +"ante id tempus apud quemquam Romanorum ducem. § Nostram  "
 +"amicitiam appetiverunt per legatos Bastarnae Scythaeque et Sarmatarum,  "
 +"qui sunt citra flumen Tanaim et ultra reges, Albanorumque  "
 +"rex et Hiberorum et Medorum.  "
 +"32 Ad me supplices confugerunt reges Parthorum Tiridates et  "
 +"postea Phrates regis Phratis filius, Medorum Artavasdes, Adiabenorum  "
 +"Artaxares, Britannorum Dumnobellaunus et Tincommius,  "
 +"Sugambrorum Maelo, Marcomanorum Sueborum . . . rus. Ad  "
 +"me rex Parthorum Phrates, Orodis filius, filios suos nepotesque omnes  "
 +"misit in Italiam non bello superatus, sed amicitiam nostram per  "
 +"liberorum suorum pignora petens. § Plurimaeque aliae gentes  "
 +"expertae sunt p. R. fidem me principe, quibus antea cum populo  "
 +"Romano nullum extiterat legationum et amicitiae commercium.  "
 +"33 A me gentes Parthorum et Medorum per legatos principes  "
 +"earum gentium reges petitos acceperunt, Parthi Vononem, regis  "
 +"Phratis filium, regis Orodis nepotem, Medi Ariobarzanem, regis  "
 +"Artavazdis filium, regis Ariobarzanis nepotem.  "
 +"34 In consulatu sexto et septimo, postquam bella civilia exstinxeram  "
 +"per consensum universorum potitus rerum omnium, rem  "
 +"publicam ex mea potestate in senatus populique Romani arbitrium  "
 +"transtuli. Quo pro merito meo senatus consulto Augustus  "
 +"appellatus sum et laureis postes aedium mearum vestiti publice  "
 +"coronaque civica super ianuam meam fixa est et clupeus aureus in  "
 +"curia Iulia positus, quem mihi senatum populumque Romanum  "
 +"dare virtutis clementiaeque et iustitiae et pietatis causa testatum  "
 +"est per eius clupei inscriptionem. § Post id tempus auctoritate   "
 +"omnibus praestiti, potestatis autem nihilo amplius habui quam  "
 +"ceteri, qui mihi quoque in magistratu conlegae fuerunt.  "
 +"35 Tertium decimum consulatum cum gerebam, senatus et  "
 +"equester ordo populusque Romanus universus appellavit me patrem  "
 +"patriae idque in vestibulo aedium mearum inscribendum et in  "
 +"curai Iulia et in foro Aug. sub quadrigis, quae mihi ex s.c. positae  "
 +"sunt, censuit. Cum scripsi haec, annum agebam septuagensumum  "
 +"sextum.  "
 +"1 Summa pecuniae, quam dedit vel in aerarium vel plebei  "
 +"Romanae vel dimissis militibus denarium sexiens milliens.  "
 +"2 Opera fecit nova aedem Martis, Iovis Tonantis et Feretri, Apollinis,  "
 +"divi Iuli, Quirini, Minervae, Iunonis Reginae, Iovis Libertatis,  "
 +"Larum, deum Penatium, Iuventatis, Matris Magnae, Lupercal, pulvinar  "
 +"ad circum, curiam cum Chalcidico, forum Augustum, basilicam  "
 +"Iuliam, theatrum Marcelli, porticum Octaviam, nemus trans  "
 +"Tiberim Caesarum.  "
 +"3 Refecit Capitolium sacrasque aedes numero octoginta duas, theatrum Pompei, aquarum rivos, viam Flaminiam. 4 Impensa praestita in spectacula scaenica et munera gladiatorum atque athletas et venationes et naumachiam et donata pecunia colonis, municipiis, oppidis terrae motu incendioque consumptis aut viritim amicis senatoribusque, quorum census explevit innumerabilis.";  
addnewedtext();
document.getElementsByName("ed1editor")[0].value = "John Scheid";
document.getElementsByName("ed1name")[0].value = "Res gestae Divi Augusti";
document.getElementsByName("ed1publishingplace")[0].value = "Paris";
document.getElementsByName("ed1publishingdate")[0].value = "2007";
document.getElementsByName("ed1text")[0].value = "Rerum gestarum diui Augusti, quibus orbem terrarum imperio  "
 +"populi Romani subiecit, et impensarum, quas in rem publicam  "
 +"populumque Romanum fecit, incisarum in duabus aheneis pilis,  "
 +"quae sunt Romae positae, exemplar subiectum.  "
 +"1.	1 Annos undeuiginti natus exercitum priuato consilio et priuata  "
 +"impensa comparaui, per quem rem publicam a dominatione factionis  "
 +"oppressam in libertatem uindicaui. 2 Eo nomine senatus  "
 +"decretis honorificis in ordinem suum me adlegit, Gaio Pansa et Aulo  "
 +"Hirtio consulibus, consularem locum sententiae dicendae simul dans et   "
 +"imperium mihi dedit. 3 Res publica ne quid detrimenti caperet,  "
 +"me pro praetore simul cum consulibus prouidere iussit. 4 Populus  "
 +"autem eodem anno me congulem, cum consul uterque in bello cecidisset,  "
 +"et triumuirum rei publicae constituendae creauit.  "
 +"2.	 Qui parentem meum trucidauerunt, eos in exilium expuli  "
 +"iudiciis legitimis ultus eorum facinus, et postea bellum inferentis rei  "
 +"publicae uici bis acie.  "
 +"3.	1 Bella terra et mari ciuilia externaque toto in orbe terrarum  "
 +"saepe gessi uictorque omnibus ueniam petentibus ciuibus peperci.  "
 +"2 Externas gentes, quibus tuto ignosci potuit, conseruare quam  "
 +"excidere malui. 3 Millia ciuium Romanorum sub sacramento meo  "
 +"fuerunt circiter quingenta. Ex quibus deduxi in colonias aut  "
 +"remisi in municipia sua stipendis emeritis millia aliquanto plura  "
 +"quam trecenta et iis omnibus agros adsignaui aut pecuniam pro  "
 +"praemiis militiae dedi. 4 Naues cepi sescentas praeter eas, si quae  "
 +"minores quam triremes fuerunt.  "
 +"4.	1 Bis ouans triumphaui et tris egi curulis triumphos et appellatus  "
 +"sum uiciens et semel imperator, decernente pluris triumphos mihi   "
 +"senatu, quibus omnibus supersedi. Laurum de fascibus deposui in  "
 +"Capitolio uotis quae quoque bello nuncupaueram solutis. 2 Ob res  "
 +"a me aut per legatos meos auspicis meis terra marique prospere  "
 +"gestas quinquagiens et quinquiens decreuit senatus supplicandum  "
 +"esse dis immortalibus. Dies autem, per quos ex senatus consulto  "
 +" supplicatum est, fuere DCCCLXXXX. 3 In triumphis meis ducti  "
 +"sunt ante currum meum reges aut regum liberi nouem. 4 Consul  "
 +"fueram terdeciens cum scribebam haec, et eram septimum et  "
 +"tricensimum tribuniciae potestatis.  "
 +"5.	1 Dictaturam et apsenti et praesenti mihi delatam et a populo et a  "
 +"senatu, Marco Marcello et Lucio Arruntio consulibus non recepi. 2 Non  "
 +"sum deprecatus in summa frumenti penuria curationem annonae,  "
 +"quam ita administraui, ut intra dies paucos metu et periculo praesenti  "
 +"civitatem uniuersam liberarem impensa et cura mea. 3 Consulatum  "
 +"quoque tum annuum et perpetuum mihi delatum non recepi.  "
 +"6.	1 Consulibus Marco Vinicio et Quinto Lucretio et postea Publio Lentulo et Cnaeo  "
 +"Lentulo et tertium Paullo Fabio Maximo et Quinto Tuberone senatu  "
 +"populoque Romano consentientibus, ut curator legum et morum  "
 +"summa potestate solus crearer, nullum magistratum contra morem  "
 +"maiorum delatum recepi. 2 Quae tum per me geri senatus uoluit,  "
 +"per tribuniciam potestatem perfeci, cuius potestatis conlegam et  "
 +"ipse ultro quinquiens a senatu depoposci et accepi.  "
 +"7.	1 Triumuirum rei publicae constituendae fui per continuos annos  "
 +"decem. 2 Princeps senatus usque ad eum diem, quo scripseram  "
 +"haec per annos quadraginta fui. 3 Pontifex maximus, augur, XVuirum   "
 +"sacris faciundis, VIIuirum epulonum, frater arualis, sodalis  "
 +"Titius, fetialis fui.  "
 +"8.	1 Patriciorum numerum auxi consul quintum iussu populi et  "
 +"senatus. 2 Senatum ter legi. Et in consulatu sexto censum populi  "
 +"conlega Marco Agrippa egi. Lustrum post annum alterum et quadragensimum   "
 +"feci. Quo lustro ciuium Romanorum censa sunt capita  "
 +"quadragiens centum millia et sexaginta tria millia. 3 Tum iterum  "
 +"consulari cum imperio lustrum solus feci Gaio Censorino et Gaio Asinio  "
 +"consulibus, quo lustro censa sunt ciuium Romanorum capita quadragiens  "
 +"centum millia et ducenta triginta tria millia. 4 Et tertium consulari  "
 +"cum imperio lustrum conlega Tiberio Caesare filio meo feci, Sexto  "
 +"Pompeio et Sexto Appuleio consulibus, quo lustro censa sunt ciuium Romanorum  "
 +"capitum quadragiens centum millia et nongenta triginta et  "
 +"septem millia. 5 Legibus nouis me auctore latis multa exempla  "
 +"maiorum exolescentia iam ex nostro saeculo reduxi et ipse multarum  "
 +"rerum exempla imitanda posteris tradidi.  "
 +"9.	1 Vota pro salute mea suscipi per consules et sacerdotes quinto  "
 +"quoque anno decreuit senatus. Ex iis uotis saepe fecerunt uiuo me  "
 +"ludos aliquotiens sacerdotum quattuor amplissima collegia, aliquotiens  "
 +"consules. 2 Priuatim etiam et municipatim uniuersi ciues  "
 +"unanimiter continenter apud omnia puluinaria pro ualetudine mea  "
 +"supplicauerunt.  "
 +"10.	 1 Nomen meum senatus consulto inclusum est in saliare carmen,  "
 +"et sacrosanctus in perpetuum ut essem et, quoad uiuerem, tribunicia  "
 +"potestas mihi esset per legem statutum est. 2 Pontifex maximus  "
 +"ne fierem in uiui conlegae mei locum, populo id sacerdotium  "
 +"deferente mihi, quod pater meus habuerat, recusavi, quod sacerdotium  "
 +"aliquot post annos eo mortuo demum qui ciuilis tumultus occasione  "
 +"occupauerat, cuncta ex Italia ad comitia mea confluente multitudine,  "
 +"quanta Romae nunquam fertur ante id tempus fuisse recepi Publio  "
 +"Sulpicio Gaio Valgio consulibus.  "
 +"11.	 Aram Fortunae Reducis ante aedes Honoris et Virtutis ad  "
 +"portam Capenam pro reditu meo senatus consacrauit, in qua  "
 +"pontifices et uirgines Vestales anniuersarium sacrificium facere  "
 +"decreuit eo die, quo consulibus Quinto Lucretio et Marco Vinicio in urbem  "
 +"ex Syria redieram, et diem Augustalia ex cognomine nostro appellauit.   "
 +"12.	1 [Ex senatus auctoritate pars praetorum et tribunorum plebe  "
 +"cum consule Quinto Lucretio et principibus uiris obuiam mihi missa est  "
 +"in Campaniam, qui honos ad hoc tempus nemini praeter me est  "
 +"decretus. 2 Cum ex Hispania Galliaque, rebus in iis prouincis  "
 +"prospere gestis, Romam redi Tiberio Nerone Publio Quintilio consulibus,  "
 +"aram Pacis Augustae senatus pro reditu meo consacrandam censuit  "
 +"ad campum Martium, in qua magistratus et sacerdotes uirginesque  "
 +"Vestales anniuersarium sacrificium facere decreuit.  "
 +"13.	 Ianum Quirinum, quem claussum esse maiores nostri uoluerunt,  "
 +"cum per totum imperium populi Romani terra marique esset parta  "
 +"uictoriis pax, cum priusquam nascerer, a condita urbe bis omnino  "
 +"clausum fuisse prodatur memoriae, ter me principe senatus claudendum  "
 +"esse censuit.  "
 +"14.	1 Filios meos, quos iuuenes mihi eripuit fortuna, Gaium et  "
 +"Lucium Caesares, honoris mei caussa, senatus populusque Romanus  "
 +"annum quintum et decimum agentis consules designauit, ut eum  "
 +"magistratum inirent post quinquennium. Et ex eo die, quo deducti sunt  "
 +"in forum, ut interessent consiliis publicis decreuit senatus. 2 Equites  "
 +"autem Romani uniuersi principem iuuentutis utrumque eorum  "
 +"parmis et hastis argenteis donatum appellauerunt.  "
 +"15.	1 Plebei Romanae uiritim sestertios trecenos numeraui ex testamento  "
 +"patris mei, et nomine meo sestertios quadringenos ex bellorum manibiis  "
 +"consul quintum dedi, iterum autem in consulatu decimo ex patrimonio  "
 +"meo sestertios quadringenos congiari uiritim pernumeraui, et  "
 +"consul undecimum duodecim frumentationes frumento priuatim  "
 +"coempto emensus sum, et tribunicia potestate duodecimum quadringenos  "
 +"nummos tertium uiritim dedi. Quae mea congiaria peruenerunt  "
 +"ad hominum millia nunquam minus quinquaginta et  "
 +"ducenta. 2 Tribuniciae potestatis duodeuicensimum, consul duodecimum,  "
 +"trecentis et uiginti millibus plebis urbanae sexagenos denarios  "
 +"uiritim dedi. 3 Et colonis militum meorum consul quintum ex  "
 +"manibiis uiritim millia nummum singula dedi ; acceperunt id  "
 +"triumphale congiarium in colonis hominum circiter centum et  "
 +"uiginti millia. 4 Consul tertium decimum sexagenos denarios   "
 +"plebei, quae tum frumentum publicum accipiebat, dedi ; ea millia  "
 +"hominum paullo plura quam ducenta fuerunt.  "
 +"16.	1 Pecuniam pro agris, quos in consulatu meo quarto et postea  "
 +"consulibus Marco Crasso et Cnaeo Lentulo Augure adsignaui militibus,  "
 +"solui municipis. Ea summa sestertium circiter sexsiens milliens fuit,  "
 +"quam pro Italicis praedis numeraui, et circiter bis milliens et sescentiens  "
 +"quod pro agris prouincialibus solui. Id primus et solus omnium  "
 +"qui deduxerunt colonias militum in Italia aut in prouincis ad  "
 +"memoriam aetatis meae feci. 2 Et postea Tiberio Nerone et Cnaeo Pisone  "
 +"consulibus, itemque Gaio Antistio et Decimo Laelio consulibus et Gaio Caluisio  "
 +"et Lucio Passieno consulibus et Lucio Lentulo et Marco Messalla consulibus et  "
 +"Lucio Caninio et Quinto Fabricio consulibus militibus quos emeriteis stipendis in  "
 +"sua municipia deduxi praemia numerato persolui, quam in rem  "
 +"sestertium quater milliens circiter impendi.  "
 +"17.	1 Quater pecunia mea iuui aerarium, ita ut sestertium milliens  "
 +"et quingentiens ad eos, qui praerant aerario, detulerim. 2 Et Marco  "
 +"Lepido et Lucio Arruntio consulibus in aerarium militare, quod ex consilio  "
 +"meo constitutum est, ex quo praemia darentur militibus qui uicena  "
 +"aut plura stipendia emeruissent, sestertium milliens et septingentiens ex  "
 +"patrimonio meo detuli.  "
 +"18.	 Ab eo anno, quo Gnaeus et Publius Lentuli consules fuerunt, cum  "
 +"deficerent uectigalia, tum centum millibus hominum tum pluribus  "
 +"multo frumentarios et nummarios tributus ex horreo et patrimonio  "
 +"meo edidi.  "
 +"19.	1 Curiam et continens ei Chalcidicum templumque Apollinis in  "
 +"Palatio cum porticibus, aedem diui Iuli, lupercal, porticum ad circum  "
 +"Flaminium, quam sum appellari passus ex nomine eius, qui  "
 +"priorem eodem in solo fecerat, Octauiam, puluinar ad circum  "
 +"maximum, 2 aedes in Capitolio Iouis Feretri et Iouis Tonantis,  "
 +"aedem Quirini, aedes Mineruae et Iunonis reginae et Iouis Libertatis  "
 +"in Auentino, aedem Larum in summa sacra uia, aedem Deum   "
 +"Penatium in Velia, aedem Iuuentatis, aedem Matris Magnae in  "
 +"Palatio feci.  "
 +"20.	1 Capitolium et Pompeium theatrum utrumque opus impensa  "
 +"grandi refeci sine ulla inscriptione nominis mei. 2 Riuos aquarum  "
 +"compluribus locis uetustate labentes refeci, et aquam, quae Marcia  "
 +"appellatur duplicaui fonte nouo in riuum eius inmisso. 3 Forum  "
 +"Iulium et basilicam, quae fuit inter aedem Castoris et aedem  "
 +"Saturni, coepta profligataque opera a patre meo, perfeci, et eandem  "
 +"basilicam consumptam incendio ampliato eius solo sub titulo nominis  "
 +"filiorum meorum incohaui et, si uiuus non perfecissem, perfici  "
 +"ab heredibus meis iussi. 4 Duo et octoginta templa deum in urbe  "
 +"consul sextum ex auctoritate senatus refeci, nullo praetermisso, quod  "
 +"eo tempore refici debebat. 5 Consul septimum uiam Flaminiam ab  "
 +"urbe Ariminum refeci pontesque omnes praeter Muluium et  "
 +"Minucium.  "
 +"21.	1 In priuato solo Martis Vltoris templum forumque Augustum  "
 +"ex manibiis feci. Theatrum ad aedem Apollinis in solo magna ex  "
 +"parte a priuatis empto feci, quod sub nomine Marci Marcelli generi mei  "
 +"esset. 2 Dona ex manibiis in Capitolio et in aede diui Iuli et in  "
 +"aede Apollinis et in aede Vestae et in templo Martis Vltoris consacraui,  "
 +"quae mihi constiterunt sestertium circiter milliens. 3 Auri coronari  "
 +"pondo triginta et quinque millia municipiis et colonis Italiae conferentibus  "
 +"ad triumphos meos quintum consul remisi, et postea,  "
 +"quotiens cumque imperator appellatus sum, aurum coronarium non  "
 +"accepi, decernentibus municipiis et colonis aeque benigne atque  "
 +"antea decreuerant.  "
 +"22.	1 Ter munus gladiatorium dedi meo nomine et quinquens  "
 +"filiorum meorum aut nepotum nomine ; quibus muneribus depugnauerunt  "
 +"hominum circiter decem millia. Bis athletarum undique  "
 +"accitorum spectaculum populo praebui meo nomine et tertium  "
 +"nepotis mei nomine. 2 Ludos feci meo nomine quater, aliorum  "
 +"autem magistratuum uicem ter et uiciens. Pro conlegio XVuirorum  "
 +"magister conlegii, collega Marco Agrippa, ludos saeclares, Gaio Furnio   "
 +"Gaio Silano consulibus, feci. Consul tertiumdecimum ludos Martiales primus feci, quos post  "
 +"id tempus deinceps insequentibus annis senatus consulto et lege fecerunt consules.  "
 +"3 Venationes bestiarum Africanarum meo nomine aut  "
 +"filiorum meorum et nepotum, in circo aut in foro aut in amphitheatris,  "
 +"populo dedi sexiens et uiciens, quibus confecta sunt bestiarum  "
 +"circiter tria millia et quingentae.  "
 +"23.	 Naualis proeli spectaclum populo dedi trans Tiberim, in quo  "
 +"loco nunc nemus est Caesarum, cauato solo in longitudinem mille et  "
 +"octingentos pedes, in latitudinem mille et ducentos. In quo triginta  "
 +"rostratae naues triremes aut biremes, plures autem minores inter se  "
 +"conflixerunt. Quibus in classibus pugnauerunt praeter remiges millia  "
 +"hominum tria circiter.  "
 +"24.	1 In templis omnium ciuitatium prouinciae Asiae uictor ornamenta  "
 +"reposui, quae spoliatis templis is, cum quo bellum gesseram  "
 +"priuatim possederat. 2 Statuae meae pedestres et equestres et in  "
 +"quadrigeis argenteae steterunt in urbe octoginta circiter, quas ipse sustuli  "
 +"exque ea pecunia dona aurea in aede Apollinis meo nomine et  "
 +"illorum, qui mihi statuarum honorem habuerunt, posui.  "
 +"25.	1 Mare pacaui a praedonibus. Eo bello servorum, qui fugerant a  "
 +"dominis suis et arma contra rem publicam ceperant, triginta fere  "
 +"millia capta dominis ad supplicium sumendum tradidi. 2 Iurauit  "
 +"in mea uerba tota Italia sponte sua et me belli, quo uici ad Actium,  "
 +"ducem depoposcit. Iurauerunt in eadem uerba prouinciae Galliae  "
 +"Hispaniae Africa Sicilia Sardinia. 3 Qui sub signis meis tum  "
 +"militauerint, fuerunt senatores plures quam septingenti, in iis, qui uel  "
 +"antea uel postea consules facti sunt ad eum diem, quo scripta sunt  "
 +"haec, octoginta tres, sacerdotes circiter centum septuaginta.  "
 +"26.	1 Omnium prouinciarum populi Romani, quibus finitimae fuerunt  "
 +"Gentes, quae non parerent imperio nostro fines auxi. 2 Gallias  "
 +"et Hispanias prouincias item Germaniam, qua includit Oceanus a  "
 +"Gadibus ad ostium Albis fluminis, pacaui. 3 Alpes a regione ea,  "
 +"quae proxima est Hadriano mari ad Tuscum pacari feci nulli genti   "
 +"bello per iniuriam inlato. 4 Classis mea per Oceanum ab ostio  "
 +"Rheni ad solis orientis regionem usque ad fines Cimbrorum nauigavit,  "
 +"quo neque terra neque mari quisquam Romanus ante id tempus  "
 +"adit, Cimbrique et Charydes et Semnones et eiusdem tractus alii  "
 +"Germanorum populi per legatos amicitiam meam et populi Romani  "
 +"petierunt. 5 Meo iussu et auspicio ducti sunt duo exercitus eodem  "
 +"fere tempore in Aethiopiam et in Arabiam, quae appellatur Eudaemon,  "
 +"maximaeque hostium gentis utriusque copiae caesae sunt in acie  "
 +"et complura oppida capta. In Aethiopiam usque ad oppidum Nabata  "
 +"peruentum est, cui proxima est Meroe. In Arabiam usque in fines  "
 +"Sabaeorum processit exercitus ad oppidum Mariba.  "
 +"27.	1 Aegyptum imperio populi Romani adieci. 2 Armeniam  "
 +"maiorem interfecto rege eius Artaxe, cum possem facere prouinciam  "
 +"malui maiorum nostrorum exemplo regnum id Tigrani, regis Artauasdis  "
 +"filio, nepoti autem Tigranis regis, per Tiberium Neronem tradere,  "
 +"qui tum mihi priuignus erat. Et eandem gentem postea desciscentem  "
 +"et rebellantem domitam per Gaium filium meum regi Ariobarzani,  "
 +"regis Medorum Artabazi filio, regendam tradidi et post eius mortem  "
 +"filio eius Artauasdi. Quo interfecto Tigranem, qui erat ex regio  "
 +"genere Armeniorum oriundus, in id regnum misi. 3 Prouincias  "
 +"omnis, quae trans Hadrianum mare uergunt ad Orientem, Cyrenasque,  "
 +"iam ex parte magna regibus eas possidentibus, et antea Siciliam  "
 +"et Sardiniam occupatas bello seruili reciperaui.  "
 +"28.	1 Colonias in Africa Sicilia Macedonia utraque Hispania  "
 +"Achaia Asia Syria Gallia Narbonensi, Pisidia militum deduxi.  "
 +"2 Italia autem duodetriginta colonias, quae uiuo me celeberrimae et  "
 +"frequentissimae fuerunt, mea auctoritate deductas habet.  "
 +"29.	1 Signa militaria complura per alios duces amissa deuictis hostibus  "
 +"reciperaui ex Hispania et Gallia et a Dalmateis. 2 Parthos trium  "
 +"exercituum Romanorum spolia et signa reddere mihi supplicesque  "
 +"amicitiam populi Romani petere coegi. Ea autem signa in penetrali,  "
 +"quod est in templo Martis Vltoris, reposui.  "
 +"30.	 Pannoniorum gentes, quas ante me principem populi Romani  "
 +"exercitus nunquam adit, deuictas per Tiberium Neronem, qui tum erat   "
 +"priuignus et legatus meus, imperio populi Romani subieci, protulique  "
 +"fines Illyrici ad ripam fluminis Danuui. 2 Citra quod Dacorum  "
 +"transgressus exercitus meis auspiciis uictus profligatusque est et  "
 +"postea trans Danuuium ductus exercitus meus Dacorum gentes  "
 +"imperia populi Romani perferre coegit.  "
 +"31.	 Ad me ex India regum legationes saepe missae sunt non uisae  "
 +"ante id tempus apud quemquam Romanorum ducem. 2 Nostram  "
 +"amicitiam appetiuerunt per legatos Bastarnae Scythaeque et Sarmatarum,  "
 +"qui sunt citra flumen Tanaim et ultra reges, Albanorumque  "
 +"rex et Hiberorum et Medorum.  "
 +"32.	 Ad me supplices confugerunt reges Parthorum Tiridates et  "
 +"postea Phrates, regis Phratis filius, Medorum Artauasdes, Adiabenorum  "
 +"Artaxares, Britannorum Dumnobellaunus et Tincomarus,  "
 +"Sugambrorum Maelo, Marcomanorum Sueborum. . . . rus. 2 Ad  "
 +"me rex Parthorum Phrates, Orodis filius, filios suos nepotesque omnes  "
 +"misit in Italiam non bello superatus, sed amicitiam nostram per  "
 +"liberorum suorum pignora petens. 3 Plurimaeque aliae gentes  "
 +"expertae sunt populi Romani fidem me principe, quibus antea cum populo  "
 +"Romano nullum extiterat legationum et amicitiae commercium.  "
 +"33.	 A me gentes Parthorum et Medorum per legatos principes  "
 +"earum gentium reges petitos acceperunt, Parthi Vononem, regis  "
 +"Phratis filium, regis Orodis nepotem, Medi Ariobarzanem, regis  "
 +"Artauazdis filium, regis Ariobarzanis nepotem.  "
 +"34.	 In consulatu sexto et septimo, postquam bella ciuilia exstinxeram,  "
 +"per consensum uniuersorum potens rerum omnium rem  "
 +"publicam ex mea potestate in senatus populique Romani arbitrium  "
 +"transtuli. 2 Quo pro merito meo senatus consulto Augustus  "
 +"appellatus sum et laureis postes aedium mearum uestiti publice  "
 +"coronaque ciuica super ianuam meam fixa est, et clupeus aureus in  "
 +"curia Iulia positus, quem mihi senatum populumque Romanum  "
 +"dare uirtutis clementiaeque iustitiae et pietatis causa testatum  "
 +"est per eius clupei inscriptionem. 3 Post id tempus auctoritate   "
 +"omnibus praestiti, potestatis autem nihilo amplius habui quam  "
 +"ceteri qui mihi quoque in magistratu conlegae fuerunt.  "
 +"35.	 Tertium decimum consulatum cum gerebam, senatus et  "
 +"equester ordo populusque Romanus uniuersus appellauit me patrem  "
 +"patriae idque in uestibulo aedium mearum inscribendum et in  "
 +"curia Iulia et in foro Augusto sub quadrigis, quae mihi ex senatus consulto positae  "
 +"sunt censuit. 2 Cum scripsi haec, annum agebam septuagensumum  "
 +"sextum.  "
 +"Appendix  "
 +"1 Summa pecuniae, quam dedit uel in aerarium uel plebei  "
 +"Romanae uel dimissis militibus, denarium sexiens milliens.  "
 +"2 Opera fecit noua aedem Martis, Iouis Tonantis et Feretri, Apollinis,  "
 +"Diui Iuli, Quirini, Mineruae, Iunonis Reginae, Iouis Libertatis,  "
 +"Larum, deum Penatium, Iuuentatis, Matris Magnae, lupercal, puluinar  "
 +"ad circum, curiam cum Chalcidico, forum Augustum, basilicam  "
 +"Iuliam, theatrum Marcelli, porticum Octauiam, nemus trans  "
 +"Tiberim Caesarum.  "
 +"3 Refecit Capitolium sacrasque aedes numero octoginta duas,  "
 +"theatrum Pompei, aquarum riuos, uiam Flaminiam.  "
 +"4 Impensa praestita in spectacula scaenica et munera gladiatorum  "
 +"atque athletas et uenationes et naumachiam et donata pecunia  "
 +"colonis municipiis oppidis terrae motu incendioque consumptis aut  "
 +"viritim amicis senatoribusque, quorum census expleuit innumerabilis.";

addnewedtext();
document.getElementsByName("ed2editor")[0].value = "Marion Giebel";
document.getElementsByName("ed2name")[0].value = "Res gestae divi augusti";
document.getElementsByName("ed2publishingplace")[0].value = "Stuttgart";
document.getElementsByName("ed2publishingdate")[0].value = "1975";
document.getElementsByName("ed2text")[0].value = "Rerum gestarum divi Augusti, quibus orbem terrarum imperio  "
 +"populi Romani subiecit, et impensarum, quas in rem  "
 +"publicam populumque Romanum fecit, incisarum in duabus  "
 +"aheneis pilis, quae sunt Romae positae, exemplar subiectum.  "
 +"1. Annos undeviginti natus exercitum privato consilio et  "
 +"privata impensa comparavi, per quem rem publicam a dominatione  "
 +"factionis oppressam in libertatem vindicavi. Eo  "
 +"nomine senatus decretis honorificis in ordinem suum me  "
 +"adlegit C. Pansa et A. Hirtio consulibus consularem locum  "
 +"sententiae dicendae tribuens et imperium mihi dedit.  "
 +"Res publica ne quid detrimenti caperet, me pro praetore  "
 +"simul cum consulibus providere iussit. Populus autem eodem  "
 +"anno me consulem, cum consul uterque in bello cecidisset,  "
 +"et triumvirum rei publicae constituendae creavit.  "
 +"2. Qui parentern meum necaverunt, eos in exilium expuli  "
 +"iudiciis legitimis ultus eorum facinus et postea bellum  "
 +"inferentis rei publicae vici bis acie.   "
 +"3 . Bella terra et mari civilia externaque toto in orbe terrarum  "
 +"saepe gessi victorque omnibus veniam petentibus  "
 +"civibus peperci. Externas gentes, quibus tuto ignosci potuit,  "
 +"conservare quam excidere malui. Millia civium Romanorum  "
 +"sub sacramento meo fuerunt circiter quingenta.  "
 +"Ex quibus deduxi in colonias aut remisi in municipia sua  "
 +"stipendis emeritis millia aliquanto plura quam trecenta, et  "
 +"iis omnibus agros adsignavi aut pecuniam pro praemis militiae  "
 +"dedi. Naves cepi sescentas praeter eas, si quae minores  "
 +"quam triremes fuerunt.  "
 +"4. Bis ovans triumphavi et tris egi curulis triumphos et  "
 +"appellatus sum viciens et semel imperator, decernente pluris  "
 +"triumphos mihi senatu, quibus omnibus supersedi. Laurum  "
 +"de fascibus deposui in Capitolio votis, quae quoque bello  "
 +"nuncupaveram, solutis. Ob res a me aut per legatos meos  "
 +"auspiciis meis terra marique prospere gestas quinquagiens et  "
 +"quinquiens decrevit senatus supplicandum esse dis immortalibus.  "
 +"Dies autem, per quos ex senatus consulto supplicaturn est,   "
 +"fuere DCCCLXXXX. In triumphis meis ducti  "
 +"sunt antc currum meum reges aut regum liberi novem.  "
 +"Consul fueram terdeciens cum scribebam haec et eram  "
 +"septimum et tricensimum tribuniciae potestatis.  "
 +"5. Dictaturam et apsenti et praesenti mihi delatam et a  "
 +"populo et a senatu M. Marcello et L. Arruntio cos. non  "
 +"recepi. Non sum deprecatus in summa frumenti penuria  "
 +"curationem annonae quam ita administravi, ut intra dies  "
 +"paucos metu et periclo praesenti civitatem universam liberarim  "
 +"impensa et cura mea. Consulatum quoque turn annuum  "
 +"et perpetuum mihi delatum non recepi.  "
 +"6. Consulibus M. Vinicio et Q. Lucretio et postea P.  "
 +"Lentulo et Cn. Lentulo et tertium Paullo Fabio Maximo et  "
 +"Q. Tuberone senatu populoque Romano consentientibus  "
 +"ut curator legum et morum summa potestate solus crearer,  "
 +"nullum magistramm contra morem maiorum delatum recepi.   "
 +"Quae turn per me geri senatus voluit, per tribuniciam  "
 +"potestatem perfeci, cuius potestatis conlegam et ipse  "
 +"ultro quinquiens a senatu depoposci et accepi.  "
 +"7. Triumvirum rei publicae constituendae fui per continuos  "
 +"annos decem. Princeps senatus fui usque ad eum  "
 +"diem, quo scripseram haec, per annos quadraginta. Pontifex  "
 +"maximus, augur, quindecimvirum sacris faciundis, septemvirum  "
 +"epulonum, frater arvalis, sodalis Titius, fetialis fui.  "
 +"8. Patriciorum numerum auxi consul quintum iussu populi  "
 +"et senatus. Senatum ter legi. Et in consulatu sexto censum  "
 +"populi conlega M. Agrippa egi. Lustrum post annum  "
 +"alterum et quadragensimum feci. Quo lustro civium Rarnanorom  "
 +"censa sunt capita quadragiens centum millia et sexaginta  "
 +"tria millia. Turn iterum cansulari cum imperio Iustrum  "
 +"solus feci C. Censorino et C. Asinio cos., qua Iustra censa  "
 +"sunt civium Rarnanorum capita quadragiens centum millia  "
 +"et ducenta triginta tria millia. Et tertium consulari cum  "
 +"imperio Iustrum conlega Tib. Caesare filia meo fcci Sex.   "
 +"Pompeie et Sex. Appuleio cos.; quo lustro censa sunt civium  "
 +"Romanerum capitum quadragiens centum millia et  "
 +"nongenta triginta et septem millia. Legibus novis me auctore  "
 +"latis multa exempla maierum cxolesccntia iam ex nostro  "
 +"saeculo reduxi et ipse multarum rerum exempla imitanda  "
 +"posteris tradidi.  "
 +"9. Vota pro valetudine mea suscipi per consules et sacerdotes  "
 +"quinto quoque anno decrevit senatus. Ex iis votis  "
 +"saepe fecerunt vivo me Judos aliquotiens sacerdotum quattuor  "
 +"amplissima conlegia, aliquotiens consules. Privatim  "
 +"etiam et municipatim universi cives unanimiter continenter  "
 +"apud omnia pulvinaria pro valetudine mea supplicaverunt.  "
 +"1 0. Nomen meum senatus consulto inclusum est in Saliare  "
 +"carmen, et sacrosanctus in perpetum ut essem et, quoad  "
 +"viverem, tribunicia potestas mihi esset, per Iegern sanctum  "
 +"est. Pontifex maximus ne fierem in vivi conlegae mei locum,  "
 +"populo id sacerdotium deferente mihi, quod pater meus  "
 +"habuerat, recusavi. Quod sacerdotium aliquod post annos,  "
 +"eo mortuo qui civilis tumultus occasione occupaverat,  "
 +"cuncta ex Italia ad comltla mea confluente multitudine,  "
 +"quanta Romae nunquam narratur ad id tempus fuisse, recepi  "
 +"P. Sulpicio C. Valgio consulibus.  "
 +"1 1 . Aram Fortunae Reducis ante aedes Honoris et Virtutis  "
 +"ad portam Capenam pro reditu meo senatus consacravit,  "
 +"in qua pontifices et virgines Vestales anniversarium  "
 +"sacrificium facere iussit eo die, quo consulibus Q. Lucretio  "
 +"et M. Vinicio in urbem ex Syria redieram, et diem Augustalia  "
 +"ex cognomine nostro appellavit.  "
 +"12. Ex senatus auetorirate pars praetorum et tribunorum  "
 +"plebi cum consule Q. Lucretio et principibus viris  "
 +"obviam mihi missa est in Campaniam, qui honos ad hoc  "
 +"tempus nemini praeter me est decretus. Cum ex Hispania  "
 +"Galliaque, rebus in iis provincis prospere gestis, Romam  "
 +"redi Ti. Nerone et P. Quintilio consulibus, aram Pacis Augustae  "
 +"senatus pro reditu meo consacrandam censuit ad  "
 +"campum Martium, in qua magistratus et sacerdotes virginesque  "
 +"Vestales anniversarium sacrificium facere iussit.  "
 +"1 3 . Ianum Quirinum, quem claussum esse maiores nostri  "
 +"voluerunt, cum per totum imperium populi Romani terra  "
 +"marique esset parta victoriis pax, cum prius quam nascerer  "
 +"a condita urbe bis omnino clausum fuisse prodatur memoriae,  "
 +"ter me principe senatus claudendum esse censuit.  "
 +"1 4 . Filios meos, quos iuvenes mihi eripuit Fortuna,  "
 +"Gaium et Lucium Caesares honoris mei caussa senatus  "
 +"populusque Romanus annum quintum et decimum agentis  "
 +"consules designavit, ut eum magistratum inirent post  "
 +"quinquennium. Et ex eo die, quo deducti sunt in forum, ut  "
 +"interessent consiliis publicis decrevit senatus. Equites autem  "
 +"Romani universi principem iuventutis utrumque eorum  "
 +"parmis et hastis argenteis donatum appellaverunt.  "
 +"1 5 . Plebei Romanae viritim HS trecenos numeravi ex  "
 +"testamento patris mei, et nomine meo HS quadringenos ex  "
 +"bellorum manibiis consul quintum dedi, iterum autem in  "
 +"consulatu decimo ex patrimonio meo HS quadringenos  "
 +"congiari viritim pernumeravi, et consul undecimum duodecim   "
 +"frumentationes frumento privatim coempto emensus  "
 +"sum, et tribunicia potestate duodecimum quadringenas  "
 +"nummos tertium viritim dedi. Quae mea congiaria pervenerum  "
 +"ad hominum millia nunquam minus quinquaginta  "
 +"et ducenta. Tribuniciae potestatis duodevicensimum,  "
 +"consul XII, trecentis et viginti millibus piebis urbanae  "
 +"sexagenos denarios viritim dedi. Et colonis milirum meorum  "
 +"consul quinrum ex manibiis viritim millia nummum  "
 +"singula dedi; acceperunt id triumphale congiarium in colonis  "
 +"hominum circiter cenrum et viginti millia. Consul tertium  "
 +"decimum sexagenos denarios plebei, quae turn frumentum  "
 +"publicum accipiebat, dedi; ea millia hominum  "
 +"paullo plura quam ducenta fuerunt.  "
 +"16. Pecuniam pro agris, quos in consulatu meo quarto et  "
 +"postea consulibus M. Crasso et Cn. Lentulo Augure adsignavi  "
 +"militibus, solvi municipis. Ea summa sestertium circiter  "
 +"sexsiens milliens fuit, quam pro Italicis praedis numeravi,  "
 +"et circiter bis milliens et sescentiens, quod pro agris  "
 +"provincialibus solvi. Id primus et solus omnium, qui   "
 +"deduxerunt colonias militum in Italia aut in provincis, ad  "
 +"memoriam aetatis meae feci. Et postea Ti. Nerone et Cn.  "
 +"Pisone consulibus, itemque C. Antistio et D. Laelio  "
 +"consulibus et C. Calvisio et L. Pasieno consulibus et L.  "
 +"Lentulo et M. Messalla consulibus, et L. Caninio et Q. Fabricio  "
 +"cos. militibus, quos emeriteis stipendis in sua municipia  "
 +"deduxi, praemia numerato persolvi, quam in rem sestertium  "
 +"quater milliens circiter impendi.  "
 +"17. Quater pecunia mea iuvi aerarium, ita ut sestertium  "
 +"milliens et quingentiens ad eos qui praeerant aerario detulerim.  "
 +"Et M. Lepido et L. Arruntio consulibus in aerarium  "
 +"militare, quod ex {;Onsilio meo constitutum est, ex quo  "
 +"praemia darentur militibus, qui vicena aut plura stipendia  "
 +"emeruissent, HS milliens et septingentiens ex patrimonio  "
 +"meo detuli.  "
 +"18. Ab illo anno, quo Cn. et P. Lentuli consules fuerunt,  "
 +"cum deficerent publicae opes turn centum millibus hominum  "
 +"turn pluribus multo frumentarios et nummarios tributus  "
 +"ex horreo et patrimonio meo edidi.   "
 +"19. Curiam et continens ei Chalcidicum templumque  "
 +"Apollinis in Palatio cum porticibus, aedem divi Iuli, Lupercal,  "
 +"porticum ad circum Flaminium, quam sum appellari  "
 +"passus ex nominc cius qui priorem eodem in solo fecerat  "
 +"Octaviam, pulvinar ad circum Maximum, aedes in  "
 +"Capitolio Iovis Feretri et Iovis Tonantis, aedem Quirini,  "
 +"aedes Minervae et Iunonis Reginae et Iovis Libertatis in  "
 +"Aventino, aedem Larum in summa sacra via, aedem deum  "
 +"Penatium in Velia, aedem Iuventatis, aedem Matris Magnae  "
 +"in Palatio feci.  "
 +"20. Capitolium et Pompeium theatrum utrumque opus  "
 +"impensa grandi refeci sine ulla inscriptione nominis mei.  "
 +"Rivos aquarum compluribus locis vetustate Iabenres refeci  "
 +"et aquam quae Marcia appellatur duplicavi fonte novo in rivum  "
 +"eius inmisso. Forum Iulium et basilicam, quae fuit inter  "
 +"aedem Castoris et aedem Saturni, coepta profligataque  "
 +"opera a patre meo, perfeci et eandem basilicam consumptam  "
 +"incendio, ampliato eius solo, sub titulo nominis filiorum   "
 +"meorum incohavi et, si vivus non perfecissem, perfici  "
 +"ab heredibus meis iussi. Duo et octoginta templa deum in  "
 +"urbe consul sexturn ex auctoritate senatus refeci, nullo  "
 +"praetermisso quod eo tempore refici debebat. Consul septimum  "
 +"viam Flaminiam ab urbe Ariminum refeci pontesque  "
 +"omnes praeter Mulvium et Minucium.  "
 +"21. In privato solo Martis Ultoris templum forumque  "
 +"Augustum ex manibiis feci. Theatrum ad aedem Apollinis  "
 +"in solo magna ex parte a privatis empto feci, quod sub nomine  "
 +"M. Marcelli generi mei esset. Dona ex manibiis in  "
 +"Capitolio et in aede divi Iuli et in aede Apollinis et in aede  "
 +"Vestae et in templo Martis Ultoris consacravi, quae mihi  "
 +"constiterunt HS circiter milliens. Auri coronari pondo triginta  "
 +"et quinque millia municipiis et colonis Italiae conferentibus  "
 +"ad triumphos meos quintum consul remisi, et  "
 +"postea, quotienscumque imperator appellatus sum, aurum  "
 +"coronarium non accepi, decernentibus municipiis et colonis  "
 +"aeque benigne adque antea decreverant.   "
 +"22. Ter munus gladiatorium dedi meo nomine et quinquiens  "
 +"filiorum meorum aut nepotum nomine; quibus  "
 +"muneribus depugnaverunt hominum circiter decem millia.  "
 +"Bis athletarum undique accitorum spectaculum populo  "
 +"praebui meo nomine et tertium nepotis mei nomine. Ludos  "
 +"feci meo nomine quater, aliorum autem magistratuum  "
 +"vicem ter et viciens. Pro conlegio XVvirorum magister  "
 +"conlegii collega M. Agrippa Judos saeclares C. Furnio C.  "
 +"Silano cos. feci. Consul XIII Judos Martiales primus feci,  "
 +"quos post id tempus deinceps insequentibus annis s. c. et  "
 +"lege fccerunt consules. Venationes bestiarum Africanarum  "
 +"meo nomine aut filiorum meorum et nepotum in circo aut  "
 +"in foro aut in amphitheatris populo dedi sexiens et viciens,  "
 +"quibus confecta sunt bestiarum circiter tria millia et quingentae.  "
 +"23. Navalis proeli spectaculum populo dedi trans Tiberim,  "
 +"in quo loco nunc nemus est Caesarum, cavato solo in  "
 +"longitudinem mille et actingentos pedes, in latitudinem  "
 +"mille et ducenti. In quo triginta rostratae naves triremes   "
 +"aut biremes, plures autem minores inter se conflixerunt.  "
 +"Quibus in classibus pugnaverunt praeter remiges millia  "
 +"hominum tria circiter.  "
 +"24. In templis omnium civitatium provinciae Asiae victor  "
 +"ornamenta reposui, quae spoliatis templis is, cum quo  "
 +"bellum gesseram, privatim possederat. Statuae meae pedestres  "
 +"et equestres et in quadrigeis argenteae steterum in  "
 +"urbe XXC circiter, quas ipse sustuli exque ea pecunia  "
 +"dona aurea in aede Apollinis meo nomine et illorum, qui  "
 +"mihi statuarum honorem habuerunt, posui.  "
 +"25. Mare pacavi a praedonibus. Eo bello servorum, qui  "
 +"fugerant a dominis suis et arma contra rem publicam ceperant,  "
 +"triginta fere millia capta dominis ad supplicium sumendum  "
 +"tradidi. Iuravit in mea verba tota Italia sponte  "
 +"sua et me belli, quo vici ad Actium, ducem depoposcit. Iuraverunt  "
 +"in eadem verba provinciae Galliae Hispaniae  "
 +"Africa Sicilia Sardinia. Qui sub signis meis turn militaverint,  "
 +"fuerunt senatores plures quam DCC, in iis qui vel antea vel   "
 +"postea consules facti sunt ad eum diem quo  "
 +"scripta sunt haec, LXXXIII, sacerdotes circiter CLXX.  "
 +"26. Omnium provinciarum populi Romani, quibus finitimae  "
 +"fuerunt gentes quae non parerent imperio nostro, fines  "
 +"auxi. Gallias et Hispanias provincias, item Germaniam qua  "
 +"includit Oceanus a Gadibus ad ostium Albis fluminis pacavi.  "
 +"Alpes a regione ea, quae proxima est Hadriano mari, ad  "
 +"Tuscum pacari feci nulli genti bello per iniuriam inlato.  "
 +"Classis mea per Oceanum ab ostio Rheni ad solis orientis  "
 +"regionem usque ad fines Cimbrorum navigavit, quo neque  "
 +"terra neque mari quisquam Romanus ante id tempus adit,  "
 +"Cimbrique et Charydes et Semnones et eiusdem tractus alii  "
 +"Germanorum populi per legatos amicitiam meam et populi  "
 +"Romani petierunt. Meo iussu et auspicio ducti sunt duo  "
 +"exercitus eodem fere tempore in Aethiopiam et in Arabiam,  "
 +"quae appellatur Eudaemon, maximaeque hostium gentis  "
 +"utriusque copiae caesae sunt in acie et complura oppida   "
 +"capta. In Aethiopiam usque ad oppidum Nabata perventum  "
 +"est, cui proxima est Meroe: in Arabiam usque in fines  "
 +"Sabaeorum processit exercitus ad oppidum Mariba.  "
 +"27. Aegyptum imperio populi Romani adieci. Armeniam  "
 +"maiorem interfecto rege eius Artaxe cum possem facere  "
 +"provinciam, malui maiorum nostrorum exemplo regnum  "
 +"id Tigrani regis Artavasdis filio, nepoti autem Tigranis  "
 +"regis, per Ti. Neronem tradere, qui turn mihi privignus  "
 +"erat. Et eandem gentem postea deseiseentern et rebellantem  "
 +"domitam per Gaium filium meum regi Ariobarzani  "
 +"regis Medorum Artabazi filio regendam tradidi et post  "
 +"eius martern filio eius Artavasdi. Quo interfecto Tigranem,  "
 +"qui erat ex regio genere Armerriorum oriundus, in  "
 +"id regnum misi. Provincias omnis, quae trans Hadrianum  "
 +"mare vergunt ad Orientem, Cyrenasque, iam ex parte  "
 +"magna regibus ea possidentibus, et antea Siciliam et Sardiniam  "
 +"occupatas bello servili reciperavi.  "
 +"2 8. Colonias in Africa Sicilia Macedonia utraque Hispania  "
 +"Achaia Asia Syria Gallia Narbonensi Pisidia militum  "
 +"deduxi. Italia autem XXVIII colonias, quae vivo me celeber   "
 +"rimae et frequentissimae fuerunt, mea auetorirate deductas  "
 +"habet.  "
 +"29. Signa militaria complura per alios duces amissa devictis  "
 +"hostibus recepi ex Hispania et Gallia et a Dalmateis.  "
 +"Parthos trium exercitum Romanorum spolia et signa reddere  "
 +"mihi supplicesque amicitiam populi Romani petere  "
 +"coegi. Ea autem signa in penetrali, quod est in templo  "
 +"Martis Ultoris, reposui.  "
 +"30. Pannoniorum gentes, quas ante me principem populi  "
 +"Romani exercitus nunquam adit, devictas per Ti. Neronem,  "
 +"qui turn erat privignus et legatus meus, imperio populi  "
 +"Romani subieci protulique fines Illyrici ad ripam fluminis  "
 +"Danuvi. Citra quod Dacorum transgressus exercitus  "
 +"meis auspicis victus profligatusque est, et postea trans Danuvium  "
 +"ductus exercitus meus Dacorum gentes imperia  "
 +"populi Romani perferre coegit.  "
 +"3 1 . Ad me ex India regum Iegationes saepe missae sunt  "
 +"non visae ante id tempus apud quemquam Romanorum  "
 +"ducem. Nostram amicitiam appetiverunt per legatos Bastar   "
 +"nae Scythaeque et Sarmatarum, qui sunt citra flumen Tanaim  "
 +"et ultra, reges, Albanorumque rex et Hiberorum et  "
 +"Medorum.  "
 +"32. Ad me supplices confugerunt reges Parrhorum Tiridates  "
 +"et postea Phrates regis Phratis filius; Medorum Artavasdes,  "
 +"Adiabenorum Artaxares, Britannorum Dumnobellaunus  "
 +"et Tincommius, Sugambrorum Maelo, Marcomanorum  "
 +"Sueborum . . . rus. Ad me rex Parrhorum Phrates  "
 +"Orodis filius filios suos nepotesque omnes misit in Italiam,  "
 +"non bello superatus, sed amicitiam nostram per liberorum  "
 +"suorum pignora petens. Plurimaeque aliae gentes expertae  "
 +"sunt p. R. fidem me principe, quibus antea cum populo Romano  "
 +"nullum extiterat legationum et amicitiae commercium.  "
 +"33. A me gentes Parrhorum et Medorum per legatos  "
 +"principes earum gentium reges petitos acceperunt: Parthi  "
 +"Vononem, regis Phratis filium, regis Orodis nepotem,  "
 +"Medi Ariobarzanem, regis Artavazdis filium, regis Ariobarzanis  "
 +"nepotem.  "
 +"34. In consulatu sexto et septimo, postquam bella civilia  "
 +"exstinxeram, per consensum universorum potitus rerum   "
 +"omnium, rem publicam ex mea potestate in senatus populique  "
 +"Romani arbitrium transtuli. Quo pro merito meo senatus  "
 +"consulto Augustus appellatus sum et laureis postes aedium  "
 +"mearum vestiti publice coronaque civica super ianuam  "
 +"meam fixa est et clupeus aureus in curia Iulia positus,  "
 +"quem mihi senatum populumque Romanum dare virtutis  "
 +"clementiaeque iustitiae et pietatis caussa testatum est per  "
 +"eius clupei inscriptionem. Post id tempus auetorirate omnibus  "
 +"praestiti, potestatis autem nihilo amplius habui quam  "
 +"ceteri qui mihi quoque in magistratu conlegae fuerunt.  "
 +"35. Tertium decimum consulatum cum gerebam senatus  "
 +"et equester ordo populusque Romanus universus appellavit  "
 +"me patrem patriae idque in vestibulo aedium mearum  "
 +"inscribendum et in curia Iulia et in foro Aug. sub quadrigeis,  "
 +"quae mihi ex s. c. positae sunt, censuit. Cum scripsi  "
 +"haec, annum agebam septuagensumum sextum.   "
 +"1 . Summa pecuniae, quam dedit vel in aerarium vel piebei  "
 +"Romanae vel dimissis militibus: denarium sexiens milliens.  "
 +"2. Opera fecit nova aedem Martis, Iovis Tonantis et Feretri,  "
 +"Apollinis, divi Iuli, Quirini, Minervae, Iunonis Reginae,  "
 +"lovis Libertatis, Larum, deum Penatium, luventatis,  "
 +"Matris Magnae, Lupercal, pulvinar ad circum, curiam cum  "
 +"Chalcidico, forum Augustum, basilicam Iuliam, theatrum  "
 +"Marcelli, porticum Octaviam, nemus trans Tiberim Caesarum.  "
 +"3. Refecit Capitolium sacrasque aedes numero octoginta  "
 +"duas, theattum Pompei, aquarum rivos, viam Flaminiam.  "
 +"4. Impensa praestita in spectacula scaenica et munera  "
 +"gladiatorum atque athletas et venationes et naumachiam et  "
 +"donata pecunia colonis municipiis oppidis terrae motu incendioque  "
 +"consumptis aut viritim amicis senatoribusque  "
 +"quorum census explevit, innumerabilis.";

addnewedtext();
document.getElementsByName("ed3editor")[0].value = "Frederick W. Shipley";
document.getElementsByName("ed3name")[0].value = "Res gestae Divi Augusti";
document.getElementsByName("ed3publishingplace")[0].value = "London";
document.getElementsByName("ed3publishingdate")[0].value = "1924";
document.getElementsByName("ed3text")[0].value = "1 Rérum gestárum díví Augusti, quibus orbem terrarum ímperio populi Rom. subiécit, § et inpensarum, quas in rem publicam populumque Romanum fecit, incísarum in duabus aheneís pílís, quae sunt Romae positae, exemplar subiectum.  "
 +"Annós undéviginti natus exercitum priváto consilio et privatá impensá comparávi, § per quem rem publicam dominatione factionis oppressam in libertátem vindicávi. Quas ob res senatus decretís honorificís in ordinem suum me adlegit C. Pansa A. Hirtio consulibus, consularem locum sententiae dicendae simul dans, et imperium mihi dedit. § Rés publica ne quid detrimenti caperet, me pro praetore simul cum consulibus providere iussit. § Populus autem eódem anno mé consulem, cum cos. uterque bello cecidisset, et trium virum reí publicae constituendae creavit.   "
 +"2 Quí parentem meum interfecerunt, eós in exilium expulí iudiciís legi timís ultus eórum facinus, § et posteá bellum inferentís reí publicae víci bis acie.  "
 +"3 Bella terra et mari civilia externaque tóto in orbe terrarum suscepi victorque omnibus veniam petentibus cívibus pepercí. § Externas gentés, quibus túto ignosci potuit, conserváre quam excídere malui. § Míllia civium Rómanorum adacta sacrámento meo fuerunt circiter quingenta. § Ex quibus dedúxi in coloniás aut remísi in municipia sua stipendis emeritis millia aliquanto plura quam trecenta et iís omnibus agrós adsignavi aut pecuniam pro praemis militiae dedí. § Naves cépi sescentas praeter eás, si quae minóres quam triremes fuerunt. §  "
 +"4 Bis ováns triumphavi, tris egi curulís triumphós et appellátus sum viciens semel imperátor. Cum autem plúris triumphos mihi senatus decrevisset, iis supersedi. § Laurum de fascibus deposuí § in Capitolio votis, quae quóque bello nuncupaveram, solutís. § Ob res á me aut per legatos meós auspicís meis terra marique prospere gestás quinquagiens et quinquiens decrevit senátus supplicandum esse dís immortalibus. Dies autem, per quós ex senátús consulto supplicátum est, fuere DCCCLXXXX. In triumphis meis ducti sunt ante currum meum regés aut regum liberi novem. Consul fueram terdeciens, cum scribebam haec, et agebam septimum et trigensimum annum tribuniciae potestatis.  "
 +"5 Dictaturam et apsenti et praesenti a populo et senatu Romano mihi oblatam M. Marcello et L. Arruntio consulibus non accepi. Non recusavi in summa frumenti penuria curationem annonae, quam ita administravi, ut intra paucos dies metu et periclo praesenti populum universum meis impensis liberarem. § Consulatum tum datum annuum et perpetuum non accepi.   "
 +"6 Consulibus M. Vinucio et Q. Lucretio et postea P. et Cn. Lentulis et tertium Paullo Fabio Maximo et Q. Tuberone senatu populoque Romano consen tientibus.  "
 +"7 Princeps senatus fui usque ad eum diem, quo scripseram haec, per annos quadraginta. Pontifex maximus, augur, quindecimvirum sacris faciundis, septemvirum epulonum, frater arvalis, sodalis Titius, fetialis fuí.  "
 +"8 Patriciórum numerum auxí consul quintum iussu populi et senátús. § Senatum ter légi. Et In consulátú sexto cénsum populi conlegá M. Agrippá égí. § Lústrum post annum alterum et quadragensimum féci. § Quó lústro cívi4 um Románórum censa sunt capita quadragiens centum millia et sexaginta tria millia. § Iterum consulari cum imperio lústrum sólus féci C. Censorino et C. Asinio cos. § Quó lústro censa sunt cívium Romanórum capita quadragiens centum millia et ducenta triginta tria millia. Tertium consulári cum imperio lústrum conlegá Tib. Caesare filio meo feci § Sex. Pompeio et Sex. Appuleio cos. Quó lústro censa sunt civium Románórum capitum quadragiens centum millia et nongenta triginta et septem millia. § Legibus novis latis complura exempla maiorum exolescentia iam ex nostro usu revocavi et ipse multárum rérum exempla imitanda posteris tradidi.  "
 +"9 Vota pro valetudine mea suscipi per consulés et sacerdotes quinto quoque anno senatus decrevit. Ex iis votís saepe fecerunt vívo me ludos aliquotiens sacerdotum quattuor amplissima collégia, aliquotiens consules. Privatim etiam et múnicipatim úniversi cives uno animo continenter apud omnia pulvínária pró valetudine mea sacrificaverunt.  "
 +"10 Nomen meum senatus consulto inclusum est ín saliáre carmen et sacrosanctus ut essem in perpetuum et quoad víverem, tribúnicia potestás mihí esset, per legem sanctum est. Pontifex maximus ne fierem in víví conlegae locum, populo id sacerdotium deferente mihi, quod pater meus habuerat, recusavi. Cepi id sacerdotium aliquod post annós eó mortuo demum, qui id tumultus occasione occupaverat §, cuncta ex Italia ad comitia mea coeunte tanta multitudine, quanta Romae nunquam ante fuisse narratur § P. Sulpicio C. Valgio consulibus §.  "
 +"11 Aram Fortunae Reducis iuxta aedés Honoris et Virtutis ad portam Capenam pro reditu meo senátus consacravit, in qua pontifices et virgines Vestales anniversárium sacrificium facere iussit eo die, quo consulibus Q. Lucretio et M. Vinucio in urbem ex Syria redi, et diem Augustalia ex cognomine nostro appellavit.  "
 +"12 Senatus consulto eodem tempore pars praetorum et tribunorum plebis cum consule Q. Lucretio et principibus viris obviam mihi missa est in Campaniam, qui honos ad hoc tempus nemini praeter me est decretus. Cum ex Hispaniá Galliaque, rebus in his provincís prospere gestis, Romam redi Ti. Nerone P. Quintilio consulibus §, áram Pacis Augustae senatus pro reditú meó consacrari censuit ad campum Martium, in qua magistratús et sacerdotes et virgines Vestáles anniversarium sacrificium facere iussit.   "
 +"13 Ianum Quirinum, quem claussum esse maiores nostri voluerunt, cum per totum imperium populi Romani terra marique esset parta victoriis pax, cum prius, quam náscerer, a condita urbe bis omnino clausum fuisse prodátur memoriae, ter me principe senatus claudendum esse censuit.  "
 +"14 Filios meos, quós iuvenes mihi eripuit fortuna, Gaium et Lucium Caesares honoris mei caussá senatus populusque Romanus annum quíntum et decimum agentís consulés designávit, ut eum magistrátum inírent post quinquennium. Et ex eó die, quó deducti sunt in forum, ut interessent consiliís publicís decrevit senatus. Equites autem Románi universi principem iuventútis utrumque eórum parmis et hastís argenteís donátum appelláverunt. §  "
 +"15 Plebei Románae viritim HS trecenos numeravi ex testámento patris meí, § et nomine meo HS quadringenos ex bellórum manibiís consul quintum dedí, iterum autem in consulátú decimo ex patrimonio meo HS quadringenos congiári viritim pernumeraví, § et consul undecimum duodecim frúmentátiónes frúmento privatim coémpto emensus sum, § et tribuniciá potestáte duodecimum quadringenós nummós tertium viritim dedí. Quae mea congiaria pervenerunt ad hominum millia nunquam minus quinquáginta et ducenta. § Tribuniciae potestátis duodevicensimum consul XII trecentís et viginti millibus plebís urbánae sexagenós denariós viritim dedí. § In colonis militum meórum consul quintum ex manibiís viritim millia nummum singula dedi; acceperunt id triumphale congiárium in colonís hominum circiter centum et viginti millia. § Consul tertium decimum sexagenós denáriós plebeí, quae tum frúmentum publicum accipiebat, dedi; ea millia hominum paullo plúra quam ducenta fuerunt.  "
 +"16 Pecuniam pro agrís, quós in consulátú meó quárto et posteá consulibus M. Crasso et Cn. Lentulo augure adsignávi militibus, solví múnicipís. Ea summa sestertium circiter sexsiens milliens fuit, quam pró Italicís praedis numeravi, § et circiter bis milliens et sescentiens, quod pro agrís próvincialibus solví. § Id primus et solus omnium, qui dedúxerunt colonias militum in Italiá aut in provincís, ad memoriam aetátis meae feci. Et postea Ti. Nerone et Cn. Pisone consulibus, § itemque C. Antistio et D. Laelio cos., et C. Calvisio et L. Pasieno consulibus, et L. Lentulo et M. Messalla consulibus, § et L. Cánínio § et Q. Fabricio cos. militibus, quós emeriteis stipendís in sua municipia deduxi, praemia numerato persolví, § quam in rem sestertium quater milliens libenter impendi.  "
 +"17 Quater pecuniá meá iuví aerárium, ita ut sestertium mílliens et quingentiens ad eos quí praerant aerário detulerim. Et M. Lepido et L. Arruntio cos. in aerarium militare, quod ex consilio meo constitutum est, ex quo praemia darentur militibus, qui vicena aut plura stipendia emeruissent, § HS milliens et septingentiens ex patrimonio meo detuli. §  "
 +"18 Inde ab eo anno, quo Cn. et P. Lentuli consules fuerunt, cum deficerent vectigalia, tum centum millibus hominum tum pluribus multo frumentarias et nummariás tesseras ex aere et patrimonio meo dedi.  "
 +"19 Cúriam et continens eí chalcidicum, templumque Apollinis in Palatio cum porticibus, aedem dívi Iulí, Lupercal, porticum ad circum Fláminium, quam sum appellári passus ex nómine eius quí priórem eódem in solo fecerat Octaviam, pulvinar ad circum maximum, aedés in Capitolio Iovis Feretrí et Iovis Tonantis, § aedem Quiriní, § aedés Minervae § et Iúnonis Reginae § et Iovis Libertatis in Aventíno, § aedem Larum in summá sacrá viá, § aedem deum Penátium in Velia, § aedem Iuventátis, § aedem Mátris Magnae in Palátio fécí. §  "
 +"20 Capitolium et Pompeium theatrum utrumque opus impensá grandí reféci sine ullá inscriptione nominis meí. § Rívos aquarum complúribus locís vetustáte labentés refécí, § et aquam quae Márcia appellátur duplicavi fonte novo in rivum eius inmisso. § Forum Iúlium et basilicam, quae fuit inter aedem Castoris et aedem Saturni, § coepta profligata que opera á patre meó perféci § et eandem basilicam consumptam incendio ampliáto eius solo sub titulo nominis filiórum meorum incohavi § et, si vivus nón perfecissem, perfici ab heredibus iussi. Duo et octoginta templa deum in urbe consul sextum ex decreto senatus reféci, nullo praetermisso quod eo tempore refici debebat. Consul septimum viam Flaminiam ab urbe Ariminum feci et pontes omnes praeter Mulvium et Minucium.  "
 +"21 In privato solo Mártis Vltoris templum forumque Augustum ex manibiís fecí. § Theatrum ad aede Apollinis in solo magná ex parte á privatis empto féci, quod sub nomine M. Marcelli generi mei esset. § Dona ex manibiís in Capitolio et in aede dívi Iúlí et in aede Apollinis et in aede Vestae et in templo Martis Vltoris consacrávi, § quae mihi constiterunt HS circiter milliens. § Aurí coronárí pondo triginta et quinque millia múnicipiís et colonís Italiae conferentibus ad triumphós meós quintum consul remisi, et posteá, quotienscumque imperátor appellátus sum, aurum coronárium nón accepi decernentibus municipiis et colonis aeque benigne adquo antea decreverant.  "
 +"22 Ter munus gladiátorium dedí meo nomine et quinquens filiórum meorum aut nepótum nomine; quibus muneribus depugnaverunt hominum circiter decem millia. § Bis athletarum undique accitorum spectaclum populo praebui meo nómine et tertium nepotis meí nomine. § Ludos fecí meo nomine quater, § aliorum autem magistrátuum vicem ter et viciens. § Pro conlegio XV virorum magister conlegií collega M. Agrippa § ludos saeclares C. Furnio C. Silano cos. feci. Consul XIII ludos Martiales primus feci, quos post id tempus deinceps insequentibus annis s. c. mecum fecerunt consules. § Venationes bestiarum Africanárum meo nómine aut filiorum meórum et nepotum in circo aut in foro aut in amphitheatris populo dedi sexiens et viciens, quibus confecta sunt bestiarum circiter tria millia et quingentae.  "
 +"23 Navalis proelí spectaclum populo dedi trans Tiberim, in quo loco nunc nemus est Caesarum, cavato solo in longitudinem mille et octingentós pedés, § in látitudinem mille et ducenti. In quo triginta rostrátae náves trirémes aut biremés, § plures autem minóres inter se conflixérunt. Quibus in classibus pugnaverunt praeter rémigés millia hominum tria circiter. §  "
 +"24 In templís omnium civitátium provinciae Asiae victor ornamenta reposui, quae spoliátis templis is cum quó bellum gesseram privátim possederat. § Statuae meae pedestrés et equestres et in quadrigeis argenteae steterunt in urbe XXC circiter, quas ipse sustuli § exque eá pecuniá dona aurea in áede Apollinis meó nomine et illórum, qui mihi statuárum honórem habuerunt, posui. §  "
 +"25 Mare pacávi á praedonibus. Eó bello servórum, qui fugerant á dominis suis et arma contrá rem publicam céperant, triginta fere millia capta § dominis ad supplicium sumendum tradidi. § Iuravit in mea verba tóta Italia sponte suá et me belli, quó víci ad Actium, ducem depoposcit. § Iuraverunt in eadem verba próvinciae Galliae Hispaniae Africa Sicilia Sardinia. § Qui sub signis meis tum militaverint, fuerunt senátóres plúres quam DCC, in iís qui vel antea vel posteá consules factí sunt ad eum diem quó scripta sunt haec, LXXXIII, sacerdotés circiter CLXX. §  "
 +"26 Omnium próvinciarum populi Romani, quibus finitimae fuerunt gentés quae non parerent imperio nostro, fines auxi. Gallias et Hispaniás próviciás et Germaniam qua includit Óceanus a Gádibus ad óstium Albis flúminis pacavi. Alpes a regióne eá, quae proxima est Hadriánó mari, ad Tuscum pacari feci nullí gentí bello per iniúriam inláto. Classis mea per Oceanum ab óstio Rhéni ad sólis orientis regionem usque ad fines Cimbrorum navigavit, § quó neque terra neque mari quisquam Romanus ante ide tempus adít, § Cimbrique et Charydes et Semnones et eiusdem tractús alií Germánórum populi per legátós amicitiam meam et populi Románi petierunt. § Meo iussú et auspicio ducti sunt duo exercitus eódem fere tempore in Aethiopiam et in Arabiam, quae appellatur eudaemón, maximaeque hostium gentís utriusque copiae caesae sunt in acie et complura oppida capta. In Aethiopiam usque ad oppidum Nabata perventum est, cuí proxima est Meroé. In Arabiam usque ín fínés Sabaeorum processit exercitus ad oppidum Mariba. §  "
 +"27 Aegyptum imperio populi Romani adieci. § Armeniam maiorem interfecto rége eius Artaxe § cum possem facere provinciam, málui maiórum nostrórum exemplo regnum id Tigrani regis Artavasdis filio, nepoti autem Tigránis regis, per Ti. Neronem tradere, qui tum mihi privignus erat. Et eandem gentem posteá descíscentem et rebellantem domitam per Gaium filium meum regi Ariobarzani regis Medorum Artabazi filio regendam tradidi § et post eius mortem filio eius Artavasdi. § Quo interfecto Tigrane, qui erat ex régió genere Armeniorum oriundus, in id regnum mísí. § Provincias omnís, quae trans Hadrianum mare vergunt ad orientem, Cyrenásque, iam ex parte magná regibus eas possidentibus, et antea Siciliam et Sardiniam occupatás bello servili reciperáví. §  "
 +"28 Colonias in África Sicilia Macedoniá utráque Hispániá Achaia Asia Syria Galliá Narbonensi Pisidia militum dedúxí. § Italia autem XXVIII coloniás, quae vívo me celeberrimae et frequentissimae fuerunt, meis auspicis deductas habet.  "
 +"29 Signa mílitaria complura per aliós ducés ámissa devictís hostibus reciperaví ex Hispania et Gallia et a Dalmateis. § Parthos trium exercitum Romanorum spolia et signa reddere mihi supplicesque amicitiam populí Romaní petere coegi. § Ea autem signa in penetrálí, quod est in templo Martis Vltoris, reposui.  "
 +"30 Pannoniorum gentes, quas ante me principem populi Romaní exercitus nunquam adít, devictas per Ti. Neronem, qui tum erat privignus et legátus meus, ímperio populi Romani subieci protulique finés Illyrici ad ripam flúminis Danui. Citra quod Dacorum transgressus exercitus meis auspicis victus profligatusque est, et posteá trans Danuvium ductus exercitus meus Dacorum gentes imperia populi Romani perferre coegit.   "
 +"31 Ad me ex India regum legationes saepe missae sunt, nunquam antea visae apud quemquam Romanorum ducem. § Nostram amicitiam petierunt per legatos Bastarnae Scythaeque et Sarmatarum qui sunt citra flumen Tanaim et ultrá reges, Albanorumque réx et Hibérorum et Medorum.  "
 +"32 Ad mé supplices confugerunt regés Parthorum Tíridates et postea Phrátes 1 regis Phratis filius; § Medorum Artavasdes; Adiabenorum Artaxares; § Britannorum Dumnobellaunus et Tim. . . . . .; Sugambrorum Maelo; § Marcomanórum Sueborum . . . . .rus. Ad me rex Parthorum Phrates Orodis filius filiós suós nepotesque omnes misit in Italiam, non bello superátus, sed amicitiam nostram per liberorum suorum pignora petens. § Plúrimaeque aliae gentes expertae sunt p. R. fidem me principe, quibus anteá cum populo Romano nullum extiterat legationum et amícitiae commercium. §  "
 +"33 A me gentés Parthórum et Médórum per legatos principes eárum gentium régés petitós accéperunt: Parthi Vononem regis Phrátis fílium, régis Oródis nepótem, § Médí Ariobarzanem, regis Artavazdis filium, regis Ariobarzanis nepotem.  "
 +"34 Ín consulátú sexto et septimo, bella ubi civilia exstinxeram per consénsum úniversórum potitus rerum omnium, rem publicam ex meá potestáte § in senátus populique Romani arbitrium transtulí. Quó pro merito meó senatus consulto Augustus appellátus sum et laureís postés aedium meárum vestiti publice coronaque civíca super iánuam meam fíxa est § clupeusque aureus in cúriá Iúliá positus, quem mihi senatum populumque Romanum dare virtutis clementiae iustitiae pietatis caussa testatum est per eius clúpei inscriptionem. § Post id tempus praestiti omnibus dignitate, potestatis autem nihilo amplius habui quam qui fuerunt mihi quoque in magistratu conlegae.  "
 +"35 Tertium decimum consulátum cum gerebam, senatus et equester ordo populusque Románus úniversus appellavit me patrem patriae idque in vestibulo aedium meárum inscribendum esse atque in curia et in foró Aug. sub quadrigis, quae mihi ex s. c. positae sunt, decrevit. Cum scripsi haec, annum agebam septuagensumum sextum.  "
 +"1 Summá pecúniae, quam dedit in aerarium vel plebei Romanae vel dimissis militibus: denarium sexiens milliens.  "
 +"2 Opera fecit nova § aedem Martis, Iovis Tonantis et Feretri, Apollinis, díví Iúli, § Quirini, § Minervae, Iunonis Reginae, Iovis Libertatis, Larum, deum Penátium, § Iuventatis, Matris deum, Lupercal, pulvinar ad circum, § cúriam cum chalcidico, forum Augustum, basilicam 35 Iuliam, theatrum Marcelli, § porticus . . . . . . . . . . , nemus trans Tiberím Caesarum. §  "
 +"3 Refécit Capitolium sacrasque aedes numero octoginta duas, theatrum Pompeí, aquarum rivos, viam Flaminiam.  "
 +"4 Impensa praestita in spectacula scaenica et munera gladiatorum atque athletas et venationes et naumachiam et donata pecunia a  (?)  "
 +"42 terrae motu § incendioque consumptis aut viritim amicis senatoribusque, quórum census explevit, ínnumerabilis. §";

addnewedtext();
document.getElementsByName("ed4editor")[0].value = "Mommsen Theodor";
document.getElementsByName("ed4name")[0].value = "Res gestae divi augusti";
document.getElementsByName("ed4publishingplace")[0].value = "Berlin";
document.getElementsByName("ed4publishingdate")[0].value = "1865";
document.getElementsByName("ed4text")[0].value = "Rerum gestarum divi Augusti, quibus orbem terrarum imperio  "
 +"populi Romani subiecit, et inpensarum, quas in rem publicam  "
 +"populumque Romanum fecit, incisarum in duabus aheneis pilis,  "
 +"quae sunt Romae positae, exemplar subiectum.  "
 +"1 Annos undeviginti natus exercitum privato consilio et privata  "
 +"impensa comparavi, per quem rem publicam dominatione factionis  "
 +"oppressam in libertatem vindicavi. Propter quae senatus  "
 +"decretis honorificis in ordinem suum me adlegit C. Pansa et A.  "
 +"Hirtio consulibus, consularem locum mihi tribuens. Eodemque tempore  "
 +"imperium mihi dedit. Res publica ne quid accideret, a senatu mihi  "
 +"pro praetore simul cum consulibus tradita est tuenda. Populus  "
 +"autem eodem anno me consulem, cum consul uterque bello cecidisset,  "
 +"et trium virum rei publicae constituendae in quinquennium creavit.  "
 +"2 Qui parentem meum occiderunt, eos in exilium expuli  "
 +"indiciis legitimis ultus eorum scelus et postea bellum inferentis rei  "
 +"publicae vici acie bis.  "
 +"3 Arma terra et mari civilia externaque toto in orbe terrarum  "
 +"Sustinui victorque omnibus superstitibus civibus peperci.  "
 +"Externas gentes, quibus tuto parcere potui, conservare quam  "
 +"excidere malui. Millia civium Romanorum in sacramento meo  "
 +"fuerunt circiter …….ta. Ex quibus deduxi in colonias aut  "
 +"remisi in municipia sua stipendis emeritis millia aliquanto plus  "
 +"quam trecenta et iis omnibus agros a me emptos aut pecuniam pro  "
 +"praediis a me dedi. Naves cepi sescentas praeter eas, si quae  "
 +"minores quam triremes fuerunt.  "
 +" 4 Bis ovans triumphavi, tris egi currulis triumphos et appellatus  "
 +"sum viciens semel imperator. Cum deinde pluris triumphos mihi   "
 +"senatus decrevisset, iis supersedi et tantummodo laurus deposui in  "
 +"Capitolio votis, quae quoque bello nuncuparam, redditis. Ob res  "
 +"aut a me aut per legatos meos auspicis meis terra marique prospere  "
 +"gestas quinquagiens et quinquiens decrevit senatus supplicandum  "
 +"esse dis immortalibus. Dies, per quos ex senatus consulto  "
 +"supplicatum est, fuere DCCCLXXXX. In triumphis meis ducti  "
 +"sunt ante currum meum reges aut regum liberi VIIII. Consul  "
 +"fueram ter deciens, cum scripsi haec, annumque trigesimum septimum  "
 +"tribuniciae potestatis agebam.  "
 +"5 Dictaturam et apsenti et praesenti mihi datam a populoque   "
 +"M. Marcello et L . Arruntio consulibus non recepi. Non  "
 +"recusavi in summa frumenti penuria curam annonae,  "
 +"qua non neglegenter facta meis sumptibus metu et periculo praesenti  "
 +"populum universam paucis diebus liberavi. Tum consulatum  "
 +"mihi datum et annuum et perpetuum non recepi.  "
 +"6 Consulibus M. Vinucio et Q. Lucretio et postea P. et Cn.  "
 +"Lentulis et tertium Paullo Fabio Maximo et Q. Tuberone senatu  "
 +"populoque Romano consentientibus  "
 +"7 Trium virum fui rei publicae constituendae annis continuis   "
 +"Decem; princeps senatus usque ad eum diem, quo die scripsi  "
 +"haec, per annos quadraginta; pontifex, augur, quindecim virum   "
 +"sacris faciundis, septem virum epulonum, frater arvalis, sodalis  "
 +"Titius, fetialis.  "
 +"8 Patriciorum numerum auxi consul quintum iussu populi et  "
 +"senatus. Senatum ter legi. et In consulatu sexto censum populi  "
 +"conlega M. Agrippa egi. Lustrum post annum alterum et quadragensimum   "
 +"feci. Quo lustro civium Romanorum censa sunt capita  "
 +"quadragiens centum millia et sexaginta tria millia. Tum iterum  "
 +"consulari cum imperio lustrum solus feci C. Censorino et C. Asinio  "
 +"cos., quo lustro civium Romanorum censa sunt capita quadragiens  "
 +"centum millia et sexaginta tria millia. Iterum consulari  "
 +"cum imperio lustrum solus feci C. Censorino et C. Asinio  cos.  "
 +"Quo lustro censa sunt civium Romanorum  "
 +"capita quadragiens centum millia et ducenta triginta   "
 +"tria millia. Sex. Pompeio et Sex. Appuleio cos. Quo lustro censa  "
 +"sunt civium Romanorum capitum quadragiens centum millia et nongenta  "
 +"triginta et septem millia. Legibus novis latis et reduxi multa exempla  "
 +"maiorum exolescentia iam ex nostra civitate et ipse proposui multarum  "
 +"rerum exempla imitanda posteris.  "
 +"9 Pro valetudine mea quinto quoque anno per consules et sacerdotes   "
 +"ut vota susciperentur, senatus decrevit. Ex quibus votis saepe fecerunt vivo me  "
 +"ludos ………. modo sacerdotum quattuor amplissima collegia modo consules  "
 +"………. Privatim etiam et municipatim universi cives  "
 +"sacrificaverunt continuo apud omnia pulvinaria pro valetudine mea.  "
 +"10 Nomen meum senatus consulto inclusum est in saliare carmen  "
 +"et sacrosanctus ut essem ……. et ut quoad viverem, tribunicia  "
 +"potestas mihi esset, lege sanctum est. Pontifex maximus  "
 +"ne fierem in vivi locum, recusavi, populo illud sacerdotium  "
 +"deferente mihi, quod pater meus antea habuerat. Cepi id sacerdotium  "
 +"aliquod post annos eo mortuo qui id per civiles dessensiones   "
 +"occupaverat, cuncta ex Italia ad comitia mea tanta multitudine,  "
 +"quanta Romae nunquam antea fuisse traditur, coeunte P.  "
 +"Sulpicio C. Valgio consulibus.  "
 +"11 Aram Fortunae reduci iuxta aedes Honoris et Virtutis ad  "
 +"portam ……. pro reditu meo senatus consacravit, in qua  "
 +"pontifices virginesque Vestales anniversarium sacrificium facere  "
 +"iussit, quo die consulibus Q. Lucretio et M. Vinucio in urbem  "
 +"ex Syria redieram, diemque ex nomine nostro Augustalia appellavit.   "
 +"12 Senatus consulto eodem tempore pars praetorum et tribunorum una  "
 +"cum consule Q. Lucretio et principibus viris obviam mihi missi sunt  "
 +"in Campaniam, qui honos ad hoc tempus nemini praeter me   "
 +"decretus est. Cum ex Hispania Galliaque, rebus in his provincis  "
 +"prospere gestis, Romam redibam Tib. Nerone P. Quintilio consulibus,  "
 +"aram Pacis Augustae senatus pro reditu meo consacrari censuit  "
 +"ad campum Martium, in qua magistratus et sacerdotes virginesque  "
 +"Vestales anniversarium sacrificium facere iussit.  "
 +"13 Ianum Quirinum, quem claussum esse maiores nostri voluerunt,  "
 +"cum per totum imperium populi Romani esset terrestris navalisque   "
 +"pax, cum prius quam nascerer, ab urbe condita urbe bis omnino  "
 +"clausum fuisse prodatur memoriae, ter me principe senatus claudendum  "
 +"esse censuit.  "
 +"14 Filios meos, quos iuvenes mihi eripuit fortuna, Gaium et  "
 +"Lucium Caesares honoris mei caussa senatus populusque Romanus  "
 +"annum quintum et decimum agentis consulis designavit, ut eum  "
 +"magistratum inirent post quinquennium. Et ex eo die, quo deducti sunt  "
 +"in forum, ut interessent consiliis publicis, decrevit senatus. Equites  "
 +"autem Romani universi principem iuentutis utrumque eorum  "
 +"parmis et hastis argenteis donatum appellaverunt.  "
 +"15 Plebei Romanae viritim HS trecenos numeravi ex testamento  "
 +"patris mei, et nomine meo HS quadringenos ex bellorum manibiis  "
 +"consul quintum dedi, iterum autem in consulatu decimo ex patrimonio  "
 +"meo HS quadringenos congiari viritim pernumeravi, et  "
 +"consul undecimum duodecim frumentationes frumento privatim  "
 +"coempto emensus sum, et tribunicia potestate duodecimum quadringenos  "
 +"nummos tertium viritim dedi. Quae mea congiaria pervenerunt  "
 +"ad hominum millia nunquam minus quinquaginta et  "
 +"ducenta. Tribuniciae potestatis duodevicensimum consul XII  "
 +"trecentis et viginti millibus plebis urbanae sexagenos denarios  "
 +"viritim dedi. In colonis militum meorum consul quintum ex  "
 +"manibiis viritim millia nummum singula dedi; acceperunt id  "
 +"triumphale congiarium in colonis hominum circiter centum et  "
 +"viginti millia. Consul tertium decimum sexagenos denarios   "
 +"plebei, quae tum frumentum publicum accipiebat, dedi; ea millia  "
 +"hominum paulo plura quam ducenta fuerunt.  "
 +"16 Pecuniam pro agris, quos in consulatu meo quarto et postea  "
 +"consulibus M. Crasso et Cn. Lentulo Augure adsignavi militibus,  "
 +"solvi municipis. Ea summa sestertium circiter sexsiens milliens fuit,  "
 +"quam pro collaticis praedis numeravi, et circiter bis milliens et sescentiens,  "
 +"quod pro agris provincialibus solvi. Id primus et solus omnium,  "
 +"qui deduxerunt colonias militum in Italia aut in provincis ad  "
 +"memoriam aetatis meae feci. Et postea Ti. Nerone et Cn. Pisone  "
 +"consulibus, itemque C. Antistio et D. Laelio cos., et C. Calvisio  "
 +"et L . Pasieno consulibus, et L . Lentulo et M. Messalla consulibus, et  "
 +"L. Caninio et Q. Fabricio consulibus veteranos emeriteis stipendis in  "
 +"sua municipia remisi, praemia aere numerato persolvi, quam in rem  "
 +"sestertium …… milliens …… impendi.  "
 +"17 Quater pecunia mea iuvi aerarium, ita ut sestertium milliens  "
 +"et quingentiens ad eos qui praerant aerario detulerim. Et M.  "
 +"Lepido et L . Arruntio cos. in aerarium militare, quod ex consilio  "
 +"meo constitutum est, ex quo praemia darentur militibus, qui vicena  "
 +"plurave stipendia emeruissent, HS milliens et septingentiens   "
 +"Ti. Caesaris nomine et meo detuli.  "
 +"18 …….. anno quo Cn. et P. Lentuli consules fuerunt, cum  "
 +"deficerent …………., centum millibus hominum ex meis opibus empto  "
 +"frumento ……… um .. ia …st ……………………dedi.  "
 +"19 Curiam et continens ei Chalcidicum, templumque Apollinis in  "
 +"Palatio cum porticibus, aedem divi Iuli, Lupercal, porticum ad circum  "
 +"Flaminium, quam sum appellari passus ex nomine eius qui  "
 +"priorem eodem in solo fecerat Octaviam, pulvinar ad circum  "
 +"maximum, aedes in Capitolio Iovis feretri et Iovis tonantis,  "
 +"aedem Quirini, aedes Minervae et Iunonis Reginae et Iovis Libertatis  "
 +"in Aventino, aedem Larum in summa sacra via, aedem deum   "
 +"Penatium in Velia, aedem Iuventatis, aedem Matris Magnae in  "
 +"Palatio feci.  "
 +"20 Capitolium et Pompeium theatrum utrumque opus impensa  "
 +"grandi refeci sine ulla inscriptione nominis mei. Rivos aquarum  "
 +"compluribus locis vetustate labentes refeci. et aquam quae Marcia  "
 +"appellatur duplicavi fonte novo in rivum eius inmisso. Forum  "
 +"Iulium et basilicam, quae fuit inter aedem Castoris et aedem  "
 +"Saturni, coepta profligataque opera a patre meo, perfeci et eandem  "
 +"basilicam consumptam incendio ampliato eius solo sub titulo nominis  "
 +"filiorum meorum incohavi et, si vivus non perfecissem, perfici  "
 +"ab heredibus meis iussi. Duo et octoginta templa deum in urbe  "
 +"consul sextum ex decreto senatus refeci, nullo praetermisso quod  "
 +"eo tempore refici oporteret. Consul septimum viam Flaminiam ex  "
 +"manibiis Arimino et in ea pontes omnes praeter Mulvium et  "
 +"Minucium refeci.  "
 +"21 In privato solo Martis Ultoris templum forumque Augustum  "
 +"ex manibiis feci. Theatrum ad aedem Apollinis in solo magna ex  "
 +"parte a privatis empto feci, quod sub nomine M. Marcelli generi mei  "
 +"esset. Dona ex manibiis in Capitolio et in aede divi Iuli et in  "
 +"aede Apollinis et in aede Vestae et in templo Martis Ultoris consacravi,  "
 +"quae mihi constiterunt HS. circiter milliens. Auri coronari  "
 +"pondo triginta et quinque millia municipiis et colonis Italiae conferentibus  "
 +"ad triumphos meos quintum consul remisi et postea,  "
 +"quotienscumque imperator appellatus sum, aurum coronarium non  "
 +"accepi decernentibus municipiis et coloniis studio eodem adque  "
 +"antea decreverant.  "
 +"22 Ter munus gladiatorium dedi meo nomine et quinquiens  "
 +"filiorum meorum aut nepotum nomine; quibus muneribus pugnaverunt  "
 +"hominum circiter decem millia. Bis athletarum undique  "
 +"accitorum spectaculum populo praebui meo nomine et tertium  "
 +"nepotis mei nomine. Ludos feci meo nomine quater, aliorum  "
 +"autem magistratuum ter et viciens. Pro conlegio XV virorum  "
 +"magister conlegii conlega M. Agrippa ludos saeculares C. Furnio   "
 +"C. Silano cos. feci. Consul XIII ludos Marti Ultori feci, quos post  "
 +"id tempus deinceps …………………….. consules fecerunt.  "
 +"Venationes bestiarum Africanarum meo nomine aut  "
 +"filiorum meorum et nepotum in circo aut in foro aut in amphitheatris  "
 +"populo dedi sexiens et viciens, quibus confecta sunt bestiarum  "
 +"circiter tria millia et quingentae.  "
 +"23 Navalis proeli spectaculum populo dedi trans Tiberim, in quo  "
 +"loco nunc nemus est Caesarum, cavato solo in longitudinem mille et  "
 +"octingentos pedes, in latitudinem mille et ducentos. In quo triginta  "
 +"rostratae naves triremes et biremes, pluris autem minores inter se  "
 +"conflixerunt. In quibus classibus pugnaverunt praeter remiges millia  "
 +"hominum tria circiter.  "
 +"24 In templis omnium civitatium provinciae Asiae victor ornamenta  "
 +"reposui, quae spoliatis templis hostis cum quo bellum gesseram  "
 +"privatim possederat. Statuae meae pedestres et equestres et in  "
 +"quadrigeis argenteae steterunt in urbe XXC circiter, quas ipse sustuli  "
 +"exque ea pecunia dona aurea in aede Apollinis meo nomine et  "
 +"illorum, qui mihi statuarum honorem habuerunt posui.  "
 +"25 Mare pacavi a praedonibus. Eo bello servorum, qui fugerant a  "
 +"dominis suis et arma contra rem publicam ceperant, triginta fere  "
 +"millia capta dominis ad supplicium sumendum tradidi. Iuravit  "
 +"in mea verba tota Italia sponte sua et me bello, quo vici ad Actium,  "
 +"ducem depoposcit. Iuraverunt in eadem verba provinciae Galliae  "
 +"Hispaniae Africa Sicilia Sardinia. Qui tum iuraverunt in eadem verba,  "
 +"fuerunt senatores plures quam DCC, in iis hominies qui postea consules  "
 +"facti sunt ad eum diem quo scripta sunt haec …….., qui praetores, circiter CLXX.  "
 +"26 Omnium provinciarum populi Romani, quibus finitimae fuerunt  "
 +"gentes quae nondum parerent imperio nostro, fines auxi. Gallias  "
 +"et Hispanias provincias ab ea parte, qua eas adluit oceanus, a  "
 +"Gadibus ad ostium Albis fluminis pacavi. Alpes a regione ea,  "
 +"quae proxima est Hadriano mari, ad Tuscum imperio adieci, nulli genti   "
 +"bello per iniuriam inlato. Classi qui praerat meo iussu ab ostio  "
 +"Rheni ad solis orientis regionem usque ad ……………..m navigavit,  "
 +"quo neque terra neque mari quisquam Romanus ante id tempus  "
 +"adit, Cimbrique et Charydes et Semnones et eiusdem tractus alii  "
 +"Germanorum populi per legatos amicitiam meam et populi Romani  "
 +"petierunt. Meo iussu et auspicio ducti sunt duo exercitus eodem  "
 +"fere tempore in Aethiopiam et in Arabiam, quae appellatur eudaemon,  "
 +"plurimaeque hominum gentis utriusque copiae caesae sunt in acie  "
 +"et multi homines capti. In Aethiopiam usque ad oppidum Nabata  "
 +"perventum est, cui proxima est Meroe. In Arabiam usque in fines  "
 +"Sabaeorum processit exercitus ad oppidum Mariba.  "
 +"27 Aegyptum imperio populi Romani adieci. Armeniam  "
 +"maiorem interfecto rege eius Artaxia cum possem facere provinciam,  "
 +"malui maiorum nostrorum exemplo regnum id Tigrani regis Artavasdis  "
 +"filio, nepoti autem Tigranis regis, per Ti. Neronem tradere,  "
 +"qui tum mihi privignus erat. Et eandem gentem postea desciscentem  "
 +"et rebellantem domitam per Gaium filium meum regi Ariobarzani  "
 +"regis Medorum Artabazi filio regendam tradidi, et post eius mortem  "
 +"filio eius Artavasdi. Quo interfecto Tigranem, qui erat ex regio  "
 +"genere Armeniorum oriundus, in id regnum misi. Provincias  "
 +"omnis, quae trans Hadrianum mare vergunt ad orientem Cyrenasque,  "
 +"iam ex parte magna regibus eas possidentibus, et antea Siciliam  "
 +"et Sardiniam occupatas bello servili reciperavi.  "
 +"28 Colonias in Africa Sicilia Macedonia utraque Hispania,  "
 +"Achaia Asia Syria Gallia Narbonensi Pisidia militum deduxi.  "
 +"Italia autem …….. colonias, quae vivo me celeberrimae et  "
 +"frequentissimae fuerunt, duodetriginta a me deductas habet.  "
 +"29 Signa militaria complura per alios duces amissa devictis hostibus  "
 +"reciperavi ex Hispania et Gallia et a Dalmateis. Parthos trium  "
 +"exercitum Romanorum spolia et signa reddere mihi supplicesque  "
 +"amicitiam populi Romani petere coegi. Ea autem signa in penetrali,  "
 +"quod est in templo Martis Ultoris, reposui.  "
 +"30 Pannoniorum gentes, quas ante me principem populi Romani  "
 +"exercitus nunquam adit, devictas per Ti. Neronem, qui tum erat   "
 +"privignus et legatus meus, imperio populi Romani subieci protulique  "
 +"finis Illyrici ad ripam fluminis Danuvii. Quod Dacorum  "
 +"transgressus exercitus meis auspicis profligatus victusque est, et  "
 +"postea trans Danuvium ductus exercitus meus Dacorum gentes  "
 +"imperia populi Romani perferre coegit.  "
 +"31 Ad me ex India regum legationes saepe missae sunt, numquam adhuc visae  "
 +"apud quemquam Romanorum principem. Nostram amicitiam   "
 +"petierunt per legatos Bastarnae Scythaeque et Sarmatarum  "
 +"qui sunt citra fluvium Tanaim et ultra reges, Albanorumque  "
 +"rex et Hiberorum et Medorum.  "
 +"32 Ad me supplices confugerunt reges Parthorum Tiridates et  "
 +"postea Phrates regis Phratis filius; Medorum Artavasdes; Albanorum  "
 +"Artaxares; Britannorum Dumnobellaunus et Tim……..;  "
 +"Sugambrorum Maelo, Marcomanorum Sueborumque complures. Ad  "
 +"me rex Parthorum Phrates Orodis filius filios suos nepotesque omnes  "
 +"misit in Italiam, non bello superatus, sed amicitiam nostram per  "
 +"liberorum suorum pignora petens. Plurimaeque aliae gentes  "
 +"expertae sunt populi R. fidem me principe, quibus antea cum populo  "
 +"Romano nullum intercedebat legationum et amicitiae commercium.  "
 +"33 A me gentes Parthorum et Medorum per legatos principes  "
 +"earum gentium reges petitos acceperunt Parthi Vononem, regis  "
 +"Phratis filium, regis Orodis nepotem; Medi Ariobarzanem, regis  "
 +"Artavazdis filium, regis Ariobarzanis nepotem.  "
 +"34 In consulatu sexto et septimo, postquam bella civilia exstinxeram,  "
 +"per consensum universorum potitus rerum omnium rem  "
 +"publicam ex mea potestate in senatus populique Romani arbitrium  "
 +"transtuli. Quo pro merito meo senatus consulto Augustus  "
 +"appellatus sum et laureis postes aedium mearum vincti sunt publice  "
 +"coronaque civica super ianuam meam fixa est clupeusque aureus in  "
 +"curia Iulia positus, quem mihi senatum populumque Romanum  "
 +"dare virtutis clementiae iustitiae pietatis causa testatum  "
 +"est per eius clupei inscriptionem. Post id tempus praestiti   "
 +"omnibus dignitate, potestatis autem nihilo amplius habui quam  "
 +"qui fuerunt mihi quoque in magistratu conlegae.  "
 +"35 Tertium decimum consulatum cum gerebam, senatus et  "
 +"equester ordo populusque Romanus universus appellavit me patrem  "
 +"patriae idque in vestibulo aedium mearum inscribendum esse et in  "
 +"curia et in foro Augusto sub quadrigis, quae mihi ex s.c. positae  "
 +"sunt, censuit. Cum scripsi haec, annum agebam septuagensimum  "
 +"sextum.  "
 +"1 Summa pecuniae, quam dedit in aerarium vel plebei  "
 +"Romanae vel dimissis militibus denarium sexiens milliens.  "
 +"2 Opera fecit nova aedem Martis, Iovis Tonantis et Feretri, Apollinis,  "
 +"divi Iuli, Quirini, Minervae, Iunonis Reginae, Iovis Libertatis,  "
 +"Larum, deum Penatium, Iuventatis, Matris deum, Lupercal, pulvinar  "
 +"ad circum, curiam cum Chalcidico, forum Augustum, basilicam  "
 +"Iuliam, theatrum Marcelli, ……………. nemus quod est trans  "
 +"Tiberim Caesarum.  "
 +"3 Refecit Capitolium sacrasque aedes numero octoginta duas,  "
 +"theatrum Pompei, aquarum ductus, viam Flaminiam.  "
 +"4 Impensarum in spectacula circensia et munera gladiatorum  "
 +"athletasque et venationes et naumachiam ….. Dona… oppidis  "
 +"colonis in Italia, oppidis in provinciis terrae motu incendioque consumptis aut  "
 +"viritim amicis senatoribusque, quorum census explevit innumerabilia.";

addnewedtext();
document.getElementsByName("ed5editor")[0].value = "P. A. Brunt, J. M. Moore";
document.getElementsByName("ed5name")[0].value = "Res gestae Divi Augusti";
document.getElementsByName("ed5publishingplace")[0].value = "Oxford";
document.getElementsByName("ed5publishingdate")[0].value = "1967";
document.getElementsByName("ed5text")[0].value = "RERUM gestarum divi Augusti, quibus orbem terrarum imperio  "
 +"populi Romani subiecit, et impensarum quas in rem publicam  "
 +"populumque Romanum fecit, incisarum in duabus aheneis pilis,  "
 +"quae sunt Romae positae, exemplar subiectum.  "
 +"1 Annos undeviginti natus exercitum privato consilio et privata  "
 +"impensa comparavi, per quem rem publicam a dominatione factionis  "
 +"oppressam in libertatem vindicavi. 2 Eo nomine senatus  "
 +"decretis honorificis in ordinem suum me adlegit, C. Pansa et A.  "
 +"Hirtio consulibus, consularem locum sententiae dicendae tribuens, et  "
 +"imperium mihi dedit. 3 Res publica ne quid detrimenti caperet,  "
 +"me propraetore simul cum consulibus providere iussit. 4 Populus  "
 +"autem eodem anno me congulem, cum cos. uterque in bello cecidisset,  "
 +"et triumvirum rei publicae constituendae creavit.  "
 +"2 Qui parentem meu  "
 +"m trucidaverunt, eos in exilium expuli  "
 +"iudiciis legitimis ultus eorum facinus, et postea bellum inferentis rei  "
 +"publicae vici bis acie.  "
 +"3 Bella terra et mari civilia externaque toto in orbe terrarum  "
 +"saepe gessi, victorque omnibus veniam petentibus civibus peperci.  "
 +"2 Externas gentes, quibus tuto ignosci potuit, conservare quam  "
 +"excidere malui. 3 Millia civium Romanorum sub sacramento meo  "
 +"fuerunt circiter quingenta. Ex quibus deduxi in colonias aut  "
 +"remisi in municipia sua stipendis emeritis millia aliquanto plura  "
 +"quam trecenta, et iis omnibus agros adsignavi aut pecuniam pro  "
 +"praemiis militiae dedi. 4 Naves cepi sescentas praeter eas, si quae  "
 +"minores quam triremes fuerunt.  "
 +" 4 Bis ovans triumphavi et tris egi curulis triumphos et appellatus  "
 +"sum viciens et semel imperator, decernente pluris triumphos mihi   "
 +"senatu, quibus omnibus supersedi. Laurum de fascibus deposui in  "
 +"Capitolio, votis quae quoque bello nuncupaveram solutis. 2 Ob res  "
 +"a me aut per legatos meos auspicis meis terra marique prospere  "
 +"gestas quinquagiens et quinquiens decrevit senatus supplicandum  "
 +"esse dis immortalibus. Dies autem, per quos ex senatus consulto  "
 +"supplicatum est, fuere DCCCLXXXX. 3 In triumphis meis ducti  "
 +"sunt ante currum meum reges aut regum liberi novem. 4 Consul  "
 +"fueram terdeciens, cum scribebam haec, et eram septimum et  "
 +"tricensimum tribuniciae potestatis.  "
 +"5 Dictaturam et apsenti et praesenti mihi delatam et a populo et a  "
 +"senatu, M. Marcello et L . Arruntio consulibus non recepi. 2 Non  "
 +"sum deprecatus in summa frumenti penuria curationem annonae,  "
 +"quam ita administravi, ut intra dies paucos metu et periclo praesenti  "
 +"civitatem universam liberarem impensa et cura mea. 3 Consulatum  "
 +"quoque tum annuum et perpetuum mihi delatum non recepi.  "
 +"6 Consulibus M. Vinicio et Q. Lucretio et postea P. Lentulo et Cn.  "
 +"Lentulo et tertium Paullo Fabio Maximo et Q. Tuberone senatu  "
 +"populoque Romano consentientibus ut curator legum et morum  "
 +"summa potestate solus crearer, nullum magistratum contra morem  "
 +"maiorum delatum recepi. 2 Quae tum per me geri senatus voluit,  "
 +"per tribuniciam potestatem perfeci, cuius potestatis conlegam et  "
 +"ipse ultro quinquiens a senatu depoposci et accepi.  "
 +"7 Triumvirum rei publicae constituendae fui per continuos annos  "
 +"decem 2 Princeps senatus fui usque ad eum diem quo scripseram  "
 +"haec per annos quadraginta. 3 Pontifex maximus, augur, XV  "
 +"virum sacris faciundis, VII virum epulonum, frater arvalis, sodalis  "
 +"Titius, fetialis fui.  "
 +"8 Patriciorum numerum auxi consul quintum iussu populi et  "
 +"senatus. 2 Senatum ter legi, et in consulatu sexto censum populi  "
 +"conlega M. Agrippa egi. Lustrum post annum alterum et quadra   "
 +"gensimum feci, quo lustro civium Romanorum censa sunt capita  "
 +"quadragiens centum millia et sexaginta tria millia. 3 Tum iterum  "
 +"consulari cum imperio lustrum solus feci C. Censorino et C. Asinio  "
 +"cos., quo lustro censa sunt civium Romanorum capita quadragiens  "
 +"centum millia et ducenta triginta tria millia. 4 Et tertium consulari  "
 +"cum imperio lustrum conlega Tib. Caesare filio meo feci Sex.  "
 +"Pompeio et Sex. Appuleio cos., quo lustro censa sunt civium Romanorum  "
 +"capitum quadragiens centum millia et nongenta triginta et  "
 +"septem millia. 5 Legibus novis me auctore latis multa exempla  "
 +"maiorum exolescentia iam ex nostro saeculo reduxi et ipse multarum  "
 +"rerum exempla imitanda posteris tradidi.  "
 +"9 Vota pro valetudine mea suscipi per consules et sacerdotes quinto  "
 +"quoque anno senatus decrevit. Ex iis votis saepe fecerunt vivo me  "
 +"ludos aliquotiens sacerdotum quattuor amplissima collegia, aliquotiens  "
 +"consules. 2 Privatim etiam et municipatim universi cives  "
 +"unanimiter continenter apud omnia pulvinaria pro valetudine mea  "
 +"supplicaverunt.  "
 +"10 Nomen meum senatus consulto inclusum est in saliare carmen,  "
 +"et sacrosanctus in perpetum ut essem et, quoad viverem, tribunicia  "
 +"potestas mihi esset, per legem sanctum est. 2 Pontifex maximus  "
 +"ne fierem in vivi conlegae mei locum, populo id sacerdotium  "
 +"deferente mihi quod pater meus habuerat, recusavi. Quod sacerdotium  "
 +"aliquod post annos, eo mortuo qui civilis motus occasione  "
 +"occupaverat, cuncta ex Italia ad comitia mea confluente multitudine,  "
 +"quanta Romae nunquam fertur ante id tempus fuisse, recepi, P.  "
 +"Sulpicio C. Valgio consulibus.  "
 +"11 Aram Fortunae Reducis ante aedes Honoris et Virtutis ad  "
 +"portam Capenam pro reditu meo senatus consacravit, in qua  "
 +"pontifices et virgines Vestales anniversarium sacrificium facere  "
 +"iussit eo die quo, consulibus Q. Lucretio et M. Vinicio, in urbem  "
 +"ex Syria redieram, et diem Augustalia ex cognomine nostro appellavit.   "
 +"cum consule Q. Lucretio et principibus viris obviam mihi missa est  "
 +"in Campaniam, qui honos ad hoc tempus nemini praeter me est  "
 +"decretus. 2 Cum ex Hispania Galliaque, rebus in iis provincis  "
 +"prospere gestis, Romam redi, Ti. Nerone P. Quintilio consulibus,  "
 +"aram Pads Augustae senatus pro reditu meo consacrandam censuit  "
 +"ad campum Martium, in qua magistratus et sacerdotes virginesque  "
 +"Vestales anniversarium sacrificium facere iussit.  "
 +"13 Ianum Quirinum, quem claussum esse maiores nostri voluerunt  "
 +"cum per totum imperium populi Romani terra marique esset parta  "
 +"victoriis pax, cum, priusquam nascerer, a condita urbe bis omnino  "
 +"clausum fuisse prodatur memoriae, ter me principe senatus claudendum  "
 +"esse censuit.  "
 +"14 Filios meos, quos iuvenes mihi eripuit fortuna, Gaium et  "
 +"Lucium Caesares honoris mei caussa senatus populusque Romanus  "
 +"annum quintum et decimum agentis consules designavit, ut eum  "
 +"magistratuminirent post quinquennium, et ex eo die quo deducti sunt  "
 +"in forum ut interessent consiliis publicis decrevit senatus. 2 Equites  "
 +"autem Romani universi principem iuventutis utrumque eorum  "
 +"parmis et hastis argenteis donatum appellaverunt.  "
 +"15 Plebei Romanae viritim HS trecenos numeravi ex testamento  "
 +"patris mei et nomine meo HS quadringenos ex bellorum manibiis  "
 +"consul quintum dedi, iterum autem in consulatu decimo ex patrimonio  "
 +"meo HS quadringenos congiari viritim pernumeravi, et  "
 +"consul undecimum duodecim frumentationes frumento privatim  "
 +"coempto emensus sum, et tribunicia potestate duodecimum quadringenos  "
 +"nummos tertium viritim dedi. Quae mea congiaria pervenerunt  "
 +"ad hominum millia numquam minus quinquaginta et  "
 +"ducenta. 2 Tribuniciae potestatis duodevicensimum, consul XII,  "
 +"trecentis et viginti millibus plebis urbanae sexagenos denarios  "
 +"viritim dedi. 3 Et colonis militum meorum consul quintum ex  "
 +"manibiis viritim millia nummum singula dedi; acceperunt id  "
 +"triumphale congiarium in colonis hominum circiter centum et  "
 +"viginti millia. 4 Consul tertium decimum sexagenos denarios   "
 +"plebei quae tum frumentum publicum accipiebat dedi; ea millia  "
 +"hominum paullo plura quam ducenta fuerunt.  "
 +"16 Pecuniam pro agris quos in consulatu meo quarto et postea  "
 +"consulibus M. Crasso et Cn. Lentulo Augure adsignavi militibus  "
 +"solvi municipis; ea summa sestertium circiter sexsiens milliens fuit  "
 +"quam pro Italicis praedis numeravi, et circiter bis milliens et sescentiens  "
 +"quod pro agris provincialibus solvi. Id primus et solus omnium  "
 +"qui deduxerunt colonias militum in Italia aut in provincis ad  "
 +"memoriam aetatis meae feci. 2 Et postea, Ti. Nerone et Cn. Pisone  "
 +"consulibus itemque C. Antistio et D. Laelio cos. et C. Calvisio  "
 +"et L . Pasieno consulibus et L . Lentulo et M. Messalla consulibus et  "
 +"L. Caninio et Q. Fabricio cos., militibus quos emeriteis stipendis in  "
 +"sua municipia deduxi praemia numerato persolvi, quam in rem  "
 +"sestertium quater milliens circiter impendi.  "
 +"17 Quater pecunia mea iuvi aerarium, ita ut sestertium milliens  "
 +"et quingentiens ad eos qui praerant aerario detulerim. 2 Et M.  "
 +"Lepido et L . Arruntio cos. in aerarium militare, quod ex consilio  "
 +"meo constitutum est ex quo praemia darentur militibus qui vicena  "
 +"aut plura stipendia emeruissent, HS milliens et septingentiens ex  "
 +"patrimonio meo detuli.  "
 +"18 Ab eo anno quo Cn. et P. Lentuli consules fuerunt, cum  "
 +"deficerent vectigalia, tum centum millibus hominum tum pluribus  "
 +"multo frumentarios et nummarios tributus ex horreo et patrimonio  "
 +"meo edidi.  "
 +"19 Curiam et continens ei Chalcidicum templumque Apollinis in  "
 +"Palatio cum porticibus, aedem divi Iuli, Lupercal, porticum ad circum  "
 +"Flaminium, quam sum appellari passus ex nomine eius qui  "
 +"priorem eodem in solo fecerat, Octaviam, pulvinar ad circum  "
 +"maximum, (2) aedes in Capitolio Iovis Feretri et Iovis Tonantis,  "
 +"aedem Quirini, aedes Minervae et Iunonis Reginae et Iovis Libertatis  "
 +"in Aventino, aedem Larum in summa sacra via, aedem deum   "
 +"Penatium in Velia, aedem Iuventatis, aedem Matris Magnae in  "
 +"Palatio feci.  "
 +"20 Capitolium et Pompeium theatrum utrumque opus impensa  "
 +"grandi refeci sine ulla inscriptione nominis mei. 2 Rivos aquarum  "
 +"compluribus locis vetustate labentes refeci, et aquam quae Marcia  "
 +"appellatur duplicavi fonte novo in rivum eius inmisso. 3 Forum  "
 +"Iulium et basilicam quae fuit inter aedem Castoris et aedem  "
 +"Saturni, coepta profligataque opera a patre meo, perfeci et eandem  "
 +"basilicam consumptam incendio, ampliato eius solo, sub titulo nominis  "
 +"filiorum meorum incohavi, et, si vivus non perfecissem, perfici  "
 +"ab heredibus meis iussi. 4 Duo et octoginta templa deum in urbe  "
 +"consul sextum ex auctoritate senatus refeci nullo praetermisso quod  "
 +"eo tempore refici debebat. 5 Consul septimum viam Flaminiam ab  "
 +"urbe Ariminum refeci pontesque omnes praeter Mulvium et  "
 +"Minucium.  "
 +"21 In privato solo Martis Ultoris templum forumque Augustum  "
 +"ex manibiis feci. Theatrum ad aedem Apollinis in solo magna ex  "
 +"parte a privatis empto feci, quod sub nomine M. Marcelli generi mei  "
 +"esset. 2 Dona ex manibiis in Capitolio et in aede divi Iuli et in  "
 +"aede Apollinis et in aede Vestae et in templo Martis Ultoris consacravi,  "
 +"quae mihi constiterunt HS circiter milliens. 3 Auri coronari  "
 +"pondo triginta et quinque millia municipiis et colonis Italiae conferentibus  "
 +"ad triumphos meos quintum consul remisi, et postea,  "
 +"quotienscumque imperator appellatus sum, aurum coronarium non  "
 +"accepi decernentibus municipiis et colonis aeque benigne adque  "
 +"antea decreverant.  "
 +"22 Ter munus gladiatorium dedi meo nomine et quinquiens  "
 +"filiorum meorum aut nepotum nomine, quibus muneribus depugnaverunt  "
 +"hominum circiter decem millia. Bis athletarum undique  "
 +"accitorum spectaculum populo praebui meo nomine et tertium  "
 +"nepotis mei nomine. 2 Ludos feci meo nomine quater, aliorum  "
 +"autem magistratuum vicem ter et viciens. Pro conlegio XV virorum  "
 +"magister conlegii collega M. Agrippa ludos saeclares C. Furnio   "
 +"C. Silano cos. feci. Consul XIII ludos Martiales primus feci, quos post  "
 +"id tempus deinceps insequentibus annis s.c. et lege fecerunt consules.  "
 +"3 Venationes bestiarum Africanarum meo nomine aut  "
 +"filiorum meorum et nepotum in circo aut in foro aut in amphitheatris  "
 +"populo dedi sexiens et viciens, quibus confecta sunt bestiarum  "
 +"circiter tria millia et quingentae.  "
 +"23 Navalis proeli spectaclum populo dedi trans Tiberim in quo  "
 +"loco nunc nemus est Caesarum, cavato solo in longitudinem mille et  "
 +"octingentos pedes, in latitudinem mille et ducenti, in quo triginta  "
 +"rostratae naves triremes aut biremes, plures autem minores inter se  "
 +"conflixeruntj quibus in classibus pugnaverunt praeter remiges millia  "
 +"hominum tria circiter.  "
 +"24 In templis omnium civitatium provinciae Asiae victor ornamenta  "
 +"reposui quae spoliatis templis is cum quo bellum gesseram  "
 +"privatim possederat. 2 Statuae meae pedestres et equestres et in  "
 +"quadrigeis argenteae steterunt in urbe XXC circiter, quas ipse sustuli,  "
 +"exque ea pecunia dona aurea in aede Apollinis meo nomine et  "
 +"illorum qui mihi statuarum honorem habuerunt posui.  "
 +"25 Mare pacavi a praedonibus. Eo bello servorum qui fugerant a  "
 +"dominis suis et arma contra rem publicam ceperant triginta fere  "
 +"millia capta dominis ad supplicium sumendum tradidi. 2 Iuravit  "
 +"in mea verba tota Italia sponte sua, et me belli quo vici ad Actium  "
 +"ducem depoposcitj iuraverunt in eadem verba provinciae Galliae,  "
 +"Hispaniae, Africa, Sicilia, Sardinia. 3 Qui sub signis meis tum  "
 +"militaverint fuerunt senatores plures quam DCC, in iis qui vel  "
 +"antea vel postea consules facti sunt ad eum diem quo scripta sunt  "
 +"haec LXXXIII, sacerdotes circiter CLXX.  "
 +"26 Omnium provinciarum populi Romani quibus finitimae fuerunt  "
 +"gentes quae non parerent imperio nostro fines auxi. 2 Gallias  "
 +"et Hispanias provincias, item Germaniam, qua includit Oceanus a  "
 +"Gadibus ad ostium Albis fluminis pacavi. 3 Alpes a regione ea  "
 +"quae proxima est Hadriano mari ad Tuscum pacificavi nulli genti   "
 +"bello per iniuriam inlato. 4 Classis mea per Oceanum ab ostio  "
 +"Rheni ad solis orientis regionem usque ad fines Cimbrorum navigavit,  "
 +"quo neque terra neque mari quisquam Romanus ante id tempus  "
 +"adit, Cimbrique et Charydes et Semnones et eiusdem tractus alii  "
 +"Germanorum populi per legatos amicitiam meam et populi Romani  "
 +"petierunt. 5 Meo iussu et auspicio ducti sunt duo exercitus eodem  "
 +"fere tempore in Aethiopiam et in Arabiam quae appellatur Eudaemon,  "
 +"magnaeque hostium gentis utriusque copiae caesae sunt in acie  "
 +"et complura oppida capta. In Aethiopiam usque ad oppidum Nabata  "
 +"perventum est, cui proxima est Meroe; in Arabiam usque in fines  "
 +"Sabaeorum processit exercitus ad oppidum Mariba.  "
 +"27 Aegyptum imperio populi Romani adieci. 2 Armeniam  "
 +"maiorem interfecto rege eius Artaxe cum possem facere provinciam  "
 +"malui maiorum nostrorum exemplo regnum id Tigrani regis Artavasdis  "
 +"filio, nepoti autem Tigranis regis, per Ti. Neronem tradere,  "
 +"qui tum mihi privignus erat. Et eandem gentem postea desciscentem  "
 +"et rebellantem domitam per Gaium filium meum regi Ariobarzani  "
 +"regis Medorum Artabazi filio regendam tradidi, et post eius mortem  "
 +"filio eius Artavasdi; quo interfecto Tigranem qui erat ex regio  "
 +"genere Armeniorum oriundus in id regnum misi. 3 Provincias  "
 +"omnis quae trans Hadrianum mare vergunt ad orientem Cyrenasque,  "
 +"iam ex parte magna regibus ea possidentibus, et antea Siciliam  "
 +"et Sardinian! occupatas bello servili reciperavi.  "
 +"28 Colonias in Africa, Sicilia, Macedonia, utraque Hispania,  "
 +"Achaia, Asia, Syria, Gallia Narbonensi, Pisidia militum deduxi.  "
 +"2 Italia autem XXVIII colonias quae vivo me celeberrimae et  "
 +"frequentissimae fuerunt mea auctoritate deductas habet.  "
 +"29 Signa militaria complura per alios duces amissa devictis hostibus  "
 +"recepi ex Hispania et Gallia et a Dalmateis. 2 Parthos trium  "
 +"exercitum Romanorum spolia et signa reddere mihi supplicesque  "
 +"amicitiam populi Romani petere coegi. Ea autem signa in penetrali  "
 +"quod est in templo Martis Ultoris reposui.  "
 +"30 Pannoniorum gentes, quas ante me principem populi Romani  "
 +"exercitus nunquam adit, devictas per Ti. Neronem, qui tum erat   "
 +"privignus et legatus meus, imperio populi Romani subieci, protulique  "
 +"fines Illyrici ad ripam fluminis Danui. 2 Citra quod Dacorum  "
 +"transgressus exercitus meis auspicis victus profligatusque est, et  "
 +"postea trans Danuvium ductus exercitus meus Dacorum gentes  "
 +"imperia populi Romani perferre coegit.  "
 +"31 Ad me ex India regum legationes saepe missae sunt non visae  "
 +"ante id tempus apud quemquam Romanorum ducem. 2 Nostram  "
 +"amicitiam appetiverunt per legatos Bastarnae Scythaeque et Sarmatarum  "
 +"qui sunt citra flumen Tanaim et ultra reges, Albanorumque  "
 +"rex et Hiberorum et Medorum.  "
 +"32 Ad me supplices confugerunt reges Parthorum Tiridates et  "
 +"postea Phrates regis Phratis filius, Medorum Artavasdes, Adiabenorum  "
 +"Artaxares, Britannorum Dumnobellaunus et Tincommius,  "
 +"Sugambrorum Maelo, Marcomanorum Sueborum . . . rus. 2 Ad  "
 +"me rex Parthorum Phrates Orodis filius filios suos nepotesque omnes  "
 +"misit in Italiam non bello superatus, sed amicitiam nostram per  "
 +"liberorum suorum pignora petens. 3 Plurimaeque aliae gentes  "
 +"expertae sunt p. R. fidem me principe quibus antea cum populo  "
 +"Romano nullum extiterat legationum et amicitiae commercium.  "
 +"33 A me gentes Parthorum et Medorum per legatos principes  "
 +"earum gentium reges petitos acceperunt: Parthi Vononem, regis  "
 +"Phratis filium, regis Orodis nepotem, Medi Ariobarzanem, regis  "
 +"Artavazdis filium, regis Ariobarzanis nepotem.  "
 +"34 In consulatu sexto et septimo, postquam bella civilia exstinxeram,  "
 +"per consensum universorum potitus rerum omnium, rem  "
 +"publicam ex mea potestate in senatus populique Romani arbitrium  "
 +"transtuli. 2 Quo pro merito meo senatus consulto Augustus  "
 +"appellatus sum et laureis postes aedium mearum vestiti publice  "
 +"coronaque civica super ianuam meam fixa est et clupeus aureus in  "
 +"curia Iulia positus, quem mihi senatum populumque Romanum  "
 +"dare virtutis clementiaeque et iustitiae et pietatis caussa testatum  "
 +"est per eius clupei inscriptionem. 3 Post id tempus auctoritate   "
 +"omnibus praestiti, potestatis autem nihilo amplius habui quam  "
 +"ceteri qui mihi quoque in magistratu conlegae fuerunt.  "
 +"35 Tertium decimum consulatum cum gerebam, senatus et  "
 +"equester ordo populusque Romanus universus appellavit me patrem  "
 +"patriae, idque in vestibulo aedium mearum inscribendum et in  "
 +"curia Iulia et in foro Aug. sub quadrigis quae mihi ex s.c. positae  "
 +"sunt censuit. 2 Cum scripsi haec annum agebam septuagensumum  "
 +"sextum.  "
 +"Appendix  "
 +"1 Summa pecuniae quam dedit vel in aerarium vel plebei  "
 +"Romanae vel dimissis militibus: denarium sexiens milliens.  "
 +"2 Opera fecit nova aedem Martis, Iovis Tonantis et Feretri, Apollinis,  "
 +"divi Iuli, Quirini, Minervae, Iunonis Pveginae, Iovis Libertatis,  "
 +"Larum, deum Penatium, Iuventatis, Matris Magnae, Lupercal, pulvinar  "
 +"ad circum, curiam cum Chalcidico, forum Augustum, basilicam  "
 +"Iuliam, theatrum Marcelli, porticum Octaviam, nemus trans  "
 +"Tiberim Caesarum.  "
 +"3 Refecit Capitolium sacrasque aedes numero octoginta duas,  "
 +"theatrum Pompei, aquarum rivos, viam Flaminiam.  "
 +"4 Impensa praestita in spectacula scaenica et munera gladiatorum  "
 +"atque athletas et venationes et naumachiam et donata pecunia  "
 +"colonis, municipiis, oppidis terrae motu incendioque consumptis aut  "
 +"viritim amicis senatoribusque quorum census explevit innumerabilis.";
submitneweds( false );
}

function loadtestcase2(){
let intomeelem = document.getElementById( "intome" );
intomeelem.style.height = (intomeelem.offsetHeight+10).toString() + "px";

document.getElementsByName("aname")[0].value = "hans im glück";
document.getElementsByName("aemail")[0].value = "hans@schwranz";
document.getElementsByName("edKname")[0].value = "Testcase2brunderlustig";

document.getElementsByName("ed0editor")[0].value = "Gebr. Grimm 1";
document.getElementsByName("ed0name")[0].value = "Bruder Lustig 1819";
document.getElementsByName("ed0publishingplace")[0].value = "Berlin";
document.getElementsByName("ed0publishingdate")[0].value = "1819";
document.getElementsByName("ed0text")[0].value = "Es war einmal ein großer Krieg und als der Krieg zu Ende war, kriegten viele Soldaten ihren Abschied. Nun kriegte der Bruder Lustig auch seinen Abschied und sonst nichts als ein kleines Laibchen Commißbrot und vier Kreuzer an Geld; damit zog er fort. Der heilige Petrus aber hatte sich als ein armer Bettler an den Weg gesetzt, und wie der Bruder Lustig daher kam, bat er ihn um ein Almosen, da sprach dieser: „lieber Bettelmann, was soll ich dir geben? ich bin Soldat gewesen und habe [406] meinen Abschied bekommen und sonst nichts als das kleine Commißbrot und vier Kreuzer Geld, und wenn das all ist, muß ich betteln, so gut wie du. Doch geben will ich dir was.“ Darauf theilte er den Laib in vier Theile und gab davon dem Apostel einen und auch einen Kreuzer. Der heilige Petrus bedankte sich und ging weiter und setzte sich in einer andern Gestalt wieder als Bettelmann dem Soldaten an den Weg, und als er zu ihm kam, bat er ihn, wie das vorigemal, um eine Gabe. Der Bruder Lustig sprach wie vorher und gab ihm wieder ein Viertel von dem Brot und einen Kreuzer. Der heil. Petrus bedankte sich und ging weiter, setzte sich aber zum drittenmal in einer andern Gestalt als ein Bettler an den Weg und sprach den Bruder Lustig[1] an. Der Bruder Lustig gab ihm auch das dritte Viertel Brot und den dritten Kreuzer. Der heil. Petrus bedankte sich und der Bruder Lustig ging weiter und hatte nicht mehr, als ein Viertel Brot und einen Kreuzer. Damit ging er in ein Wirthshaus, aß das Brot und ließ sich für den Kreuzer Bier dazu geben. Als er fertig war, zog er weiter und da ging ihm der heil. Petrus gleichfalls in der Gestalt eines verabschiedeten Soldaten entgegen und redete ihn an: „guten Tag, Cammerad, kannst du mir nicht ein Stück Brot geben und einen Kreuzer zu einem Trunk.“ „ Wo soll ichs hernehmen, antwortete der Bruder Lustig, ich hab meinen Abschied und sonst nichts als einen Laib Commißbrot und vier Kreuzer an Geld bekommen. Drei Bettler sind mir auf der Landstraße begegnet, davon hab ich jedem ein Viertel von meinem Brot und einen Kreuzer Geld gegeben. Das letzte Viertel hab [407] ich im Wirthshaus gegessen und für den letzten Kreuzer dazu getrunken. Jetzt bin ich leer und wenn du auch nichts mehr hast, so können wir mit einander betteln gehen.“ „Nein, das wird just nicht nöthig seyn, antwortete der heil. Petrus, ich verstehe mich ein wenig auf die Doctorei und damit will ich mir schon so viel verdienen, als ich brauche.“ „Ja, sagte der Bruder Lustig, davon verstehe ich nichts, also muß ich allein betteln gehen.“ „Nun, komm nur mit, sprach der heil. Petrus, wenn ich was verdiene, sollst du die Hälfte davon haben.“ „Das ist mir wohl recht,“ sagte der Bruder Lustig.“ Also zogen sie mit einander fort.Nun kamen sie an ein Bauernhaus und hörten darin gewaltig jammern und schreien, da gingen sie hinein, so lag der Mann darin auf den Tod krank und war nah am Verscheiden und die Frau heulte und weinte so laut. „Laßt euer Heulen und Weinen, sprach der heil. Petrus, ich will den Mann wieder gesund machen“ und nahm eine Salbe aus seiner Tasche und heilte den Kranken augenblicklich, so daß er aufstehen konnte und ganz gesund war. Sprachen Mann und Frau in großer Freude; „wie können wir euch lohnen, was sollen wir euch geben?“ Der heil. Petrus aber wollte nichts nehmen und jemehr ihn die Bauersleute gebeten, desto mehr weigerte er sich. Der Bruder Lustig aber stieß den heil. Petrus an und sagte: „so nimm doch, so nimm doch was! wir brauchens ja!“ Endlich brachte die Bäuerin ein Lamm und sprach zu dem heil. Petrus, das müsse er annehmen; aber er wollte es nicht. Da stieß ihn der Bruder Lustig in die Seite [408] und sprach: „nimms doch, dummer Teufel, wir brauchens ja.“ Da sagte der heil. Petrus endlich: „ja, das Lamm will ich nehmen, aber ich trags nicht, wenn dus willst, so mußt du es tragen.“ „Das hat keine Noth, sprach der Bruder Lustig, das will ich schon tragen,“ und nahms auf die Schulter. Nun gingen sie fort und kamen in einen Wald, da war das Lamm dem Bruder Lustig schwer geworden, er aber gar hungrig, also sprach er zu dem heil. Petrus: „schau, da ist ein schöner Platz, da könnten wir das Lamm kochen und verzehren.“ „Mir ists recht, antwortete der heil. Petrus, doch kann ich mit der Kocherei nicht umgehen,“ willst du’s kochen, so hast du da einen Kessel, ich will derweil herumgehen, bis es gahr ist; du mußt aber nicht eher zu essen anfangen, als bis ich wieder da bin; ich will schon zu rechter Zeit kommen.“ „Geh nur, sagte Bruder Lustig, ich versteh mich aufs Kochen, ich wills schon machen.“ Da ging der heil. Petrus fort und der Bruder Lustig schlachtete das Lamm, machte Feuer an, warf das Fleisch in den Kessel und kochte. Das Lamm war aber schon ganz gahr, und der Apostel noch immer nicht zurück, da nahm es der Bruder Lustig aus dem Kessel, zerschnitt es und fand das Herz. Das soll das Beste seyn, sprach er, und versuchte es, zuletzt aber aß er es ganz auf. Endlich kam der heil. Petrus zurück und sprach: „du kannst das ganze Lamm allein essen, ich will nur das Herz davon, das gib mir.“ Da nahm der Bruder Lustig Messer und Gabel, that als suchte er in dem Lamm herum, könnte[2] aber das Herz nicht finden; endlich sagte er kurz weg: „es ist keins da.“ [409] „Nun, wo solls denn seyn?“ sagte der Apostel. „Das weiß ich nicht, antwortete der Bruder Lustig, aber schau, was sind wir alle beide für Narren, suchen das Herz vom Lamm und fällt uns keinem ein, ein Lamm hat ja kein Herz!“ „Ei, sprach der heil. Petrus, das ist was ganz Neues, jedes Thier hat ein Herz, warum sollt ein Lamm kein Herz haben?“ „Nein, gewiß Bruder, ein Lamm hat kein Herz, denk nur recht nach, so wird dirs einfallen, es hat im Ernst keins.“ „Nun, es ist schon gut, sagte der heil. Petrus, ist kein Herz da, so brauch ich auch nichts vom Lamm, du kannsts allein essen.“ „ Was ich halt nicht aufessen kann, das nehm ich mit in meinem Ranzen,“ sprach der Bruder Lustig, aß das halbe Lamm und steckte das übrige in seinen Ranzen. Sie gingen weiter, da machte der heil. Petrus, daß ein großes Wasser queer durch den Weg floß und sie hindurch mußten. Sprach der heil. Petrus: „geh du nur voran.“ „Nein, antwortete der Bruder Lustig, geh du voran, und dachte: wenn dem das Wasser zu tief ist, so bleib ich zurück.“ Da schritt der heil. Petrus hindurch und das Wasser ging ihm nur bis ans Knie; nun wollte Bruder Lustig auch hindurch, aber das Wasser wurde größer und stieg ihm an den Hals. Da rief er: „Bruder, hilf mir!“ Sagte der heil. Petrus: „willst du auch gestehen, daß du das Herz von dem Lamm gegessen hast?“ „Nein, antwortete er, ich hab es nicht gegessen. Da ward das Wasser noch größer und stieg ihm bis an den Mund: „hilf mir, Bruder,“ rief der Soldat. Sprach der heil. Petrus noch einmal: „willst du auch gestehen, daß du das Herz vom Lamm gegessen hast?“ [410] „Nein, antwortete er, ich hab es nicht gegessen.“ Der heilige Petrus wollte ihn doch nicht ertrinken lassen, machte das Wasser kleiner und half ihm hinüber. Nun zogen sie weiter und kamen in ein Reich, da hörten sie, daß die Königstochter todtkrank liege. „Holla, Bruder, sprach der Soldat zum heil. Petrus, da ist ein Fang für uns, wann wir die gesund machen, so ist uns auf ewige Zeiten geholfen.“ Da war ihm der heil. Petrus nicht geschwind genug: „nun, heb die Beine auf, Bruderherz, sprach er zu ihm, daß wir noch zu rechter Zeit hin kommen“ Der heil. Petrus ging aber immer langsamer, wie auch der Bruder Lustig ihn trieb und schob, bis sie endlich hörten, die Königstochter wäre gestorben. „Da haben wirs, sprach der Bruder Lustig, das kommt von deinem schläfrigen Gang.“ „Sey nur still, antwortete der heil. Petrus, ich kann noch mehr, als Kranke gesund machen, ich kann auch Todte wieder ins Leben erwecken.“ „Nun, wenn das ist, sagte der Bruder Lustig, so laß ich mirs gefallen, das halbe Königreich mußt du uns aber zum wenigsten damit verdienen.“ Darauf gingen sie in das königliche Schloß, wo alles in großer Trauer war, der heil. Petrus aber sagte zu dem König, er wollte die Todte wieder lebendig machen. Da ward er zu ihr geführt und dann sprach er: „bringt mir einen Kessel mit Wasser“ und wie er den bekommen hatte, hieß er jedermann hinausgehen, und nur der Bruder Lustig durfte bei ihm bleiben. Darauf schnitt er alle Glieder der Todten los und warf sie ins Wasser und machte Feuer unter den Kessel und ließ sie kochen. Und wie alles Fleisch von [411] den Knochen herabgefallen war, nahm er das schöne, weiße Gebein heraus und legte es auf eine Tafel und reihte und legte es nach seiner natürlichen Ordnung zusammen. Als das geschehen war, trat er davor und sprach dreimal: „im Namen der allerheiligsten Dreifaltigkeit, Todte steh auf!“ Und beim drittenmal erhob sich die Königstochter lebendig, gesund und schön. Nun war der König darüber in großer Freude und sprach zum heil. Petrus: „begehre deinen Lohn, und wenns mein halbes Königreich wäre, so will ich dirs geben.“ Der heil. Petrus aber antwortete: „ich verlange nichts dafür.“ „O, du Hans Narr!“ dachte der Bruder Lustig bei sich, und stieß seinen Cammeraden in die Seite und sprach: „sey doch nicht so dumm, wenn du nichts willst, so brauch ich doch was.“ Der heil. Petrus aber wollte nichts; doch weil der König sah, daß der andere gern was wollte, ließ er ihm vom Schatzmeister seinen Ranzen mit Gold anfüllen. Sie zogen darauf weiter und wie sie in einen Wald kamen, sprach der heil. Petrus zum Bruder Lustig: „jetzt wollen wir das Gold theilen.“ „Ja, antwortete er, das können wir thun.“ Da theilte der heil. Petrus das Gold und theilte es in drei Theile. Dachte der Bruder Lustig: „was er wieder für einen Sparren im Kopf hat! macht drei Theile, und unser sind zwei!“ Der heil. Petrus aber sprach: „nun habe ich genau getheilt, ein Theil für mich, ein Theil für dich und ein Theil für den, der das Herz vom Lamm gegessen hat.“ „O, das hab ich gegessen“ antwortete der Bruder Lustig, und strich geschwind das Gold ein, „das kannst du mir glauben.“ „ Wie kann das wahr seyn, [412] sprach der heil. Petrus, ein Lamm hat ja kein Herz!“ „Ei was, Bruder, wo denkst du hin! Ein Lamm hat ja ein Herz, so gut, wie jedes Thier, warum sollte das allein keines haben?“ „Nun, es ist schon gut, sagte der heil. Petrus, behalt das Gold allein, aber ich bleibe nicht mehr bei dir und will meinen Weg allein gehen.“ „Wie du willst, Bruderherz, antwortete der Soldat, leb wohl!“ Da ging der heil. Petrus eine andere Straße, Bruder Lustig aber dacht: „es ist gut, daß er abtrabt, es ist doch ein wunderlicher Heiliger!“ Nun hatte er zwar Geld genug, wußte aber nicht mit umzugehen, verthat’s, verschenkt’s und wie eine Zeit herum war, hatte er wieder nichts. Da kam er in ein Land, wo er hörte, daß die Königstochter gestorben wäre. „Holla, dachte er, das kann gut werden, die will ich wieder lebendig machen und mirs bezahlen lassen, daß es eine Art hat.“ Ging also zum König und bot ihm an, die Todte wieder zu erwecken. Nun hatte der König gehört, daß ein abgedankter Soldat herumziehe und die Gestorbenen wieder lebendig mache und dachte, der Bruder Lustig wär dieser Mann, doch, weil er kein Vertrauen zu ihm hatte, fragte er erst seine Räthe, die sagten aber, er könnte es wagen, da seine Tochter doch todt wäre. Nun ließ sich der Bruder Lustig Wasser im Kessel bringen, hieß jedermann hinausgehen, schnitt die Glieder ab und warf sie ins Wasser und machte Feuer darunter, gerade wie er beim heil. Petrus gesehen hatte. Das Wasser fing an zu kochen und das Fleisch fiel herab, da nahm er das Gebein heraus und that es auf die Tafel, er wußte aber [413] nicht, in welcher Ordnung es liegen mußte und legte alles verkehrt durch einander. Dann stellte er sich davor und sprach: „im Namen der allerheiligsten Dreifaltigkeit, Todte steh auf!“ und sprachs dreimal, aber die Königstochter rührte sich nicht. Da sprach er es noch dreimal, aber gleichfalls umsonst. „Du, Blitzmädel steh auf, rief er, steh auf, oder es geht dir nicht gut!“ Wie er das gesprochen, kam der heil. Petrus auf einmal in seiner vorigen Gestalt, als verabschiedeter Soldat, durchs Fenster herein gegangen und sprach: „du gottloser Mensch, was treibst du da, wie kann die Todte auferstehen, da du ihr Gebein so unter einander geworfen?“ „Bruderherz, ich habs gemacht so gut ich konnte,“ antwortete er. „Diesmal will ich dir aus der Noth helfen, aber das sag ich dir, wo du noch einmal so etwas unternimmst, so bist du unglücklich, auch darfst du von dem König nicht das Geringste dafür begehren oder annehmen.“ Darauf legte der heil. Petrus die Gebeine in ihre rechte Ordnung, sprach dreimal zu ihr: „im Namen der allerheiligsten Dreifaltigkeit, Todte steh auf!“ und die Königstochter stand auf, war gesund und schön wie vorher. Nun ging der heil. Petrus wieder durchs Fenster hinaus, der Bruder Lustig aber war froh, daß es so gut abgelaufen war, ärgerte sich doch auch, daß er nichts dafür nehmen sollte. „Ich mögte nur wissen, dachte er, was der für Mucken im Kopf hat, was er mit der einen Hand giebt, da nimmt er mit der andern, da ist kein Verstand drin!“ Nun bot der König dem Bruder Lustig an, was er haben wollte, er durfte aber nichts nehmen, doch brachte er es durch Anspielung und Listigkeit dahin, [414] daß ihm der König seinen Ranzen mit Gold füllen ließ, und damit zog er ab. Als er hinaus kam, stand vor dem Thor der heil. Petrus und sprach: „schau, was du für ein Mensch bist, habe ich dir nicht verboten etwas zu nehmen und nun hast du den Ranzen doch voll Gold.“ „ Was kann ich dafür, antwortete Bruder Lustig, wenn mirs hinein gesteckt wird.“ „Das sag ich dir, daß du nicht zum zweitenmal solche Dinge unternimmst, sonst soll es dir schlimm ergehen.“ „Ei, Bruder, sorg doch nicht, jetzt hab ich Gold, was soll ich mich da mit dem Knochenwaschen abgeben.“ Ja, sprach der heil. Petrus, das wird lang dauern, damit du aber hernach nicht wieder auf unerlaubten Wegen gehst, so will ich deinem Ranzen die Kraft geben, daß alles, was du dir hinein wünschest auch darin seyn soll. Leb wohl, du siehst mich nun nicht wieder.“ „Gott befohlen,“ sprach der Bruder Lustig und dachte, ich bin froh, daß du fort gehst, du wunderlicher Kerl, ich will dir wohl nicht nachgehen.“ An die Wunderkraft aber, die er seinem Ranzen verliehen, dachte er nicht weiter. Bruder Lustig zog mit seinem Gold umher und verthats und verfumfeits wie das erstemal. Als er nun nichts mehr als vier Kreuzer hatte, kam er an einem Wirthshaus vorbei und dachte, das Geld muß fort und ließ sich für drei Kreuzer Wein und einen Kreuzer Brot geben. Wie er da saß und trank, kam ihm der Geruch von gebratenen Gänsen in die Nase. Bruder Lustig schaute und guckte und sah, daß der Wirth zwei Gänse in der Ofenröhre stehen hatte. Da fiel ihm ein, daß ihm sein Cammerad gesagt [415] hätte, was er sich in seinen Ranzen wünsche, das solle darin seyn; „holla, das mußt du mit den Gänsen versuchen!“ Also ging er hinaus und vor der Thüre sprach er: „so wünsch ich die zwei gebratenen Gänse aus der Ofenröhre in meinen Ranzen!“ wie er das gesagt, machte er ihn auf und schaute hinein, da lagen sie beide darin. „Ach, so ists recht! sprach er, nun bin ich ein gemachter Kerl!“ ging fort auf eine Wiese und holte den Braten hervor. Wie er so im besten Essen war, kamen zwei Handwerksbursche daher und sahen die eine Gans, die noch nicht angerührt war, mit hungrigen Augen an. Dachte der Bruder Lustig: „mit einer hast du genug“ rief die zwei Bursche herbei und sprach: „da nehmt die Gans und eßt sie auf meine Gesundheit.“ Sie bedankten sich, gingen damit ins Wirtshaus, ließen sich eine Halbe Wein und ein Brot geben, packten die geschenkte Gans aus und fingen an zu essen. Die Wirthin sah zu und sprach zu ihrem Mann: „die zwei essen eine Gans, sieh doch nach, obs nicht eine von unsern aus der Ofenröhre ist.“ Der Wirth lief hin, da war die Ofenröhre leer: „was, ihr Diebsgesindel, auf die Art wollt ihr Gänse essen! gleich bezahlt, oder ich will euch mit grünem Hasselsaft waschen.“ Die zwei sprachen: „wir sind keine Diebe, ein abgedankter Soldat hat uns die Gans draußen auf der Wiese geschenkt.“ „Ihr sollt mir keine Nase drehen, der Soldat ist hier gewesen, aber als ein ehrlicher Kerl zur Thür hinaus gegangen, auf den hab ich Acht gehabt, ihr seyd die Diebe und sollt bezahlen.“ Da sie aber nicht bezahlen konnten, nahm er den Stock und prügelte sie zur Thüre hinaus. [416] Bruder Lustig aber ging seiner Wege und kam an einen Ort, da stand ein prächtiges Schloß und nicht weit davon ein schlechtes Wirthshaus. Er ging hinein und bat um ein Nachtlager, aber der Wirth wies ihn ab und sprach: „es ist kein Platz mehr da, das Haus ist voll vornehmer Gäste.“ „Das nimmt mich Wunder, sprach Bruder Lustig, daß sie zu euch kommen und nicht in das prächtige Schloß gehen.“ „Ja, antwortete der Wirth, es hat was an sich, dort eine Nacht zu liegen, wers noch versucht hat, ist nicht lebendig wieder heraus gekommen.“ „ Wenns andere versucht haben, sagte der Bruder Lustig, will ichs auch versuchen.“ „Das laßt nur bleiben, sprach der Wirth, es geht euch an den Hals.“ „Es wird nicht gleich an den Hals gehen, sagte Bruder Lustig, gebt mir nur die Schlüssel und brav Essen und Trinken mit.“ Nun gab ihm der Wirth die Schlüssel und Essen und Trinken und damit ging der Bruder Lustig in das Schloß, ließ sichs gut schmecken und als er endlich schläfrig wurde, legte er sich auf die Erde, denn es war kein Bett da. Er schlief auch bald ein, in der Nacht aber wurde er von einem großen Lärm aufgeweckt, und wie er sich ermunterte, sah er neun häßliche Teufel in dem Zimmer, die hatten einen Kreis um ihn gemacht und tanzten um ihn herum. Sprach der Bruder Lustig: „nun tanzt, so lang ihr wollt, aber komm mir keiner zu nah.“ Die Teufel aber kamen immer näher und näher und traten ihm mit ihren garstigen Füßen fast ins Gesicht. „Habt Ruh, ihr Teufelsgespenster,“ sprach er; aber sie triebens immer ärger. Da ward der Bruder Lustig bös und rief: „holla, ich will bald Ruh stiften!“ [417] kriegte ein Stuhlbein und schlug mitten hinein. Aber neun Teufel gegen einen Soldaten, war doch zu viel, und wenn er auf den vordern zuschlug, so packten ihn die andern hinten bei den Haaren und rissen ihn erbärmlich. „Ei, ihr Teufelspack, sprach er, jetzt wird mirs zu arg, wartet aber!“ und darauf rief er: „ich wünsch alle neun Teufel in meinen Ranzen hinein.“ Husch! waren alle neun Teufel darin, und nun schnallte er ihn zu und warf ihn in eine Ecke. Da wars auf einmal still, und Bruder Lustig legte sich wieder hin und schlief bis an den hellen Morgen. Nun kamen der Wirth und der Edelmann, dem das Schloß gehörte und wollten sehen, wie es ihm ergangen wäre; als sie ihn gesund und munter erblickten, erstaunten sie und fragten: „haben euch denn die Geister nichts gethan?“ „ Warum nicht gar, antwortete Bruder Lustig, ich hab sie alle neune in meinem Ranzen. Ihr könnt euer Schloß wieder ganz ruhig bewohnen, es wird von nun an keiner mehr darin umgehen.“ Da dankte ihm der Edelmann und beschenkte ihn reichlich, und bat ihn in seinen Diensten zu bleiben, er wollt ihn auf sein Lebtag versorgen. „Nein, antwortete er, ich bin an das Herumwandern gewohnt, ich will weiter ziehen.“ Da ging der Bruder Lustig fort und ging in eine Schmiede und legte den Ranzen, worin die neun Teufel waren, auf den Ambos und bat den Schmied und seine Gesellen zuzuschlagen. Die schlugen mit ihren großen Hämmern aus allen Kräften zu, daß die Teufel ein erbärmliches Gekreisch erhoben. Wie er darnach den Ranzen aufmachte, waren achte todt, einer aber, [418] der in einer Falte gesessen, war noch lebendig, schlüpfte heraus und fuhr wieder in die Hölle. Darauf zog der Bruder Lustig noch lang in der Welt herum und wers wüßte, könnte viel davon erzählen. Endlich aber wurde er alt und dachte an sein Ende, da ging er zu einem Einsiedler, der als ein frommer Mann bekannt war und sprach zu ihm: „ich bin das Wandern müd und will nun trachten in das Himmelreich zu kommen.“ Der Einsiedler antwortete: „es gibt zwei Wege, der eine ist breit und angenehm und führt zur Hölle, der andere ist eng und rauh und führt zum Himmel.“ „Da müßt ich ein Narr seyn, dachte der Bruder Lustig, wenn ich den engen und rauhen Weg gehen sollte.“ Machte sich auf und ging den breiten und angenehmen und kam endlich zu einem großen, schwarzen Thor und das war das Thor der Hölle. Bruder Lustig klopfte an, und der Thorwächter guckte, wer da wär; wie er aber den Bruder Lustig sah erschrak er, denn er war gerade der neunte Teufel, der mit in dem Ranzen gesteckt hatte und mit einem blauen Auge davon gekommen war. Darum schob er den Riegel geschwind wieder vor und lief zum Obersten der Teufel und sprach: „draußen ist ein Kerl mit einem Ranzen und will herein, aber laßt ihn bei Leibe nicht herein, er wünscht sonst die ganze Hölle in seinen Ranzen. Er hat mich einmal garstig darin hämmern lassen.“ Also ward dem Bruder Lustig hinausgerufen: er sollt wieder abgehen, er käm nicht herein. „Wenn sie mich da nicht wollen, dachte er, will ich sehen, ob im Himmel ein Unterkommens ist, irgendwo muß ich doch bleiben.“ Kehrte also um und [419] zog weiter, bis er vor das Himmelsthor kam, wo er auch anklopfte. Der heil. Petrus saß gerade dabei und mußte es hüten, und der Bruder Lustig erkannte ihn und dachte: „hier findest du Bekanntschaft, da wirds besser gehen.“ Aber der heil. Petrus sprach; „ich glaube gar, du willst in den Himmel?“ „Ei, Bruder, laß mich doch ein, ich muß doch wo einkehren, hätten sie mich in der Hölle aufgenommen, so wär ich nicht hierher gegangen.“ „Nein, sagte der heil. Petrus, du kommst nicht herein.“ „Nun, willst du mich nicht einlassen, so nimm auch deinen Ranzen wieder, so will ich gar nichts von dir haben,“ sprach der Bruder Liederlich. „So gieb ihn her,“ sagte der heil. Petrus. Da reichte er ihn durchs Gitter in den Himmel hinein und der heil. Petrus nahm ihn und hing ihn neben seinen Sessel auf. Da sprach der Bruder Lustig: „nun wünsch ich mich selbst in meinen Ranzen hinein.“ Husch, war er darin und saß nun im Himmel und der heil. Petrus mußte ihn darin lassen.";

addnewedtext();
document.getElementsByName("ed1editor")[0].value = "Gebr. Grimm 2";
document.getElementsByName("ed1name")[0].value = "Bruder Lustig 1840";
document.getElementsByName("ed1publishingplace")[0].value = "Göttingen";
document.getElementsByName("ed1publishingdate")[0].value = "1840";
document.getElementsByName("ed1text")[0].value = "Es war einmal ein großer Krieg, und als der Krieg zu Ende war, bekamen viele Soldaten ihren Abschied. Nun bekam der Bruder Lustig auch seinen Abschied und sonst nichts als ein kleines Laibchen Commißbrot und vier Kreuzer an Geld; damit zog er fort. Der heilige Petrus aber hatte sich als ein armer Bettler an den Weg gesetzt, und wie der Bruder Lustig daher kam, bat er ihn um ein Almosen, da sprach dieser „lieber Bettelmann, was soll ich dir geben? ich bin Soldat gewesen, und habe meinen Abschied bekommen, und habe sonst nichts als das kleine Commißbrot und vier Kreuzer Geld, und wenn das all ist, muß ich betteln, so gut wie du. Doch geben will ich dir was.“ Darauf theilte er den Laib in vier Theile, und gab davon dem Apostel einen und auch einen Kreuzer. Der heilige Petrus bedankte sich, und gieng weiter, und setzte sich in einer andern Gestalt wieder als Bettelmann dem Soldaten an den Weg, und als er zu ihm kam, bat er ihn, wie das vorigemal, um eine Gabe. Der Bruder Lustig sprach wie vorher, und gab ihm wieder ein Viertel von dem Brot, und einen Kreuzer. Der heil. Petrus bedankte sich, und gieng weiter, setzte sich aber zum drittenmal in einer [478] andern Gestalt als ein Bettler an den Weg, und sprach den Bruder Lustig an. Der Bruder Lustig gab ihm auch das dritte Viertel Brot und den dritten Kreuzer. Der heil. Petrus bedankte sich, und der Bruder Lustig gieng weiter, und hatte nicht mehr als ein Viertel Brot und einen Kreuzer. Damit gieng er in ein Wirthshaus, aß das Brot, und ließ sich für den Kreuzer Bier dazu geben. Als er fertig war, zog er weiter, und da gieng ihm der heil. Petrus gleichfalls in der Gestalt eines verabschiedeten Soldaten entgegen, und redete ihn an, „guten Tag, Cammerad, kannst du mir nicht ein Stück Brot geben, und einen Kreuzer zu einem Trunk?“ „Wo soll ichs hernehmen,“ antwortete der Bruder Lustig, „ich habe meinen Abschied und sonst nichts als einen Laib Commißbrot und vier Kreuzer an Geld bekommen. Drei Bettler sind mir auf der Landstraße begegnet, davon hab ich jedem ein Viertel von meinem Brot und einen Kreuzer Geld gegeben. Das letzte Viertel hab ich im Wirthshaus gegessen, und für den letzten Kreuzer dazu getrunken. Jetzt bin ich leer, und wenn du auch nichts mehr hast, so können wir mit einander betteln gehen.“ „Nein, das wird just nicht nöthig sein,“ antwortete der heil. Petrus, „ich verstehe mich ein wenig auf die Doctorei, und damit will ich mir schon so viel verdienen als ich brauche.“ „Ja,“ sagte der Bruder Lustig, „davon verstehe ich nichts, also muß ich allein betteln gehen.“ „Nun, komm nur mit,“ sprach der heil. Petrus, „wenn ich was verdiene, sollst du die Hälfte davon haben.“ „Das ist mir wohl recht“ sagte der Bruder Lustig. Also zogen sie mit einander fort. [479] Nun kamen sie an ein Bauernhaus, und hörten darin gewaltig jammern und schreien, da giengen sie hinein, so lag der Mann darin auf den Tod krank, und war nah am Verscheiden, und die Frau heulte und weinte so laut. „Laßt euer Heulen und Weinen,“ sprach der heil. Petrus, „ich will den Mann wieder gesund machen,“ und nahm eine Salbe aus der Tasche, und heilte den Kranken augenblicklich, so daß er aufstehen konnte, und ganz gesund war. Sprachen Mann und Frau in großer Freude „wie können wir euch lohnen? was sollen wir euch geben?“ Der heil. Petrus aber wollte nichts nehmen; und jemehr ihn die Bauersleute baten, desto mehr weigerte er sich. Der Bruder Lustig aber stieß den heil. Petrus an, und sagte „so nimm doch was, wir brauchens ja.“ Endlich brachte die Bäuerin ein Lamm, und sprach zu dem heil. Petrus das müßte er annehmen; aber er wollte es nicht. Da stieß ihn der Bruder Lustig in die Seite, und sprach „nimms doch, dummer Teufel, wir brauchens ja.“ Da sagte der heil. Petrus endlich „ja, das Lamm will ich nehmen, aber ich trags nicht; wenn dus willst, so mußt du es tragen.“ „Das hat keine Noth,“ sprach der Bruder Lustig, „das will ich schon tragen,“ und nahms auf die Schulter. Nun giengen sie fort, und kamen in einen Wald, da war das Lamm dem Bruder Lustig schwer geworden, er aber war hungrig; also sprach er zu dem heil. Petrus „schau, da ist ein schöner Platz, da könnten wir das Lamm kochen und verzehren.“ „Mir ists recht,“ antwortete der heil. Petrus, „doch kann ich mit der Kocherei nicht umgehen; willst du kochen, so hast du da einen Kessel, ich will [480] derweil herumgehen, bis es gahr ist; du mußt aber nicht eher zu essen anfangen, als bis ich wieder zurück bin; ich will schon zu rechter Zeit kommen.“ „Geh nur,“ sagte Bruder Lustig, „ich verstehe mich aufs Kochen, ich wills schon machen.“ Da gieng der heil. Petrus fort, und der Bruder Lustig schlachtete das Lamm, machte Feuer an, warf das Fleisch in den Kessel, und kochte. Das Lamm war aber schon gahr, und der Apostel noch immer nicht zurück, da nahm es der Bruder Lustig aus dem Kessel, zerschnitt es, und fand das Herz. „Das soll das Beste sein,“ sprach er, und versuchte es, zuletzt aber aß er es ganz auf. Endlich kam der heil. Petrus zurück, und sprach „du kannst das ganze Lamm allein essen, ich will nur das Herz davon, das gib mir.“ Da nahm Bruder Lustig Messer und Gabel, that als suchte er eifrig in dem Lammfleisch herum, könnte aber das Herz nicht finden; endlich sagte er kurz weg „es ist keins da.“ „Nun, wo solls denn sein?“ sagte der Apostel. „Das weiß ich nicht,“ antwortete der Bruder Lustig, „aber schau, was sind wir alle beide für Narren, suchen das Herz vom Lamm, und fällt keinem von uns ein, ein Lamm hat ja kein Herz.“ „Ei,“ sprach der heil. Petrus, „das ist was ganz Neues, jedes Thier hat ja ein Herz, warum sollt ein Lamm kein Herz haben?“ „Nein, gewißlich, Bruder, ein Lamm hat kein Herz, denk nur recht nach, so wird dirs einfallen, es hat im Ernst keins.“ „Nun, es ist schon gut,“ sagte der heil. Petrus, „ist kein Herz da, so brauch ich auch nichts vom Lamm, du kannsts allein essen.“ „Was ich halt nicht aufessen kann, das nehm ich mit in meinem Ranzen“ sprach der Bruder [481] Lustig, aß das halbe Lamm, und steckte das übrige in seinen Ranzen. Sie giengen weiter, da machte der heil. Petrus daß ein großes Wasser queer über den Weg floß, und sie hindurch mußten. Sprach der heil. Petrus „geh du nur voran.“ „Nein,“ antwortete der Bruder Lustig, „geh du voran,“ und dachte „wenn dem das Wasser zu tief ist, so bleib ich zurück.“ Da schritt der heil. Petrus hindurch, und das Wasser gieng ihm nur bis ans Knie; nun wollte Bruder Lustig auch hindurch, aber das Wasser wurde größer, und stieg ihm an den Hals. Da rief er „Bruder, hilf mir.“ Sagte der heil. Petrus „willst du auch gestehen daß du das Herz von dem Lamm gegessen hast?“ „Nein,“ antwortete er, „ich hab es nicht gegessen.“ Da ward das Wasser noch größer, und stieg ihm bis an den Mund: „hilf mir, Bruder,“ rief der Soldat. Sprach der heil. Pertus noch einmal „willst du auch gestehen daß du das Herz vom Lamm gegessen hast?“ „Nein,“ antwortete er, „ich hab es nicht gegessen.“ Der heil. Petrus wollte ihn doch nicht ertrinken lassen, ließ das Wasser wieder fallen, und half ihm hinüber. Nun zogen sie weiter, und kamen in ein Reich, da hörten sie daß die Königstochter todtkrank liege. „Holla, Bruder,“ sprach der Soldat zum heil. Petrus, „da ist ein Fang für uns, wenn wir die gesund machen, so ist uns auf ewige Zeiten geholfen.“ Da war ihm der heil. Petrus nicht geschwind genug: „nun, heb die Beine auf, Bruderherz, sprach er zu ihm, daß wir noch zu rechter Zeit hin kommen.“ Der heil. Petrus gieng aber immer [482] langsamer, wie auch der Bruder Lustig ihn trieb und schob, bis sie endlich hörten die Königstochter wäre gestorben. „Da haben wirs,“ sprach der Bruder Lustig, „das kommt von deinem schläfrigen Gang.“ „Sei nur still,“ antwortete der heil. Petrus, „ich kann noch mehr als Kranke gesund machen, ich kann auch Todte wieder ins Leben erwecken.“ „Nun, wenn das ist,“ sagte der Bruder Lustig, „so laß ich mirs gefallen, das halbe Königreich mußt du uns aber zum wenigsten damit verdienen.“ Darauf giengen sie in das königliche Schloß, wo alles in großer Trauer war; der heil. Petrus aber sagte zu dem König er wollte die Tochter wieder lebendig machen. Da ward er zu ihr geführt, und dann sprach er „bringt mir einen Kessel mit Wasser,“ und wie er den bekommen hatte, hieß er jedermann hinausgehen, und nur der Bruder Lustig durfte bei ihm bleiben. Darauf schnitt er alle Glieder der Todten los, und warf sie ins Wasser, und machte Feuer unter den Kessel, und ließ sie kochen. Und wie alles Fleisch von den Knochen herabgefallen war, nahm er das schöne weiße Gebein heraus, und legte es auf eine Tafel, und reihte und legte es nach seiner natürlichen Ordnung zusammen. Als das geschehen war, trat er davor und sprach dreimal „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf.“ Und beim drittenmal erhob sich die Königstochter lebendig, gesund und schön. Nun war der König darüber in großer Freude, und sprach zum heil. Petrus „begehre deinen Lohn, und wenns mein halbes Königreich wäre, so will ich dirs geben.“ Der heil. Petrus aber antwortete „ich verlange nichts dafür.“ „O, du Hans [483] Narr!“ dachte der Bruder Lustig bei sich, und stieß seinen Cameraden in die Seite, und sprach, „sei doch nicht so dumm, wenn du nichts willst, so brauch ich doch was.“ Der heil. Petrus aber wollte nichts; doch weil der König sah daß der andere gerne was wollte, ließ er ihm vom Schatzmeister seinen Ranzen mit Gold anfüllen. Sie zogen darauf weiter, und wie sie in einen Wald kamen, sprach der heil. Petrus zum Bruder Lustig „jetzt wollen wir das Gold theilen.“ „Ja,“ antwortete er, „das wollen wir thun.“ Da theilte der heil. Petrus das Gold, und theilte es in drei Theile. Dachte der Bruder Lustig „was er wieder für einen Sparren im Kopf hat! macht drei Theile, und unser sind zwei!“ Der heil. Petrus aber sprach „nun habe ich genau getheilt, ein Theil für mich, ein Theil für dich, und ein Theil für den, der das Herz vom Lamm gegessen hat.“ „O, das hab ich gegessen,“ antwortete der Bruder Lustig, und strich geschwind das Gold ein, „das kannst du mir glauben.“ „Wie kann das wahr sein,“ sprach der heil. Petrus, „ein Lamm hat ja kein Herz.“ „Ei was, Bruder, wo denkst du hin! ein Lamm hat ja ein Herz, so gut wie jedes Thier, warum sollte das allein keins haben?“ „Nun, es ist schon gut,“ sagte der heil. Petrus, „behalt das Gold allein, aber ich bleibe nicht mehr bei dir, und will meinen Weg allein gehen.“ „Wie du willst, Bruderherz,“ antwortete der Soldat, „leb wohl.“ Da gieng der heil. Petrus eine andere Straße, Bruder Lustig aber dachte „es ist gut, daß er abtrabt, es ist doch ein wunderlicher Heiliger.“ Nun hatte er zwar Geld genug, wußte [484] aber nicht mit umzugehen, verthats, verschenkts, und wie eine Zeit herum war, hatte er wieder nichts. Da kam er in ein Land, wo er hörte daß die Königstochter gestorben wäre. „Holla,“ dachte er, „das kann gut werden, die will ich wieder lebendig machen, und mirs bezahlen lassen, daß es eine Art hat.“ Gieng also zum König, und bot ihm an die Todte wieder zu erwecken. Nun hatte der König gehört daß ein abgedankter Soldat herumziehe, und die Gestorbenen wieder lebendig mache, und dachte der Bruder Lustig wäre dieser Mann, doch, weil er kein Vertrauen zu ihm hatte, fragte er erst seine Räthe, die sagten aber er könnte es wagen, da seine Tochter doch todt wäre. Nun ließ sich der Bruder Lustig Wasser im Kessel bringen, hieß jedermann hinausgehen, schnitt die Glieder ab, und warf sie ins Wasser und machte Feuer darunter, gerade wie er es beim heil. Petrus gesehen hatte. Das Wasser fieng an zu kochen, und das Fleisch fiel herab, da nahm er das Gebein heraus, und that es auf die Tafel, er wußte aber nicht in welcher Ordnung es liegen mußte, und legte alles verkehrt durch einander. Dann stellte er sich davor und sprach „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf,“ und sprachs dreimal, aber die Königstochter rührte sich nicht. Da sprach er es noch dreimal, aber gleichfalls umsonst. „Du Blitzmädel, steh auf,“ rief er, „steh auf, oder es geht dir nicht gut.“ Wie er das gesprochen, kam der heil. Petrus auf einmal in seiner vorigen Gestalt, als verabschiedeter Soldat, durchs Fenster herein gegangen, und sprach „du gottloser Mensch, was treibst du da, wie kann die Todte [485] auferstehen, da du ihr Gebein so unter einander geworfen hast?“ „Bruderherz, ich habs gemacht so gut ich konnte“ antwortete er. „Diesmal will ich dir aus der Noth helfen, aber das sag ich dir, wo du noch einmal so etwas unternimmst, so bist du unglücklich, auch darfst du von dem König nicht das Geringste dafür begehren oder annehmen.“ Darauf legte der heil. Petrus die Gebeine in ihre rechte Ordnung, sprach dreimal zu ihr „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf,“ und die Königstochter stand auf, war gesund und schön wie vorher. Nun gieng der heil. Petrus wieder durchs Fenster hinaus; der Bruder Lustig war froh daß es so gut abgelaufen war, ärgerte sich aber doch daß er nichts dafür nehmen sollte. „Ich möchte nur wissen,“ dachte er, „was der für Mucken im Kopf hat, denn was er mit der einen Hand gibt, das nimmt er mit der andern, da ist kein Verstand drin.“ Nun bot der König dem Bruder Lustig an was er haben wollte, er durfte aber nichts nehmen, doch brachte er es durch Anspielung und Listigkeit dahin, daß ihm der König seinen Ranzen mit Gold füllen ließ, und damit zog er ab. Als er hinaus kam, stand vor dem Thor der heil. Petrus, und sprach „schau, was du für ein Mensch bist, habe ich dir nicht verboten etwas zu nehmen, und nun hast du den Ranzen doch voll Gold.“ „Was kann ich dafür,“ antwortete Bruder Lustig, „wenn mirs hinein gesteckt wird.“ „Das sag ich dir, daß du nicht zum zweitenmal solche Dinge unternimmst, sonst soll es dir schlimm ergehen.“ „Ei, Bruder, sorg doch nicht, jetzt hab ich Gold, was soll ich mich da mit dem Knochenwaschen abgeben.“ „Ja,“ sprach [486] der heil. Petrus, „das wird lang dauern, damit du aber hernach nicht wieder auf unerlaubten Wegen gehst, so will ich deinem Ranzen die Kraft geben, daß alles, was du dir hinein wünschest, auch darin sein soll. Leb wohl, du siehst mich nun nicht wieder.“ „Gott befohlen,“ sprach der Bruder Lustig, und dachte „ich bin froh, daß du fortgehst, du wunderlicher Kerl, ich will dir wohl nicht nachgehen.“ An die Wunderkraft aber, die er seinem Ranzen verliehen, dachte er nicht weiter. Bruder Lustig zog mit seinem Gold umher, und verthats und verfumfeits wie das erstemal. Als er nun nichts mehr als vier Kreuzer hatte, kam er an einem Wirthshaus vorbei, und dachte „das Geld muß fort,“ und ließ sich für drei Kreuzer Wein und einen Kreuzer Brot geben. Wie er da saß und trank, kam ihm der Geruch von gebratenen Gänsen in die Nase. Bruder Lustig schaute und guckte, und sah daß der Wirth zwei Gänse in der Ofenröhre stehen hatte. Da fiel ihm ein daß ihm sein Camerad gesagt hatte was er sich in seinen Ranzen wünschte, das sollte darin sein. „Holla, das mußt du mit den Gänsen versuchen.“ Also gieng er hinaus, und vor der Thüre sprach er „so wünsch ich die zwei gebratenen Gänse aus der Ofenröhre in meinen Ranzen.“ Wie er das gesagt hatte, machte er ihn auf, und schaute hinein, da lagen sie beide darin. „Ach, so ists recht,“ sprach er, „nun bin ich ein gemachter Kerl,“ gieng fort auf eine Wiese, und holte den Braten hervor. Wie er so im besten Essen war, kamen zwei Handwerksbursche daher, und sahen die eine Gans, die noch nicht angerührt war, mit hungrigen Augen an. Dachte [487] der Bruder Lustig „mit einer hast du genug,“ rief die zwei Bursche herbei, und sprach „da nehmt die Gans, und verzehrt sie auf meine Gesundheit.“ Sie bedankten sich, giengen damit ins Wirthshaus, ließen sich eine Halbe Wein und ein Brot geben, packten die geschenkte Gans aus, und fiengen an zu essen. Die Wirthin sah zu, und sprach zu ihrem Mann „die zwei essen eine Gans, sieh doch nach obs nicht eine von unsern aus der Ofenröhre ist.“ Der Wirth lief hin, da war die Ofenröhre leer: „was, ihr Diebsgesindel, auf die Art wollt ihr Gänse essen! gleich bezahlt, oder ich will euch mit grünem Hasselsaft waschen.“ Die zwei sprachen „wir sind keine Diebe, ein abgedankter Soldat hat uns die Gans draußen auf der Wiese geschenkt.“ „Ihr sollt mir keine Nase drehen, der Soldat ist hier gewesen, aber als ein ehrlicher Kerl zur Thür hinaus gegangen, auf den hab ich Acht gehabt: ihr seid die Diebe, und sollt bezahlen.“ Da sie aber nicht bezahlen konnten, nahm er den Stock, und prügelte sie zur Thüre hinaus. Bruder Lustig aber gieng seiner Wege, und kam an einen Ort, da stand ein prächtiges Schloß und nicht weit davon ein schlechtes Wirthshaus. Er gieng in das Wirthshaus, und bat um ein Nachtlager, aber der Wirth wies ihn ab, und sprach „es ist kein Platz mehr da, das Haus ist voll vornehmer Gäste.“ „Das nimmt mich Wunder,“ sprach der Bruder Lustig, „daß sie zu euch kommen, und nicht in das prächtige Schloß gehen.“ „Ja,“ antwortete der Wirth, „es hat was an sich, dort eine Nacht zu liegen, wers noch versucht hat, ist nicht lebendig wieder heraus [488] gekommen.“ „Wenns andere versucht haben,“ sagte der Bruder Lustig, „will ichs auch versuchen.“ „Das laßt nur bleiben,“ sprach der Wirth, „es geht euch an den Hals.“ „Es wird nicht gleich an den Hals gehen,“ sagte der Bruder Lustig, „gebt mir nur die Schlüssel und brav Essen und Trinken mit.“ Nun gab ihm der Wirth die Schlüssel und Essen und Trinken, und damit gieng der Bruder Lustig ins Schloß, ließ sichs gut schmecken, und als er endlich schläfrig wurde, legte er sich auf die Erde, denn es war kein Bett da. Er schlief auch bald ein, in der Nacht aber wurde er von einem großen Lärm aufgeweckt, und wie er sich ermunterte, sah er neun häßliche Teufel in dem Zimmer, die hatten einen Kreis um ihn gemacht, und tanzten um ihn herum. Sprach der Bruder Lustig, „nun tanzt, so lang ihr wollt, aber komm mir keiner zu nah.“ Die Teufel aber kamen immer näher und näher, und traten ihm mit ihren garstigen Füßen fast ins Gesicht. „Habt Ruh, ihr Teufelsgespenster“ sprach er, aber sie triebens immer ärger. Da ward der Bruder Lustig bös, und rief „holla, ich will bald Ruhe stiften!“ kriegte ein Stuhlbein, und schlug mitten hinein. Aber neun Teufel gegen einen Soldaten war doch zu viel, und wenn er auf den vordern zuschlug, so packten ihn die andern hinten bei den Haaren, und rissen ihn erbärmlich. „Ei, ihr Teufelspack,“ sprach er, „jetzt wird mirs zu arg, wartet aber!“ und darauf rief er „ich wünsche alle neun Teufel in meinen Ranzen hinein.“ Husch, waren alle neun Teufel darin, und nun schnallte er ihn zu, und warf ihn in eine Ecke. Da wars auf einmal still, und Bruder Lustig legte sich [489] wieder hin, und schlief bis an den hellen Morgen. Nun kamen der Wirth und der Edelmann, dem das Schloß gehörte, und wollten sehen wie es ihm ergangen wäre; als sie ihn gesund und munter erblickten, erstaunten sie, und fragten „haben euch denn die Geister nichts gethan?“ „Warum nicht gar,“ antwortete Bruder Lustig, „ich habe sie alle neune in meinen Ranzen. Ihr könnt euer Schloß wieder ganz ruhig bewohnen, es wird von nun an keiner mehr darin umgehen.“ Da dankte ihm der Edelmann, und beschenkte ihn reichlich, und bat ihn in seinen Diensten zu bleiben, er wollte ihn auf sein Lebtag versorgen. „Nein,“ antwortete er, „ich bin an das herumwandern gewöhnt, ich will weiter ziehen.“ Da gieng der Bruder Lustig fort, und gieng in eine Schmiede, und legte den Ranzen, worin die neun Teufel waren, auf den Ambos, und bat den Schmied und seine Gesellen zuzuschlagen. Die schlugen mit ihren großen Hämmern aus allen Kräften zu, daß die Teufel ein erbärmliches Gekreisch erhoben. Wie er danach den Ranzen aufmachte, waren achte todt, einer aber, der in einer Falte gesessen hatte, war noch lebendig, schlüpfte heraus, und fuhr wieder in die Hölle. Darauf zog der Bruder Lustig noch lang in der Welt herum, und wers wüßte könnte viel davon erzählen. Endlich aber wurde er alt, und dachte an sein Ende, da gieng er zu einem Einsiedler, der als ein frommer Mann bekannt war, und sprach zu ihm „ich bin das Wandern müde, und will nun trachten in das Himmelreich zu kommen.“ Der Einsiedler antwortete „es gibt zwei Wege, der eine ist breit und angenehm, und führt zur [490] Hölle, der andere ist eng und rauh, und führt zum Himmel.“ „Da müßt ich ein Narr sein,“ dachte der Bruder Lustig, „wenn ich den engen und rauhen Weg gehen sollte.“ Machte sich auf, und gieng den breiten und angenehmen Weg, und kam endlich zu einem großen schwarzen Thor, und das war das Thor zur Hölle. Bruder Lustig klopfte an, und der Thorwächter guckte wer da wäre. Wie er aber den Bruder Lustig sah, erschrack er, denn er war gerade der neunte Teufel, der mit in dem Ranzen gesteckt hatte, und mit einem blauen Auge davon gekommen war. Darum schob er den Riegel geschwind wieder vor, und lief zum Obersten der Teufel, und sprach „draußen ist ein Kerl mit einem Ranzen, und will herein, aber laßt ihn bei Leibe nicht herein, er wünscht sonst die ganze Hölle in seinen Ranzen. Er hat mich einmal garstig darin hämmern lassen.“ Also ward dem Bruder Lustig hinaus gerufen er sollte wieder abgehen, er käme nicht herein. „Wenn sie mich da nicht wollen,“ dachte er, „will ich sehen ob im Himmel ein Unterkommen ist, irgendwo muß ich doch bleiben.“ Kehrte also um, und zog weiter, bis er vor das Himmelsthor kam, wo er auch anklopfte. Der heil. Petrus saß gerade dabei, und mußte es hüten; der Bruder Lustig erkannte ihn, und dachte „hier findest du Bekanntschaft, da wirds besser gehen.“ Aber der heil. Petrus sprach „ich glaube gar, du willst in den Himmel?“ „Laß mich doch ein, Bruder, ich muß doch wo einkehren; hätten sie mich in der Hölle aufgenommen, so wär ich nicht hierher gegangen.“ „Nein,“ sagte der heil. Petrus, „du kommst nicht herein.“ „Nun, willst du mich nicht einlassen, so [491] nimm auch deinen Ranzen wieder, dann will ich gar nichts von dir haben,“ sprach der Bruder Liederlich. „So gib ihn her“ sagte der heil. Petrus. Da reichte er ihn durchs Gitter in den Himmel hinein, und der heil. Petrus nahm ihn, und hing ihn neben seinen Sessel auf. Da sprach der Bruder Lustig „nun wünsch ich mich selbst in meinen Ranzen hinein.“ Husch, war er darin, und saß nun im Himmel, und der heil. Petrus mußte ihn darin lassen.";

addnewedtext();
document.getElementsByName("ed2editor")[0].value = "Gebr. Grimm 3";
document.getElementsByName("ed2name")[0].value = "Bunder Lustig 1857";
document.getElementsByName("ed2publishingplace")[0].value = "Göttingen";
document.getElementsByName("ed2publishingdate")[0].value = "1857";
document.getElementsByName("ed2text")[0].value = "Es war einmal ein großer Krieg, und als der Krieg zu Ende war, bekamen viele Soldaten ihren Abschied. Nun bekam der Bruder Lustig auch seinen Abschied und sonst nichts als ein kleines Laibchen Commißbrot und vier Kreuzer an Geld; damit zog er fort. Der heilige Petrus aber hatte sich als ein armer Bettler an den Weg gesetzt, und wie der Bruder Lustig daher kam, bat er ihn um ein Almosen. Er antwortete „lieber Bettelmann, was soll ich dir geben? ich bin Soldat gewesen und habe meinen Abschied bekommen, und habe sonst nichts als das kleine Commißbrot und vier Kreuzer Geld, wenn das all ist, muß ich betteln, so gut wie du. Doch geben will ich dir was.“ Darauf theilte er den Laib in vier Theile, und gab davon dem Apostel einen und auch einen Kreuzer. Der heilige Petrus bedankte sich, gieng weiter und setzte sich in einer andern Gestalt wieder als Bettelmann dem Soldaten an den Weg, und als er zu ihm kam, bat er ihn, wie das vorigemal, um eine Gabe. Der Bruder Lustig sprach wie vorher und gab ihm wieder ein Viertel von dem Brot und einen Kreuzer. Der heil. Petrus bedankte sich und gieng weiter, setzte sich aber zum drittenmal in einer andern Gestalt als ein Bettler an den Weg und sprach den Bruder Lustig an. Der Bruder Lustig gab ihm auch das dritte Viertel Brot und den dritten Kreuzer. Der heil. Petrus bedankte sich, und der Bruder Lustig gieng weiter und hatte nicht mehr als ein Viertel Brot und einen Kreuzer. Damit gieng er in ein Wirthshaus, aß das Brot und ließ sich für den Kreuzer [403] Bier dazu geben. Als er fertig war, zog er weiter, und da gieng ihm der heil. Petrus gleichfalls in der Gestalt eines verabschiedeten Soldaten entgegen und redete ihn an, „guten Tag, Camerad, kannst du mir nicht ein Stück Brot geben und einen Kreuzer zu einem Trunk?“ „Wo soll ichs hernehmen,“ antwortete der Bruder Lustig, „ich habe meinen Abschied und sonst nichts als einen Laib Commißbrot und vier Kreuzer an Geld bekommen. Drei Bettler sind mir auf der Landstraße begegnet, davon hab ich jedem ein Viertel von meinem Brot und einen Kreuzer Geld gegeben. Das letzte Viertel hab ich im Wirthshaus gegessen und für den letzten Kreuzer dazu getrunken. Jetzt bin ich leer, und wenn du auch nichts mehr hast, so können wir mit einander betteln gehen.“ „Nein,“ antwortete der heil. Petrus, „das wird just nicht nöthig sein: ich verstehe mich ein wenig auf die Doctorei, und damit will ich mir schon so viel verdienen als ich brauche.“ „Ja,“ sagte der Bruder Lustig, „davon verstehe ich nichts, also muß ich allein betteln gehen.“ „Nun komm nur mit,“ sprach der heil. Petrus, „wenn ich was verdiene, sollst du die Hälfte davon haben.“ „Das ist mir wohl recht“ sagte der Bruder Lustig. Also zogen sie mit einander fort. Nun kamen sie an ein Bauernhaus und hörten darin gewaltig jammern und schreien, da giengen sie hinein, so lag der Mann darin auf den Tod krank und war nah am Verscheiden, und die Frau heulte und weinte ganz laut. „Laßt euer Heulen und Weinen,“ sprach der heil. Petrus, „ich will den Mann wieder gesund machen,“ nahm eine Salbe aus der Tasche und heilte den Kranken augenblicklich, so daß er aufstehen konnte, und ganz gesund war. Sprachen Mann und Frau in großer Freude „wie können wir euch lohnen? was sollen wir euch geben?“ Der heil. Petrus aber wollte nichts nehmen, und jemehr ihn die Bauersleute baten, desto mehr weigerte er sich. Der Bruder Lustig aber stieß den heil. [404] Petrus an, und sagte „so nimm doch was, wir brauchens ja.“ Endlich brachte die Bäuerin ein Lamm und sprach zu dem heil. Petrus das müßte er annehmen, aber er wollte es nicht. Da stieß ihn der Bruder Lustig in die Seite und sprach „nimms doch, dummer Teufel, wir brauchens ja.“ Da sagte der heil. Petrus endlich „ja, das Lamm will ich nehmen, aber ich trags nicht: wenn dus willst, so mußt du es tragen.“ „Das hat keine Noth,“ sprach der Bruder Lustig, „das will ich schon tragen,“ und nahms auf die Schulter. Nun giengen sie fort und kamen in einen Wald, da war das Lamm dem Bruder Lustig[1] schwer geworden, er aber war hungrig, also sprach er zu dem heil. Petrus „schau, da ist ein schöner Platz, da könnten wir das Lamm kochen und verzehren.“ „Mir ists recht,“ antwortete der heil. Petrus, „doch kann ich mit der Kocherei nicht umgehen: willst du kochen, so hast du da einen Kessel, ich will derweil auf und ab gehen, bis es gahr ist. Du mußt aber nicht eher zu essen anfangen, als bis ich wieder zurück bin; ich will schon zu rechter Zeit kommen.“ „Geh nur,“ sagte Bruder Lustig, „ich verstehe mich aufs Kochen, ich wills schon machen.“ Da gieng der heil. Petrus fort, und der Bruder Lustig schlachtete das Lamm, machte Feuer an, warf das Fleisch in den Kessel und kochte. Das Lamm war aber schon gahr und der Apostel noch immer nicht zurück, da nahm es der Bruder Lustig aus dem Kessel, zerschnitt es und fand das Herz. „Das soll das Beste sein,“ sprach er und versuchte es, zuletzt aber aß er es ganz auf. Endlich kam der heil. Petrus zurück und sprach „du kannst das ganze Lamm allein essen, ich will nur das Herz davon, das gib mir.“ Da nahm Bruder Lustig Messer und Gabel, that als suchte er eifrig in dem Lammfleisch herum, konnte aber das Herz nicht finden; endlich sagte er kurz weg „es ist keins da.“ „Nun, wo solls denn sein?“ sagte der Apostel. „Das weiß ich nicht,“ antwortete der Bruder Lustig, „aber schau, was sind wir alle beide für Narren, [405] suchen das Herz vom Lamm und fällt keinem von uns ein, ein Lamm hat ja kein Herz!“ „Ei,“ sprach der heil. Petrus, „das ist was ganz Neues, jedes Thier hat ja ein Herz, warum sollt ein Lamm kein Herz haben?“ „Nein, gewißlich, Bruder, ein Lamm hat kein Herz, denk nur recht nach, so wird dirs einfallen, es hat im Ernst keins.“ „Nun, es ist schon gut,“ sagte der heil. Petrus, „ist kein Herz da, so brauch ich auch nichts vom Lamm, du kannsts allein essen.“ „Was ich halt nicht aufessen kann, das nehm ich mit in meinem Ranzen“ sprach der Bruder Lustig, aß das halbe Lamm und steckte das übrige in seinen Ranzen. Sie giengen weiter, da machte der heil. Petrus daß ein großes Wasser queer über den Weg floß und sie hindurch mußten. Sprach der heil. Petrus „geh du nur voran.“ „Nein,“ antwortete der Bruder Lustig, „geh du voran,“ und dachte „wenn dem das Wasser zu tief ist, so bleib ich zurück.“ Da schritt der heil. Petrus hindurch, und das Wasser gieng ihm nur bis ans Knie. Nun wollte Bruder Lustig auch hindurch, aber das Wasser wurde größer und stieg ihm an den Hals. Da rief er „Bruder, hilf mir.“ Sagte der heil. Petrus „willst du auch gestehen daß du das Herz von dem Lamm gegessen hast?“ „Nein,“ antwortete er, „ich hab es nicht gegessen.“ Da ward das Wasser noch größer, und stieg ihm bis an den Mund: „hilf mir, Bruder,“ rief der Soldat. Sprach der heil. Petrus noch einmal „willst du auch gestehen daß du das Herz vom Lamm gegessen hast?“ „Nein,“ antwortete er, „ich hab es nicht gegessen.“ Der heil. Petrus wollte ihn doch nicht ertrinken lassen, ließ das Wasser wieder fallen und half ihm hinüber. Nun zogen sie weiter, und kamen in ein Reich, da hörten sie daß die Königstochter todtkrank läge. „Holla, Bruder,“ sprach der Soldat zum heil. Petrus, „da ist ein Fang für uns, wenn wir die gesund machen, so ist uns auf ewige Zeiten geholfen.“ Da [406] war ihm der heil. Petrus nicht geschwind genug, „nun, heb die Beine auf, Bruderherz,“ sprach er zu ihm, „daß wir noch zu rechter Zeit hin kommen.“ Der heil. Petrus gieng aber immer langsamer, wie auch der Bruder Lustig ihn trieb und schob, bis sie endlich hörten die Königstochter wäre gestorben. „Da haben wirs,“ sprach der Bruder Lustig, „das kommt von deinem schläfrigen Gang.“ „Sei nur still,“ antwortete der heil. Petrus, „ich kann noch mehr als Kranke gesund machen, ich kann auch Todte wieder ins Leben erwecken.“ „Nun, wenn das ist,“ sagte der Bruder Lustig, „so laß ich mirs gefallen, das halbe Königreich mußt du uns aber zum wenigsten damit verdienen.“ Darauf giengen sie in das königliche Schloß, wo alles in großer Trauer war: der heil. Petrus aber sagte zu dem König er wollte die Tochter wieder lebendig machen. Da ward er zu ihr geführt, und dann sprach er „bringt mir einen Kessel mit Wasser,“ und wie der gebracht war, hieß er jedermann hinausgehen, und nur der Bruder Lustig durfte bei ihm bleiben. Darauf schnitt er alle Glieder der Todten los und warf sie ins Wasser, machte Feuer unter den Kessel und ließ sie kochen. Und wie alles Fleisch von den Knochen herabgefallen war, nahm er das schöne weiße Gebein heraus, und legte es auf eine Tafel, und reihte und legte es nach seiner natürlichen Ordnung zusammen. Als das geschehen war, trat er davor und sprach dreimal „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf.“ Und beim drittenmal erhob sich die Königstochter lebendig, gesund und schön. Nun war der König darüber in großer Freude, und sprach zum heil. Petrus „begehre deinen Lohn, und wenns mein halbes Königreich wäre, so will ich dirs geben.“ Der heil. Petrus aber antwortete „ich verlange nichts dafür.“ „O, du Hans Narr!“ dachte der Bruder Lustig bei sich, stieß seinen Cameraden in die Seite und sprach „sei doch nicht so dumm, wenn du nichts willst, so brauch ich doch was.“ Der heil. Petrus aber wollte nichts; doch [407] weil der König sah daß der andere gerne was wollte, ließ er ihm vom Schatzmeister seinen Ranzen mit Gold anfüllen. Sie zogen darauf weiter und wie sie in einen Wald kamen, sprach der heil. Petrus zum Bruder Lustig „jetzt wollen wir das Gold theilen.“ „Ja,“ antwortete er, „das wollen wir thun.“ Da theilte der heil. Petrus das Gold, und theilte es in drei Theile. Dachte der Bruder Lustig „was er wieder für einen Sparren im Kopf hat! macht drei Theile, und unser sind zwei.“ Der heil. Petrus aber sprach „nun habe ich genau getheilt, ein Theil für mich, ein Theil für dich, und ein Theil für den, der das Herz vom Lamm gegessen hat.“ „O, das hab ich gegessen,“ antwortete der Bruder Lustig und strich geschwind das Gold ein, „das kannst du mir glauben.“ „Wie kann das wahr sein,“ sprach der heil. Petrus, „ein Lamm hat ja kein Herz.“ „Ei was, Bruder, wo denkst du hin! ein Lamm hat ja ein Herz, so gut wie jedes Thier, warum sollte das allein keins haben?“ „Nun, es ist schon gut,“ sagte der heil. Petrus, „behalt das Gold allein, aber ich bleibe nicht mehr bei dir und will meinen Weg allein gehen.“ „Wie du willst, Bruderherz,“ antwortete der Soldat, „leb wohl.“ Da gieng der heil. Petrus eine andere Straße, Bruder Lustig aber dachte „es ist gut, daß er abtrabt, es ist doch ein wunderlicher Heiliger.“ Nun hatte er zwar Geld genug, wußte aber nicht mit umzugehen, verthats, verschenkts, und wie eine Zeit herum war, hatte er wieder nichts. Da kam er in ein Land, wo er hörte daß die Königstochter gestorben wäre. „Holla,“ dachte er, „das kann gut werden, die will ich wieder lebendig machen, und mirs bezahlen lassen, daß es eine Art hat.“ Gieng also zum König und bot ihm an die Todte wieder zu erwecken. Nun hatte der König gehört daß ein abgedankter Soldat herumziehe, und die Gestorbenen wieder lebendig mache, und dachte der Bruder Lustig wäre dieser Mann, doch, weil er kein Vertrauen zu ihm hatte, fragte [408] er erst seine Räthe, die sagten aber er könnte es wagen, da seine Tochter doch todt wäre. Nun ließ sich der Bruder Lustig Wasser im Kessel bringen, hieß jedermann hinausgehen, schnitt die Glieder ab, warf sie ins Wasser und machte Feuer darunter, gerade wie er es beim heil. Petrus gesehen hatte. Das Wasser fieng an zu kochen, und das Fleisch fiel herab, da nahm er das Gebein heraus und that es auf die Tafel; er wußte aber nicht in welcher Ordnung es liegen mußte, und legte alles verkehrt durch einander. Dann stellte er sich davor, und sprach „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf,“ und sprachs dreimal, aber die Gebeine rührten sich nicht. Da sprach er es noch dreimal, aber gleichfalls umsonst. „Du Blitzmädel, steh auf,“ rief er, „steh auf, oder es geht dir nicht gut.“ Wie er das gesprochen, kam der heil. Petrus auf einmal in seiner vorigen Gestalt, als verabschiedeter Soldat, durchs Fenster herein gegangen und sprach „du gottloser Mensch, was treibst du da, wie kann die Todte auferstehen, da du ihr Gebein so unter einander geworfen hast?“ „Bruderherz, ich habs gemacht, so gut ich konnte“ antwortete er. „Diesmal will ich dir aus der Noth helfen, aber das sag ich dir, wo du noch einmal so etwas unternimmst, so bist du unglücklich, auch darfst du von dem König nicht das Geringste dafür begehren oder annehmen.“ Darauf legte der heil. Petrus die Gebeine in ihre rechte Ordnung, sprach dreimal zu ihr „im Namen der allerheiligsten Dreifaltigkeit, Todte, steh auf,“ und die Königstochter stand auf, war gesund und schön wie vorher. Nun gieng der heil. Petrus wieder durchs Fenster hinaus: der Bruder Lustig war froh daß es so gut abgelaufen war, ärgerte sich aber doch daß er nichts dafür nehmen sollte. „Ich möchte nur wissen,“ dachte er, „was der für Mucken im Kopf hat, denn was er mit der einen Hand gibt, das nimmt er mit der andern: da ist kein Verstand drin.“ Nun bot der König dem Bruder Lustig an was er haben wollte, er [409] durfte aber nichts nehmen, doch brachte er es durch Anspielung und Listigkeit dahin, daß ihm der König seinen Ranzen mit Gold füllen ließ, und damit zog er ab. Als er hinaus kam, stand vor dem Thor der heil. Petrus, und sprach „schau, was du für ein Mensch bist, habe ich dir nicht verboten etwas zu nehmen, und nun hast du den Ranzen doch voll Gold.“ „Was kann ich dafür,“ antwortete Bruder Lustig, „wenn mirs hinein gesteckt wird.“ „Das sag ich dir, daß du nicht zum zweitenmal solche Dinge unternimmst, sonst soll es dir schlimm ergehen.“ „Ei, Bruder, sorg doch nicht, jetzt hab ich Gold, was soll ich mich da mit dem Knochenwaschen abgeben.“ „Ja,“ sprach der heil. Petrus, „das Gold wird lang dauern! Damit du aber hernach nicht wieder auf unerlaubten Wegen gehst, so will ich deinem Ranzen die Kraft geben, daß alles, was du dir hinein wünschest, auch darin sein soll. Leb wohl, du siehst mich nun nicht wieder.“ „Gott befohlen,“ sprach der Bruder Lustig, und dachte „ich bin froh daß du fortgehst, du wunderlicher Kauz, ich will dir wohl nicht nachgehen.“ An die Wunderkraft aber, die seinem Ranzen verliehen war, dachte er nicht weiter. Bruder Lustig zog mit seinem Gold umher, und verthats und verfumfeits wie das erstemal. Als er nun nichts mehr als vier Kreuzer hatte, kam er an einem Wirthshaus vorbei und dachte „das Geld muß fort,“ und ließ sich für drei Kreuzer Wein und einen Kreuzer Brot geben. Wie er da saß und trank, kam ihm der Geruch von gebratenen Gänsen in die Nase. Bruder Lustig schaute und guckte, und sah daß der Wirth zwei Gänse in der Ofenröhre stehen hatte. Da fiel ihm ein daß ihm sein Camerad gesagt hatte was er sich in seinen Ranzen wünschte, das sollte darin sein. „Holla, das mußt du mit den Gänsen versuchen!“ Also gieng er hinaus, und vor der Thüre sprach er „so wünsch ich die zwei gebratenen Gänse aus der Ofenröhre in meinen Ranzen.“ [410] Wie er das gesagt hatte, schnallte er ihn auf, und schaute hinein, da lagen sie beide darin. „Ach, so ists recht,“ sprach er, „nun bin ich ein gemachter Kerl,“ gieng fort auf eine Wiese und holte den Braten hervor. Wie er so im besten Essen war, kamen zwei Handwerksbursche daher und sahen die eine Gans, die noch nicht angerührt war, mit hungrigen Augen an. Dachte der Bruder Lustig „mit einer hast du genug,“ rief die zwei Bursche herbei und sprach „da nehmt die Gans und verzehrt sie auf meine Gesundheit.“ Sie bedankten sich, giengen damit ins Wirthshaus, ließen sich eine Halbe Wein und ein Brot geben, packten die geschenkte Gans aus und fiengen an zu essen. Die Wirthin sah zu und sprach zu ihrem Mann „die zwei essen eine Gans, sieh doch nach obs nicht eine von unsern aus der Ofenröhre ist.“ Der Wirth lief hin, da war die Ofenröhre leer: „was, ihr Diebsgesindel, so wohlfeil wollt ihr Gänse essen! gleich bezahlt, oder ich will euch mit grünem Haselsaft waschen.“ Die zwei sprachen „wir sind keine Diebe, ein abgedankter Soldat hat uns die Gans draußen auf der Wiese geschenkt.“ „Ihr sollt mir keine Nase drehen, der Soldat ist hier gewesen, aber als ein ehrlicher Kerl zur Thür hinaus gegangen, auf den hab ich Acht gehabt: ihr seid die Diebe und sollt bezahlen.“ Da sie aber nicht bezahlen konnten, nahm er den Stock und prügelte sie zur Thüre hinaus. Bruder Lustig gieng seiner Wege und kam an einen Ort, da stand ein prächtiges Schloß und nicht weit davon ein schlechtes Wirthshaus. Er gieng in das Wirthshaus und bat um ein Nachtlager, aber der Wirth wies ihn ab, und sprach „es ist kein Platz mehr da, das Haus ist voll vornehmer Gäste.“ „Das nimmt mich Wunder,“ sprach der Bruder Lustig, „daß sie zu euch kommen und nicht in das prächtige Schloß gehen.“ „Ja,“ antwortete der Wirth, „es hat was an sich, dort eine Nacht zu liegen, wers noch versucht hat, ist nicht lebendig wieder heraus gekommen.“ „Wenns andere [411] versucht haben,“ sagte der Bruder Lustig, „will ichs auch versuchen.“ „Das laßt nur bleiben,“ sprach der Wirth, „es geht euch an den Hals.“ „Es wird nicht gleich an den Hals gehen,“ sagte der Bruder Lustig, „gebt mir nur die Schlüssel und brav Essen und Trinken mit.“ Nun gab ihm der Wirth die Schlüssel und Essen und Trinken, und damit gieng der Bruder Lustig ins Schloß, ließ sichs gut schmecken, und als er endlich schläfrig wurde, legte er sich auf die Erde, denn es war kein Bett da. Er schlief auch bald ein, in der Nacht aber wurde er von einem großen Lärm aufgeweckt, und wie er sich ermunterte, sah er neun häßliche Teufel in dem Zimmer, die hatten einen Kreiß um ihn gemacht und tanzten um ihn herum. Sprach der Bruder Lustig „nun tanzt, so lang ihr wollt, aber komm mir keiner zu nah.“ Die Teufel aber drangen immer näher auf ihn ein und traten ihm mit ihren garstigen Füßen fast ins Gesicht. „Habt Ruh, ihr Teufelsgespenster,“ sprach er, aber sie triebens immer ärger. Da ward der Bruder Lustig bös und rief „holla, ich will bald Ruhe stiften!“ kriegte ein Stuhlbein und schlug mitten hinein. Aber neun Teufel gegen einen Soldaten war doch zu viel, und wenn er auf den vordern zuschlug, so packten ihn die andern hinten bei den Haaren und rissen ihn erbärmlich. „Teufelspack,“ rief er, „jetzt wird mirs zu arg: wartet aber! Alle neune in meinen Ranzen hinein!“ husch, steckten sie darin, und nun schnallte er ihn zu und warf ihn in eine Ecke. Da wars auf einmal still, und Bruder Lustig legte sich wieder hin und schlief bis an den hellen Morgen. Nun kamen der Wirth und der Edelmann, dem das Schloß gehörte, und wollten sehen wie es ihm ergangen wäre; als sie ihn gesund und munter erblickten, erstaunten sie und fragten „haben euch denn die Geister nichts gethan?“ „Warum nicht gar,“ antwortete Bruder Lustig, „ich habe sie alle neune in meinem Ranzen. Ihr könnt euer Schloß wieder ganz ruhig bewohnen, es wird von nun an [412] keiner mehr darin umgehen!“ Da dankte ihm der Edelmann, beschenkte ihn reichlich und bat ihn in seinen Diensten zu bleiben, er wollte ihn auf sein Lebtag versorgen. „Nein,“ antwortete er, „ich bin an das Herumwandern gewöhnt, ich will weiter ziehen.“ Da gieng der Bruder Lustig fort, trat in eine Schmiede und legte den Ranzen, worin die neun Teufel waren, auf den Ambos, und bat den Schmied und seine Gesellen zuzuschlagen. Die schlugen mit ihren großen Hämmern aus allen Kräften zu, daß die Teufel ein erbärmliches Gekreisch erhoben. Wie er danach den Ranzen aufmachte, waren achte todt, einer aber, der in einer Falte gesessen hatte, war noch lebendig, schlüpfte heraus und fuhr wieder in die Hölle. Darauf zog der Bruder Lustig noch lange in der Welt herum, und wers wüßte, könnte viel davon erzählen. Endlich aber wurde er alt, und dachte an sein Ende, da gieng er zu einem Einsiedler, der als ein frommer Mann bekannt war und sprach zu ihm „ich bin das Wandern müde und will nun trachten in das Himmelreich zu kommen.“ Der Einsiedler antwortete „es gibt zwei Wege, der eine ist breit und angenehm, und führt zur Hölle, der andere ist eng und rauh, und führt zum Himmel.“ „Da müßt ich ein Narr sein,“ dachte der Bruder Lustig, „wenn ich den engen und rauhen Weg gehen sollte.“ Machte sich auf und gieng den breiten und angenehmen Weg, und kam endlich zu einem großen schwarzen Thor, und das war das Thor der Hölle. Bruder Lustig klopfte an, und der Thorwächter guckte wer da wäre. Wie er aber den Bruder Lustig sah, erschrack er, denn er war gerade der neunte Teufel, der mit in dem Ranzen gesteckt hatte und mit einem blauen Auge davon gekommen war. Darum schob er den Riegel geschwind wieder vor, lief zum Obersten der Teufel, und sprach „draußen ist ein Kerl mit einem Ranzen und will herein, aber laßt ihn bei Leibe nicht herein, er wünscht sonst die ganze Hölle [413] in seinen Ranzen. Er hat mich einmal garstig darin hämmern lassen.“ Also ward dem Bruder Lustig hinaus gerufen er sollte wieder abgehen, er käme nicht herein. „Wenn sie mich da nicht wollen,“ dachte er, „will ich sehen ob ich im Himmel ein Unterkommen finde, irgendwo muß ich doch bleiben.“ Kehrte also um und zog weiter, bis er vor das Himmelsthor kam, wo er auch anklopfte. Der heil. Petrus saß gerade dabei als Thorwächter: der Bruder Lustig erkannte ihn gleich und dachte „hier findest du einen alten Freund, da wirds besser gehen.“ Aber der heil. Petrus sprach „ich glaube gar, du willst in den Himmel?“ „Laß mich doch ein, Bruder, ich muß doch wo einkehren; hätten sie mich in der Hölle aufgenommen, so wär ich nicht hierher gegangen.“ „Nein,“ sagte der heil. Petrus, „du kommst nicht herein.“ „Nun, willst du mich nicht einlassen, so nimm auch deinen Ranzen wieder: dann will ich gar nichts von dir haben,“ sprach der Bruder Lustig. „So gib ihn her’ sagte der heil. Petrus. Da reichte er den Ranzen durchs Gitter in den Himmel hinein, und der heil. Petrus nahm ihn und hieng ihn neben seinen Sessel auf. Da sprach der Bruder Lustig „nun wünsch ich mich selbst in meinen Ranzen hinein.“ Husch, war er darin, und saß nun im Himmel, und der heil. Petrus mußte ihn darin lassen.";
submitneweds( false );
}

function loadtestcase1(){
let intomeelem = document.getElementById( "intome" );
intomeelem.style.height = (intomeelem.offsetHeight+10).toString() + "px";

document.getElementsByName("aname")[0].value = "hans im glück";
document.getElementsByName("aemail")[0].value = "hans@schwranz";
document.getElementsByName("edKname")[0].value = "Testcase1anaximander";





document.getElementsByName("ed0editor")[0].value = "Asulanus Franciscus (Hrsg.)";
document.getElementsByName("ed0name")[0].value = "In Aristotelis Physicorum libros commentaria Simplicii Commentarii in octo Aristotelis physicae auscultationis libros cum ipso Aristotelis textu";
document.getElementsByName("ed0publishingplace")[0].value = "Venetiis";
document.getElementsByName("ed0publishingdate")[0].value = "1526";
document.getElementsByName("ed0text")[0].value = " τῶν δὲ ἓν καὶ κινούμενον καὶ ἄπειρον λεγόντων ἀναξίμανδρος μὲν πραξιάδου μιλήσιος θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ τίσιν καὶ δίκην τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος, οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλὰ τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, ἀλλ’ ἀποκρινομένων τῶν ἐναντίων διὰ τῆς ἀϊδίου κινήσεως· διὸ καὶ τοῖς περὶ ἀναξαγόραν τοῦτον ὁ ἀριςτοτέλης συνέταξεν.";
addnewedtext();
document.getElementsByName("ed1editor")[0].value = "H. Ritter; L. Preller";
document.getElementsByName("ed1name")[0].value = "Historia Philosophiae Graecae";
document.getElementsByName("ed1publishingplace")[0].value = "Gotha";
document.getElementsByName("ed1publishingdate")[0].value = "1934";
document.getElementsByName("ed1text")[0].value = "ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλά τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, διὰ τῆς ἀϊδίου κινήσεως ἀλλ’ ἀποκρινομένων τῶν ἐναντίων · διὸ καὶ τοῖς περὶ Ἀναξαγόραν τοῦτον ὁ Ἀριστοτέλης συνέταξεν.";
addnewedtext();
document.getElementsByName("ed2editor")[0].value = "Georg Woehrle (Hrsg.)";
document.getElementsByName("ed2name")[0].value = "Die Milesier Anaximander und Anaximenes";
document.getElementsByName("ed2publishingplace")[0].value = "Berlin, Boston";
document.getElementsByName("ed2publishingdate")[0].value = "2012";
document.getElementsByName("ed2text")[0].value = "τῶν δὲ ἓν καὶ κινούμενον καὶ ἄπειρον λεγόντων Ἀναξίμανδρος μὲν Πραξιάδου Μιλήσιος Θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλά τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, ἀλλ’ ἀποκρινομένων τῶν ἐναντίων διὰ τῆς ἀιδίου κινήσεως· διὸ καὶ τοῖς περὶ Ἀναξαγόραν τοῦτον ὁ Ἀριστοτέλης συνέταξεν. Ἀναξιμένης δὲ Εὐρυστράτου Μιλήσιος, ἑταῖρος γεγονὼς Ἀναξιμάνδρου, μίαν μὲν καὶ αὐτὸς τὴν ὑποκειμένην φύσιν καὶ ἄπειρόν φυσιν ὥσπερ ἐκεῖνος, οὐκ ἀόριστον δὲ ὥσπερ ἐκεῖνος, ἀλλὰ ὡρισμένην, ἀέρα λέγων αὐτήν· διαφέρειν δὲ μανότητι καὶ πυκνότητι κατὰ τὰς οὐσίας. καὶ ἀραιούμενον μὲν πῦρ γίνεσθαι, πυκνούμενον δὲ ἄνεμον, εἶτα νέφος, ἔτι δὲ μᾶλλον ὕδωρ, εἶτα γῦν, εἶτα λίθους, τὰ δὲ ἄλλα ἐκ τούτων. κίνησιν δὲ καὶ οὗτος ἀίδιον ποιεῖ, δι’ἣν καὶ τὴν μεταβολὴν γίνεσθαι.";
addnewedtext();
document.getElementsByName("ed3editor")[0].value = "William W. Fortenbaugh, Pamela M. Huby,  Robert W. Sharples, Dimitri Gutas";
document.getElementsByName("ed3name")[0].value = "Theophrastus of Eresus Sources for his life Writings Thought and Influence";
document.getElementsByName("ed3publishingplace")[0].value = "Leiden, New York, Köln";
document.getElementsByName("ed3publishingdate")[0].value = "1992";
document.getElementsByName("ed3text")[0].value = "τῶν δὲ ἓν καὶ κινούμενον καὶ ἄπειρον λεγόντων Ἀναξίμανδρος μὲν Πραξιάδου Μιλήσιος Θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλά τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, ἀλλ’ ἀποκρινομένων τῶν ἐναντίων διὰ τῆς ἀιδίου κινή- σεως· διὸ καὶ τοῖς περὶ Ἀναξαγόραν τοῦτον ὁ Ἀριστοτέλης συνέταξεν.";
addnewedtext();
document.getElementsByName("ed4editor")[0].value = "Geoffrey S. Kirk, John E. Raven, Malcolm Kirk Schofield";
document.getElementsByName("ed4name")[0].value = "Die vorsokratischen Philosophen Einfuehrung Texte und Kommentare";
document.getElementsByName("ed4publishingplace")[0].value = "Stuttgart, Weimar";
document.getElementsByName("ed4publishingdate")[0].value = "2001";
document.getElementsByName("ed4text")[0].value = "τῶν δὲ ἓν καὶ κινούμενον καὶ ἄπειρον λεγόντων Ἀναξίμανδρος μὲν Πραξιάδου Μιλήσιος θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμοις· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων·";
addnewedtext();
document.getElementsByName("ed5editor")[0].value = "Hermannus Diels";
document.getElementsByName("ed5name")[0].value = "Die Fragmente der Vorsokratiker";
document.getElementsByName("ed5publishingplace")[0].value = "Berlin";
document.getElementsByName("ed5publishingdate")[0].value = "1903";
document.getElementsByName("ed5text")[0].value = "τῶν δὲ ἓν καὶ κινούμενον καὶ ἄπειρον λεγόντων Ἀναξίμανδρος μὲν Πραξιάδου Μιλήσιος Θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον εἴρηκε τῶν ὄντων τὸ ἄπειρον, πρῶτος τοῦτο τοὔνομα κομίσας τῆς ἀρχῆς. λέγει δ\' αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ\' ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών· διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων.";

addnewedtext();
document.getElementsByName("ed6editor")[0].value = "Jaap Mansfeld";
document.getElementsByName("ed6name")[0].value = "Die Vorsokratiker Band 1 Milesier Pythagoreer Xenophanes Heraklit Parmenides";
document.getElementsByName("ed6publishingplace")[0].value = "Stuttgart";
document.getElementsByName("ed6publishingdate")[0].value = "1983";
document.getElementsByName("ed6text")[0].value = "Ἀναξίμανδρος μὲν Πραξιάδου Μιλήσιος Θαλοῦ γενόμενος διάδοχος καὶ μαθητὴς ἀρχήν τε καὶ στοιχεῖον πρῶτος τοῦτο τοὔνομα κομίσας τῆς εἴρηκε τῶν ὄντων τὸ ἄπειρον, ἀρχῆς. λέγει δ’ αὐτὴν μήτε ὕδωρ μήτε ἄλλο τι τῶν καλουμένων εἶναι στοιχείων, ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον, ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλά τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, ἀλλ’ ἀποκρινομένων τῶν ἐναντίων διὰ τῆς αὶδίου κινή- σεως·";
submitneweds( false );
}
