function Display() {

    var loading = document.getElementById('loading'),
        responseContainer = document.getElementById('resContainer'),
        successElm = document.getElementById('success'),
        errorTitle = document.getElementById('errorTitle'),
        errorDetail = document.getElementById('errorDetail');

    this.displayErrorBlock = displayErrorBlock;
    this.displaySuccessBlock = displaySuccessBlock;
    this.hideAndClearResContainer = hideAndClearResContainer;
    this.showLoading = showLoading;
    this.hideLoading = hideLoading;
    this.snIncident = snIncident;

    return this;

    function snIncident(incident) {
        var incident = incident.result[0],
            html = '';
        console.log(incident);
        html = '<div>Id: '+incident.number+'</div>';
        html += '<div>State: '+getStateName(incident.state)+'</div>';
        html += '<div>Titulo: '+incident.short_description+'</div>';
        displaySuccessBlock(html);
    } 

    function displayErrorBlock(title, detail) {
        hideLoading();
        responseContainer.style.display = 'block';
        successElm.innerHTML = '';
        errorTitle.innerHTML = title;
        errorDetail.innerHTML = detail;
    }

    function displaySuccessBlock(response) {
        hideLoading();
        errorTitle.innerHTML = '';
        errorDetail.innerHTML = '';
        responseContainer.style.display = 'block';
        successElm.innerHTML = response;
    }

    function hideAndClearResContainer() {
        responseContainer.style.display = 'none';
        successElm.innerHTML = '';
        errorTitle.innerHTML = '';
        errorDetail.innerHTML = '';
    }

    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function getStateName(state) {
        switch (state) {
            case 110:
            case '110':
                return 'Forwanded';
            case 1:
            case '1':
                return 'Open';
            case 2:
            case '2':
                return 'In Progress';
            case 6:
            case '6':
                return 'Resolved';
            case -15:
            case '-15':
                return 'Reopened';
            default:
                return state;
        }
    }

}

