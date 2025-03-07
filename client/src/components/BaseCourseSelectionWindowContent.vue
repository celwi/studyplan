<template>
  <div class="course-details">
    <h1 class="course-details-code">{{ course.code }}</h1>
    <h2 class="course-details-name">{{ course.name }}</h2>
    <h2 v-if="semester" class="course-details-semestername">
      {{ semester.name }}
    </h2>
    <!-- Allgemeine Informationen -->

    <div v-if="course.info.professor">
      <h3>Zuständige Person</h3>
      <p>{{ course.info.professor }}</p>
    </div>

    <div v-if="course.info.room">
      <h3>Raum</h3>
      <p>{{ course.info.room }}</p>
    </div>

    <div v-if="course.info.contents">
      <h3>Inhalte</h3>
      <div v-for="content in course.info.contents" :key="content.id">
        <p>{{ content }}</p>
      </div>
    </div>
    <div v-if="course.info.CTS">
      <h3>CTS</h3>
      <p>{{ course.info.CTS }}</p>
    </div>
    <div v-if="course.info.learningOutcomes">
      <h3>Gewünschte Ergebnisse</h3>
      <div v-for="content in course.info.learningOutcomes" :key="content.id">
        <p>{{ content }}</p>
      </div>
    </div>

    <div v-if="course.info.examType">
      <h3>Prüfungsform</h3>
      <p>{{ course.info.examType }}</p>
    </div>

    <div v-if="course.info.recommendRequirements">
      <h3>Voraussetzungen</h3>
      <p>{{ course.info.recommendRequirements }}</p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
    semester: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      requiredCourses: [],
      mobileView: false,
    };
  },
  created() {
    this.mobileView = window.innerWidth <= 600;
    window.addEventListener("resize", this.isMobileView);
  },

  methods: {
    isMobileView() {
      this.mobileView = window.innerWidth <= 600;
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtFont: rgba(253, 177, 62, 1);
$belegtBackground: rgba(253, 177, 62, 0.55);

h3 {
  font-size: 18px;
}

h4 {
  color: $htwGruen;
}

.course-details {
  &-code {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 25px;
    color: black;
  }

  &-name {
    margin: 0;
    font-size: 25px;
    color: black;
    text-decoration: underline 2px;
    text-decoration-color: $htwGruen ;
    text-underline-offset: 4px ;
  }

  &-semestername {
    font-size: 20px;
    color: black;
  }

  &-ects {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .course-content-container {
    padding-top: 10px;
  }

  .childCourses {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;

    a {
      text-decoration: none;
      color: inherit;
    }

    &-course {
      background: rgba(193, 193, 193, 0.55);
      border: 1px solid #c1c1c1;
      max-height: 87px;
      min-height: 87px;
      overflow: hidden;
      width: 10vw;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      margin: 9px;
      transition: max-height 0.3s ease-in-out;

      @media screen and (max-width: 600px) {
        align-items: center;
      }

      &:hover {
        max-height: 20000px;
        min-height: 87px;
        height: auto;
        transition: max-height 1s ease-in-out;
      }

      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 100%;

        &-text {
          max-width: 100%;
          height: 100%;
          border-radius: 14px;

          &--code {
            font-weight: 700;
          }

          p {
            padding: 0px;
            font-size: 12px;
            padding: 3px;
            margin: 0 auto;
            max-width: 100%;
            word-wrap: break-word;
            border-radius: 14px;

            @media screen and (max-width: 1000px) {
              max-width: 75% !important;
            }

            @media screen and (max-width: 800px) {
              max-width: 65% !important;
            }
          }
        }
      }
    }
  }
}

.download-button {
  background: none;
  color: $htwGruen;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  font-weight: bold;
  font-size: 15px;
  margin-top: 30px;
}
</style>
