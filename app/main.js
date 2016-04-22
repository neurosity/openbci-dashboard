System.register(['angular2/platform/browser', './components/dashboard/dashboard.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, dashboard_component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (dashboard_component_1_1) {
                dashboard_component_1 = dashboard_component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(dashboard_component_1.DashboardComponent);
        }
    }
});
//# sourceMappingURL=main.js.map