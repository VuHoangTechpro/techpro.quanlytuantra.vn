
$(() => {
  $('#btnIncidentsData').click(showIncidents);
  $('#selectIncident').change(filterIncidents);
  $('#btnIncidentsMap').click(function(){
    showAllIncidentMap(arrIncidents);
  })
  $('#btnIncidentsExportExcel').click(exportIncidentsDataToExxcel);
  // showIncidentsList(true);
  SelectComponentService.renderIncidentSelectList(true);
  setDefaultDate();
  showIncidents();
})

let arrIncidents = [];

function showIncidentListPagination(data){
  if(!data || Object.keys(data).length == 0) return resetTblIncidents();
  $('#totalIncidents').html(`<strong class="trn">Total incidents</strong>: ${data.length}`);
  $('#pagingIncidentsControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderIncidentsTable(data);
      $('.card-incident .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function setDefaultDate(){
  let today = TimeService.getCurrentDate();
  let tomorrow = TimeService.getTomorrow();
  let fromDate = `${today.month + 1}/${today.day}/${today.year}`;
  let toDate = `${tomorrow.month + 1}/${tomorrow.day}/${tomorrow.year}`;
  $('#incidentFromDatetime').val(fromDate);
  $('#incidentToDatetime').val(toDate);
  fromDate = TimeService.changeFormatDateTime(fromDate);
  toDate = TimeService.changeFormatDateTime(toDate);
}

async function showIncidents(){
  let fromDate = $('#incidentFromDatetime').val();
  let toDate = $('#incidentToDatetime').val();
  fromDate = TimeService.changeFormatDateTime(fromDate);
  toDate = TimeService.changeFormatDateTime(toDate);
  let user = getUserAuth();
  let sCompanyCode = user.CompanyCode;
  let sentData = { fromDate, toDate, sCompanyCode };
  let data = await IncidentService.getIncidentsData(sentData);
  arrIncidents.length = 0;
  arrFilteredIncidents.length = 0;
  //console.log(data);
  if(data) {
    arrIncidents = data.slice();
    arrFilteredIncidents = data.slice();
  }else{
    AlertService.showAlertError("No data available", "", 3000);
  }
  showIncidentListPagination(data);
  setDefaultLang();
}

function filterIncidents(){
  let id = $('#selectIncident').val();
  arrFilteredIncidents = FilterService.filterDataByID(arrIncidents, 'iIncidentsListID', id);
  showIncidentListPagination(arrFilteredIncidents);
}

let arrFilteredIncidents = [];

function resetTblIncidents(){
  $('#totalIncidents').html('');
  $('#pagingIncidentsControl').html('');
  $('#tblIncidents').find('tbody').html('');
}

function renderIncidentsTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblIncidents"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Guard</th>
        <th class="trn">Route</th>
        <th class="trn">Date</th>
        <th class="trn">Incident</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">Time spent</th>
        <th class="trn">Status</th>
        <th class="trn">Image</th>
        <th class="trn">Map</th>
      </tr>
    `
  )
  if(data){
    data.forEach(incident => {
      const { sGuardName, iTimeSpent, dDate, dTimeStart, dTimeEnd, 
        sIncidentsDescription, ImageUrl, sRouteName, ProcessIncidnet } = incident;
      let img = `${APP_IMAGE_URL}/${ImageUrl}`;
      $tbody.append(`
        <tr>
          <td>${sGuardName}</td>
          <td>${sRouteName}</td>
          <td>${dDate}</td>
          <td>${sIncidentsDescription}</td>
          <td>${dTimeStart}</td>
          <td>${dTimeEnd}</td>
          <td>${iTimeSpent}</td>
          <td>${ProcessIncidnet}</td>
          <td>
            <img src="${img}" alt="Image here" style="width:60px; height: 80px" onClick="showIncidentImage('${img}')">
          </td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowIncidentMap btn-custom-small">Map</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowIncidentMap').last().click(function(){
        showMapIncident(incident)
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function renderIncidentsReportToExport(data){
  let $table = $(`#tblIncidentExport`);
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Guard</th>
        <th class="trn">Route</th>
        <th class="trn">Date</th>
        <th class="trn">Incident</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">Time spent</th>
        <th class="trn">Status</th>
      </tr>
    `
  )
  if(data){
    data.forEach((incident, index) => {
      const {  sGuardName, iTimeSpent, dDate, dTimeStart, dTimeEnd, 
        sIncidentsDescription, ImageUrl, sRouteName, ProcessIncidnet } = incident;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sGuardName}</td>
          <td>${sRouteName}</td>
          <td>${dDate}</td>
          <td>${sIncidentsDescription}</td>
          <td>${dTimeStart}</td>
          <td>${dTimeEnd}</td>
          <td>${iTimeSpent}</td>
          <td>${ProcessIncidnet}</td>
        </tr>
      `) 
    })
  }
  $table.append($thead).append($tbody);
}

function exportIncidentsDataToExxcel(){
  if(!arrIncidents) return AlertService.showAlertError('No data available', '');
  if(arrIncidents.length == 0) return AlertService.showAlertError('No data available', '');
  renderIncidentsReportToExport(arrIncidents);
  // $('#modalIncidentsExport').modal('show');
  // $('#modalExport').modal('show');
  setTimeout(() => {
    $("#tblIncidentExport").table2excel({
      // exclude CSS class
      // exclude: ".noExl",
      name: "IncidentDataReport",
      filename: "data-incidents",//do not include extension
      // fileext: ".xls",
      // exclude_img: true,
      // exclude_links: true,
      // exclude_inputs: true
    });
  }, 500);
}

function showIncidentImage(urlImage){
  $('#incidentImg').attr({ src: urlImage });
  $('#modalIncidentImage').modal('show');
}

function buildIncidentMap(incident){
  $mapArea = $('<div id="mapIncident" class="mymap"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($mapArea[0], mapProp);

  if(incident){
    const {  dDate, sIncidentsDescription, ImageUrl, dIncidentLat, dIncidentLong } = incident
    let lat = Number(dIncidentLat);
    let lng = Number(dIncidentLong);
    let pos = new google.maps.LatLng(lat, lng);
    let img = `${APP_IMAGE_URL}/${ImageUrl}`;
    let mes = `${dDate}<br>${sIncidentsDescription}<br><img src="${img}"  style="width: 120px; height: 240px">`
    
    let icon = '../../img/error.png';
    let marker = GoogleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
    let infoWindow = GoogleMapService.createInfoWindow(mes);
    infoWindow.open(mymap, marker);
  }
}

function buildAllIncidentMap(incidents){
  $mapArea = $('<div id="mapIncident" class="mymap"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($mapArea[0], mapProp);
  let icon = '../../img/error.png';

  if(incidents && incidents.length > 0){
    incidents.forEach(incident => {
      const { dDate, sIncidentsDescription, ImageUrl, dIncidentLat, dIncidentLong } = incident;
      let lat = Number(dIncidentLat);
      let lng = Number(dIncidentLong)
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${APP_IMAGE_URL}/${ImageUrl}`;
      let mes = `${dDate}<br>${sIncidentsDescription}<br><img src="${img}" style="width: 100px; height: 200px">`;
      
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function showAllIncidentMap(incidents){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildAllIncidentMap(incidents);
  }, 0);
}

function showMapIncident(incident){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildIncidentMap(incident);
  }, 0);
}