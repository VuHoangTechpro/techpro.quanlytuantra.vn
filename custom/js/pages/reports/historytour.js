$(async () => {
  //bind event click view to show event history
  $('#selectGuardName').change(() => {
    filterHistoryTour('guard')
  });
  $('#selectRouteName').change(() => {
    filterHistoryTour('route')
  });
  $('#selectDeviceName').change(() => {
    filterHistoryTour('device');
  });

  $('#btnViewHistoryTour').click(showTourLists);

  $('#btnIncidentsMap').click(showAllIncidentsMap)
  // set up time default when page onload 
  // formatTodayEvent();
  arrGuardList = await SelectComponentService.renderGuardSelectList(true);
  arrRouteList = await SelectComponentService.renderRouteSelectList(true);;
  arrDeviceList = await SelectComponentService.renderDeviceSelectList(true);;


  if(!arrGuardList) arrGuardList = [];
  if(!arrRouteList) arrRouteList = [];
  if(!arrDeviceList) arrDeviceList = [];

  setDefaultTime();
  showTourLists();
  
})

let arrGuardList = [];
let arrRouteList = [];
let arrDeviceList = [];
let headerTblTours = '';
let lastSearch = {};
let arrHistoryTourData = [];
let arrFilteredHistoryTourData = [];
let currentTour = null;

function filterHistoryTour(type){
  //console.log(arrGuardList);
  type = type[0].toUpperCase() + type.substring(1).toLowerCase();
  let fromDate = $(`#fromDateTime`).val();
  let toDate = $(`#toDateTime`).val();
  let id = $(`#select${type}Name`).val();
  let name = 'All';

  switch(type.toLowerCase()){
    case 'guard': 
      let guard = arrGuardList.find(g => g.iGuardId == id.trim());
      if(guard) name = guard.sGuardName;
      arrFilteredHistoryTourData = FilterService.filterDataByID(arrHistoryTourData, 'iGuardID', id);
      break;
    case 'route': 
      let route = arrRouteList.find(r => r.iRouteID == id.trim());
      if(route) name = route.sRouteName;
      arrFilteredHistoryTourData = FilterService.filterDataByID(arrHistoryTourData, 'iRouteID', id);
      break;
    case 'device': 
      let device = arrDeviceList.find(d => d.iDeviceID == id.trim());
      if(device) name = device.sDeviceName;
      arrFilteredHistoryTourData = FilterService.filterDataByID(arrHistoryTourData, 'iDeviceID', id);
      break;
  }
  
  showToursListPagination(arrFilteredHistoryTourData, name, type, fromDate, toDate);
}

function resetSelectField(){
  $('#selectGuardName').val('0');
  $('#selectRouteName').val('0');
  $('#selectDeviceName').val('0');
}

function setDefaultTime(){
  let { year, month, day, hour, min } = TimeService.getCurrentDateTime();
  let fromDate = `${year}-${month + 1}-${day} 00:00`;
  let toDate = `${year}-${month + 1}-${day} ${hour}:${min}`;
  $(`#fromDateTime`).val(fromDate);
  $(`#toDateTime`).val(toDate);
}

async function showTourLists(){
  let fromDate = $(`#fromDateTime`).val();
  let toDate = $(`#toDateTime`).val();
  let user = getUserAuth();
  let sentData = { fromDate, toDate, sCompanyCode: user.CompanyCode };
  let data = await TourService.getTourHistoryByDateTimeRange(sentData);
  //console.log(data);
  if(data){
    arrHistoryTourData = data.slice();
    arrFilteredHistoryTourData = data.slice();
  }else {
    AlertService.showAlertError("No data available", "", 3000);
  }
  resetSelectField();
  showToursListPagination(data, '', 'All', fromDate, toDate);
  setDefaultLang();
}

function showAllIncidentsMap() {
  $('#modalEventMap').modal('show');
}

async function showEventHistoryData(type) {
  
  type = type[0].toUpperCase() + type.substring(1).toLowerCase();
 
  let fromDate = $(`#fromDateTime`).val();
  let toDate = $(`#toDateTime`).val();
  let id = $(`#select${type}Name`).val();

  if (checkTimeFormat(fromDate, toDate) && id) {
    let sentData = { fromDate, toDate };
    let data = null;
    let name = '';
    if(type.toLowerCase() == 'guard'){
      sentData.GuardID = id;
      let guard = arrGuardList.find(g => g.iGuardId == id.trim());
      name = guard.sGuardName;
      data = await GuardService.getEventHistoryDataGuard(sentData);
    }else if(type.toLowerCase() == 'route'){
      sentData.RouteID = id;
      let route = arrRouteList.find(r => r.iRouteID == id.trim());
      name = route.sRouteName;
      data = await RouteService.getEventHistoryRoute(sentData);
    }else if(type.toLowerCase() == 'device'){
      sentData.DeviceID = id;
      let device = arrDeviceList.find(d => d.iDeviceID == id.trim());
      name = device.sDeviceName;
      data = await DeviceService.getEventHistoryDevice(sentData);
    }
    lastSearch.sentData = sentData;
    lastSearch.name = name;
    lastSearch.type = type;
    lastSearch.fromDate = fromDate;
    lastSearch.toDate = toDate;
    if(data){
      showToursListPagination(data, name, type, fromDate, toDate);
    }else {
      resetTblEventHistory();
      AlertService.showAlertError("No data available", "", 3000);
    }
  }
  setDefaultLang();
}

function showToursListPagination(data, name, type, fromDate, toDate){
  if(!data || data.length == 0) return resetTblEventHistory();
  headerTblTours = `<span class="trn">${type} Name</span>: ${name} - (${fromDate} -> ${toDate})`;
  if(!type.toLowerCase() == 'all') headerTblTours = `<span class="trn">All data</span> - (${fromDate} -> ${toDate})`;
  $('.headerTblTours').html(headerTblTours)
  $('#totalTours').html(`<strong class="trn">Total tours</strong>: ${data.length}`)
  $('#pagingToursControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      let $table = renderEventHistoryTable(data);
      $('.card-tour .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblEventHistory(){
  $('#totalTours').html('');
  $('#pagingToursControl').html('');
  $('#tblEventHistory').html('');
  $('.headerTblTours').html('');
}

function renderEventHistoryTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblEventHistory" style="min-height: 150px"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Zone</th>
        <th class="trn">Route</th>
        <th class="trn">Guard</th>
        <th class="trn">Device</th>
        <th class="trn">Date</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">Point</th>
        <th class="trn">Checked</th>
        <th class="trn">Timing</th>
        <th class="trn">Current</th>
        <th class="trn">Distance</th>
        <th class="trn">Status</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((tour, index) => {
      const { sZoneName, sRouteName, sGuardName, sDeviceName, dDateTimeIntinial, dDateTimeStart, dDateTimeEnd, iCountPoint, iCheckedPoint, iMaxTime, iTimeCurrent, dDistance, sCheckingCode, iError } = tour;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sGuardName}</td>
          <td>${sDeviceName}</td>
          <td>${dDateTimeIntinial}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>${iCountPoint}</td>
          <td>${iCheckedPoint}</td>
          <td>${iMaxTime}</td>
          <td>${iTimeCurrent}</td>
          <td>${dDistance}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="trn">Action</span>
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-success btn-custom-small dropdown-item trn btnShowTourDetailsMap" style=" margin-top:-5px">Map</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item trn btnShowTourDetails" style=" margin-top:-5px; margin-left: 5px">Details</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn-show-accept-confirm').last().click(() => {
        showAcceptConfirm(tour);
      })
      $tbody.find('.btnShowTourDetails').last().click(() => {
        showEventHistoryDetails(tour);
      })
      $tbody.find('.btnShowTourDetailsMap').last().click(() => {
        showEventDetailsMap(tour);
      })
    })
  } 
  $table.append($thead).append($tbody);
  return $table;
}

function showProcessedStatus(error){
  if(error == '0') return 'Error';
  if(error == '2') return 'Fixed';
  return 'Success';
}

async function showAcceptConfirm(tour){
  const { iError, sCheckingCode } = tour;
  if(iError != '0') return AlertService.showAlertError('Can not accept or reject this !!', '', 5000);
  let buttons = {
    accept: {
      text: "Accept",
      value: "accept",
    },
    reject: {
      text: "Reject",
      value: "reject",
    },
  };
  let sure = await AlertService.showAlertWarning('Do you want to accept this!!!', 'Accept or Reject?', buttons);
  if(!sure) return;
  let sentData = { CheckingCode: sCheckingCode, Process: 0 };
  if(sure.trim().toLowerCase() == 'accept') sentData.Process = 1;
  let response = await TourService.processTourError(sentData);
  //console.log(response);
  showEventHistoryDataLastSearch(lastSearch);
}

async function showEventHistoryDataLastSearch(lastSearch){
  let { sentData, name, type, fromDate, toDate } = lastSearch;
  let data = null;
  if(type.toLowerCase() == 'guard')
    data = await GuardService.getEventHistoryDataGuard(sentData);
  else if(type.toLowerCase() == 'route')
    data = await RouteService.getEventHistoryRoute(sentData);
  else if(type.toLowerCase() == 'device')
    data = await DeviceService.getEventHistoryDevice(sentData);
  if(data) showToursListPagination(data, name, type, fromDate, toDate);
  setDefaultLang();
}

function checkTimeFormat(from, to) {
  let valid = true;
  let errMsg = '';
  if (from == '' || to == '') {
    valid = false;
    errMsg += `Please choose date time\n`;
  } else {
    let fromDate = new Date(from).getTime();
    let toDate = new Date(to).getTime();
    if (fromDate >= toDate) {
      valid = false;
      errMsg += 'Start date must be sooner than end date\n';
    }
  }
  if (!valid) AlertService.showAlertError("Invalid date", errMsg, 6000);
  return valid;
}

async function showEventHistoryDetails(tour) {
  let { sTourCode } = tour;
  currentTour = Object.assign({}, tour);
  let sentData = { sTourCode };
  let data = await TourService.getEventHistoryDetails(sentData);
  if(!data) return AlertService.showAlertError('No data available!', '');
  showTourDetailsPagination(data);
  $('#modalEventHistoryDetails').modal('show');
}

function renderTableEventHistoryDetails(data) {
  let $table = $(`
    <table class="table table-hover table-striped text-center custom-table" id="tblEventHistoryDetails">
    </table>`
  );
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Guard</th>
        <th class="trn">Checkpoint name</th>
        <th class="trn">Status</th>
        <th class="trn">Datetime</th>
        <th class="trn">Time Required</th>
        <th class="trn">Time Updated</th>
        <th class="trn">Unattendance Time</th>
        <th class="trn">Image</th>
        <th class="trn">KindCheck</th>
        <th class="trn">#</th>
      </tr>
    `
  )
  if (data) {

    let { iKindRoute } = currentTour;
    data.forEach(detail => {
      let { dDateTimeRequire, sGuardName, sCheckPointName, sStatus, dDate,
        dDateTimeUpdated, KindCheck, iNo, sImageUrl, dUnattendedTime } = detail;
      let url = '';
      let img = '';

      if(iKindRoute == '1') {
        if(ValidationService.checkEmpty(sImageUrl)){
          url = `${APP_IMAGE_URL}/${sImageUrl}`;
          img = `<img src="${url}" style="width:80px; height:100px">`;
        }
      }else{
        dDateTimeRequire = '';
        dUnattendedTime = '';
      }

      $tbody.append(`
        <tr>
          <td>${sGuardName}</td>
          <td>${sCheckPointName}</td>
          <td>${sStatus}</td>
          <td>${dDate}</td>
          <td>${dDateTimeRequire}</td>
          <td>${dDateTimeUpdated}</td>
          <td>${dUnattendedTime}</td>
          <td>
            ${img}
          </td>
          <td>${KindCheck}</td>
          <td>${iNo}</td>
        </tr>
      `)
    })
  } 

  $table.append($thead).append($tbody);
  return $table;
}

function showTourDetailsPagination(data){
  $('#totalTourDetails').html(`<strong class="trn">Total tour details</strong>: ${data.length}`)
  $('#pagingTourDetailsControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderTableEventHistoryDetails(data);
      $('#modalEventHistoryDetails .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function buildEventDetailsMap(data, dataTracking){
  let lat = CENTER_POS_MAP_VIEW[0];
  let lng = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, lat, lng);
  let mymap = new google.maps.Map($('#mapEventDetails')[0], mapProp);
  if(data){
    let l1 = data.length;
    data.forEach((detail, index) => {
      let { dCheckPointLat, dCheckPointLong, sStatus, sGuardName, dDateTimeRequire } = detail;
      let lat = Number(dCheckPointLat);
      let lng = Number(dCheckPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      if (lat != 0 || lng != 0){
        if(sStatus == 'Checked'){
          let mes = `${sGuardName} checked at ${dDateTimeRequire}`
          let icon = '../../img/Checked.png';
          let marker = GoogleMapService.createMarker(pos, icon);
          marker.setMap(mymap);
          let infoWindow = GoogleMapService.createInfoWindow(mes);
          if(index == 0 || index == l1 - 1) 
            infoWindow.open(mymap, marker);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(mymap, marker);
          });
        }else{
          let icon = '../../img/None.png';
          let marker = GoogleMapService.createMarker(pos, icon);
          marker.setMap(mymap);
        }
      }
    })
  }
  if(dataTracking){
    let path = [];
    dataTracking.forEach(item => {
      const { dGPSLat, dGPSLong } = item;
      let lat = Number(dGPSLat);
      let lng = Number(dGPSLong);
      if (lat != 0 || lng != 0){
        let pos = new google.maps.LatLng(lat, lng);
        path.push(pos);
      }
    })
    let polyline = GoogleMapService.createPolyline(path);
    polyline.setMap(mymap);
  }
}

async function showEventDetailsMap(tour) {
  let { sTourCode } = tour;
  let $mapView = $('<div id="mapEventDetails" class="mymap" style="height:360px"></div>');
  $('#modalEventMap').find('.modal-body').html($mapView);
  let sentData = { sTourCode };
  // let data = await TourService.getEventHistoryDetails(sentData);
  // let dataTracking = await GuardService.getGuardTrackingbyTour(sentData);
  let [data, dataTracking] = await Promise.all([TourService.getEventHistoryDetails(sentData), GuardService.getGuardTrackingbyTour(sentData)])
  //console.log(data);
  //console.log(dataTracking);
  $('#modalEventMap').modal('show');
  buildEventDetailsMap(data, dataTracking);
}
