var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "VSS/Controls", "TFS/DistributedTask/TaskRestClient"], function (require, exports, Controls, DT_Client) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusSection = void 0;
    var StatusSection = /** @class */ (function (_super) {
        __extends(StatusSection, _super);
        function StatusSection() {
            return _super.call(this) || this;
        }
        StatusSection.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            // Get configuration that's shared between extension and the extension host
            var sharedConfig = VSS.getConfiguration();
            var vsoContext = VSS.getWebContext();
            if (sharedConfig) {
                // register your extension with host through callback
                sharedConfig.onBuildChanged(function (build) {
                    var taskClient = DT_Client.getClient();
                    taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "myAttachmentType").then(function (taskAttachments) {
                        if (taskAttachments.length === 1) {
                            $(".risk-report-message").remove();
                            var recId = taskAttachments[0].recordId;
                            var timelineId = taskAttachments[0].timelineId;
                            taskClient.getAttachmentContent(vsoContext.project.id, "build", build.orchestrationPlan.planId, timelineId, recId, "myAttachmentType", "myAttachmentName").then(function (attachementContent) {
                                function arrayBufferToString(buffer) {
                                    var arr = new Uint8Array(buffer);
                                    var str = String.fromCharCode.apply(String, arr);
                                    if (/[\u0080-\uffff]/.test(str)) {
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
        };
        return StatusSection;
    }(Controls.BaseControl));
    exports.StatusSection = StatusSection;
    StatusSection.enhance(StatusSection, $(".build-info"), {});
    // Notify the parent frame that the host has been loaded
    VSS.notifyLoadSucceeded();
});
