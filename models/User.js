const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)

const userSchema = mongoose.Schema({
    username: {type: String, required: true, minlength: 3, unique: true},
    password: String,
    name: {type: String, required: true},
    blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
 })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)  