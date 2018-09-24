var vsts = new VSTS(),
    sn = new SN(),
    display = new Display();

function vstsLogin() {
    vsts.login();
}

function addIncidentToVsts() {
    display.showLoading();
    sn.getIncident(document.getElementById('snId').value, handleSnSuccessResponse, handleSnErrorResponse);
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

function bigSync() {
    var vstsIncident = false,
        snIncidents = false;

    display.showLoading();
    display.hideAndClearResContainer();

    getVstsIncidentList(getNewestVstsIncident);

    function getNewestVstsIncident(res) {
        if (res.workItems.length > 0) {
            vsts.getWorkItem(
                res.workItems[0].id,
                function (res) {
                    vstsIncident = res;
                    getSnIncidentList(handleBigSync)
                },
                consolePrintGenericError
            );
            return;
        }
        vstsIncident.snId = 666;
        getSnIncidentList(handleBigSync)
    }

    function getSnIncidentList(callback) {
        sn.getOpenIncidentList(
            50,
            function (res) {
                snIncidents = getITIncidentes(res.result);
                callback();
            },
            consolePrintGenericError
        );
    }

    function handleBigSync() {
        var idx = 0,
            updatedIncidents = 0,
            snIncidentsWithError = [];

        sync();

        function sync() {
            if (vstsIncident.snId == snIncidents[idx].number) {
                handleVstsSuccessResponse('Importação Terminada!<br />'+ idx +' incidente(s) adicionado(s) ao VSTS');
                return;
            }
            vsts.createWorkItem(
                {
                    incident: snIncidents[idx],
                    criticality: 'Low'
                },
                function (res) {
                    sn.updateIncident(
                        snIncidents[idx].sys_id,
                        { 'close_notes': 'VSTS ID: '+res.id+'\n\nVINAS' },
                        function () {
                            updatedIncidents++;
                            if (idx == snIncidents.length - 1) {
                                handleSyncFinishedMsg(idx+1, updatedIncidents, snIncidentsWithError)
                                return;
                            }
                            idx++;
                            sync();
                        },
                        function () {
                            snIncidentsWithError.push(snIncidents[idx].number);
                            if (idx == snIncidents.length - 1) {
                                handleSyncFinishedMsg(idx+1, updatedIncidents, snIncidentsWithError)
                                return;
                            }
                            idx++;
                            sync();
                        }
                    )
                },
                handleVstsErrorResponse
            );
        }
    }

}

function handleSyncFinishedMsg(totVstsIncidents, updatedIncidents, snIncidentsWithError) {
    var text = 'Importação terminada!<br /><br />'+ totVstsIncidents +' incidente(s) adicionado(s) ao VSTS<br /><br />';
    text += updatedIncidents + ' incidentes atualizados com sucesso no SN';
    if (snIncidentsWithError.length > 0) {
        text += '<br /><br />Não foi possível atualizar no SN o(s) incidente(s) abaixo:<br/>';
        for (var i = 0; i < snIncidentsWithError.length; i++) {
            text += '<br />'+snIncidentsWithError[i];
        }
    }
    handleVstsSuccessResponse(text);
}

function getITIncidentes(incidents) {
    var filtered = [];
    for (var i = 0; i < incidents.length; i++) {
        if (incidents[i].assignment_group.value == '3886d7786fc11b80bdcbe4064b3ee4c8') {
            filtered.push(incidents[i]);
        }
    }
    return filtered;
}

function getOpenSnIncidentList() {
    sn.getOpenIncidentList(
        50,
        function (res) {
            console.log('sucesso - ', res.result);
        },
        consolePrintGenericError
    );
}


function getVstsIncidentList(success) {
    vsts.getWorkItemList(
        success,
        consolePrintGenericError
    );
 }

function consolePrintGenericError(err) {
    display.hideLoading();
    console.log('** ERROR **\n' + consolePrintGenericError.caller + ' - ', err);
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
