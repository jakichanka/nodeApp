const express = require('express')
const router = express.Router()
const e = require('../e')
const ObjectId = require('mongodb').ObjectID
fs = require('fs');
util = require('util');
writeFile = util.promisify(fs.writeFile);

router.get('/view', e.lib.checkAuth(), async function(req, res, next) {
    try {
        const allDocs = await e.models.Docs.find()
        if (allDocs.length == 0) {
            res.render('allDocsView', {title: 'Docs', user: req.user.login, info:"No documents yet"})
        }
        res.render('allDocsView', {title: 'Docs', user: req.user.login, allDocs: allDocs})
    } catch(error) {
        res.render('allDocsView', {title: 'Docs', user: req.user.login, error:"Failed to get documents"})
    }
});

router.get('/view/:id', e.lib.checkAuth(), async function(req, res, next){
    const docId = new ObjectId(req.params.id)
    try {
        const doc = await e.models.Docs.findOne({_id: docId})
        res.render('docView', {title: 'Docs', user: req.user.login, doc: doc})
    } catch(error) {
        res.render('docView', {title: 'Docs', user: req.user.login, error:"No such document"})
    }
})

router.get('/download/:filename', e.lib.checkAuth(), function(req, res, next){
    const filename = req.params.filename
    const path = "./downloads/" + filename + ".doc"
    res.download(path,function(error){
        if (error){
            res.render('allDocsView', {title: 'Docs', user: req.user.login, error: "No such file"})
        }
    })
})

router.get('/form', e.lib.checkAuth(), function(req, res, next){
    res.render('docsForm', {title: 'Docs', user: req.user.login})
})

router.post('/upload', e.lib.checkAuth(), async function(req, res, next){
    let title = req.body.title || false
    let mainText = req.body.mainText || false
    if (title == false || mainText == false)  res.render('docsForm', {title: 'Docs', user: req.user.login, error: "Fill all fields"})
    const Doc = new e.models.Docs({
        title: title,
        text: mainText
    })
    
    try {
        await Doc.save()
        await writeFile('./downloads/' + title + ".doc", mainText)
        res.render('docsForm', {title: 'Docs', user: req.user.login, good: "Successfully added"})
    } catch{error}{
        res.render('docsForm', {title: 'Docs', user: req.user.login, error:"Failed to add document"})
    }
})

module.exports = router;
