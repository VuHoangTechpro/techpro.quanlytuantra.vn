
$(() => {
  $('#btnSaveUpdateZone').click(updateZone);
  $('#btnShowInsertZoneModal').click(showInsertZoneModal);
  $('#btnInsertZone').click(insertZone);
  $('#btnClearZoneMap').click(clearCurrentInsertedZone)
  showZones();
})

var arrCurrentInsertedPointsZone = [];
var mapInsertedZone = null;
let currentPolygonZoneInsertMap = null;
function clearCurrentInsertedZone(){
  arrCurrentInsertedPointsZone = [];
  buildInsertZoneMap(mapInsertedZone, arrCurrentInsertedPointsZone);
}


async function inActiveZone(zone){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    const { iZoneID, sZoneName } = zone;
    let bStatus = 3;
    let sCompanyCode = getUserAuth().CompanyCode;
    let sentData = { sCompanyCode, sZoneName, iZoneID, bStatus }
    let response = await ZoneService.inActiveZone(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      AlertService.showAlertSuccess("Inactive successfully!", "", 2000);
      showZones();
    }else{
      Alertervice.showAlertError("Inactive unsuccessfully!", "", 5000);
    }
  }
}

async function insertZone(){
  // {"sCompanyCode":"deepC_2510180932006129", "sZoneName":"Techpro Zone test 123", "iZoneID":28, "bStatus":3}
  let sZoneName = $('#txtInsertZoneName').val();
  let sCompanyCode = getUserAuth().CompanyCode;
  let iZoneID = 0;
  let bStatus = 1;
  if(ValidationService.checkEmpty(sZoneName) && arrCurrentInsertedPointsZone.length > 2){
    let sentData = { sCompanyCode, sZoneName, iZoneID, bStatus };
    let response = await ZoneService.insertZone(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      $('#modalInsertZone').modal('hide');
      AlertService.showAlertSuccess("Inserted successfully!", "", 2000);
      arrCurrentInsertedPointsZone.length = 0;
      showZones();
    }else{
      Alertervice.showAlertError("Inserted unsuccessfully!", "", 5000);
    }
  }else{
    AlertService.showAlertError("Invalid data!", "Name must be filled\n The number of selected points must be over 2");
  }
}

async function updateZone(){
  let iZoneID = $('#txtUpdateZoneID').val();
  let sZoneName = $('#txtUpdateZoneName').val();
  let sCompanyCode = getUserAuth().CompanyCode;
  let bStatus = 2;
  if(ValidationService.checkEmpty(sZoneName)){
    let sentData = { sCompanyCode, sZoneName, iZoneID, bStatus };
    let response = await ZoneService.updateZone(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      $('#modalUpdateZone').modal('hide');
      AlertService.showAlertSuccess("Updated successfully!", "", 2000);
      showZones();
    }else{
      Alertervice.showAlertError("Updated unsuccessfully!", "", 5000);
    }
  }else{
    AlertService.showAlertError("Invalid data", "Zone name must be filled", 3000);
  }
}

function renderZonesTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblZones"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Name</th>
        <th class="trn">Address</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if(data){
    data.forEach((zone, index) => {
      const {sZoneName, sZoneAddress } = zone;
      //console.log(sZoneAddress);
      //console.log(typeof sZoneLatLong);
      //console.log(typeof JSON.parse(sZoneLatLong));
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sZoneAddress}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateZoneModal btn-custom-small trn">Update</button>
            <button class="btn btn-custom bg-main-color btnInactiveZone btn-custom-small trn">Lock</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowUpdateZoneModal').last().click(function(){
        showUpdateZoneModal(zone)
      })
      $tbody.find('.btnInactiveZone').last().click(function(){
        inActiveZone(zone)
      })
    })
  } 
  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateZoneModal(zone){
  const { iZoneID, sZoneName } = zone;
  $('#txtUpdateZoneID').val(iZoneID);
  $('#txtUpdateZoneName').val(sZoneName);
  $('#modalUpdateZone').modal('show');
}

async function showZones(){
  let sentData = CommonService.getSentDataCompanyCode();
  let zones = await ZoneService.getZoneinfo(sentData);
  //console.log(zones);
  //console.log(JSON.parse(zones[0].ZoneLatLong));
  //console.log(zones);
  if(zones){
    $('#totalZones').html(`<strong class="trn">Total Zones</strong>: ${zones.length}`);
    $('#pagingZonesControl').pagination({
      dataSource: zones,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (zones, pagination) {
        let $table = renderZonesTable(zones);
        $('.card-zone .table-responsive').html($table);
        setDefaultLang();
      }
    })
  } else{
    resetTblZone();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblZone(){
  $('#totalZones').html('');
  $('#pagingZonesControl').html('');
  $('#tblZones').find('tbody').html('');
}

function buildInsertZoneMap(){
  $mapArea = $('<div id="mapInsertZone" style="height: 450px"></div>');
  $('#modalInsertZone').find('.modal-body .insertZoneMap').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  mapInsertedZone = new google.maps.Map($(`#mapInsertZone`)[0], mapProp);
  let icon = '../../img/Checked.png';

  google.maps.event.addListener(mapInsertedZone, 'click', function(event) {
    handleClickOnMapZone(event);
  });

  if(arrCurrentInsertedPointsZone.length > 0){
    arrCurrentInsertedPointsZone.forEach(point => {
      let lat = point[0];
      let lng = point[1];
      let pos = new google.maps.LatLng(lat, lng);
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mapInsertedZone);
    })
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
}

function handleClickOnMapZone(event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  //arrNewAddedPoints.push([lat, lng]);
  $('.latPoint').text(lat);  
  $('.longPoint').text(lng);  
  let icon = '../../img/Checked.png';
  let marker = GoogleMapService.createMarker(pos, icon);
  marker.setMap(mapInsertedZone);
  arrCurrentInsertedPointsZone.push([lat, lng]);
  //console.log(arrCurrentInsertedPointsZone);
  if(mapInsertedZone){
    if(currentPolygonZoneInsertMap)
    currentPolygonZoneInsertMap.setMap(null);
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
}

function drawPolygon(map, latlngs){
  let path = latlngs.map(point => {
    return new google.maps.LatLng(point[0], point[1]);
  });
  currentPolygonZoneInsertMap = GoogleMapService.createPolygon(path);
  currentPolygonZoneInsertMap.setMap(map);
}

function showInsertZoneModal(){
  $('#modalInsertZone').modal('show');
  setTimeout(() => {
    buildInsertZoneMap();
  }, 0);
}