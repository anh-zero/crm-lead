import pool from '../config/connectDB';

let createNewLead = async (req, res) => {
    let { code, name, organization, email, owner, status } = req.body;

    await pool.execute('insert into leads(code, name, organization, email, owner, status) values (?, ?, ?, ?, ?,? )',
        [code, name, email, organization, owner, status]);

    return res.redirect('/lead')
}

module.exports = {
    createNewLead
}