const getHomePage = async (req, res) => {
    res.render("home");
}

const getSignIn = async (req, res) => {
    res.render("signin")
}

const getSignUp = async (req, res) => {
    res.render("signup")
}

module.exports = {
    getHomePage,
    getSignIn,
    getSignUp
} 