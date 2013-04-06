  var myPosition;
  var selected = 0;
  var MAX_NUMBER_OF_UNITS = 4;

  var icon_car = new google.maps.MarkerImage("markers/car.png");
  var icon_bike = new google.maps.MarkerImage("markers/bike.png");
  var icon_motorcycle = new google.maps.MarkerImage("markers/motorcycle.png");
  
  var icons = new Array();
  icons['car'] = icon_car;
  icons['bike'] = icon_bike;
  icons['motorcycle'] = icon_motorcycle;
  
  
  //Document.ready()
    $(function() {
        
        // initialise map
        $('#map_canvas').gmap('getCurrentPosition', function(position, status) {
            if ( status === 'OK' ) {
                var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $("#map_canvas").gmap('option', 'center', clientPosition);
                $('#map_canvas').gmap('option', 'zoom', 16);
                myPosition = clientPosition;
                //$('#map_canvas').gmap('addMarker', {'markerId':'myself',
                //                            'position': myPosition});
                
            }
        });
        
        //add click event on units
        $('.unit').on("click", function(event){
           selected = parseInt(this.id.substring(4)); //get unit id
           setUnits();
           unitClick(selected);
        });  
      
        $('#me').on("click", function(event){
            $('#me').toggleClass('selected');
        });
      
        // add click event to parking sign
        $('#park_but').on("click", function(event){
           if (getUnitDetail(selected, 'lat') == 0){
                park(myPosition);
                $('#park_but').toggleClass('parked');
                $('.d').toggle();
           } else {
                unPark();
                $('#park_but').toggleClass('parked');
                $('.d').toggle();
           }
        });
        
        
        initLS();
        setUnits();
        
    })
    
    
    function unitClick(id){
        if (getUnitDetail(selected, 'lat') == 0){
            $('#park_but').removeClass('parked');
            $('.d').css('display','none');
        } else {
            $('#park_but').removeClass('parked').addClass('parked');
            $('.d').css('display','block');
        }
           clearMarkers();
           var currLat = getUnitDetail(selected, 'lat');
           var currLng = getUnitDetail(selected, 'lng');
           var currLatLng = new google.maps.LatLng(currLat, currLng);
           $('#map_canvas').gmap('addMarker', { 'markerId':'marker'+selected,
                                                'position': currLatLng,
                                                'draggable': true,
                                                'clickable': true,
                                                'icon' : icons[getUnitDetail(id, 'type')]});
           if( currLat != 0 && currLng != 0){
            $('#map_canvas').gmap('get','map').setOptions({'center':currLatLng});
           }
    }
    
    function getAdress(latLng){
        var geocoder = new google.maps.Geocoder(); 
        geocoder.geocode(
            {   location : latLng, 
                region: 'da' 
            }, function(results, status){
            if(status === 'OK'){
              setDetail(selected, 'adress', results[0].formatted_address);
            } else {
               setDetail(selected, 'adress', 'Can\'t locate adress'); 
            }
        });
    }
    
    /**
     * Reset marker to 0,0 and clear map
     */
    function unPark(){
        setDetail(selected, 'lat', 0);
        setDetail(selected, 'lng', 0);
        setDetail(selected, 'adress', '');
        clearMarkers();
    }
    
    /**
     * Drop a pin and save latLng.
     **/ 
    function park(position){
        setDetail(selected, 'lat', position.lat());
        setDetail(selected, 'lng', position.lng());
        var markerId = 'marker'+selected;
        clearMarkers();
        $('#map_canvas').gmap('addMarker', {'markerId':markerId,
                                            'position': position,
                                            'icon' : icons[getUnitDetail(selected, 'type')],
                                            'draggable': true,
                                            'clickable': true,
                                            'animation': google.maps.Animation.DROP}).dragend( function(event) {
            // Drag handler //
            park(event.latLng);
        }).click( function(event){
            // Click Handler // 
            $('#map_canvas').gmap('openInfoWindow', { content : getUnitDetail(selected, 'adress') }, this);
            });
        getAdress(position);
    }
    
    /**
     * Iterate over Unit Markers, and clear set visible(false)
     **/ 
    function clearMarkers(){
        $('#map_canvas').gmap('clear', 'markers');
    }
    
    
    /**
     * Set the style of the selected Unit
     * TODO - css + toggle
     * TODO - split into initUnits() and updateUnits()
     **/
    function setUnits(){
      var units=JSON.parse(localStorage['units']);
        for (var i = 0; i < MAX_NUMBER_OF_UNITS; i++) {
          var trans = 0.3; // the rgba transparency
          var div = $('#unit'+i); // Select the unit div
          var img = $('#unit'+i+'> img'); // Select the unit img tag
          div.css('border','1px dotted green');
          
          if ( units[i] === undefined){ // Unit is unused
            div.css('display','none');
            break;
          }
          if(i == selected){ // The chosen Unit
            trans = 0.9;
            div.css('border','2px solid black');  
          } 
          var rgba = "rgba("+units[i].split(';')[2]+","+trans+")";
          div.css('background',rgba);
          var type = units[i].split(';')[1];
          img.attr("src","markers/"+type+"-icon.png");
          img.attr('class',type);
        }  
    }
    
    
    
    
