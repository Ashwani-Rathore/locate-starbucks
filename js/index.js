
var map;
var markers = [];
var infoWindow;
function initMap() {
    var losAngeles = {lat: 34.063380, lng: -118.358080};
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 13,
        mapTypeId: 'roadmap',
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    
        
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
  
}
function setOnClickListner(){
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function(elem,index){
    elem.addEventListener('click', function(){
      new google.maps.event.trigger(markers[index],'click');
    })
  });
}
function searchStores(){
  var foundStores = [];
  var zipCode = document.getElementById('zip-code-input').value;
  
  
  if(zipCode){
    for(store of stores){
    var postal = store['address']['postalCode'].substring(0, 5);
    if(postal == zipCode){
      foundStores.push(store);
      
    }
  }
}else{
  foundStores = stores;
}
clearLocations();
displayStores(foundStores);
showStoreMarkers(foundStores);

setOnClickListner();
}


function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;

  
}

  
  



function displayStores(stores){
    var storesHtml = '';
    for(var [index,store] of stores.entries()){
        var address = store["addressLines"];
        var phone = store["phoneNumber"];
        storesHtml +=  `
        <div class = "store-container">
        <div class = "store-container-background">
                <div class = "store-info-container">
                        <div class = "store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        
                        <div class = "store-phone-number">
                            ${phone}
                        </div>
                    </div>
                    

                    <div class = "store-number-container">
                        <div class = "store-number">
                            ${index+1}
                        </div>
                    </div>
            </div>
        </div>
        `
        
        document.querySelector('.store-list').innerHTML = storesHtml;
    }
    
}


function showStoreMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of stores.entries()){
        
        var lat = store["coordinates"]["latitude"];
        var lng = store["coordinates"]["longitude"]
        var latlng = new google.maps.LatLng(
            lat,
            lng
        );
        var name = store["name"];
        var address = store["addressLines"][0];
        var openstatus = store["openStatusText"];
        var phone = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng,name,address,index+1,openstatus,phone,lat,lng)
    }
    map.fitBounds(bounds);
}
function createMarker(latlng,name,address,index,openstatus,phone,lat,lng){
    var html = `<div class = "store-info-window">
            <div class = "name-status-container">
                <b>${name}</b>
                <br />
                <div class = "status">
                  ${openstatus}
                </div>
                </div>
                <div class = "address-phone-container">
                    <div class = "address-icon">
                        <i class="fas fa-location-arrow"></i>
                        <div class = "ap">
                           <a href = "https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}" target = "_blank"> ${address}</a>
                        </div>

                    </div>
                    <div class = "phone-icon">
                        <i class="fas fa-phone"></i>
                        <div class = "ap">
                           ${phone}
                        </div>
                    </div>
                </div>
            </div>
           `
          var iconBase = 'images/' ;
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            
            icon : iconBase + 'icons8-starbucks-48 (1).png'
          });
          google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(map, marker);
          });
          markers.push(marker);
        


}