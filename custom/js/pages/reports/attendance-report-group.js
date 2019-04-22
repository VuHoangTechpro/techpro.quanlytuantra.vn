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

function setDefaultLoading(){
  let d = new Date();
  let week = TimeService.getWeek();
  let month = d.getMonth();
  let year = d.getFullYear();
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  $('#reportYear').val(year);
}

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
        <th class="trn">Working Time</th>
        <th class="trn">Date Check</th>
      </tr>
    `)
  data.forEach((guard) => {
    const { sGuardName, sDay, iWeek, iMonth, iGuardID, iDay, dPercentWorkingTime, dDateCheck } = guard;
    $tbody.append(`
      <tr>
        <td>${sGuardName}</td>
        <td>${sDay}</td>
        <td>${iWeek}</td>
        <td>${iMonth}</td>
        <td>${iDay}</td>
        <td>${dPercentWorkingTime}%</td>
        <td>${dDateCheck}</td>
      </tr>
    `)
  })
  $table.append($tbody).append($thead);
}

async function getData(type){
  let iGroupID = $('#selectGroup').val();
  let sentData = { iGroupID, iKindSearch: 0, iValue: 0 };
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
  let data = await GroupService.getReportWorkingvsIdlingTimeGuardGroup(sentData);
  return data;
}

async function showAttendanceReportChart(data, type){
  if(!data){
    $('#chart').html('');
    AlertService.showAlertError("No data available!!", "");
  }else{
    let chartData = getDataOnGuards(data);
    let arrLabels = getLabelsChart(data, type);
    buildLineChart(chartData, arrLabels, 'Time Attendance');
  }
}

function buildLineChart(chartData, arrLabels, title){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#chart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let datasets = chartData.map((line, index) => {
    return {
      label: line.label,
      backgroundColor: arrColors[index],
      borderColor: arrColors[index],
      data: line.data,
      fill: false,
    }
  })
  var chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrLabels,
        datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: title,
        fontSize: 20
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
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay + ' ' + item.dDateCheck);
  if(type.toLowerCase() == 'month') 
    return chartData.map(item => `Week ${item.iWeek}`);
  return chartData.map(item => arrMonths[Number(item.iMonth) - 1]);
}

function getDataOnGuards(data){
  let guardsSet = new Set(data.map(item => item.iGuardID));
  let arrGuards = [...guardsSet];
  let arrDataGuards = [];
  arrGuards.forEach(g => {
    let arr = data.filter(item => {
      if(item.iGuardID == g) return item;
    });
    arrDataGuards.push(arr);
  })
  let temp = arrDataGuards.map(item => {
    return { 
      label:item[0].sGuardName,
      data: item.map(ele => Number(ele.dPercentWorkingTime))
    }
  })
  return temp;
}