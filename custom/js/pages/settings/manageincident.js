$(() => {
  $('#btnShowIncidentsType').click(showIncidentsType);
  $('#btnShowIncidentsInsertModal').click(showDefineIncidentInsertModal);
  $('#btnInsertIncident').click(insertDefineIncident);
  $('#btnUpdateIncident').click(updateIncident);
  showIncidentsType();
})

let currentUpdateIncident = null;

async function showIncidentsType(){
  let sentData = CommonService.getSentDataCompanyCode();
  let data = await IncidentService.getIncidentList(sentData);
  if(data){
    $('#totalIncidentTypes').html(`<strong class="trn">Total Rows</strong>: ${data.length}`)
    $('#pagingIncidentTypesControl').pagination({
      dataSource: data,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderIncidentTypes(data);
        $('.card-incident-type .table-responsive').html($table);
        setDefaultLang();
      }
    })
  }else{
    resetTblIncidentType();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

async function insertDefineIncident(){
  // {"sCompanyCode":"deepC_2510180932006129","sIncidentsListContent":"1221122","iIncidentsListID":27,"bStatus":3}
  let sIncidentsListContent = $('#txtInsertIncident').val();
  if(!ValidationService.checkEmpty(sIncidentsListContent)) 
    return AlertService.showAlertError("invalid data", "Content must be filled");
    let sCompanyCode = getUserAuth().CompanyCode;
    let iIncidentsListID = '0';
    let bStatus = 1;
  let sentData = { sCompanyCode, sIncidentsListContent, iIncidentsListID, bStatus };
  let response = await IncidentService.insertIncident(sentData);
  let success = CommonService.getResponseResult(response);
  if(success){
    showIncidentsType();
    $('#modalInsertDefineIncident').modal('hide');
    AlertService.showAlertSuccess("Insert Successfully", "", 3000);
  }else{
    AlertService.showAlertError("Insert Unsuccessfully", "", 3000);
  }
}

function resetTblIncidentType(){
  $('#totalIncidentTypes').html('');
  $('#pagingIncidentTypesControl').html('');
  $('#tblIncidentTypes').find('tbody').html('');
}

function renderIncidentTypes(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblIncidentTypes"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">ID</th>
        <th class="trn">Content</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((incident) => {
      const { iIncidentsListID, sIncidentsListContent } = incident;
      $tbody.append(`
        <tr>
          <td>${iIncidentsListID}</td>
          <td>${sIncidentsListContent}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateIncidentModal btn-custom-small trn">Update</button>
            <button class="btn btn-custom bg-main-color btnDeleteIncident btn-custom-small trn">Delete</button>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateIncidentModal').last().click(() => {
        showUpdateIncidentModal(incident);
      })
      $tbody.find('.btnDeleteIncident').last().click(() => {
        deleteIncident(incident);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateIncidentModal(incident){
  const { sIncidentsListContent } = incident;
  currentUpdateIncident = Object.assign({}, incident);
  $('#modalUpdateDefineIncident').modal('show');
  $('#txtUpdateIncidentContent').val(sIncidentsListContent);
}

async function updateIncident(){
  let sIncidentsListContent = $('#txtUpdateIncidentContent').val();
  if(!ValidationService.checkEmpty(sIncidentsListContent)) 
    return AlertService.showAlertError("invalid data", "Content must be filled");
  const { iIncidentsListID } = currentUpdateIncident;
  let sCompanyCode = getUserAuth().CompanyCode;
  let bStatus = 2;
  let sentData = { sCompanyCode, sIncidentsListContent, iIncidentsListID, bStatus };
  let response = await IncidentService.updateIncident(sentData);
  let success = CommonService.getResponseResult(response);
  if(success){
    showIncidentsType();
    $('#modalUpdateDefineIncident').modal('hide');
    AlertService.showAlertSuccess("Update Successfully", "", 3000);
  }else{
    AlertService.showAlertError("Update Unsuccessfully", "", 3000);
  }
}

async function deleteIncident(incident){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    const { iIncidentsListID } = incident;
    let sCompanyCode = getUserAuth().CompanyCode;
    let sIncidentsListContent = '0';
    let bStatus = 3;
    let sentData = { sCompanyCode, sIncidentsListContent, iIncidentsListID, bStatus };
    let response = await IncidentService.deleteIncident(sentData);
    let success = CommonService.getResponseResult(response);
    if(success){
      showIncidentsType();
      AlertService.showAlertSuccess("Delete Successfully", "", 3000);
    }else{
      AlertService.showAlertError("Delete Unsuccessfully", "", 3000);
    }
  }
}

function showDefineIncidentInsertModal(){
  $('#modalInsertDefineIncident').modal('show');
  $('txtInsertIncident').val('');
}