$(() => {
 
  // $('#btnShowChartVsDataByWeek').click(async () => {
  //   let data = await getData('week');
  //   showAttendanceReportChart(data, 'week');
  //   renderReportTable(data);
  //   setDefaultLang();
  //   if(!data) AlertService.showAlertError('No data available!!!', '');
  // })
  $('#btnShowChartVsDataByMonth').click(async () => {
    showDataAttendance();
  });

  $('#selectReportType').change(() => {
    showPagination(arrAttendances);
  })

  $('#selectFilterByGroup').change(() => {
    let id = $('#selectFilterByGroup').val();
    arrFilteredAttendances = FilterService.filterDataByID(arrAttendances, 'sGuardGroupID', id);
    //console.log(arrFilteredAttendances);
    showPagination(arrFilteredAttendances);
  })

  $('#btnShowChartIdlingVsWorkingTimePercent').click(showModalChartWorkingTimeVsIdlingTimePercentGuards);

  // $('#btnShowChartVsDataByYear').click(async () => {
  //   let data = await getData('year');
  //   showAttendanceReportChart(data, 'year');
  //   renderReportTable(data);
  //   setDefaultLang();
  //   if(!data) AlertService.showAlertError('No data available!!!', '');
  // })

  SelectComponentService.renderGuardSelectList(false);
  SelectComponentService.renderGroupSelectList(true);
  // SelectComponentService.renderWeekSelectList();
  SelectComponentService.renderMonthSelectList();
  // SelectComponentService.renderYearSelectList();
  
  setDefaultLoading();
  showDataAttendance();
})

  // http://115.79.27.219/GuardTourApi/Web/report/ReportWorkingvsIdlingTimeGuard.php
  // {"sCompanyCode":"deepC_2510180932006129", "iMonth":11}

let arrAttendances = [];
let arrFilteredAttendances = [];
let arrSelectedGuards = [];

function renderReportTable(data){
  let $table = $('#tblReport');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  if(!data) return;
  $thead.html(`
      <tr>
        <th class="trn">Name</th>
        <th class="trn">Day</th>
        <th class="trn">Week</th>
        <th class="trn">Month</th>
        <th class="trn">Day in Month</th>
        <th class="trn">Working Per</th>
        <th class="trn">Total Time-working</th>
        <th class="trn">Idling Per</th>
        <th class="trn">Date Check</th>
        <th class="trn">Working Time Required</th>
      </tr>
    `)
  data.forEach((guard) => {
    const {sGuardName, sDay, iWeek, iMonth, iGuardID, iDay, dWorkingPercent, dTotalTimeWorking, dIdlingPercent, dDateCheck, WorkTimeRequire} = guard;
    $tbody.append(`
      <tr>
        <td>${sGuardName}</td>
        <td>${sDay}</td>
        <td>${iWeek}</td>
        <td>${iMonth}</td>
        <td>${iDay}</td>
        <td>${dWorkingPercent}</td>
        <td>${dTotalTimeWorking}</td>
        <td>${dIdlingPercent}</td>
        <td>${dDateCheck}</td>
        <td>${WorkTimeRequire}</td>
      </tr>
    `)
  })

  $table.append($tbody).append($thead);
}

async function showDataAttendance(type){
  let sCompanyCode = getUserAuth().CompanyCode;
  let iMonth = $('#reportMonth').val();
  let sentData = { sCompanyCode, iMonth };
  $('#selectReportType').val('1');
  $('#selectFilterByGroup').val('0');
  let data = await ReportService.getReportWorkingvsIdlingTimeGuard(sentData);
  arrAttendances.length = 0;
  arrFilteredAttendances.length = 0;
  arrSelectedGuards.length = 0;
  if(data){
    arrAttendances = data.slice();
    arrFilteredAttendances = data.slice();
    
  }
  showPagination(data);
}

function renderTableAttandanceWorkingTime(data){
  let $table = $(`<table class="table table-condensed text-center custom-table bordered" id="tblAttendanceGuard" style="min-height: 150px"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  renderTheadAttendanceWorkingTime($thead);
  renderTbodyAttendanceWorkingTime(data, $tbody);
  $table.append($thead).append($tbody);
  return $table;
}

function renderTheadAttendanceWorkingTime($thead){
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Guard</th>
      </tr>
    `
  )
  let m = +$('#reportMonth').val();
  let y = new Date().getFullYear();
  let arrMonthHeaders = TimeService.getDayInMonth(m, y);
  arrMonthHeaders.forEach(item => {
    let className = getClassNameHighLightCol(y, m, item);
    $thead.find('tr').append(`<th class=${className}>${item}</th>`);
  });
}

function renderTbodyAttendanceWorkingTime(data, $tbody){
  let m = +$('#reportMonth').val();
  let y = new Date().getFullYear();
  let numOfDayInMonth = TimeService.getNumOfDayInMonth(m, y);
  let spaces;
  data.forEach((guard, index) => {
    let { TimeAttendanceInfo, sGuardName, sGuardGroupID, iGuardID } = guard;
    $tbody.append(`<tr>
      <td>${index + 1}</td>
      <td class="font-weight-bold">${sGuardName}</td>
    </tr>`);
    
    TimeAttendanceInfo = JSON.parse(TimeAttendanceInfo);
    spaces = numOfDayInMonth - TimeAttendanceInfo.length;
    TimeAttendanceInfo.forEach((item, index) => {
      let { dTotalTimeWorking } = item;
      let className = getClassNameHighLightCol(y, m, index + 1);
      $tbody.find('tr').last().append(`
        <td class="${className}">${dTotalTimeWorking}</td>
      `)
    });
    addSpacesToTable(spaces, $tbody, TimeAttendanceInfo.length, y, m);
  })
}

function renderTableAttandanceStartFinishTime_WorkingTimePercent(data){
  let $table = $(`<table class="table table-condensed text-center custom-table bordered" id="tblAttendanceGuard" style="min-height: 150px"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  renderTheadAttendanceStartFinishTime_WorkingTimePercent($thead);
  renderTbodyAttendanceStartFinishTime_WorkingTimePercent(data, $tbody);
  $table.append($thead).append($tbody);
  return $table;
}

function renderTheadAttendanceStartFinishTime_WorkingTimePercent($thead){
  let type = $('#selectReportType').val();
  let thContent = '';
  if(type == 2) thContent = `<br> <input type="checkbox" id="checkboxSelectAllGuards">`;
  $thead.append(
    `
      <tr>
        <th class="trn">
          # ${thContent}
        </th>
        <th class="trn">Guard</th>
        <th></th>
      </tr>
    `
  )

  if(type == 2){
    let $ele = $thead.find('tr input#checkboxSelectAllGuards');
    $ele.change(e => {
      let { checked } = e.target;
      arrSelectedGuards.length = 0;
      if(checked) arrSelectedGuards = arrAttendances.slice();
      $thead.parent('table').find('tbody input.checkboxSelectGuard').prop({ 'checked': checked });
    })
  }

  let m = +$('#reportMonth').val();
  let y = new Date().getFullYear();
  let arrMonthHeaders = TimeService.getDayInMonth(m, y);
  arrMonthHeaders.forEach(item => {
    let className = getClassNameHighLightCol(y, m, item);
    $thead.find('tr').append(`<th class=${className}>${item}</th>`);
  });
}

function renderTbodyAttendanceStartFinishTime_WorkingTimePercent(data, $tbody){
  let m = +$('#reportMonth').val();
  let y = new Date().getFullYear();
  let type = $('#selectReportType').val();
  let arrLabels;
  if(type == 1) arrLabels = ['Time Start', 'Time Finish'];
  else if(type == 2) arrLabels = ['Idling Time Percent', 'Working Time Percent']
  let numOfDayInMonth = TimeService.getNumOfDayInMonth(m, y);
  let spaces;
  data.forEach((guard, index) => {
    let { TimeAttendanceInfo, sGuardName, sGuardGroupID, iGuardID } = guard;
    
    TimeAttendanceInfo = JSON.parse(TimeAttendanceInfo);
    if(index == 0) spaces = numOfDayInMonth - TimeAttendanceInfo.length; 
    let tdContent = '';
    if(type == 2) tdContent = `<br> <input type="checkbox" class="checkboxSelectGuard">`;
      $tbody.append(`
        <tr>
          <td rowspan="2">
            ${index + 1}${tdContent}
          </td>
          <td rowspan="2" class="font-weight-bold pt-5">${sGuardName}</td>
          <td>${arrLabels[0]}</td>
        </tr>
      `)

     if(type == 2){
      $tbody.find('tr').last().find('input.checkboxSelectGuard').change((e) => {
        let { checked } = e.target;
        if(checked) arrSelectedGuards.push(guard);
        else{
          let i = arrSelectedGuards.findIndex(g => g.iGuardID == iGuardID);
          arrSelectedGuards.splice(i, 1);
        }
      })
     }
      TimeAttendanceInfo.forEach((item, index) => {
        let { dTimeStart, dIdlingPercent } = item;
        let val = dTimeStart;
        if(type == 2) val = dIdlingPercent;
        let className = getClassNameHighLightCol(y, m, index + 1);
        $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`)
      });
     
      addSpacesToTable(spaces, $tbody, TimeAttendanceInfo.length, y, m);

      $tbody.append(`
        <tr>
          <td>${arrLabels[1]}</td>
        </tr>
      `)

      TimeAttendanceInfo.forEach((item, index) => {
        let { dTimeFinish, dWorkingPercent } = item;
        let val = dTimeFinish;
        if(type == 2) val = dWorkingPercent;
        let className = getClassNameHighLightCol(y, m, index + 1);
        $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`);
      });

      addSpacesToTable(spaces, $tbody, TimeAttendanceInfo.length, y, m);
      
  })
}

function buildLineChartIdlingVsWorkingTimePercentOfGuards(isWorkingTimeChart){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  if(isWorkingTimeChart) $('#lineChartWorkingTimePercentArea').html($chartCanvas);
  else $('#lineChartIdlingTimePercentArea').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let labels = [];
  let datasets = arrSelectedGuards.map((guard, index) => {
    
    // console.log(item);
    
    let { sGuardName, TimeAttendanceInfo,  } = guard;
    
    if(typeof TimeAttendanceInfo == 'string') TimeAttendanceInfo = JSON.parse(TimeAttendanceInfo);
    if(index == 0){
      TimeAttendanceInfo.forEach(item => {
        let { dDayWork, dDateWork } = item;
        labels.push(`${dDateWork}`);
      })
    }
    let data;
    if(isWorkingTimeChart) data = TimeAttendanceInfo.map(i => i.dWorkingPercent);
    else data = TimeAttendanceInfo.map(i => i.dIdlingPercent);
    let dataset = {
      label: sGuardName,
      backgroundColor: arrColors[index],
      borderColor: arrColors[index],
      data: data,
      fill: false,
    }

    return dataset;
  })

  labels

  let chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: ''
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            // steps: 10,
            // stepValue: 20,
            stepSize: 20,
            max: 110,
            min: 0,
            callback: function(value, index, values) {
                return value + "%";
            },
          },
          scaleLabel: {
            display: true,
            // labelString: '%'
          }
        }]
      }  
    } 
  });
}

function showModalChartWorkingTimeVsIdlingTimePercentGuards(){
  if(arrSelectedGuards.length == 0) return AlertService.showAlertError('No data available!', '');
  buildLineChartIdlingVsWorkingTimePercentOfGuards(true);
  buildLineChartIdlingVsWorkingTimePercentOfGuards(false);
  $('#modalChartWorkingTimeVsIdlingTimePercentGuards').modal('show');
}



function addSpacesToTable(spaces, $tbody, l, y, m){
  for(let i = 0; i < spaces; i++){
    let className = getClassNameHighLightCol(y, m, l + i + 1);
    $tbody.find('tr').last().append(`<td class="${className}"></td>`);
  }
}

function showPagination(data){
  if(!data || data.length == 0) return clearPagination();
  arrSelectedGuards.length = 0;
  let type = $('#selectReportType').val();
  $('#totalGuards').html(`<strong class="trn">Total Guards</strong>: ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      let $table;
      if(type == 3) $table = renderTableAttandanceWorkingTime(data);
      else $table = renderTableAttandanceStartFinishTime_WorkingTimePercent(data);
      $('.card-attendance .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function clearPagination(){
  $('#totalGuards').html('');
  $('#pagingControl').html('');
  $('.card-attendance .table-responsive').html('');
}

function getClassNameHighLightCol(y, m, d){
  let weekend = TimeService.checkWeekendInMonth(y, m, d);
  let className = '';
  if(weekend) className = 'highlight-td-th';
  return className;
}

function setDefaultLoading(){
  let d = new Date();
  let week = TimeService.getWeek();
  let month = d.getMonth();
  let year = d.getFullYear();
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  $('#reportYear').val(year);
 
}