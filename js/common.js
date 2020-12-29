
const apiDomain = 'http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071';

makeAPI = function(apiData,cbk){
    const headers = apiData.headers || {};
    const pathParam = apiData.pathParam || '';
    const requestMethod = apiData.requestMethod || 'GET';
    const queryParams = apiData.queryParam || '';
    const bodyData =  apiData.bodyData || {};
    $.ajax({
        type: requestMethod,
        url: apiDomain+pathParam+'?'+queryParams,
        data: bodyData,
        success: function(data) {
            console.log("API-Success")
            cbk(data)
        },
        error: function(err) {
            console.log("API-Failed")
            cbk(err)
        },
        dataType: 'json'
    });
}

