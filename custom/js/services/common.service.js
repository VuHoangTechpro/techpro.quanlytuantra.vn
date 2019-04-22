class CommonService{
  
  static handleData(data){
    if(!data) return null;
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static handleError(error){
    //console.log(error.message);
    return null;
  }

  static removeUnicode(str){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }
  
  static shuffleArray(arr){
    let l = arr.length;
    for (let index = 0; index < l; index++) {
      let randomInt = Math.floor(Math.random() * l);
      let temp = arr[index];
      arr[index] = arr[randomInt];
      arr[randomInt] = temp;
    }
    return arr;
  }

  static getPageSize(l){
    if(l < 100) return 10;
    if(l < 250) return 15;
    if(l < 400) return 20;
    if(l < 600) return 30;
    else return 50;
  }

  static getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
  }

  static getColorVsBgColor(length){
    let arrBgColor1 = [];
    let arrBorderColor1 = [];
    let arrBgColor2 = [];
    let arrBorderColor2 = [];
  
    let bgColor1 = 'rgba(255, 99, 132, 0.2)';
    let borderColor1 = 'rgba(255,99,132,1)';
    let bgColor2 = 'rgba(255, 159, 64, 0.2)';
    let borderColor2 = 'rgba(255, 159, 64, 1)';
  
    for(let i = 0; i < length; i++){
      arrBgColor1.push(bgColor1);
      arrBorderColor1.push(borderColor1);
      arrBgColor2.push(bgColor2);
      arrBorderColor2.push(borderColor2);
    }
  
    return {arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2};
  }

  static getSentDataCompanyCode(){
    let user = getUserAuth();
    let { CompanyCode } = user;
    return { sCompanyCode: CompanyCode };
  }

  static getResponseResult(res){
    if(typeof res == 'string') res = JSON.parse(res);
    let { Result } = res[0];
    return Result == 1
  }

  // static makeRequest(url, method, data){
  //   try {
  //     let res = await $.ajax({ url, method, data });
  //     return CommonService.handleData(res);
  //   } catch (error) {
  //     return CommonService.handleError(error);
  //   }
  // }

}