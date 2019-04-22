
$(() => {

  $('#btnIncidentsMap').click(function(){
    showAllIncidentMap(arrIncidents);
  })
  $('#selectIncident').change(filterIncidents);
  SelectComponentService.renderIncidentSelectList(true);
  showIncidentsData();
})

const arrIncidents = [];
let arrFilteredIncidents = [];

async function showIncidentsData() {
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await IncidentService.getLiveIncident(sentData);
  arrIncidents.length = 0;
  arrFilteredIncidents.length = 0;
  if(data) {
    showIncidentListPagination(data);
    data.forEach(item => arrIncidents.push(item));
  }else{
    clearPagination();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function filterIncidents(){
  let currentID =  $('#selectIncident').val();
  arrFilteredIncidents = FilterService.filterDataByID(arrIncidents, 'iIncidentsListID', currentID);
  showIncidentListPagination(arrFilteredIncidents);
}

function showIncidentListPagination(data){
  if(!data || data.length == 0) return clearPagination();
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

function clearPagination(){
  $('#totalIncidents').html('');
  $('#pagingIncidentsControl').html('');
  $('.card-incident .table-responsive').html('');
}

function renderIncidentsTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblIncidents"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Guard</th>
        <th class="trn">Route</th>
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
    data.forEach((incident, index) => {
      const { sGuardName, sRouteName, dDateTimeIntinial, dDateTimeStart, 
        dDateTimeEnd, sAlertDescription, ImageUrl, 
        sProcessIncident, iTimeSpent
      } = incident;
      let img = `${APP_IMAGE_URL}/${ImageUrl}`;
      $tbody.append(`
        <tr>
          <td>${index+1}</td>
          <td>${sGuardName}</td>
          <td>${sRouteName}</td>
          <td>${sAlertDescription}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>${iTimeSpent}</td>
          <td>${sProcessIncident}</td>
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

function showIncidentImage(urlImage){
  $('#incidentImg').attr({ src: urlImage });
  $('#modalIncidentImage').modal('show');
}

function formatTodayIncident() {
  $('#incidentDatetime').val(TimeService.formatToday());
  showIncidentsData();
}

function buildIncidentMap(incident){
  $mapArea = $('<div id="mapIncident" class="mymap"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);
  
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($mapArea[0], mapProp);

  if(incident){
    const { dIncidentLat, dIncidentLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident
    let lat = Number(dIncidentLat);
    let lng = Number(dIncidentLong);
    let pos = new google.maps.LatLng(lat, lng);
    let img = `${APP_IMAGE_URL}/${ImageUrl}`;
    let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" style="width: 200px; height: 240px">`
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
      const { dIncidentLat, dIncidentLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident;
      let lat = Number(dIncidentLat);
      let lng = Number(dIncidentLong)
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${APP_IMAGE_URL}/${ImageUrl}`;
      let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" style="height: 200px; width: 150px">`;
      
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      infoWindow.open(mymap, marker);
      // marker.addListener('mouseover', () => {
      //   console.log('mouse over');
      //   infoWindow.open(mymap, marker);
      // })
      // marker.addListener('mouseout', () => {
      //   console.log('mouse leave');
      //   infoWindow.close();
      // })
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