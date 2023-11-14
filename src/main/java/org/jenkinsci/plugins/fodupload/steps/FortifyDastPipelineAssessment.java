package org.jenkinsci.plugins.fodupload.steps;

import com.google.common.collect.ImmutableSet;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import hudson.Extension;
import hudson.FilePath;
import hudson.Launcher;
import hudson.model.*;
import hudson.util.FormValidation;
import hudson.util.ListBoxModel;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileUploadException;
import org.jenkinsci.plugins.fodupload.ApiConnectionFactory;
import org.jenkinsci.plugins.fodupload.DastScanSharedBuildStep;
import org.jenkinsci.plugins.fodupload.FodApi.FodApiConnection;
import org.jenkinsci.plugins.fodupload.SharedUploadBuildStep;
import org.jenkinsci.plugins.fodupload.Utils;
import org.jenkinsci.plugins.fodupload.actions.CrossBuildAction;
import org.jenkinsci.plugins.fodupload.controllers.*;
import org.jenkinsci.plugins.fodupload.models.AuthenticationModel;
import org.jenkinsci.plugins.fodupload.models.response.AssessmentTypeEntitlementsForAutoProv;
import org.jenkinsci.plugins.fodupload.models.response.GetStaticScanSetupResponse;
import org.jenkinsci.plugins.fodupload.models.response.PatchDastFileUploadResponse;
import org.jenkinsci.plugins.workflow.steps.StepContext;
import org.jenkinsci.plugins.workflow.steps.StepDescriptor;
import org.jenkinsci.plugins.workflow.steps.StepExecution;
import org.jenkinsci.plugins.workflow.steps.SynchronousNonBlockingStepExecution;
import org.kohsuke.stapler.AncestorInPath;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.bind.JavaScriptMethod;
import org.kohsuke.stapler.verb.POST;

import javax.annotation.Nullable;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static org.jenkinsci.plugins.fodupload.models.FodEnums.APILookupItemTypes;

@SuppressFBWarnings("unused")
public class FortifyDastPipelineAssessment extends FortifyStep {
    private static final ThreadLocal<TaskListener> taskListener = new ThreadLocal<>();
    private final String correlationId = UUID.randomUUID().toString();
    private String releaseId;
    @Deprecated
    private Boolean overrideGlobalConfig;
    private String username;
    private String personalAccessToken;
    private String tenantId;
    private String webSiteUrl;
    private boolean purchaseEntitlements;
    private String entitlementId;
    private String entitlementFrequency;
    private String remediationScanPreferenceType;
    private String inProgressScanActionType;
    private String inProgressBuildResultType;
    private String assessmentType;
    private String auditPreference;
    private String applicationName;
    private String applicationType;
    private String workflowMacroHost;
    private String releaseName;
    private Integer owner;
    private String attributes;
    private String businessCriticality;
    private String sdlcStatus;
    private boolean enableRedundantPageDetection;

    public String getScanTimeBox() {
        return scanTimeBox;
    }

    @DataBoundSetter
    public void setScanTimeBox(String scanTimeBox) {
        this.scanTimeBox = scanTimeBox;
    }

    private String scanTimeBox;
    private boolean requireLoginMacro;
    private String loginMacroFilePath;

    public String getWorkflowMacroFilePath() {
        return workflowMacroFilePath;
    }

    @DataBoundSetter
    public void setWorkflowMacroFilePath(String workflowMacroFilePath) {
        this.workflowMacroFilePath = workflowMacroFilePath;
    }

    private String workflowMacroFilePath;

    public String getLoginMacroFilePath() {
        return loginMacroFilePath;
    }

    @DataBoundSetter
    public void setLoginMacroFilePath(String loginMacroFilePath) {
        this.loginMacroFilePath = loginMacroFilePath;
    }

    public boolean isWorkflowMacroRequired() {
        return workflowMacroRequired;
    }

    public void setWorkflowMacroRequired(boolean workflowMacroRequired) {
        this.workflowMacroRequired = workflowMacroRequired;
    }

    private boolean workflowMacroRequired;

    public boolean isRequireLoginMacro() {
        return requireLoginMacro;
    }

    public void setRequireLoginMacro(boolean requireLoginMacro) {
        this.requireLoginMacro = requireLoginMacro;
    }


    public String getWebSiteNetworkAuthUserName() {
        return webSiteNetworkAuthUserName;
    }

    @DataBoundSetter
    public void setWebSiteNetworkAuthUserName(String webSiteNetworkAuthUserName) {
        this.webSiteNetworkAuthUserName = webSiteNetworkAuthUserName;
    }

    private String webSiteNetworkAuthUserName;

    public String getSelectedNetworkAuthType() {
        return selectedNetworkAuthType;
    }

    @DataBoundSetter
    public void setSelectedNetworkAuthType(String selectedNetworkAuthType) {
        this.selectedNetworkAuthType = selectedNetworkAuthType;
    }

    private String selectedNetworkAuthType;

    public boolean isTimeBoxChecked() {
        return timeBoxChecked;
    }

    @DataBoundSetter
    public void setTimeBoxChecked(boolean timeBoxChecked) {
        this.timeBoxChecked = timeBoxChecked;
    }

    private boolean timeBoxChecked;

    public String getAssessmentTypeId() {
        return assessmentTypeId;
    }

    @DataBoundSetter
    public void setAssessmentTypeId(String assessmentTypeId) {
        this.assessmentTypeId = assessmentTypeId;
    }

    private String assessmentTypeId;

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    private String applicationId;

    public String getWebSiteNetworkAuthPassword() {
        return webSiteNetworkAuthPassword;
    }

    @DataBoundSetter
    public void setWebSiteNetworkAuthPassword(String webSiteNetworkAuthPassword) {
        this.webSiteNetworkAuthPassword = webSiteNetworkAuthPassword;
    }

    private String webSiteNetworkAuthPassword;

    public String getAllowedHost() {
        return allowedHost;
    }

    @DataBoundSetter
    public void setAllowedHost(String allowedHost) {
        this.allowedHost = allowedHost;
    }

    private String allowedHost;

    public int getLoginMacroId() {
        ;
        return loginMacroId;
    }

    @DataBoundSetter
    public void setLoginMacroId(int loginMacroId) {
        this.loginMacroId = loginMacroId;
    }

    private int loginMacroId;
    private DastScanSharedBuildStep dastScanSharedBuildStep;

    @DataBoundConstructor
    public FortifyDastPipelineAssessment() {
        super();
    }

    public String getScanType() {
        return scanType;
    }

    @DataBoundSetter
    public void setScanType(String scanType) {
        this.scanType = scanType;
    }

    public boolean getScanScope() {
        return scanScope;
    }

    @DataBoundSetter
    public void setScanScope(boolean scanScope) {
        this.scanScope = scanScope;
    }

    private boolean scanScope;
    private String scanType;

    public String getWebSiteUrl() {
        return webSiteUrl;
    }


    @DataBoundSetter
    public void setWebSiteUrl(String webSiteUrl) {
        this.webSiteUrl = webSiteUrl;
    }


    public String getEntitlementFrequency() {
        return entitlementFrequency;
    }

    @DataBoundSetter
    public void setEntitlementFrequency(String entitlementFrequency) {
        this.entitlementFrequency = entitlementFrequency;
    }

    public String getWorkflowMacroHost() {
        return workflowMacroHost;
    }

    @DataBoundSetter
    public void setWorkflowMacroHost(@Nullable String workflowMacroHost) {
        this.workflowMacroHost = workflowMacroHost;
    }


    public String getWorkflowMacroId() {
        return workflowMacroId;
    }

    @DataBoundSetter
    public void setWorkflowMacroId(String workflowMacroId) {
        this.workflowMacroId = workflowMacroId;
    }

    private String workflowMacroId;

    public String getSelectedDynamicTimeZone() {
        return selectedDynamicTimeZone;
    }

    @DataBoundSetter
    public void setSelectedDynamicTimeZone(String selectedDynamicTimeZone) {
        this.selectedDynamicTimeZone = selectedDynamicTimeZone;
    }

    private String selectedDynamicTimeZone;

    public String getDastEnv() {
        return dastEnv;
    }

    @DataBoundSetter
    public void setDastEnv(String dastEnv) {
        this.dastEnv = dastEnv;
    }

    private String dastEnv;

    public boolean isEnableRedundantPageDetection() {
        return enableRedundantPageDetection;
    }

    @DataBoundSetter
    public void setEnableRedundantPageDetection(boolean enableRedundantPageDetection) {
        this.enableRedundantPageDetection = enableRedundantPageDetection;
    }

    public String getScanPolicy() {
        return scanPolicy;
    }

    @DataBoundSetter
    public void setScanPolicy(String scanPolicy) {
        this.scanPolicy = scanPolicy;
    }

    private String scanPolicy;



    public String getReleaseId() {
        return releaseId;
    }

    @DataBoundSetter
    public void setReleaseId(String releaseId) {
        this.releaseId = releaseId.trim();
    }

    @Deprecated
    public Boolean getOverrideGlobalConfig() {
        return overrideGlobalConfig;
    }

    @Deprecated
    @DataBoundSetter
    public void setOverrideGlobalConfig(Boolean overrideGlobalConfig) {
        this.overrideGlobalConfig = overrideGlobalConfig;
    }

    public String getUsername() {
        return username;
    }

    @DataBoundSetter
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPersonalAccessToken() {
        return personalAccessToken;
    }

    @DataBoundSetter
    public void setPersonalAccessToken(String personalAccessToken) {
        this.personalAccessToken = personalAccessToken;
    }

    public String getTenantId() {
        return tenantId;
    }

    @DataBoundSetter
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public boolean getPurchaseEntitlements() {
        return purchaseEntitlements;
    }

    @DataBoundSetter
    public void setPurchaseEntitlements(boolean purchaseEntitlements) {
        this.purchaseEntitlements = purchaseEntitlements;
    }

    public String getEntitlementId() {
        return entitlementId;
    }

    @DataBoundSetter
    public void setEntitlementId(String entitlementId) {
        this.entitlementId = entitlementId;
    }

//    public String getSrcLocation() {
//        return srcLocation;
//    }
//
//    @DataBoundSetter
//    public void setSrcLocation(String srcLocation) {
//        this.srcLocation = srcLocation != null ? srcLocation.trim() : "";
//    }

    public String getRemediationScanPreferenceType() {
        return remediationScanPreferenceType;
    }

    @DataBoundSetter
    public void setRemediationScanPreferenceType(String remediationScanPreferenceType) {
        this.remediationScanPreferenceType = remediationScanPreferenceType;
    }

    public String getInProgressScanActionType() {
        return inProgressScanActionType;
    }

    @DataBoundSetter
    public void setInProgressScanActionType(String inProgressScanActionType) {
        this.inProgressScanActionType = inProgressScanActionType;
    }

    public String getInProgressBuildResultType() {
        return inProgressBuildResultType;
    }

    @DataBoundSetter
    public void setInProgressBuildResultType(String inProgressBuildResultType) {
        this.inProgressBuildResultType = inProgressBuildResultType;
    }

    @SuppressWarnings("unused")
    public String getApplicationName() {
        return applicationName;
    }

    @DataBoundSetter
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    @SuppressWarnings("unused")
    public String getApplicationType() {
        return applicationType;
    }

    @DataBoundSetter
    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }

    @SuppressWarnings("unused")
    public String getReleaseName() {
        return releaseName;
    }

    @DataBoundSetter
    public void setReleaseName(String releaseName) {
        this.releaseName = releaseName;
    }

    @SuppressWarnings("unused")
    public Integer getOwner() {
        return owner;
    }

    @DataBoundSetter
    public void setOwner(Integer owner) {
        this.owner = owner;
    }

    @SuppressWarnings("unused")
    public String getAttributes() {
        return attributes;
    }

    @DataBoundSetter
    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

    @SuppressWarnings("unused")
    public String getBusinessCriticality() {
        return businessCriticality;
    }

    @DataBoundSetter
    public void setBusinessCriticality(String businessCriticality) {
        this.businessCriticality = businessCriticality;
    }

    @SuppressWarnings("unused")
    public String getSdlcStatus() {
        return sdlcStatus;
    }

    @DataBoundSetter
    public void setSdlcStatus(String sdlcStatus) {
        this.sdlcStatus = sdlcStatus;
    }

    @SuppressWarnings("unused")
    public String getAssessmentType() {
        return assessmentType;
    }

    @DataBoundSetter
    public void setAssessmentType(String assessmentType) {
        this.assessmentType = assessmentType;
    }

    @SuppressWarnings("unused")
    public String getAuditPreference() {
        return auditPreference;
    }

    @DataBoundSetter
    public void setAuditPreference(String auditPreference) {
        this.auditPreference = auditPreference;
    }

    @Override
    @SuppressFBWarnings("NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE")
    public boolean prebuild(AbstractBuild<?, ?> build, BuildListener listener) {
        PrintStream log = listener.getLogger();

        log.println("Fortify on Demand Dynamic Scan PreBuild Running...");

        DastScanSharedBuildStep dastScanSharedBuildStep = new DastScanSharedBuildStep(
                overrideGlobalConfig,
                username,
                tenantId,
                personalAccessToken,
                releaseId,
                webSiteUrl,
                dastEnv,
                scanTimeBox,
                null,
                scanPolicy,
                scanScope,
                scanType,
                selectedDynamicTimeZone,
                enableRedundantPageDetection,
                webSiteUrl,
                loginMacroId,
                workflowMacroId,
                allowedHost,
                webSiteNetworkAuthUserName,
                webSiteNetworkAuthPassword,
                applicationId,
                assessmentTypeId,
                entitlementId,
                entitlementFrequency,
                selectedNetworkAuthType,
                timeBoxChecked
        );

        // When does this happen? If this only happens in syntax gen, then just use ServerClient
        boolean overrideGlobalAuthConfig = !Utils.isNullOrEmpty(username);
        List<String> errors = null;
        try {
            errors = dastScanSharedBuildStep.ValidateAuthModel(overrideGlobalAuthConfig, username, tenantId, personalAccessToken);
            if (errors.isEmpty()) {
                AuthenticationModel authModel = new AuthenticationModel(overrideGlobalAuthConfig,
                        username,
                        personalAccessToken,
                        tenantId);
            }

            errors = dastScanSharedBuildStep.ValidateModel();

        } catch (FormValidation e) {
            throw new RuntimeException(e);
        }

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Invalid arguments: Missing or invalid fields for auto provisioning: " + String.join(", ", errors));
        }
        try {


            switch (scanType)
            {
                case ("Standard"):
                {
                    saveWebSiteScanSettings(dastScanSharedBuildStep);
                    log.printf("Fortify On Demand Dynamic Scan Settings Saved Successfully for release Id %s", releaseId);
                    break;
                }
                case "Workflow-driven":
                {

                }
            }

        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return true;

    }

    private List<String> ValidateAuthModel(boolean overrideGlobalAuth) throws FormValidation {
        List<String> errors = new ArrayList<>();

        // Any have value and any don't have value
        if (overrideGlobalAuth && (Utils.isNullOrEmpty(username) || Utils.isNullOrEmpty(tenantId) || Utils.isNullOrEmpty(personalAccessToken))) {
            errors.add("Personal access token override requires all 3 be provided: username, personalAccessToken, tenantId");
        }

        return errors;
    }

    private void saveWebSiteScanSettings(DastScanSharedBuildStep dastScanSharedBuildStep ) throws Exception {
        int loginMacroFileId =0;
        if (requireLoginMacro) {
            Path path = Paths.get(loginMacroFilePath);
            PatchDastFileUploadResponse patchUploadResponse = dastScanSharedBuildStep.PatchSetupManifestFile(Files.readAllBytes(path), "LoginMacro");


            if (patchUploadResponse == null || !patchUploadResponse.isSuccess) {
                throw new FileUploadException(String.format("Failed to upload %s for release Id:%s",
                        loginMacroFilePath, releaseId));
            } else {
                loginMacroFileId = patchUploadResponse.fileId;
            }
        }

        dastScanSharedBuildStep.SaveReleaseSettingsForWebSiteScan(releaseId, assessmentTypeId,
                entitlementId
                , entitlementFrequency, String.valueOf(loginMacroFileId),
                selectedDynamicTimeZone,
                scanPolicy,
                webSiteUrl
                , scanScope, enableRedundantPageDetection, dastEnv
                , selectedNetworkAuthType != null && !selectedNetworkAuthType.isEmpty(), requireLoginMacro,
                webSiteNetworkAuthUserName, webSiteNetworkAuthPassword
                , selectedNetworkAuthType, scanTimeBox);

    }

    @Override
    public StepExecution start(StepContext context) throws Exception {
        return new Execution(this, context);
    }

    @Override
    @SuppressFBWarnings("NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE")
    public void perform(Run<?, ?> build, FilePath workspace, Launcher launcher, TaskListener listener) throws IOException, IllegalArgumentException {
        PrintStream log = listener.getLogger();
        log.println("Fortify on Demand Upload Running...");
        build.addAction(new CrossBuildAction());

        DastScanSharedBuildStep dastScanSharedBuildStep = new DastScanSharedBuildStep(overrideGlobalConfig,
                username,
                tenantId,
                personalAccessToken,
                releaseId,
                webSiteUrl,
                dastEnv,
                scanTimeBox,
                null,
                scanPolicy,
                scanScope,
                scanType,
                selectedDynamicTimeZone,
                enableRedundantPageDetection,
                webSiteUrl,
                loginMacroId,
                workflowMacroId,
                allowedHost,
                webSiteNetworkAuthUserName,
                webSiteNetworkAuthPassword,
                applicationId,
                assessmentTypeId,
                entitlementId,
                entitlementFrequency,
                selectedNetworkAuthType,
                timeBoxChecked);
        boolean overrideGlobalAuthConfig = !Utils.isNullOrEmpty(username);
        List<String> errors = null;

        try {
            errors = ValidateAuthModel(overrideGlobalAuthConfig);

            if (errors.isEmpty()) {
                AuthenticationModel authModel = new AuthenticationModel(overrideGlobalAuthConfig,
                        username,
                        personalAccessToken,
                        tenantId);

            }
            errors = dastScanSharedBuildStep.ValidateModel();
        } catch (FormValidation e) {
            throw new RuntimeException(e);
        }
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Invalid arguments:\n\t" + String.join("\n\t", errors));
        }

        try {
            build.save();
        } catch (IOException ex) {
            log.println("Error saving settings. Error message: " + ex.toString());
        }

        //Don't need to use the getAttribute for the class property,
        try {

            switch (scanType)
            {
                case ("Standard"):
                {
                    saveWebSiteScanSettings(dastScanSharedBuildStep);
                    log.println(String.format("Fortify On Demand Dynamic Scan Settings Saved Successfully for release Id %s", releaseId));
                    break;
                }
                case "WorkflowDrive":
                {

                }
            }

        } catch (Exception ex) {
            log.println("Fortify On Demand Dynamic Scan Error saving scan settings. Error message: " + ex.toString());
            throw new RuntimeException(ex);
        }

        dastScanSharedBuildStep.perform(build, workspace, launcher, listener, correlationId);
        CrossBuildAction crossBuildAction = build.getAction(CrossBuildAction.class);
        crossBuildAction.setPreviousStepBuildResult(build.getResult());

        if (Result.SUCCESS.equals(crossBuildAction.getPreviousStepBuildResult())) {
            crossBuildAction.setScanId(dastScanSharedBuildStep.getScanId());
            crossBuildAction.setCorrelationId(correlationId);
        }
        try {
            build.save();
        } catch (IOException ex) {
            log.println("Fortify On Demand Dynamic Scan Error saving settings. Error message: " + ex.toString());
        }
    }


    @Extension
    public static class DescriptorImpl extends StepDescriptor {
        @Override
        public String getDisplayName() {
            return "Run Fortify on Demand Upload";
        }

        @Override
        public Set<? extends Class<?>> getRequiredContext() {
            return ImmutableSet.of(Run.class, FilePath.class, Launcher.class, TaskListener.class);
        }

        @Override
        public String getFunctionName() {
            return "fodDynamicAssessment";
        }

        @SuppressFBWarnings("NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE")
        @POST
        public FormValidation doTestPersonalAccessTokenConnection(@QueryParameter("usernameStaplerOnly") final String username,
                                                                  @QueryParameter("personalAccessTokenSelect") final String personalAccessToken,
                                                                  @QueryParameter("tenantIdStaplerOnly") final String tenantId,
                                                                  @AncestorInPath Job job) throws FormValidation {
            job.checkPermission(Item.CONFIGURE);
            return SharedUploadBuildStep.doTestPersonalAccessTokenConnection(username, personalAccessToken, tenantId, job);

        }

        public static ListBoxModel doFillDastEnvItems() {
            return DastScanSharedBuildStep.doFillDastEnvItems();
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillEntitlementPreferenceItems() {
            return DastScanSharedBuildStep.doFillEntitlementPreferenceItems();
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillUsernameItems(@AncestorInPath Job job) {
            return DastScanSharedBuildStep.doFillStringCredentialsItems(job);
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillPersonalAccessTokenSelectItems(@AncestorInPath Job job) {
            return DastScanSharedBuildStep.doFillStringCredentialsItems(job);
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillTenantIdItems(@AncestorInPath Job job) {
            return DastScanSharedBuildStep.doFillStringCredentialsItems(job);
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillInProgressScanActionTypeItems() {
            return DastScanSharedBuildStep.doFillInProgressScanActionTypeItems();
        }

        @SuppressWarnings("unused")
        public static ListBoxModel doFillScanPolicyItems() {
            return DastScanSharedBuildStep.doFillScanPolicyItems();
        }

        @SuppressWarnings("unused")
        public ListBoxModel doFillInProgressBuildResultTypeItems() {
            return DastScanSharedBuildStep.doFillInProgressBuildResultTypeItems();
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveCurrentUserSession(JSONObject authModelObject) {
            try {

                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                UsersController usersController = new UsersController(apiConnection, null, Utils.createCorrelationId());
                return Utils.createResponseViewModel(usersController.getCurrentUserSession());
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        private static <T extends Enum<T>> ListBoxModel doFillFromEnum(Class<T> enumClass) {
            ListBoxModel items = new ListBoxModel();
            for (T selected : EnumSet.allOf(enumClass)) {
                items.add(new ListBoxModel.Option(selected.toString(), selected.name()));
            }
            return items;
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveAssessmentTypeEntitlements(Integer releaseId, JSONObject authModelObject) {
            try {
                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                AssessmentTypesController assessmentTypesController = new AssessmentTypesController(apiConnection, null, Utils.createCorrelationId());

                return Utils.createResponseViewModel(assessmentTypesController.getDynamicAssessmentTypeEntitlements(false));
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveAssessmentTypeEntitlementsForAutoProv(String appName, String relName, Boolean isMicroservice, String microserviceName, JSONObject authModelObject) {
            try {
                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                ReleaseController releases = new ReleaseController(apiConnection, null, Utils.createCorrelationId());
                AssessmentTypesController assessments = new AssessmentTypesController(apiConnection, null, Utils.createCorrelationId());
                Integer relId = releases.getReleaseIdByName(appName.trim(), relName.trim(), isMicroservice, microserviceName);
                AssessmentTypeEntitlementsForAutoProv result = null;

                if (relId == null) {
                    result = new AssessmentTypeEntitlementsForAutoProv(null, assessments.getStaticAssessmentTypeEntitlements(isMicroservice), null);
                } else {
                    StaticScanController staticScanController = new StaticScanController(apiConnection, null, Utils.createCorrelationId());
                    GetStaticScanSetupResponse settings = staticScanController.getStaticScanSettings(relId);

                    result = new AssessmentTypeEntitlementsForAutoProv(relId, assessments.getStaticAssessmentTypeEntitlements(relId), settings);
                }

                return Utils.createResponseViewModel(result);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveDynamicScanSettings(Integer releaseId, JSONObject authModelObject) {
            try {
                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                DastScanController dastScanController = new DastScanController(apiConnection, null, Utils.createCorrelationId());
                return Utils.createResponseViewModel(dastScanController.getDastScanSettings(releaseId));

            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveAuditPreferences(Integer releaseId, Integer assessmentType, Integer frequencyType, JSONObject authModelObject) {
            try {
                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                ReleaseController releaseController = new ReleaseController(apiConnection, null, Utils.createCorrelationId());

                return Utils.createResponseViewModel(releaseController.getAuditPreferences(releaseId, assessmentType, frequencyType));
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @SuppressWarnings("unused")
        @JavaScriptMethod
        public String retrieveLookupItems(String type, JSONObject authModelObject) {
            try {
                AuthenticationModel authModel = Utils.getAuthModelFromObject(authModelObject);
                FodApiConnection apiConnection = ApiConnectionFactory.createApiConnection(authModel, false, null, null);
                LookupItemsController lookupItemsController = new LookupItemsController(apiConnection, null, Utils.createCorrelationId());

                return Utils.createResponseViewModel(lookupItemsController.getLookupItems(APILookupItemTypes.valueOf(type)));
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

    }

    private static class Execution extends SynchronousNonBlockingStepExecution<Void> {
        private static final long serialVersionUID = 1L;
        private transient FortifyDastPipelineAssessment upload;

        protected Execution(FortifyDastPipelineAssessment upload, StepContext context) {
            super(context);
            this.upload = upload;
        }

        @Override
        protected Void run() throws Exception {
            getContext().get(TaskListener.class).getLogger().println("Running fodDynamicAssessment step");
            upload.perform(getContext().get(Run.class), getContext().get(FilePath.class),
                    getContext().get(Launcher.class), getContext().get(TaskListener.class));

            return null;
        }
    }
}