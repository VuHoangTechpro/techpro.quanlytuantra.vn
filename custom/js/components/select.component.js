class SelectComponentService{

  static async renderGuardSelectList(all, className) {
    if(!className) className = 'selectGuards';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await GuardService.getGuardsData(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(g => {
      const { iGuardId, sGuardName } = g;
      $select.append(`<option value="${iGuardId}">${sGuardName}</option>`)
    })
    return data;
  }

  static async renderZoneSelectList(all, className) {
    if(!className) className = 'selectZones';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await ZoneService.getAllZones(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(zone => {
      const { iZoneID, sZoneName } = zone;
      $select.append(`<option value="${iZoneID}">${sZoneName}</option>`)
    })
    return data;
  }

  static async renderRouteSelectList(all, className) {
    if(!className) className = 'selectRoutes';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await RouteService.getRoutelist(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(route => {
      const { iRouteID, sRouteName } = route;
      $select.append(`<option value="${iRouteID}">${sRouteName}</option>`)
    })
    return data;
  }

  static async renderGroupSelectList(all, className) {
    if(!className) className = 'selectGroups';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await GroupService.getGroupsList(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(group => {
      const { iGuardGroupID, sGroupName } = group;
      $select.append(`<option value="${iGuardGroupID}">${sGroupName}</option>`)
    })
    return data;
  }

  static async renderIncidentSelectList(all, className) {
    if(!className) className = 'selectIncidents';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await IncidentService.getIncidentContent(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(incident => {
      const { iIncidentsListID, sIncidentsListContent } = incident;
      $select.append(`<option value="${iIncidentsListID}">${sIncidentsListContent}</option>`)
    })
    return data;
  }

  static async renderDeviceSelectList(all, className) {
    if(!className) className = 'selectDevices';
    let sentData = CommonService.getSentDataCompanyCode();
    let data = await DeviceService.getDevicelist(sentData);
    let $select = $(`.${className}`);
    $select.html('');
    if(!data) return;
    if(all) $select.append(`<option value="0">All</option>`)
    data.forEach(device => {
      const { sDeviceName, iDeviceID } = device;
      $select.append(`<option value="${iDeviceID}">${sDeviceName}</option>`)
    })
    //console.log(data);
    return data;
  }

  static renderMonthSelectList() {
    let $select = $('.selectMonth');
    $select.html('');
    for(let i = 1; i <= 12; i++){
      $select.append(`<option value="${i}">${constants.arrMonths[i - 1]}</option>`);
    }
  }

  static renderYearSelectList(){
    let $select = $('.selectYear');
    let { arrYears } = constants;
    $select.html('');
    for(let i = 0; i <= arrYears.length; i++){
      $select.append(`<option value="${arrYears[i]}">${arrYears[i]}</option>`);
    }
  }
  
  static renderWeekSelectList(){
    let $select = $('.selectWeek');
    $select.html('');
    for(let i = 1; i <= 52; i++){
      $select.append(`<option value="${i}">Week ${i}</option>`);
    }
  }
  
}