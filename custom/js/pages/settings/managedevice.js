$(() => {
  $('#btnViewDeviceData').click();
  $('#btnShowInsertDeviceModal').click(showInsertDeviceModal);
  $('#btnInsertDevice').click(insertDevice);
  // $('#btnUpdateDevice').click(updateDevice);
  showDevices();
})

let currentDeviceUpdate = null;
// {"sCompanyCode":"deepC_2510180932006129","sDeviceName":"1","sDeviceSerial":"2","iDeviceID":0,"bStatus":1}
async function insertDevice(){
  let notLimitted = checkDeviceLimit();
  if(!notLimitted) return AlertService.showAlertError('The number of the device is limitted!', '');
  let sCompanyCode = getUserAuth().CompanyCode;
  let sDeviceName = $('#txtInsertDeviceName').val();
  let sDeviceSerial = $('#txtInsertDeviceSerial').val();
  let iDeviceID = '0';
  let bStatus = 1;
  if(!ValidationService.checkEmpty(sDeviceName) || !ValidationService.checkEmpty(sDeviceSerial)){
    AlertService.showAlertError("Invalid data", "Both Name and Serial must be filled");
  } else{
    let sentData = { sCompanyCode, sDeviceName, sDeviceSerial, iDeviceID, bStatus };
    let response = await DeviceService.insertDevice(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      showDevices();
      $('#modalInsertDeivce').modal('hide');
      AlertService.showAlertSuccess("Insert Successfully", "", 3000);
    }else{
      AlertService.showAlertError("Insert Unsuccessfully", "", 3000);
    }
  }
}

async function checkDeviceLimit(){
  let sentData = CommonService.getSentDataCompanyCode();
  let response = await DeviceService.checkDeviceLimit(sentData);
  let success = CommonService.getResponseResult(response);
  return success;
}

function showInsertDeviceModal(){
  $('#modalInsertDeivce').modal('show');
  $('#txtInsertDeviceName').val('');
  $('#txtInsertDeviceSerial').val('');
}

// function showUpdateDeviceModal(device){
//   currentDeviceUpdate = Object.assign({}, device);
//   const { sDeviceName, sDeviceSerial } = device;
//   $('#modalUpdateDevice').modal('show');
//   $('#txtUpdateDeviceName').val(sDeviceName);
//   $('#txtUpdateDeviceSerial').val(sDeviceSerial);
// }

// async function updateDevice(){
//   let sCompanyCode = getUserAuth().CompanyCode;
//   let sDeviceName = $('#txtUpdateDeviceName').val();
//   let sDeviceSerial = $('#txtUpdateDeviceSerial').val();
//   let bStatus = 2;
//   if(!Validation.checkEmpty(sDeviceName) || !Validation.checkEmpty(sDeviceSerial)){
//     showAlertError("Invalid data", "Both Name and Serial must be filled");
//   } else{
//     const { iDeviceID } = currentDeviceUpdate;
//     let sentData = { sCompanyCode, sDeviceName, sDeviceSerial, iDeviceID, bStatus  };
//     console.log(JSON.stringify(sentData));
//     let response = await Service.updateDevice(sentData);
//     console.log(response);
//     let success = CommonService.getResponseResult(response);
//     if(success){
//       showDevices();
//       $('#modalUpdateDevice').modal('hide');
//       AlertService.showAlertSuccess("Insert Successfully", "", 3000);
//     }else{
//       AlertService.showAlertError("Insert Unsuccessfully", "", 3000);
//     }
//   }
// }

async function lockDevice(device){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    const { iDeviceID } = device;
    let sCompanyCode = getUserAuth().CompanyCode;
    let sentData = { sCompanyCode, sDeviceName: 0, sDeviceSerial: 0, iDeviceID: iDeviceID, bStatus: 2 }
    let response = await DeviceService.lockDevice(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      showDevices();
      AlertService.showAlertSuccess("Locked Successfully", "", 3000);
    }else{
      AlertService.showAlertError("Locked unsuccessfully", "", 3000);
    }
  }
}

function renderDeviceTable(devices){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblDevice"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Serial</th>
      <th class="trn">Manufacturer</th>
      <th class="trn">Model</th>
      <th class="trn">OS ver.</th>
      <th class="trn">App ver.</th>
      <th class="trn">Status</th>
      <th class="trn">Battery</th>
      <th class="trn">Updated</th>
    </tr>
  `
  )
  if (devices) {
    devices.forEach(device => {
      const { bStatus, dBatteryPower, iDeviceID, sDeviceName, sDeviceSerialNumber, dDateTimeUpdated, sDeviceOSVersion, sAppVersion, sDeviceManufacturer, sDeviceModel } = device
      $tbody.append(`
        <tr>
          <td>${iDeviceID}</td>
          <td>${sDeviceName}</td>
          <td>${sDeviceSerialNumber}</td>
          <td>${sDeviceManufacturer}</td>
          <td>${sDeviceModel}</td>
          <td>${sDeviceOSVersion}</td>
          <td>${sAppVersion}</td>
          <td>${bStatus}</td>
          <td>${dBatteryPower}</td>
          <td>${dDateTimeUpdated}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowDetailDevice trn">Details</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnLockDevice trn">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowDetailDevice').last().click(() => {
        showDeviceDetail(device);
      })
      $tbody.find('.btnShowUpdateDeviceModal').last().click(() => {
        showUpdateDeviceModal(device);
      })
      $tbody.find('.btnLockDevice').last().click(() => {
        lockDevice(device);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showDeviceDetail(device){
  // console.log(device);
}

async function showDevices(){
  let sentData = CommonService.getSentDataCompanyCode();
  let devices = await DeviceService.getDevice(sentData);
  if(devices){
    $('#totalDevices').html(`<strong class="trn">Total Devices</strong>: ${devices.length}`);
    $('#pagingDevicesControl').pagination({
      dataSource: devices,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (devices, pagination) {
        let $table = renderDeviceTable(devices);
        $('.card-device .table-responsive').html($table);
        setDefaultLang();
      }
    })
  }else{
    resetTblDevice();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblDevice(){
  $('#totalDevices').html('');
  $('#pagingDevicesControl').html('');
  $('#tblDevice').html('');
}