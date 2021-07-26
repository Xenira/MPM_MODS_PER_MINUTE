import { readFile, write, close } from "fs";
import * as temp from 'temp';

temp.track();

export class Encryption {
    public static createTempEncryptionFile(cryptoKey: string): Promise<string> {
        return new Promise((res) => {
            readFile('cryptoKeys.json', async (err, data) => {
                if (err) {
                    throw err;
                }

                const info = await temp.open({ suffix: '.json' });
                write(info.fd, data.toString().replace('{{key}}', cryptoKey), (err) => {
                    if (err) {
                        throw err;
                    }
                    close(info.fd, (err) => {
                        if (err) {
                            throw err;
                        }
                        res(info.path);
                    });
                });
            });
        })
    }
}