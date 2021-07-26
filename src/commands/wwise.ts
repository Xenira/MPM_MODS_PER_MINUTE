import { SubParser } from "argparse";
import { WwiseUtil } from "../util/wwise-util";

export class Wwise {
    public static addWwiseParser(parent: SubParser) {
        const parser = parent.add_parser('wwise', { help: 'Formats the extraction output for repackaging step', aliases: ['w'] });
        parser.set_defaults({ command: 'wwise' })
        parser.add_argument('-i', '--input', { default: './out/BPM/Content/WwiseAudio/Windows/Main.bnk', help: 'Original Wwise bnk file to modify' });
        parser.add_argument('-a', '--audio', { default: './audio/', help: 'Directory containing <index>.wem files' })
        parser.add_argument('-o', '--out', { default: './mod/BPM/Content/WwiseAudio/Windows/Main.bnk', help: 'Output Wwise bnk file' });
    }

    public static patchWwiseBnk(args: { input: string, audio: string, out: string }) {
        WwiseUtil.patchBak(args.input, args.audio, args.out).then(() => {
            console.log('Patched Wwise bak created successfully');
        }).catch(() => {
            console.log('Failed to patch Wwise bak.')
        })
    }
}