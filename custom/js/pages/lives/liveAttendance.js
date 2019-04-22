$(() => {

  $('#txtFilterAttendance').on('input', filterAttendanceByGuardName);

  showDataAttendance();
})

let arrAttendanceData = [];
let arrFilteredAttendanceData = [];

async function showDataAttendance(){
  let sentData = CommonService.getSentDataCompanyCode();
  //console.log(sentData);
  arrAttendanceData.length = 0;
  arrFilteredAttendanceData.length = 0;
  let data = await GuardService.getLiveAttandance(sentData);
  if(data){
    arrAttendanceData = data.slice()
    arrFilteredAttendanceData = data.slice();
  }else{
    AlertService.showAlertError('No data available', '', 3000);
  }
  showReportAttPagination(data);
  setDefaultLang();
}

function showReportAttPagination(data){
  if(!data || Object.keys(data).length == 0) return resetTblReportAttData();
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
        <th class="trn">#</th>
        <th class="trn">Guard</th>
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
    data.forEach((report, index) => {
      const {dDateTimeCheck, dDate, dDateTimeRespone, iDelay, dLatTimeCheck, dLongTimeCheck, sGuardName, sImageUrl } = report;
      let img, imgUrl;
      //console.log(typeof sImageUrl)
      if(!sImageUrl || sImageUrl == "") img = 'No Image';
      else{
        imgUrl = `${APP_IMAGE_URL}/${sImageUrl}`;
       img = `<img src="${imgUrl}" alt="Image here" class="img-report-att" style="width:80px; height: 120px">`
      }
      $tbody.append(`
        <tr>
          <td>${index+1}</td>
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
      if(sImageUrl && sImageUrl != "")
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

function filterAttendanceByGuardName(){
  let val = $('#txtFilterAttendance').val();
  //console.log(val);
  arrFilteredAttendanceData = FilterService.filterDataByName(arrAttendanceData, 'sGuardName', val);
  showReportAttPagination(arrFilteredAttendanceData);
}

function showImageReportAtt(imgUrl){
  $('#modalImgReportAtt').modal('show');
  $('#modalImgReportAtt').find('.modal-body img').attr({'src': imgUrl});
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
  let mymap = new google.maps.Map($mapArea[0], mapProp);

  if(attendance){
    const {dLatTimeCheck, dLongTimeCheck, sImageUrl, sGuardName} = attendance
    let lat = Number(dLatTimeCheck);
    let lng = Number(dLongTimeCheck);
    let pos = new google.maps.LatLng(lat, lng);
    let img = `${APP_IMAGE_URL}${sImageUrl}`;
    let mes = `${sGuardName}<br><img src="${img}" style="width: 100px; height: 240px">`
    
    let icon = '../../img/Guardonline.png';
    let marker = GoogleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
    let infoWindow = GoogleMapService.createInfoWindow(mes);
    infoWindow.open(mymap, marker);
  }
}
