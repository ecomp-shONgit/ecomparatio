

<?php
// curl -I https://api.github.com/users/ecomp-shONgit/repos/ecomparatio/publicdumps
// get public
// a simple way to get a user's repo

function curlit( $githuburl ){
    $curlheader = curl_init( );
    curl_setopt( $curlheader, CURLOPT_URL, $githuburl );
    curl_setopt( $curlheader, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)' );
    curl_setopt( $curlheader, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $curlheader, CURLOPT_CONNECTTIMEOUT, 6 );
    curl_setopt( $curlheader, CURLOPT_TIMEOUT, 6 );
    return curl_exec($curlheader);
     
}

function downjson( $githuburl ){
    return json_decode( curlit( $githuburl ) );
}

function downtxt( $githuburl ){
    return curlit( $githuburl );
}


$ghurl = "https://api.github.com/repos/ecomp-shONgit/ecomparatio/contents/publicdumps?ref=master";


$res = downjson( $ghurl );
//print_r($res);

foreach( $res as $r ){
    echo $r->{'name'}."#########".downtxt($r->{'download_url'})."###############";
}

?>
