const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(
	process.env.MONGODB_URI, { useNewUrlParser: true }
).then(r => console.log('connected')).catch(e => console.log('failed:',e))

const personSchema = new mongoose.Schema({ name: String,number: String })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)