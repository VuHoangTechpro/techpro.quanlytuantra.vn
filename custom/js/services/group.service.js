class GroupService{

  // { sCompanyCode : "deepC_2510180932006129"}
  static async getGroupsList(sentData) {
    let url = `${constants.API_URL}/data/GroupCombobox.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    
    try {
      let res = await $.ajax({ url, method, data });
      //console.log(JSON.parse(res));
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async CombinedPerformanceGuardGroup(sentData) {
    let url = `${constants.API_URL}/report/ReportCombinedPerformanceGuardGroup.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getGroupData(sentData) {
    let url = `${constants.API_URL}/data/GroupInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }


  // http://115.79.27.219/GuardTourApi/Web/active/GroupUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129", "sGroupName":"42424242", "iGuardID": 62, "iGroupID": 24, "bStatus": 3}
  static async updateGroup(sentData){
    let url = `${constants.API_URL}/active/GroupUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async deleteGroup(sentData){
    return GroupService.updateGroup(sentData);
  }

  static async insertGroup(sentData){
    return GroupService.updateGroup(sentData);
  }
 
  static async getReportWorkingvsIdlingTimeGuardGroup(sentData) {
    let url = `${APP_DOMAIN}api/report/ReportWorkingvsIdlingTimeGuardGroup.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
}