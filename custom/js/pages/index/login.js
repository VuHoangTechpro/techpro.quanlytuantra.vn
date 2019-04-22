let countTime = 0;

$(() => {
    $('#formLogin').submit(checkUserIsAuthenticated);
    $('#formInputKey').submit(checkAuthenticatedOTP);
    
});

  let $txtUsername = $('#txtUsername');
  let $txtPassword = $('#txtPassword');

  async function checkUserIsAuthenticated(e) {
    e.preventDefault();
    let sUserName = $txtUsername.val();
    let sPassWord = $txtPassword.val();
    $('#formLogin')[0].reset();
    let { valid, errMsg } = checkValidData(sUserName, sPassWord);
    if(!valid) return AlertService.showAlertError('Invalid data', errMsg);
    let res = await checkLogin(sUserName, sPassWord);
    if(!res) return AlertService.showAlertError('Login fail', 'Username and password is not match');
    sessionStorage.setItem('account-info', res);
    //console.log(res);
    checkStatusLogin(res);
  }

  function checkStatusLogin(res){
    let obj = JSON.parse(res)[0];
    let { StatusLogin } = obj;
    if(StatusLogin == 1 || StatusLogin == 2) return location.href = 'mainView.html';
    if(StatusLogin == 3)  {
      localStorage.removeItem('account-key');
      renderFormInputOTP();

      // set time for the user input key
      setTimeCount();
    }
  }

  function renderFormInputOTP(){
    $('#formLogin').hide(0);
    $('#formInputKey').html(`
      <div class="form-group">
        <label for="" class="font-weight-bold">Key</label>
        <input type="text" class="form-control" id="txtKey" placeholder="Input key from your phone.." name="">
      </div>
      <div class="text-center">
        <button type="submit" class="btn bg-main-color my-3 py-2 px-3">Confirm</button>
        <button type="submit" class="btn bg-grey my-3 py-2 px-3" style="color: black">Re send Code</button>
      </div>
    `).submit(checkAuthenticatedOTP);
    $('#formInputKey #txtKey').on('input', () => {
      countTime = 0;
    })
  }

  function setTimeCount(){
    let interval = setInterval(() => {
      countTime++;
      if(countTime == 60) {
        countTime = 0;
        clearInterval(interval);
        AlertService.showAlertError('Please input your code', 'If not, you will have to login again!');
        let interval_2 = setInterval(() => {
          countTime++;
          if(countTime == 60){
            clearInterval(interval_2);
            $('#formLogin').show(0);
            $('#formInputKey').empty();
          }
        }, 1000);
      }
    }, 1000);
  }

  function checkAuthenticatedOTP(e){
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
        if(key == `123456`) {
            localStorage.setItem('account-key', key);
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