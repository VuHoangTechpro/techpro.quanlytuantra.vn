$(() => {
  $('#formUpdateGuard').submit((e) => {
    e.preventDefault();
    updateGuard();
  });
  $('#formInsertGuard').submit(e => {
    e.preventDefault();
    insertGuard();
  });
  $('#btnShowGuardInsertModal').click(showGuardModalInsert);
  $('#btnSendMessageGuard').click(sendMessageGuard);
  $('#selectFilterGuardByGroup').change(filterGuards);
  $('#btnConfirmPass').click(saveNewPassword);
  showGuardGroupsFilter()
  SelectComponentService.renderGroupSelectList(false);
  showGuards();
})

let currentSendMessageGuard = null;
let arrGuards = [];
let arrFilteredGuards = [];

async function saveNewPassword(){
  let pass = $('#txtUpdateGuardPassword').val();
  let repass = $('#txtUpdateGuardRepassword').val();
  if(!validateResetPassword(pass, repass)) return;
  let { iGuardID } = guard;
  let sentData = {iGuardID, pass};
  let response = GuardService.resetGuardPassword(sentData);
  AlertService.showAlertSuccess("Reset successfully", "", 4000);
}

function validateResetPassword(pass, repass){
  let err = '';
  let valid = true;
  if(!checkPass(pass)){
    valid = false;
    err += 'Password is required and more than 6 characters\n'
  }
  if(!checkPass(repass)){
    valid = false;
    err += 'Repassword is required and more than 6 characters\n'
  }
  if(pass != repass) {
    valid = false;
    err += 'Repassword and password must be the same\n'
  }
  if(!valid) AlertService.showAlertError("Invalid data!!!", err);
  return valid;
}

function checkPass(pass){
  if(!ValidationService.checkEmpty(pass)) return false;
  if(pass.trim().length < 6 ) return false;
  return true;
}

function showModalResetPass(){
  $('#txtUpdateGuardPassword').val('');
  $('#txtUpdateGuardRepassword').val('');
  $('#modalResetPassword').modal('show');
}

async function checkGuardlimit(){
  let sentData = CommonService.getSentDataCompanyCode();
  let res = await GuardService.checkGuardlimit(sentData);
  return CommonService.getResponseResult(res);
}


// {"sCompanyCode":"deepC_2510180932006129", "sGuardName":"vuhoangtesttest3", "sGuardPhone":"123456789111", 
  // "sGuardUsername":"112233111333", "sGuardPassword":"12361113", "sGuardPasswordMQTT":"12361113", 
  // "iGuardID":65, "iGroupID":20, "bStatus":3}
async function insertGuard(){
  let notLimitted = await checkGuardlimit();
  if(!notLimitted) return AlertService.showAlertError('Can not add guard', '', 5000);
  let sCompanyCode = getUserAuth().CompanyCode;
  let sGuardName = $('#txtInsertGuardName').val();
  let sGuardPhone = $('#txtInsertGuardPhone').val();
  let sGuardUsername = $('#txtInsertGuardUsername').val();
  let sGuardPassword = $('#txtInsertGuardPassword').val();
  let iGroupID = $('#selectInsertGuardGroup').val();
  let iGuardID = 0;
  let sGuardPasswordMQTT = sGuardPassword;
  let bStatus = 1;
  let { valid, errMsg } = checkValidation(sGuardName, sGuardUsername, sGuardPhone, sGuardPassword);
  if(!valid) return AlertService.showAlertError("Invalid data!", errMsg);
  let sentData = { sCompanyCode, sGuardPasswordMQTT, sGuardName, sGuardPhone, sGuardUsername, sGuardPassword, iGuardID, bStatus, iGroupID };
  //console.log(JSON.stringify(sentData));
  let response = await GuardService.insertGuard(sentData);
  let success = CommonService.getResponseResult(response);
  if(success){
    $('#modalInsertGuard').modal('hide');
    AlertService.showAlertSuccess("Insert successfully!", "", 2000);
    showGuards();
  }else{
    AlertService.showAlertError("Insert unsuccessfully!", "", 5000);
  }
}

function checkValidation(name, username, phone, password){
  let valid = true;
  let errMsg = '';
  if(name == null || name.trim() == ''){
    valid = false;
    errMsg += 'Name must be filled in\n'
  } 
  if(username == null || username.trim() == ''){
    valid = false;
    errMsg += 'Username must be filled in\n'
  } 
  if(!/^[0-9]+$/.test(phone)){
    valid = false;
    errMsg += 'Phone must be number\n'
  } 
  if(password.trim().length < 4){
    valid = false;
    errMsg += 'Password must be longer than 4\n'
  } 
  return { valid, errMsg };
}

async function updateGuard(){
  let sCompanyCode = getUserAuth().CompanyCode;
  let iGuardID = $('#txtUpdateGuardID').val();
  let sGuardName = $('#txtUpdateGuardName').val();
  let sGuardPhone = $('#txtUpdateGuardPhone').val();
  let sGuardUsername = $('#txtUpdateGuardUsername').val();
  let iGroupID = $('#selectUpdateGuardGroup').val();
  let bStatus = 2;
  let sGuardPasswordMQTT = 0, sGuardPassword = 0
  let { valid, errMsg } = checkValidation(sGuardName, sGuardUsername, sGuardPhone, 'password');
  if(!valid) return AlertService.showAlertError('Invalid data!', errMsg, 5000);
  
  let sentData = { sCompanyCode, sGuardPasswordMQTT, sGuardName, sGuardPhone, sGuardUsername, sGuardPassword, iGuardID, bStatus, iGroupID };
  let response = await GuardService.updateGuard(sentData);
  let success = CommonService.getResponseResult(response);
  if(success){
    $('#modalUpdateGuard').modal('hide');
    AlertService.showAlertSuccess("Updated successfully!", "", 2000);
    showGuards();
  }else{
    AlertService.showAlertError("Updated unsuccessfully!", "", 5000);
  }
}

async function inActiveGuard(guard){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    let sCompanyCode = getUserAuth().CompanyCode;
    let sGuardPasswordMQTT = '0', sGuardName = '0', sGuardPhone = '0', sGuardUsername = '0', sGuardPassword = '0',iGroupID = 0;
    let { iGuardID }= guard;
    let bStatus = 3;
    let sentData = { sCompanyCode, sGuardPasswordMQTT, sGuardName, sGuardPhone, sGuardUsername, sGuardPassword, iGuardID, bStatus, iGroupID };
    let response = await GuardService.inActiveGuard(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      AlertService.showAlertSuccess("Locked successfully!", "", 2000);
      showGuards();
    }else{
      AlertService.showAlertError("Locked unsuccessfully!", "", 5000);
    }
  }
}

function renderGuardTable(guards){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblGuards"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">#</th>
      <th class="trn">Full name</th>
      <th class="trn">Phone number</th>
      <th class="trn">User name</th>
      <th class="trn">Group</th>
      <th class="trn">Position</th>
      <th class="trn">Active</th>
    </tr>
  `
  )
  if (guards) {
    guards.forEach((guard, index) => {
      const {sGuardName, sGuardPhone, sGuardUserName, bActive, sGroupName, sPosition} = guard;
      let active = bActive == 1 ? 'Active': 'Inactive';
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sGuardName}</td>
          <td>${sGuardPhone}</td>
          <td>${sGuardUserName}</td> 
          <td>${sGroupName}</td>
          <td>${sPosition}</td> 
          <td>${active}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnInactiveGuard trn">Lock</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item btnShowUpdateGuardModal trn">Update</button>
                <button class="btn btn-custom btn-warning btn-custom-small dropdown-item btnShowModalResetPassword trn">Reset Password</button>
                <button class="btn btn-custom btn-primary btn-custom-small dropdown-item btnShowModalSendMessage trn">Send Message</button>
                <button class="btn btn-custom btn-success btn-custom-small dropdown-item btnShowMapGuardCurrentPos trn">View map</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnInactiveGuard').last().click(() => {
          inActiveGuard(guard);
      })
      $tbody.find('.btn.btnShowUpdateGuardModal').last().click(() => {
        showGuardModalUpdate(guard);
      })
      $tbody.find('.btn.btnShowModalResetPassword').last().click(() => {
        showModalResetPass();
      })
      $tbody.find('.btn.btnShowModalSendMessage').last().click(() => {
        showModalSendMessage(guard);
      })
      $tbody.find('.btn.btnShowMapGuardCurrentPos').last().click(() => {
        showModalGuardCurrentPos(guard);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showModalGuardCurrentPos(guard){
  let { iGuardID } = guard;
  buildCurrentPosGuardMap(iGuardID);
  $('#modalShowMapGuardCurrentPos').modal('show');
}

function showModalSendMessage(guard){
  const { iGuardID, sGuardName } = guard;
  currentSendMessageGuard = guard;
  $('#txtSendMessageGuardName').val(sGuardName);
  $('#textAreaSendMessage').val('')
  $('#modalSendMessageGuard').modal('show');
}

async function sendMessageGuard(){
  const { iGuardID } = currentSendMessageGuard;
  let sMessageContent = $('#textAreaSendMessage').val();
  let user =  getUserAuth();
  let { UserID, CompanyCode } = user;
  let sentData = { sMessageContent, iGuardID: [iGuardID], sCompanyCode: CompanyCode, iUserIDSend: UserID };
  let response = await GuardService.sendSMSToGuards(sentData);
  $('#modalSendMessageGuard').modal('hide');
  AlertService.showAlertSuccess("Send successfully!", "", 2000);
}

function showGuardModalUpdate(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, iGuardGroupID} = guard
  $('#txtUpdateGuardID').val(iGuardID);
  $('#txtUpdateGuardPhone').val(sGuardPhone);
  $('#txtUpdateGuardName').val(sGuardName);
  $('#txtUpdateGuardUsername').val(sGuardUserName);
  $('#selectUpdateGuardGroup').val(iGuardGroupID);
  $('#modalUpdateGuard').modal('show');
}

function showGuardModalInsert(){
  $('#formInsertGuard')[0].reset();
  $('#modalInsertGuard').modal('show');
}

function filterGuards(){
  let id = $('#selectFilterGuardByGroup').val();
  arrFilteredGuards =FilterService.filterDataByID(arrGuards, 'iGuardGroupID', id);
  showGuardPagination(arrFilteredGuards);
}

async function showGuards(){
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await GuardService.getPersonalGuardsInfo(sentData);
  //console.log(data);
  arrGuards.length = 0;
  arrFilteredGuards.length = 0;
  if(data) {
    arrGuards = data.slice();
    arrFilteredGuards = data.slice();
  }else{
    AlertService.showAlertError("No data available", "", 3000);
  }
  showGuardPagination(data);
  setDefaultLang();
}

function showGuardPagination(guards){
  if(!guards || guards.length == 0) return resetTblPersonalGuardInfo();
  $('#totalGuards').html(`<strong class="trn">Total Guards</strong>:  ${guards.length}`);
  $('#pagingGuardsControl').pagination({
    dataSource: guards,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (guards, pagination) {
      let $table = renderGuardTable(guards);
      $('.card-guard .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblPersonalGuardInfo(){
  $('#totalGuards').html('');
  $('#pagingGuardsControl').html('');
  $('#tblGuards').find('tbody').html('');
}

async function buildCurrentPosGuardMap(iGuardID, sCheckingCode){
  let $mapArea = $('<div id="guardCurrentPosMapArea" style="widht:100%" class="mymap"></div>');
  $('#modalShowMapGuardCurrentPos').find('.modal-body').html($mapArea);
  let sentGuardData = { iGuardID };
  let guardGPSCurrent = await GuardService.getGuardGPSCurrent(sentGuardData);
  const { dGuardLatCurrent, dGuardLongCurrent, sMessage, bOnline } = guardGPSCurrent[0];
  let latGuard = Number(dGuardLatCurrent);
  let lngGuard = Number(dGuardLongCurrent);
  let mapProp = GoogleMapService.createMapProp(18, latGuard, lngGuard)
  let mymap = new google.maps.Map($('#guardCurrentPosMapArea')[0], mapProp);
  let urlGuard = '../../img/GuardOnline.png';
  let mainPos = new google.maps.LatLng(latGuard, lngGuard);
  let guardMarker = GoogleMapService.createMarker(mainPos, urlGuard);

  guardMarker.setMap(mymap);
  let infoWindowGuard = GoogleMapService.createInfoWindow(sMessage);
  infoWindowGuard.open(mymap, guardMarker);
  if(sCheckingCode){
    const pointChekingSentData = { iGuardID, sCheckingCode };
    let checkingPointData = await PointService.getPointChecking(pointChekingSentData);
    if(checkingPointData){
      checkingPointData.forEach(checkedPoint => {
        let { Lat, Long, Status, Message, ImageUrl } = checkedPoint;
        let url = '';
        switch(Status){
          case 1: 
            url = '../../img/Checked.png'; 
            break;
          case 2: 
            url = '../../img/None.png'; 
            break;
          case 3: 
            url = '../../img/Waiting.png'; 
            break;
          case 4: 
            url = '../../img/error.png'; 
            break;
        }
        let pos = new google.maps.LatLng(Lat, Long);
        let marker = GoogleMapService.createMarker(pos, url);
        marker.setMap(mymap);
        let mes = Message;
        if(Status == 4){
          mes = `${Message}<br><img src="${APP_DOMAIN}${ImageUrl}" class="img-fluid">`
          let infoWindow = GoogleMapService.createInfoWindow(mes);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(mymap, marker);
          });
        }else{
          let infoWindow = GoogleMapService.createInfoWindow(mes);
          infoWindow.open(mymap, marker);
        }
      })
    }
  }
}

async function showGuardGroupsFilter(){
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await GroupService.getGroupsList(sentData);
  $('#selectFilterGuardByGroup').html('');
  if(data){
    $('#selectFilterGuardByGroup').append(`<option value="0">All</option>`);
    data.forEach(group => {
      const { iGuardGroupID, sGroupName } = group;
      $('#selectFilterGuardByGroup').append(`<option value="${iGuardGroupID}">${sGroupName}</option>`);
    })
  }
}



