<template>
  <div class="sidebar">
    <p class="semesterName">{{ semesterName.name }}</p>
    <p class="semesterCount">{{ semester.currentSemesterCount }}. Semester</p>
    <p class="semesterECTS">{{ ects(semester) }} ECTS</p>

    <button
      v-if="semester.plannedCourses.length == 0"
      class="deleteSemester"
      @click="deleteSemester(semesterIndex)"
    >
      Freies Semester löschen
    </button>
  </div>
</template>

<script>
export default {
  props: {
    semester: {
      type: Object,
      required: true,
    },
    semesterIndex: {
      type: Number,
      required: true,
    },
    semesterName: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ects(semester) {
      var ects = 0;
      for (let i in semester.plannedCourses) {
        if (semester.plannedCourses[i].ects)
          ects += semester.plannedCourses[i].ects;
      }
      return ects;
    },
    deleteSemester(semesterIndex) {
      this.$store.dispatch("studyplan/deleteSemester", {
        semesterIndex,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.semesterCount {
  font-size: 18px;
  padding: 10px;
  font-weight: bold;
  color: black;
  text-decoration: underline 2px;
  text-decoration-color: $htwGruen ;
  text-underline-offset: 4px ;
}

.semesterName {
  font-size: 15px;
  color: black;
}

.semesterECTS {
  font-size: 12px;
}
p {
  margin: 0;
  font-weight: 700;
}

.sidebar {
  min-height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 14px;
}

.deleteSemester {
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
