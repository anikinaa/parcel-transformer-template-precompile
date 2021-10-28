const { Transformer } = require('@parcel/plugin');

const transformer = new Transformer({
    async transform({asset}) {
        let templdate = await asset.getCode();
        let key = null;
        const regExp = /\{\{\{(.*?)\}\}\}/gi;

        while ((key = regExp.exec(templdate))) {
            if (key[1]) {
                const contextKey = key[1].trim();
                const templateEl = getTemplate(contextKey)
                templdate = templdate.replace(new RegExp(key[0], "gi"), templateEl);
            }
        }

        const newCode = `
        const template = \`
        ${templdate}
        \`;
        export default template;
        `;
        asset.type = 'js';
        asset.setCode(newCode);
        return [asset];
    }
});


function getTemplate(contextKey) {
    return `<template data-context="${contextKey}"></template>`
}

module.exports = transformer;
