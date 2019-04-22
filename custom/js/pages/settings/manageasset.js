$(() => {
  $('#btnViewAssetList').click(showAssets);
  $('#btnShowInsertAssetModal').click(showInsertAssetModal);
  $('#btnInsertAsset').click(insertAsset);
  $('#btnUpdateAsset').click(updateAsset);
  // showRouteList();
  // showZoneList();
  SelectComponentService.renderZoneSelectList(true, 'selectZonesAll');
  SelectComponentService.renderZoneSelectList(false);
  SelectComponentService.renderRouteSelectList(false);
  // showZoneList('selectZonesWithAll', true);
  showAssets();
})

let currentUpdateAsset = null;
let arrCurrentAssetsOnZone = [];

async function insertAsset(){
  let name = $('#txtInsertPropertyName').val();
  let code = $('#txtInsertPropertyCode').val();
  let lat = $('#latInsertAsset').text();
  let lng = $('#longInsertAsset').text();
  let zone = $('#selectZoneInsertAsset').val();
  let route = $('#selectRouteInsertAsset').val();
  if(!ValidationService.checkEmpty(lat) || !ValidationService.checkEmpty(lng))
  return AlertService.showAlertError("Invalid data!!", "You have to choose asset by clicking on map", 4000);
  if(!ValidationService.checkEmpty(name) || !ValidationService.checkEmpty(code))
  return AlertService.showAlertError("Invalid data!!", "Name and Code must be filled in", 4000);
  let sentData = { sPropertyCodeIN: code, sPropertyNameIN: name, iZoneIDIN: zone, iRouteIDIN: route, dPropertyLatIN: Number(lat), dPropertyLongIN: Number(lng), iPropertyIDIN: 0, bStatusIN: 1 };
  //console.log(JSON.stringify(sentData));
  let response = await AssetService.insertAsset(sentData);
  //console.log(response);
  const { Result, Msg } = JSON.parse(response)[0];
  if(Result == 1){
    showAssets();
    AssetService.showAlertSuccess("Insert Successfully", "", 3000);
  } else{
    AlertService.showAlertError("Insert Unsuccessfully", Msg, 3000);
  }
}

function showInsertAssetModal(){
  currentUpdatedPoint = null;
  let $mapArea = $('<div id="mapAssetInsert" class="mymap"></div>'); 
  $('#insertAssetMap').html($mapArea);
  $('#latInsertAsset').text('');
  $('#longInsertAsset').text('');
  $('#txtInsertPropertyCode').val('');
  $('#txtInsertPropertyName').val('');
  $('#modalInsertAsset').modal('show');
  buildAssetsMap(arrCurrentAssetsOnZone, 'mapAssetInsert');
}

async function deleteAsset(asset){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    const {sAssetCode, sAssetName, iRouteID, iAssetID, iZoneID } = asset;
    let sentData = { sPropertyCodeIN: sAssetCode, sPropertyNameIN: sAssetName, iZoneIDIN: iZoneID, iRouteIDIN: iRouteID, dPropertyLatIN: 0, dPropertyLongIN: 0, iPropertyIDIN: iAssetID, bStatusIN: 3 };
    //console.log(JSON.stringify(sentData));
    let response = await AssetService.deleteAsset(sentData);
    //console.log(response);
    const { Result, Msg } = JSON.parse(response)[0];
    if(Result == 1){
      showAssets();
      AlertService.showAlertSuccess("Deleted Successfully", "", 3000);
    }else{
      AlertService.showAlertError("Deleted Unsuccessfully", Msg, 3000);
    }
  }
}

function renderAssetTable(data){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblAsset"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Asset name</th>
      <th class="trn">Asset code</th>
      <th class="trn">Zone</th>
      <th class="trn">Route</th>
      <th class="trn">Lat</th>
      <th class="trn">Long</th>
      <th class="trn"></th>
    </tr>
  `)
  if (data) {
    data.forEach((asset, index) => {
      const { sAssetName, sRouteName, sZoneName, sAssetCode, dPropertyLong, dPropertyLat } = asset
      $tbody.append(`
        <tr>
          <td>${sAssetName}</td>
          <td>${sAssetCode}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${dPropertyLat}</td>
          <td>${dPropertyLong}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowUpdateAssetModal trn">Update</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnDeleteAsset trn">Delete</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateAssetModal').last().click(() => {
        showUpdateAssetModal(asset);
      })
      $tbody.find('.btnDeleteAsset').last().click(() => {
        deleteAsset(asset);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showAssetPagination(data){
  $('#totalAssets').html(`<strong class="trn">Total Assets</strong>: ${data.length}`);
  $('#pagingAssetsControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderAssetTable(data);
      $('.card-assets .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

async function showAssets(){
  let sCompanyCode = getUserAuth().CompanyCode;
  let sentData = {sCompanyCode};
  let data = await AssetService.getAssetsData(sentData);
  arrCurrentAssetsOnZone.length = 0;
  if(data){
    arrCurrentAssetsOnZone = data.slice();
    showAssetPagination(data);
  }else{
    resetTblAssets();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblAssets(){
  $('#totalAssets').html('');
  $('#pagingAssetsControl').html('');
  $('#tblAsset').html('');
}

function showUpdateAssetModal(asset){
  const { dPropertyLat, dPropertyLong, sAssetName, sAssetCode, iZoneID, iRouteID } = asset
  currentUpdateAsset = Object.assign({}, asset);
  let $mapArea = $('<div id="mapAssetUpdate" class="mymap"></div>'); 
  $('#updateAssetMap').html($mapArea);
  $('#txtUpdatePropertyName').val(sAssetName);
  $('#txtUpdatePropertyCode').val(sAssetCode);
  $('#selectZoneUpdateAsset').val(iZoneID);
  $('#selectRouteUpdateAsset').val(iRouteID);
  $('#latUpdateAsset').text(dPropertyLat);
  $('#longUpdateAsset').text(dPropertyLong);
    
  $('#modalUpdateAsset').modal('show');
  buildAssetsMap([asset], 'mapAssetUpdate');
}

async function updateAsset(){
  let name = $('#txtUpdatePropertyName').val();
  let code = $('#txtUpdatePropertyCode').val();
  let zone = $('#selectZoneUpdateAsset').val();
  let route = $('#selectRouteUpdateAsset').val();
  let lat = $('#latUpdateAsset').text();
  let lng = $('#longUpdateAsset').text();
  let { iAssetID } = currentUpdateAsset
  if(!ValidationService.checkEmpty(name) || !ValidationService.checkEmpty(code))
  return AlertService.showAlertError("Invalid data!!", "Name and Code must be filled in", 4000);
  let sentData = { sPropertyCodeIN: code, sPropertyNameIN: name, iZoneIDIN: zone, iRouteIDIN: route, dPropertyLatIN: Number(lat), dPropertyLongIN: Number(lng), iPropertyIDIN: iAssetID, bStatusIN: 2 };
  //console.log(JSON.stringify(sentData));
  let response = await AssetService.updateAsset(sentData);
  //console.log(response);
  showAssets();
  AlertService.showAlertSuccess("Update Successfully", "", 3000);
}

function buildAssetsMap(assets, id){
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#${id}`)[0], mapProp);
  let icon = '../../img/asset(2).jpg';

  google.maps.event.addListener(mymap, 'click', function(event) {
    handleClickAssetMap(mymap, event);
  });

  //show all points
  if(assets && assets.length > 0){
    assets.forEach(asset => {
      const { sAssetName, dPropertyLat, dPropertyLong } = asset;
      let mes = `<div style="font-size: 0.9em">${sAssetName}</div>`;
      let lat = Number(dPropertyLat);
      let lng = Number(dPropertyLong)
      let pos = new google.maps.LatLng(lat, lng);
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      marker.addListener('mouseover', function() {
        infoWindow.open(mymap, marker);
      });
    })
  }
}

function handleClickAssetMap(mymap, event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  let mes = `${lat} - ${lng}`;
  $('.latAsset').text(lat);  
  $('.longAsset').text(lng);  
  let icon = '../../img/asset(2).jpg';
  let marker = GoogleMapService.createMarker(pos, icon);
  marker.setMap(mymap);
}

