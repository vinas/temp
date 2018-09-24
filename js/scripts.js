var vsts = new VSTS(),
    sn = new SN(),
    display = new Display(),
    bigSync = new BigSync();

function vstsLogin() {
    vsts.login();
}

function addIncidentToVsts() {
    if (confirm('ATENÇÃO!\n\nIsso pode duplicar o incidente no VSTS, caso ele já tenha sido importado.\n\nDeseja continuar?')) {
        display.showLoading();
        sn.getIncident(document.getElementById('snId').value, handleSnSuccessResponse, handleSnErrorResponse);
    }
}

function createVstsWorkItem(incident, criticality) {
    display.showLoading();
    vsts.createWorkItem(
        {
            incident: incident,
            criticality: criticality
        },
        function (res) {
            handleVstsSuccessResponse('Work item ID ' + res.id + ' no VSTS criado com sucesso');
        },
        handleVstsErrorResponse
    );
}

function logUserIn() {
    document.getElementById('vstsLogin').setAttribute('class', 'login logged pointer');
    
}

function getSnIncident() {
    display.showLoading();
    sn.getIncident(document.getElementById('searchSnId').value, display.snIncident, handleSnErrorResponse);
}

function getVstsWorkItem() {
    display.showLoading();
    display.hideAndClearResContainer();
    vsts.getWorkItem(
        document.getElementById('vstsId').value,
        showVstsWorkItem,
        handleVstsErrorResponse
    );
}

function showVstsWorkItem(vstsWorkItem) {
    handleVstsSuccessResponse(vstsWorkItem.id+' - '+vstsWorkItem.title);
}

function getOpenSnIncidentList() {
    sn.getOpenIncidentList(
        50,
        function (res) {
            console.log('sucesso - ', res.result);
        },
        display.consolePrintGenericError
    );
}

function handleSnErrorResponse(error) {
    display.displayErrorBlock(error.error.message, error.error.detail);
}

function handleSnSuccessResponse(response) {
    if (response.result.length < 1) {
        handleSnErrorResponse({error: {message: 'Não encontrado no ServiceNow', detail: 'Incidente não encontrado. Confira o id informado.'}});
        return;
    }
    createVstsWorkItem(response.result[0], document.getElementById('criticality').value);
}

function handleVstsErrorResponse(error) {
    display.displayErrorBlock('Erro', 'Houve um erro na interação com o VSTS');
}

function handleVstsSuccessResponse(response) {
    display.displaySuccessBlock(response);
}

function closeResContainer() {
    var closeBtn = document.getElementById('close');
    closeBtn.style.boxShadow = '1px 1px #fff';
    setTimeout(function() {
        display.hideAndClearResContainer();
        closeBtn.style.boxShadow = '-1px -1px #fff';
    }, 100);
}
