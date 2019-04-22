

$(async () => {
  $('#reportWeek').change(async () => {
    currentType = 'week';
    await showIncidentReport('week');
    showChartIncidentReport('week');
  })
  $('#reportMonth').change(async () => {
    currentType = 'month';
    await showIncidentReport('month');
    showChartIncidentReport('month');
  })
  $('#reportYear').change(async () => {
    currentType = 'year';
    await showIncidentReport('year');
    showChartIncidentReport('year');
  })

  $('#btnShowChartIncidents').click(showChartIncidents);

  // $('#btnViewChartIncidentsReportByMonth').click(() => {
  //   showChartIncidentReport('month');
  // })
  // $('#btnViewChartIncidentsReportByWeek').click(() => {
  //   showChartIncidentReport('week');
  // })

  await getAllIncidents();

  SelectComponentService.renderWeekSelectList();
  SelectComponentService.renderMonthSelectList();
  SelectComponentService.renderYearSelectList();
  
  // showDataInCurrentMonth();
  // setCurrentWeek();
  setDefaultTime();
  await showIncidentReport('month');
  showChartIncidentReport('month');

})


let arrIncidents = [];
let arrIncidentsID = [];
let arrRows = [];
let currentType = 'month';
let arrHeaders = [];
let arrSelectedIncidents = [];
let arrPieChartIncidentsData = [];

async function getAllIncidents(){
  let sentData = CommonService.getSentDataCompanyCode();
  arrIncidents = await IncidentService.getIncidentContent(sentData);
  //console.log(arrIncidents);
}

async function showChartIncidentReport(type){
  let header = '';
  switch(type.toLowerCase()){
    case 'week':
      let week = $('#reportWeek').val();
      header = `Report in Week ${week}`;
      break;
    case 'month':
      let month = $('#reportMonth').val();
      header = `Report in ${arrMonths[Number(month) - 1]}`;
      break;
    case 'year':
      let year = $('#reportYear').val();
      header = `Report in ${arrMonths[Number(year) - 1]}`;
      break;
  }
  // let data = await IncidentService.reportIncidentWeekOrMonthChart(sentData);
  // if(!data) return AlertService.showAlertError("No data avalable", "");
  buildReportIncidentWeekOrMonthChart(header);
  // $('#modalChartIncidentReport').modal('show');
}

function getColors(l){
  let arr = [];
  for(let i = 0; i < l; i++){
    arr.push(arrColors[i]);
  }
  return arr;
}

function getChartDataSetIncidentWeekOrMonth(data){
  return data.map(item => Number(item.Percent));
}

function getChartLabelsIncidentReport(data){
  return data.map(item => item.sAlertContent);
}

function buildReportIncidentWeekOrMonthChart(title){
  if(!arrPieChartIncidentsData || arrPieChartIncidentsData.length == 0) return  $('#chartIncidentsArea').html('');
  let $chartCanvas = $('<canvas style="width: 100%" height="600"></canvas>');
  $('#chartIncidentsArea').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let sum = arrPieChartIncidentsData.reduce((acc, item) => {
    acc += item.quantity;
    return acc;
  }, 0);
  
  let labels = arrPieChartIncidentsData.map(item => item.sIncidentsListContent);
  let chartData = arrPieChartIncidentsData.map(item => {
    let val = (item.quantity/sum*100).toFixed(2);
    return Number(val);
  });
  let colors = getColors(arrPieChartIncidentsData.length);
  var chartTime = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Something of Votes',
            data: chartData,
            backgroundColor: colors,
            // borderColor: [],
            borderWidth: 1
        }]
    },
    options:{
      showAllTooltips: false,
      title: {
        display: true,
        text: title,
        fontSize: 20
      },
      tooltips: {
        yAlign: 'bottom',
      },
      pieceLabel: {
        render: 'percentage',
        fontColor: 'white',
        fontSize: 15,
        precision: 1
      },
      hover: {
        mode: 'average',
        intersect: true
      },
    }
  });
  return chartTime;
}

function showDataInCurrentMonth(){
  let d = new Date();
  let currentMonth = d.getMonth() + 1;
  $('#reportMonth').val(currentMonth);
  showIncidentReport('month');
}

function setDefaultTime(){
  let d = new Date();
  let currentWeek = TimeService.getWeek(d);
  let month = d.getMonth() + 1;
  $('#reportWeek').val(currentWeek);
  $('#reportMonth').val(month);
}

// function renderTblIncidentReport(){
//   let $table = $('#tblViolationMin');
//   $table.html('');
//   let $thead = $('<thead></thead>');
//   let $tbody = $('<tbody></tbody>');
  
//   if(arrIncidents){
//     $thead.append(`
//       <tr>
//         <th >Day</th>
//         <th rowspan="2">Date</th>
//         <th rowspan="2">Weekend NO.</th>
//         <th rowspan="2">Number of Violation</th>
//         <th colspan="${arrIncidents.length}">Types of Violation</th>
//       </tr>
//       <tr class="trIncident"></tr>
//     `)
//     arrIncidents.forEach(item => {
//       $thead.find('tr.trIncident').append(`<th>${item}</th>`);
//     });
//   }
//   if(arrRows){
//     arrRows.forEach(row => {
//       const { sDay, iWeek, dDate } = row;
//       $tbody.append(`
//         <tr>
//           <td>${sDay}</td>
//           <td>${dDate}</td>
//           <td>${iWeek}</td>
//           <td>${getNumOfViolationsByDate(row)}</td>
//         </tr>
//       `)
//       arrIncidentsID.forEach(item => {
//         $tbody.find('tr').last().append(`<td>${row[item]}</td>`);
//       })
//     })
//   }
//   $table.append($thead).append($tbody);
// }
// {"iKindSearch":0, "iValue":44}

async function showIncidentReport(type){
  let sentData = getKindSearch(type);
  //console.log(sentData);
  let data = await IncidentService.reportIncidentWeekMonthYear(sentData);
  //console.log(data);
  resetData();
  renderTblIncidentReport(data);
  if(!data){
    
    AlertService.showAlertError("No data available!!", "");
  }
}

function resetData(){
  arrPieChartIncidentsData.length = 0;
  arrHeaders.length = 0;
}

function getPropHead(){
  switch(currentType){
    case 'week':
    return 'sDay';
  case 'month':
    return 'iWeek';
  case 'year':
    return 'iMonth';
  }
}

function getArrHeaders(data, prop){
  return JSON.parse(data[0].IncidentsInfo).map(item => item[prop]);
}

function renderTblIncidentReport(data){
  let $table = $('#tblViolationMin');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  if(data){
    $thead.append(`
      <tr>
        <th>
          <input type="checkbox" class="checkboxSelectAllIncidents">
        </th>
        <th>Incident</th>
      </tr>
    `)
    
    let prop = getPropHead();
    
    arrHeaders = getArrHeaders(data, prop);
    arrHeaders.forEach(head => {
      $thead.find('tr').append(`<th>${head}</th>`)
    })
    $thead.find('tr').append(`<th>Total</th>`);
    $thead.find('tr').append(`<th></th>`);
    //console.log(arrHeaders);
    let sumColObj = arrHeaders.reduce((acc, item) => {
      acc[item + ''] = 0;
      return acc;
    }, {});
    $thead.find('tr th input.checkboxSelectAllIncidents').change((e) => {
      let { checked } = e.target;
      if(checked) arrSelectedIncidents = data.map(item => Object.assign(item));
      else arrSelectedIncidents.length = 0;
      $('#tblViolationMin').find('tbody tr input.checkboxSelecteIncident').prop({ 'checked': checked });
      //console.log(arrSelectedIncidents);
    })
    arrPieChartIncidentsData.length = 0;
    arrSelectedIncidents.length = 0;

    data.forEach(incident => {
      let { iIncidentsListID, sIncidentsListContent, IncidentsInfo } = incident;
      //console.log(sIncidentsListContent);
      $tbody.append(`
        <tr>
          <td>
            <input type="checkbox" class="checkboxSelecteIncident">
          </td>
          <td>${sIncidentsListContent}</td>
        </tr>
      `)
      IncidentsInfo = JSON.parse(IncidentsInfo);
      incident.IncidentsInfo = IncidentsInfo;
      let sumRow = 0;
      let $row = $tbody.find('tr').last();
      IncidentsInfo.forEach(i => {
        sumRow += Number(i.iCountIncidents);
        $row.append(`<td>${i.iCountIncidents}</td>`);
        sumColObj[i[prop] + ''] += Number(i.iCountIncidents);
      })
      incident.sum = sumRow;
      $row.append(`<td>${sumRow}</td>`);
      let obj = Object.assign({}, incident);
      obj.quantity = sumRow;
      arrPieChartIncidentsData.push(obj);
      $row.append(`
        <td>
          <button class="btn btn-custom bg-main-color btnShowModalMapIncident">Map</button>
        </td>
      `);

      $row.find('td input.checkboxSelecteIncident').change((e) => {
        let { checked } = e.target;
        if(checked) arrSelectedIncidents.push(incident);
        else{
          let index = arrSelectedIncidents.findIndex(i => i.iIncidentsListID == iIncidentsListID);
          if(index > -1) arrSelectedIncidents.splice(index, 1);
        }
        // console.log(arrSelectedIncidents);
      })

      $row.find('.btn.btnShowModalMapIncident').click(() => {
        showModalMapIncidents(incident);
      })
    })
    $tbody.append(`
      <tr>
        <td></td>
        <td class="font-weight-bold">Total</td>
      </tr>
    `);
    let sumAll = 0;
    //console.log(sumColObj);
    Object.keys(sumColObj).forEach(prop => {
      sumAll += sumColObj[prop];
      $tbody.find('tr').last().append(`<td class="font-weight-bold">${sumColObj[prop]}</td>`);
    })
    $tbody.find('tr').last().append(`
      <td class="font-weight-bold">${sumAll}</td>
      <td></td>
    `);
  }

  $table.append($thead).append($tbody);
}

async function showModalMapIncidents(incident){
  let { iIncidentsListID, sIncidentsListContent } = incident;
  // {"iIncidentID":15, "iKindSearch":1, "iValue":44}
  let sentData = getKindSearch(currentType);
  sentData.iIncidentID = iIncidentsListID;
  //console.log(sentData);
  let res = await IncidentService.reportIncidentDrawMapWeekMonthYear(sentData);
  if(!res) return AlertService.showAlertError('No data available!', '', 5000);
  buildIncidentMap(res);
  $('#modalIncidentMap').modal('show');
  //console.log(res);
}

function buildIncidentMap(incidents){
  $mapArea = $('<div id="mapIncident" class="mymap"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($mapArea[0], mapProp);

  if(incidents){
    incidents.forEach(incident => {
      const {  dDate, dIncidentLat, dIncidentLong, sIncidentsListContent } = incident
      let lat = Number(dIncidentLat);
      let lng = Number(dIncidentLong);
      let pos = new google.maps.LatLng(lat, lng);
      let mes = `${dDate}<br>${sIncidentsListContent}<br>`
      
      let icon = '../../img/error.png';
      let marker = GoogleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = GoogleMapService.createInfoWindow(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function getKindSearch(type){
  let user = getUserAuth();
  let sCompanyCode = user.CompanyCode;
  let obj = {sCompanyCode: sCompanyCode, iKindSearch: 0, iValue: 0 };
  switch(type){
    case 'week':
      let week = $('#reportWeek').val();
      obj.iValue = week;
      obj.iKindSearch = 1;
      break;
    case 'month': 
      let month = $('#reportMonth').val();
      obj.iValue = month;
      obj.iKindSearch = 2;
      break;
    case 'year':
      let year = $('#reportYear').val();
      obj.iValue = year;
      obj.iKindSearch = 3;
      break;
  }
  return obj;
}

function buildIncidentsLineChart(type){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#lineChartIncidentsArea').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  
  let datasets = arrSelectedIncidents.map((item, index) => {
    // console.log(item);
    let { sum, IncidentsInfo, sIncidentsListContent } = item;
    //console.log(sum);
    let dataset = {
      label: sIncidentsListContent,
      backgroundColor: arrColors[index],
      borderColor: arrColors[index],
      data: IncidentsInfo.map(i => {
        let val = Number((Number(i.iCountIncidents)/sum*100).toFixed(2));
        return val;
      }),
      fill: false,
    }

    return dataset;
  })

  let chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrHeaders,
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

function showChartIncidents(){
  if(arrSelectedIncidents.length == 0) return AlertService.showAlertError('No data available', '');
  buildIncidentsLineChart();
  $('#modalChartIncidentReport').modal('show');
}



// function getIncidentsArr(data){
//   if(!data) return null;
//   if(data.length == 0) return null;
//   let incidentsSet = new Set(data.map(incident => incident.sIncidentsListContent));
//   return [...incidentsSet];
// }

// function getIncidentsIDArr(data){
//   if(!data) return null;
//   if(data.length == 0) return null;
//   let incidentsSet = new Set(data.map(incident => incident.iIncidentsListID));
//   console.log(incidentsSet);
//   return [...incidentsSet];
// }
// { iCountIncidents, iCountIncidents, dDate, iMonth, iWeek, sIncidentsListContent };
// { incidentid, incidentname, { iweek: quantity } }

// function getRowsViolationsByIncident(data){
//   let arrRows = [];
//   arrIncidentsID.forEach(i => {
//     let { iIncidentsListID, sIncidentsListContent } = i;
//     let arr = FilterService.filterDataByID(data, 'iIncidentsListID', iIncidentsListID);
//     if(arr.length > 0){
//       arrRows.push(arr);
//     }
//   })
//   return arrRows;
// }

// function getRowsViolationsByDate(data){
//   if(!data) return null;
//   if(data.length == 0) return null;
//   let dateSet = new Set(data.map(item => item.dDate));
//   let arrRows = []
//   dateSet.forEach(value => {
//     let arrTemp = data.filter(item => item.dDate == value);
//     let acc = arrTemp.reduce((acc, incident, index) => {
//       const { sIncidentsListContent, iCountIncidents, iIncidentsListID } = incident;
//       if(index == 0){
//         const { sDay, iWeek, dDate } = incident;
//         acc.sDay = sDay;
//         acc.iWeek = iWeek;
//         acc.dDate = dDate;
//       }
//       if(!acc[iIncidentsListID]) {
//         acc[iIncidentsListID] = 0;
//       }
//       acc[iIncidentsListID] += Number(iCountIncidents);
//       return acc;
//     }, {});
//     arrRows.push(acc);
//   })
//   return arrRows;
// }

// function getNumOfViolationsByDate(row){
//   let sum = 0;
//   arrIncidentsID.forEach(item => {
//     sum += row[item];
//   })
//   return sum;
// }