class ScheduleService{
 
  static async getSchedule(sentData) {
    let url = `${APP_DOMAIN}api/GetSchedule.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async updateSchedule(sentData){
    let url = `${APP_DOMAIN}api/UpdateSchedule.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async insertSchedule(sentData){
    ScheduleService.updateSchedule(sentData);
  }

  static async inactiveSchedule(sentData){
    ScheduleService.updateSchedule(sentData);
  }

  
  
}