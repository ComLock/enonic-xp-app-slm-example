import { readFile } from '/lib/io';
import { processRegions, render } from '/lib/slm';
import { getComponent } from '/lib/xp/portal';


const VIEW_FILE = resolve('slmLayout.slm');
const VIEW_TEXT = readFile(VIEW_FILE);


export function get(
    request,
    component = getComponent(),
    passAlong = {}
) {
    const model = {
        regions: processRegions(component.regions, request)
    };
    return {
        body: render({
            file: VIEW_FILE,
            text: VIEW_TEXT,
            model
        }),
        contentType: 'text/html'
    };
} // function get
