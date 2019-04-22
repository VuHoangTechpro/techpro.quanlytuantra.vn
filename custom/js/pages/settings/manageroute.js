$(async () => {
  // enable alert 
  $('.alert').alert();
  $( ".sortable" ).sortable({
    update: function(event, ui){
      let alerts = $(event.target).find('.alert');
      arrSelectedPointsOnRoute = [];
      Array.from(alerts).forEach(alert => {
        let id = alert.dataset.point
        let point = arrPointsOnZone.find(p => p.iCheckPointID == id.trim());
        arrSelectedPointsOnRoute.push(point);
      })
      calcDistance();
      setTimeout(() => {
        showRouteMap();
      }, 100)
    }
  }); 

  $('#selectRouteZone').change((e) => {
    filterPointsByZoneID();
    showRoutesOnTable();
    $('#selectedPointsOnRoute').html('');
    showRouteMap();
  }) 
  $('#btnSaveSelectedPoints').click(showInsertRouteModal);
  $('#modalUpdateRouteGuard').find('.btn.btnSaveRouteUpdateGuard').click(updateRoute);

  $('#btnSaveInsertRoute').click(saveRoute);
  SelectComponentService.renderGuardSelectList(false);
  await SelectComponentService.renderZoneSelectList();
  await getPointsOfAllZones();
  await getRoutesData();
  filterRoutesByZoneID();
  filterPointsByZoneID();
  showRouteMap();
})

let arrSelectedPointsOnRoute = [];
let arrPointsOnZone = [];
let currentTotalDistance = 0;
let currentUpdateRoute = null;
let currentMapAllRoute = null;
let arrCurrentRoutesOnZone = [];
let currentSelectedRoutePolyline = null;

//update route points data
let currentRouteUpdatePoints = null;     
let currentCreatedRoutepolyline = null;

// let arrCurrentRoutesOnZone_UpdateRoutePoints = [];
let arrRoutes = [];
let arrFilteredRoutes = [];

$('#txtInsertSpeed').keyup(e => showMinTime(e, true));
//$('#txtInsertCompletionTime').keyup(e => showTourExecute(e, true));
$('#txtUpdateSpeed').keyup(e => showMinTime(e, false));
//$('#txtUpdateCompletionTime').keyup(e => showTourExecute(e, false));
$('#txtInsertBreakTime').keyup(e => showTourInsertExecute(e, false));
$('#txtUpdateBreakTime').keyup(e => showTourUpdateExecute(e, false));

async function getRoutePoints(route){
  const { iRouteID } = route;
  let sentData = { iRouteID };
  let data = await RouteService.getRouteDetailsData(sentData);
  return data;
}


// async function showUpdateRoutePointsModal(route){
//   console.log(route);
//   currentRouteUpdatePoints = route;
//   const { iRouteID, iZoneID } = route;
//   showPointsOnZone_UpdateRoutePoints(route.iZoneID);
//   let sentData = { iRouteID };
//   let data = await RouteService.getRouteDetailsData(sentData);
//   buildRouteMapOnModal_UpdatePointsOnRoute(data, 'modalUpdateRoutePoints');
  
//   getRoutePoints(route);
  
//   $('#modalUpdateRoutePoints').modal('show');
// }

function showInsertRouteModal(){
  if(arrSelectedPointsOnRoute.length == 0) return AlertService.showAlertError("No Points on route!!!", "Please choose point map to create a route", 6000);
  $('#txtInsertRouteName').val('');
  $('#txtInsertBreakTime').val('');
  $('#txtInsertTourExecute').val('');
  if(arrSelectedPointsOnRoute.length == 1){
    $('#txtInsertDistance').val('0').parent('.form-group').hide(0);
    $('#txtInsertSpeed').val('0').parent('.form-group').hide();
    $('#txtInsertMinTime').val('0').parent('.form-group').hide(0);
    $('#txtInsertCompletionTime').val('0').parent('.form-group').hide(0);
    $('#txtInsertRouteType').parent('div').hide(0);
  }else{
    $('#txtInsertDistance').val(currentTotalDistance).parent('.form-group').show(0);
    $('#txtInsertSpeed').val('').parent('.form-group').show(0);
    $('#txtInsertMinTime').val('').parent('.form-group').show(0);
    $('#txtInsertCompletionTime').val('').parent('.form-group').show(0);
    $('#txtInsertRouteType').parent('div').show(0);
  }
  $('#modalInsertRoute').modal('show');
}

function showMinTime(e, insert){
  let val = e.target.value;
  let txtMinTime = $('.txtMinTime');
  let cond = !ValidationService.checkPositiveNumber(val);
  if(cond) return txtMinTime.val('');
  let speed = Number(val);
  let distance = $('#txtUpdateDistance').val();
  if(insert) distance = $('#txtInsertDistance').val();
  if(ValidationService.checkPositiveNumber(distance)) distance =  Number(distance);
  let minTime = Math.floor(distance/speed * 60);
  txtMinTime.val(minTime);
}

function showTourInsertExecute(e){
  let val = e.target.value;
  let txtTourEx = $('.tourExecute');
  let maxTime = $('#txtInsertCompletionTime').val();
  if(!ValidationService.checkPositiveNumber(val)) return txtTourEx.val('');
  let tourEx = 1440/(Number(val) + Number(maxTime));
  txtTourEx.val(tourEx);
}

function showTourUpdateExecute(e){
  let val = e.target.value;
  let txtTourEx = $('.tourExecute');
  let maxTime = $('#txtUpdateCompletionTime').val();
  if(!ValidationService.checkPositiveNumber(val)) return txtTourEx.val('');
  let tourEx = 1440/(Number(val) + Number(maxTime));
  txtTourEx.val(tourEx);
}

function buildRouteMapOnModal(data, id = 'modalViewMapRoute'){
  let $mapArea = $(`<div id="mapArea" class="mymap"></div>`);
  $(`#${id}`).find('.modal-body').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($mapArea[0], mapProp);
  let icon = '../../img/Checked.png';
  if(data){
    let arrPointsCoordination = [];
    data.forEach((point, index) => {
      const { dCheckPointLat, dCheckPointLong, iQRCode, iRFID } = point;
      let type = getPointType(point);
      let lat = Number(dCheckPointLat);
      let lng = Number(dCheckPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      let mes = `${index + 1} - ${type}`;
      arrPointsCoordination.push([lat, lng])
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      infoWindow.open(mymap, marker);
    })
    let path = arrPointsCoordination.map(point => {
      return new google.maps.LatLng(point[0], point[1]);
    });
    let polyline = GoogleMapService.createPolyline(path);
    polyline.setMap(mymap);
  }
}

async function showRouteMap(){
  let iZoneID = $('#selectRouteZone').val();
  arrCurrentRoutesOnZone.length = 0;
  arrCurrentRoutesOnZone = arrRoutes.filter(r => r.iZoneID == iZoneID);
  //console.log(arrCurrentRoutesOnZone);
  buildRouteMap();
}

function buildRouteMap(){
  let $mapArea = $(`<div id="routeMap" class="map"></div>`);
  $('.card-route-map').find('.card-body').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  currentMapAllRoute = new google.maps.Map($mapArea[0], mapProp);
  let iconChecked = '../../img/Checked.png';
  let iconRoutePoint = '../../img/point.png';
  if(arrSelectedPointsOnRoute){
    currentSelectedRoutePolyline = buildPolylineRoute(arrSelectedPointsOnRoute, iconRoutePoint, 'red');
  }
  if(arrCurrentRoutesOnZone && arrCurrentRoutesOnZone.length > 0)
  arrCurrentRoutesOnZone.forEach(route => {
    // console.log(route);
    arrPoints = JSON.parse(route.PointObject);
    //console.log(arrPoints);
    buildPolylineRoute(arrPoints, iconChecked, 'green');
  })
}

function buildPolylineRoute(data, icon, strokeColor){
  let arrPointsCoordination = [];
  if(!data) return;
  data.forEach((point, index) => {
    const { dCheckPointLat, dCheckPointLong, iCheckPointID, iNo } = point;
    let type = getPointType(point);
    let lat = Number(dCheckPointLat);
    let lng = Number(dCheckPointLong);
    let pos = new google.maps.LatLng(lat, lng);
    let mes = `${iNo} - ${type}`;
    arrPointsCoordination.push([lat, lng])
    let marker = GoogleMapService.createMarker(pos, icon);
    marker.setMap(currentMapAllRoute);
    let infoWindow = GoogleMapService.createInfoWindow(mes);
    marker.addListener('click', () => {
      infoWindow.open(currentMapAllRoute, marker);
    })
  })
  let path = arrPointsCoordination.map(point => {
    return new google.maps.LatLng(point[0], point[1]);
  });
  let polyline = GoogleMapService.createPolyline(path, strokeColor);
  polyline.setMap(currentMapAllRoute);
  return polyline;
}

// function renderZoneOnJcombobox(data) {
//   $('.selectZones').html('');
//   if (data) {
//     data.forEach(zone => {
//       $('.selectZones').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
//     })
//   }
// }

// async function showAllZones(){
//   let data = await ZoneService.getAllZones();
//   renderZoneOnJcombobox(data);
// }
let arrPointsOfAllZones = [];

async function getPointsOfAllZones(){
  let sentData = CommonService.getSentDataCompanyCode();
  let zones = await ZoneService.getCheckPointForCreateRoute(sentData);
  //console.log(zones);
  arrPointsOfAllZones.length = 0;
  arrPointsOnZone.length = 0;
  if(zones) arrPointsOfAllZones = zones.slice();
}

function filterPointsByZoneID(){
  let id = $('#selectRouteZone').val();
  arrPointsOnZone = arrPointsOfAllZones.filter(item => item.iZoneID == id);
  arrSelectedPointsOnRoute.length = 0;
  renderPointsOnZone(arrPointsOnZone);
}

// async function showPointsOnZone(id = 'selectRouteZone'){
//   let iZoneID = $(`#${id}`).val();
//   if(!iZoneID) iZoneID = 1;
//   let sentData = { iZoneID };
//   let points = await PointService.getPointsDataOnZone(sentData);
//   if(points) arrPointsOnZone = points.slice();
//   else arrPointsOnZone = [];
//   arrSelectedPointsOnRoute = [];
//   renderPointsOnZone(points);
// }

function renderPointsOnZone(points, id = 'pointsOnZone'){
  $(`#${id}`).html('');
  if(points && points.length > 0){
    points.forEach(point => {
      const { iCheckPointID, sCheckPointName } = point;
        let type = PointService.getPointType(point);
        $(`#${id}`).append(`
        <li class="list-group-item">
          <input type="checkbox" class="checkbox-custom checkboxPoint" style="margin-right: 10px" value="${iCheckPointID}">
          <span class="point">${sCheckPointName} - ${type}</span>
        </li>
      `)
      $(`#${id}`).find('.checkboxPoint').last().change(function(e){
        showSelectedPointWhenCheckbox(e, point);
      })
    })
  }
}

function getPointType(point){
  const { bQRCode, bRFID } = point;
  let type = 'GPS';
  if(bQRCode != '') type = 'QRCode';
  if(bRFID != '') type = 'RFID';
  return type;
}

function showSelectedPointWhenCheckbox(e, point){
  let { checked, value } = e.target;
  if(checked) arrSelectedPointsOnRoute.push(point);
  else{
    let index = arrSelectedPointsOnRoute.findIndex(point => point.iPointID == value);
    arrSelectedPointsOnRoute.splice(index, 1);
  }
  renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  calcDistance();
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  }, 100)
}

function showSelectedPointWhenRemoveAlert(point){
  let index = arrSelectedPointsOnRoute.findIndex(p => point.iCheckPointID == p.iCheckPointID);
  arrSelectedPointsOnRoute.splice(index, 1);
  renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  let checkboxes = $('#pointsOnZone').find('.checkboxPoint');
  Array.from(checkboxes).forEach(checkbox => {
    if($(checkbox).val().trim() == point.iCheckPointID){
      $(checkbox).prop({checked: false});
    }
  })
  calcDistance();
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  }, 100)
}

function calcDistance(){
  if(arrSelectedPointsOnRoute.length > 0){
    let totalDistance = GoogleMapService.calDistanceOfRoute(arrSelectedPointsOnRoute);
    currentTotalDistance = Number(totalDistance.toFixed(2));
    //console.log(currentTotalDistance);
  }
}

function renderListOfSelectedPoints(selectedPoints){
  $('#selectedPointsOnRoute').html('');
  if(selectedPoints){
    selectedPoints.forEach(point => {
      const { iCheckPointID, sCheckPointName } = point;
      let type = PointService.getPointType(point);
      $('#selectedPointsOnRoute').append(`
        <div class="alert alert-success alert-dismissible fade show" role="alert" data-point="${iCheckPointID}" style="cursor: pointer;">${sCheckPointName} - ${type}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `)
      $('#selectedPointsOnRoute').find('.alert').last().on('closed.bs.alert', function(e){
        showSelectedPointWhenRemoveAlert(point)
      })
    })
  }
}

// {"sCompanyCode":"deepC_2510180932006129", "iRouteID":0, "iZoneID":30, 
// "sRouteName":"TEst 11111111", "dDistance":10, 
// "iSpeed":10,"iMaxTime":20,"iMinTime":15,"iTourExecute":15,
// "iBreakTime":20,"iDeviceID":2,"bStatus":1,"Point":"[{PointID: 441, No: 1}, {PointID: 442, No: 2}, 
//   {PointID: 443, No: 3}]"}

async function saveRoute(){
  let sCompanyCode = getUserAuth().CompanyCode;
  let sRouteName = $('#txtInsertRouteName').val();
  let type = $('.txtInsertRouteType').prop('checked');
  let iSpeed = $('#txtInsertSpeed').val();
  let iMinTime = $('#txtInsertMinTime').val();
  let iMaxTime = $('#txtInsertCompletionTime').val();
  let iTourExecute = $('#txtInsertTourExecute').val();
  let iGuardID = $('#selectInsertRouteGuard').val();
  let iBreakTime = $('#txtInsertBreakTime').val();
  let bStatus = 1;
  let iRouteID = '0';
  let iKindRoute = 0;
  let iZoneID = $('#selectRouteZone').val();
  let dDistance = currentTotalDistance;
  let { valid, errMsg } = validateRouteData(sRouteName, iSpeed, iMinTime, iMaxTime, iTourExecute, iBreakTime)
  if(!valid) return AlertService.showAlertError('Invalid data!!', errMsg);

  let arr_1 = arrSelectedPointsOnRoute.map((p, index) => {
    const { iCheckPointID } = p;
    return { PointID: iCheckPointID, No: index + 1 }
  })

  let arrPoints = arr_1.slice();

  if(!type) {
    let arr_1_copy = arr_1.map(item => Object.assign({}, item));
    let arr_2 = arrPoints.concat(arr_1_copy.reverse());
    arr_2.splice(arr_1.length, 1);
    arr_2.forEach((item, index) => {
      if(index > arr_1.length - 1) {
        item.No = index + 1
      }
    })
    arrPoints = arr_2;
    iKindRoute = 0;
  }
  else
  {
    iKindRoute = 1;
  }

  let Point = arrPoints.slice();

  let sentData = { sCompanyCode, iRouteID, iZoneID, sRouteName, dDistance, iSpeed, iMaxTime, iMinTime, iTourExecute, iBreakTime, iGuardID, iKindRoute, bStatus, Point };
  //console.log(JSON.stringify(sentData));
  let response = await RouteService.saveRoute(sentData);
  //console.log(response);
  let { Result, Msg } = JSON.parse(response)[0];
  if(Result == 1){
    $('#modalInsertRoute').modal('hide');
    AlertService.showAlertSuccess("Save successfully!", "", 4000);
    await getRoutesData();
    showRoutesOnTable();
    resetAfterSavingRoute();
  }else{
    AlertService.showAlertError("Insert unsuccessfully!", "", 4000);
  }
  
}

function validateRouteData(name, speed, min, max, tourEx, iBreakTime){
  let errMsg = '';
  let valid = true;
  if(!ValidationService.checkEmpty(name)) {
    errMsg += 'Name is required!!\n';
    valid = false;
  }
  if(!ValidationService.checkPositiveNumber(speed)) {
    errMsg += 'Speed must be positive number!!\n';
    valid = false;
  }
  if(!ValidationService.checkPositiveNumber(min)) {
    errMsg += 'Min Time must be positive number!!\n';
    valid = false;
  }
  if(!ValidationService.checkPositiveNumber(max)) {
    errMsg += 'Time Completion must be positive number!!\n';
    valid = false;
  }
  if(!ValidationService.checkPositiveNumber(tourEx)) {
    errMsg += 'TourExecute must be positive number!!\n';
    valid = false;
  }
  if(!ValidationService.checkPositiveNumber(iBreakTime)) {
    errMsg += 'BreakTime must be positive number!!\n';
    valid = false;
  }
  return { valid, errMsg };
}

function resetAfterSavingRoute(){
  $('#txtSaveRouteName').val('');
  arrSelectedPointsOnRoute.length = 0;
  renderListOfSelectedPoints(null);
  $('.sumOfDistance').text('');
  $('.timeCompleted').text('');
  buildRouteMap();
  filterPointsByZoneID();
}

async function deleteRoute(route){
  let sure = await AlertService.showAlertWarning("Are you sure", "");
  if(sure){
    const { iRouteID, iZoneID } = route;
    let sCompanyCode = getUserAuth().CompanyCode;
    let sRouteName = '', dDistance = '0', iSpeed = '0', iMaxTime = '0', iMinTime = '0', iTourExecute = '0', iBreakTime = '0', iGuardID = '0', Point = null;
    let bStatus = 3;
    let sentData = { sCompanyCode, iRouteID, iZoneID, sRouteName, dDistance, iSpeed, iMaxTime, iMinTime, iTourExecute, iBreakTime, iGuardID, bStatus, Point };
    let response = await RouteService.deleteRoute(sentData);
    //let success = CommonService.getResponseResult(response);
    //console.log(response);
    // console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    // console.log(Result);
    if(Result == 1){
      AlertService.showAlertSuccess("Locked successfully!", "", 4000);
      await getRoutesData();
      showRoutesOnTable();
    }else{
      AlertService.showAlertError("Locked unsuccessfully!", "", 4000);
    }
  } 
}

function filterRoutesByZoneID(){
  let zoneId = $('#selectRouteZone').val();
  arrFilteredGuards = FilterService.filterDataByID(arrRoutes, 'iZoneID', zoneId);
  showRoutePagination(arrFilteredRoutes)
}

async function getRoutesData(){
  let sentData = CommonService.getSentDataCompanyCode();
  let routes = await RouteService.getRoutes(sentData);
  arrRoutes.length = 0;
  arrFilteredRoutes.length = 0;
  if(routes){
    arrRoutes = routes.slice();
    arrFilteredRoutes = routes.slice();
  }else{
    AlertService.showAlertError("No data available", "", 3000);
  }
}

async function showRoutesOnTable(){
  showRoutePagination(arrRoutes);
  setDefaultLang();
}

function showRoutePagination(data){
  if(!data || data.length == 0) return resetTblRoutes();
  $('#totalRoutes').html(`<strong class="trn">Total Routes</strong> ${data.length}`);
  $('#pagingRoutesControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderTableRoutes(data);
      $('.card-route .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblRoutes(){
  $('#totalRoutes').html('');
  $('#pagingRoutesControl').html('');
  $('#tblRoutes').find('tbody').html('');
}

function renderTableRoutes(routes){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblRoutes"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Zone</th>
        <th class="trn">Route</th>
        <th class="trn">Guard</th>
        <th class="trn">Distance</th>
        <th class="trn">Speed</th>
        <th class="trn">Min time</th>
        <th class="trn">Max time</th>
        <th class="trn">Break time</th>
        <th class="trn">Tour execute</th>
        <th class="trn">Updated</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (routes) {
    routes.forEach((route, index) => {
      const { sGuardName, dDateTimeUpdated, dDistance, iSpeed, iMaxTime, sRouteName, sZoneName, iMinTime, iTourExecute, iBreakTime} = route;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sGuardName}</td>
          <td>${dDistance} km</td>
          <td>${iSpeed} km/h</td>
          <td>${iMinTime} min</td>
          <td>${iMaxTime} min</td>
          <td>${iBreakTime}</td>
          <td>${iTourExecute}</td>
          <td>${dDateTimeUpdated}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-success btnRouteViewMap btn-custom-small dropdown-item trn">Map</button>
                <button class="btn btn-custom btn-info btnRouteUpdateGuard btn-custom-small dropdown-item trn">Update Route</button>
                <button class="btn btn-custom btn-primary btnShowUpdateRoutePointsModal btn-custom-small dropdown-item trn">Update Route points</button>
                <button class="btn btn-custom btn-warning btnInactiveRoute btn-custom-small dropdown-item trn">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnRouteUpdateGuard').last().click(function(){
        showUpdateRouteGuardModal(route);
      })
      $tbody.find('.btn.btnRouteViewMap').last().click(function(){
        showRouteViewMapModal(route);
      })
      $tbody.find('.btn.btnInactiveRoute').last().click(function(){
        deleteRoute(route);
      })
      $tbody.find('.btn.btnShowUpdateRoutePointsModal').last().click(function(){
        showUpdateRoutePointsModal(route);
      })
      
    })
  }
  $table.append($thead).append($tbody);
  return $table;
}

async function showRouteViewMapModal(route){
  const { iRouteID } = route;
  let sentData = { iRouteID };
  //console.log(sentData);
  let data = await RouteService.getRouteDetailsData(sentData);
  //console.log(data);
  $('#modalViewMapRoute').modal('show');
  setTimeout(() => {
    buildRouteMapOnModal(data);
  }, 10);
}

function showUpdateRouteGuardModal(route){
  currentUpdateRoute = Object.assign({}, route);
  //console.log(route);
  const {  iBreakTime, dDistance, iMinTime, iMaxTime, iTourExecute, sRouteName, sZoneName, iSpeed, iGuardID, PointObject} = route;
  let l = JSON.parse(PointObject).length;
  $('#routeUpdateInfo').text(`Route - ${sRouteName} on zone ${sZoneName}`)
  $('#txtUpdateRouteName').val(sRouteName);
  $('#txtUpdateDistance').val(dDistance);
  $('#txtUpdateSpeed').val(iSpeed);
  $('#txtUpdateMinTime').val(iMinTime);
  $('#txtUpdateCompletionTime').val(iMaxTime);
  $('#txtUpdateBreakTime').val(iBreakTime);
  $('#txtUpdateTourExecute').val(iTourExecute);
  $('#selectUpdateRouteGuard').val(iGuardID);
  if(l == 1){
    $('#txtUpdateDistance').parent('.form-group').hide(0);
    $('#txtUpdateSpeed').parent('.form-group').hide(0);
    $('#txtUpdateMinTime').parent('.form-group').hide(0);
    $('#txtUpdateCompletionTime').parent('.form-group').hide(0);
  }else{
    $('#txtUpdateDistance').parent('.form-group').show(0);
    $('#txtUpdateSpeed').parent('.form-group').show(0);
    $('#txtUpdateMinTime').parent('.form-group').show(0);
    $('#txtUpdateCompletionTime').parent('.form-group').show(0);
  }
  $('#modalUpdateRouteGuard').modal('show');
  
}

async function showGuardIdOnCombobox(){
  let guards = await GuardService.getPersonalGuardsInfo();
  $('.selectGuards').html('');
  guards.forEach(guard => {
    const { iGuardID, sGuardName } = guard;
    $('.selectGuards').append(`<option value="${iGuardID}">${sGuardName}</option>`)
  })
}

async function updateRoute(){
  const { iRouteID, dDistance, iZoneID, PointObject } = currentUpdateRoute;
  let sCompanyCode = getUserAuth().CompanyCode;
  let iGuardID = $('#selectUpdateRouteGuard').val(); 
  let iMaxTime = $('#txtUpdateCompletionTime').val();
  let iMinTime = $('#txtUpdateMinTime').val();
  let iSpeed = $('#txtUpdateSpeed').val();
  let sRouteName = $('#txtUpdateRouteName').val();
  let iTourExecute =  $('#txtUpdateTourExecute').val();
  let iBreakTime =  $('#txtUpdateBreakTime').val();
  let bStatus = 2;
  let iKindRoute = 0;
  let Point = JSON.parse(PointObject);
  let sentData = { sCompanyCode, iRouteID, iZoneID, sRouteName, dDistance, iSpeed, iMaxTime, iMinTime, iTourExecute, iBreakTime, iGuardID, iKindRoute, bStatus, Point };
  //con
  //console.log(JSON.stringify(sentData));
  let { valid, errMsg } = validateRouteData(sRouteName, iSpeed, iMinTime, iMaxTime, iTourExecute, iBreakTime)
  if(!valid) return AlertService.showAlertError('Invalid data!', errMsg);
  let response = await RouteService.updateRouteDetail(sentData);
  let { Result, Msg } = JSON.parse(response)[0];
  if(Result == 1){
    $('#modalUpdateRoute').modal('hide');
    AlertService.showAlertSuccess("Updated successfully!", "", 4000);
    resetAfterSavingRoute();
    await getRoutesData();
    showRoutesOnTable();
  }else{
    AlertService.showAlertError("Updated unsuccessfully!", "", 4000);
  }
}


