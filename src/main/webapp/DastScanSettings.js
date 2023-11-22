const fodeRowSelector = '.fode-field-row, .fode-field-row-verr';
const fodApiScanTypeClassIdr = "dast-api-scan";
const dastManifestWorkflowMacroFileUpload = "WorkflowDrivenMacro";
const dastManifestLoginFileUpload = "LoginMacro";
const openApiFileType = 'OpenAPIDefinition';
const grpcFileType = 'GRPCDefinition';
const graphQlFileType = 'GraphQLDefinition';
const postmanFileType = 'PostmanCollection';
const allPolicyTypes = 'dast-standard-scan-policy';
const apiPolicyType = 'dast-api-scan-policy-apiType'
const dastScanTypes = [{"value": 'Standard', "text": 'Standard'}, {
    "value": 'Workflow-driven',
    "text": 'Workflow-driven'
},
    {"value": 'API', "text": 'API'}]
const dastScanSelectDefaultValues =
    {
        "WebSiteScan": {"ScanPolicy": "standard"},
        "WorkflowDrivenScan": {"ScanPolicy": "standard"},
        "ApiScan": {"ScanPolicy": "API Scan"}
    }

class DastScanSettings {

    constructor() {
        this.api = new Api(instance, descriptor);
        this.uiLoaded = false;
        this.releaseId = null;

        subscribeToEvent('releaseChanged', p => this.loadEntitlementSettings(p.detail));
    }

    showMessage(msg, isError) {
        let msgElem;

        if (isError) msgElem = jq('#fode-error'); else msgElem = jq('#fode-msg');

        msgElem.text(msg);
        msgElem.show();
    }

    scanTypeVisibility(isVisible) {
        if ((isVisible === undefined || null) || isVisible === false) {

            jq('.dast-scan-type').each((iterator, element) => {
                let currentElement = jq(element);
                let tr = closestRow(currentElement);
                tr.addClass('dast-scan-type');
            });
            let ddlScanType = jq('.dast-scan-type');
            ddlScanType.hide();
        } else {
            jq('.dast-scan-type').show();
        }
    }

    scanTypeUserControlVisibility(scanType, isVisible) {

        if ((isVisible !== undefined || null)) {
            this.commonScopeSettingVisibility(false);

            switch (scanType) {

                case "Standard": {
                    jq('#' + allPolicyTypes).show();
                    jq('#' + apiPolicyType).hide();
                    jq('.redundantPageDetection').show();
                    this.websiteScanSettingsVisibility(isVisible);
                    this.workflowScanSettingVisibility(false);
                    this.networkAuthSettingVisibility(true);
                    this.apiScanSettingVisibility(false);
                    this.commonScopeSettingVisibility(isVisible);
                    this.directoryAndSubdirectoriesScopeVisibility(isVisible);
                    this.loginMacroSettingsVisibility(isVisible);
                    this.setDefaultValuesForSelectBasedOnScanType(scanType, "dast-standard-scan-policy")
                    break;
                }
                case "API": {
                    jq('#' + allPolicyTypes).hide();
                    jq('#' + apiPolicyType).show();
                    jq('.redundantPageDetection').hide();
                    this.apiScanSettingVisibility(isVisible);
                    this.commonScopeSettingVisibility(isVisible);
                    this.networkAuthSettingVisibility(true);
                    this.loginMacroSettingsVisibility(false);
                    this.workflowScanSettingVisibility(false);
                    this.websiteScanSettingsVisibility(false);
                    this.directoryAndSubdirectoriesScopeVisibility(false);
                    break;
                }
                case "Workflow-driven":
                    jq('#' + allPolicyTypes).show();
                    jq('#' + apiPolicyType).hide();
                    jq('.redundantPageDetection').show();
                    this.workflowScanSettingVisibility(isVisible);
                    this.apiScanSettingVisibility(false);
                    this.websiteScanSettingsVisibility(false);
                    this.commonScopeSettingVisibility(isVisible);
                    this.loginMacroSettingsVisibility(false);
                    this.networkAuthSettingVisibility(isVisible);
                    this.directoryAndSubdirectoriesScopeVisibility(false);
                    this.setDefaultValuesForSelectBasedOnScanType(scanType, "dast-workflow-scan-policy")
                    break;
                default:
                    //hide all scan type settings.
                    this.websiteScanSettingsVisibility(false);
                    this.apiScanSettingVisibility(false);
                    this.apiScanSettingVisibility(false);
                    this.workflowScanSettingVisibility(false);
                    this.loginMacroSettingsVisibility(false);
                    this.networkAuthSettingVisibility(false);

                    break;
            }
        }
    }

    resetAuthSettings() {
        this.resetNetworkSettings();
        this.resetLoginMacroSettings();

    }

    resetLoginMacroSettings() {
        jq('#loginMacroId').val(undefined);
        jq('#webSiteLoginMacroEnabled').find('input:checkbox:first').trigger('click');
    }

    loginMacroSettingsVisibility(isVisible) {
        let loginMacroSetting = jq('.' + loginAuthSetting);
        if ((isVisible === undefined || null) || isVisible === false) {
            loginMacroSetting.hide();
        } else {
            loginMacroSetting.show();
        }
    }

    networkAuthSettingVisibility(isVisible) {
        let networkAuth = jq('.' + nwAuthSetting);
        if ((isVisible === undefined) || isVisible === false) {
            networkAuth.hide();
            //reset the value here so on changing the scan type the hidden n/w values don't retain the values.
            this.resetNetworkSettings();
        } else {
            networkAuth.show();
        }
    }

    websiteScanSettingsVisibility(isVisible) {

        let standardScanSettingRows = jq('.' + dastWebSiteSetting);
        if ((isVisible === undefined) || isVisible === false) {
            standardScanSettingRows.hide();
        } else {
            standardScanSettingRows.show();
        }
    }

    commonScopeSettingVisibility(isVisible) {
        let dastCommonScopeSetting = 'dast-common-scan-scope';
        let commonScopeRows = jq('.' + dastCommonScopeSetting);
        if ((isVisible === undefined) || isVisible === false) {
            commonScopeRows.hide();
        } else {
            commonScopeRows.show();
        }
    }


    setDefaultValuesForSelectBasedOnScanType(scanType, selectControl) {
        switch (scanType) {
            case "Standard":
                jq('#' + selectControl).val(dastScanSelectDefaultValues.WebSiteScan.ScanPolicy);
                break;
            case "Workflow-driven":
                jq('#' + selectControl).val(dastScanSelectDefaultValues.WorkflowDrivenScan.ScanPolicy);
                break;
        }

    }

    apiScanSettingVisibility(isVisible) {
        jq('.dast-api-scan').each((iterator, element) => {
            let currentElement = jq(element);
            let tr = closestRow(currentElement);
            tr.addClass(fodApiScanTypeClassIdr);
        });
        let apiScanSettingRows = jq('.dast-api-scan');
        if ((isVisible === undefined || null) || isVisible === false) {

            apiScanSettingRows.hide();
        } else {
            apiScanSettingRows.show();
        }
    }

    workflowScanSettingVisibility(isVisible) {
        let workflowScanSettingRows = jq('.' + dastWorkFlowSetting);
        if ((isVisible === undefined || null) || isVisible === false) {
            workflowScanSettingRows.hide();
        } else {
            workflowScanSettingRows.show();
        }
    }

    scanSettingsVisibility(isVisible) {
        if ((isVisible === undefined || null) || isVisible === false) {
            let scanSettingsRows = jq('.' + dastWebSiteSetting);
            scanSettingsRows.hide();
        } else {
            jq('.dast-scan-setting').show();
        }
    }

    hideMessages(msg) {
        jq('#fode-error').hide();
        jq('#fode-msg').hide();
    }

    populateAssessmentsDropdown() {
        let atsel = jq(`#ddAssessmentType`);

        atsel.find('option').remove();
        jq(`#entitlementSelectList`).find('option').remove();

        for (let k of Object.keys(this.assessments)) {
            let at = this.assessments[k];

            atsel.append(`<option value="${at.id}">${at.name}</option>`);
        }
    }

    async onAssessmentChanged(skipAuditPref) {
        let atval = jq('#ddAssessmentType').val();
        let entsel = jq('#entitlementSelectList');
        let at = this.assessments ? this.assessments[atval] : null;

        entsel.find('option,optgroup').remove();

        if (at) {

            let available = at.entitlementsSorted.filter(e => e.id > 0);
            let forPurchase = at.entitlementsSorted.filter(e => e.id <= 0);
            let availableGrp = forPurchase.length > 0 ? jq(`<optgroup label="Available Entitlements"></optgroup>`) : entsel;

            for (let e of available) {
                availableGrp.append(`<option value="${getEntitlementDropdownValue(e.id, e.frequencyId, e.frequency)}">${e.description}</option>`);
            }

            if (forPurchase.length > 0) {
                let grp = jq(`<optgroup label="Available For Purchase"></optgroup>`);

                entsel.append(availableGrp);
                entsel.append(grp);
                for (let e of forPurchase) {
                    grp.append(`<option value="${getEntitlementDropdownValue(0, e.frequencyId, e.frequency)}">${e.description}</option>`);
                }
            }
        }

        await this.onEntitlementChanged(skipAuditPref);
        // ToDo: set to unselected if selected value doesn't exist
    }

    async onEntitlementChanged(skipAuditPref) {

        let val = jq('#entitlementSelectList').val();
        let {entitlementId, frequencyId, frequencyType} = parseEntitlementDropdownValue(val);

        jq('#entitlementId').val(entitlementId);
        jq('#frequencyId').val(frequencyId);
        jq('#entitlementFreqType').val(frequencyType);
        jq('#purchaseEntitlementsForm input').prop('checked', (entitlementId <= 0));
        if (skipAuditPref !== true) await this.loadAuditPrefOptions(jq('#ddAssessmentType').val(), frequencyId);
    }

    async loadAuditPrefOptions(assessmentType, frequencyId) {
        let apSel = jq('#auditPreferenceSelectList');
        let curVal = apSel.val();
        let apCont = jq('#auditPreferenceForm');
        let setSpinner = apCont.hasClass('spinner') === false;

        if (setSpinner) apCont.addClass('spinner');
        apSel.find('option').remove();
        assessmentType = numberOrNull(assessmentType);
        frequencyId = numberOrNull(frequencyId);

        if (this.releaseId && assessmentType && frequencyId) {
            try {
                let prefs = await this.api.getAuditPreferences(this.releaseId, assessmentType, frequencyId, getAuthInfo());

                if (prefs.automated) apSel.append(_auditPrefOption.automated);
                if (prefs.manual) apSel.append(_auditPrefOption.manual);
            } catch (e) {
                apSel.hide();
                apCont.removeClass('spinner');
                jq('#auditPreferenceForm > div').append('<div class="fode-error">Fatal error loading tenant data, please refresh</div>');
                return;
            }
        }

        let optCnt = apSel.find('option').length;

        if (optCnt < 1) {
            apSel.append(_auditPrefOption.automated);
            apSel.prop('disabled', true);
        } else if (optCnt === 1) {
            // For some reason selection wouldn't work without setTimeout
            setTimeout(_ => {
                apSel.find('option').first().prop('selected', true);
                apSel.prop('disabled', true);
            }, 50);
        } else {
            // For some reason selection wouldn't work without setTimeout
            setTimeout(_ => {
                if (curVal) apSel.val(curVal); else apSel.find('option').first().prop('selected', true);
                apSel.prop('disabled', false);
            }, 50);
        }

        if (setSpinner) apCont.removeClass('spinner');
    }

    async loadEntitlementSettings(releaseChangedPayload) {

        if (!this.uiLoaded) {
            this.scanTypeVisibility(false);
            this.scanTypeUserControlVisibility("allTypes", false);
            this.apiTypeUserControlVisibility("allTypes", false);
            this.deferredLoadEntitlementSettings = _ => this.loadEntitlementSettings(releaseChangedPayload);
            return;
        } else this.deferredLoadEntitlementSettings = null;

        this.releaseId = null;
        let rows = jq(fodeRowSelector);
        rows.hide();
        this.hideMessages();

        if (releaseChangedPayload && releaseChangedPayload.mode === ReleaseSetMode.bsiToken) {
            this.isBsi = true;
            jq('.fode-row-bsi').show();
            jq('.fode-row-remediation').show();
            return;
        }
        let releaseId = releaseChangedPayload ? releaseChangedPayload.releaseId : null;
        let fields = jq('.fode-field.spinner-container');
        releaseId = numberOrNull(releaseId);
        if (releaseId > 0) {
            this.releaseId = releaseId;
            fields.addClass('spinner');
            rows.show();
            jq('.fode-row-bsi').hide();

            let ssp = this.api.getReleaseEntitlementSettings(releaseId, getAuthInfo(), true)
                .then(r => this.scanSettings = r).catch((err) => {
                        console.error("release settings api failed: " + err);
                        throw err;
                    }
                );

            let entp = this.api.getAssessmentTypeEntitlements(releaseId, getAuthInfo())
                .then(r => this.assessments = r)
                .catch((err) => {
                    console.error("entitlement api failed");
                    throw err;
                });
            //ToDo- read from constant instead of API
            let tzs = this.api.getTimeZoneStacks(getAuthInfo())
                .then(r => this.timeZones = r).catch(
                    (err) => {
                        console.error("timezone api failed: " + err)
                        throw err;
                    }
                );
            //ToDo- read from constant instead of API
            let networkAuthTypes = this.api.getNetworkAuthType(getAuthInfo()).then(
                r => this.networkAuthTypes = r
            ).catch((err) => {
                console.error(err);
                throw err;
            });

            await Promise.all([ssp, entp, tzs, networkAuthTypes])
                .then(async () => {

                    this.scanTypeUserControlVisibility('allTypes', false);

                    if (this.scanSettings && this.assessments) {
                        let assessmentId = this.scanSettings.assessmentTypeId;
                        let timeZoneId = this.scanSettings.timeZone;
                        this.populateAssessmentsDropdown();

                        jq('#ddAssessmentType').val(assessmentId);
                        await this.onAssessmentChanged(true);

                        jq('#entitlementFreqType').val(this.scanSettings.entitlementFrequencyType);

                        await this.onEntitlementChanged(false);
                        this.setSelectedEntitlementValue(entp);
                        jq('#timeZoneStackSelectList').val(timeZoneId);
                        this.onLoadTimeZone();
                        /*'set the scan type based on the scan setting get response'*/
                        this.setScanType();
                        this.onScanTypeChanged();
                        //Set scan policy from the response.
                        this.setScanPolicy();

                        this.setTimeBoxScan();

                        //Set the Website assessment scan type specific settings.

                        if (!Object.is(this.scanSettings.websiteAssessment, undefined)) {
                            jq('#dast-standard-site-url').find('input').val(this.scanSettings.websiteAssessment.dynamicSiteUrl);
                        }
                        this.setWorkflowDrivenScanSetting();

                        this.setApiScanSetting();
                        /*Set restrict scan value from response to UI */
                        this.setRestrictScan();

                        /*Set network settings from response. */
                        jq('#ddlNetworkAuthType').val(networkAuthTypes);
                        this.onNetworkAuthTypeLoad();
                        this.setNetworkSettings();
                        //Set the PatchUploadManifest File's fileId from get response.
                        this.setPatchUploadFileId();
                        //Enable scan Type right after assessment Type drop populated.
                        this.scanSettingsVisibility(true);
                        this.scanTypeVisibility(true);

                    } else {
                        await this.onAssessmentChanged(false);
                        this.showMessage('Failed to retrieve scan settings from API', true);
                        rows.hide();
                    }
                })
                .catch((reason) => {
                    console.error("error in scan settings: " + reason);
                })

        } else {
            await this.onAssessmentChanged(false);
            if (releaseChangedPayload.mode === ReleaseSetMode.releaseSelect) this.showMessage('Select a release'); else this.showMessage('Enter a release id');
        }

        fields.removeClass('spinner');
    }

    setWorkflowDrivenScanSetting() {
        //only single file upload is allowed from FOD. Todo Iterate the array
        if (!Object.is(this.scanSettings.workflowdrivenAssessment, undefined)) {
            if (!Object.is(this.scanSettings.workflowdrivenAssessment.workflowDrivenMacro, undefined)) {
                jq('#listWorkflowDrivenAllowedHostUrl').empty();
                jq('#workflowMacroId').val(this.scanSettings.workflowdrivenAssessment.workflowDrivenMacro[0].fileId);

                this.scanSettings.workflowdrivenAssessment.workflowDrivenMacro[0].allowedHosts.forEach((item, index, arr) => {
                        console.log(item);
                        let ident = arr[index];
                        jq('#listWorkflowDrivenAllowedHostUrl').append("<li>" + "<input type='checkbox' id=' " + ident + " ' name='" + ident + "'>" + arr[index] + "</li>")
                    }
                )

            }

        }

    }

    setApiScanSetting() {

        if (!Object.is(this.scanSettings.apiAssessment, undefined)) {
            if (!Object.is(this.scanSettings.apiAssessment.openAPI, undefined)) {
                this.setOpenApiSettings(this.scanSettings.apiAssessment.openAPI);
            }
            else if(!Object.is(this.scanSettings.apiAssessment.graphQL, undefined)) {
                this.setGraphQlSettings(this.scanSettings.apiAssessment.graphQL);
            }
            else if(!Object.is(this.scanSettings.apiAssessment.gRPC, undefined)) {
                this.setGrpcSettings(this.scanSettings.apiAssessment.gRPC);
            }
            else if(!Object.is(this.scanSettings.apiAssessment.postman, undefined)) {
                this.setPostmanSettings(this.scanSettings.apiAssessment.postman);
            }

        }
    }
    setOpenApiSettings(openApiSettings){

        jq('#apiTypeList').val('openApi');
        var inputId = openApiSettings.sourceType == 'Url' ? 'openApiInputUrl' : 'openApiInputFile';
        this.onApiTypeChanged();
        jq('#' + inputId).trigger('click');
        jq('#dast-openApi-api-key input').val(openApiSettings.apiKey);
        if(openApiSettings.sourceType == 'Url'){
            jq('#dast-openApi-url input').val(openApiSettings.sourceUrn);
        }
        else{
            //ToDo : Write code for showing file name
        }
    }
    setGraphQlSettings(graphQlSettings){
        jq('#apiTypeList').val('graphQl');
        var inputId = graphQlSettings.sourceType == 'Url' ? 'graphQlInputUrl' : 'graphQlInputFile';
        this.onApiTypeChanged();
        jq('#' + inputId).trigger('click');
        jq('#dast-graphQL-api-host input').val(graphQlSettings.host);
        jq('#dast-graphQL-api-servicePath input').val(graphQlSettings.servicePath);
        jq('#dast-graphQL-schemeType input').val(graphQlSettings.schemeType);
        if(graphQlSettings.sourceType == 'Url'){
            jq('#dast-graphQL-url input').val(graphQlSettings.sourceUrn);
        }
        else{
            //ToDo : Write code for showing file name
        }
    }
    setGrpcSettings(grpcSettings){
        jq('#apiTypeList').val('grpc');
        jq('#dast-grpc-api-host input').val(graphQlSettings.host);
        jq('#dast-grpc-api-servicePath input').val(graphQlSettings.servicePath);
        jq('#dast-grpc-schemeType input').val(graphQlSettings.schemeType);
    }
    setPostmanSettings(postmanSettings){
        jq('#apiTypeList').val('postman');
    }
    setSelectedEntitlementValue(entitlements) {

        let currValSelected = false;
        let curVal = getEntitlementDropdownValue(this.scanSettings.entitlementId, this.scanSettings.entitlementFrequencyType);
        let entitlement = jq('#entitlementSelectList');
        for (let ts of Object.keys(entitlements)) {
            let at = this.entp[ts];
            if (curVal !== undefined && at.value !== undefined && curVal.toLowerCase() === at.value.toLowerCase()) {
                currValSelected = true;
                entitlement.append(`<option value="${at.text}" selected>${at.text}</option>`);
                jq('#entitlementId').val(at.text);
            } else {
                entitlement.append(`<option value="${at.text}">${at.text}</option>`);
            }
        }
    }

    setPatchUploadFileId() {

        if (!Object.is(this.scanSettings.loginMacroFileId, null) &&
            this.scanSettings.loginMacroFileId !== undefined && this.scanSettings.loginMacroFileId > 0) {
            jq('#loginMacroId').val(this.scanSettings.loginMacroFileId);
        }
        if (!Object.is(this.scanSettings.workflowdrivenAssessment, null)
            && this.scanSettings.workflowdrivenAssessment !== undefined) {

            if (this.scanSettings.workflowdrivenAssessment.workflowDrivenMacro.fileId > 0)
                jq('#workflowMacroId').val(this.scanSettings.workflowdrivenAssessment.workflowDrivenMacro.fileId);
        }
    }

    setNetworkSettings() {

        if (!Object.is(this.scanSettings.networkAuthenticationSettings, null)
            && !Object.is(this.scanSettings.networkAuthenticationSettings, undefined)) {
            jq('#networkUsernameRow').find('input').val(this.scanSettings.networkAuthenticationSettings.userName);
            jq('#networkPasswordRow').find('input').val(this.scanSettings.networkAuthenticationSettings.password);
            jq('#webSiteNetworkAuthSettingEnabledRow').find('input:checkbox:first').trigger('click');
            let np = jq('#networkPasswordRow').find('input');
            np.attr('type', 'password');
        }
    }

    resetNetworkSettings() {

        jq('#networkUsernameRow').find('input').val(undefined);
        jq('#networkPasswordRow').find('input').val(undefined);
        jq('#ddlNetworkAuthType').prop('selectedIndex', 0);
        jq('#webSiteNetworkAuthSettingEnabledRow').find('input:checkbox:first').trigger('click');
    }

    setScanType() {
        if (this.scanSettings !== undefined && this.scanSettings !== null) {
            let selectedScanType;
            if (this.scanSettings.websiteAssessment !== null && this.scanSettings.websiteAssessment !== undefined) {
                selectedScanType = dastScanTypes.find(v => v.value === "Standard");
            } else if (this.scanSettings.workflowdrivenAssessment !== null && this.scanSettings.workflowdrivenAssessment !== undefined) {
                selectedScanType = dastScanTypes.find(v => v.value === "Workflow-driven")
            }else if(this.scanSettings.apiAssessment !== null && this.scanSettings.apiAssessment !== undefined){
                selectedScanType = dastScanTypes.find(v => v.value === "API")
            }
            // Check for API Type

            //Set other scan type values in the dropdown.
            let scanSel = jq('#scanTypeList');
            let currValSelected = false;
            scanSel.find('option').not(':first').remove();
            scanSel.find('option').first().prop('selected', true);

            for (let s of Object.keys(dastScanTypes)) {
                let at = dastScanTypes[s];
                if (selectedScanType !== undefined
                    && at.text !== undefined && (selectedScanType.value.toLowerCase() === at.text.toLowerCase())) {
                    currValSelected = true;
                    scanSel.append(`<option value="${at.value}" selected>${at.text}</option>`);
                } else {
                    scanSel.append(`<option value="${at.value}">${at.text}</option>`);
                }
            }
        }

    }


    onLoadTimeZone() {

        let tsSel = jq('#timeZoneStackSelectList');
        let currVal = this.scanSettings.timeZone;
        let currValSelected = false;
        tsSel.find('option').not(':first').remove();
        tsSel.find('option').first().prop('selected', true);
        for (let ts of Object.keys(this.timeZones)) {
            let at = this.timeZones[ts];
            if (currVal !== undefined && at.value !== undefined && currVal.toLowerCase() === at.value.toLowerCase()) {
                currValSelected = true;
                tsSel.append(`<option value="${at.value}" selected>${at.text}</option>`);
            } else {
                tsSel.append(`<option value="${at.value}">${at.text}</option>`);
            }
        }
    }

    onNetworkAuthTypeLoad() {
        let networkAuthTypeSel = jq('#ddlNetworkAuthType');
        let currVal;
        if (this.scanSettings.networkAuthenticationSettings !== undefined &&
            this.scanSettings.networkAuthenticationSettings.networkAuthenticationType !== null) {
            currVal = this.scanSettings.networkAuthenticationSettings.networkAuthenticationType;
        }

        let currValSelected = false;
        networkAuthTypeSel.find('option').not(':first').remove();
        networkAuthTypeSel.find('option').first().prop('selected', true);

        for (let ts of Object.keys(this.networkAuthTypes)) {
            let at = this.networkAuthTypes[ts];
            if (currVal !== undefined && at.value !== undefined && currVal.toLowerCase() === at.value.toLowerCase()) {
                currValSelected = true;
                networkAuthTypeSel.append(`<option value="${at.text}" selected>${at.text}</option>`);
            } else {
                networkAuthTypeSel.append(`<option value="${at.text}">${at.text}</option>`);
            }
        }
    }

    onScanTypeChanged() {

        this.resetAuthSettings();
        jq('#apiTypeList').prop('selectedIndex',0);
        let selectedScanTypeValue = jq('#scanTypeList').val();

        if (selectedScanTypeValue === null || undefined) {
            //Reset All ScanTypes Controls
            this.scanTypeUserControlVisibility('allTypes', false);
        } else {

            this.scanTypeUserControlVisibility(selectedScanTypeValue, true);
        }
    }

    setRestrictScan() {
        if (this.scanSettings !== null && this.scanSettings.restrictToDirectoryAndSubdirectories !== null) {
            {
                jq('#restrictScan').prop('checked', this.scanSettings.restrictToDirectoryAndSubdirectories);
            }
        }
    }


    setScanPolicy() {

        if (this.scanSettings !== undefined && this.scanSettings.policy !== null || undefined) {
            let selectedScanPolicyType = this.scanSettings.policy;
            let ScanPolicy = ["Standard", "Critical and high", "Passive", "API Scan"]
            let scanPolicySel = jq('#dast-standard-scan-policy').find('select');
            let currValSelected = false;
            scanPolicySel.find('option').not(':first').remove();
            scanPolicySel.find('option').first().prop('selected', true);

            for (let p of ScanPolicy) {

                if (selectedScanPolicyType !== undefined && selectedScanPolicyType.toLowerCase() === p.toLowerCase()) {
                    currValSelected = true;
                    scanPolicySel.append(`<option value="${p}" selected>${p}</option>`);
                } else {
                    scanPolicySel.append(`<option value="${p}">${p}</option>`);
                }
            }
        }
    }

    setTimeBoxScan()
    {
        if(this.scanSettings.timeBoxInHours!==undefined)
        {
            jq('#scanTimeBox').val(this.scanSettings.timeBoxInHours);
            jq('#timeBoxChecked').find('input:checkbox:first').trigger('click');
        }
    }

    onLoginMacroFileUpload() {
        jq('#webSiteLoginMacro').val(true);
        let loginMacroFile = document.getElementById('loginFileMacro').files[0];
        this.api.patchSetupManifestFile(this.releaseId, getAuthInfo(), loginMacroFile, dastManifestLoginFileUpload).then(res => {

                console.log("File upload success " + res);
                let response = res;
                jq('#loginMacroId').val(res)
            }
        ).catch((err) => {
                console.log(err);
            }
        );
    }

    onWorkflowMacroFileUpload() {

        let workFlowMacroFile = document.getElementById('workflowMacroFile').files[0];

        this.api.patchSetupManifestFile(this.releaseId, getAuthInfo(), workFlowMacroFile, dastManifestWorkflowMacroFileUpload).then(res => {

                //Todo: - check
                console.log("File upload success " + res);
                if (res.fileId > 0) {
                    jq('#workflowMacroId').val(res.fileId)
                } else {
                    throw new Exception("Illegal argument exception,FileId not valid");
                }
                if (!Object.is(res.hosts, undefined) && !Object.is(res.hosts, null)) {
                    let hosts = undefined;
                    res.hosts.forEach(hostIterator);

                    function hostIterator(item, index, arr) {
                        if (arr !== undefined) {
                            if (hosts !== undefined)
                                hosts = hosts + "," + arr[index];
                            else
                                hosts = arr[index];
                        }
                    }

                    jq('#workflowMacroHosts').val(hosts);
                    jq('#listWorkflowDrivenAllowedHostUrl').empty();

                    //set the allowed hosts  html list value
                    if (hosts !== undefined) {
                        let host = hosts.split(',');
                        host.forEach((item) => {
                            jq('#listWorkflowDrivenAllowedHostUrl').append("<li>" + "<input type='checkbox'>" + item + "</li>")
                        })
                    }
                } else
                    throw Error("Invalid hosts info");
            }
        ).catch((err) => {
                console.log('err' + err);
            }
        );
    }
    onFileUpload(event) {

        jq('.uploadMessage').text('');
        let file = null;
        let fileType = null;
        let elem = null;
        let displayMessage = null;

        switch(event.target.id){
            case 'btnUploadOpenApiFile' :
                file = document.getElementById('openApiFile').files[0];
                fileType = openApiFileType;
                elem = jq('#openApiFileId');
                displayMessage = jq('#openApiUploadMessage');
                break;

            case 'btnUploadPostmanFile' :
                file = document.getElementById('postmanFile').files[0];
                fileType = postmanFileType;
                elem = jq('#postmanFileId');
                displayMessage = jq('#postmanUploadMessage');
                break;

            case 'btnUploadgraphQLFile' :
                file = document.getElementById('graphQLFile').files[0];
                fileType = graphQlFileType;
                elem = jq('#graphQLFileId');
                displayMessage = jq('#grapgQlUploadMessage');
                break

            case 'btnUploadgrpcFile' :
                file = document.getElementById('grpcFile').files[0];
                fileType = grpcFileType;
                elem = jq('#grpcFileId');
                displayMessage = jq('#grpcUploadMessage');
                break;
            default :
                throw new Exception("Illegal argument exception,File Type not valid");
        }

        if(file == null || fileType == null || elem == null){
            throw new Exception("Illegal argument exception,File Type not valid");
        }

        this.api.patchSetupManifestFile(this.releaseId, getAuthInfo(), file, fileType).then(res => {

                //Todo: - check
                console.log("File upload success " + res);
                if (res.fileId > 0) {
                    elem.val(res.fileId);
                    displayMessage.text('Uploaded Successfully !!');
                } else {
                    displayMessage.text('Upload Failed !!');
                    throw new Exception("Illegal argument exception,FileId not valid");
                }
            }
        ).catch((err) => {
                displayMessage.text('Upload Failed !!');
                console.log('err' + err);
            }
        );
    }

    directoryAndSubdirectoriesScopeVisibility(isVisible) {
        if (isVisible)
            jq('#dast-standard-scan-scope').show();
        else
            jq('#dast-standard-scan-scope').hide();
    }

    onWorkflowDrivenHostChecked(event) {

        let allowedHost = jq('#workflowMacroHosts').val();
        if (event.target.checked) {
            let hostToAdd = event.target.name; //name point to the host returned from FOD Patch API

            if (allowedHost !== undefined || null) {
                if (allowedHost.length > 0) {
                    allowedHost = allowedHost + "," + hostToAdd;
                } else
                    allowedHost = hostToAdd;
                jq('#workflowMacroHosts').val(allowedHost);
            }
        } else {
            if (allowedHost !== undefined || null) {
                let hosts = allowedHost.split(',');
                hosts.forEach((entry) => {
                    if (entry === event.target.name) {
                        let index = hosts.lastIndexOf(entry);
                        //remove
                        if (index > -1) {
                            hosts.splice(index, 1);
                        }
                    }
                });
                jq('#workflowMacroHosts').val(hosts.flat());
            }
        }
    }

    onApiTypeChanged() {

        jq('.uploadMessage').text('');
        this.onSourceChange('none');
        let selectedApiTypeValue = jq('#apiTypeList').val();

        if (selectedApiTypeValue === null || undefined) {
            //Reset All ScanTypes Controls
            this.apiTypeUserControlVisibility(null, false);
            jq('.' + dastApiSecificControlls).show();
        } else {

            this.apiTypeUserControlVisibility(null, false);
            this.apiTypeUserControlVisibility(selectedApiTypeValue, true);
            jq('.' + dastApiSecificControlls).show();
        }
    }

    onSourceChange(id){

        jq('.openApiSourceControls').hide();
        jq('.graphQLSourceControls').hide();
        jq('.apiOptions').show();
        jq('.sourceTypeFileds').hide();
        jq('.uploadMessage').text('');

        if(id == 'openApiInputFile'){
            jq('.openApiSourceControls').show()
            jq('#dast-api-openApi-upload').show();
            jq('#openApiRadioSource').val(jq('#' + event.target.id).val());
        }
        else if(id == 'openApiInputUrl'){
            jq('.openApiSourceControls').show()
            jq('#dast-openApi-url').show();
            jq('#openApiRadioSource').val(jq('#' + event.target.id).val());
        }
        else if(id == 'graphQlInputFile'){
            jq('.graphQLSourceControls').show();
            jq('#dast-api-graphQL-upload').show();
            jq('#graphQlRadioSource').val(jq('#' + event.target.id).val());
        }
        else if(id == 'graphQlInputUrl'){
            jq('.graphQLSourceControls').show();
            jq('#dast-graphQL-url').show();
            jq('#graphQlRadioSource').val(jq('#' + event.target.id).val());
        }
        else{
            jq('.sourceOptions').prop('checked', false);
        }
    }

    apiTypeUserControlVisibility(apiType, isVisible) {

        if ((isVisible !== undefined || null)) {
            this.openApiScanVisibility(false);
            this.grpcScanVisibility(false);
            this.graphQlScanVisibility(false);
            this.postmanScanVisibility(false);
            switch (apiType) {
                case "openApi":
                    this.openApiScanVisibility(isVisible);
                    break;

                case "graphQl":
                    this.graphQlScanVisibility(isVisible);
                    break;

                case "grpc":
                    this.grpcScanVisibility(isVisible);
                    break;

                case "postman":
                    this.postmanScanVisibility(isVisible);
                    break;

                default:
                    this.openApiScanVisibility(false);
                    this.grpcScanVisibility(false);
                    this.graphQlScanVisibility(false);
                    this.postmanScanVisibility(false);
                    break;

            }
        }
    }
    openApiScanVisibility(isVisible) {
        if (isVisible)
            jq('#dast-openApi').closest('.tr').show();
        else
            jq('#dast-openApi').closest('.tr').hide();

        jq('#dast-postman').closest('.tr').hide();
        jq('#dast-graphQL').closest('.tr').hide();
        jq('#dast-grpc').closest('.tr').hide();
    }

    graphQlScanVisibility(isVisible) {
        if (isVisible)
            jq('#dast-graphQL').closest('.tr').show();
        else
            jq('#dast-graphQL').closest('.tr').hide();

        jq('#dast-openApi').closest('.tr').hide()
        jq('#dast-postman').closest('.tr').hide();
        jq('#dast-grpc').closest('.tr').hide();
    }

    grpcScanVisibility(isVisible) {
        if (isVisible)
            jq('#dast-grpc').closest('.tr').show();
        else
            jq('#dast-grpc').closest('.tr').hide();
        jq('#dast-openApi').closest('.tr').hide()
        jq('#dast-postman').closest('.tr').hide();
        jq('#dast-graphQL').closest('.tr').hide();
    }

    postmanScanVisibility(isVisible) {
        if (isVisible)
            jq('#dast-postman').closest('.tr').show();
        else
            jq('#dast-postman').closest('.tr').hide();
        jq('#dast-openApi').closest('.tr').hide()
        jq('#dast-graphQL').closest('.tr').hide();
        jq('#dast-grpc').closest('.tr').hide();
    }

    apiScanSettingVisibility(isVisible) {

        let apiScanSettingRows = jq('.'+ dastApiSetting);
        jq('.' + dastApiSecificControlls).hide();
        if ((isVisible === undefined || null) || isVisible === false) {
            apiScanSettingRows.hide();

        } else {
            apiScanSettingRows.show();
        }
    }

    onExcludeUrlBtnClick(event, args) {
        //  alert(jq('#standardScanExcludedUrlText').val())
        let excludedUrl = jq('#standardScanExcludedUrlText').val();
        //Add to exclude list
        // jq('#listStandardScanTypeExcludedUrl');
        // jq('#listStandardScanTypeExcludedUrl').append("<li>" +  excludedUrl + "</li>");
        // jq('#listStandardScanTypeExcludedUrl').show();
    }

    preinit() {

        jq('.fode-field')
            .each((i, e) => {
                let jqe = jq(e);
                let tr = closestRow(jqe);

                tr.addClass('fode-field-row');
                let vtr = getValidationErrRow(tr);

                if (vtr) vtr.addClass('fode-field-row-verr');
            });
        jq('.fode-row-hidden')
            .each((i, e) => {
                let jqe = jq(e);
                let tr = closestRow(jqe);

                tr.hide();
                let vtr = getValidationErrRow(tr);

                if (vtr) vtr.hide();
            });

        jq(fodeRowSelector).hide();

        // Move css classes prefixed with fode-row to the row element
        jq('.fode-field')
            .each((i, e) => {
                let jqe = jq(e);
                let classes = jqe.attr('class').split(' ');

                for (let c of classes) {
                    if (c.startsWith('fode-row-')) {
                        jqe.removeClass(c);
                        let tr = jqe.closest('.fode-field-row');

                        tr.addClass(c)

                    }
                }
            });
        this.init();
    }

    async init() {
        try {

        } catch (err) {
            // if (this.api.isAuthError(err)) {
            if (!this.unsubInit) {
                this.unsubInit = () => this.init();
                subscribeToEvent('authInfoChanged', this.unsubInit);
            }
            return;
        }

        this.hideMessages();
        this.showMessage('Select a release');

        if (this.unsubInit) unsubscribeEvent('authInfoChanged', this.unsubInit);

        jq('#ddAssessmentType')
            .change(_ => this.onAssessmentChanged());
        jq('#entitlementSelectList')
            .change(_ => this.onEntitlementChanged());

        jq('#scanTypeList').change(_ => this.onScanTypeChanged());

        jq('#btnAddExcludeUrl').click(_ => this.onExcludeUrlBtnClick());

        jq('#btnUploadLoginMacroFile').click(_ => this.onLoginMacroFileUpload());

        jq('#btnUploadWorkflowMacroFile').click(_ => this.onWorkflowMacroFileUpload());
   
        jq('#listWorkflowDrivenAllowedHostUrl').click(_ => this.onWorkflowDrivenHostChecked(event));

        jq('#apiTypeList').change(_ => this.onApiTypeChanged());

        jq('#openApiInputFile, #openApiInputUrl, #graphQlInputFile, #graphQlInputUrl').change(_=>this.onSourceChange(event.target.id));

        jq('#btnUploadPostmanFile, #btnUploadOpenApiFile, #btnUploadgraphQLFile').click(_ => this.onFileUpload(event));

        jq('.fode-row-screc').hide();
        this.uiLoaded = true;

        if (this.deferredLoadEntitlementSettings) {
            this.deferredLoadEntitlementSettings();
            this.deferredLoadEntitlementSettings = null;
        }
    }


}

const scanSettings = new DastScanSettings();

spinAndWait(() => jq('#selectedRelease').text() !== undefined && jq('#selectedRelease').text() !== '')
    .then(scanSettings.preinit.bind(scanSettings));
spinAndWait(() => jq('#releaseTypeSelectList').val() !== undefined).then(scanSettings.scanSettingsVisibility.bind(scanSettings));
