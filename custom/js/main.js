//check if user is authenticated
checkHaveAccount();

$(() => {
  //show message to the account which had expired time duration
  showExpiredAccountMessage();
  getUsernameVsPassMQTT();
  MQTTconnect();
})

// get app constants for usage
let { APP_DOMAIN, APP_IMAGE_URL, API_URL, CENTER_POS_MAP_VIEW, 
  arrMonths, arrColors, arrCriteriaReport, unitsOfDataReport, arrReportCal,
  arrPropsReport, arrYears, arrDatesInWeek } = constants;
  


// Chart.pluginService.register({
//   beforeRender: function (chart) {
//     if (chart.config.options.showAllTooltips) {
//       // create an array of tooltips
//       // we can't use the chart tooltip because there is only one tooltip per chart
//       chart.pluginTooltips = [];
//       chart.config.data.datasets.forEach(function (dataset, i) {
//         chart.getDatasetMeta(i).data.forEach(function (sector, j) {
//           chart.pluginTooltips.push(new Chart.Tooltip({
//             _chart: chart.chart,
//             _chartInstance: chart,
//             _data: chart.data,
//             _options: chart.options.tooltips,
//             _active: [sector]
//           }, chart));
//         });
//       });
//       // turn off normal tooltips
//       chart.options.tooltips.enabled = false;
//     }
//   },
//   afterDraw: function (chart, easing) {
//     if (chart.config.options.showAllTooltips) {
//       // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
//       if (!chart.allTooltipsOnce) {
//         if (easing !== 1)
//           return;
//         chart.allTooltipsOnce = true;
//       }
//       // turn on tooltips
//       chart.options.tooltips.enabled = true;
//       Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
//         tooltip.initialize();
//         tooltip.update();
//         // we don't actually need this since we are not animating tooltips
//         tooltip.pivot();
//         tooltip.transition(easing).draw();
//       });
//       chart.options.tooltips.enabled = false;
//     }
//   }
// })
