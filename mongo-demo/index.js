const mongoose =require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/playground')
  .then(() => console.log('Connected to MongoDB....'))
  .catch(err => console.error('Could not connect to MongoDB....', err))

  
  const courseSchema= new mongoose.Schema({
    name: String,
    author: String,
    tags:[String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
  });

  const Course=mongoose.model('Course', courseSchema);

  async function createCourse(){
  const course=new Course({
    name: 'Angular Course',
    author: 'Ritika',
    tags: ['node','frontend'],
    isPublished: true
  });

  const result=await course.save();
  console.log(result);
}

createCourse();