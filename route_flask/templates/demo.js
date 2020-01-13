/**@param  {H.Map} map*/
var rows=[]
var allMarkers=[];

function setUpClickListener(map) {
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    logEvent('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
    console.log(coord.lat.toFixed(4), coord.lng.toFixed(4))
    var parisMarker = new H.map.Marker({lat:coord.lat.toFixed(4), lng:coord.lng.toFixed(4)});
    allMarkers.push(parisMarker)
    var hu = [];
    hu.push(coord.lat.toFixed(4));
    hu.push(coord.lng.toFixed(4));
    rows.push(hu)
    map.addObject(parisMarker);
    console.log(rows)
  });
}

var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:12.9663, lng:77.5880},
  zoom: 11,
  pixelRatio: window.devicePixelRatio || 1
});
window.addEventListener('resize', () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>';
map.getElement().appendChild(logContainer);

function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

// document.getElementById("routeListen").addEventListener('click', processFull)

setUpClickListener(map);