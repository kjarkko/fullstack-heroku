const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-qytxr.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { 
  useNewUrlParser: true 
})

/*const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML on helppoa',
  date: new Date(),
  important: true,
})

note.save().then(response => {
  console.log('note saved!');
  mongoose.connection.close();
})*/


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const save = (name, number) => {
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(response => {
    console.log('saved!')
    mongoose.connection.close()
  }).catch(e => console.log(e))
}

const all = () => {
  Person.find({}).then(res => {
    res.forEach(p => console.log(p.name, p.number))
    mongoose.connection.close()
  }).catch(e => console.log(e))
}

const args = process.argv
const len = args.length
if(len === 3)
  all()
else if(len === 5)
  save(args[3], args[4])
else 
  console.log(`invalid number of arguments, got ${len}, expected 3 or 5. argv: ${process.argv}`)
