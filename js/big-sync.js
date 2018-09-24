function BigSync() {

    this.sync = sync;

    return this;

    function sync() {
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
                    display.consolePrintGenericError
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
                display.consolePrintGenericError
            );
        }

        function handleBigSync() {
            var idx = 0,
                updatedIncidents = 0,
                snIncidentsWithError = [];

            syncLoop();

            function syncLoop() {
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
                            { 'close_notes': 'VSTS ID ->'+res.id+'<- (NÃO ALTERAR ESSA LINHA)\n**********************************************\n\n'+snIncidents[idx].close_notes },
                            function () {
                                updatedIncidents++;
                                if (idx == snIncidents.length - 1) {
                                    handleSyncFinishedMsg(idx+1, updatedIncidents, snIncidentsWithError)
                                    return;
                                }
                                idx++;
                                syncLoop();
                            },
                            function () {
                                snIncidentsWithError.push(snIncidents[idx].number);
                                if (idx == snIncidents.length - 1) {
                                    handleSyncFinishedMsg(idx+1, updatedIncidents, snIncidentsWithError)
                                    return;
                                }
                                idx++;
                                syncLoop();
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

    function getVstsIncidentList(success) {
        vsts.getWorkItemList(
            success,
            display.consolePrintGenericError
        );
     }    

}