import ProgramService from "@/services/ProgramService.js";

export const namespaced = true;

export const state = {
  programs: [],
  program: {},
  programsTotal: 0,
};

export const mutations = {
  SET_PROGRAMS(state, programs) {
    state.programs = programs;
  },
  SET_PROGRAMS_TOTAL(state, programsTotal) {
    state.programsTotal = programsTotal;
  },
  SET_PROGRAM(state, program) {
    state.program = program;
  },
};

export const actions = {
  fetchPrograms({ commit }) {
    ProgramService.fetchPrograms()
      .then((response) => {
        commit(
          "SET_PROGRAMS_TOTAL",
          parseInt(response.headers["x-total-count"])
        );
        commit("SET_PROGRAMS", response.data);
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: "There was a problem fetching programs: " + error.message,
        };
        console.log(notification);
      });
  },
  fetchProgram({ commit, getters }, code) {
    var program = getters.getProgramByCode(code);
    if (program) {
      commit("SET_PROGRAM", program);
    } else {
      ProgramService.fetchProgram(code)
        .then((response) => {
          commit("SET_PROGRAM", response.data);
        })
        .catch((error) => {
          const notification = {
            type: "error",
            message: "There was a problem fetching a program: " + error.message,
          };
          console.log(notification);
        });
    }
  },
};

export const getters = {
  getProgramByCode: (state) => (code) => {
    return state.programs.find((program) => program.code === code);
  },
  courses: (state) => {
    const temp = state.program.courses;
    if (!temp) return;
    return temp.sort(function (a, b) {
      //sort in ascending order
      var lowerCaseA = a.code.match(/\d+/)[0];
      var lowerCaseB = b.code.match(/\d+/)[0];
      return lowerCaseA - lowerCaseB;
    });
  },
  semester: (state, getters) => {
    const semester = [];
    for (let i in getters.courses) {
      let semesterCount = getters.courses[i].semester;
      if (semester.indexOf(semesterCount) == -1) semester.push(semesterCount);
    }
    return semester.sort();
  },
  coursesInSemester: (state, getters) => {
    const coursesInSemester = {};
    for (let i in getters.semester) {
      if (getters.semester[i] == 0) continue; //ohne Wahlpflichtfächer
      let courses = [];
      for (let y in getters.courses) {
        if (getters.courses[y].code.includes(".")) continue; //ohne B20.1, also required Submodule
        if (getters.semester[i] == getters.courses[y].semester)
          courses.push(getters.courses[y]);
      }
      coursesInSemester[getters.semester[i]] = courses;
    }
    return coursesInSemester;
  },
};
