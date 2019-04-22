class PointService{

  // static async getPointsDataOnZone(sentData) {
  //   let url = `${APP_DOMAIN}api/GetPointData.php`;
  //   let method = 'post';
  //   let data = JSON.stringify(sentData);
  //   try {
  //     let res = await $.ajax({ url, method, data });
  //     return CommonService.handleData(res);
  //   } catch (error) {
  //     return CommonService.handleError(error);
  //   }
  // }
  // http://115.79.27.219/GuardTourApi/Web/data/CheckPointInfo.php
  static async getPointsData(sentData) {
    let url = `${constants.API_URL}/data/CheckPointInfo.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/CheckQRCodeExists.php
  // {"sQRCodeSerialNumber":"1111111111"}
  static async checkQRCodeExists(sentData) {
    let url = `${constants.API_URL}/active/CheckQRCodeExists.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  // http://115.79.27.219/GuardTourApi/Web/active/CheckRFIDCodeExists.php
  // {"sRFIDSerialNumber":"1111111111"}
  static async checkRFIDCodeExists(sentData) {
    let url = `${constants.API_URL}/active/CheckRFIDCodeExists.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/active/CheckPointLimit.php
  // {"sCompanyCode":"deepC_2510180932006129"}
  static async checkPointLimit(sentData) {
    let url = `${constants.API_URL}/active/CheckPointLimit.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
  // {"sCompanyCode":"deepC_2510180932006129", "iCheckPointID": 428, 
  // "sCheckPointName": "2221", "sCheckPointNote": "445761", 
  // "iZoneID": 26, "dGPSLat": 10, "dGPSLong": 20, 
  // "iQRCode": "NULL", "sCheckPointQRCode": "NULL", 
  // "iRFIDCode": "NULL", "sCheckPointRFIDCode": "NULL", "bStatus": 2}
  // http://115.79.27.219/GuardTourApi/Web/active/Checkpointupdate.php

  static async updatePoint(sentData) {
    let url = `${constants.API_URL}/active/CheckPointUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    // console.log(data);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async inActivePoint(sentData) {
    return PointService.updatePoint(sentData);
  }

  static async insertPoint(sentData) {
    return PointService.updatePoint(sentData);
  }

  static async getPointChecking(sentData) {
    let url = `${APP_DOMAIN}api/GetPointChecking.php`;
    let method = 'get';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/GuardTourApi/Web/Active/CheckPointQuestionUpdate.php
  // {"iCheckPointID":413, "iQuestionIncident1": 5, "iQuestionIncident2": 6, "iQuestionIncident3": 7}
  static async updatePointQuestion(sentData){
    let url = `${constants.API_URL}/Active/CheckPointQuestionUpdate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static getPointType(point){
    let { bGPS, bQRCode, bRFID } = point;
    if(bQRCode == '0' && bRFID == '0') return 'GPS';
    if(bQRCode != '0') return 'QRCode';
    if(bRFID != '0') return 'RFID';
  }
}