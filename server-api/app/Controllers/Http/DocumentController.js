'use strict'

class DocumentController {
    async index({ view }) {
        return view.render('docs.index')
    }

    async intro({ view }) {
        return view.render('intro')
    }
}

module.exports = DocumentController
