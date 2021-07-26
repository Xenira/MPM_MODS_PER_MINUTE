import { ArgumentParser } from 'argparse';

import { version, description } from '../package.json'

import { Extract } from './commands/extract';
import { Parse } from './commands/parse';
import { Package } from './commands/package';
import { Wwise } from './commands/Wwise';

const parser = new ArgumentParser({
    description
})

parser.add_argument('-v', '--version', { action: 'version', version })
const subparsers = parser.add_subparsers();
Extract.addExtractParser(subparsers);
Parse.addParseParser(subparsers);
Package.addExtractParser(subparsers);
Wwise.addWwiseParser(subparsers);

const args = parser.parse_args();
switch (args.command) {
    case 'extract':
        Extract.extract(args);
        break;
    case 'parse':
        Parse.parseContents(args);
        break;
    case 'package':
        Package.package(args);
        break;
    case 'wwise':
        Wwise.patchWwiseBnk(args);
        break;
    default:
        parser.print_help();
}
