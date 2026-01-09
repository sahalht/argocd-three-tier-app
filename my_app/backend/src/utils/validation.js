const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName
};
