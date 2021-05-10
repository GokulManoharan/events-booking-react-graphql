const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken')

module.exports = {
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => ({ ...user._doc, password: null }))
        } catch (err) {
            throw err
        }
    },
    // AuthData: async() => {

    // },
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save()
                    .then(result => {
                        return { ...result._doc, password: null }
                    })
                    .catch(err => {
                        console.log(err)
                        throw err
                    })
            })
            .catch(err => {
                throw err
            })
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email});
        if(!user){
            throw new Error('Invalid credentials!')
        }
        const isMatching = await bcrypt.compare(password, user.password);
        if(!isMatching){
            throw new Error('Invalid credentials!')
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'extrasecretkey',{
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}