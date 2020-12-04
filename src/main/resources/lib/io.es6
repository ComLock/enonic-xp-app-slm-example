import { getResource, readText } from '/lib/xp/io';

export function readFile(file) {
    return readText(getResource(file).getStream());
}
