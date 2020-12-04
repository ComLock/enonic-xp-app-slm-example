import { readFile } from '/lib/io';
import { render } from '/lib/slm';
import { getComponent } from '/lib/xp/portal';


const VIEW_FILE = resolve('slmPart.slm');
const VIEW_TEXT = readFile(VIEW_FILE);


export function get(
    request,
    component = getComponent(),
    passAlong = {}
){
    const model = {
        variable: 'value'
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
