import { SubParser } from "argparse";
import path = require("path");
import { Encryption } from "../util/encryption";
import { Pak } from "../util/pak";

export class Package {
    public static addExtractParser(parent: SubParser) {
        const parser = parent.add_parser('package', { help: 'Repacks the game .PAK file', aliases: ['p'] });
        parser.set_defaults({ command: 'package' })
        parser.add_argument('-c', '--cryptoKey', { help: 'Crypto key for pak file', required: true });
        parser.add_argument('-o', '--out', { default: './mod_P.pak', help: 'Output file anem for created pak. Should be <game name>-WindowsNoEditor_P.pak' });
        parser.add_argument('-l', '--contentList', { default: './mod_contents.txt', help: 'Parsed output file from extraction step' });
        parser.add_argument('-v', '--version', { default: 2, type: 'int', help: 'Pak file version' })
    }

    public static package(args: { cryptoKey: string, out: string, contentList: string, version: number }) {
        Encryption.createTempEncryptionFile(args.cryptoKey).then((cryptoFile) => {
            console.log(cryptoFile);
            console.log('Packaging files. This could take some time.')
            return Pak.executePakCommand(['ignore', process.stdout, process.stderr], `\"${path.resolve(args.out)}\"`, `-Create=\"${path.resolve(args.contentList)}\"`, '-Encrypt', `-cryptokeys=\"${cryptoFile}\"`, `-version=${args.version}`);
        }
        ).then(() => {
            console.log('File packaged successfully.');
        }).catch((r) => {
            console.error('Failed to package assets', r);
        })
    }
}
