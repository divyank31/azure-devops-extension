import VSS_Service = require("VSS/Service");
import Controls = require("VSS/Controls");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");
import DT_Client = require("TFS/DistributedTask/TaskRestClient");

export class StatusSection extends Controls.BaseControl {	
	constructor() {
		super();
	}
		
	public initialize(): void {
		super.initialize();

		// Get configuration that's shared between extension and the extension host
		var sharedConfig: TFS_Build_Extension_Contracts.IBuildResultsViewExtensionConfig = VSS.getConfiguration();
		var vsoContext = VSS.getWebContext();
		
		if(sharedConfig) {
			// register your extension with host through callback
			sharedConfig.onBuildChanged((build: TFS_Build_Contracts.Build) => {

				var taskClient = DT_Client.getClient();
				taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "myAttachmentType").then((taskAttachments)=> {
											
				if (taskAttachments.length === 1) {
					$(".risk-report-message").remove();
					var recId = taskAttachments[0].recordId;
					var timelineId = taskAttachments[0].timelineId;

					taskClient.getAttachmentContent(vsoContext.project.id, "build", build.orchestrationPlan.planId,timelineId,recId,"myAttachmentType","myAttachmentName").then((attachementContent)=> {														
						function arrayBufferToString(buffer){
									var arr = new Uint8Array(buffer);
									var str = String.fromCharCode.apply(String, arr);
									if(/[\u0080-\uffff]/.test(str)){
										throw new Error("this string seems to contain (still encoded) multibytes");
									}
									return str;
								}
						
						var summaryPageData = arrayBufferToString(attachementContent);
						$(".build-info").append(summaryPageData);
								

					});					
				}
				});	
			});
		}		
	}	
}

StatusSection.enhance(StatusSection, $(".build-info"), {});

// Notify the parent frame that the host has been loaded
VSS.notifyLoadSucceeded();