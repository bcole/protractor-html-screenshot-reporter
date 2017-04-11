var app = angular.module('reportingApp', []);

app.controller('ScreenshotReportController', function ($scope) {
    $scope.searchSettings = {
        description: '',
        passed: true,
        failed: true,
        pending: true
    };

    $scope.inlineScreenshots = false;

    this.chooseAllTypes = function () {
        $scope.searchSettings.passed = true;
        $scope.searchSettings.failed = true;
        $scope.searchSettings.pending = true;
    };

    this.getParent = function (str) {
        var arr = str.split('|');
        str = "";
        for (var i = arr.length - 1; i > 0; i--) {
            str += arr[i] + " > ";
        }
        return str.slice(0, -3);
    };


    this.getShortDescription = function (str) {
        return str.split('|')[0];
    };


    this.nToBr = function (str) {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };


    this.getFilename = function (str) {
        return str.replace(/^.*[\\\/]/, '');
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {passCount++};
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {pendingCount++};
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {failCount++}
        }
        return failCount;
    };

    this.checkIfSuspectedLine = function (line) {
        if ((line.indexOf('node_modules') > -1) ||
            (line.indexOf('at') === -1)
        ) {
            return false;
        }
        return true;
    };


    this.results ='<Results Replacement>';
});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {
                if (searchSettings.passed && item.passed) {
                    filtered.push(item);
                } else if (searchSettings.failed && !item.passed && !item.pending) {
                    filtered.push(item);
                } else if (searchSettings.pending && item.pending) {
                    filtered.push(item);
                }
            }
        }

        return filtered;
    };
});