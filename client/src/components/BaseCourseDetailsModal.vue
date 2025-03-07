<!--source https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component -->

<template>
  <div>
    <BaseModal
      :route="isExampleStudyPlan ? '/example-studyplan' : '/my-studyplan'"
    >
      <template #header>
        <button
          v-if="!isChildCourse"
          type="button"
          class="btn-close"
          @click="
            isExampleStudyPlan
              ? $router.push('/example-studyplan')
              : $router.push('/my-studyplan')
          "
        >
          x
        </button>
        <button v-else type="button" class="btn-back" @click="$router.go(-1)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" size="1x" />
        </button>
      </template>

      <template #body>
        <pulse-loader :loading="pending" :color="color"></pulse-loader>

        <BaseCourseDetails
          v-if="!pending"
          :course="course"
          :semester="semester"
          :is-child-course="isChildCourse"
          :parent-course-code="parentCourseCode"
          :is-example-study-plan="isExampleStudyPlan"
      /></template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    isChildCourse: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      semester: {
        type: Object,
      },
      parentCourseCode: null,
      pending: false,
      color: "#76b900",
      isExampleStudyPlan: false,
    };
  },
  computed: {
    ...mapState("course", ["course"]),
    ...mapState("studyplan", ["studyPlan"]),
    ...mapGetters("semester", ["getSemesterByName"]),
  },
  async created() {
    this.pending = true;
    this.isExampleStudyPlan =
      this.$route.fullPath.includes("example-studyplan");
    document.documentElement.style.overflow = "hidden";
    this.semester = this.getSemesterByName(this.$route.params.semester);
    if (this.$route.params.parentCode) {
      this.parentCourseCode = this.$route.params.parentCode;
    }

    await this.$store.dispatch("course/fetchCourse", {
      program: this.$route.params.program.toLowerCase(),
      version: this.$route.params.version,
      code: this.$route.params.code,
      semester: this.semester ? this.semester.name : undefined,
    });
    this.pending = false;
  },
  async beforeUnmount() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  background: transparent;
}

.btn-back {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 30px;
  margin-top: 30px;
  border: none;
  font-size: 30px;
  padding: 10px;
  cursor: pointer;
  color: black;
  background: transparent;
}
</style>
