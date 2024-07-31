const mongoose = require("mongoose")

const Schema  = mongoose.Schema;
const bcrypt = require("bcrypt")

const userSchema = new Schema ({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        uinque:true,
        lowercase:true,
        validate:{
            validator: (v) => {
                // Regular expression to validate email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//Methods to compare passords
userSchema.methods.comparePassword = async (candidatePassword)=>{
    return bcrypt.compare(candidatePassword,this.password)
}


const User = mongoose.model('User' , userSchema)

module.exports = User