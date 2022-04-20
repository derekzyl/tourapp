const User = require('./../model/userModel')


exports.signUp = async(req.res, next)=>{
    const newUser = await User.create(req.body)
    res.status(201).json(){
        success: true,
            status: 'success',
            date: {
            newUser
                }
    }
}