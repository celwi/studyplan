<template>
  <div v-if="!pending" :class="{ touch : isTouchDevice }">
    <div v-if="this.hasTakenSurvey" class="no-course-wrapper">
      <BaseHeading>
        <h2 class="no-course-headline">
          Danke für die Teilnahme an der Umfrage!
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Mit der Teilnahme an der Umfrage machst du zukünftige Belegphasen
        besser! Wenn du deine Kurswahl nochmal änderst kannst du auch die
        Umfrage neu machen.
      </span>
    </div>
    <div
      v-else-if="(stage.debugStage === 'none' && stage.currentStage !== 'COURSE-SELECTION') || (stage.debugStage !== 'COURSE-SELECTION' && stage.debugStage !== 'none')"
      class="no-course-wrapper"
    >
      <BaseHeading>
        <h2 class="no-course-headline">
          Aktuell ist keine Belegungsphase.
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Die nächste Belegphase startet {{ time("courseSelection", true) }}.
      </span>
    </div>
    <form
      v-else-if="
        courseSelection != null &&
        courseSelection.semesterPlans != null &&
        courseSelection.semesterPlans[0].bookedCourses.length > 0
      "
      name="form"
      @submit.prevent="updateCourses"
    >
      <BaseHeading><h1>Wieso hast du den Kurs gewählt?</h1></BaseHeading>
      <div
        v-for="(course, index) in courseSelection.semesterPlans[0]
          .bookedCourses"
        :key="course.key"
        class="survey-wrapper"
      >
        <input :name="'course' + index" :value="course.name" hidden />
        <div class="survey-left-content">
          <div class="block">
            <p>{{ course.code }} <br />{{ course.name }}</p>
          </div>
        </div>
        <div class="survey-right-content">
          <div class="survey-form">
            <div class="survey-column-wrapper">
              <div class="survey-checkbox left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[0].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[0].value"
                />
                <label :for="surveys[0].key + index">{{
                  surveys[0].name
                }}</label>
              </div>
              <div class="survey-checkbox right">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[1].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'checkbox' + index"
                  :value="surveys[1].value"
                />
                <label :for="surveys[1].key + index">{{
                  surveys[1].name
                }}</label>
              </div>

              <div class="survey-checkbox left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[2].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[2].value"
                />
                <label :for="surveys[2].key + index">{{
                  surveys[2].name
                }}</label>
              </div>

              <div class="survey-checkbox right">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[3].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[3].value"
                />
                <label :for="surveys[3].key + index">{{
                  surveys[3].name
                }}</label>
              </div>
              <div class="survey-checkbox left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[4].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[4].value"
                />
                <label :for="surveys[4].key + index">{{
                  surveys[4].name
                }}</label>
              </div>

              <div class="survey-checkbox right">
                <input
                  v-if="courseReasons[course.code]"
                  @change="toggleTextBox($event, course.code, index)"
                  :id="surveys[5].key + index"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[5].value"
                />
                <label :for="surveys[5].key + index">{{
                  surveys[5].name
                }}</label>
                <input
                  v-if="courseReasons[course.code]"
                  v-model="courseReasons[course.code].other"
                  :disabled="!textEnabled[index]"
                  class="input-text"
                  type="text"
                  name=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <button class="survey-button" type="submit">
          Ausgewählte Antworten senden
        </button>
        <p class="survey-time">
          Umfrageschluss {{ time("evaluation", true) }}.
        </p>
      </div>
    </form>
    <div v-else class="no-course-wrapper">
      <BaseHeading>
        <h2 class="no-course-headline">
          Noch keine Kurse gewählt.
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Bitte wähle zuerst welche unter „Kursbelegung“.
      </span>
    </div>
  </div>
</template>

export default { },

<script>
import { mapState, useStore, mapGetters } from "vuex";
import { computed } from "vue";
import moment from "moment";
import BaseHeading from "../components/BaseHeading.vue";
export default {
  setup() {
    const store = useStore();
    return {
      stage: computed(() => store.state.stage),
    };
  },
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
    ...mapGetters({
      hasTakenSurvey: "courseselection/getSurveyState",
    }),
    time() {
      return (stage, withPrefix) => {
        const deadline = new Date(this.stage.nextDates[stage].date);
        const gap = moment.duration(moment(deadline).diff(moment(Date.now())));
        return gap.locale("de").humanize(withPrefix);
      };
    },
  },
  async mounted() {
    this.pending = true;
    this.courseReasons = {};
    //console.log("mounted ist called");
    //console.log(this.courseReasons);
    await this.$store.dispatch("stage/fetchStage");
    await this.$store
      .dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      })
      .then(async () => {
        await this.$store.dispatch("courseselection/deleteEmptyCoursePriorities");
        //console.log("did user take survey");
        //console.log(this.hasTakenSurvey);
        if (this.courseSelection) {
          if (this.courseSelection.semesterPlans) {
            if (this.courseSelection.semesterPlans[0]) {
              if (this.courseSelection.semesterPlans[0].bookedCourses) {
                this.courseSelection.semesterPlans[0].bookedCourses.forEach(
                  (course) => {
                    this.courseReasons[course.code] = {
                      reasons: [],
                      other: "",
                    };
                  }
                );
              }
            }
          }
        }
        this.pending = false;
      })
      .catch((e) => {
        console.log(e);
      });
  },
  data() {
    /*
      reasonsForSelecton: {
        teacher: Number,
        time: Number,
        interest: Number,
        easy: Number,
        careerRelevant: Number,
      },
    */
    return {
      isTouchDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 700px)").matches,
      pending: true,
      surveyTaken: false,
      courseReasons: {},
      textEnabled: [],
      surveys: [
        { key: "lb", name: "Der/Die Dozent/in lehrt gut", value: "teacher" },
        { key: "zb", name: "Aufgrund des Zeitslots", value: "time" },
        {
          key: "ki",
          name: "Die Thematik spricht mich an",
          value: "interest",
        },
        {
          key: "rb",
          name: "Vertiefendes Wissen für Karriere",
          value: "careerRelevant",
        },
        {
          key: "ke",
          name: "Die Thematik ist trivial",
          value: "easy",
        },
        { key: "so", name: "Sonstiges", value: "" },
      ],
      // array of the enabled status for the text input field
    };
  },
  methods: {
    toggleTextBox(event, courseCode, index) {
      this.textEnabled[index] =
        this.textEnabled[index] == undefined ? true : !this.textEnabled[index];
      this.courseReasons[courseCode].other = "";
    },
    async updateCourses() {
      await this.$store.dispatch(
        "courseselection/updateCourseSelectionReasons",
        {
          courseReasons: this.courseReasons,
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.survey-time {
  font-size: x-small;
  text-align: right;
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0 auto;
  align-items: left;
  padding: 25px 0;
  max-width: 870px;
}

.survey-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  padding: 35px 0;
  max-width: 870px;
}

.block {
  position: relative;
  width: 150px;
  border-radius: 20px;
  border: 2px solid #76b900;
  background: white;
  color: black;
  text-align: center;
  padding: 10px 20px;
  margin: 40px auto;
  min-height: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.survey-form {
  display: flex;
  flex-direction: column;
}

.survey-column-wrapper {
  display: grid;
  grid-template-columns: auto auto;
  text-align: left;
  min-width: 720px;
}

.survey-column-wrapper div {
  padding: 20px 40px;
}
.survey-checkbox label {
  margin-left: 10px;
}

.survey-checkbox {
  flex: 1 1 0px;
}

.survey-button {
  margin-left: auto;
  -webkit-border-radius: 10;
  -moz-border-radius: 10;
  border-radius: 10px;
  font-family: Arial;
  color: black;
  font-size: 1rem;
  background: #76b900;
  padding: 5px 20px;
  text-decoration: none;
  border: 0;
}

.survey-button:hover {
  background: #8ddf00;
  text-decoration: none;
  cursor: pointer;
}

.input-text {
  margin-left: 10px;
}

.no-course-wrapper {
  max-width: 90vw;
  border-radius: 20px;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 5px solid #7eb726;
  box-sizing: border-box;
  box-shadow: 6px 6px 18px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}

.touch {
  margin: 1rem;

  .survey-wrapper {
    flex-direction: column;

    .survey-column-wrapper {
      display: block;
      min-width: unset;

      .input-text {
        width: 90%;
        margin-left: 30px;
      }
    }
  }
}
</style>
