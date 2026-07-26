

// after some delay
// repeatedly after some internal -2 seconds


// settimeout
// setinterval
// cleartimeout
// clearinterval
// setimmedate

function runSetTimeoutExample(): void{
    console.log('1.setTimeout example started');

    setTimeout(() => {
        console.log('2.this runs after 1 second');

    }, 1000);

    console.log("3.this run immediately. node doesn't wait");
};


function runClearTimeoutExample(): void {
    const timerId = setTimeout(() => {
        console.log('this message will not run');
        
    }, 2000);

    clearTimeout(timerId);
    console.log("4.cleartimout cancelled the 2 second timer");
    
};

function runSetIntervalExample(): void {
    let count = 0;

    const intervalId = setInterval(() => {
        count++;

        console.log(`5.setinterval tick: ${count}`);

        if(count === 3) {
        clearInterval(intervalId);
        console.log('6.setinterval stoped');   
    };

    },1000);  
}

function runSetImmediateExample(): void {
    setImmediate(() => {
        console.log("7.setImmediate callback");
    });

    console.log("8.synchronous code after setImmediate");
}

import { error } from 'node:console';
import {setTimeout as sleep} from 'node:timers/promises'

async function runPromiseTimerExample(): Promise<void> {
    console.log('9.waiting for promise based timer');

    await sleep(1500);

    console.log('10.promise based timer finishes after 1.5 seconds');
    
    
}

function runTimerDemo(): void{
    runSetTimeoutExample();
    runClearTimeoutExample();
    runSetIntervalExample();
    runSetImmediateExample();
    // runPromiseTimerExample();
};

runTimerDemo();

runPromiseTimerExample().catch((error:unknown) => {
    console.error('timer based demo failed', error);
    
})