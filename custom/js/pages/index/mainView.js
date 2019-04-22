
$(() => {

  $('#btnSendSMSGuards').click(sendSMSGuards);
  $('#btnShowModalSendSMSGuards').click(showModalSendSMSGuards)
  $('#btnAttendance').click(checkTime);
  $('#txtSearchGuardName').on('input', filterGuards);
  $('#selectGuardGroup').on('input', filterGuards)
  // $checkboxShowCheckPointMap.change(showCheckPointMap);
  $checkboxShowIncidentsMap.change(e => {
    let { checked } = e.target;
    if(checked) showIncidentsMap();
    else removeMarkersOfIncidents();
  });

  SelectComponentService.renderGroupSelectList(true);

  showCurrentMapGuard();
  showGuardInfo();

})

let currentUserAccount = getUserAuth();

const audioSOS = new Audio('../../custom/audio/alert.wav');

let arrCurrentGuardsSentSMS = [];
let arrCurrentGuards = [];
let arrFilterGuards = [];

let arrIncidentsMap = [];
let arrIncidentMarkersMap = [];
// let data = await IncidentService.getLiveIncident(sentData);

let checkedAllGuardFilter = false;
let mainMapGuard = null;

let $checkboxShowCheckPointMap = $('#checkboxShowCheckPointMap');
let $checkboxShowIncidentsMap = $('#checkboxShowIncidentsMap');

let errorIcon = '../../img/error.png';
let guardOnlineIcon = '../../img/GuardOnline.png';
let guardSOSIcon = '../../img/alert.png';
let guardOfflineIcon = '../../img/GuardOffline.png';
let checkedIcon = '../../img/Checked.png';
let waitingIcon = '../../img/Waiting.png';

let hashmapRouteTrackingGuard = new Map();
let hashmapRouteTrackingPolylineVsMarkers = new Map();

async function showCheckPointMap(checkingCode){
  let data = await TourService.getEventHistoryDetails(checkingCode);
  let sentData = { CheckingCode: checkingCode };
  let dataTracking = await GuardService.getGuardTrackingbyTour(sentData);
  buildCheckPointsOnMap(data, dataTracking);
}

function buildCheckPointsOnMap(data, dataTracking){
  if(data){
    let l1 = data.length;
    data.forEach((detail, index) => {
      let lat = Number(detail.dPointLat);
      let lng = Number(detail.dPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      if (lat != 0 || lng != 0){
        if(detail.sStatus == 'Checked'){
          let mes = `${detail.sGuardName} checked at ${detail.dDateTimeHistory}`
          let icon = '../../img/Checked.png';
          let marker = GoogleMapService.createMarker(pos, icon);
          marker.setMap(mainMapGuard);
          let infoWindow = GoogleMapService.createInfoWindow(mes);
          if(index == 0 || index == l1 - 1) 
            infoWindow.open(mainMapGuard, marker);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(mainMapGuard, marker);
          });
        }else{
          let icon = '../../img/None.png';
          let marker = GoogleMapService.createMarker(pos, icon);
          marker.setMap(mainMapGuard);
        }
      }
    })
  }
  if(dataTracking){
    let path = [];
    dataTracking.forEach(item => {
      const { dGuardLatCurrent, dGuardLongCurrent } = item;
      let lat = Number(dGuardLatCurrent);
      let lng = Number(dGuardLongCurrent);
      if (lat != 0 || lng != 0){
        let pos = new google.maps.LatLng(lat, lng);
        path.push(pos);
      }
    })
    let polyline = GoogleMapService.createPolyline(path);
    polyline.setMap(mymap);
  }
}

async function showIncidentsMap(){
  let sentData = CommonService.getSentDataCompanyCode();
  arrIncidentsMap = await IncidentService.getLiveIncident(sentData);
  if(arrIncidentsMap) buildIncidentsOnMap(arrIncidentsMap);
}

function removeMarkersOfIncidents(){
  arrIncidentMarkersMap.forEach(marker => marker.setMap(null));
  arrIncidentMarkersMap.length = 0;
}

function buildIncidentsOnMap(incidents){
  if(incidents && incidents.length > 0){
    incidents.forEach(incident => {
      const { dIncidentLat, dIncidentLong, ImageUrl, sAlertDescription, dDateTimeIntinial } = incident;
      let lat = Number(dIncidentLat);
      let lng = Number(dIncidentLong)
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${APP_IMAGE_URL}/${ImageUrl}`;
      let mes1 = `${sAlertDescription}`;
      let mes2 = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" style="height: 150px; width: 80px">`;
      let marker = GoogleMapService.createMarker(pos, errorIcon);
      arrIncidentMarkersMap.push(marker);
      marker.setMap(mainMapGuard);
      let infoWindow = GoogleMapService.createInfoWindow(mes1, 160, 100);
      infoWindow.open(mainMapGuard, marker);
      marker.addListener('click', () => {
        let prevMes = infoWindow.getContent();
        infoWindow.open(mainMapGuard, marker);
        if(prevMes == mes1) infoWindow.setContent(mes2);
        else infoWindow.setContent(mes1);
      })
    })
  }
}

function filterGuards(){
  let groupID = $('#selectGuardGroup').val();
  let name = $('#txtSearchGuardName').val();
  let arrFilterName = FilterService.filterGuardByName(arrCurrentGuards, name);
  arrFilterGuards = FilterService.filterGuardByGroup(arrFilterName, groupID);
  renderGuardTable(arrFilterGuards);
  if(checkedAllGuardFilter) {
    arrCurrentGuardsSentSMS.length = 0;
    arrFilterGuards.forEach(guard => {
      arrCurrentGuardsSentSMS.push(guard);
    })
  }
}

async function checkTime(){
  if(arrCurrentGuardsSentSMS.length == 0)
    return AlertService.showAlertError("You have not chosen guard", "Please choose at least 1", 4000);
    let list = selectGuardWithOnlineOrSOS();
    if(list.length == 0) return AlertService.showAlertError("No online guard is chosen!!", "Please choose guard online or sos");
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    let arrID = list.map(g => g.iGuardId);
    let { UserID, CompanyCode } = currentUserAccount;
    let sentData = { iGuardID: arrID, iUserIDSend: UserID, sCompanyCode: CompanyCode };
    let response = await GuardService.checkTime(sentData);
    AlertService.showAlertSuccess("Check Time Successfully", "", 4000);
  }
}

async function sendSMSGuards(){
  let sMessageContent = $('#textareaSendSMSGuards').val();
  let arrID = [];
  let listOfGuardsToSendSMS = selectGuardWithOnlineOrSOS();
  if(listOfGuardsToSendSMS.length > 0){
    listOfGuardsToSendSMS.forEach(g => arrID.push(g.iGuardId));
    let user =  getUserAuth();
    let { UserID, CompanyCode } = user;
    let sentData = { sMessageContent, iGuardID: arrID, sCompanyCode: CompanyCode, iUserIDSend: UserID };
    let response = await GuardService.sendSMSToGuards(sentData);
    AlertService.showAlertSuccess("Send message successfully", "", 2000);
    $('#modalSendSMSGuards').modal('hide');
    resetSMSAfterSending();
  } 
}

function selectGuardWithOnlineOrSOS(){
  return arrCurrentGuardsSentSMS.filter(g => GuardService.checkOnlineOrSOS(g));
}

function resetSMSAfterSending(){
  $('#tblGuard').find('tbody .checkbox-guard-sendSMS').prop({'checked': false});
  $('#tblGuard').find('thead .checkbox-all-guards').prop({'checked': false});
  arrCurrentGuardsSentSMS.length = 0;
}

function showModalSendSMSGuards(){
  if(arrCurrentGuardsSentSMS.length > 0){
    $('#textareaSendSMSGuards').val('');
    let guardNames = '';
    let listOfGuardsToSendSMS = selectGuardWithOnlineOrSOS();
    if(listOfGuardsToSendSMS.length == 0) return AlertService.showAlertError("No guard is online!!!", "Please choose guard is online or sos");
    listOfGuardsToSendSMS.forEach(g => {
      const { sGuardName } = g;
      guardNames += `${sGuardName}, `;
    })
    guardNames = guardNames.substring(0, guardNames.length - 2);
    $('#guardNameList').text(guardNames);
    $('#modalSendSMSGuards').modal('show');
  } else{
    AlertService.showAlertError("You have not chosen guard", "Please choose at least 1");
  }
  
}

function showNumOfGuardsTypes(total, online, sos, GPSerror){
  $('#totalNumOfGuard').html(`<strong class="trn">Totals</strong>: ${total}`);
  $('#totalNumOfGuardSOS').html(`<strong class="trn red-text">SOS</strong>: ${sos}`);
  $('#totalNumOfGuardOnline').html(`<strong class="trn green-text">Online</strong>: ${online}`);
  $('#totalNumOfGPSerror').html(`<strong class="trn grey-text">GPS Error</strong>: ${GPSerror}`);
}

async function showGuardInfo() {
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await GuardService.getGuardsData(sentData);
  //console.log(data);  
  if(data){ 
    arrCurrentGuards = data.slice(); 
    let onlineNum = GuardService.getNumOfOnline(data);
    let sosNum = GuardService.getnumOfSOS(data);
    let GPSerror = GuardService.getnumOfGPSError(data);
    let total = data.length;
    showNumOfGuardsTypes(total, onlineNum, sosNum, GPSerror);
    setTimeout(() => {
      filterGuards();
    }, 100);
    showSOSNotification(data);
  } else {
    arrCurrentGuards.length = 0;
  }
  setDefaultLang();
}

async function showSOSNotification(guards){
  let sosChecking = guards.some(g => g.bOnline.toLowerCase() == 'sos');
  if(sosChecking){
    audioSOS.play();
    await AlertService.showAlertWarning('There are SOS warning situations', "");
    audioSOS.pause();
  }
}

function renderGuardTable(data) {
  let $table = $('#tblGuard')
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
    <tr>
      <th class="trn">
        <input type="checkbox" class="checkbox-all-guards">
      </th>
      <th class="trn">#</th>
      <th class="trn text-left">Name</th>
      <th class="trn">Route</th>
      <th class="trn">Last login</th>
      <th class="trn">Speed (km/h)</th>
      <th class="trn">Idling Time(min)</th>
    </tr>
  `)
  let $checkboxHead = $thead.find('.checkbox-all-guards');
  //console.log(data);
  if (data) {
    data.forEach((guard, index) => {
      const { iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline, iIdlingTime, sRouteName } = guard
      
      let icon = '';
      let className = '';
      if(bOnline == 'SOS') {
        icon = '<i class="fa fa-exclamation-triangle red-text" aria-hidden="true"></i>';
        className = 'red-text';
      }else if(bOnline == 'Online') {
        icon = '<i class="fa fa-circle green-text" aria-hidden="true"></i>';
        className = 'green-text';
        if(Number(dSpeedCurrent) < 3) className = `orange-text`
      }
      
      $tbody.append(`
        <tr>
          <td class="trn">
            <input type="checkbox" class="checkbox-guard-sendSMS">
          </td>
          <td>${index + 1}</td>
          <td class="text-left ${className}">${icon} ${sGuardName}</td>
          <td>${sRouteName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
          <td>${iIdlingTime}</td>
        </tr>
      `)
      let $ele = $tbody.find('.checkbox-guard-sendSMS').last();
      $ele.change(e => {
        let { checked } = e.target;
        if(!checked){
          $checkboxHead.prop({'checked': false});
          checkedAllGuardFilter = false;
        }else{
          showOneCurrentGuardOnMap(guard);
        }
        checkOneGuard(checked, guard);
        showRouteTrackingOfGuard(guard, checked);
      })
      if(!checkedAllGuardFilter){
        let cond = arrCurrentGuardsSentSMS.some(g => g.iGuardId == iGuardId);
        if(cond) $ele.prop({'checked': true});
      }
    })
  }
  $checkboxHead.change(e => { 
    checkAllGuards(e) 
    let { checked } = e.target;
    $tbody.find('.checkbox-guard-sendSMS').prop({'checked': checked});
  })
  if(checkedAllGuardFilter) {
    $checkboxHead.prop({'checked': true});
    $tbody.find('.checkbox-guard-sendSMS').prop({'checked': true});
  }
  else $checkboxHead.prop({'checked': false});
  $table.append($thead).append($tbody);
}

async function showRouteTrackingOfGuard(guard, isShow){
  let { iGuardId, dGuardLatCurrent, dGuardLongCurrent } = guard;
  if(isShow && Number(dGuardLatCurrent) != 0 && Number(dGuardLongCurrent) != 0){
    let sentData = { iGuardID: iGuardId };
    let data = await GuardService.getRouteTrackingOfGuard(sentData);
    let arrPoints = JSON.parse(data[0].WaitingPoints);
    hashmapRouteTrackingGuard.set(guard, data);
    if(!data) return;
  }else{
    hashmapRouteTrackingGuard.delete(guard);
  }
  drawGuardRouteTracking();
}

function drawGuardRouteTracking(){
  clearGuardRouteTrackingPolylinesVsMarker();
  if(hashmapRouteTrackingGuard.size == 0) return;
  hashmapRouteTrackingGuard.forEach((value, key) => {
    drawPolylineGuardRouteTracking(key, value);
  })
}

function drawPolylineGuardRouteTracking(guard, data){
  let { WaitingPoints, IncidentPoints, CheckedPoints, TrackingLists } = data[0];
  WaitingPoints = JSON.parse(WaitingPoints);
  IncidentPoints = JSON.parse(IncidentPoints);
  CheckedPoints = JSON.parse(CheckedPoints);
  TrackingLists = JSON.parse(TrackingLists);
  
  clearGuardRouteTrackingPolylinesVsMarker();
  drawMarkersRouteTracking(guard, WaitingPoints, 'WaitingPoints');
  drawMarkersRouteTracking(guard, IncidentPoints, 'IncidentPoints');
  drawMarkersRouteTracking(guard, CheckedPoints, 'CheckedPoints');
  drawGuardRouteTrackingPolyline(guard, TrackingLists);
}

function drawGuardRouteTrackingPolyline(guard, TrackingLists){
  if(TrackingLists && TrackingLists.length > 0){
      let path = [];
      TrackingLists.forEach(point => {
        const { ImageUrl, Lat, Long, Message, Status } = point;
        let lat = Number(Lat);
        let lng = Number(Long);
        if (lat != 0 || lng != 0){
          let pos = new google.maps.LatLng(lat, lng);
          path.push(pos);
        }
      })
      let polyline = GoogleMapService.createPolyline(path);
      polyline.setMap(mainMapGuard);
      let obj = hashmapRouteTrackingPolylineVsMarkers.get(guard);
      if(!obj){
        obj = { arrMarkers: [], polyline: null };
        hashmapRouteTrackingPolylineVsMarkers.set(guard, obj);
      }
      obj.polyline = polyline;
    }
}

function drawMarkersRouteTracking(guard, arrPoints, type){
  if(!arrPoints || arrPoints.length == 0) return;
  arrPoints.forEach(point => {
    let { ImageUrl, Lat, Long, Message, Status } = point;
    let mes = '', icon;
    let lat = Number(Lat);
    let lng = Number(Long);
    let pos =  new google.maps.LatLng(lat,lng);
    switch(type){
      case 'WaitingPoints': 
        icon = waitingIcon;
        mes = Message
        break;
      case 'IncidentPoints': 
        icon = errorIcon;
        ImageUrl = `${APP_IMAGE_URL}/${ImageUrl}`;
        mes = `<img src="${ImageUrl}" style="width: 80px; height=120px">`
        break;
      case 'CheckedPoints':
        icon = checkedIcon;
        mes = Message;
        break;
    }

    let marker = GoogleMapService.createMarker(pos, icon);
    marker.setMap(mainMapGuard);
    let infoWindow = GoogleMapService.createInfoWindow(mes);
    infoWindow.open(mainMapGuard, marker);
    marker.addListener('mouseover', () => {
      infoWindow.open(mainMapGuard, marker);
    })
    let obj = hashmapRouteTrackingPolylineVsMarkers.get(guard);
    if(!obj) {
      obj = { arrMarkers: [], polyline: null };
      hashmapRouteTrackingPolylineVsMarkers.set(guard, obj);
    }
    obj.arrMarkers.push(marker);

  })
}

function clearGuardRouteTrackingPolylinesVsMarker(){
  hashmapRouteTrackingPolylineVsMarkers.forEach((value, key) => {
    let { arrMarkers, polyline } = value;
    polyline.setMap(null);
    arrMarkers.forEach(m => m.setMap(null));
  });
  hashmapRouteTrackingPolylineVsMarkers.clear();
}

function showOneCurrentGuardOnMap(guard){
  let { dGuardLatCurrent, dGuardLongCurrent } = guard;
  let cond = GuardService.checkOnlineOrSOS(guard);
  if(mainMapGuard && cond){
    let lat = Number(dGuardLatCurrent);
    let lng = Number(dGuardLongCurrent);
    mainMapGuard.setCenter(new google.maps.LatLng(lat, lng));
    mainMapGuard.setZoom(16);
  }
}

function checkOneGuard(isChecked, guard){
  if(isChecked) arrCurrentGuardsSentSMS.push(guard);
  else{
    let { iGuardId } = guard;
    let index = arrCurrentGuardsSentSMS.findIndex(g => g.iGuardId == iGuardId);
    arrCurrentGuardsSentSMS.splice(index, 1);
  }
}

function checkAllGuards(e){
  let { checked } = e.target;
  checkedAllGuardFilter = checked;
  arrCurrentGuardsSentSMS.length = 0;
  if(checked){
      arrFilterGuards.forEach(guard => {
      arrCurrentGuardsSentSMS.push(guard);
    })
  }
}

async function showCurrentMapGuard(){
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await GuardService.getGuardsData(sentData);
  //console.log(data);
  if(data) buildCurrentMapGuard(data);
}

function buildCurrentMapGuard(data){
  $mapArea = $('<div class="map guard-map" id="mapid"></div>');
  $('.card-map-guard').find('.card-body').html($mapArea);
  let mapProp = {
    center: new google.maps.LatLng(20.81715284, 106.77411238),
    zoom: 15,
  };
  mainMapGuard = new google.maps.Map($mapArea[0], mapProp);

  if(data){
    data.forEach(guard => {
      let { dGuardLatCurrent, dGuardLongCurrent, sGuardName, bOnline } = guard;
      let mes = `${sGuardName}`;
      let lat = Number(dGuardLatCurrent);
      let lng = Number(dGuardLongCurrent);
      let pos =  new google.maps.LatLng(lat,lng);
      if(lat != 0 && lng != 0){
        let icon, status = bOnline.trim('').toLowerCase();
        switch(status){
          case 'online':
            icon = guardOnlineIcon;
            break;
          case 'sos':
            icon = guardSOSIcon;
            break;
          default: 
            icon = guardOfflineIcon;
            break;
        }
        let marker = GoogleMapService.createMarker(pos, icon);
        marker.setMap(mainMapGuard);
        let infoWindow = GoogleMapService.createInfoWindow(mes);
        infoWindow.open(mainMapGuard, marker);
      }
    })
  }
}





