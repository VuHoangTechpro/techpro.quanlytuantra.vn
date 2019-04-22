$(() => {

  $('#btnShowChartVsDataByWeek').click(async () => {
    let data = await getData('week');
    showChartSecurityReport(data);
    renderSecurityReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })

  $('#btnShowChartVsDataByMonth').click(async () => {
    let data = await getData('month');
    showChartSecurityReport(data);
    renderSecurityReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })

  $('#btnShowChartVsDataByYear').click(async () => {
    let data = await getData('year');
    showChartSecurityReport(data);
    renderSecurityReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })

  SelectComponentService.renderRouteSelectList(true);
  SelectComponentService.renderMonthSelectList(true);
  SelectComponentService.renderWeekSelectList(true);
  SelectComponentService.renderYearSelectList(true);

  setDefaultLoading();

})

let arrDataChartWorkingTimeVsIdlingTime = [];
let arrDataChartWeeklyPatrollingPerformance = [];
let arrLabelsChartWorkingTimeVsIdlingTime = [];

async function getData(type){
  let iRouteID = $('#selectRouteNameReportSecurity').val();
  let user = getUserAuth();
  let sentData = { iRouteID, iKindSearch: 0, iValue:0 };
  if(type.toLowerCase() == 'week'){
    let week = $('#reportWeek').val();
    sentData.iKindSearch = 0;
    sentData.iValue = week;
  }
  else if(type.toLowerCase() == 'month'){
    let month = $('#reportMonth').val();
    sentData.iKindSearch = 1;
    sentData.iValue = month;
  }
  else if(type.toLowerCase() == 'year'){
    let year = $('#reportYear').val();
    sentData.iKindSearch = 2;
    sentData.iValue = year;
  }
  //console.log(sentData);
  let data = await ReportService.getReportPerformanceChart(sentData);
  //console.log(data);
  return data;
}

function setDefaultLoading(){
  let d = new Date();
  let month = d.getMonth();
  let week = TimeService.getWeek();
  //console.log(week)
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
}

function renderSecurityReportTable(data) {
  let $table = $('#tblReportSecurity');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  if (data) {
    $thead.append('<tr></tr>');
    $thead.find('tr').append(`<th class="trn">Reporting Week</th>`)
    data.map(item => item.dWeek).forEach(item => {
      $thead.find('tr').append(`<th class="trn">${item}</th>`);
    })
    let arrRows = ['Performance Route', 'Performance Timing', 'Performance Routing', 'Overall Performance', 'Working Time', 'Idling Time', 'Spot check'];
    arrRows.forEach((rowName, index) => {
      $tbody.append('<tr></tr>');
      $tbody.find('tr').last().append(`<td class="trn">${rowName}</td>`);
      let rowData = [];
      if(index == 0){
        rowData = data.map(item => item.dPerformance_Routes);
      }else if(index == 1){
        rowData = data.map(item => item.dPerformance_Timing);
      }else if(index == 2){
        rowData = data.map(item => item.dPerformance_Routing);
      }else if(index == 3){
        rowData = data.map(item => item.dOverall_performance);
      }else if(index == 4){
        rowData = data.map(item => item.dWorking_Time);
      }else if(index == 5){
        rowData = data.map(item => item.dIdling_Time_in);
      }else if(index == 6){
        rowData = data.map(item => '');
      }
      rowData.forEach(item => {
        $tbody.find('tr').last().append(`<td>${item}</td>`);
      })
    })
  }

  $table.append($thead).append($tbody);
}

function showChartSecurityReport(data){
  if(!data) {
    $('#chartTime').html('');
    $('#chartPatrolling').html('');
  }else{
    getChartData(data);
    buildChartWorkingTimeVsIdlingTime();
    buildChartWeeklyPatrollingPerformance();
  }
}

function getChartData(data){
  arrDataChartWorkingTimeVsIdlingTime.length = 0;
  arrDataChartWeeklyPatrollingPerformance.length = 0;
  arrLabelsChartWorkingTimeVsIdlingTime.length = 0;
  if(!data) return;
  data.forEach(weekData => {
    const { dIdling_Time_in, dWorking_Time, dWeek, dPerformance_Routes, dPerformance_Timing, dPerformance_Routing, dOverall_performance } = weekData;

    arrDataChartWorkingTimeVsIdlingTime.push([Number(dIdling_Time_in), Number(dWorking_Time)]);

    arrLabelsChartWorkingTimeVsIdlingTime.push(dWeek);

    arrDataChartWeeklyPatrollingPerformance.push([Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing), Number(dOverall_performance)]);
  })
}

function buildChartWeeklyPatrollingPerformance(){
  $chartArea = $('<canvas style="width: 100%" height="450" id="chartWeeklyPatrollingPerformance"></canvas>');
  $('#chartPatrolling').html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  // ctx.height(500);
  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let bgColor2 = 'rgba(75, 192, 192, 0.2)';
  let bgColor3 = 'rgba(153, 102, 255, 0.2)';
  let bgColor4 = 'rgba(255, 159, 64, 0.2)';

  let borderColor1 = 'rgba(75, 192, 192, 1)';
  let borderColor2 = 'rgba(153, 102, 255, 1)';
  let borderColor3 = 'rgba(255, 159, 64, 1)';
  let borderColor4 = 'red';

  var chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrLabelsChartWorkingTimeVsIdlingTime,
        datasets: [{
					label: "Performance Routes",
					backgroundColor: borderColor1,
					borderColor: borderColor1,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[0]),
					fill: false,
				},{
					label: "Performance Timing",
					backgroundColor: borderColor2,
					borderColor: borderColor2,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[1]),
					fill: false,
				},{
					label: "Performance Routing",
					backgroundColor: borderColor3,
					borderColor: borderColor3,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[2]),
					fill: false,
				},{
					label: "Overall Performance",
					backgroundColor: borderColor4,
					borderColor: borderColor4,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[3]),
					fill: false,
				}]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Weekly Patroll Performance'
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

function buildChartWorkingTimeVsIdlingTime(){
  $chartArea = $('<canvas style="width: 100%" height="450" id="chartWorkingTimeVsIdlingTime"></canvas>');
  $('#chartTime').html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let length = arrDataChartWorkingTimeVsIdlingTime.length;
  const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = CommonService.getColorVsBgColor(length);
  var chartTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrLabelsChartWorkingTimeVsIdlingTime,
      datasets: [
        {
          label: 'Working Time',
          data: arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[1]),
          backgroundColor: arrBgColor2,
          borderColor: arrBorderColor2,
          borderWidth: 1
        },{
          label: 'Idling Time',
          data: arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[0]),
          backgroundColor: arrBgColor1,
          borderColor: arrBorderColor1,
          borderWidth: 1
        }
    ],
    },  
    options:{
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
      title: {
        display: true,
        text: 'Working Time Vs Idling Time'
      },
    },
  });
}