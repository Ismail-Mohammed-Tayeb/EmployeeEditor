"use-strict";

function PromisesService($q) {

    function waitMultiplePromises(tasks) {
        var finishedTasks = 0;
        var finalResultPromise = $q.defer();

        for (var index = 0; index < tasks.length; index++) {
            tasks[index].then(
                function () {
                    finishedTasks++;
                    if (finishedTasks == tasks.length) {
                        finalResultPromise.resolve();
                    }
                }
            ).catch(
                function () {
                    finalResultPromise.reject();
                }
            );
        }
        return finalResultPromise.promise;
    }


    return {
        waitMultiplePromises: waitMultiplePromises
    };
}


mainApp.service("PromisesService", PromisesService);