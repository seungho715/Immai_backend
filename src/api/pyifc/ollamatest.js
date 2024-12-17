const { spawn } = require('child_process');
const { resolve } = require('path');

function npcInteraction(argument){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', argument]);

            let output = '';
            pythonProcess.stdout.on('data', (data) => {
                console.log(data.toString())
                output+=data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                reject(data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code===0) {
                    resolve(output.toString());
                } else {
                    reject(`Python process exited with code ${code}`);
                }
            });

        });
}

module.exports = { npcInteraction };