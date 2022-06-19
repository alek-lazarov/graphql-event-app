const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user')

module.exports = {
    createUser: async (args) => {
        try {
            const user = await User.findOne({email: args.userInput.email})
    
            if(user){
                throw new Error('User exists already')
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
    
            const createdUser = await  newUser.save()
    
            return {...createdUser._doc, password: null}
    
        }
        
        catch(err) {
            throw err;
        }
    },

    login: async ({email, password}) => {
        try{
            const user = await User.findOne({email: email});

            if(!user){
                throw new Error('User does not exist!');
            }

            const success = await bcrypt.compare(password, user.password);

            if(!success){
                throw new Error('Password incorrect!');
            }

            const token = jwt.sign({
                userId: user.id,
                email: user.email
            }, 'somesupersecretkey', {
                expiresIn: '1h'
            });

            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }

        }
        catch(err){
            throw err;
        }
    }
}