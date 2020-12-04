import { readFile } from '/lib/io';
import { processRegions, render } from '/lib/slm';
import { getContent } from '/lib/xp/portal';


const VIEW_FILE = resolve('view.slm');
const VIEW_TEXT = readFile(VIEW_FILE);


export function get(
    request, {
        content = getContent(),
        config = content.page.config
    } = {}
) {
    const model = {
        title: config.title || 'Title from js variable in controller',
        regions: processRegions(content.page.regions, request),
        requestString: JSON.stringify(request, null, 4)
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
