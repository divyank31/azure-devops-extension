// var tl = require('azure-pipelines-task-lib');

// var datetime = new Date();
//     console.log(JSON.stringify(datetime));


// var buildPath = tl.getVariable('Agent.BuildDirectory');
// console.log(buildPath);

// //Create a folder
// tl.mkdirP(buildPath + "/reportData");

// var fileName = buildPath + "/reportData/mydata.txt";
// console.log(fileName);

// //Write data to a file
//     tl.writeFile(fileName,JSON.stringify(datetime));

// //Executes command to attach the file to build
//     console.log("##vso[task.addattachment type=myAttachmentType;name=myAttachmentName;]"+ fileName) ;
