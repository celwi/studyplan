<template>
  <div class="container">
    <div class="shadowBox">
      <BaseSemesterRow
        v-for="(semester, $semesterIndex) in coursesInSemester"
        :key="semester.id"
        class="semester"
        :semester="semester"
        :semester-index="$semesterIndex"
        :courses-in-semester="coursesInSemester"
        :semester-name="semester.semester"
      />
      <router-view></router-view>
    </div>
    <div class="addSemester">
      <button class="addSemester addSemester__button" @click="addSemester">
        <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
      </button>
      <p class="addSemester addSemester__text">Semester hinzufügen</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    coursesInSemester: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    addSemester() {
      this.$store.dispatch("studyplan/addSemester");
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
p {
  font-weight: 700;
}

.container {
  display: grid;
  padding: 0 2rem;
  margin: 0 auto;
  max-width: 1350px;
  border-radius: 20px;

  @media screen and (max-width: 1400px) {
    max-width: 90% !important;
  }

  .shadowBox {
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.23);
    border-radius: 20px;
    border-left: 1px solid #76b900;
    border-right: 1px solid #76b900;
  }
  .semester {
    background: white;
    &:nth-child(odd) {
      background: rgba(118, 185, 0, 0.1) !important;
      border-bottom: 1px solid #76b900;
    }
    &:nth-child(even) {
      border-bottom: 1px solid #76b900;
    }
    &:first-of-type {
      border-radius: 20px 20px 0 0;
      border-top: 1px solid #76b900;
    }
    &:last-of-type {
      border-radius: 0 0 20px 20px;
    }
  }
}
.addSemester {
  &__button {
    text-decoration: none;
    background: none;
    border: none;
    margin: 40px 0 20px 0;
    color: $htwGruen;
    cursor: pointer;
  }

  &__text {
    margin: 0;
    color: black;
  }
}
</style>
