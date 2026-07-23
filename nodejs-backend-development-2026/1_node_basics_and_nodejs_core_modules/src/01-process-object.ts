import process from 'node:process';


const shouldFail = process.argv.includes("--fail");
const shouldCrash = process.argv.includes("--crash");

const command = process.argv[2] ?? "start";

process.on("exit", (code) => {
    console.log(`Process finished with exit code ${code}`)
});

if (shouldFail) {
    console.log("Manual failure trigered with --fail flag");
    process.exit(1);
};

function runApp(): void {
    console.log({
        command,
    });

    if (shouldFail) {
        console.log("Manual failure trigered with --fail flag");
        process.exit(1);
    };

    if (shouldCrash) {
        console.log("Manual failure trigered with --fail crash");
        process.exit(1);
    };
};

runApp();

// run this command it terminal:  npm run 01 -- --fail