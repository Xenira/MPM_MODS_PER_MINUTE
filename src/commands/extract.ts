import * as path from 'path';
import * as fs from 'fs';

import { SubParser } from "argparse";

import { exit } from 'process';
import { Pak } from '../util/pak';
import { Encryption } from '../util/encryption';

export class Extract {
    public static addExtractParser(parent: SubParser) {
        const parser = parent.add_parser('extract', { help: 'Extracts game .PAK file', aliases: ['e'] });
        parser.set_defaults({ command: 'extract' })
        parser.add_argument('-p', '--pak', { help: 'Path to game pak file', required: true });
        parser.add_argument('-c', '--cryptoKey', { help: 'Crypto key for pak file', required: true });
        parser.add_argument('-o', '--out', { default: path.join(__dirname, '../../out'), help: 'Output directory for extracted game files' });
        parser.add_argument('-l', '--contentList', { default: './contents.txt', help: 'Output file for pak content list' });
    }

    public static extract(args: { pak: string, cryptoKey: string, out: string, contentList: string }) {
        console.log(args);

        Encryption.createTempEncryptionFile(args.cryptoKey).then((path) => {
            Extract.runExtraction(args.contentList, args.pak, args.out, path);
        })
    }

    private static runExtraction(contentList: string, pak: string, outDir: string, cryptoKeysFile: string) {
        const out = fs.openSync(contentList, 'w');
        console.log('Extracting to', outDir, '. This could take some time.')
        Pak.executePakCommand(['ignore', out, 'pipe'], `"${pak}"`, '-Extract', `"${outDir}"`, `-CryptoKeys="${cryptoKeysFile}"`)
            .then(() => {
                console.log('Extraction finished.');
            })
            .catch((code) => {
                console.error('Error extracting pak. See', contentList, 'for more details.');
                exit(code);
            })
    }

}

