class ZoneService{

  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getAllZones(sentData) {
    let url = `${constants.API_URL}/data/ZoneCombobox.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getZoneinfo(sentData) {
    let url = `${constants.API_URL}/data/ZoneInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  
  static async insertZone(sentData) {
    return ZoneService.updateZone(sentData);
  }

  // http://115.79.27.219/GuardTourApi/Web/active/ZoneUpdate.php
  // {"sCompanyCode":"deepC_2510180932006129", "sZoneName":"Techpro Zone test 123", "iZoneID":28, "bStatus":3}
  
  static async updateZone(sentData) {
    let url = `${constants.API_URL}/active/ZoneUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async inActiveZone(sentData) {
    return ZoneService.updateZone(sentData);
  }

  // http://115.79.27.219/GuardTourApi/Web/data/CheckPointForCreateRoute.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async getCheckPointForCreateRoute(sentData) {
    let url = `${constants.API_URL}/data/CheckPointForCreateRoute.php`;
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