const jwt = require('jsonwebtoken');

const generateJWToken = async ( id, email) => {
    console.log("ID>>>", id, email);
 const token = jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    {expiresIn: "1d"},
 );
 return token;
}

module.exports = generateJWToken;