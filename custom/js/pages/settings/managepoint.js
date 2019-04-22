$(async () => {
  
  // $('#btnPointsData').click(showPointsData);
  $('#btnMapAllPoints').click(function(){
    showPointsMap()
  });

  $('#jcomboboxZone').change(filterPointsData);
  $('#btnShowInsertPointModal').click(showInsertPointModal);
  $('#btnUpdatePoint').click(updatePoint);
  $('#btnInsertPoint').click(insertPoint);
  $('#btnSavetPointQuestions').click(savePointQuestions);

  $('#btnCheckInsertPointRFIDSerial').on('click', () => {
    checkRFIDExisted($txtInsertPointRFIDSerial);
  });

  $('#btnCheckInsertPointQRCodeSerial').on('click', () => {
    checkQRCodeExisted($txtInsertPointQRCodeSerial);
  });

  $('#btnCheckUpdatePointQRCodeSerial').on('click', () => {
    checkQRCodeExisted($txtUpdatePointQRCodeSerial);
  });
  
  $('#btnCheckUpdatePointRFIDSerial').on('click', () => {
    checkRFIDExisted($txtUpdatePointRFIDSerial);
  });

  $('#FixedCheckpoint').change((e) => {
    $('#txtInsertRadiusAllow').val('').parent('.form-group').show(0);
  });

  $('#NotFixedCheckpoint').change(e => {
    $('#txtInsertRadiusAllow').val('0').parent('.form-group').hide(0);
  })

  $('#UpdateFixedCheckpoint').change((e) => {
    $('#txtUpdateRadiusAllow').val('').parent('.form-group').show(0);
  });

  $('#NotUpdateFixedCheckpoint').change(e => {
    $('#txtUpdateRadiusAllow').val('0').parent('.form-group').hide(0);
  })

  // FixedCheckpoint
  // UpdateFixedCheckpoint
  SelectComponentService.renderZoneSelectList(false, 'selectZonesNoAll');
  arrZones = await SelectComponentService.renderZoneSelectList(true, 'selectZones');
  // showAllZones();
  showIncidentContent();
  showPointsData();

});

let iconChecked = '<i class="fa fa-check" style="font-size: 1.2em"></i>';
let iconTimes = '<i class="fa fa-times" style="font-size: 1.2em;"></i>';

let arrNewAddedPoints = [];
let arrPoints = [];
let arrZones = [];
let currentUpdatedPoint = null;
let currentUpdateQuestionPoint = null;
let arrFilteredPoints = [];
let currentCode = { iQRCode: null, iRFID: null, sQRCode: null, sRFIDCode: null };

let $txtInsertPointRFIDSerial = $('#txtInsertPointRFIDSerial');
let $txtInsertPointQRCodeSerial = $('#txtInsertPointQRCodeSerial');
let $txtUpdatePointQRCodeSerial = $('#txtUpdatePointQRCodeSerial');
let $txtUpdatePointRFIDSerial = $('#txtUpdatePointRFIDSerial');

async function checkRFIDExisted($ele){
  $ele.parent().siblings('span.checkcode').remove();
  let sRFIDSerialNumber = $ele.val();
  let sentData = { sRFIDSerialNumber };
  let res = await PointService.checkRFIDCodeExists(sentData);
  if(!res) return;
  let { Msg, Result, iRFID, sRFIDCode } = res[0];
  if(Result != 1) {
    let span = `<span class="checkcode text-danger">${iconTimes} ${Msg}</span>`;
    $ele.parent().before(span);
  }
  else {
    let span = `<span class="checkcode text-success">${iconChecked} ${Msg}</span>`;
    $ele.attr({ 'disabled': true }).parent().before(span);
    currentCode.iRFID = iRFID;
    currentCode.sRFIDCode = sRFIDCode;
  }
  //console.log(res);
}

async function checkQRCodeExisted($ele){
  $ele.parent().siblings('span.checkcode').remove();
  let sQRCodeSerialNumber = $ele.val();
  let sentData = { sQRCodeSerialNumber };
  let res = await PointService.checkQRCodeExists(sentData);
  if(!res) return;
  //console.log(res);
  let { Msg, Result, iQRCode, sQRCode } = res[0];
  if(Result != 1){
    let span = `<span class="checkcode text-danger">${iconTimes} ${Msg}</span>`;
    $ele.parent().before(span); 
  } 
  else {
    let span = `<span class="checkcode text-success">${iconChecked} ${Msg}</span>`;
    $ele.attr({ 'disabled': true }).parent().before(span);
    currentCode.iQRCode = iQRCode;
    currentCode.sQRCode = sQRCode;
  }
}

// async function showAllZones() {
//   let data = await ZoneService.getAllZones();
//   arrZones = [];
//   if(data) arrZones = data;
//   renderZoneOnJcombobox(data);
// }

function renderZoneOnJcombobox(data) {
  $('.selectZones').html('');
  if(data) {
    $('.selectZones').append(`<option value="0">All</option>`);
    data.forEach(zone => {
      const { iZoneID, sZoneName } = zone;
      $('.selectZones').append(`<option value="${iZoneID}">${sZoneName}</option>`)
    })
  }
}

function showPointQuestionsModal(point){
  $('#modalPointQuestions').modal('show');
  //console.log(point);
  let selectPointQuestion = $('.pointQuestions');
  const { iQuestionIncident1, iQuestionIncident2, iQuestionIncident3 } = point;
  selectPointQuestion.eq(0).val(iQuestionIncident1);
  selectPointQuestion.eq(1).val(iQuestionIncident2);
  selectPointQuestion.eq(2).val(iQuestionIncident3);
  currentUpdateQuestionPoint = Object.assign({}, point);
}

async function savePointQuestions(){
  let selectPointQuestion = $('.pointQuestions');
  let q1 = selectPointQuestion.eq(0).val();
  let q2 = selectPointQuestion.eq(1).val();
  let q3 = selectPointQuestion.eq(2).val();
  let { iCheckPointID } = currentUpdateQuestionPoint;
  // {"iCheckPointID":413, "iQuestionIncident1": 5, "iQuestionIncident2": 6, "iQuestionIncident3": 7}
  let sentData = { iCheckPointID, iQuestionIncident1: q1, iQuestionIncident2: q2, iQuestionIncident3: q3 };
  let response = await PointService.updatePointQuestion(sentData);
  let { Result, Msg } = JSON.parse(response)[0];
  if(Result == 1){
    $('#modalPointQuestions').modal('hide');
    AlertService.showAlertSuccess("Save questions successfully", "", 3000);
    showPointsData();
  }else{
    AlertService.showAlertError("Save questions unsuccessfully", "");
  }
}

function renderPointsTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblPoints"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
      <tr>
        <th class="trn">#</th>
        <th class="trn">Zone</th>
        <th class="trn">Checkpoint Name</th>
        <th class="trn">Note</th>
        <th class="trn">Fixed Checkpoint</th>
        <th class="trn">GPS</th>
        <th class="trn">QRCode</th>
        <th class="trn">RFID</th>
        <th class="trn">Updated</th>
        <th class="trn"></th>
      </tr>
    `)
  if (data) {
    data.forEach((point, index) => {
      const {sZoneName, dDateTimeUpdated, sCheckPointName, sCheckPointNote, bFixedCheckPoint, bGPS, bQRCode, bRFID} = point;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sCheckPointName}</td>
          <td>${sCheckPointNote}</td>
          <td>${bFixedCheckPoint}</td>
          <td>${bGPS}</td>
          <td>${bQRCode}</td>
          <td>${bRFID}</td>
          <td>${dDateTimeUpdated}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu">
                <button class="btn btn-custom btn-info btnPointUpdate btn-custom-small dropdown-item trn">Update</button>
                <button class="btn btn-custom btn-danger btnPointDelete btn-custom-small dropdown-item trn" style="margin-left:-5px">Lock</button>
                <button class="btn btn-custom btn-success btnPointQuestions btn-custom-small dropdown-item trn" style="margin-left:-5px">Add Questions</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnPointUpdate').last().click(function(){
        showUpdatePointModal(point);
      })
      $tbody.find('.btn.btnPointDelete').last().click(function(){
        inActivePoint(point);
      })
      $tbody.find('.btn.btnPointQuestions').last().click(function(){
        showPointQuestionsModal(point);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function buildPointsMap(points, id){
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#${id}`)[0], mapProp);
  let icon = '../../img/Checked.png';

  google.maps.event.addListener(mymap, 'click', function(event) {
    handleClickPointMap(mymap, event);
  });

  //show all points
  if(points && points.length > 0){
    points.forEach(point => {
      const { iCheckPointID, dCheckPointLat, dCheckPointLong, bQRCode, bRFID } = point;
      let type = checkPointType(bQRCode, bRFID);
      let mes = `<div style="font-size: 0.9em">ID: ${iCheckPointID} - ${type}</div>`;
      let lat = Number(dCheckPointLat);
      let lng = Number(dCheckPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      marker.addListener('mouseover', function() {
        infoWindow.open(mymap, marker);
      });
      mymap.setCenter(pos);
    })
  }
}

function checkPointType(QRCode, RFID){
  if(QRCode != 0) return 'QRCode';
  if(RFID != 0) return 'RFID';
  return 'GPS';
}

function handleClickPointMap(mymap, event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  let mes = `${lat} - ${lng}`;
  $('.latPoint').val(lat + '');  
  $('.longPoint').val(lng + '');  
  let icon = '../../img/Checked.png';
  let marker = GoogleMapService.createMarker(pos, icon);
  marker.setMap(mymap);
}

function showPointsMap(){
  let $mapArea = $('<div id="mapPoint" class="mymap" style="height:450px"></div>'); 
  $('#modalMapPoint').find('.modal-body').html($mapArea);
  $('#modalMapPoint').modal('show');
  buildPointsMap(arrPoints, 'mapPoint');
}

async function showPointsData() {
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await PointService.getPointsData(sentData);
  arrPoints = [];
  //console.log(data);
  if(data) {
    arrPoints = [...data];
    arrFilteredPoints = arrPoints.slice();
  }else{
    AlertService.showAlertError("No data available", "", 3000);
  }
  showPointsPagination(data);
  setDefaultLang();
}

function filterPointsData(){
  let id = $('#jcomboboxZone').val();
  arrFilteredPoints = FilterService.filterDataByID(arrPoints, 'iZoneID', id);
  showPointsPagination(arrFilteredPoints);
}

function showPointsPagination(data){
  if(!data || data.length == 0) return resetTblPoints();
  $('#totalPoints').html(`<strong class="trn">Total Points</strong>: ${data.length}`)
  $('#pagingPointsControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderPointsTable(data);
      $('.card-points .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblPoints(){
  $('#totalPoints').html('');
  $('#pagingPointsControl').html('');
  $('#tblPoints').find('tbody').html('');
}

function showInsertPointModal(){
  currentUpdatedPoint = null;
  currentCode = { iQRCode: null, iRFID: null, sRFIDCode: null, sQRCode: null };
  let $mapArea = $('<div id="mapPointInsert" class="mymap"></div>'); 
  $('#insertPointMap').html($mapArea);
  $('#latInsertPoint').val('');
  $('#longInsertPoint').val('');
  $('#txtInsertPointCode').val('');
  $('#txtInsertPointName').val('');
  $('#txtInsertPointNote').val('');

  $('#NotFixedCheckpoint').prop({ 'checked': true });
  $('#txtInsertRadiusAllow').parent('.form-group').hide(0);

  $('#modalInsertPoint').modal('show');
  $txtInsertPointRFIDSerial.attr({ 'disabled': false }).val('').parent().siblings('span.checkcode').remove();
  $txtInsertPointQRCodeSerial.attr({ 'disabled': false }).val('').parent().siblings('span.checkcode').remove();
  buildPointsMap(arrPoints, 'mapPointInsert');
}

async function getCurrentCodeUpdatePoint(sRFIDSerialNumber, sQRCodeSerialNumber){
  currentCode = { iRFID: null, sRFIDCode: null, iQRCode: null, sQRCode: null };
  if(ValidationService.checkEmpty(sRFIDSerialNumber)){
    let sentData = { sRFIDSerialNumber };
    let res = await PointService.checkQRCodeExists(sentData);
    if(!res) return;
    let { iRFID, sRFIDCode } = res[0];
    currentCode.iRFID = iRFID;
    currentCode.sRFIDCode = sRFIDCode;
  }
  if(ValidationService.checkEmpty(sQRCodeSerialNumber)){
    let sentData = { sRFIDSerialNumber };
    let res = await PointService.checkQRCodeExists(sentData);
    if(!res) return;
    let { iQRCode, sQRCode } = res[0];
    currentCode.iQRCode = iQRCode;
    currentCode.sQRCode = sQRCode;
  }
} 

async function showUpdatePointModal(point){
  const { sCheckPointName, sCheckPointNote, dCheckPointLat, 
    dCheckPointLong, sQRCodeSerialNumber, sRFIDSerialNumber, bFixedCheckPoint, iRadiusAllow } = point

  currentUpdatedPoint = Object.assign({}, point);
  
  await getCurrentCodeUpdatePoint(sRFIDSerialNumber, sQRCodeSerialNumber);
  let $mapArea = $('<div id="mapPointUpdate" class="mymap"></div>'); 
  $('#updatePointMap').html($mapArea);
  $('#txtUpdatePointNote').val(sCheckPointNote);
  $('#txtUpdatePointName').val(sCheckPointName);
  $('#latUpdatePoint').val(dCheckPointLat);
  $('#longUpdatePoint').val(dCheckPointLong);
  $('#txtUpdatePointRFIDSerial').val(sRFIDSerialNumber);
  $('#txtUpdatePointQRCodeSerial').val(sQRCodeSerialNumber);
  
  $('#UpdateFixedCheckpoint').prop({ 'checked': true });
  if(bFixedCheckPoint == 0){
    $('#NotUpdateFixedCheckpoint').prop({ 'checked': true });
    $('#txtUpdateRadiusAllow').val('0').parent('.form-group').hide(0);
  }else{
    $('#UpdateFixedCheckpoint').prop({ 'checked': true });
    $('#txtUpdateRadiusAllow').val(iRadiusAllow).parent('.form-group').show(0);
  }
  
  $txtUpdatePointQRCodeSerial.attr({ 'disabled': false }).val('').parent().siblings('span.checkcode').remove();
  $txtUpdatePointRFIDSerial.attr({ 'disabled': false }).val('').parent().siblings('span.checkcode').remove();
  $('#modalUpdatePoint').modal('show');
  setTimeout(() => {
    buildPointsMap([point], 'mapPointUpdate');
  }, 100);
}

async function inActivePoint(point){
  //delete point here
  const { iCheckPointID, iZoneID } = point;
  let sure = await AlertService.showAlertWarning("Are you sure!", "");
  if(sure){
    let user = getUserAuth();
    let sCompanyCode = user.CompanyCode;
    let sCheckPointName = 0, sCheckPointNote = 0, dGPSLat = 0, 
    dGPSLong = 0, iQRCode = 0, sRFIDCode = 0, iRFID = 0, sQRCode = 0, iRadiusAllow = 0, iCheckpointFixed = 0;
    let bStatus = 3; 
    let sentData = { sCompanyCode, iCheckPointID, sCheckPointName, sCheckPointNote, 
      iZoneID, dGPSLat, dGPSLong, iQRCode, sQRCode, iRFID, sRFIDCode, 
      bStatus, iRadiusAllow, iCheckpointFixed };
    //console.log(JSON.stringify(sentData))
    let response = await PointService.inActivePoint(sentData);
    //console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    if(Result == '1'){
      AlertService.showAlertSuccess("Inactive successfully!", "", 2000); 
      showPointsData();
    } else{
      AlertService.showAlertError("Inactive unsuccessfully", Msg, 6000);
    }
  }
}

async function updatePoint(){
  let { iCheckPointID } = currentUpdatedPoint;
  let user = getUserAuth();
  let dGPSLat = Number($('#latUpdatePoint').val());
  let dGPSLong = Number($('#longUpdatePoint').val());
  let sCheckPointName = $('#txtUpdatePointName').val();
  let sCheckPointNote = $('#txtUpdatePointNote').val();
  let iRadiusAllow = $('#txtUpdateRadiusAllow').val();
  let iCheckpointFixed = $('#UpdateFixedCheckpoint').prop('checked') ? '1' : '0';
  let bStatus = 2;
  let iZoneID = $('#selectZoneUpdatePoint').val();
  let sCompanyCode = user.CompanyCode;
  let { iQRCode, iRFID, sRFIDCode, sQRCode } = currentCode;
  let { valid, msgErr } = checkValid(sCheckPointName, sCheckPointNote, iRadiusAllow);
  if(!valid) return AlertService.showAlertError("Invalid data!", msgErr);
  let sentData = { sCompanyCode, iCheckPointID, sCheckPointName, 
    sCheckPointNote, iZoneID, dGPSLat, dGPSLong, iQRCode, sQRCode, iRadiusAllow,
    iRFID, sRFIDCode, bStatus, iCheckpointFixed}
  let response = await PointService.updatePoint(sentData);
  //console.log(response);
  let { Result, Msg } = JSON.parse(response)[0];
  if(Result == '1'){
    showPointsData();
    AlertService.showAlertSuccess("Update successfully!", "", 3000);
  } else{
    AlertService.showAlertError("Update unsuccessfully", Msg, 6000);
  }
}

async function checkPointLimit(){
  let sentData = CommonService.getSentDataCompanyCode();
  let res = await PointService.checkPointLimit(sentData);
  if(!res) return false;
  let { Result, Msg } = res[0];
  if(Result != 1) {
    AlertService.showAlertError(Msg, '');
    return false;
  }
  return true;
}

async function insertPoint(){
  let notLimited = checkPointLimit();
  if(!notLimited) {
    $('#modalInsertPoint').modal('hide');
    AlertService.showAlertError('The number of points is limitted', '');
  }else{
    let user = getUserAuth();
    let sCompanyCode = user.CompanyCode;
    let iCheckPointID = 0;
    let sCheckPointName = $('#txtInsertPointName').val();
    let sCheckPointNote = $('#txtInsertPointNote').val();
    let iZoneID = $('#selectZoneInsertPoint').val();
    let dGPSLat = $('#latInsertPoint').val();
    let dGPSLong = $('#longInsertPoint').val();

    let iRadiusAllow =  $('#txtInsertRadiusAllow').val();
    let iCheckpointFixed = $('#FixedCheckpoint').prop('checked') ? '1' : '0';

    let { iQRCode, iRFID, sRFIDCode, sQRCode } = currentCode;
    let bStatus = 1;
    
    let isChosenPoint = ValidationService.checkEmpty(dGPSLat) && ValidationService.checkEmpty(dGPSLong);
    if(!isChosenPoint) return AlertService.showAlertError("Invalid data!", 'You have not chosen any point');

    let { valid, msgErr } = checkValid(sCheckPointName, sCheckPointNote, iRadiusAllow);
    if(!valid) return AlertService.showAlertError("Invalid data!", msgErr);

    let sentData = { sCompanyCode, iCheckPointID, sCheckPointName, sCheckPointNote, 
    iZoneID, dGPSLat, dGPSLong, iQRCode, sQRCode, iRadiusAllow,
    iRFID, sRFIDCode, bStatus, iCheckpointFixed };

    //console.log(JSON.stringify(sentData));
    let response = await PointService.insertPoint(sentData);
    //console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    if(Result == '1'){
      AlertService.showAlertSuccess("Insert successfully!", "", 2000); 
      showPointsData();
      $('#modalInsertPoint').modal('hide');
    } else{
      AlertService.showAlertError("Insert unsuccessfully", Msg, 6000);
    }
  }
}

function checkValid(name, note, radius){
  let msgErr = [];
  if(!ValidationService.checkEmpty(name)){
    msgErr.push('Point name must be filled\n'); 
  }
  if(!ValidationService.checkEmpty(note)){
    msgErr.push('Point note must be filled\n');
  }
  if(!ValidationService.checkPositiveNumber(radius)){
    msgErr.push('Radius must be positive number\n');
  }
  // let { iRFID, sRFIDCode, iQRCode, sQRCode } = currentCode;
  // if(!iQRCode && !iRFID){
  //   msgErr += 'QRCode Seri or RFID Seri must be provided!\n'
  //   valid = false;
  // }
  let valid = msgErr.length == 0;
  return { valid, msgErr: msgErr.join('') };
}

async function showIncidentContent(){
  let sentData = CommonService.getSentDataCompanyCode();
  let incidentsContent = await IncidentService.getIncidentContent(sentData);
  let pointsQuestion = $('.pointQuestions');
  //console.log(incidentsContent);
  pointsQuestion.html('');
  if(!incidentsContent) return;
  incidentsContent.forEach(incident => {
    let { iIncidentsListID, sIncidentsListContent } = incident;
    pointsQuestion.append(`<option value="${iIncidentsListID}">${sIncidentsListContent}</option>`)
  })
}

