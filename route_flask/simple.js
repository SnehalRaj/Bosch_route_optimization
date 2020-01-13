// var urlServer = 'ec2-34-227-87-231.compute-1.amazonaws.com';
var urlServer = 'http://localhost:8000'
var svgMarkup = '<svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><circle opacity="0.9" id="svg_1" r="12" cy="13" cx="13" stroke-width="2" stroke="#333333" fill="${FILL}"/><text xml:space="preserve" text-anchor="middle" id="svg_2" y="18.5" x="13" stroke-width="0" font-size="10pt" font-family="Roboto" stroke="#000000" fill="#000000">${TEXT}</text></svg>';
var colors = ['green', 'yellow', 'red', 'black', 'pink', 'orange', 'brown', 'gray']
var rte = '';
var dxt;
var dist;
// Bosch Bidadi : 12.797368, 77.423862
/**
 * @param {Object} route
 * @param   {H.service.Platform} platform  
 */

function generateClusterJSON(rows) {
    return {
        "data": rows,
        "length": rows.length
    }
}

async function calculateRouteFromAtoB(pt1, pt2, dfxr = false) {
    let stp1 = pt1[0] + ',' + pt1[1];
    let stp2 = pt2[0] + ',' + pt2[1];
    var router = platform.getRoutingService()
    var routeRequestParams = {
        mode: 'fastest;car',
        representation: 'display',
        routeattributes: 'waypoints,summary,shape,legs',
        waypoint0: stp1,
        waypoint1: stp2
    };
    var uus = new Promise(function (resolve, reject) {
        router.calculateRoute(
            routeRequestParams,
            function (result) {
                dxt = result.response.route[0].summary.distance;
                var route = result.response.route[0];
                if(dfxr)
                addRouteShapeToMap(route);
                resolve();
            }
        );
    })
    await uus;
}

function addRouteShapeToMap(route) {
    var lineString = new H.geo.LineString(),
        routeShape = route.shape,
        polyline;
    routeShape.forEach(function (point) {
        var parts = point.split(',');
        lineString.pushLatLngAlt(parts[0], parts[1]);
    });
    polyline = new H.map.Polyline(lineString, {
        style: {
            lineWidth: 4,
            strokeColor: 'rgba(255, 40, 30, 0.7)'
        }
    });
    map.addObject(polyline);
    map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
    });
}

async function calculateDistances(clusters) {
    dist = [];
    for (var i = 0; i < clusters.length; i++) {
        let cluster = clusters[i];
        let y = [];
        for (var j = 0; j < cluster.length; j++) {
            let x = [];
            for (var k = 0; k < cluster.length; k++) {
                x.push(0);
            }
            y.push(x);
        }
        dist.push(y);
    }
    for (var i = 0; i < clusters.length; i++) {
        let cluster = clusters[i];
        for (var j = 0; j < cluster.length; j++) {
            for (var k = j; k < cluster.length; k++) {
                await calculateRouteFromAtoB(cluster[j], cluster[k])
                let l1 = dxt;
                await calculateRouteFromAtoB(cluster[k], cluster[j])
                let l2 = dxt;
                    if (j != k){
                        dist[i][j][k] = Math.min(l1, l2);
                        dist[i][k][j] = Math.min(l1, l2);
                    }
                    else
                        dist[i][j][k] = 0;
            }
        }
        console.log(i);
    }
    return dist
}

function generateDistanceJSON(clusters, dist) {
    let clen = [];
    for (var i = 0; i < dist.length; i++) {
        clen.push(dist[i].length);
    }
    var tp = {
        "data": dist,
        clusters,
        "nclusters": dist.length,
        clen
    }
    return tp;
}

function removeAllMarkers() {
    for (var i = 0; i < allMarkers.length; i++)
        map.removeObject(allMarkers[i]);
    allMarkers = []
}

function makeMarker(lat, lng, ico) {
    lat = '' + lat;
    lng = '' + lng;
    var x = new H.map.Marker({
        lat: parseFloat(lat).toFixed(4),
        lng: parseFloat(lng).toFixed(4)
    }, {
        icon: ico
    });
    allMarkers.push(x);
    map.addObject(x);
}
function makeMarker2(lat, lng, ico) {
    lat = '' + lat;
    lng = '' + lng;
    var x = new H.map.Marker({
        lat: parseFloat(lat).toFixed(4),
        lng: parseFloat(lng).toFixed(4)
    }, {
        icon: ico
    });
    //allMarkers.push(x);
    map.addObject(x);
}

function insertClusters(clusters) {
    let r, lat = 0,
        lng = 0,
        parisIcon;
    for (var i = 0; i < clusters.length; i++) {
        parisIcon = new H.map.Icon(svgMarkup.replace('${FILL}', colors[i]).replace('${TEXT}', i + 1));
        r = clusters[i];
        for (var j = 0; j < r.length; j++) {
            makeMarker(r[j][0], r[j][1], parisIcon);
        }
    }
}

async function pathMakerOrdered(order){
    let cls=[];
    console.log(order)
    for(var i=0; i<order.length; i++){
        cls=order[i];
        for(var j=0; j<cls.length-1; j++){
            await calculateRouteFromAtoB(cls[j], cls[j+1], true);
        }
    }
}

async function worker() {
    let urlCluster = urlServer + '/uploadPoints';
    var clusters = (await axios.post(urlCluster, generateClusterJSON(rows))).data;
    removeAllMarkers();
    insertClusters(clusters);
    var dist = await calculateDistances(clusters);
    let urlDistance = urlServer + '/uploadDistances';
    let dstx = generateDistanceJSON(clusters, dist);
    var orderedDistance = await (axios.post(urlDistance, dstx));
    console.log("writing Distance.csv done")
}


async function second_worker(){
    let UrlOrdered = urlServer + '/uploadOrdered';
    var a = 0;
    var orderedDistance = await (axios.post(UrlOrdered,a));
    orderedDistance = orderedDistance.data.data;
    await pathMakerOrdered(orderedDistance);
    console.log("Routing done");
}
document.getElementById('routeListen').addEventListener('click', worker);
document.getElementById('displayPath').addEventListener('click', second_worker);
let BidadiIcon;
BidadiIcon = new H.map.Icon(svgMarkup.replace('${FILL}', colors[0]).replace('${TEXT}', "B"));
makeMarker2(12.797368, 77.423862,BidadiIcon);