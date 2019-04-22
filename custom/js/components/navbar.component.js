class NavbarComponent{
  static renderNavbar(){
    let $nav = $('nav');
    $nav.html(`
        <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fa fa-shield icon-custom" style="color: whitesmoke"></i>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars icon-custom" style="color: white"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="../index/mainView.html">
                <i class="fa fa-home icon-navbar"></i>
                <span class="trn">Main View</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../lives/livetour.html">
                <i class="fa fa-street-view icon-navbar"></i>
                <span class="trn">Live Tour</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../lives/liveincident.html">
                <i class="fa fa-exclamation-triangle icon-navbar"></i>
                <span class="trn">Live Incident</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../lives/liveattendance.html">
                <i class="fa fa-exclamation-triangle icon-navbar"></i>
                <span class="trn">Live Attendance</span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-area-chart icon-navbar"></i>
                <span class="trn">Reports</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#" id="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="trn">Security Performace</span>
                  </a>
                  <div class="dropdown-menu">
                    <!--<a class="dropdown-item" href="../reports/reportdaily.html">Daily Patrolling Report</a>
                    <a class="dropdown-item" href="../reports/fixed-point-route-report.html">Daily Fixed post Report</a>
                    <a class="dropdown-item" href="../reports/reportweekormonth.html">Partrolling & Incident Report</a>-->
                    <a class="dropdown-item" href="../reports/historytour.html">Patrolling history</a>
                    <a class="dropdown-item" href="../reports/reportpatrolfixeddaily.html">Patrolling - Fixed Post Daily Group</a>
                    <a class="dropdown-item" href="../reports/combined-performance-report-guard-group.html">Combined Performance Group</a>
                  </div>
                </div>
                <div class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#" id="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="trn">Incident</span>
                  </a>
                  <div class="dropdown-menu">
                    <a class="dropdown-item" href="../reports/reportincident.html">Incident Report</a>
                    <a class="dropdown-item" href="../reports/historyincident.html">Incident History</a>
                  </div>
                </div>
                <div class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#" id="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="trn">Time Attendance</span>
                  </a>
                  <div class="dropdown-menu">
                    <a class="dropdown-item" href="../reports/historyattendance.html">Attendance History</a>
                    <a class="dropdown-item" href="../reports/attendance-report-guard.html">Guard's Working-Idling Time Performance</a>
                    <a class="dropdown-item" href="../reports/attendance-report-device.html">Device's Working-Idling Time Performance</a>
                    <a class="dropdown-item" href="../reports/attendance-report-group.html">Group's Working-Idling Time Performance</a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-cog icon-navbar"></i>
                <span class="trn">Settings</span>
              </a>
              <div class="dropdown-menu">
                <a class="dropdown-item trn" href="../settings/managepoint.html">Create Check Points</a>
                <a class="dropdown-item trn" href="../settings/managegroup.html">Create Group-guard</a>
                <a class="dropdown-item trn" href="../settings/manageguard.html">Security Guard Profile</a>
                <a class="dropdown-item trn" href="../settings/managezone.html">Create Zone</a>
                <a class="dropdown-item trn" href="../settings/manageroute.html">Create Route</a>
                <a class="dropdown-item trn" href="../settings/managedevice.html">Create Device</a>
                <a class="dropdown-item trn" href="../settings/manageincident.html">Define Incidents</a>
              </div>
            </li>
          </ul>
          <ul class="navbar-nav">
            <button class="btn custom-btn bg-main-color trn">
              <img src="../../img/GuardOnline.png" class="avatar-profile">
              <span id="usernameAccount"></span>
            </button>
            <button class="btn custom-btn bg-main-color trn" id="btnMoreOptionOnMenu">
              
              <span>More</span>
            </button>
            <button class="btn custom-btn bg-main-color trn" id="btnLogout">
              Logout
            </button>
          </ul>
        </div>
      </div>
    `)
    $('.dropdown-submenu .dropdown-toggle').on("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).parent().siblings().children('.dropdown-menu').css({
        display: 'none'
      });
      $(this).next('.dropdown-menu').toggle();
    });
    
    $('.dropdown').on('hidden.bs.dropdown', function () {
      $('.dropdown-submenu .dropdown-menu').css({
        display:'none'
      })
    })
    let { FullName } = getUserAuth();
    $('#usernameAccount').text(FullName)
    $('#btnMoreOptionOnMenu').click(showMoreOptionsMenu);
    $('#btnLogout').click(logout);
  }
}

function showMoreOptionsMenu(){
  // alert('hello');
  $('#modalMoreOptionSettings').modal('show');
}

function logout(){
  localStorage.clear();
  sessionStorage.clear();
  redirectToLoginPage();
}

NavbarComponent.renderNavbar();
setDefaultLang();
// active-menu-item
