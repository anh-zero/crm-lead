import express from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import homePageController from "../controllers/homePageController";
import initPassportLocal from "../controllers/passportLocalController";
import addLeadController from "../controllers/addLeadController";

import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');

//multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/upload/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// let upload = multer({ storage: storage, fileFilter: imageFilter });
let upload = multer({ storage: storage });


//init passport routes

initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, homePageController.getHomePage);
    //user register
    router.get("/register", registerController.getRegisterPage);
    router.post("/register-new-user", registerController.createNewUser);
    //user login 
    router.get("/login", loginController.checkLoggedOut, loginController.getLoginPage);
    router.post("/login", loginController.handleLogin);
    router.post("/logout", loginController.postLogOut);
    //create lead
    router.post('/create-new-lead', addLeadController.createNewLead);
    //show all leads
    router.get('/lead', loginController.checkLoggedIn, homePageController.showLeads)
    //delete lead
    router.get('/delete-lead/:userId', homePageController.deleteLead);
    //update lead
    router.get('/edit-lead/:id', homePageController.getEditPage);
    // router.post('/update-lead', upload.single('profile_image'), homePageController.postUpdateLead);
    router.post('/update-lead', upload.fields([
        { name: 'profile_image', maxCount: 1 },
        { name: 'attachments', maxCount: 10 }
    ]), homePageController.postUpdateLead);
    // bulk delete leads
    router.post('/delete-leads', homePageController.bulkDeleteLeads);
    //test interface
    router.get("/add-lead", loginController.checkLoggedIn, (req, res) => {
        return res.render("add_Lead.ejs", { userEmail: req.user.email })
    });
    router.get("/crm", loginController.checkLoggedIn, (req, res) => {
        return res.render("crm.ejs")
    });
    router.post('/add-tag-to-leads', loginController.checkLoggedIn, homePageController.addTagToLeads);
    router.get('/get-tags', loginController.checkLoggedIn, homePageController.getTags);
    router.post('/remove-tag', loginController.checkLoggedIn, homePageController.removeTag);
    router.post('/remove-attachment', loginController.checkLoggedIn, homePageController.removeAttachment);
    return app.use("/", router);
};

module.exports = initWebRoutes;
