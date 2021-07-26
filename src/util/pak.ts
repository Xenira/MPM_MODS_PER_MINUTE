import { join } from 'path'
import { existsSync } from 'fs';
import { spawn, SpawnOptionsWithoutStdio, StdioPipe, StdioPipeNamed } from 'child_process';

import * as settings from '../../settings.json'

export class Pak {

    public static async executePakCommand(stdio?: any[], ...args: string[]): Promise<number> {
        const pakPath = this.locateUnrealPak();
        const config: SpawnOptionsWithoutStdio = {};
        if (stdio) {
            config.stdio = stdio;
        }

        return new Promise((res, rej) => {
            const child = spawn(pakPath, args, config);
            child.on('close', (code) => {
                if (code !== 0) {
                    rej(code);
                }
                res(code);
            });
        })

    }

    private static locateUnrealPak(): string {
        const enginePath = join(settings.unrealEnginePath, settings.binariesFolder);
        console.log('Assuming engine binaries path:', enginePath);

        const unrealPakPath = join(enginePath, 'UnrealPak.exe');
        console.log('UnrealPak Path:', unrealPakPath);

        if (!existsSync(unrealPakPath)) {
            throw 'UnrealPak.exe not found. Please make sure you have installed the correct unreal engine version and the path displayed above is correct.'
        }
        return unrealPakPath;
    }
}