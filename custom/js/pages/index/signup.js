$('#formInputKey').hide(0);

$(() => {
    $('#formLogin').submit(checkUserIsAuthenticated);
    $('#formInputKey').submit(checkAuthenticatedKey);
})

  let $txtUsername = $('#txtUsername');
  let $txtPassword = $('#txtPassword');

  async function checkUserIsAuthenticated(e) {
    e.preventDefault();
    let sUserName = $txtUsername.val();
    let sPassWord = $txtPassword.val();
    let { valid, errMsg } = checkValidData(sUserName, sPassWord);
    if(!valid) return AlertService.showAlertError('Invalid data', errMsg);
    let res = await checkLogin(sUserName, sPassWord);
    if(!res) return AlertService.showAlertError('Login fail', 'Username and pasword is not match');
    sessionStorage.setItem('account-info', res);
    $('#formLogin').hide(0);
    $('#formInputKey').show(0);
    console.log(JSON.parse(res)[0].StringTemp);
  }

//   deepc_buitai
//   0123456789

  function checkAuthenticatedKey(e){
    e.preventDefault();
    let key = $('#txtKey').val();
    let json = sessionStorage.getItem('account-info');
    if(!ValidationService.checkEmpty(json)) {
        AlertService.showAlertError('Invalid account!!', 'Username and Password is not available, please try again!!');
        $('#formLogin').show(0);
        $('#formInputKey').hide(0);
    }else{
        let obj = JSON.parse(json)[0];
        let { StringTemp } = obj;
        if(key == `0${StringTemp}0`) {
            sessionStorage.setItem('account-key', key);
            location.href = 'mainView.html';
        }
        else return AlertService.showAlertError('Invalid data', 'Key is not valid, please try again');
    }
  }

  function checkValidData(username, password) {
    let errMsg = '';
    let valid = true;

    if (!ValidationService.checkEmpty(username)) {
      valid = false;
      errMsg += 'Username can not be missed';
    }
    if (!ValidationService.checkEmpty(password)) {
      valid = false;
      errMsg += 'Password can not be missed';
    }
    
    return { valid, errMsg };
  }