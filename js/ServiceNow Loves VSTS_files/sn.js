function SN() {
    
    var ajax = new Ajax(),
        currentSnIncident = false,
        auth = 'Basic '+btoa('rbtautodev'+':'+'alelo@123'), // Usuário e senha de acesso às APIs do SN
        assignmentGroup = '3886d7786fc11b80bdcbe4064b3ee4c8';

    this.getIncident = getIncident;
    this.getIncidentList = getIncidentList;
    this.getOpenIncidentList = getOpenIncidentList;
    this.updateIncident = updateIncident;

    return this;

    function getIncident(id, success, error) {
        var err = false;
        if (id != '') {
            ajax.get(
                'https://alelodev.service-now.com/api/now/table/incident?sysparm_query=number='+id,
                setHeader(),
                success,
                error
            );
            return;
        }
        err = {
            error: {
                message: 'Id inválido',
                detail: 'O id do incidente do ServiceNow não foi informado.'
            }
        };
        error(err);
    }

    function getIncidentList(limit, success, error) {
        if (limit == false || limit == null || limit < 1) limit = 1;
        ajax.get(
            'https://alelodev.service-now.com/api/now/table/incident?sysparm_limit='+limit,
            setHeader(),
            success,
            error
        );
    }

    function getOpenIncidentList(limit, success, error) {
        if (limit == false || limit == null || limit < 1) limit = 1;
        ajax.get(
            'https://alelodev.service-now.com/api/now/table/incident?sysparm_query=state%3D110%5EORDERBYDESCnumber%5Ecategory%3DAlelo%20Auto%5EORcategory%3DMobilidade%20e%20Frota&sysparm_limit='+limit,
            setHeader(),
            success,
            error
        );
    }

    function updateIncident(snSysId, data, success, error) {
        console.log('updateIncident');
        ajax.put(
            'https://alelodev.service-now.com/api/now/table/incident/'+snSysId,
            setHeader(),
            data,
            success,
            error
        );
    }

    function setHeader() {
        var header = [];
        header.push(['Accept', 'application/json']);
        header.push(['Content-Type', 'application/json']);
        header.push(['Access-Control-Allow-Origin', '*']);
        header.push(['Access-Control-Allow-Credentials', 'true']);
        header.push(['Authorization', auth]);
        return header;
    }

}
