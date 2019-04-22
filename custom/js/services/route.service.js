class RouteService{

// {"sCompanyCode":"deepC_2510180932006129"}
  static async getRoutelist(sentData) {
    let url = `${constants.API_URL}/data/RouteCombobox.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getEventHistoryRoute(sentData) {
    let url = `${APP_DOMAIN}api/GetEventHistoryRoute.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getRouteCreatedData(sentData) {
    // sentData = { iZoneIDIN: 14 }
    let url = `${APP_DOMAIN}api/GetRouteCreatedData.php`;
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
  static async getRoutes(sentData) {
    let url = `${constants.API_URL}/data/RoutesInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/RouteUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129", "iRouteID":0, "iZoneID":30, 
  // "sRouteName":"TEst 11111111", "dDistance":10, 
  // "iSpeed":10,"iMaxTime":20,"iMinTime":15,"iTourExecute":15,
  // "iBreakTime":20,"iDeviceID":2,"bStatus":1,"Point":"[{PointID: 441, No: 1}, {PointID: 442, No: 2}, 
  //   {PointID: 443, No: 3}]"}
  static async updateRouteDetail(sentData) {
    let url = `${constants.API_URL}/active/RouteUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async saveRoute(sentData) {
    return RouteService.updateRouteDetail(sentData);
  }

  static async deleteRoute(sentData) {
    return RouteService.updateRouteDetail(sentData);
  }

  static async getRouteDetailsData(sentData) {
    let url = `${constants.API_URL}/data/RouteInfoDetail.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"iRouteID":2, "dDate":"2018-10-31"}
  static async reportRoutebydate(sentData) {
    let url = `${constants.API_URL}/Report/ReportPerfomanceRouteByDate.php`;
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

  static async updateRouteGuard(sentData) {
    let url = `${APP_DOMAIN}api/UpdateRouteGuard.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  
}