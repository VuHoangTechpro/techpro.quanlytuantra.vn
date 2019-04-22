$(async () => {
  
  $('#btnViewReport').click(() => {
    showReportData();
    setTimeout(() => {
      //Patrolling
      buildChartPatrollingPerformance('printingPatrollingPerformanceChart');
      buildChartTimePatrollingPerformance('printingTimePatrollingPerformanceChart');
      //Fixed
      buildChartFixedPerformance('printingFixedPerformanceChart')
      buildChartTimeFixedPerformance('printingTimeFixedPerformanceChart');
    }, 500);
  });
  
  $('#btnExportReport2Excel').click(openPrintReportWindow);
  $('#btnChartReport').click(showChartReport);
  $('#btnEnterManager').click(showModalEnterManager);
  $('#btnSaveManagerName').click(saveManagerName);
  arrGroups = await SelectComponentService.renderGroupSelectList(false);
  formatTodayReport();

})
  let chartTimePatrolling = null;
  let chartPatrolling = null;
  let arrGroups = [];
  let arrHeaders = [];
  let currentOverallPatrollingPerformance = 0;
  let currentDataChartPatrollingTimePerformance = []; 
  let currentDataChartPatrollingPerformance = [];

  let chartTimeFixed = null;
  let chartFixed = null;
  let currentOverallFixedPerformance = 0;
  let currentDataFixedPerformance = [];
  let currentDataFixedTimePerformance = [];

  let arrGuardList = [];
  let guardHeader = '';

  function showChartReport(){
    buildChartPatrollingPerformance();
    buildChartTimePatrollingPerformance();
    $('#modalChartReport').modal('show');
  }

function showModalEnterManager(){
  $('#modalEnterManager').modal('show');
  $('#txtManagerName').val('');
}

function saveManagerName(){
  let name = $('#txtManagerName').val();
  if(name.trim() == '') return AlertService.showAlertError('You have to input name!!!', '', 5000);
  $('.manager-name').text(name);
  $('#modalEnterManager').modal('hide');
}

//Chart Patrolling
function buildChartPatrollingPerformance(id){
  if(currentDataPatrollingTimePerformance.length == 0) {
    chartPatrolling = null;
    $(`#${id}`).html('');
    return;
  }
  if(!id) id = 'chartPatrollingPerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartPatrolling();
  chartPatrolling = createChart(ctx, 'bar', data, options);
}

function getInfoOfChartPatrolling(){
  let lineData = [ 
    currentOverallPatrollingPerformance, 
    currentOverallPatrollingPerformance, 
    currentOverallPatrollingPerformance 
  ]
  let data = {
    labels: [
      ["Performance", "Routes"], 
      ["Performance", "Timing"], 
      ["Performance", "Routing"]
    ],
    datasets: [{
        label: 'Performance',
        data: currentDataPatrollingTimePerformance,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    },{
      type: 'line',
      label: 'Overall Performance',
      borderColor: 'green',
      backgroundColor: 'green',
      borderWidth: 2,
      fill: false,
      data: lineData
    }]
  }
  let options = {
    title: {
      display: true,
      text: 'Patrolling Performance',
      fontSize: 20
    },
    responsive: true,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
              display: true,
          }
        }], 
        yAxes: [{
            ticks: {
              beginAtZero: true,
              // steps: 10,
              // stepValue: 20,
              stepSize: 10,
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
        }],
      }
  }
  return { data, options };
}

function getInfoOfChartTimePatrollingPerformance(){
  let data = {
    labels: ["Idling Time in %/ Thời gian không làm việc %", 
    "Perfomance Time/ Hiệu suất thời gian %"],
    datasets: [{
        label: '# of Votes',
        data: currentDataPatrollingPerformance,
        backgroundColor: [
          // '#4286f4',
          '#d82b42',
          // '#d9e4f7',
          '#8e9aaf'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
    }]
  };

  let options = {
    // showAllTooltips: true,
    title: {
      display: true,
      text: 'Time Performance',
      fontSize: 20
    },
    legend: {
      display: true
    },
    pieceLabel: {
      render: 'percentage' + 'asd',
      fontColor: 'white',
      fontSize: 20,
      precision: 2
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
  };
  return { data, options };
}

function buildChartTimePatrollingPerformance(id){
  if(currentDataPatrollingPerformance.length == 0) {
      chartTimePatrolling = null;
     $(`#${id}`).html('');
     return;
  }
  if(!id) id = 'chartTimePatrollingPerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartTimePatrollingPerformance();
  chartTimePatrolling = createChart(ctx, 'pie', data, options);
}

function showChartImage(id, chart){
  if(!chart) return;
  var url = chart.toBase64Image();
  let img = `<img src="${url}" class="img-fluid">`;
  $(`#${id}`).html(img);
}

function createChart(ctx, type, data, options){
  return new Chart(ctx, { type, data, options });
}

//End Chart Patrolling

//Fixed Chart
function buildChartFixedPerformance(id){
  if(currentDataFixedTimePerformance.length == 0) {
    chartFixed = null;
    $(`#${id}`).html('');
    return;
  }
  if(!id) id = 'chartFixedPerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartFixed();
  chartFixed = createChart(ctx, 'bar', data, options);
}

function getInfoOfChartFixed(){
  let lineData = [ 
    currentOverallFixedPerformance, 
    currentOverallFixedPerformance, 
    currentOverallFixedPerformance 
  ]
  let data = {
    labels: [
      ["Check", "Performance"], 
      ["Check", "Accuracy"], 
      ["Attendance", "Performance"]
    ],
    datasets: [{
        label: 'Performance',
        data: currentDataFixedPerformance,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    },{
      type: 'line',
      label: 'Overall Performance',
      borderColor: 'green',
      backgroundColor: 'green',
      borderWidth: 2,
      fill: false,
      data: lineData
    }]
  }
  let options = {
    title: {
      display: true,
      text: 'Guardhouse Performance',
      fontSize: 20
    },
    responsive: true,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
              display: true,
          }
        }], 
        yAxes: [{
            ticks: {
              beginAtZero: true,
              // steps: 10,
              // stepValue: 20,
              stepSize: 10,
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
        }],
      }
  }
  return { data, options };
}

function getInfoOfChartTimeFixedPerformance(){
  let data = {
    labels: [
      "Attendance Performance", 
      "Unattended Time %"
    ],
    datasets: [{
        label: '# of Votes',
        data: currentDataFixedTimePerformance,
        backgroundColor: [
          // '#4286f4',
          '#d82b42',
          // '#d9e4f7',
          '#8e9aaf'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
    }]
  };

  let options = {
    // showAllTooltips: true,
    title: {
      display: true,
      text: 'Guard House Time Performance',
      fontSize: 20
    },
    legend: {
      display: true
    },
    pieceLabel: {
      render: 'percentage' + 'asd',
      fontColor: 'white',
      fontSize: 20,
      precision: 2
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
  };
  return { data, options };
}

function buildChartTimeFixedPerformance(id){
  if(currentDataFixedPerformance.length == 0) {
      chartTimeFixed = null;
     $(`#${id}`).html('');
     return;
  }
  if(!id) id = 'chartTimePerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartTimeFixedPerformance();
  chartTimeFixed = createChart(ctx, 'pie', data, options);
}

function showChartImage(id, chart){
  if(!chart) return;
  var url = chart.toBase64Image();
  let img = `<img src="${url}" class="img-fluid">`;
  $(`#${id}`).html(img);
}

function createChart(ctx, type, data, options){
  return new Chart(ctx, { type, data, options });
}  

//End Fixed Chart

function renderReportTablePatrol(dataPatrol){
  let $table = $('#tblReportsPatrolPost');
  $table.html('');
  let $thead = $('<thead class="custom-table-header table-condensed"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
      <tr>
        <th class="trn text-center">No.</th>
        <th class="trn">Criteria</th>
        <th class="trn text-center">Cal</th>
      </tr>
    `);
  
  if (dataPatrol) { 
    //for(let a = 0;a < 3; a++){
    let lenObj = Object.keys(dataPatrol).length;
    for(let a = 0;a < lenObj; a++){
      $thead.find('tr').append(`<th class="trn text-center">${dataPatrol[a].sGuardName}</th>`)
    }
      let { arrCriteriaReport, unitsOfDataReport, arrReportCal, arrPropsReport } = constants;
      for(let i = 0; i < 21; i++){
        $tbody.append(`
        <tr>
          <td class="trn text-center">${i + 1}</td>
          <td class="trn">${arrCriteriaReport[i]}</td>
          <td class="trn text-center">${arrReportCal[i]}</td>
        </tr>
      `)
        let $row = $tbody.find('tr').last();
        for(let j = 0; j < lenObj; j++){
        if(dataPatrol[j][arrPropsReport[i]] == null)
        {
          $row.append(`<th class="trn text-center"></th>`);
        }
        else
        {
          $row.append(`<th class="trn text-center">${dataPatrol[j][arrPropsReport[i]]} ${unitsOfDataReport[i]}</th>`);
        } 
      }
    }
  }
  $table.append($thead).append($tbody);
}

function renderReportTableFixed(dataFixed){
  let $table = $('#tblReportsFixedPost');
  $table.html('');
  let $thead = $('<thead class="custom-table-header table-condensed"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
      <tr>
        <th class="trn text-center">No.</th>
        <th class="trn">Criteria</th>
        <th class="trn text-center">Cal</th>
      </tr>
    `);
  
  if (dataFixed) {
    let lenObj = Object.keys(dataFixed).length;
    for(let a = 0;a < lenObj; a++){
      $thead.find('tr').append(`<th class="trn text-center">${dataFixed[a].sGuardName}</th>`)
    } 
    let { arrCriteriaGuardHouse, arrReportCalGuardHouse, arrPropsReportGuardHouse, unitsOfDataReportGuardHouse } = constants;
    for(let i = 0; i < 13; i++){
        let index = i + 1;
        $tbody.append(`
          <tr>
            <td class="trn text-center">${index}</td>
            <td class="trn">${arrCriteriaGuardHouse[i]}</td>
            <td class="trn text-center">${arrReportCalGuardHouse[i]}</td>
        </tr>
        `)
        let $row = $tbody.find('tr').last();
        for(let j = 0; j < lenObj; j++){
          let val = dataFixed[j][arrPropsReportGuardHouse[i]];
          if(!ValidationService.checkEmpty(val)) val = '';
          else val = val + unitsOfDataReportGuardHouse[i];
          $row.append(`<th class="trn text-center">${val}</th>`) 
      }
    }
  }
  $table.append($thead).append($tbody);
}

function showTimeReportOnHeader(time){
  $('.fromDateReport').text(`${time} 00:00AM`);
  $('.toDateReport').text(`${time} 11:59PM`);
}

function showRouteName(){
  let id = $('#selectGroups').val();
  let g = arrGroups.find(g => g.iGuardGroupID == id);
  $('.group-name').text(g.sGroupName);
}

async function showReportData(){
  let iGuardGroupID = $('#selectGroups').val();
  let time = $('#reportDatetime').val();
  if(time == '') return alert('No date time submitted');
  showTimeReportOnHeader(time);
  showRouteName();
  let dDate = TimeService.changeFormatDateTime(time);
  let sentData = { iGuardGroupID, dDate }; 
  const dataPatroll = await ReportService.getPatrolGroupDaily(sentData);
  const dataFixed  = await ReportService.getFixedGroupDaily(sentData);
  const dataCombinedPerformance  = await ReportService.getCombinedPerformanceGroupDaily(sentData);
  //console.log(dataCombinedPerformance);

  const dataChartPatrol  = await ReportService.getPatrolAvgGroupDaily(sentData);
  const dataChartFixed  = await ReportService.getFixedAvgGroupDaily(sentData);

  renderReportTablePatrol(dataPatroll);
  renderReportTableFixed(dataFixed);
  CombinedPerformance(dataCombinedPerformance);

  setDefaultLang();
  if(dataChartPatrol){
    const { dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dOverall_performance } = dataChartPatrol[0];
    currentDataPatrollingPerformance = [Number(dIdling_Time_in), Number(dPerfomance_Time)];
    currentDataPatrollingTimePerformance = [Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing)];
    currentOverallPatrollingPerformance = Number(dOverall_performance);
  }else{
    currentDataPatrollingPerformance = [];
    currentDataPatrollingTimePerformance = [];
  }

  if(dataChartFixed){
    const { dCheck_Accuracy, dCheck_Performance, dAttendance_Perfomance, dUnattended_Time, dOverall_performance } = dataChartFixed[0];
    currentDataFixedPerformance = [Number(dCheck_Performance), Number(dCheck_Accuracy),Number(dAttendance_Perfomance)];
    currentDataFixedTimePerformance = [Number(dAttendance_Perfomance), Number(dUnattended_Time)];
    currentOverallFixedPerformance = Number(dOverall_performance);

  }else{
    currentDataFixedPerformance = [];
    currentDataFixedTimePerformance = [];
  }
}

async function CombinedPerformance(dataCombinedPerformance)
{
  if (dataCombinedPerformance) {
    document.getElementById("CombinedPerformance").innerHTML = "<h2>Combined Performance: " + dataCombinedPerformance[0].dCombined_Performance + "%</h2>";
  }
  else
  {
    AlertService.showAlertError("No data available", "", 3000);
    document.getElementById("CombinedPerformance").innerHTML = "<h2>Combined Performance: 0%</h2>";
  }
}

async function showGuardReportPage(){
  const data = await GuardService.getGuardsData();
  if(data) arrGuardList = data;
  else arrGuardList.length = 0;
  renderGuardCombobox(data);
}

function formatTodayReport() {
  $('#reportDatetime').val(TimeService.formatToday());
  setTimeout(showReportData, 200);
  setTimeout(() => {
    //Patrolling
    buildChartPatrollingPerformance('printingPatrollingPerformanceChart');
    buildChartTimePatrollingPerformance('printingTimePatrollingPerformanceChart');
    //Fixed
    buildChartFixedPerformance('printingFixedPerformanceChart')
    buildChartTimeFixedPerformance('printingTimeFixedPerformanceChart');
  }, 500);
}

function export2Excel(){
  $("#tblReports").table2excel({
    // exclude CSS class
    // exclude: ".noExl",
    name: "Report",
    filename: "report",//do not include extension
    // fileext: ".xls",
    // exclude_img: true,
    // exclude_links: true,
    // exclude_inputs: true
  });
}
  
function openPrintReportWindow(){
  let head = renderHeadOfPage();
  showChartImage('chartImagePatrolling', chartPatrolling);
  showChartImage('chartImageTimePatrolling', chartTimePatrolling);
  showChartImage('chartImageFixed', chartFixed);
  showChartImage('chartImageTimeFixed', chartTimeFixed);
  setTimeout(() => {
    let report = $('.printing-area').html();
    let html = `<html>
                    ${head}
                  <body>
                    ${report}
                  </body>
                </html>`;
    let windowObject = window.open("", "PrintWindow",
    "width=850,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    windowObject.document.write(html);
    windowObject.document.write('<script type="text/javascript">$(window).load(function() { window.print(); window.close(); });</script>');
    windowObject.document.close();
    windowObject.focus();
  }, 500);
  setTimeout(() => {
    $('#chartImagePatrolling').html('');
    $('#chartImageTimePatrolling').html('');
    $('#chartImageFixed').html('');
    $('#chartImageTimeFixed').html('');
  },
   1500);
}

function renderHeadOfPage(){
  let head = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- font awesome css -->
    <link rel="stylesheet" href="../../plugins/font-awesome-4.7.0/css/font-awesome.min.css">

    <!-- Bootstrap core css -->
    <link rel="stylesheet" href="../../MDBFree/css/bootstrap.min.css">

    <!-- Meterial Design Bootstrap -->
    <link rel="stylesheet" href="../../MDBFree/css/mdb.min.css">

    <!-- datepicker css -->
    <link rel="stylesheet" href="../../plugins/bootstrap-datetimepicker/css/bootstrap-datepicker3.min.css">

    <!-- bootstrap datetime picker css -->
    <link rel="stylesheet" href="../../plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">

    <!-- custom main css -->
    <link rel="stylesheet" href="../../custom/css/main.css">

    <title>Report</title>
  </head>`
  return head;
}

function renderScript(){
  let script = `<script src="../../plugins/chartJS/Chart.min.js"></script>`;
  return script;
}

function printDailyReportContent(){
  $('#modalPrintReport').modal('hide');
  setTimeout(() => {
    $('#modalPrintReport').find('.modal-body').printElement();
  }, 200);
}