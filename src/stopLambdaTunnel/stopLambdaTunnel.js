var lambdaTunnel = require('@lambdatest/node-tunnel');
var tl = require('azure-pipelines-task-lib');
//const { exec } = require('child_process');

async function run(tunnelInstance) {
    try {
        var tunnelInstance = new lambdaTunnel();
        const status = await tunnelInstance.stop();
        console.log(typeof status);
        console.log('Tunnel is Stopped ? :' + status);
    } catch (error) {
        console.log(error);
      }
}

// console.log(process.env.LT_USERNAME);
// console.log(process.env.LT_ACCESS_KEY);
// console.log(process.env.LT_GRID_URL);

var tunnelInstance = tl.getVariables();

run(tunnelInstance);

