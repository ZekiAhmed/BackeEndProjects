

// os
// cpu info
// memory
// home/temp dir

import * as os from 'node:os'

function runOsDemo(): void {
    console.log("platform", os.platform());
    console.log('architecture', os.arch());
    console.log('os type', os.type());
    console.log('os release', os.release());
    console.log('home dir', os.homedir());
    console.log('temp dir', os.tmpdir());
    
    const cpus = os.cpus();
    console.log('cpus', cpus.length);   
    if(cpus.length > 0) {
        console.log("first CPU model", cpus[0].model, cpus[0].speed, cpus[0].times)
    } 

}

runOsDemo();