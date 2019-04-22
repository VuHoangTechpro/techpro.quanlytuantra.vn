class ReportService{

  // http://115.79.27.219/GuardTourApi/Web/report/PerformanceOfRouteAndIncidentWeekMonthYear.php
  // http://115.79.27.219/GuardTourApi/Web/report/PerformanceOfRouteAndIncidentWeekMonthYear.php
  // {"iRouteID": 2, "iKindSearch": 0, "iValue": 1}
  static async getReportPerformanceChart(sentData) {
    let url = `${constants.API_URL}/report/PerformanceOfRouteAndIncidentWeekMonthYear.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/report/ReportWorkingvsIdlingTimeGuard.php
  // {"sCompanyCode":"deepC_2510180932006129", "iMonth":11}
  static async getReportWorkingvsIdlingTimeGuard(sentData) {
    let url = `${constants.API_URL}/report/ReportWorkingvsIdlingTimeGuard.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/guardtourapi/web/report/ReportPerfomanceRouteCheckpointFixedByDate.php
  static async getReportPerfomanceRouteCheckpointFixedByDate(sentData) {
    let url = `${constants.API_URL}/report/ReportPerfomanceRouteCheckpointFixedByDate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getPatrolGroupDaily(sentData) {
    let url = `${constants.API_URL}/report/ReportPatrolGroupDaily.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getPatrolAvgGroupDaily(sentData) {
    let url = `${constants.API_URL}/report/ReportPatrolAvgGroupDaily.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getFixedGroupDaily(sentData) {
    let url = `${constants.API_URL}/report/ReportFixedGroupDaily.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getFixedAvgGroupDaily(sentData) {
    let url = `${constants.API_URL}/report/ReportFixedAvgGroupDaily.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getCombinedPerformanceGroupDaily(sentData) {
    let url = `${constants.API_URL}/report/ReportCombinedGroupDaily.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getReportPerformance(sentData) {
    let url = `${APP_DOMAIN}api/GetReportPerformance.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getReportData(sentData) {
    let url = `${APP_DOMAIN}api/Report/ReportGuardByDate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getDataAttandance(sentData) {
    let url = `${constants.API_URL}/data/AttendancesHistory.php`;
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