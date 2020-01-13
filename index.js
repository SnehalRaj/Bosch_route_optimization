/*
    The app should use a proper database linked to the account of each user however,
    for current presentation,
    this is sufficient.
*/ 

let express = require('express')
let bodyParser = require('body-parser')
let axios = require('axios')
let cors = require('cors')
let fs = require('fs')
const { exec } = require('child_process');
let app = express()
app.use(cors())
let router = express.Router()
app.use(bodyParser.json({
    type: 'application/json'
}))

const command = './generateClusters'
const command2 = './generatePaths'

// const command = './generateCluster'
// const command2 = './generatePaths'

function writeToCSVT1(data){
    let strx = data.length+'\n';
    let ptarr = data.data;
    for(var i=0; i<data.length; i++){
        strx = strx+ptarr[i][0]+', '+ptarr[i][1]+'\n';
    }
    fs.writeFileSync('coords.csv', strx);
}

function writeToCSVT2(data){
    let strx = data.nclusters+'\n';
    let clen = data.clen;
    let dist = data.data;
    let ptarr = data.clusters;
    for(var i=0; i<data.nclusters; i++){
        strx = strx+clen[i]+'\n';
        for(var j=0; j<clen[i]; j++){
            strx = strx+ptarr[i][j][0]+' '+ptarr[i][j][1]+'\n';
        }
        for(var j=0; j<clen[i]; j++){
            for(var k=0; k<clen[i]; k++)
                strx = strx+dist[i][j][k]+' ';
            //strx = strx.substring(0, strx.length-2)
            strx = strx+'\n';
        }
    }
    fs.writeFileSync('distances.csv', strx);
}

function readFromCSV(fname){
    let i = 0, x = 0;
    let file = String(fs.readFileSync(fname))
    let lines = file.split('\n')
    let nclusters = parseInt(lines[x])
    let line = '', segments = [], lat, lng
    let data=[], clstr=[]
    for(;i<nclusters;i++){
        x++;
        let npts = parseInt(lines[x])
        clstr=[]
        for(let j=0; j<npts; j++){
            x++;
            line = lines[x];
            segments = line.split(', ')
            lat = parseFloat(segments[0])
            lng = parseFloat(segments[1])
            clstr.push([lat, lng])
        }
        data.push(clstr)
    }
    // console.log(data)
    return data
}

async function getClusters(){
    var promiseForClusters = new Promise(function (resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }
            else{
                resolve();
            }
        });
    })
    await promiseForClusters;
    return readFromCSV('clusters2.csv');
}

async function getSomethingMoreDone(){
    var promiseForClusters = new Promise(function (resolve, reject) {
        exec(command2, (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }
            else{
                resolve();
            }
        });
    })
    await promiseForClusters;
    return readFromCSV('ordered.csv');
}

app.post('/uploadPoints', (req, res) => {
    var data = req.body;
    writeToCSVT1(data);
    getClusters().then((dt1) => {
        res.json(dt1);
        res.end();        
    }).catch((err)=>{res.json({err});res.end();});
})

app.post('/uploadDistances', (req, res) => {
    var data = req.body;
    writeToCSVT2(data);
    /* getSomethingMoreDone().then((dt1) => {
        console.log(dt1);
        res.json({"data":dt1});
        res.end();
    }).catch((err)=>{res.json({err});res.end();}); */
})

app.post('/uploadOrdered',(req,res) => {
    //var orderedDistance = readFromCSV('ordered.csv');
    //orderedDistance = orderedDistance.data.data;
    /* var promiseForClusters = new Promise(function (resolve, reject) {
        exec(command2, (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }
            else{
                resolve();
            }
        });
    }) */
    console.log("Paths generated");
    var orderedDistance = readFromCSV('ordered.csv')
    res.json({"data":orderedDistance});
    res.end();
})

app.get('/nigga', (req, res) => {
    let sucker = "CUNT"
    res.json(sucker);
    res.end();
})

app.use('/', router)
app.listen(8000)