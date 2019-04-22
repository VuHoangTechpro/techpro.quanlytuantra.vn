function getUserAuth(){
    let json = sessionStorage.getItem('account-info');
    let obj = JSON.parse(json)[0];
    return obj;
}

async function checkLogin(sUsername, sPassword){
    let sentData = { sUsername, sPassword };
    let url = `${constants.API_URL}/active/login.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      let obj = JSON.parse(res)[0];
      let { StatusLogin } = obj;
      if(!StatusLogin) return false;
      if(StatusLogin == '0') return false;
      return res;
    } catch (error) {
      //console.log(error);
      //console.log(error.message);
      return false;
    }
  }

  function getSecretKeyPassword(){
    let d = new Date();
    let date = d.getDate();
    let year = d.getFullYear() + '';
    let hour = d.getHours();
    let month = d.getMonth() + 1;
    year = year.substring(year.length - 2);
    return `${date}${year}${hour}${month}`;
  }

  function checkNotEmpty(value){
    if(value == null || value == undefined) return false;
    if(typeof value == 'string' && value.trim() == '') return false;
    if(typeof value == 'object' && Object.keys(value).length == 0) return false;
    return true;
  }

  function showExpiredAccountMessage(){
    if(location.href.indexOf('login.html') > -1) return;
    let json = sessionStorage.getItem('account-info');
    let obj = JSON.parse(json)[0];
    let { StatusLogin } = obj;
    if(StatusLogin == 2){
      $('body').prepend(`<div class="alert alert-danger text-center" role="alert">
         Your account has been expired, please check your duration time of usage of this system
        </div>`)
    }
  }
  
  function checkHaveAccount(){
    if(location.href.indexOf('login.html') > -1) return;
    let json = sessionStorage.getItem('account-info');
    let key = localStorage.getItem('account-key');
    if(!checkNotEmpty(json)) return redirectToLoginPage();
    let obj = JSON.parse(json)[0];
    // let { StringTemp } = obj;
    if(key != `123456`) return redirectToLoginPage();
  }

  function redirectToLoginPage(){
    let currentUrl = location.href;
    let index = currentUrl.indexOf('/html/');
    let newUrl = currentUrl.substring(0, index) + '/html/index/login.html';
    location.href = newUrl;
  }
  

  function encryptData(str, secret){
    // return Aes.Ctr.encrypt(str, secret, 256);
    return CryptoJS.AES.encrypt(str, secret, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });
  }
  
  function decryptData(encrypted, secret){
    
    // return Aes.Ctr.decrypt(encrypted, secret, 256);
    // return Aes.Ctr.decrypt(encrypted, secret, 256);
    return CryptoJS.AES.decrypt(encrypted, secret, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });
  }
  