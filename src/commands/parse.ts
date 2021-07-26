import { SubParser } from "argparse";
import * as path from "path";
import * as fs from 'fs'
import * as readline from "readline";

const parseRegex = /LogPakFile: Display: Extracted "(.+?)" to (".+?") Offset -?\d+\./

export class Parse {
    public static addParseParser(parent: SubParser) {
        const parser = parent.add_parser('parse', { help: 'Formats the extraction output for repackaging step' });
        parser.set_defaults({ command: 'parse' })
        parser.add_argument('-i', '--input', { default: './contents.txt', help: 'File with the extraction output' })
        parser.add_argument('-o', '--out', { default: './parsed_contents.txt', help: 'Output file for parsed pak contents' });
        parser.add_argument('-y', { action: 'store_true', help: 'Overwrite file if existing' });
    }

    public static parseContents = (args: { input: string, out: string, y?: boolean }) => {
        if (!fs.existsSync(args.input)) {
            throw new Error(`Input file ${args.input} not found`);
        }

        if (!args.y && fs.existsSync(args.out)) {
            const rl = readline.createInterface(process.stdin, process.stdout);
            rl.question('Parsing output file already exists. Do you really want to overwrite this file? [y/N]: ', (d) => {
                if (d.trim().toLowerCase() === 'y') {
                    Parse.executeParser(args);
                }
                rl.close();
            })
        } else {
            Parse.executeParser(args);
        }

    }

    private static executeParser(args: { input: string, out: string }) {
        fs.readFile(args.input, (err, data) => {
            if (err) {
                throw err;
            }

            fs.open(args.out, 'w', (err, fd) => {
                if (err) {
                    throw err;
                }

                data.toString().split('\n')
                    .map((line) => parseRegex.exec(line))
                    .filter((res) => res && res.length === 3)
                    .forEach((match) => fs.appendFileSync(fd, `${match[2]} "../../../${match[1]}"\n`))

                fs.close(fd, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            });
        });
    }
}