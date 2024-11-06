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
    let {
        is_company, name, organization, email, owner, status, salutation,
        position, gender, source, campaign, next_contact, next_at, end_at,
        notes, address_type, address_name, street_address1, street_address2,
        city, district, state_province, country, postal_code, forward,
        mobile_phone, fax, website, lead_type, market_segment, industry,
        request_type, company, nation, print_language, unsubscribe,
        followed_blog, id
    } = req.body;
    is_company = is_company === 'on' ? 1 : 0;
    unsubscribe = unsubscribe === 'on' ? 1 : 0;
    followed_blog = followed_blog === 'on' ? 1 : 0;
    await pool.execute(
        'update leads set is_company = ?, name = ?, organization = ?, email = ?, owner = ?, status = ?, salutation = ?, position = ?, gender = ?,source = ?, campaign = ?, next_contact = ?, next_at = ?, end_at = ?,notes = ?, address_type = ?, address_name = ?, street_address1 = ?, street_address2 = ?, city = ?, district = ?, state_province = ?, country = ?, postal_code = ?, forward = ?, mobile_phone = ?, fax = ?, website = ?, lead_type = ?, market_segment = ?, industry = ?,request_type = ?, company = ?, nation = ?, print_language = ?, unsubscribe = ?, followed_blog = ? where id = ?',
        [
            is_company, name, organization, email, owner, status, salutation,
            position, gender, source, campaign, next_contact, next_at, end_at,
            notes, address_type, address_name, street_address1, street_address2,
            city, district, state_province, country, postal_code, forward,
            mobile_phone, fax, website, lead_type, market_segment, industry,
            request_type, company, nation, print_language, unsubscribe,
            followed_blog, id
        ]
    );
    return res.redirect('/lead');
}
module.exports = {
    getHomePage: getHomePage,
    showLeads: showLeads,
    deleteLead: deleteLead,
    getEditPage: getEditPage,
    postUpdateLead: postUpdateLead
};
