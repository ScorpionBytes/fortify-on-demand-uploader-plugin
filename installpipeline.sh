hoststr=localhost:8080

if [ $# -eq 0 ]
then
  echo "Host not supplied, using $hoststr"
else
  hoststr=$1
fi



~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-milestone-step/1.3.1/pipeline-milestone-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-basic-steps/2.11/workflow-basic-steps.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-build-step/2.7/pipeline-build-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-input-step/2.8/pipeline-input-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-multibranch/2.20/workflow-multibranch.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/cloudbees-folder/6.6/cloudbees-folder.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-cps-global-lib/2.11/workflow-cps-global-lib.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/scm-api/2.2.8/scm-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-support/2.20/workflow-support.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-api/2.29/workflow-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/git-client/2.7.3/git-client.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-scm-step/2.6/workflow-scm-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-stage-step/2.3/pipeline-stage-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-cps/2.56/workflow-cps.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-job/2.25/workflow-job.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-model-definition/1.3.2/pipeline-model-definition.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/lockable-resources/2.3/lockable-resources.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/workflow-durable-task-step/2.22/workflow-durable-task-step.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/ssh-credentials/1.13/ssh-credentials.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/jsch/0.1.54.1/jsch.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/matrix-project/1.4/matrix-project.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/apache-httpcomponents-client-4-api/4.5.5-3.0/apache-httpcomponents-client-4-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/mailer/1.20/mailer.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/ace-editor/1.0.1/ace-editor.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/jquery-detached/1.2.1/jquery-detached.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/durable-task/1.26/durable-task.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/display-url-api/1.0/display-url-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/git-server/1.7/git-server.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/branch-api/2.0.18/branch-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/credentials-binding/1.13/credentials-binding.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-stage-tags-metadata/1.3.2/pipeline-stage-tags-metadata.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/docker-workflow/1.14/docker-workflow.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-model-api/1.3.2/pipeline-model-api.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-model-extensions/1.3.2/pipeline-model-extensions.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/pipeline-model-declarative-agent/1.1.1/pipeline-model-declarative-agent.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/docker-commons/1.5/docker-commons.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/authentication-tokens/1.1/authentication-tokens.hpi && \
~/.jdks/corretto-1.8.0_322/bin/java.exe -jar jenkins-cli.jar -s http://$hoststr/jenkins/ -webSocket install-plugin https://updates.jenkins.io/download/plugins/icon-shim/1.0.3/icon-shim.hpi