$(() => {
  $('#btnViewGroupList').click(showGroups);
  $('#btnShowInsertGroupModal').click(showInsertGroupModal);
  $('#btnInsertGroup').click(insertGroup);
  $('#btnUpdateGroup').click(updateGroup);
  SelectComponentService.renderGuardSelectList(false);
  showGroups();
})

let currentUpdateGroup = null;

async function insertGroup(){
  let sGroupName = $('#txtInsertGroupName').val();
  let iGuardID = $('#selectInsertGuardLeader').val();
  let sCompanyCode = getUserAuth().CompanyCode;
  // sGroupName, iGuardID, iGroupID: iGuardGroupID, bStatusIN: 3
  if(!ValidationService.checkEmpty(sGroupName)){
    AlertService.showAlertError("Invalid data", "Group Name must be filled");
  } else{
    let sentData = { sGroupName, iGuardID, iGroupID: 0, bStatus: 1, sCompanyCode };
    //console.log(JSON.stringify(sentData));
    let response = await GroupService.insertGroup(sentData);
    //console.log(response);
    showGroups();
    AlertService.showAlertSuccess("Insert Successfully", "", 3000);
  }
}

function showInsertGroupModal(){
  $('#modalInsertGroup').modal('show');
  $('#txtInsertGroupName').val('');
}

async function deleteGroup(group){
  let sure = await AlertService.showAlertWarning("Are you sure?", "");
  if(sure){
    let sCompanyCode = getUserAuth().CompanyCode;
    const { iGuardGroupID, iGuardIDLeader, sGroupName } = group;
    let sentData = { sGroupName, iGuardID: 0, iGroupID: iGuardGroupID, bStatus: 3, sCompanyCode }
    //console.log(JSON.stringify(sentData));
    let response = await GroupService.deleteGroup(sentData);
    //console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    if(Result == 1){
      $('#modalUpdateGroup').modal('hide');
      AlertService.showAlertSuccess("Locked Successfully", "", 3000);
      showGroups();
    }else{
      AlertService.showAlertError("Locked Unsuccessfully", "", 5000);
    }
  }
}

function renderGroupTable(data){
  //console.log(data);
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblGroup"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">#</th>
      <th class="trn">Group Name</th>
      <th class="trn">Leader</th>
      <th class="trn">Num. of Guards</th>
      <th class="trn"></th>
    </tr>
  `
  )
  if (data) {
    data.forEach((group, index) => {
      const { iCountGuard, sGroupName, sGuardName} = group;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sGroupName}</td>
          <td>${sGuardName}</td>
          <td>${iCountGuard}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowUpdateGroupModal trn">Update</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnDeleteGroup trn">Delete</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateGroupModal').last().click(() => {
        showUpdateGroupModal(group);
      })
      $tbody.find('.btnDeleteGroup').last().click(() => {
        deleteGroup(group);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function updateGroup(){
  let sGroupName = $('#txtUpdateGroupName').val();
  let iGuardID =  $('#selectUpdateGuardLeader').val();
  let sCompanyCode = getUserAuth().CompanyCode;
  let { iGuardGroupID } = currentUpdateGroup;
  if(!ValidationService.checkEmpty(sGroupName)) return AlertService.showAlertError("Invalid data", "Group Name must be filled");
  // {"sGroupName":"42424242", "iGuardID": 62, "iGroupID": 24, "bStatus": 3}
  let sentData = { sGroupName, iGuardID, iGroupID: iGuardGroupID, bStatus: 2, sCompanyCode };
  //console.log(JSON.stringify(sentData));
  let response = await GroupService.updateGroup(sentData);
  //console.log(response);
  let { Result, Msg } = JSON.parse(response)[0];
  if(Result == 1){
    $('#modalUpdateGroup').modal('hide');
    AlertService.showAlertSuccess("Update Successfully", "", 4000);
    showGroups();
  }else{
    AlertService.showAlertError("Update Unsuccessfully", "", 5000);
  }
  
}

function showUpdateGroupModal(group){
  currentUpdateGroup = Object.assign({}, group);
  const { sGroupName, iGuardIDLeader } = group;
  $('#modalUpdateGroup').modal('show');
  $('#txtUpdateGroupName').val(sGroupName);
  $('#selectUpdateGuardLeader').val(iGuardIDLeader);
}

async function showGroups(){
  let sentData = CommonService.getSentDataCompanyCode();
  let groups = await GroupService.getGroupData(sentData);
  if(groups){
    showGroupPagination(groups);
  }else{
    resetTblGroup();
    AlertService.showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function showGroupPagination(groups){
  $('#totalGroups').html(`<strong class="trn">Total Groups</strong>: ${groups.length}`);
  $('#pagingGroupsControl').pagination({
    dataSource: groups,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (groups, pagination) {
      let $table = renderGroupTable(groups);
      $('.card-groups .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblGroup(){
  $('#totalGroups').html('');
  $('#pagingGroupsControl').html('');
  $('#tblGroup').html('');
}

