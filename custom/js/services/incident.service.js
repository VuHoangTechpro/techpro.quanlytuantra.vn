class IncidentService{

  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getLiveIncident(sentData) {
    let url = `${constants.API_URL}/data/IncidentLive.php`;
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
  // http://115.79.27.219/GuardTourApi/Web/data/IncidentsHistory.php
  // {"sCompanyCode":"deepC_2510180932006129", "fromDate":"2018-11-1", "toDate":"2018-11-5"}
  static async getIncidentsData(sentData) {
    let url = `${constants.API_URL}/data/IncidentsHistory.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  // http://115.79.27.219/GuardTourApi/Web/report/ReportIncidentDrawMapWeekMonthYear.php
  // {"iIncidentID":15, "iKindSearch":1, "iValue":44}
  static async reportIncidentDrawMapWeekMonthYear(sentData) {
    let url = `${constants.API_URL}/report/ReportIncidentDrawMapWeekMonthYear.php`;
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
  static async getIncidentContent(sentData) {
    let url = `${constants.API_URL}/data/IncidentCombobox.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  // http://115.79.27.219/GuardTourApi/Web/data/IncidentList.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getIncidentList(sentData) {
    let url = `${constants.API_URL}/data/IncidentList.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/IncidentListUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129","sIncidentsListContent":"1221122","iIncidentsListID":27,"bStatus":3}
  static async updateIncident(sentData){
    let url = `${constants.API_URL}/active/IncidentListUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async insertIncident(sentData) {
    return IncidentService.updateIncident(sentData);
  }
  
  static async deleteIncident(sentData){
    return IncidentService.updateIncident(sentData);
  }

  // {"iKindSearch":0, "iValue":44}
  static async reportIncidentWeekMonthYearChart(sentData) {
    let url = `${constants.API_URL}/report/ReportprocIncidentTotalWeekMonthYear.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // {"iKindSearch":0, "iValue":44}
  // http://115.79.27.219/GuardTourApi/Web/report/ReportprocIncidentTotalWeekMonthYear.php
  static async reportIncidentWeekMonthYear(sentData) {
    let url = `${constants.API_URL}/report/ReportprocIncidentTotalWeekMonthYear.php`;
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