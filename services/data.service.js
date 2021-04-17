const db = require('./db');

let accountDetails = {
    1000: { acno: 1000, balance: 10000, username: "userone", password: "testuser1" },
    1001: { acno: 1001, balance: 20000, username: "usertwo", password: "testuser2" },
    1002: { acno: 1002, balance: 30000, username: "userthree", password: "testuser3" }
}
let currentUser;
//   arrow functon
const register = (acno, username, password) => {
    return db.User.findOne({
        acno
    }).then(user => {
        console.log(user)
        if (user) {
            return {
                status: false,
                statusCode: 422,
                message: "user already exit,pls login"

            }
        }
        else {
            const newUser = new db.User({
                acno,
                balance: 0,
                username,
                password
            });
            newUser.save();
            return {
                status: true,
                statusCode: 200,
                message: "succesfully registered"

            }
        }
    })
}




const login = (req, accno, password) => {
    var acno = parseInt(accno);
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            req.session.currentUser = user.acno
            return {
                status: true,
                statusCode: 200,
                message: "Login successful",
                name:user.username
            }
        }
        return {
            status: false,
            statusCode: 422,
            message: "inavalid credentials"

        }
    })
}



const deposit = (acno, pwd, amnt) => {
    var amount = parseInt(amnt);
    return db.User.findOne({
        acno,
        password: pwd
    })
        .then(user => {
            if (!user) {
                return {
                    status: false,
                    statusCode: 422,
                    message: "Invalid Account Number"


                }
            }
            user.balance += amount;
            user.save();
            return {
                status: true,
                statusCode: 200,
                message: "Account credited with amount " + amount,
                balance: user.balance

            }

        })

}


const withdraw = (req,acno, pwd, amnt) => {
    var amount = parseInt(amnt);
    return db.User.findOne({
        acno,
        password: pwd
    })
        .then(user => {
            if (!user) {
                return {
                    status: false,
                    statusCode: 422,
                    message: "Invalid Account Number"


                }
            }
            if(req.session.currentUser!=acno)
            {
                return{
                    status: false,
                    statusCode: 422,
                    message: "permision denied"

                }
            }
            if (user.balance < amount) {
                return {
                    status: true,
                    statusCode: 200,
                    message: "Low Balance"
                }
            }
            user.balance-=amount;
            user.save();
            return {
                status: true,
                statusCode: 200,
                message: "Account debited with amount ",
                balance: user.balance

            }

        })

}


module.exports = {
    register,
    login,
    deposit,
    withdraw

}


