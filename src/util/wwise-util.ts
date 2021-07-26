import { spawn } from 'child_process';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { get } from 'https'
import { resolve } from 'path';
import { mkdir } from 'temp';
import * as path from 'path'
import * as request from 'request';

export class WwiseUtil {

    public static async patchBak(origin: string, files: string, target: string): Promise<void> {
        if (!existsSync('bin/wwiseutil.exe')) {
            console.log('Wwise utils not found. Downloading...')
            await WwiseUtil.downloadWwiseUtils();
        }

        return new Promise((res, rej) => {
            console.log('Patching wwise bnk...')
            mkdirSync(path.dirname(resolve(target)), { recursive: true })
            const child = spawn('bin/wwiseutil.exe', ['-replace', '-f', `${resolve(origin)}`, '-t', `${resolve(files)}`, '-o', `${resolve(target)}`], { stdio: ['ignore', process.stdout, process.stderr] })
            child.once('close', (code) => {
                if (code !== 0) {
                    rej(code);
                } else {
                    res();
                }
            });
        })
    }

    private static downloadWwiseUtils(): Promise<void> {
        return new Promise((res, rej) => {
            mkdirSync('bin', { recursive: true });
            const path = `bin/wwiseutil.exe`;
            const filePath = createWriteStream(path);

            const url = 'https://github.com/hpxro7/wwiseutil/releases/latest/download/wwiseutil.exe';
            request.get(url, { followRedirect: true }).pipe(filePath);
            filePath.on('finish', () => {
                filePath.close();
                console.log('Download Completed');
                res();
            })
        })
    }
}