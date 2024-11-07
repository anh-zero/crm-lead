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
    let userId = req.params.userId;
    await pool.execute('delete from leads where id = ?', [userId])
    return res.redirect('/lead');
}
let getEditPage = async (req, res) => {
    let id = req.params.id;
    let [user] = await pool.execute('SELECT * FROM leads WHERE id = ?', [id]);
    let dataUser = user[0];

    // Format dates to YYYY-MM-DD
    if (dataUser.next_at) {
        dataUser.next_at = new Date(dataUser.next_at).toISOString().split('T')[0];
    } else {
        dataUser.next_at = '';
    }

    if (dataUser.end_at) {
        dataUser.end_at = new Date(dataUser.end_at).toISOString().split('T')[0];
    } else {
        dataUser.end_at = '';
    }

    return res.render('update_Lead.ejs', { dataUser });
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
        'update leads set is_company = ?, name = ?, organization = ?, email = ?, owner = ?, status = ?, salutation = ?, position = ?, gender = ?,source = ?, campaign = ?, next_contact = ?, next_at = ?, end_at = ?,notes = ?, address_type = ?, address_name = ?, street_address1 = ?, street_address2 = ?, city = ?, district, state_province = ?, country = ?, postal_code = ?, forward = ?, mobile_phone = ?, fax = ?, website = ?, lead_type = ?, market_segment = ?, industry = ?,request_type = ?, company = ?, nation = ?, print_language = ?, unsubscribe = ?, followed_blog = ? where id = ?',
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
let bulkDeleteLeads = async (req, res) => {
    const ids = req.body.ids; // This should be an array of IDs
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).send('Invalid request data.');
    }

    try {
        // Construct a query to delete multiple leads
        const placeholders = ids.map(() => '?').join(',');
        const sql = `DELETE FROM leads WHERE id IN (${placeholders})`;
        await pool.execute(sql, ids);
        res.status(200).send('Leads deleted successfully.');
    } catch (error) {
        console.error('Error deleting leads:', error);
        res.status(500).send('Internal Server Error.');
    }
};

module.exports = {
    getHomePage: getHomePage,
    showLeads: showLeads,
    deleteLead: deleteLead,
    getEditPage: getEditPage,
    postUpdateLead: postUpdateLead,
    bulkDeleteLeads: bulkDeleteLeads
};
