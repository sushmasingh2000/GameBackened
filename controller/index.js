const { failMsg } = require("../helper/helperResponse");
const { queryDb } = require("../helper/adminHelper");

exports.Registration = async (req, res) => {

    const { username, email, mobile_no, confirm_password, set_password } = req.body;
    if (!username || !email || !mobile_no || !set_password || !confirm_password) {
        return res.status(400).json({ msg: 'Username, email, mobile_no, confirm_password, set_password are required' });
    }
    try {
        const checkQuery = 'SELECT * FROM Registration WHERE email = ? OR mobile_no = ?';
        const DuplicateUser = await queryDb(checkQuery, [email, mobile_no]);
        if (DuplicateUser.length > 0) {
            return res.status(400).json({ msg: 'Email or mobile number already registered' });
        }
        const insertQuery = 'INSERT INTO Registration (username, email, mobile_no, confirm_password, set_password) VALUES (?, ?, ?, ?, ?)';
        const result = await queryDb(insertQuery, [username, email, mobile_no, confirm_password, set_password]);
        const userId = result.insertId;
        return res.status(200).json({
            msg: "Registered successfully",
            data: result,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            msg: "Something went wrong in the API call",
        });
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'email and password are required' });
    }
    try {
        const query = 'SELECT * FROM Registration WHERE email = ?';
        const users = await queryDb(query, [email]);
        if (users.length === 0) {
            return res.status(401).json({ msg: 'User not registered' });
        }
        const user = users[0];
          if (password !== user.set_password) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }
        return res.status(200).json({
            msg: 'Login successful',
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                mobile_no: user.mobile_no,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: 'Something went wrong in the API call' });
    }
};

exports.Profile = async (req ,res)=>{
    try{
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const query = "SELECT * FROM  profile WHERE userId = ? "
        const profiles = await queryDb(query [userId]);
        if (profiles.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res(200).json({
          msg:"All Data Succeffully" , profiles
        })
    }
    catch (error) {
        console.error(error.stack);
        res.status(500).json({error :'Database error'})
    }
}








