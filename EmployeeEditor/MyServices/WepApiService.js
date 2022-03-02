"use-strict";

function WebApiService($http) {

    function Get(uri, params = {}) {
        let request = {
            method: 'GET',
            url: uri,
            params: params,
        };
        return $http(request);
    };

    function Post(uri, params) {
        let request = {
            method: 'POST',
            url: uri,
            data: params
        };
        return $http(request);
    };
    return {
        Get: Get,
        Post: Post
    };
}

mainApp.service("WebApiService", WebApiService);