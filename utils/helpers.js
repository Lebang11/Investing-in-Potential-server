const bcrypt = require('bcryptjs');

const hashPassword = async function (password) {
    const salt =  bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    return hashedPassword
}

const comparePassword = async function (raw, hash) {
    return await bcrypt.compareSync(raw, hash);
}

module.exports = {
    hashPassword,
    comparePassword
}

