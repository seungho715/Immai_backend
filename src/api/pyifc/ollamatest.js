const { spawn } = require('child_process');
const { resolve } = require('path');

function npcInteraction(argument){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', argument]);

            let output = '';
            pythonProcess.stdout.on('data', (data) => {
                output+=data;
            });

            pythonProcess.stderr.on('data', (data) => {
                reject(data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code===0) {
                    resolve(parseInt(output, 10));
                } else {
                    reject(`Python process exited with code ${code}`);
                }
            });

        });
}

module.exports = { npcInteraction };