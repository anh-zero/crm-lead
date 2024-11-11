import express from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import homePageController from "../controllers/homePageController";
import initPassportLocal from "../controllers/passportLocalController";
import addLeadController from "../controllers/addLeadController";

import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/image/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

/*
init passport routes
 */
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
    router.get('/lead', homePageController.showLeads)
    //delete lead
    router.get('/delete-lead/:userId', homePageController.deleteLead);
    //update lead
    router.get('/edit-lead/:id', homePageController.getEditPage);
    router.post('/update-lead', upload.single('profile_image'), homePageController.postUpdateLead);
    // Bulk Delete Leads
    router.post('/delete-leads', homePageController.bulkDeleteLeads);
    //test interface
    router.get("/home", (req, res) => {
        return res.render("home.ejs")
    });
    router.get("/add-lead", (req, res) => {
        return res.render("add_Lead.ejs")
    });
    router.get("/crm", (req, res) => {
        return res.render("update_Lead.ejs")
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;
