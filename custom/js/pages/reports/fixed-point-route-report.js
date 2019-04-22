$(async () => {
    $('#btnViewReport').click(() => {
        showDataVsReportChart();
    });

    $('#btnExportReport2Excel').click(openPrintReportWindow);
    $('#btnChartReport').click(showChartReport);
    $('#btnEnterManager').click(showModalEnterManager);
    $('#btnSaveManagerName').click(saveManagerName);
    arrRoutes = await SelectComponentService.renderRouteSelectList(false);

    setDefaultDate();
    showDataVsReportChart();

})

let chartTime = null;
let chartPatrolling = null;
let arrRoutes = [];
let currentOverallPerformance = 0;

let currentDataGuardHousePerformance = [];
let currentDataGuardHouseTimePerformance = [];
let arrGuardList = [];
let guardHeader = '';
  
function showChartReport(){
    buildChartPatrollingPerformance();
    buildChartTimePerformance();
    $('#modalChartReport').modal('show');
}
  
  function showModalEnterManager(){
    $('#modalEnterManager').modal('show');
    $('#txtManagerName').val('');
  }

  async function showDataVsReportChart(){
    await showReportData();
    buildChartPatrollingPerformance('printingPatrollingPerformanceChart')
    buildChartTimePerformance('printingTimePerformanceChart');
  }
  
  function saveManagerName(){
    let name = $('#txtManagerName').val();
    if(name.trim() == '') return AlertService.showAlertError('You have to input name!!!', '', 5000);
    $('.manager-name').text(name);
    $('#modalEnterManager').modal('hide');
  }
  
  function buildChartPatrollingPerformance(id){
    if(currentDataGuardHouseTimePerformance.length == 0) {
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
      currentOverallPerformance, 
      currentOverallPerformance, 
      currentOverallPerformance 
    ]
    let data = {
      labels: [
        ["Check", "Performance"], 
        ["Check", "Accuracy"], 
        ["Attendance", "Performance"]
      ],
      datasets: [{
          label: 'Performance',
          data: currentDataGuardHousePerformance,
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
  
  function getInfoOfChartTimePerformance(){
    let data = {
      labels: [
        "Attendance Performance", 
        "Unattended Time %"
      ],
      datasets: [{
          label: '# of Votes',
          data: currentDataGuardHouseTimePerformance,
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
  
  function buildChartTimePerformance(id){
    if(currentDataGuardHousePerformance.length == 0) {
        chartTime = null;
       $(`#${id}`).html('');
       return;
    }
    if(!id) id = 'chartTimePerformance';
    let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
    $(`#${id}`).html($chartArea);
    let ctx = $chartArea[0].getContext('2d');
    let { data, options } = getInfoOfChartTimePerformance();
    chartTime = createChart(ctx, 'pie', data, options);
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

  function renderReportTable(data){
    let $table = $('#tblReports');
    $table.html('');
    let $thead = $('<thead class="custom-table-header"></thead>');
    let $tbody = $('<tbody></tbody>');
    $thead.html(`
        <tr>
          <th class="trn text-center">No.</th>
          <th class="trn">Guard House</th>
          <th class="trn text-center">Cal</th>
          <th class="trn text-center">Route</th>
        </tr>
    `)

    if(data) {
      let { arrCriteriaGuardHouse, arrReportCalGuardHouse, arrPropsReportGuardHouse, unitsOfDataReportGuardHouse } = constants;
      for(let i = 0; i < 12; i++){
        let index = i + 1;
        //if(index == 13) index = 'C';
        let val = data[0][arrPropsReportGuardHouse[i]];
        if(!ValidationService.checkEmpty(val)) val = '';
        else val = val + unitsOfDataReportGuardHouse[i];
        $tbody.append(`
          <tr>
            <td class="trn text-center">${index}</td>
            <td class="trn">${arrCriteriaGuardHouse[i]}</td>
            <td class="trn text-center">${arrReportCalGuardHouse[i]}</td>
            <td class="trn text-center">${val}</td>
          </tr>
        `)
      }
    }
    $table.append($thead).append($tbody);
  }
  
  function showTimeReportOnHeader(time){
    $('.fromDateReport').text(`${time} 00:00AM`);
    $('.toDateReport').text(`${time} 11:59PM`);
  }
  
  function showRouteName(){
    let id = $('#selectRouteList').val();
    let g = arrRoutes.find(g => g.iRouteID == id);
    $('.route-name').text(g.sRouteName);
  }

  async function showReportData(){
    let iRouteID = $('#selectRouteList').val();
    let time = $('#reportDatetime').val();
    if(time == '') return AlertService.showAlertError('No date time submitted!', '');
    showTimeReportOnHeader(time);
    showRouteName();
    let dDate = TimeService.changeFormatDateTime(time);
    let sentData = { iRouteID, dDate };
    //console.log(sentData);
    const data = await ReportService.getReportPerfomanceRouteCheckpointFixedByDate(sentData);
    //console.log(data);
    renderReportTable(data);
    setDefaultLang();
    if(data){
      const { dCheck_Accuracy, dCheck_Performance, dAttendance_Perfomance, dUnattended_Time, dOverall_performance  } = data[0];
  
      currentDataGuardHousePerformance = [
        Number(dCheck_Performance), 
        Number(dCheck_Accuracy),
        Number(dAttendance_Perfomance),
        
      ];
  
      currentDataGuardHouseTimePerformance = [
        Number(dAttendance_Perfomance), 
        Number(dUnattended_Time), 
      ];
  
      currentOverallPerformance = Number(dOverall_performance);
  
    }else{
      currentDataGuardHousePerformance = [];
      currentDataGuardHouseTimePerformance = [];
    }
  }
  
  async function showGuardReportPage(){
    const data = await GuardService.getGuardsData();
    if(data) arrGuardList = data;
    else arrGuardList.length = 0;
    renderGuardCombobox(data);
  }

  function setDefaultDate(){
    $('#reportDatetime').val(TimeService.formatToday());
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
    showChartImage('chartImageTime', chartTime);
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
      $('#chartImageTime').html('');
    }, 1500);
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