import express from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import homePageController from "../controllers/homePageController";
import initPassportLocal from "../controllers/passportLocalController";
import addLeadController from "../controllers/addLeadController";
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
    router.post('/delete-lead', homePageController.deleteLead);
    //update lead
    router.get('/edit-lead/:id', homePageController.getEditPage);
    router.post('/update-lead', homePageController.postUpdateLead);
    //test interface
    router.get("/home", (req, res) => {
        return res.render("home.ejs")
    });
    router.get("/add-lead", (req, res) => {
        return res.render("add_Lead.ejs")
    });
    router.get("/crm", (req, res) => {
        return res.render("crm.ejs")
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;
