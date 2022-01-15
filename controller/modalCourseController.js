//const modalCourse = require("../model/modalCourse");
//const { populate } = require("../model/user");
const User = require("../model/user"),
  ModalCourse = require("../model/modalCourse");
module.exports = {
  create: (req, res) => {
    let modalCourseParams = {
      name: req.body.name,
      code: req.body.code,
      semester: req.body.semester,
      availablePlaces: req.body.availablePlaces,
      students: [],
      reasonsForSelection: {
        teacher: 0,
        time: 0,
        interest: 0,
        easy: 0,
        careerRelevant: 0,
        other: 0,
      },
    };
    ModalCourse.create(modalCourseParams)
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error saving ModalCourse: ${error.message}`);
        return;
      });
  },
  delete: (req) => {
    ModalCourse.findByIdAndRemove(req.params.id)
      .then(async () => {})
      .catch((error) => {
        console.log(`Error deleting ModalCourse by ID: ${error.message}`);
        return;
      });
  },
  show: (req, res) => {
    ModalCourse.findById(req.params.id)
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error fetching modalCourse by ID: ${error.message}`);
      });
  },
  showAll: (req, res) => {
    ModalCourse.find()
      .populate("semester students")
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error Fetching ModalCourse: ${error.message}`);
      });
  },
  update: (req, res) => {
   ModalCourse.findOne({code: req.body.code, semester: req.body.semester})
   .then((modalCourse) => {
    let selectionReasons = {
        teacher: 0,
        time: 0,
        interest: 0,
        easy: 0,
        careerRelevant: 0,
        other: 0,
      };
    
      
      if(selectionReasons[`${req.body.reason}`] != undefined)selectionReasons[`${req.body.reason}`]++; 
      else selectionReasons["other"]++;
      modalCourse.reasonsForSelection = selectionReasons;
      modalCourse.save((err) => {
        if (err) {
          console.log(err.message);
          return;
        } else {
          res.json(modalCourse);
        }
      });
   })
   .catch((error) => {
     console.log(`error updating modalCourse: ${error.message}`);
   });
  },
  updateAll: (req, res) => {
    let semesterId = req.params.id;
    ModalCourse.find({ semester: semesterId })
      .populate("semester")
      .then((modalCourses) => {
        let CoursesInThisSemester = {};

        modalCourses.forEach((modalCourse) => {
          CoursesInThisSemester[modalCourse.code] = {
            id: modalCourse._id,
            students: [],
            availablePlaces: modalCourse.availablePlaces,
          };
        });

        //CoursesInThisSemester[modalCourses[0].code] = {test:1, test2: "test"};

        User.find()
          .populate("courseSelection")
          .then((users) => {
            users.forEach((user) => {
              let currentSemesterPlan = user.courseSelection.semesterPlans.find(
                (semesterPlan) => semesterPlan.semester == semesterId
              );

              if (currentSemesterPlan)
                currentSemesterPlan.bookedCourses.forEach((course) => {
                  CoursesInThisSemester[course.code].students.push({
                    user: user._id,
                    priority: course.priority,
                  });
                });
              // CoursesInThisSemester[currentSemesterPlan.bookedCourses[0].code].students = ["test"];
            });
            for (let property in CoursesInThisSemester) {
              CoursesInThisSemester[property].students
                .sort(() => 0.5 - Math.random())
                .sort(
                  (student1, student2) => student1.priority > student2.priority
                );
              const finalArray = CoursesInThisSemester[property].students
                .slice(0, CoursesInThisSemester[property].availablePlaces)
                .map((element) => element.user);
              ModalCourse.findByIdAndUpdate(
                CoursesInThisSemester[property].id,
                {
                  $set: {
                    students: finalArray,
                  },
                },
                { new: true }
              )
                .populate("students semester")
                .then((moin, err) => {
                  if (err) console.log(err.message);
                  else res.json(moin);
                });
            }
            //61d337cf87268f001e8ee21b
          });

        /*
      User.find()
        .populate("courseSelection")
        then((users) => {
          users.forEach((user) => {
            const userId = user._id
            user.courseSelection.semesterPlans.find(
              (semesterPlan) => semesterPlan.semester === semesterId)
              .bookedCourses.forEach((course) => {
                CoursesInThisSemester[course.code].students.push({
                  user: userId,
                  priority: course.priority,
                });
              });
          });
        
        });
        */
      })
      .catch((error) => {
        console.log(`Error updating courses: ${error.message}`);
      });
    /*
    if(999 == 22)return;
    User.find()
      .populate("courseSelection")
      .then((users) => {
        let courseSelections = [];
        for(user in users){
          for(semesterplan in user.courseSelection.semesterPlans){
            if(semesterplan.semester === semesterId)courseSelections.push(
              {user: user, bookedCourses: semesterplan.bookedCourses,});
          }
        }
      

        ModalCourse.updateMany(
          {semester: semesterId}, 
          {
            students: users,
          },
          {new: true}
          )
          .populate('semester students')
          .then((modalCourses, err) => {
            if (err)console.log(err.message);
            else res.json(modalCourses);
          });
      });
      */
  },
};
