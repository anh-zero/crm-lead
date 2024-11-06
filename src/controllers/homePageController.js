import pool from "../config/connectDB";
let getHomePage = (req, res) => {
    return res.render("homepage.ejs", {
        user: req.user
    })
};
let showLeads = async (req, res) => {
    let data = [];
    const [rows, fields] = await pool.execute('select * from leads');
    return res.render('lead.ejs', { dataUser: rows });
}
let deleteLead = async (req, res) => {
    let userId = req.body.userId;
    await pool.execute('delete from leads where id = ?', [userId])
    return res.redirect('/lead');
}
let getEditPage = async (req, res) => {
    let id = req.params.id;
    let [user] = await pool.execute('select * from leads where id = ?', [id]);
    // return res.send(JSON.stringify(user))
    return res.render('update_Lead.ejs', { dataUser: user[0] }); // x <- y
}
let postUpdateLead = async (req, res) => {
    let { name, organization, owner, status, code } = req.body;
    await pool.execute('update leads set name = ?, organization = ? , owner = ? , status = ? where code = ?',
        [name, organization, owner, status, code]);
    return res.redirect('/lead');
}
module.exports = {
    getHomePage: getHomePage,
    showLeads: showLeads,
    deleteLead: deleteLead,
    getEditPage: getEditPage,
    postUpdateLead: postUpdateLead
};
