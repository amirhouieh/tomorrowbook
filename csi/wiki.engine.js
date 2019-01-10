
function wiki_getRefrense(){
    var _url = 'https://en.wikipedia.org/w/api.php?&callback=?';

    $.getJSON(_url,{
        action:'query',
        format:'json',
        list:'search',
        srsearch:ttl,
        srlimit:'50',
        }
        ,function(data) {

            // data is an array of 50 sub_pages ( refrences )

            //push the title of refrences into array _wiki_rfrnc
             for( var x in data['query']['search'] )
                _wiki_rfrnc.push( {ttl: data['query']['search'][x].title, text:''} );
                
            console.log( data );

            var _url_2 = 'https://en.wikipedia.org/w/api.php?explaintext&indexpageids&callback=?';
            var _rfrncTtl = _wiki_rfrnc[0].ttl;

            $.getJSON(_url_2,{
                action: 'query',
                format:'json',
                titles: _rfrncTtl,
                prop:'extracts',
                }
                ,function(data) {

                    // get the plain text of MAIN ARTICLE ( _wiki_rfrnc[0].ttl )
                    var page_id = parseInt( data["query"]['pageids'][0] );
                    var _plain_text = data["query"]['pages'][page_id]['extract'];

                    //find the frq in the main article text
                    $.each(_afterWiki, function(i, word){
                        var _app_InMainText =  _plain_text.match( new RegExp( ' '+word.key+' ', 'gi') );

                        if( _app_InMainText  !== null  )
                            _afterWiki[i].frq_InMainArticle = _app_InMainText.length;
                    });

                    wiki_getPlainText();
            });
    });
}


function wiki_getPlainText(){
    var _url = 'https://en.wikipedia.org/w/api.php?explaintext&indexpageids&callback=?'
    var _rfrncTtl = _wiki_rfrnc[_rfrnc_id].ttl,
        _word_rfnc = [];

    console.log( _rfrnc_id );
    console.log( _rfrncTtl );

    $('#rfnc').text( _rfrncTtl );

    $.getJSON(_url,{
        action: 'query',
        format:'json',
        titles: _rfrncTtl,
        prop:'extracts',
        }
        ,function(data) {

            var page_id = parseInt( data["query"]['pageids'][0] );
            var _plain_text = data["query"]['pages'][page_id]['extract'];

            _plain_text = _plain_text
                        // .substring( 0, _plain_text.indexOf( '== See also ==' ) )
                        .replace(/(==.+?==)|(===.+?===)|(=)/g, '')
                        .replace(/\n\s*\n/g, '\n');

            if(_rfrnc_id === 0)
                _main_article = _plain_text;

            _wiki_rfrnc[_rfrnc_id].text =  _plain_text.split('.\n') ;

            // search for the numbers of match/s of the Title in the Refrence text
            var  ttl_frq_Inrfrnc = _plain_text.match( new RegExp(_wiki_rfrnc[0].ttl, 'g') ) ;


            // if there is any match push it to the list of refrences : title + plaintext + number of matches 
            if( ttl_frq_Inrfrnc !== null ){
                
                _temp_1.push({
                            ttl: _rfrncTtl, 
                            str:_plain_text, 
                            frq: ttl_frq_Inrfrnc.length
                        });

                $.each(_afterWiki, function(i, word){

                    var _isInText = true,
                        _index =0,
                        _keywordMatch = new RegExp(word.key+" ", 'gi');

                    var _app_InRfrncText =( _plain_text.match( _keywordMatch ) !== null )? true:false;
                    var _app_InRfrncTilte = ( _rfrncTtl.match( _keywordMatch ) !== null )? true:false;

                    // if the keyword appears in refrences Text Or titles 
                    if ( _app_InRfrncText || _app_InRfrncTilte ){

                        if( _app_InRfrncTilte ){

                            _afterWiki[i].InRfrncTitle.push( _rfrnc_id );
                            _afterWiki[i].frq_InRfrncTitle = word.InRfrncTitle.length;

                        }

                        if( _app_InRfrncText ){

                            while(_isInText && _index<_wiki_rfrnc[ _rfrnc_id ].text.length ){
                                if( _wiki_rfrnc[ _rfrnc_id ].text[ _index ].match( _keywordMatch ) !== null){

                                    // _afterWiki[i].InRfrncText.push({rfrnc: _rfrnc_id, para: _index});
                                    _afterWiki[i].InRfrncText.push(_rfrnc_id+":"+_index);
                                    _isInText = false;

                                }
                                _index++;
                            }
                            _afterWiki[i].frq_InRfrncText = word.InRfrncText.length;
                        }
                    }
                    word.scor = word.frq_InText * 8 + word.frq_InMainArticle* 16 + word.frq_InRfrncText  + word.frq_InRfrncTitle*2;
                    _largestScor = ( _largestScor > word.scor )? _largestScor:word.scor;
                });

            }

            //keep looking for all the Refrenses's titles and push them in temp
            //once it is done copy it to the refrence array and delete _temp_1
            if( _rfrnc_id < _wiki_rfrnc.length-1)
                wiki_getPlainText( _rfrnc_id++ );
            else{
                console.log( 'DONE' );

                _navRestart();

                console.log( _largestScor );

                console.log( TEXT );


                $.each(_afterWiki, function(i, item){
                    _afterWiki[i].scor += (item.frq_InRfrncText+1)*(item.frq_InRfrncTitle+1) * item.isSpacial * _largestScor/8; 
                });

                _final = _afterWiki.filter(function(e){ return (e.scor > _largestScor/35 )? true:false;});

                console.log( _final.sort(function(a,b){ return b.scor- a.scor}) );


                $.each(_wiki_rfrnc, function(i, rfrnc){
                    $.each(rfrnc.text, function(j, tx){
                        _wiki_rfrnc[i].text[j] += ".";
                    });
                });


                buildcontent();


var json = JSON.stringify(_final);
var blob = new Blob([json], {type: "application/json"});
var url  = URL.createObjectURL(blob);

var a = document.createElement('a');
a.download    = "backup.json";
a.href        = url;
a.textContent = "Download backup.json";

// document.getElementById('content').appendChild(a);



            }   

    });

}

function _navRestart(){

    $('nav').find('>*:not(#ttl)').each(function(i, item){
        item.remove();
    });

    var _about = $('<br><span onclick="move_2();">About this project</span>').hide()
     _about.appendTo( $('nav') ).effect('slide', { direction: 'left', mode: 'show', easing: 'easeInOutQuint'}, 1000);

}
