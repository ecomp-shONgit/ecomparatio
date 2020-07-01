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

const regEbr1 = new RegExp( "<br/>", 'g' ); //regular expression, the "g" option says aply to all occurences 
const regEbr2 = new RegExp( "<br/>", 'g' );

//basic cleaning and string conversion via regexp (fastest solution ?)
const cleanNEWL = new RegExp('\n', 'g');
const cleanRETL = new RegExp('\r', 'g');
const cleanstrangehochpunkt = new RegExp('‧', 'g');
const cleanthisbinde = new RegExp('—', 'g');
const cleanthisleer = new RegExp('\xa0', 'g');
const cleanleerpunkt = new RegExp(' \\.', 'g');
const cleanleerdoppelpunkt = new RegExp(' :', 'g');
const cleanleerkoma = new RegExp(' ,', 'g');
const cleanleersemik = new RegExp(' ;', 'g');
const cleanleerausrufe = new RegExp(' !', 'g');
const cleanleerfrege = new RegExp(' \\?', 'g');
//breakdown typographic variances "Bindestriche und Geviertstriche"
const cleanklbindstrichvollbreit = new RegExp('－', 'g');
const cleanklbindstrichkurz = new RegExp('﹣', 'g');
const cleanklgeviert = new RegExp('﹘', 'g');
const cleanviertelgeviert = new RegExp('‐', 'g');
const cleanziffbreitergeviert = new RegExp('‒', 'g');
const cleanhalbgeviert = new RegExp('–', 'g');
const cleangeviert = new RegExp('—', 'g');

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
    let spt = text.split( " " )
    for( let w = 0; w < spt.length; w++ ){
        let nw = sameuninorm( spt[ w ], wichnorm );
        spt[ w ] = nw;
    }
    return spt.join( " " )
}

//**************************************************
//Section 5a: meta comparison for locating VERTAUSCHUNg UND DREHUNG // last step in programm
//**************************************************


function metavergleich( allevergleiche, alledtexts, BIBarray, edname, teNames ){
    console.log("Metavergleich");
    for(let v = 0; v < allevergleiche.length; v++){
        let rI = allevergleiche[v][0][0]; //das war der ref text im diff vergleich
        let tI = allevergleiche[v][0][1]; //das war der vergleichstext
        //console.log("VERGL: ", rI, tI);
        for(let t = 1; t < allevergleiche[ v ].length; t++){ // geh die ergebnisse des diff vergleichs durch
            if( allevergleiche[ v ][ t ][ 2 ].indexOf("T") != -1 || 
                allevergleiche[ v ][ t ][ 2 ].indexOf("mIAT")!= -1 || 
                allevergleiche[ v ][ t ][ 2 ].indexOf("M")!= -1 ){ // für einen erheblichen Unterschied suche das wort aus dem vergl text in der ergebnisliste, die bei vertauschung das ref textes und des vergl textes entstehen 
                
                let tw = alledtexts[tI][allevergleiche[ v ][ t ][ 0 ]]; //für dieses wort sind unstimmigkeiten verzeichnet 

                //
                for( let w = 0; w < allevergleiche.length; w++){
                    
                    if( allevergleiche[ w ][ 0 ][ 0 ] == tI && 
                        allevergleiche[ w ][ 0 ][ 1 ] == rI){ //textindex muß vormaligem refindex entsprechen und umgekehrt
                        //vorwärtsvorwärtsgleiche der sequenz == VERTAUSCHUNG
                        for(let r = 1; r < allevergleiche[ w ].length; r++){
                            
                            if( allevergleiche[ w ][ r ][ 2 ].indexOf("T") != -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("mIAT")!= -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("M")!= -1 ){
                            
                                let wr = alledtexts[rI][ allevergleiche[ w ][ r ][ 0 ] ];
                                let addTOt = 1;
                                let addTOr = 1;
                                let countsame = 0;
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
                                    for(let addd = t; addd < t+addTOt; addd++){
                                        allevergleiche[ v ][ addd ][ 2 ] = allevergleiche[ v ][ addd ][ 2 ] + " vERT"; //add new
                                    //allevergleiche[ v ][ addd ][ 2 ] = " vERT";
                                    }
                                    t = t+addTOt;
                                    break;
                               }
                            }
                        }
                        //verdrehung = RückwärtsVorwertsgleiche

                        for(let r = allevergleiche[ w ].length-1; r > 2; r--){
                            //console.log(r, allevergleiche[ w ][ r ][ 2 ]);
                            if( allevergleiche[ w ][ r ][ 2 ].indexOf("T") != -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("mIAT")!= -1 || 
                                allevergleiche[ w ][ r ][ 2 ].indexOf("M")!= -1 ){
                            
                                let wr = alledtexts[rI][ allevergleiche[ w ][ r ][ 0 ] ];
                                let addTOt = 1;
                                let addTOr = 1;
                                let countsame = 0;
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
                                    for(let addd = t; addd < t+addTOt; addd++){
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
    let menuadd = localStorage.getItem("ecompmenuADD");
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
    let bigC = [];
    
    for(let tt = 0; tt < alledtexts.length; tt++){
        
        let bigbigC = [ ];
        for( let vv = 0; vv < allevergleiche.length; vv++ ){
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

let border = 20; //range to search equality, this is set via the param comming from user input
let degugggg = false; //output debug and programm flow print messages
let doUVlatin = false; // true or false, equal u and v in latin texts
let altSorting = false; //comparisson sorting

function ecomparatioVerg( edname, teNames, BIBarray, TEXTarray, doUVlatinNeu, borderNeu, altSortingNeu  ){
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
    altSorting = altSortingNeu;
    //global memory of texts
    let alledtexts = [ ];
    let allfilenames = [ ];
    //read in everything
    for( let T in TEXTarray ){
        allfilenames.push( BIBarray[ T ] );
        let c = TEXTarray[ T ].replace(cleanNEWL, " <br/>").replace(cleanRETL, " <br/>").replace(cleanstrangehochpunkt,"·").replace(cleanthisbinde," — ").replace( cleanthisleer, ' ').replace( cleanleerpunkt, '.').replace( cleanleerdoppelpunkt, ':').replace( cleanleerkoma, ',').replace( cleanleersemik, ';').replace( cleanleerausrufe, '!').replace( cleanleerfrege, '?').replace(cleangeviert, '-').replace(cleanhalbgeviert, '-').replace(cleanziffbreitergeviert, '-').replace(cleanviertelgeviert, '-').replace(cleanklgeviert, '-').replace(cleanklbindstrichkurz, '-').replace(cleanklbindstrichvollbreit, '-');
        let ws = c.split(" "); //keep convention with newlines
        let ca = [];
        let halfw = "";
        let secondhalf = "";
        for( let w in ws ){
            if( ws[w].indexOf( "-" ) != -1 ){ //
                let h = ws[w].split( "-" );
                halfw = h[0].replace(" ", "");
                secondhalf = h[1].replace(" ", "");
                if( secondhalf.indexOf("]") != -1 ){ //can not reconstruct the - issue
                    let hh = h[1].split("]");
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
        let cc = c.split(" ") //nochmal mehrfache leerzeichen koontrollieren
        let goon = true
        let l = 0
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
    let allevergleiche = [];
    let vergleicher = [ ];
    let datatothem = [ ];
    let windex = 0;
    //start twice as much threads as CUP Cores
    let cpucount = 2; //default
    if(navigator.hardwareConcurrency){
        cpucount = navigator.hardwareConcurrency*2; 
    } //need to 
    //
    console.log("paral",cpucount, " comps ", alledtexts.length * TEXTarray.length )
    for( let ref in alledtexts ){
        //parallel stuff
        //some worker
        for(let cpuc = 0; cpuc < cpucount; cpuc++){
        //let workerpath = "js/sameED9worker.js"; //!!! how to fix this
            let workerpath = "sameED9worker.js"; //!!! how to fix this
            //console.log(window.location);
            if(window.location.href.indexOf("scri") != -1){
                workerpath = "../js/sameED9worker.js";
            }
            let worker = new Worker( workerpath );
            //callback on termination
            worker.onmessage = function( event ){
                allevergleiche.push( event.data.vergl );
                if( allevergleiche.length == datatothem.length ){ // IS THIS CLEAN???
                    metavergleich( allevergleiche, alledtexts, BIBarray, edname, teNames );
                    console.log("DONE DONE DONE ALL - build the DATABASE AND THE MENU");
                    //terminate the workers
                    for(let v in vergleicher){
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
        for( let text in alledtexts ){ 
            if( ref != text ){
                console.log( "Data f. Vergleich Ref:", ref, " Text ", text );
                
                datatothem.push( {"cmd":"eval", "r": alledtexts[ref], "ri": ref, "t": alledtexts[text], "ti": text , "border": border, "degugggg": degugggg, "doUVlatin": doUVlatin, "altSorting": altSorting } );
            //break;
            }
            
        }
        //break;
    }
    //start first payload on each worker in array, they will go on for it self
    for(let cpuc = 0; cpuc < cpucount; cpuc++){  
        if( windex < datatothem.length ){
            datatothem[ windex ]["workerid"] = cpuc;
            vergleicher[ windex ].postMessage( datatothem[ windex ] );
            windex++;
            
        }
        //break;
    }
}  
