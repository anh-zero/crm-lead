import pool from "../config/connectDB";

let getHomePage = (req, res) => {
    return res.render("homepage.ejs", {
        user: req.user
    })
};
let showLeads = async (req, res) => {
    let userEmail = req.user.email;
    // Extract filters from the query parameters
    let { name, status, code, created_by, assigned_for } = req.query;

    // Initialize the base query and parameters array
    let query = 'SELECT * FROM leads';
    let params = [];
    let conditions = [];

    // Add conditions based on provided filters
    if (name && name.trim() !== '') {
        conditions.push('name LIKE ?');
        params.push(`%${name}%`);
    }

    if (status && status.trim() !== '') {
        conditions.push('status = ?');
        params.push(status);
    }

    if (code && code.trim() !== '') {
        conditions.push('code LIKE ?');
        params.push(`%${code}%`);
    }
    if (created_by && created_by.trim() !== '') {
        conditions.push('created_by = ?');
        params.push(created_by);
    }
    if (assigned_for && assigned_for.trim() !== '') {
        conditions.push('assigned_for = ?');
        params.push(assigned_for);
    }

    // Append WHERE clause if there are any conditions
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Append ORDER BY clause if needed
    query += ' ORDER BY updated_at DESC';
    // Execute the query
    const [rows] = await pool.execute(query, params);
    // Fetch user emails
    let [userRows] = await pool.execute('SELECT email FROM users');
    let userEmails = userRows.map(row => row.email);

    // Render the template with data and query parameters
    res.render('lead.ejs', {
        dataUser: rows,
        query: req.query,
        userEmails: userEmails,
        userEmail: userEmail
    });
};
let deleteLead = async (req, res) => {
    let userId = req.params.userId;
    await pool.execute('delete from leads where id = ?', [userId])
    return res.redirect('/lead');
}
let getEditPage = async (req, res) => {
    let id = req.params.id;
    let [user] = await pool.execute('SELECT * FROM leads WHERE id = ?', [id]);
    let dataUser = user[0];
    let [attachmentRows] = await pool.execute(
        'SELECT * FROM attachments WHERE lead_id = ?',
        [id]
    );
    let [userRows] = await pool.execute('SELECT email FROM users');
    let userEmails = userRows.map(row => row.email);

    if (dataUser.next_at) {
        const nextAtDate = new Date(dataUser.next_at);
        dataUser.next_at =
            nextAtDate.getFullYear() +
            '-' +
            String(nextAtDate.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(nextAtDate.getDate()).padStart(2, '0');
    } else {
        dataUser.next_at = '';
    }

    if (dataUser.end_at) {
        const endAtDate = new Date(dataUser.end_at);
        dataUser.end_at =
            endAtDate.getFullYear() +
            '-' +
            String(endAtDate.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(endAtDate.getDate()).padStart(2, '0');
    } else {
        dataUser.end_at = '';
    }

    res.render('update_Lead.ejs', {
        dataUser: dataUser,
        attachments: attachmentRows,
        userEmails: userEmails
    });
}

let postUpdateLead = async (req, res) => {
    try {
        // Access form data from req.body
        let {
            is_company, name, organization, email, owner, status, salutation,
            position, gender, source, campaign, next_contact, next_at, end_at,
            notes, address_type, address_name, street_address1, street_address2,
            city, district, state_province, country, postal_code, forward,
            mobile_phone, fax, website, lead_type, market_segment, industry,
            request_type, company, nation, print_language, unsubscribe,
            followed_blog, assigned_for, id
        } = req.body;

        // Convert checkbox values to integers
        is_company = is_company === 'on' ? 1 : 0;
        unsubscribe = unsubscribe === 'on' ? 1 : 0;
        followed_blog = followed_blog === 'on' ? 1 : 0;

        // Handle uploaded files
        const files = req.files;
        let profile_image = files['profile_image'] ? files['profile_image'][0].filename : null;
        let attachments = files['attachments'] || [];

        // Process profile image (if any)
        if (profile_image) {
            // Include profile_image in your SQL query and parameters
        }

        // Build your SQL query to update the lead
        let query = `
            UPDATE leads SET
                is_company = ?, name = ?, organization = ?, email = ?, owner = ?,
                status = ?, salutation = ?, position = ?, gender = ?, source = ?,
                campaign = ?, next_contact = ?, next_at = ?, end_at = ?, notes = ?,
                address_type = ?, address_name = ?, street_address1 = ?, street_address2 = ?,
                city = ?, district = ?, state_province = ?, country = ?, postal_code = ?,
                forward = ?, mobile_phone = ?, fax = ?, website = ?, lead_type = ?,
                market_segment = ?, industry = ?, request_type = ?, company = ?, nation = ?,
                print_language = ?, unsubscribe = ?, followed_blog = ?, assigned_for = ?
                ${profile_image ? ', profile_image = ?' : ''}
            WHERE id = ?`;

        // Build parameters array
        let params = [
            is_company, name, organization, email, owner, status, salutation,
            position, gender, source, campaign, next_contact, next_at, end_at,
            notes, address_type, address_name, street_address1, street_address2,
            city, district, state_province, country, postal_code, forward,
            mobile_phone, fax, website, lead_type, market_segment, industry,
            request_type, company, nation, print_language, unsubscribe,
            followed_blog, assigned_for
        ];

        if (profile_image) {
            params.push(profile_image);
        }

        params.push(id);

        // Execute the query
        await pool.execute(query, params);

        // Process attachments (if any)
        if (attachments.length > 0) {
            for (const file of attachments) {
                await pool.execute(
                    'INSERT INTO attachments (lead_id, filename, original_name) VALUES (?, ?, ?)',
                    [id, file.filename, file.originalname]
                );
            }
        }

        // Redirect back to the edit page
        return res.redirect(`/edit-lead/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

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
