class FilterService{

  static filterGuardByGroup(arr, groupID){
    if(groupID == 0) return arr;
    return arr.filter(g => g.iGuardGroupID == groupID)
  }
  
  static filterGuardByName(arr, value){
    if(!ValidationService.checkEmpty(value)) return arr;
    value = VNAccents.removeAccents(value);
    return arr.filter(g => {
      let name = VNAccents.removeAccents(g.sGuardName).toLowerCase();
      return name.indexOf(value.toLowerCase()) > -1
    });
  }

  // static filterDataByIncidentD(arr, id){
  //   if(id == 0) return arr;
  //   return arr.filter(i => i.iIncidentsListID == id);
  // }

  // static filterDataByGuardID(arr, id){
  //   if(id == 0) return arr;
  //   return arr.filter(g => g.iGuardID == id);
  // }

  // static filterDataByRouteID(arr, id){
  //   if(id == 0) return arr;
  //   return arr.filter(r => r.iRouteID == id);
  // }

  // static filterDataByDeviceID(arr, id){
  //   if(id == 0) return arr;
  //   return arr.filter(d => d.iDeviceID == id);
  // }

  // static filterDataByZoneID(arr, id){
  //   if(id == 0) return arr;
  //   return arr.filter(z => z.iZoneID == id);
  // }

  static filterDataByID(arr, prop, id){
    if(id == '0') return arr;
    return arr.filter(item => item[prop] == id);
  }

  static filterDataByName(arr, prop, name){
    if(!ValidationService.checkEmpty(name)) return arr;
    name = VNAccents.removeAccents(name).toLowerCase();
    return arr.filter(item => {
      let el = VNAccents.removeAccents(item[prop]).toLowerCase();
      return el.indexOf(name) > -1
    });
  }
 
}