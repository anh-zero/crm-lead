import pool from '../config/connectDB';

let createNewLead = async (req, res) => {
    let { is_company, name, organization, email, owner, status, salutation, position, gender, source, campaign, next_contact, next_at, end_at, notes, address_type, address_name, street_address1, street_address2, city, district,
        state_province, country, postal_code, forward, mobile_phone, fax, website, lead_type, market_segment, industry, request_type, company, nation, print_language, unsubscribe, followed_blog, created_by } = req.body;

    // Convert 'is_company' to an integer
    is_company = is_company === 'on' ? 1 : 0;
    unsubscribe = unsubscribe === 'on' ? 1 : 0;
    followed_blog = followed_blog === 'on' ? 1 : 0;
    created_by = req.user.email;
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Get the count of existing leads to generate the sequence number
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM leads');
    const count = rows[0].count + 1;

    // Generate the sequence number with leading zeros
    const sequenceNumber = String(count).padStart(5, '0');

    // Construct the lead code
    const code = `CRM-LEAD-${currentYear}-${sequenceNumber}`;

    // Insert the new lead into the database and get the result
    const [result] = await pool.execute(
        'INSERT INTO leads(code, is_company, name, organization, email, owner, status, salutation, position, gender, source, campaign, next_contact, next_at, end_at, notes,address_type, address_name, street_address1, street_address2, city, district, state_province, country, postal_code, forward, mobile_phone, fax, website,lead_type, market_segment, industry, request_type, company, nation, print_language, unsubscribe, followed_blog,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)',
        [code, is_company, name, organization, email, owner, status, salutation, position, gender, source, campaign, next_contact, next_at, end_at, notes, address_type, address_name, street_address1, street_address2, city, district,
            state_province, country, postal_code, forward, mobile_phone, fax, website, lead_type, market_segment, industry, request_type, company, nation, print_language, unsubscribe, followed_blog, created_by]
    );

    // Get the ID of the newly inserted lead
    const newLeadId = result.insertId;

    // Redirect to the edit page of the new lead
    return res.redirect(`/edit-lead/${newLeadId}`);
};


module.exports = {
    createNewLead
};