let constants = {

    APP_DOMAIN : 'http://patrolapi.quanlytuantra.vn/',

    APP_IMAGE_URL : 'http://image.quanlytuantra.vn/',

    API_URL : 'http://patrolapi.quanlytuantra.vn/web',

    CENTER_POS_MAP_VIEW : [20.81715284, 106.77411238],

    TIME_OUT_SHOW_MAP_ON_MODAL : 0,

    arrMonths : [
        'January', 'February', 'March', 
        'April', 'May', 'June', 'July', 
        'August', 'September', 'October', 
        'November', 'December'
    ],

    arrDateInWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thurseday', 'Friday', 'Saturday', 'Sunday'],

    arrColors : [ 
        '#8d6e63', '#616161', '#78909c', 
        '#ffb74d', '#66bb6a', '#80d8ff', 
        '#00acc1', '#5c6bc0', '#f48fb1', 
        '#e1bee7', 'red', 'green', 'blue',
        'orange','violet', 'yellow', 'pink', 
        'purple', 'cyan', 'teal', 'lime', 'ambe', 
        '#0048BA', '#B0BF1A', '#7CB9E8', '#72A0C1', 
        '#F2F0E6', '#9966CC', '#E32636', '#C46210', 
        '#EFDECD', '#FFBF00', '#CFCFCF', '#551B8C', '#F2B400', 
        '#CD9575', '#665D1E', '#915C83', '#841B2D', '#008000', 
        '#8DB600', '#FBCEB1', '#00FFFF', '#D0FF14', '#4B5320', 
        '#8F9779', '#E9D66B', '#B2BEB5', '#87A96B', '#FF9966' 
    ],

    arrCriteriaReport : [
        'Time per Route (min)',
        'Expected Executed Routes',
        'Actual Executed Routes',
        'Time spent on resolving non-conformities (minutes)',
        'Missed routes due to resolving non-conformities',
        'Corrected Executed Routes',
        'Performance Routes (%)',
        'Successful routes within time schedule',
        'Performance Timing (%)',
        'Successful routes with correct routing',
        'Performance Routing (%)',
        'Routing Mistakes',
        'Overall performance (%)',
        'Overall performance Group (%)',
        'Number of reports issued',
        'Actual Patrolling Time (min)',
        'Allowed Interval between trip',
        'Total patroling time in minutes',
        'Perfomance Time %',
        'Total Idling Time (min)',
        'Idling Time in %',
      ],

    arrCriteriaGuardHouse : [
        "Number of Checks Required",
        "Number of Checks Perfomed",
        "Check Performance",
        "Number of Missed Check",
        "Check Accuracy",
        "Amount of unattended time(min)",
        "Time attendance",
        "Attendance Perfomance",
        "Unattended Time in %",
        "Overall performance (%)",
        'Overall performance Group (%)',
        "Average amount of unattended time(min)",
        "Longest duration of unattended(min)",
        'Combined Performance'
        
    ],

    arrCriteriaGuardHouseVNlang : [
        "Số lần kiểm tra được yêu cầu",
        "Số lần kiểm tra thực hiện",
        "Hiệu suất kiểm tra theo số lần",
        "Số lần kiểm tra bị nhỡ",
        "Hiệu suất kiểm tra theo độ chính xác",
        "Tổng sô thời gian không  kiểm soát",
        "Tổng số thời gian kiểm soát",
        "Hiệu suất theo thời gian kiểm soát",
        "% thời gian không kiểm soát",
        "Hiệu suất chung (%)",
        "Thời gian vắng mặt trung bình",
        "Thời gian vắng mặt lâu nhất"
    ],

    unitsOfDataReport : [
        'min', '', '', 'min', '', '', 
        '%', '', '%','', '%', '', '%', '%', '',
        'min', 'min', 'min', '%', 'min', '%'
    ],

    arrReportCal : [
        1, 2, 3, 4, '5  =4:1', '6=3+5', 
        '7=6:2', 8, '9=8:3', 10, '11=6:3', '',
        '12=7*9*11', 14, 15, 16,
        17, 18, 19, 20, 21
    ],

   arrPropsReport : [
        'iTime_per_Route', 
        'iExpected_Executed_Routes',
        'iActual_Executed_Routes', 
        'iTime_spent_on_resolving_non_conformities',
        'iMissed_routes_due_to_resolving_non_conformities',
        'iCorrected_Executed_Routes', 
        'dPerformance_Routes',
        'iSuccessful_routes_within_time_schedule', 
        'dPerformance_Timing',
        'iSuccessful_routes_with_correct_routing', 
        'dPerformance_Routing',
        'iRouting_Mistakes', 
        'dOverall_performance', 
        'dOverall_performance_Patrolling',
        'iNumber_of_reports_issued',
        'iActual_Patrolling_Time', 
        'iAllowed_Interval_between_trip',
        'iTotal_patroling_time_in_minutes', 
        'dPerfomance_Time',
        'iTotal_Idling_Time', 
        'dIdling_Time_in'
    ],

    arrPropsReportGuardHouse: [
        'iNumber_of_Checks_Required',
        'iNumber_of_Checks_Perfomed',
        'dCheck_Performance',
        'iNumber_of_Missed_Check',
        'dCheck_Accuracy',
        'iAmount_of_unattended_time',
        'iTime_attendance',
        'dAttendance_Perfomance',
        'dUnattended_Time',
        'dOverall_performance',
        'dOverall_performance_Fixed',
        'iAverage_amount_of_unattended_time',
        'iLongest_duration_of_unattended',
        'dCombined_Performance'
    ],

    arrReportCalGuardHouse: [
        '1', '2', '3=2/1', '4', '5=(2-4)/2*100', '6', '7', '8', '9', '10=3*5*8', '11', '12', '13'],

    unitsOfDataReportGuardHouse: [
        '','','%','', '%','', '', '%', '%', '%', '%', 'min', 'min'],

    arrYears: [],
};

function getArrYears(){
    constants.arrYears = [];
    let currentYear = new Date().getFullYear();
    let end = currentYear + 10;
    for (let i = currentYear; i < end; i++) {
        constants.arrYears.push(i);
    }
}

// init arrYears
getArrYears();
