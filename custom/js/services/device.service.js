class DeviceService{

  // http://115.79.27.219/GuardTourApi/Web/data/Devicesinfo.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getDevice(sentData) {
    let url = `${constants.API_URL}/data/DevicesInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

// { sCompanyCode : "deepC_2510180932006129"}
  static async getDevicelist(sentData) {
    let url = `${constants.API_URL}/data/DevicesCombobox.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/CheckDeviceLimit.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async checkDeviceLimit(sentData) {
    let url = `${constants.API_URL}/active/CheckDeviceLimit.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getEventHistoryDevice(sentData) {
    let url = `${APP_DOMAIN}api/GetEventHistoryDevice.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/DeviceUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129","sDeviceName":"1","sDeviceSerial":"2","iDeviceID":0,"bStatus":1}
  static async updateDevice(sentData) {
    let url = `${constants.API_URL}/active/DeviceUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async insertDevice(sentData) {
    return DeviceService.updateDevice(sentData);
  }

  static async lockDevice(sentData) {
    return DeviceService.updateDevice(sentData);
  }

  static async getReportWorkingvsIdlingTimeDeviceData(sentData) {
    let url = `${APP_DOMAIN}api/Report/ReportWorkingvsIdlingTimeDevice.php`;
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