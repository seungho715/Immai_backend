const { spawn } = require('child_process');
const { resolveMx } = require('dns');
const { resolve } = require('path');

function npcInteraction(inputText, role){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', 'npc', inputText, role]);

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

function exerciseGen(word, exercise){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', 'exercise', word, exercise]);

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


module.exports = { npcInteraction, exerciseGen };