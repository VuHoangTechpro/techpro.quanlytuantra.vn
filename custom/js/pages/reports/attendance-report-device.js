$(() => {
 
  $('#btnShowChartVsDataByWeek').click(async () => {
    let data = await getData('week');
    showAttendanceReportChart(data, 'week');
    renderReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })
  $('#btnShowChartVsDataByMonth').click(async () => {
    let data = await getData('month');
    showAttendanceReportChart(data, 'month');
    renderReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })
  $('#btnShowChartVsDataByYear').click(async () => {
    let data = await getData('year');
    showAttendanceReportChart(data, 'year');
    renderReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })

  SelectComponentService.renderDeviceSelectList(false);
  SelectComponentService.renderWeekSelectList();
  SelectComponentService.renderMonthSelectList();
  SelectComponentService.renderYearSelectList();
  setDefaultLoading();
})

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
    const {sDeviceName, sDay, iWeek, iMonth, iDeviceID, iDay, dWorkingPercent, dTotalTimeWorking, dIdlingPercent, dDateCheck, WorkTimeRequire} = guard;
    $tbody.append(`
      <tr>
        <td>${sDeviceName}</td>
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
  $table.append($tbody).append($thead);;
}

function getLabelsChart(chartData, type){
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay);
  if(type.toLowerCase() == 'month') 
    return chartData.map(item => `Week ${item.iWeek}`);
  return chartData.map(item => arrMonths[Number(item.iMonth) - 1]);
}

function buildChartWorkingTimeVsIdlingTime(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%; height:70vh" class="canvas-reponsive"></canvas>');
  $('#chart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let length = chartData.length;
  const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = CommonService.getColorVsBgColor(length);
  var chartTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLabelsChart(chartData, type),
      datasets: [{
        label: 'Working Time',
        data: chartData.map(item => Number(item.dWorkingPercent)),
        backgroundColor: arrBgColor2,
        borderColor: arrBorderColor2,
        borderWidth: 1
      },{
        label: 'Idling Time',
        data: chartData.map(item => Number(item.dIdlingPercent)),
        backgroundColor: arrBgColor1,
        borderColor: arrBorderColor1,
        borderWidth: 1
      },
    ],
    },  
    options:{
      scales: {
        xAxes: [{
          stacked: true,
          barPercentage: 0.5,
          ticks: {
            fontSize: 15
          }
        }],
        yAxes: [{
          stacked: true,
        }]
      },
      title: {
        display: true,
        text: 'Working Time Vs Idling Time',
        fontSize: 25
      },
    },
  });
}

async function getData(type){
  let iDeviceID = $('#selectDevice').val();
  let sentData = {iDeviceID, iKindSearch: 0, iValue: 2018 };
  if (type.toLowerCase() == 'week'){
    sentData.iValue = $('#reportWeek').val();
    sentData.iKindSearch = 1;
  }else if(type.toLowerCase() == 'month') {
    sentData.iValue = $('#reportMonth').val();
    sentData.iKindSearch = 2;
  }else if (type.toLowerCase() == 'year'){
    sentData.iValue = $('#reportYear').val();
    sentData.iKindSearch = 3;
  }
  let data = await DeviceService.getReportWorkingvsIdlingTimeDeviceData(sentData);
  console.log(data);
  return data;
}

async function showAttendanceReportChart(data, type){
  if(data) return buildChartWorkingTimeVsIdlingTime(data, type);
  $('#chart').html('');
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