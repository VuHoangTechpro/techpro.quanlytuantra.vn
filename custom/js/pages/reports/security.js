$(async () => {
  $('#btnShowSecuriity').click(showSecurity);
  $('#btnViewReportByWeek').click(() => {
    showSecurity('week');
  })
  $('#btnViewReportByMonth').click(() => {
    showSecurity('month');
  })
  showMonthsSelect();
  showWeeksSelect();
  showRouteList(true);
  setDefaultLoading();
  // showSecurityReportByDefault();
})


function setDefaultLoading(){
  let d = new Date();
  let month = d.getMonth();
  let week = getWeek();
  //console.log(week)
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  showSecurity('month');
}

async function showSecurity(type){
  let iRouteID = $('#selectRouteName').val();
  let sentData = { iRouteID, iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'week') sentData.iWeek = $('#reportWeek').val();
  else sentData.iMonth = $('#reportMonth').val();
  let data = await Service.getReportPerformance(sentData);
  //console.log(data);
  let header = '';
  if(data) showSecurityPagination(data, header)
  else{
    resetTblReportSecurity();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}


function showSecurityPagination(data, header){
  $('.headerTblReportSecurity').text(header);
  $('#totalSecurityReportRows').html(`<strong class="trn">Total rows</strong>: ${data.length}`);
  $('#pagingSecurityReportControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderSecurityTable(data);
      $('.card-securityReport .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblReportSecurity(){
  $('.headerTblReportSecurity').text('');
  $('#totalSecurityReportRows').html('');
  $('#pagingSecurityReportControl').html('');
  $('#tblReportSecurity').find('tbody').html('')
}

function renderSecurityTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportSecurity"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Week No.</th>
        <th class="trn">Day</th>
        <th class="trn">Date</th>
        <th class="trn">Guard</th>
        <th class="trn">Performance Route</th>
        <th class="trn">Performance Timing</th>
        <th class="trn">Performance Routing</th>
        <th class="trn">Performance Time</th>
        <th class="trn">Idle Time</th>
        <th class="trn">Spot check</th>
        <th class="trn">Remarks</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((security) => {
      const { dDAYNAME, dDateTimeUpdate, dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dWeek, sGuardName } = security;
      $tbody.append(`
        <tr>
          <td>${dWeek}</td>
          <td>${dDAYNAME}</td>
          <td>${dDateTimeUpdate}</td>
          <td>${sGuardName}</td>
          <td>${dPerformance_Routes}</td>
          <td>${dPerformance_Timing}</td>
          <td>${dPerformance_Routing}</td>
          <td>${dPerfomance_Time}</td>
          <td>${dIdling_Time_in}</td>
          <td></td>
          <td></td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function checkDate(from, to){
  let valid = true;
  let msgErr = '';
  if(!Validation.checkEmpty(from)){
    valid = false;
    msgErr += 'Start date must be filled\n'
  }
  if(!Validation.checkEmpty(to)){
    valid = false;
    msgErr += 'End date must be filled\n'
  }
  if(!valid){
    showAlertError("Invalid data", msgErr, 3000);
  }
  return valid;
}