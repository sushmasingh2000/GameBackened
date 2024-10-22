const { failMsg } = require("../helper/helperResponse");
const { queryDb } = require("../helper/adminHelper");

exports.Registration = async (req, res) => {
    const { username, email, mobile_no, confirm_password, set_password } = req.body;

    // Basic validation
    if (!username || !email || !mobile_no || !set_password || !confirm_password) {
        return res.status(400).json({ msg: 'All fields are required.' });
    }

    // Password validation
    if (set_password !== confirm_password) {
        return res.status(400).json({ msg: 'Passwords do not match.' });
    }

    try {
        const checkQuery = 'SELECT * FROM Registration WHERE email = ? OR mobile_no = ?';
        const duplicateUser = await queryDb(checkQuery, [email, mobile_no]);
        if (duplicateUser.length > 0) {
            return res.status(400).json({ msg: 'Email or mobile number already registered.' });
        }

        const insertQuery = 'INSERT INTO Registration (username, email, mobile_no, set_password) VALUES (?, ?, ?, ?)';
        const result = await queryDb(insertQuery, [username, email, mobile_no, set_password]);
        const userId = result.insertId;

        // Insert registration bonus
        const bonusInsertQuery = 'INSERT INTO bonus (user_id, amount, Description) VALUES (?, ?, ?)';
        await queryDb(bonusInsertQuery, [userId, 10, `Registration bonus for user ID ${userId}`]);

        return res.status(201).json({
            msg: "Registered successfully",
            userId: userId,
            data: result,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            msg: "Something went wrong in the API call.",
        });
    }
};

exports.Bonus = async (req, res) => {
    const userId = req.params.userId;

    // Validate userId presence
    if (!userId) {
        return res.status(400).json({ msg: 'userId is mandatory' });
    }

    // Fetch user bonuses
    try {
        const userBonusesQuery = 'SELECT * FROM bonus WHERE user_id = ?';
        const userBonuses = await queryDb(userBonusesQuery, [userId]);
        
        if (!userBonuses.length) {
            return res.status(404).json({ msg: 'No bonuses found for this user.' });
        }

        res.json(userBonuses);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            msg: "Something went wrong while fetching bonuses.",
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
            msg: 'Login SuccessFully .',
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


exports.Predection = async(req , res) =>{

 const {amount ,bet_number , gameid , period_id , user_id}  = req.body
  if (!amount || !bet_number || !gameid || !period_id || !user_id){
    return toast(" Everything is required")
}
try{
    const query =  " SELECT * FROM BET WHERE bet_number = ?"
    const betdata = await queryDb(query[data])
}
catch{
    console.log(e)
    return response
}
 }










