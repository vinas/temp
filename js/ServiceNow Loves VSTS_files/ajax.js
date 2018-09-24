/**
* Ajax Class
*
* @description This class' purpose is to handle ajax requets.
* @author Vinas de Andrade <vinas.andrade@gmail.com>
* @since 2017/08/31
* @version 1.18.0912
* @license SaSeed\license.txt
*/
function Ajax() {

    var xhttp = new XMLHttpRequest();

    this.get = get;
    this.post = post;
    this.put = put;

    return this;

    function get(uri, header, success, error) {
        xhttp.open('GET', uri, true);
        populateHeader(header);
        xhttp.onreadystatechange = function() {
            handleResponse(this, success, error);
        }
        xhttp.send();
    }

    function post(uri, header, params, success, error) {
        xhttp.onreadystatechange = function() {
            handleResponse(this, success, error);
        }
        xhttp.open('POST', uri, true);
        populateHeader(header);
        xhttp.send(JSON.stringify(params));
    }

    function put(uri, header, params, success, error) {
        xhttp.onreadystatechange = function() {
            handleResponse(this, success, error);
        }
        xhttp.open('PUT', uri, true);
        populateHeader(header);
        xhttp.send(JSON.stringify(params));
    }

    function populateFormData(params) {
        var data = new FormData();
        if (params) {
            for (var key in params) {
                data.append(key, params[key]);
            }
        }
        return data;
    }

    function populateHeader(header) {
         for (i = 0; i < header.length; i++) {
            xhttp.setRequestHeader(header[i][0], header[i][1]);
        }
   }

    function handleResponse(res, success, error) {
        if (res.readyState == 4) {
            if (res.status == 200) {
                success(isJson(res.responseText) ? JSON.parse(res.responseText) : res.responseText);
                return;
            }
            error(isJson(res.responseText) ? JSON.parse(res.responseText) : res.responseText);
        }
    }

    function isJson(content) {
        return (/^[\],:{}\s]*$/.test(content.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    }

}