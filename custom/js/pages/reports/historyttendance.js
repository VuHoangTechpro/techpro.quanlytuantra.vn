$(() => {
  $('#btnShowDataAttendance').click(showDataAttendance);
  formatTodayReportAttendance();
})

async function showDataAttendance(){
  let date = $('#reportAttDate').val();
  if(date == '') return AlertService.showAlertError("Invalid date", "Please choose date");
  let dDate = TimeService.changeFormatDateTime(date);
  let user = getUserAuth();
  let sentData = { dDate, sCompanyCode: user.CompanyCode };
  //let sentData = { dDate };
  //console.log(JSON.stringify(sentData));
  let data = await ReportService.getDataAttandance(sentData);
  if(data){
    showReportAttPagination(data)
  }else{
    AlertService.showAlertError('No data available', '', 3000);
    resetTblReportAttData();
  }
  setDefaultLang();
}

function showReportAttPagination(data){
  $('#totalReportAtt').html(`<strong class="trn">Total rows</strong> ${data.length}`)
  $('#pagingReportAttendanceControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      let $table = renderReportAttTable(data);
      $('.card-reportAttendance .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblReportAttData(){
  $('#totalReportAtt').html('');
  $('#pagingReportAttendanceControl').html('');
  $('#tblReportAttendance').find('tbody').html('');
}

function renderReportAttTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportAttendance"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Name of Guard</th>
        <th class="trn">Date</th>
        <th class="trn">Request time</th>
        <th class="trn">Response time</th>
        <th class="trn">Delay</th>
        <th class="trn">Image</th>
        <th class="trn">Map</th>
      </tr>
    `)
  if (data) {
    //console.log(data);
    data.forEach((report) => {
      const {dDateTimeCheck,  dDate, dDateTimeRespone, iDelay, dLatTimeCheck, dLongTimeCheck, sGuardName, sImageUrl } = report;
      let img, imgUrl;
      //console.log(typeof sImageUrl)
      if(!sImageUrl) img = 'No Image';
      else{
        imgUrl = `${APP_IMAGE_URL}${sImageUrl}`;
        img = `<img src="${imgUrl}" alt="Image here" class="img-report-att" style="width:80px; height: 120px">`
      }
      $tbody.append(`
      <tr>
        <td>${sGuardName}</td>
        <td>${dDate}</td>
        <td>${dDateTimeCheck}</td>
        <td>${dDateTimeRespone}</td>
        <td>${iDelay}</td>
        <td>${img}</td>
        <td>
          <button class="btn btn-custom bg-main-color btnShowAttendanceMap btn-custom-small">Map</button>
        </td>
      </tr>
      `)
      if(sImageUrl)
      $tbody.find('.img-report-att').last().click(() => {
        showImageReportAtt(imgUrl);
      })
      $tbody.find('.btnShowAttendanceMap').last().click(function(){
        showMapAttendance(report);
        //console.log(report);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showImageReportAtt(imgUrl){
  $('#modalImgReportAtt').modal('show');
  $('#modalImgReportAtt').find('.modal-body img').attr({'src': imgUrl});
}

function formatTodayReportAttendance() {
  $('#reportAttDate').val(TimeService.formatToday());
  showDataAttendance();
}

function showMapAttendance(attendance){
  $('#modalAttendanceMap').modal('show');
  setTimeout(() => {
    buildAttendanceMap(attendance);
  }, 0);
}

function buildAttendanceMap(attendance){
  //console.log('abc');
  $mapArea = $('<div id="mapAttendance" class="mymap"></div>');
  $('#modalAttendanceMap').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = GoogleMapService.createMapProp(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($('#mapAttendance')[0], mapProp);

  if(attendance){
    const {dLatTimeCheck, dLongTimeCheck, sImageUrl, sGuardName} = attendance
    let lat = Number(dLatTimeCheck);
    let lng = Number(dLongTimeCheck);
    let pos = new google.maps.LatLng(lat, lng);
    let img = `${APP_IMAGE_URL}${sImageUrl}`;
    let mes = `${sGuardName}<br><img src="${img}" style="width: 120px; height:240px">`
    
    let icon = '../../img/error.png';
    let marker = GoogleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
    let infoWindow = GoogleMapService.createInfoWindow(mes);
    infoWindow.open(mymap, marker);
  }
}