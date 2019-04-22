class GuardService{

  // http://115.79.27.219/GuardTourApi/Web/active/GuardUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129", "sGuardName":"vuhoangtesttest3", "sGuardPhone":"123456789111", 
  // "sGuardUsername":"112233111333", "sGuardPassword":"12361113", "sGuardPasswordMQTT":"12361113", 
  // "iGuardID":65, "iGroupID":20, "bStatus":3}
  static async updateGuard(sentData) {
    let url = `${constants.API_URL}/active/GuardUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async insertGuard(sentData) {
    return GuardService.updateGuard(sentData);
  }

  static async inActiveGuard(sentData) {
    return GuardService.updateGuard(sentData);
  }

  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getPersonalGuardsInfo(sentData) {
    let url = `${constants.API_URL}/data/GuardsInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/Checkguardlimit.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async checkGuardlimit(sentData) {
    let url = `${constants.API_URL}/active/Checkguardlimit.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async sendMessageGuard(sentData) {
    let url = `${constants.API_URL}/active/InsertMessage.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"sCompanyCode":"deepC_2510180932006129", "iUserIDSend":1, "iGuardID":[61,62,63], "sMessageContent":"123"}
  static async sendSMSToGuards(sentData) {
    let url = `${constants.API_URL}/active/SendMessage.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // sCompanyCode: 'deepC_2510180932006129'
  static async getGuardsData(sentData) {
    let url = `${constants.API_URL}/data/guardsinfomainview.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getEventHistoryDataGuard(sentData) {
    let url = `${constants.APP_DOMAIN}GuardTourApi/Web/active/GetEventHistoryGuard.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getGuardGPSCurrent(sentData) {
    let url = `${constants.APP_DOMAIN}GuardTourApi/Web/active/GetGuardGPSCurrent.php`;
    let method = 'get';
    let data = sentData;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // "{""sCompanyCode"":""deepC_2510180932006129"", ""iUserIDSend"":1, ""iGuardID"":[61,62,63]}"
  static async checkTime(sentData) {
    let url = `${constants.API_URL}/active/CheckTime.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getReportWorkingvsIdlingTimeGuardData(sentData) {
    let url = `${constants.APP_DOMAIN}GuardTourApi/Web/active/Report/ReportWorkingvsIdlingTimeGuard.php`;
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
  static async getLiveAttandance(sentData) {
    //console.log(sentData);
    let url = `${constants.API_URL}/data/AttendancesLive.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      //console.log(res);
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"sCompanyCode":"deepC_2510180932006129"}
  static async resetGuardPassword(sentData) {
    //console.log(sentData);
    let url = `${constants.API_URL}/active/ResetPasswordGuard.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      //console.log(res);
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"iGuardID":61}
  static async getRouteTrackingOfGuard(sentData) {
    //console.log(sentData);
    let url = `${constants.API_URL}/data/TourLiveByGuardMainview.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      //console.log(res);
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getDataAttandance(sentData) {
    let url = `${constants.APP_DOMAIN}web/data/AttendancesHistory.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"sTourCode":"deepC_612616174831102018"}
  static async getGuardTrackingbyTour(sentData) {
    let url = `${constants.API_URL}/data/TourTracking.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static getNumOfOnline(data){
    return data.filter(g => g.bOnline.toLowerCase() == 'online').length;
  }
  
  static getnumOfSOS(data){
    return data.filter(g => g.bOnline.toLowerCase() == 'sos').length;
  }

  static getnumOfGPSError(data){
    return data.filter(g => {
      let { dGuardLatCurrent, dGuardLongCurrent } = g;
      return GuardService.checkOnlineOrSOS(g) && Number(dGuardLatCurrent) == 0 && Number(dGuardLongCurrent) == 0;
    }).length;
  }

  static checkOnlineOrSOS(guard){
    let { bOnline } = guard;
    return bOnline.toLowerCase() == 'online' || bOnline.toLowerCase() == 'sos';
  } 
}