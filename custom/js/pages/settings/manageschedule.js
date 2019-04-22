$(() => {
  $('#btnShowSchedule').click(showSchedule);
  $('#btnShowScheduleInsertModal').click(showScheduleInsertModal);
  $('#btnInsertSchedule').click(insertSchedule);
  $('#btnUpdateSchedule').click(updateSchedule);
  showSchedule();
})

let currentUpdateSchedule = null;

function showInsertScheduleModal() {
  $('#modalInsertSchedule').modal('show');
}

async function showSchedule() {
  let data = await Service.getSchedule();
  if (data) {
    $('#totalSchedule').html(`<strong class="trn">Total Rows</strong>: ${data.length}`)
    $('#pagingScheduleControl').pagination({
      dataSource: data,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderTblSchedule(data);
        $('.card-schedule .table-responsive').html($table);
        setDefaultLang();
      }
    })
  } else {
    resetTblSchedule();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

async function insertSchedule() {
  let name = $('#txtInsertScheduleName').val();
  let start = $('#txtInsertScheduleStart').val();
  let end = $('#txtInsertScheduleEnd').val();
  if (checkValidEmptyFields(name, start, end)) {
    if (!checkStartEndTimeValid(start, end)) return showAlertError("Invalid data", "Start time must be sooner than end time!!", 6000);
    let sentData = {
      sScheduleNameIN: name,
      dTimeStartIN: start,
      dTimeEndIN: end,
      bStatusIN: 1,
      iScheduleIDIN: 0
    };
    //console.log(JSON.stringify(sentData));
    let response = await Service.insertSchedule(sentData);
    //console.log(response);
    showSchedule();
    showAlertSuccess("Insert Successfully", "", 3000);
  }
}

function checkValidEmptyFields(name, start, end) {
  let errMsg = '';
  let valid = true;
  if (!Validation.checkEmpty(name)) {
    valid = false;
    errMsg += 'Name must be filled in\n'
  }
  if (!Validation.checkEmpty(start)) {
    valid = false;
    errMsg += 'Start time must be filled in\n';
  }
  if (!Validation.checkEmpty(end)) {
    valid = false;
    errMsg += 'End time must be filled in\n';
  }
  if (!valid) {
    showAlertError("Invalid data!!", errMsg, 6000);
  }
  return valid;
}

function checkStartEndTimeValid(start, end) {
  let arr1 = start.split(':');
  let arr2 = end.split(':');
  if (parseInt(arr1[0]) > parseInt(arr2[0])) return false;
  if (parseInt(arr1[0]) == parseInt(arr2[0])) {
    if (parseInt(arr1[1]) >= parseInt(arr2[1])) return false;
  }
  return true;
}

function resetTblSchedule() {
  $('#totalSchedule').html('');
  $('#pagingScheduleControl').html('');
  $('#tblSchedule').find('tbody').html('');
}

function renderTblSchedule(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblSchedule"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">ID</th>
        <th class="trn">Name</th>
        <th class="trn">Start</th>
        <th class="trn">End</th>
        <th class="trn">Status</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((schedule) => {
      const {
        bStatus,
        dTimeEnd,
        dTimeStart,
        iScheduleID,
        sScheduleName
      } = schedule;
      $tbody.append(`
        <tr>
          <td>${iScheduleID}</td>
          <td>${sScheduleName}</td>
          <td>${dTimeStart}</td>
          <td>${dTimeEnd}</td>
          <td>${bStatus}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateScheduleModal btn-custom-small trn">Update</button>
            <button class="btn btn-custom bg-main-color btnInactiveShedule btn-custom-small trn">Delete</button>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateScheduleModal').last().click(() => {
        showUpdateScheduleModal(schedule);
      })
      $tbody.find('.btnInactiveShedule').last().click(() => {
        inactiveSchedule(schedule);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateScheduleModal(schedule) {
  const {
    sScheduleName,
    dTimeStart,
    dTimeEnd
  } = schedule;
  currentUpdateSchedule = Object.assign({}, schedule);
  $('#modalUpdateSchedule').modal('show');
  $('#txtUpdateScheduleName').val(sScheduleName);
  $('#txtUpdateScheduleStart').val(dTimeStart);
  $('#txtUpdateScheduleEnd').val(dTimeEnd);
  $('#modalUpdateSchedule').modal('show');
}

async function updateSchedule() {
  let name = $('#txtUpdateScheduleName').val();
  let start = $('#txtUpdateScheduleStart').val();
  let end = $('#txtUpdateScheduleEnd').val();
  if (checkValidEmptyFields(name, start, end)) {
    if (!checkStartEndTimeValid(start, end)) return showAlertError("Invalid data", "Start time must be sooner than end time!!", 6000);
    const {
      iScheduleID
    } = currentUpdateSchedule;
    let sentData = {
      sScheduleNameIN: name,
      dTimeStartIN: start,
      dTimeEndIN: end,
      bStatusIN: 2,
      iScheduleIDIN: iScheduleID
    };
    //.log(JSON.stringify(sentData));
    let response = await Service.updateSchedule(sentData);
    //console.log(response);
    showSchedule();
    showAlertSuccess("Update Successfully", "", 3000);
  }
}

async function inactiveSchedule(schedule) {
  let sure = await showAlertWarning("Are you sure?", "");
  if (sure) {
    const {
      iScheduleID
    } = schedule;
    let sentData = {
      iScheduleIDIN: iScheduleID,
      sScheduleNameIN: 0,
      dTimeStartIN: 0,
      dTimeEndIN: 0,
      bStatusIN: 3
    };
    let response = await Service.inactiveSchedule(sentData);
    showSchedule();
    showAlertSuccess("Delete Successfully", "", 3000);
  }
}

function showScheduleInsertModal() {
  $('#txtInsertScheduleName').val('');
  $('#txtInsertScheduleStart').val('');
  $('#txtInsertScheduleEnd').val('');
  $('#modalInsertSchedule').modal('show');
}