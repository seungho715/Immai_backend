const { spawn } = require('child_process');
const { resolveMx } = require('dns');
const { resolve } = require('path');

function init(role) {
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', 'init', role]);

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

function npcInteraction(inputText, history){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', 'npc', inputText, history]);

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

function translate(text){
    return new Promise((resolve, reject)=>{
            const pythonProcess = spawn('python', ['src/python/ollama.py', 'translate', text]);

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


module.exports = { init, npcInteraction, exerciseGen, translate };