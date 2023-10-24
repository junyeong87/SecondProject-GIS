let liveLine, livePoint, liveVectorSource;
let fmtToday;
let intervalID;

window.addEventListener('load', function() {

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    fmtToday = year + "-" + month + "-" + date;

    let tabBtn = document.querySelector('.tab-btn');
    let liveBtn = document.querySelector('[data-toggle="toggle"]');
    let offCanvas = document.getElementById("offcanvasScrolling");
    let mapSize = document.querySelector('.map');
    let timer = document.querySelector('.timer');
    let offCanvasObj = new bootstrap.Offcanvas(offCanvas);
    let csvDownload = document.querySelector('.download-btn');


    liveBtn.addEventListener('click', function () {
        if (liveBtn.classList.contains('off')) {
            location.reload();
            console.log("live stop")
            offCanvasObj.show();
            // csvDownload.style.display = 'block';
            timer.classList.remove('timer-show');
            // map.removeLayer(liveVectorSource);

            removeAllCarLayers();
            map.removeLayer(multiLineStringLayer);



            mapSize.classList.add('map-active')
            mapSize.classList.remove('map-non-active');
            tabBtn.setAttribute('data-bs-target', '#offcanvasScrolling');
            tabBtn.setAttribute('data-bs-toggle', 'offcanvas');

            map.getView().animate({
                center: ol.proj.transform([127.1213408459, 37.2674315832], 'EPSG:4326', 'EPSG:3857'),
                zoom: 12,
                duration: 1500
            });

            clearInterval(intervalID);
            console.log("interval 중지");

        } else {

            console.log("live start")
            // csvDownload.style.display = 'none';
            timer.classList.add('timer-show');
            // livePointLayer(fmtToday);
            // liveLineLayer(fmtToday);
            liveGpsPoint(fmtToday);

            map.removeLayer(cleanPoint);
            map.removeLayer(cleanLine);
            map.removeLayer(noCleanRoute);
            map.removeLayer(startPoint);
            map.removeLayer(endPoint);

            map.addLayer(multiLineStringLayer);



            intervalID = setInterval(function (){
                liveUpdateLayer(fmtToday)

            }, 2000);


            tabBtn.removeAttribute('data-bs-target');
            tabBtn.removeAttribute('data-bs-toggle');
            offCanvasObj.hide();
            mapSize.classList.remove('map-active')
            mapSize.classList.add('map-non-active')
        }
        console.log("today = " + fmtToday);
    });

    let setMinute = document.querySelectorAll('.set-minute');
    let minute;

    setMinute.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            minute = e.target.id;
            console.log("minute = " + minute);

            $.ajax({
                type: 'post',
                url: '/api/sensor/cycle',
                // dataType: 'json',
                // contentType: 'application/json; charset=utf-8',
                data: minute,
                success: function (result) {
                    console.log("success");
                },
                error: function (error) {
                    console.log(error);
                },
            });

        })
    })

});


function liveUpdateLayer(today) {
    // map.removeLayer(layerGroup);
    // map.removeLayer(liveVectorSource);
    liveGpsPoint(today);
    map.render();
    console.log("update Layer");
}


function liveGpsPoint(today) {

    let carNum;
    let prevPoint;

    $.ajax({
        type: 'post',
        url: '/api/live/gps',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(today),
        success: function (result) {
            console.log("success");
            console.log(Array.isArray(result));

            if (Array.isArray(result)){
                for (let i = 0; i < result.length; i++) {
                    let gps = result[i];
                    if (gps != null) {
                        console.log("lon = " + gps.lon +  "lat = " + gps.lat);

                        let currentPoint = [gps.lon, gps.lat];

                        getPoint(currentPoint, gps.carNum);

                        if (prevPoint !== currentPoint) {
                            addPointToMultiLine(currentPoint, gps.carNum);
                        }
                        prevPoint = currentPoint;
                    }
                }
            }
            // map.addLayer(layerGroup);

        },
        error: function (error) {
            console.log("live Gps Error");
            console.log(error);
        },
    });
}

let carLayers = {};
function getPoint(point, carNum) {

    // if (carLayers[carNum]) {
    //     map.removeLayer(carLayers[carNum]);
    // }


    const transformedPoint = new ol.geom.Point(point).transform('EPSG:4326', 'EPSG:3857');
    let tempLivePoint = new ol.Feature({
        geometry: transformedPoint,
        name: 'LiveGpsPoint',
        population: 4000,
        rainfall: 500
    });

    let iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'img/clean_car.png',
            scale: 0.07,
        }),
        text: new ol.style.Text({
            font: 'bold 15px Verdana',
            scale: 1,
            text: carNum,
            fill: new ol.style.Fill({
                color: 'black',
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            }),
            offsetY:-10,
        }),
        zindex: 10
    });

    tempLivePoint.setStyle(iconStyle);
    if (!carLayers[carNum]) {

        let vectorSource = new ol.source.Vector({
            features: [tempLivePoint]
        });

        carLayers[carNum] = new ol.layer.Vector({
            source: vectorSource
        });

        // liveVectorSource = new ol.layer.Vector({
        //     source: vectorSource
        // });

        map.addLayer(carLayers[carNum]);

    } else {
        carLayers[carNum].getSource().clear();
        carLayers[carNum].getSource().addFeature(tempLivePoint);
    }
}

function removeAllCarLayers() {
    for (const carNum in carLayers) {
        map.removeLayer(carLayers[carNum]);
    }
    carLayers = {}; // carLayers 객체 초기화
}

let multiLineStringCoords = [];

// 새로운 LineString을 만들고 좌표를 추가할 때마다 multiLineStringCoords 배열에 추가합니다.
function
addPointToMultiLine(point, carNum) {
    const pointGeom = new ol.geom.Point(point).transform('EPSG:4326', 'EPSG:3857');

    if (!multiLineStringCoords[carNum]) {
        // 해당 carNum에 MultiLineString이 없으면 생성합니다.
        multiLineStringCoords[carNum] = [];
    }

    multiLineStringCoords[carNum].push(pointGeom.getCoordinates());

    updateMultiLineStringLayer();
}

var style = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 6
        })
    }),
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 4
        })
    }),
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        })
    })
];
function updateMultiLineStringLayer() {
    const features = [];

    // 각 carNum에 해당하는 MultiLineString을 features 배열에 추가합니다.
    for (const carNum in multiLineStringCoords) {
        const coords = multiLineStringCoords[carNum];
        const multiLineString = new ol.geom.MultiLineString([coords]);
        const multiLineStringFeature = new ol.Feature({
            geometry: multiLineString
        });


        multiLineStringFeature.setStyle(style);
        features.push(multiLineStringFeature);
    }

    // MultiLineString 레이어 업데이트
    multiLineStringLayer.getSource().clear();
    multiLineStringLayer.getSource().addFeatures(features);
}

// 초기 MultiLineString 레이어를 생성합니다.
const multiLineStringLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: []
    })
});



