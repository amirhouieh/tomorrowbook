function _filter_1(original, fnCallback){


  //remove StopWords && Empty words 
  TEXT = original.split("@").filter( function(e){return e !=="" });

  for( var x in TEXT ) TEXT[x] = TEXT[x].trim();
  console.log( TEXT );

_temp_1 = [];


  var _temp = original
              // .replace(/"(.*?)"/g, "#$1#")
              .replace( /([A-Z][\w-]*(?:[^\S\t][A-Z][\w-]*)+)/g, '#$1#')
              .replace(/(\w+(?: - \w+)+)/g, '#$1#' )
              .replace(/ppaarraaff/g, '' )
              .replace(/ccaapptteerr/g, '')
              .replace(/[,|.|?|:|!|;]|\(|\)|’|‘|”|“]/g,"")
              .toLowerCase()
              .split(/(#.*?#|[^#\w]+)/)
              .filter( function(e){ 
                return ( $.inArray(e.toLowerCase(), stop_words) === -1 && e !== "" && e.length >2)? true:false; 
              });

  _temp = _temp.filter(function(e){ return (e.charAt(0).match(/\s/g) === null)?true:false;});

console.log( _temp.length );
  $.each( _temp, function(i, item){
    var _new = item.replace (/#/g, "").trim();

    if( /[a-zA-Z]{2,}/.test( _new ) ) {
      _text_sequence.push( _new );
      
      if( $.inArray(_new, _preWiki) === -1 ) _preWiki.push( _new );

    }

  });

  _temp = [];
  _text_sequence = _text_sequence.join(' &')


  $.each( _preWiki, function(i, item){

      var new_item,
      new_spacial_is_not_dup = true,
      text = [];

      var _isSpacial = ( item.match(/\s/g) !==null )? 1:0;

      if( _isSpacial === 1 ){
        var _spacial = item.split(/\s/g);

        if ( $.inArray(_spacial[0].toLowerCase(), stop_words) !== -1 || _spacial[0].length<2){
          _spacial = _spacial.slice(1);
          new_item = _spacial.join(' ').replace(/-/g, "").trim();
          new_spacial_is_not_dup = ( new_item.toLowerCase() !== item.toLowerCase() )? true:false;
          spacials.push( new_item );
          item = new_item;
        }
      }

      var _app_InText =  _text_sequence.match( new RegExp("&"+item+" &", 'g') );
          _app_InText = ( _app_InText !== null )? _app_InText.length:0;


      _isSpacial = ( item.match(/\s/g) !==null )? 1:0;

      if( item.length > 1 && $.inArray(item.toLowerCase(), stop_words) ===-1 && $.inArray(item, _temp) ===-1){
        _afterWiki.push({
                            key: item,
                            inText: 0,
                            InRfrncTitle: [],
                            InRfrncText: [],
                            frq_InRfrncText: 0,
                            frq_InRfrncTitle: 0,
                            frq_InMainArticle: 0,
                            frq_InText: _app_InText,
                            isSpacial: _isSpacial,
                            scor: 0
                        });

      _temp.push( item );

      }
    



  });




  //CallBack
  wiki_getRefrense();

}

function group( _this ){

  var _max = _this[0].scor.toFixed();
  var _min = _this[ _this.length-1 ].scor.toFixed(),
      new_max;

  var _tt = [],
      _splitFlags = [];



  $.each(_this, function(i, item){
    var _scor = item.scor.toFixed(),
        _rate = _scor/_max,
        _isInText = true,
        _index = 0;

    while(_isInText  && _index < TEXT.length - 1 ){
      if( TEXT[ _index ].match( new RegExp( item.key , 'gi') ) !== null )
        _isInText = false;
      else
        _index++;
    }

    _this[i].inText =  _index ;

      if( _rate > 0.1 ){
        _newSccor = ( ( (_rate*100).toFixed(1) / 30 ).toFixed() * 100  +100 ).toFixed();
        new_max = _this[ i+1 ].scor.toFixed();
      }
      else{
         _rate = ( ( _scor/new_max ) * 100 ).toFixed(1);
        _newSccor = ( _rate > 20 )?  Math.floor( (_rate/5).toFixed() * 5 ) : Math.floor( (_rate/.5).toFixed() * .475 );  
      }

      _this[i]["newScor"] = parseInt(_newSccor);
  });

  console.log( _this );


 var temp = [],
    _tet = [];
  $.each(_this, function(i, item){
    var _cat = item.newScor;

    if($.inArray(_cat, temp) === -1 ){
      temp.push(_cat);

      _groups.push({cat: _cat, childs: []});

      for( var x in _this )
        if( _this[x].newScor === item.newScor )
          _groups[ _groups.length-1 ]["childs"].push( _this[x] );
      }

    if( _groups[ _groups.length-1 ]["childs"].length > 20 ){

        var _new = _groups.pop();

        while( _new["childs"].length > 0 ){
          _max = 20,
          _min = _new["childs"].length%20;

          var _rnd = Math.floor(Math.random() * (_max - _min + 1)) + _min;

          _cat += 0.01;

          _groups.push({cat: _cat, childs: []});
          _groups[ _groups.length-1 ]["childs"] = _new["childs"].splice(0,_rnd);
        }

    }

  });

  console.log( _groups );

}
