const express = require("express");
const router = express.Router();
const e = require("../e");
const ObjectId = require("mongodb").ObjectID;
fs = require("fs");
util = require("util");
writeFile = util.promisify(fs.writeFile);
const multiparty = require("connect-multiparty");
const multipartMiddleware = multiparty();
const path = require("path");
const mammoth = require("mammoth");

router.get("/view", e.lib.checkAuth(), async function (req, res, next) {
  const allDocs = [];
  fs.readdir("./downloads", (err, files) => {
    files.forEach((file) => {
      //   console.log(path.basename(file));
      allDocs.push(path.basename(file));
      // console.log(allDocs)
    });
    console.log(allDocs);
    if (allDocs.length == 0) {
      res.render("allDocsView", {
        title: "Docs",
        user: req.user.login,
        info: "No documents yet",
      });
    } else {
      res.render("allDocsView", {
        title: "Docs",
        user: req.user.login,
        allDocs: allDocs,
      });
    }
  });
});

router.get("/view/:filename", e.lib.checkAuth(), async (req, res, next) => {
  fs.readdir("./downloads", (err, files) => {
    files.forEach((file) => {
      if (file == req.params.filename) {
        const filePath = path.join(__dirname, "..", "downloads/", file);
        console.log(filePath)
        res.render("docView", { doc: filePath });
      }
    });
  });
});

router.get("/download/:filename", e.lib.checkAuth(), (req, res, next) => {
  const filename = req.params.filename;
  const path = "./downloads/" + filename + ".doc";
  res.download(path, function (error) {
    if (error) {
      res.render("allDocsView", {
        title: "Docs",
        user: req.user.login,
        error: "No such file",
      });
    }
  });
});

router.get("/form", e.lib.checkAuth(), (req, res, next) => {
  res.render("docsForm", { title: "Docs", user: req.user.login });
});

router.post(
  "/upload",
  e.lib.checkAuth(),
  multipartMiddleware,
  async function (req, res, next) {
    fs.rename(
      req.files.doc.path,
      "./downloads/" + req.files.doc.name,
      function (err) {
        if (err) throw err;
        console.log("renamed complete");
      }
    );
    res.render("docsForm", {
      title: "Docs",
      user: req.user.login,
      good: "Successfully added",
    });
  }
);

module.exports = router;
