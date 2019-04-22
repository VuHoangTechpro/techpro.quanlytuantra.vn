class TourService{

  static async processTourError(sentData) {
    let url = `${APP_DOMAIN}api/ProcessTourError.php`;
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
  static async getLiveTour(sentData) {
    let url = `${constants.API_URL}/data/TourLive.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/data/TourDetail.php
  // {"sTourCode":"deepC_612616174831102018"}
  static async getEventHistoryDetails(sentData) {
    let url = `${constants.API_URL}/data/TourDetail.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    //console.log(data);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"sCompanyCode":"deepC_2510180932006129", "fromDate":"2018-11-1: 00:00:00", "toDate":"2018-11-5 00:00:00}
  static async getTourHistoryByDateTimeRange(sentData) {
    let url = `${constants.API_URL}/data/TourHistory.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  // http://115.79.27.219/GuardTourApi/Web/report/ReportPerfomanceRouteAndIncident.php
  // {"iRouteID":2, "iWeek":41, "iMonth":0, "iYear":0}
  static async getTourDetail(sentData) {
    let url = `${constants.API_URL}/Report/ReportPerformanceOfRouteWeekMonthYear.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getEventsData() {
    let url = `${APP_DOMAIN}api/GetEvent.php`;
    let method = 'post';
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  
}