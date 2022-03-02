"use-strict";
var PaginationService = function () {
    function getPages(data, itemCount = 5) {
        var itemsPerPage = itemCount;
        var pages = [];
        numberOfPages = Math.ceil(data.length / itemsPerPage);
        var begin = 0;
        //Testing if the data returned is Empty Then Show So
        //Or try notifing the caller
        //if (numberOfPages == 0) return new Array();
        for (var i = 0; i < numberOfPages; i++) {
            if (i == numberOfPages - 1) {
                pages.push(
                    {
                        title: i,
                        from: begin,
                        to: data.length,
                        isLast: true,
                        isFirst: numberOfPages == 1,
                        isPrevious: numberOfPages != 1,
                        isNext: false
                    }
                );
                break;
            }
            if (i == 0) {
                pages.push(
                    {
                        title: i,
                        from: begin,
                        to: begin + itemsPerPage,
                        isLast: false,
                        isFirst: true,
                        isPrevious: false,
                        isNext: true
                    }
                );
            } else {
                pages.push(
                    {
                        title: i,
                        from: begin,
                        to: begin + itemsPerPage,
                        isLast: false,
                        isFirst: false,
                        isPrevious: true,
                        isNext: true
                    }
                );
            }
            begin += itemsPerPage;
        }
        return pages;
    }

    function setPage(data, currentPageDescription) {
        console.log(currentPageDescription);
        var currentPageData = data.slice(currentPageDescription.from, currentPageDescription.to);
        return currentPageData;
    }

    return {
        getPages: getPages,
        setPage: setPage,
    };
}

mainApp.service('PaginationService', PaginationService);