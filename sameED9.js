//**************************************************
// 2016/2017 ecomparatio Core JavaScript Version, Prof. Charlotte Schubert Alte Geschichte, Leipzig
// this is the base script: getting and setting of data
// the comparisson is part of the webworker script sameEDxworker.js
// a TOC is given in this script

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

// start
// using the strict statement, results in a stronger typing and scope checking done by the JS interpreter 
"use strict"; 

//**************************************************
//
// helper function (doubles in the workerscript, scoping restriction of JS ultiprocessing)

var regEbr1 = new RegExp( "<br/>", 'g' ); //regular expression, the "g" option says aply to all occurences 
var regEbr2 = new RegExp( "<br/>", 'g' );

//basic cleaning and string conversion via regexp (fastest solution ?)
var cleanNEWL = new RegExp('\n', 'g');
var cleanRETL = new RegExp('\r', 'g');
var cleanstrangehochpunkt = new RegExp('‧', 'g');
var cleanthisbinde = new RegExp('—', 'g');
var cleanthisleer = new RegExp('\xa0', 'g');
var cleanleerpunkt = new RegExp(' \\.', 'g');
var cleanleerdoppelpunkt = new RegExp(' :', 'g');
var cleanleerkoma = new RegExp(' ,', 'g');
var cleanleersemik = new RegExp(' ;', 'g');
var cleanleerausrufe = new RegExp(' !', 'g');
var cleanleerfrege = new RegExp(' \\?', 'g');

//function takes string and replace html line breakes
function delumbrbine( text ){
    return text.replace(regEbr1, "").replace(regEbr2, "");
}

//function takes sting and normalform as string (for example "NFD" (analysis), "NFC" (display))
function sameuninorm( aword, wichnorm ){
    return aword.normalize( wichnorm ) 
}

//... applied to a array of strings // done for speed issue
function normatext( text, wichnorm ){
    var spt = text.split( " " )
    for( var w = 0; w < spt.length; w++ ){
        var nw = sameuninorm( spt[ w ], wichnorm );
        spt[ w ] = nw;
    }
    return spt.join( " " )
}

//**************************************************
//Section 5a: meta comparison for locating VERTAUSCHUNg UND DREHUNG // last step in programm
//**************************************************


function metavergleich( allevergleiche, alledtexts, BIBarray, edname, teNames ){
    console.log("Metavergleich");
    for(var v = 0; v < allevergleiche.length; v++){
        var rI = allevergleiche[v][0][0]; //das war der ref text im diff vergleich
        var tI = allevergleiche[v][0][1]; //das war der vergleichstext
        //console.log("VERGL: ", rI, tI);
        for(var t = 1; t < allevergleiche[ v ].length; t++){ // geh die ergebnisse des diff vergleichs durch
            if( allevergleiche[ v ][ t ][ 2 ].indexOf("T") != -1 || 
                allevergleiche[ v ][ t ][ 2 ].indexOf("mIAT")!= -1 || 
                allevergleiche[ v ][ t ][ 2 ].indexOf("M")!= -1 ){ // für einen erheblichen Unterschied suche das wort aus dem vergl text in der ergebnisliste, die bei vertauschung das ref textes und des vergl textes entstehen 
                
                var tw = alledtexts[tI][allevergleiche[ v ][ t ][ 0 ]]; //für dieses wort sind unstimmigkeiten verzeichnet 

                //
                for( var w = 0; w < allevergleiche.length; w++){
                    
                    if( allevergleiche[ w ][ 0 ][ 0 ] == tI && 
                        allevergleiche[ w ][ 0 ][ 1 ] == rI){ //textindex muß vormaligem refindex entsprechen und umgekehrt
                        //vorwärtsvorwärtsgleiche der sequenz == VERTAUSCHUNG
                        for(var r = 1; r < allevergleiche[ w ].length; r++){
                            
                            if( allevergleiche[ w ][ r ][ 2 ].indexOf("T") != -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("mIAT")!= -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("M")!= -1 ){
                            
                                var wr = alledtexts[rI][ allevergleiche[ w ][ r ][ 0 ] ];
                                var addTOt = 1;
                                var addTOr = 1;
                                var countsame = 0;
                                while(  tw == wr ){
                                    if( allevergleiche[ w ][ r+addTOr ] && allevergleiche[ v ][ t+addTOt ] ){
                                        if( (allevergleiche[ w ][ r+addTOr ][ 2 ].indexOf("T") != -1 || 
                                            allevergleiche[ w ][ r+addTOr ][ 2 ].indexOf("mIAT")!= -1 || 
                                            allevergleiche[ w ][ r+addTOr ][ 2 ].indexOf("M")!= -1) && 
                                            (allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("T") != -1 || 
                                            allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("mIAT")!= -1 || 
                                            allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("M")!= -1)){ //hier muss noch abgewogen werden, wenn es zwei Stellen gib, die identisch sicnd, welche nun die ist, die vertauscht ist, du gehts ja das diff array durch und untersuchst wieder jedes Wort, kann das nicht zu widersprüchen führen???
                                            
                                            wr = alledtexts[rI][ allevergleiche[ w ][ r+addTOr ][ 0 ] ];
                                            tw = alledtexts[tI][allevergleiche[ v ][ t+addTOt ][ 0 ]];
                                            addTOr++;
                                            addTOt++;
                                        } else {
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    countsame++;
                                }

                                if( countsame > 1 ){
                                    for(var addd = t; addd < t+addTOt; addd++){
                                        allevergleiche[ v ][ addd ][ 2 ] = allevergleiche[ v ][ addd ][ 2 ] + " vERT"; //add new
                                    //allevergleiche[ v ][ addd ][ 2 ] = " vERT";
                                    }
                                    t = t+addTOt;
                                    break;
                               }
                            }
                        }
                        //verdrehung = RückwärtsVorwertsgleiche

                        for(var r = allevergleiche[ w ].length-1; r > 2; r--){
                            //console.log(r, allevergleiche[ w ][ r ][ 2 ]);
                            if( allevergleiche[ w ][ r ][ 2 ].indexOf("T") != -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("mIAT")!= -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("M")!= -1 ){
                            
                                var wr = alledtexts[rI][ allevergleiche[ w ][ r ][ 0 ] ];
                                var addTOt = 1;
                                var addTOr = 1;
                                var countsame = 0;
                                while(  tw == wr ){
                                    if( allevergleiche[ w ][ r+addTOr ] && allevergleiche[ v ][ t+addTOt ] ){
                                        /*if(!allevergleiche[ w ][ r-addTOr ][ 2 ]){
                                            console.log(allevergleiche[ w ][ r-addTOr ], w, r, r-addTOr );
                                        }*/
                                        if( (allevergleiche[ w ][ r-addTOr ][ 2 ].indexOf("T") != -1 || 
                                            allevergleiche[ w ][ r-addTOr ][ 2 ].indexOf("mIAT")!= -1 || 
                                            allevergleiche[ w ][ r-addTOr ][ 2 ].indexOf("M")!= -1) && 
                                            (allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("T") != -1 || 
                                            allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("mIAT")!= -1 || 
                                            allevergleiche[ v ][ t+addTOt ][ 2 ].indexOf("M")!= -1)){ //hier muss noch abgewogen werden, wenn es zwei Stellen gib, die identisch sicnd, welche nun die ist, die vertauscht ist, du gehts ja das diff array durch und untersuchst wieder jedes Wort, kann das nicht zu widersprüchen führen???
                                            
                                            wr = alledtexts[rI][ allevergleiche[ w ][ r-addTOr ][ 0 ] ];
                                            tw = alledtexts[tI][allevergleiche[ v ][ t+addTOt ][ 0 ]];
                                            addTOr++;
                                            addTOt++;
                                        } else {
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                    countsame++;
                                }

                                if( countsame > 1 ){
                                    for(var addd = t; addd < t+addTOt; addd++){
                                        allevergleiche[ v ][ addd ][ 2 ] = allevergleiche[ v ][ addd ][ 2 ] + " vErdRE"; //add new
                                    //allevergleiche[ v ][ addd ][ 2 ] = " vERT";
                                    }
                                    t = t+addTOt;
                                    break;
                               }
                            }
                        }
                        //end end
                    }
                }
            }
        }
    }
    
    //this hpuld migrate to a single function to be consitent - but not important
    //add to localstore the menu
    var menuadd = localStorage.getItem("ecompmenuADD");
    if( menuadd ){
        if(menuadd.indexOf( edname ) == -1){
            localStorage.setItem("ecompmenuADD",  menuadd + '<span class="clickablesec offlmenu" style="position: relative;" id="'+edname+'" onclick="loadcomparatio(\''+edname+'\');">'+edname+'</span>');
        }
    } else {
         localStorage.setItem("ecompmenuADD",  '<span class="clickablesec offlmenu" style="position: relative;" id="'+edname+'"  onclick="loadcomparatio(\''+edname+'\');">'+edname+'</span>');
    }

    if( degugggg ){
        console.log(localStorage.getItem("ecompmenuADD"));
    }
    //add to localstore the bibvars
    localStorage.setItem("ecompBIB"+edname, JSON.stringify( BIBarray ));
    if( degugggg ){
        console.log(localStorage.getItem("ecompBIB"+edname));
    }
    //
    //add to localstore the alltexts array
    localStorage.setItem("ecompALLTEX"+edname, JSON.stringify( alledtexts ));
    if( degugggg ){
        console.log( localStorage.getItem("ecompALLTEX"+edname) );
    }
    
    //add to localstore the alltextnames array 
    localStorage.setItem("ecompTENAMES"+edname,  JSON.stringify( teNames ));
    if( degugggg ){
        console.log( localStorage.getItem("ecompTENAMES"+edname) );
    }

    //prepare the right structure of the comparatio array and push it to the localstore
    var bigC = [];
    
    for(var tt = 0; tt < alledtexts.length; tt++){
        
        var bigbigC = [ ];
        for( var vv = 0; vv < allevergleiche.length; vv++ ){
            if( tt == allevergleiche[vv][0][0] ){
                bigbigC.push( allevergleiche[ vv ] );
            }
        }
        bigC.push([tt, bigbigC]);
    }
    localStorage.setItem("ecompRES"+edname, JSON.stringify( bigC ));
    if( degugggg ){
        console.log(localStorage.getItem("ecompRES"+edname));
    }

    //end timer of whole vergleichs programm
    console.timeEnd("allVergl");
    alert("Vergleiche fertig! Bitte laden Sie die Seite neu.");
    window.location.reload();
}

//**************************************************
//Section 6: html menu
//**************************************************
// not needed any more

//**************************************************
//Section 7: offline Database communication
//**************************************************
//BETTER USER LOCALSTORAGE


//**************************************************
//Section 8: main funktion, geting data, setting data 
// global control vars
//**************************************************

var border = 20; //range to search equality, this is set via the param comming from user input
var degugggg = false; //output debug and programm flow print messages
var doUVlatin = false; // true or false, equal u and v in latin texts

function ecomparatioVerg( edname, teNames, BIBarray, TEXTarray, doUVlatinNeu, borderNeu  ){
    //check for multiprocessing, if browser does not support, no programm given
    if( !window.Worker ) {
        alert('No Webworker Multiprocessing Support on this Browser. A later Browserversion ist required.');
        return false;
    }

    try{ 
        !"ä".normalize("NFD") 
    } catch( err ) {
        alert('No unicode string normalization. A later Browserversion ist required.');
        return false;
    }
    //continue, if compatible
    
    console.log("ecompVergleich");
    console.time("allVergl");
    console.log("degugggg", degugggg);
    
    if( degugggg ){
        console.log("EDRname", edname);
        console.log("BIBarray", BIBarray);
        console.log("TEXTarray", TEXTarray);
    }
    doUVlatin = doUVlatinNeu;
    border = borderNeu;
    //global memory of texts
    var alledtexts = [ ];
    var allfilenames = [ ];
    //read in everything
    for( var T in TEXTarray ){
        allfilenames.push( BIBarray[ T ] );
        var c = TEXTarray[ T ].replace(cleanNEWL, " <br/>").replace(cleanRETL, " <br/>").replace(cleanstrangehochpunkt,"·").replace(cleanthisbinde," — ").replace( cleanthisleer, ' ').replace( cleanleerpunkt, '.').replace( cleanleerdoppelpunkt, ':').replace( cleanleerkoma, ',').replace( cleanleersemik, ';').replace( cleanleerausrufe, '!').replace( cleanleerfrege, '?');
        var ws = c.split(" "); //keep convention with newlines
        var ca = [];
        var halfw = "";
        var secondhalf = "";
        for( var w in ws ){
            if( ws[w].indexOf( "-" ) != -1 ){
                var h = ws[w].split( "-" );
                halfw = h[0].replace(" ", "");
                secondhalf = h[1].replace(" ", "");
                if( secondhalf.indexOf("]") != -1 ){ 
                    var hh = h[1].split("]");
                    if( hh[1].length > 1 ){
                        ca.push( halfw + hh[1] + " " + hh[0] + "]<br/>" );
                        halfw = "";
                        secondhalf = "";
                    }
                }
            } else if ( "<br/>" != ws[w] && ws[w] != "" && ws[w] != " " && halfw != "" ){
                if( ws[w].indexOf("]") != -1 ){
                
                    secondhalf = ws[w].replace(" ", "");
                } else {
                    ca.push( halfw + ws[w].replace("<br/>", "") + " " + secondhalf + "<br/>" ); //trennstriche
                    halfw = "";
                    secondhalf = "";
                }
            } else {
                if( ws[w] != "" ){ //remove mehrfache leerstellen
                    ca.push( ws[w] );
                }
            }
        }
        c = delumbrbine( ca.join( " " ) )
        var cc = c.split(" ") //nochmal mehrfache leerzeichen koontrollieren
        var goon = true
        var l = 0
        while( goon ){ //ok das hilft
            if( cc[ l ].length < 1 || cc[l] == " " ){
                cc.splice( l, 1 );
            }
            if(cc.length-1 <= l){
                goon = false;
            } else {
                l = l + 1;
            }
        }
        c = cc.join( " " ); 
        
        //clean text from 
        alledtexts.push( normatext( c, 'NFC' ).split( " " ) ); //NFC because it is used for display, NFD is for analysis
    }
    console.log("Vorbereitungen enden: ", edname );
    //console.log("alledtexts", alledtexts)

    
    //WEB WORKER VERGLEICHSAUFRUF
    var allevergleiche = [];
    var vergleicher = [ ];
    var datatothem = [ ];
    var windex = 0;
    //start twice as much threads as CUP Cores
    var cpucount = 2; //default
    if(navigator.hardwareConcurrency){
        cpucount = navigator.hardwareConcurrency*2; 
    } //need to 
    //
    console.log("paral",cpucount, " comps ", alledtexts.length * TEXTarray.length )
    for( var ref in alledtexts ){
        //parallel stuff
        //some worker
        for(var cpuc = 0; cpuc < cpucount; cpuc++){
        //var workerpath = "js/sameED9worker.js"; //!!! how to fix this
            var workerpath = "sameED9worker.js"; //!!! how to fix this
            //console.log(window.location);
            if(window.location.href.indexOf("scri") != -1){
                workerpath = "../js/sameED9worker.js";
            }
            var worker = new Worker( workerpath );
            //callback on termination
            worker.onmessage = function( event ){
                allevergleiche.push( event.data.vergl );
                if( allevergleiche.length == datatothem.length ){ // IS THIS CLEAN???
                    metavergleich( allevergleiche, alledtexts, BIBarray, edname, teNames );
                    console.log("DONE DONE DONE ALL - build the DATABASE AND THE MENU");
                    //terminate the workers
                    for(var v in vergleicher){
                        vergleicher[ v ].postMessage( {"cmd":"terminate"} );
                    }
                } else {
                    if( windex < datatothem.length ){
                        datatothem[ windex ]["workerid"] = event.data.workerid;
                        vergleicher[ event.data.workerid ].postMessage( datatothem[ windex ] );
                        windex++;
                    }
                }
            
            }
            //push the worker to the worker array
            vergleicher.push( worker );
            //break;
        }
        //data provided
        for( var text in alledtexts ){ 
            if( ref != text ){
                console.log( "Data f. Vergleich Ref:", ref, " Text ", text );
                
                datatothem.push( {"cmd":"eval", "r": alledtexts[ref], "ri": ref, "t": alledtexts[text], "ti": text , "border": border, "degugggg": degugggg, "doUVlatin": doUVlatin} );
            //break;
            }
            
        }
        //break;
    }
    //start first payload on each worker in array, they will go on for it self
    for(var cpuc = 0; cpuc < cpucount; cpuc++){  
        if( windex < datatothem.length ){
            datatothem[ windex ]["workerid"] = cpuc;
            vergleicher[ windex ].postMessage( datatothem[ windex ] );
            windex++;
            
        }
        //break;
    }
}  
 
