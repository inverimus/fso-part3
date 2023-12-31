const config = require('../utils/config')

const mongoose = require('mongoose')

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => { console.log('connected to MongoDB')})  
  .catch((error) => { console.log('error connecting to MongoDB:', error.message)})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Minimum length of 3 required'],
    required: [true, 'Name required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{6,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number.`
    },
    required: [true, 'Phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)