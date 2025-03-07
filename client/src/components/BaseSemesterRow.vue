<template>
  <div>
    <div
      class="semesterRow"
      @drop.stop="moveCourse($event, semester.plannedCourses)"
      @dragover.prevent
      @dragenter.prevent
    >
      <BaseSemesterRowSidebar
        :semester="semester"
        :semester-index="semesterIndex"
        :semester-name="semesterName"
      />

      <div class="courses">
        <div
          v-for="(course, $courseIndex) in semester.plannedCourses"
          :key="$courseIndex"
          class="course"
          draggable="true"
          :style="{
            width: `${courseWidth(course)}px`,
          }"
          @dragstart="pickupCourse($event, $courseIndex, semesterIndex)"
          @drop.stop="moveCourse($event, semester.plannedCourses, $courseIndex)"
        >
          <router-link
            class="course-content-container"
            :to="{
              name: 'baseModalParentCourse',
              params: {
                program: studyPlan.program.code,
                version: studyPlan.program.version,
                code: course.code,
                semester: semesterName.name,
              },
            }"
            draggable="false"
          >
            <div
              class="course-content-container-content"
              :aria-label="course.name + ', ' + checkStatus(course)"
              :class="{
                'course-content-container-content--booked': course.booked,
                'course-content-container-content--passed': course.passed,
              }"
            >
              <div class="course-content-container-content-text">
                <p class="course-content-container-content-text--code">
                  {{ course.code }}
                </p>
                <p
                  :style="{
                    fontSize: courseWidth(course) < 50 ? '9px' : '12px',
                  }"
                >
                  {{ course.name }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
    coursesInSemester: {
      type: Array,
      required: true,
    },
  },

  computed: {
    ...mapState("course", ["course"]),
    ...mapState("studyplan", ["studyPlan"]),
  },
  methods: {
    courseWidth(course) {
      return course.ects * 30 + (course.ects / 5 - 1) * 30;
    },

    pickupCourse(e, fromCourseIndex, fromSemesterIndex) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-course-index", fromCourseIndex);
      e.dataTransfer.setData("from-semester-index", fromSemesterIndex);
    },

    moveCourse(e, toCourses, toCourseIndex) {
      e.preventDefault();
      const fromSemesterIndex = e.dataTransfer.getData("from-semester-index");
      const fromCourses =
        this.coursesInSemester[fromSemesterIndex].plannedCourses;
      const fromCourseIndex = e.dataTransfer.getData("from-course-index");

      this.$store.dispatch("studyplan/moveCourse", {
        fromCourses,
        fromCourseIndex,
        toCourses,
        toCourseIndex,
      });
    },
    checkStatus(course){
      if(course.booked){
        var result = "Kurs belegt"
        if(course.passed){
          result = "Kurs bestanden"
        }
      }
      else{result = "Kurs wurde noch nicht belegt"}
      return result
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtBackground: #ff9e66;

.semesterRow {
  max-width: 100%;
  display: grid;
  grid-template-columns: 0.2fr 0.8fr;
  row-gap: 0px;

  .courses {
    min-width: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .course {
      margin: 20px 25px 20px 0;
      display: flex;
      align-items: center;
      min-height: 87px;
      transform: translate(0, 0);

      a {
        text-decoration: none;
        color: inherit;
      }

      &-content-container {
        transform: translate(0, 0);
        min-height: 87px;
        border-radius: 14px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;

        &-content {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 100%;
          min-height: 87px;
          background: rgba(193, 193, 193, 0.3);
          background-size: 100px 100px;
          border: 2px solid rgba(193, 193, 193, 0.3);
          border-radius: 14px;
          &:hover {
            background: #AFAFAF;
          }

          &--booked {
            background-color: $belegtBackground !important;
            border: 2px solid #ff5f01;
            &:hover {
              background-color: #ff5f01 !important;
            }
          }

          &--passed {
            background-color: rgba(118, 185, 0, 0.45) !important;
            border: 2px solid $htwGruen;
            &:hover {
              background-color: $htwGruen !important;
            }
          }

          &-text {
            max-width: 100%;
            height: 100%;

            overflow: hidden;

            p {
              font-size: 12px;
              font-weight: 700;
              padding: 3px 5px;
              margin: 0;
              max-width: 95%;
              word-wrap: break-word;
              border-radius: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
