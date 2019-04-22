class ValidationService{

  static checkDate(from, to){
    let valid = true;
    let msgErr = '';
    if(!ValidationService.checkEmpty(from)){
      valid = false;
      msgErr += 'Start date must be filled\n'
    }
    if(!ValidationService.checkEmpty(to)){
      valid = false;
      msgErr += 'End date must be filled\n'
    }
    if(!valid){
      AlertService.showAlertError("Invalid data", msgErr, 3000);
    }
    return valid;
  }

  static checkEmpty(value){
    if(value == null || value == undefined) return false;
    if(typeof value == 'string' && value.trim() == '') return false;
    if(typeof value == 'object' && Object.keys(value).length == 0) return false;
    return true;
  }

  static checkIsNumber(val){
    if(val == '') return false;
    if(isNaN(val)) return false;
    return true;
  }
  
  static checkPositiveNumber(val){
    if(!ValidationService.checkIsNumber(val)) return false;
    if(Number(val) < 0) return false;
    return true;
  }
}