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

  SelectComponentService.renderGroupSelectList(false);
  SelectComponentService.renderWeekSelectList();
  SelectComponentService.renderMonthSelectList();
  SelectComponentService.renderYearSelectList();
  
  setDefaultLoading();
})

function renderReportTable(data){
  //console.log(data);
  let $table = $('#tblReport');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  if(!data) return;
  $thead.html(`
      <tr>
        <th class="trn">Group Name</th>
        <th class="trn">Day report</th>
        <th class="trn">Day</th>
        <th class="trn">Day in Month</th>
        <th class="trn">Week</th>
        <th class="trn">Month</th>
        <th class="trn">Year</th>
        <th class="trn">Patrolling Post</th>
        <th class="trn">Fixed Post</th>
        <th class="trn">Combined Performance</th>
      </tr>
    `)
  data.forEach((guardgroup) => {
    const {sGroupName, sDay, iWeek, iMonth, iDay, iYear, dDateReport, dCombined_Performance, dOverall_performance_Patrolling, dOverall_performance_Fixed} = guardgroup;
    $tbody.append(`
      <tr>
        <td>${sGroupName}</td>
        <td>${dDateReport}</td>
        <td>${sDay}</td>
        <td>${iDay}</td>
        <td>${iWeek}</td>
        <td>${iMonth}</td>
        <td>${iYear}</td>
        <td>${dOverall_performance_Patrolling}</td>
        <td>${dOverall_performance_Fixed}</td>
        <td>${dCombined_Performance}</td>
      </tr>
    `)
  })

  $table.append($tbody).append($thead);
}

async function getData(type){
  let iGuardGroupID = $('#selectGuardGroup').val();
  let sentData = {iGuardGroupID, iKindSearch: 0, iValue: 2018 };
  if (type.toLowerCase() == 'week'){
    sentData.iValue = $('#reportWeek').val();
    sentData.iKindSearch = 1;
  }
  else if(type.toLowerCase() == 'month') {
    sentData.iValue = $('#reportMonth').val();
    sentData.iKindSearch = 2;
  }
  else if (type.toLowerCase() == 'year'){
    sentData.iValue = $('#reportYear').val();
    sentData.iKindSearch = 3;
  }
  let data = await GroupService.CombinedPerformanceGuardGroup(sentData);
  return data;
}

function buildLineChart(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%; height:70vh" class="canvas-reponsive"></canvas>');
  //$('#modalChartReport').find('#lineChart').html($chartCanvas);
  $('#chartline').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');

  let borderColor1 = 'red';
  let borderColor2 = 'rgba(153, 102, 255, 1)';
  let borderColor3 = 'rgba(255, 159, 64, 1)';

  let arrLabels = getLabelsChart(chartData, type);
  
  var chartPatroll = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:arrLabels,
        datasets: [{
					label: "Combined performance",
					backgroundColor: borderColor1,
					borderColor: borderColor1,
					data: chartData.map(item => Number(item.dCombined_Performance)),
					fill: false,
				}, {
					label: "Overall performance fixed",
					backgroundColor: borderColor2,
					borderColor: borderColor2,
					data: chartData.map(item => Number(item.dOverall_performance_Fixed)),
					fill: false,
				},{
					label: "Overall performance patrolling",
					backgroundColor: borderColor3,
					borderColor: borderColor3,
					data: chartData.map(item => Number(item.dOverall_performance_Patrolling)),
					fill: false,
				}]
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

function getLabelsChart(chartData, type){
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay);
  if(type.toLowerCase() == 'month') 
    return chartData.map(item => `${item.iDay}`);
  return chartData.map(item => arrMonths[Number(item.iMonth) - 1]);
}

function buildChartWorkingTimeVsIdlingTime(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%; height:70vh" class="canvas-reponsive"></canvas>');
  $('#chartcolumn').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let length = chartData.length;
  const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = CommonService.getColorVsBgColor(length);
  var chartTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLabelsChart(chartData, type),
      datasets: [{
        label: 'Combined Performance',
        data: chartData.map(item => Number(item.dCombined_Performance)),
        backgroundColor: arrBgColor2,
        borderColor: arrBorderColor2,
        borderWidth: 1
      }
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
          stacked: true
        }]
      },
      title: {
        display: true,
        text: 'Combined Performance',
        fontSize: 25
      },
    },
  });
}

function showAttendanceReportChart(data, type){
  if(data) 
  {
      buildChartWorkingTimeVsIdlingTime(data, type);
      buildLineChart(data, type);
  }
  else
  {
    $('#chartline').html('');
    $('#chartcolumn').html('');
  }
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