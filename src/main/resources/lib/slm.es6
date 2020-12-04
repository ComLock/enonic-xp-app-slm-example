import { toStr } from '/lib/enonic/util';
import { readFile } from '/lib/io';
import { get as xpContentGet } from '/lib/xp/content';
import { render as slmRender } from 'slm/lib/slm_browser';


function htmlFromTextComponent(component) {
    return `<section data-portal-component-type="text">${component.text}</section>`;
} // function htmlFromTextComponent


function htmlFromLayout(req, component, passAlong = {}) {
    const layoutName = component.descriptor.split(':')[1];
    const controller = require(`../../layouts/${layoutName}/${layoutName}`);
    let html = '';
    try {
        html = controller.get(req, component, passAlong).body;
    }
    catch(e) {
        html = `<section data-portal-component-type="layout"><h1>${e.message}</h1></section>`;
    }
    finally {
        return html;
    }
} // function htmlFromLayout


function htmlFromPart(req, component, passAlong = {}) {
    const partName = component.descriptor.split(':')[1];
    const controller = require(`../../parts/${partName}/${partName}`);
    let html = '';
    try {
        html = controller.get(req, component, passAlong).body;
    }
    catch(e) {
        html = `<section data-portal-component-type="part"><h1>${e.message}</h1></section>`;
    }
    finally {
        return html;
    }
} // function htmlFromPart


function htmlFromComponent(req, component, passAlong = {}) {
    switch (component.type) {
        // That which occurs the most should come first:
        case 'part':   return htmlFromPart(req, component, passAlong);
        case 'text':   return htmlFromTextComponent(component);
        case 'layout': return htmlFromLayout(req, component, passAlong);
        case 'fragment':
            const fragment = xpContentGet({ key: component.fragment }).page.fragment;
            return htmlFromComponent(req, fragment, passAlong); // Recurse
        default:
            log.error('htmlFromComponent: unsupported component:%s', toStr(component));
            throw new Error(`htmlFromComponent: unsupported component type:${component.type}`);
    }
} // function htmlFromComponent


export function processRegions(regions, req, passAlong = {}) {
    Object.keys(regions).forEach(regionName => {
        regions[regionName].components.forEach((component, i) => {
            regions[regionName].components[i].utext = htmlFromComponent(req, component, passAlong);
        });
    });
    return regions;
} // function processRegions


export function render({
    file,
    text = readFile(file),
    model
}) {
    return slmRender(text, model, { filename: file });
} // function render
