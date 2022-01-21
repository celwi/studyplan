const User = require("../model/user"),
ModalCourse = require("../model/modalCourse"),
CourseSelection = require("../model/courseSelection"),
Semester = require("../model/semester"),
StudyPlan = require("../model/studyPlan"),
mongoose = require("mongoose");

const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });

  async function loadCourseSelection(){
    await CourseSelection.deleteMany({});
    await StudyPlan.deleteMany({});
    const semester = await Semester.findOne({name: "SoSe22"})
    let users = await User.find();
    const courses = await ModalCourse.find();
      let coursesForSelection = [];
      courses.forEach((course) => {
        coursesForSelection.push({code: course.code, name: course.name, ects: 5});
      });
     
      const studyplan = {
        program:  {
          code:"IMI-B",
          name:"Internationale Medieninformatik B",
          version:"StuPo 28/12"
          },
          semesterPlans: [],
      };
      for(let i = 0; i < users.length; i++){
        let unbookedCourses = [];
        coursesForSelection.forEach((course) => unbookedCourses.push(course));
        let bookedcourses = unbookedCourses.sort((a, b) => 0.5 - Math.random()).splice(0,(Math.floor(Math.random() * (unbookedCourses.length) + 1)));
        bookedcourses.forEach((element, index) => bookedcourses[index] ={name: element.name, code: element.code,ects: element.ects, priority: index + 1});
        let newCourseSelection = {
          semesterPlans: [
            {
              semester: semester._id,
              unbookedCourses: unbookedCourses,
              bookedCourses: bookedcourses,
              selectionReasons: [],
            },
          ],
        };
        const createdStudyPlan = await StudyPlan.create(studyplan);
        const courseSelection = await CourseSelection.create(newCourseSelection);
        let test = await User.findByIdAndUpdate(users[i]._id, 
          {
            $set: {
              courseSelection: courseSelection._id,
              studyPlan: createdStudyPlan._id,
            },
          },
          {new: true},
        ).populate("courseSelection");
        console.log(test);

      }

      //console.log(JSON.stringify(courseSelection));
      console.log("finished");
      
    //console.log(`found the current semester: ${currSemester.name}`);
    return ".";
  }
  loadCourseSelection().then(() => {
    mongoose.disconnect();
    console.log("database connection closed after seeding.");
  });
  