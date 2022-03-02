"use-strict";
function ModalService($rootScope, $modal) {

    function openModal(url, parameters, onModalClosed) {
        var newScope = $rootScope.$new();
        newScope.parameters = parameters;

        newScope.onModalClosed = onModalClosed;
        var modalInstance = $modal.open({
            templateUrl: url,
            scope: newScope,
            windowClass: 'app-modal-window',
            backdrop: false,
            keyboard: false,
            modalFade: true
        });
        newScope.Close = function () {
            newScope.onModalClosed();
            modalInstance.close();
            newScope.$destroy();
        }
    };

    return {
        openModal: openModal,
    };
};

mainApp.service("ModalService", ModalService);
