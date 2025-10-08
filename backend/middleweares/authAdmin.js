import jwt from 'jsonwebtoken'

//admin authentication middlewear

const authAdmin = async (req, res, next) => {
    try {
        const atoken = req.headers.atoken;

        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized. Login again.' });
        }

        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: 'Not Authorized. Invalid Token.' });
        }

 
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;