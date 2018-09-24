function VSTS() {

    var ajax = new Ajax(),
        token = false,
        context = setupAdal(),
        logged = false;

    this.isLogged = isLogged;
    this.login = login;
    this.logout = logout;
    this.getWorkItem = getWorkItem;
    this.createWorkItem = createWorkItem;
    this.updateWorkItem = updateWorkItem;
    this.deleteWorkItem = deleteWorkItem;
    this.getWorkItemList = getWorkItemList;

    init();

    return this;

    function init() {
        var user = false;
        if (context.isCallback(window.location.hash)) {
            context.handleWindowCallback();
            var err = context.getLoginError();
            if (err) {
                console.log('ERROR: ', err);
            }
            return;
        }
        user = context.getCachedUser();
        if (user) {
            logged = true;
            logUserIn();
            context.acquireToken(
                '499b84ac-1321-427f-aa17-267ca6975798',
                handleGetTokenResponse
            );
            return;
        }
    }

    function isLogged() {
        return logged;
    }

    function getWorkItemList(success, error) {
        var header = [];
        header.push(['Content-Type', 'application/json-patch+json']);
        header.push(['Authorization', 'Bearer ' + token]);
        ajax.get(
            'https://dev.azure.com/alelo/AleloAuto/_apis/wit/wiql/f667a6a0-6da4-4a9f-97b6-537f81626326?api-version=4.1',
            header,
            success,
            error
        );
    }

    function createWorkItem(data, success, error) {
        var header = [];
        header.push(['Content-Type', 'application/json-patch+json']);
        header.push(['Authorization', 'Bearer ' + token]);
        ajax.post(
            'https://alelo.visualstudio.com/AleloAuto/_apis/wit/workitems/$Incident?api-version=4.1',
            header,
            popVstsRequirementData(data),
            success,
            error
        );
    }

    function getWorkItem(id, success, error) {
        var header = [],
            item = false;
        header.push(['Authorization', 'Bearer ' + token]);
        ajax.get(
            'https://alelo.visualstudio.com/AleloAuto/_apis/wit/workitems/'+id+'?api-version=4.1',
            header,
            function(res) {
                success(mapWorkItem(res))
            },
            error
        );
    }

    function updateWorkItem() {
        console.log('updateWorkItem');
    }
    
    function deleteWorkItem() {
        console.log('deleteWorkItem');
    }

    function login() {
        if (!context.getCachedUser()) context.login();
    }

    function logout() {
        context.logout();
    }

    function handleGetTokenResponse(error, tkn) {
        if (error || !tkn) {
            console.log('ERROR:\n\n' + error);
            return;
        }
        token = tkn;
    }

    function setupAdal() {
        return new AuthenticationContext({
            clientId: '6e33d3da-e8a9-4f08-a9cb-2bf54ee18c69',
            redirectUri: 'http://localhost:8008',
            postLogoutRedirectUri: 'http://localhost:8008'
        });
    }

    function mapWorkItem(res) {
        return {
            id: res.id,
            snId: res.fields['Custom.ServiceNowID'],
            title: res.fields['System.Title'],
            status: res.fields['System.BoardColumn'],
            description: res.fields['System.Description']
        };
    }

    function popVstsRequirementData(data) {
        return [
                {
                    "op": "add",
                    "path": "/fields/System.WorkItemType",
                    "value": "Incident"
                },
                {
                    "op": "add",
                    "path": "/fields/System.AreaPath",
                    "value": "AleloAuto"
                },
                {
                    "op": "add",
                    "path": "/fields/System.IterationPath",
                    "value": "AleloAuto"
                },
                {
                    "op": "add",
                    "path": "/fields/Custom.Criticality",
                    "value": data.criticality
                },
                {
                    "op": "add",
                    "path": "/fields/Custom.ServiceNowID",
                    "value": data.incident.number
                },
                {
                    "op": "add",
                    "path": "/fields/System.State",
                    "value": "Proposed"
                },
                {
                    "op": "add",
                    "path": "/fields/System.State",
                    "value": "Proposed"
                },
                {
                    "op": "add",
                    "path": "/fields/System.Title",
                    "value": data.incident.short_description
                },
                {
                    "op": "add",
                    "path": "/fields/System.Description",
                    "value": data.incident.description
                }
            ];
    }

}
