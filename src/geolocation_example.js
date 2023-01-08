var access_token = 'pk.eyJ1IjoibGVuaW5sZWUiLCJhIjoiY2tuMHIyMmd6MG4waTJwbzJxajFiazB0bCJ9.z-1ChfeCZlSdg4NlIwX1Lg';
var loaded       = 0;
var address_origin      = '';
var address_destination = '';
var basesearch   = 'https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json?access_token={access_token}';
              
              setInterval(function(){
                var url = window.location.href;

                if(url.indexOf('mapboxinterval') < 0
                  && url.indexOf('mapbox') > 0
                  && url.indexOf('mapboxcoordinate') < 0
                  && $('#map').html()!=undefined && loaded==0){
                  loaded=1;
                  var url   = decodeURI(window.location.href);
                  var items = url.split('/');
                  address_origin = items[items.length-1];
   
                  var url_search = basesearch.replace('{address}',address_origin).replace('{access_token}',access_token);
                  getTransactionSearch(url_search,LoadMapBoxSearch);

                }
                
                //with origin and destination:
                if(url.indexOf('mapboxinterval') > 0
                  && $('#map').html()!=undefined && loaded==0){
                  loaded=1;
                  var url   = decodeURI(window.location.href);
                  var items = url.split('/');
                  address_origin = items[items.length-2];
                  address_destination = items[items.length-1];
                  var url_search_origin = basesearch.replace('{address}',address_origin).replace('{access_token}',access_token);
                  var url_search_destination = basesearch.replace('{address}',address_destination).replace('{access_token}',access_token);
                  getTransactionSearchDestination(url_search_origin,url_search_destination,LoadDestination);

                }

                //alert(loaded);
                if(url.indexOf('mapboxcoordinate') > 0
                  && $('#map').html()!=undefined && loaded==0 ){//
                    //alert('Box abla');
                  loaded=1;
                  var url   = decodeURI(window.location.href);
                  var items = url.split('/');
                  address_origin = items[items.length-2];
                  address_destination = items[items.length-1];
                  var origin = [];var destination = [];
                  origin[0] = {place_name:'you',center:[address_origin.split(',')[0],address_origin.split(',')[1]]};
                  destination[0] = {place_name:'runner',center:[address_destination.split(',')[0],address_destination.split(',')[1]]};

                  LoadMapOriginDestination(origin,destination);

                }
          },1000);

          function successFunction(position) 
          {
              var lat = position.coords.latitude;
              var long = position.coords.longitude;
              alert('Your latitude is :'+lat+' and longitude is '+long);
          }

          function errorFunction(position) 
          {
              alert('Error!');
          }

          function LoadMapBoxSearch(data){
            LoadMap(data.features);
          }

          function LoadMap(features){

                  var start_position = [-122.25948, 37.87221];

                  if(features.length > 0){
                    start_position = features[0].center;
                  }

                  mapboxgl.accessToken = access_token;
                  var map = new mapboxgl.Map({
                    container: 'map', // Container ID
                    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
                    center: start_position, // Starting position [lng, lat]
                    zoom: 12, // Starting zoom level
                  });

                  for(var i = 0;i < features.length;i++){

                      var popup = new mapboxgl.Popup()
                      .setText(features[i].place_name)
                      .addTo(map);


                      var marker = new mapboxgl.Marker() // Initialize a new marker
                        .setLngLat(features[i].center) // Marker [lng, lat] coordinates
                        .addTo(map).setPopup(popup); // Add the marker to the map
                  }
              

          }



          function LoadMapOriginDestination(origin,destination){

                  var start_position = [-122.25948, 37.87221];

                  if(origin.length > 0){
                    start_position = origin[0].center;
                  }

                  mapboxgl.accessToken = access_token;
                  var map = new mapboxgl.Map({
                    container: 'map', // Container ID
                    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
                    center: start_position, // Starting position [lng, lat]
                    zoom: 12, // Starting zoom level
                  });
                 
                 if(origin.length > 0){
                      var popup = new mapboxgl.Popup()
                      .setText(origin[0].place_name)
                      .addTo(map);


                      var marker = new mapboxgl.Marker() // Initialize a new marker
                        .setLngLat(origin[0].center) // Marker [lng, lat] coordinates
                        .addTo(map).setPopup(popup); // Add the marker to the map
                 }
                  

                  if(destination.length > 0){

                        var popup = new mapboxgl.Popup()
                        .setText(destination[0].place_name)
                        .addTo(map);

                        var marker = new mapboxgl.Marker() // Initialize a new marker
                          .setLngLat(destination[0].center) // Marker [lng, lat] coordinates
                          .addTo(map).setPopup(popup); // Add the marker to the map
                  }
                            
                  
                  map.on('load', function () {
                      loaded=1;
                      map.addSource('route', {
                          'type': 'geojson',
                          'data': {
                          'type': 'Feature',
                          'properties': {},
                            'geometry': {
                              'type': 'LineString',
                              'coordinates': [
                                  origin[0].center,
                                  destination[0].center
                              ]
                            }
                          }
                      });

                    
                    map.addLayer({
                      'id': 'route',
                      'type': 'line',
                      'source': 'route',
                      'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                      },
                      'paint': {
                      'line-color': '#888',
                      'line-width': 8
                      }
                    });
                  
                    map.addLayer({
                      'id': 'point',
                      'source': 'single-point',
                      'type': 'circle',
                      'paint': {
                      'circle-radius': 10,
                      'circle-color': '#448ee4'
                      }
                    });
                  
                    // Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
                    //  Add a marker at the result's coordinates
                    //geocoder.on('result', function (e) {
                    //  map.getSource('single-point').setData(e.result.geometry);
                    //});
                });

          }

          function getTransactionSearch(url,getSucess){

            fetch(url, {
                method: 'GET'
            }).then((res) => res.json())
            .then((res) => {
                getSucess(res);
            }).catch((error) => {
                console.log('failure on fetch:' + url);
                console.error('Detail-2:' + error);
            });

          }

          function getTransactionSearchDestination(urlorigin,urldestination,getSucess){
              fetch(urlorigin, {
                  method: 'GET'
              }).then((res) => res.json())
              .then((res) => {
                  getSucess(res,urldestination);
              }).catch((error) => {
                  console.log('failure on fetch:' + url);
                  console.error('Detail-2:' + error);
              });

          }

          function LoadDestination(data_origin,urldestination){
              //alert(urldestination);
              fetch(urldestination, {
                  method: 'GET'
              }).then((res) => res.json())
              .then((res) => {
                LoadMapOriginDestination(data_origin.features,res.features);
              }).catch((error) => {
                  console.log('failure on fetch:' + url);
                  console.error('Detail-2:' + error);
              });
          }