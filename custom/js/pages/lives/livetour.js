$(async () => {

  //bind event click view to show event history
  $('#selectGuardName').change(() => {
    filterLiveTourData('guard')
  });
  $('#selectRouteName').change(() => {
    filterLiveTourData('route')
  });
  $('#selectDeviceName').change(() => {
    filterLiveTourData('device');
  });
  $('#btnIncidentsMap').click(showAllIncidentsMap)
  // set up time default when page onload 
  // formatTodayEvent();
  arrGuardList = await SelectComponentService.renderGuardSelectList(false);
  arrRouteList = await SelectComponentService.renderRouteSelectList(false);
  arrDeviceList = await SelectComponentService.renderDeviceSelectList(false);
  //console.log(arrDeviceList);
  if(!arrGuardList) arrGuardList = [];
  if(!arrRouteList) arrRouteList = [];
  if(!arrDeviceList) arrDeviceList = [];

  showTourListsByDefault();
})

let arrGuardList = [];
let arrRouteList = [];
let arrDeviceList = [];
let arrLiveTourData = [];
let arrFilteredLiveTourData = [];
let headerTblTours = '';
let currentTour = {};

async function showTourListsByDefault(){
  let sentData = CommonService.getSentDataCompanyCode();
  data = await TourService.getLiveTour(sentData);
  //console.log(data);
  if(data) {
    arrLiveTourData = data.slice();
    showToursListPagination(data);
  }
  else AlertService.showAlertError("No data available", "", 3000);
  setDefaultLang();
}

function showAllIncidentsMap() {
  $('#modalEventMap').modal('show');
}

function filterLiveTourData(type){
  type = type[0].toUpperCase() + type.substring(1).toLowerCase();
  let id = $(`#select${type}Name`).val();
  //console.log(arrLiveTourData);
  if(type.toLowerCase() == 'guard'){
    arrFilteredLiveTourData = FilterService.filterDataByID(arrLiveTourData, 'iGuardID', id);
  }else if(type.toLowerCase() == 'route'){
    arrFilteredLiveTourData = FilterService.filterDataByID(arrLiveTourData, 'iRouteID', id);
  }else if(type.toLowerCase() == 'device'){
    arrFilteredLiveTourData = FilterService.filterDataByID(arrLiveTourData, 'iDeviceID', id);
  }
  showToursListPagination(arrFilteredLiveTourData);
  setDefaultLang();
}


function showToursListPagination(data){
  if(!data || Object.keys(data).length == 0) return resetTblEventHistory();
  $('#totalTours').html(`<strong class="trn">Total tours</strong>: ${data.length}`)
  $('#pagingToursControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderEventHistoryTable(data);
      $('.card-tour .table-responsive').html($table);
      setDefaultLang();
    }
  })
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
        <th class="trn">Tour No</th>
        <th class="trn">Started</th>
        <th class="trn">Timing (min)</th>
        <th class="trn ">Missed CheckPoint</th>
        <th class="trn">Distance (km)</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((tour, index) => {
      const { sZoneName, sRouteName, sGuardName, sDeviceName, dDateTimeStart, iMaxTime, dDistance, sTourCode, MissedCheckPointName, iNoTour}= tour;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sGuardName}</td>
          <td>${sDeviceName}</td>
          <td>${iNoTour}</td>
          <td>${dDateTimeStart}</td>
          <td>${iMaxTime}</td>
          <td class="text-left">${MissedCheckPointName}</td>
          <td>${dDistance}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="trn">Action</span>
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-success btn-custom-small dropdown-item trn btnShowTourMap" style=" margin-top:-5px">Map</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item trn btnShowTourDetails" style=" margin-top:-5px; margin-left: 5px">Details</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('tr').last().find('.btn.btnShowTourDetails').click(() => {
        showEventHistoryDetails(tour);
      })
      $tbody.find('tr').last().find('.btn.btnShowTourMap').click(() => {
        showEventDetailsMap(tour);
      })
    })
  } 
  $table.append($thead).append($tbody);
  return $table;
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
  currentTour = Object.assign({}, tour);
  let { sTourCode } = tour;
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
    //console.log(iKindRoute);
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

function buildEventDetailsMap(data, dataTracking){
  //console.log(data);
  let lat = CENTER_POS_MAP_VIEW[0];
  let lng = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, lat, lng);
  let mymap = new google.maps.Map($('#mapEventDetails')[0], mapProp);
  if(data){
    let l1 = data.length;
    data.forEach((detail, index) => {
      let lat = Number(detail.dCheckPointLat);
      let lng = Number(detail.dCheckPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      if (lat != 0 || lng != 0){
        if(detail.sStatus == 'Checked'){
          let mes = `${detail.sGuardName} checked at ${detail.dDateTimeUpdated}`
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
  let $mapView = $('<div id="mapEventDetails" class="mymap"></div>');
  $('#modalEventMap').find('.modal-body').html($mapView);
  let sentData = { sTourCode };
  let data = await TourService.getEventHistoryDetails(sentData);
  let dataTracking = await GuardService.getGuardTrackingbyTour(sentData);
  //console.log(dataTracking);
  $('#modalEventMap').modal('show');
  buildEventDetailsMap(data, dataTracking);
}
