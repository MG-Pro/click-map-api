import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema({
  fingerprint: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('User', UserSchema)

export default User
