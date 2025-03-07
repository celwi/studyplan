<template>
  <div v-if="!pending">
    <div v-if="!mobileView" class="navigation">
      <div class="navigation-container">
        <div v-if="currentUser">
          <div v-if="currentUser.startOfStudy" class="navigation-left">
            <router-link class="link" to="/my-studyplan"
              >Mein Studienplan<sup><small>BETA</small></sup></router-link
            >

            <router-link class="link" to="/example-studyplan"
              >Plan nach Studienordnung</router-link
            >
            <router-link
              class="link"
              v-if="currentUser.isAdmin ||
                stage.currentStage === 'COURSE-RESULT' ||
                stage.currentStage === 'EVALUATION'
              "
              to="/mycourses"
            >
              Meine Kurse
            </router-link>
            <router-link
              class="link"
              v-if="currentUser.isAdmin || stage.currentStage === 'COURSE-SELECTION'"
              to="/courseselection"
              >Kursbelegung</router-link
            >
            <router-link
              class="link"
              v-if="currentUser.isAdmin || stage.currentStage === 'COURSE-SELECTION'"
              to="/coursesurvey"
              >Umfrage</router-link
            >
            <router-link
              v-if="currentUser.isAdmin"
              class="link"
              to="/modalcourse"
            >
              Admin
            </router-link>
            <router-link class="link" to="/hilfe">Hilfe</router-link>
          </div>

          <div v-if="currentUser" class="navigation-right">
            <router-link
              v-if="currentUser.startOfStudy"
              class="link icon"
              to="/profile"
              aria-label="Mein Profil"
            >
              <font-awesome-icon :icon="['fas', 'user']" size="1x" />
            </router-link>

            <a class="link logout-desktop" href @click.prevent="logOut" aria-label="Logout">
              <font-awesome-icon
                class="icon"
                :icon="['fas', 'sign-out-alt']"
                size="2x"
            /></a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="mobileView && currentUser && currentUser.startOfStudy"
      class="mobile-navigation"
    >
      <button @click="toggleMobileNavMenu">
        <font-awesome-icon class="icon" :icon="['fas', 'bars']" size="2x" />
      </button>
      <div v-if="showMobileNavMenu" class="mobile-navigation-container">
        <button class="close-btn" @click="toggleMobileNavMenu">x</button>

        <div class="links">
          <router-link
            class="link"
            to="/my-studyplan"
            @click="toggleMobileNavMenu"
            >Mein Studienplan <sup><small>BETA</small></sup></router-link
          >

          <router-link
            class="link"
            to="/example-studyplan"
            @click="toggleMobileNavMenu"
            >Plan nach Studienordnung</router-link
          >

          <router-link
            class="link"
            v-if="currentUser.isAdmin ||
              stage.currentStage === 'COURSE-RESULT' ||
              stage.currentStage === 'EVALUATION'
            "
            to="/mycourses"
            @click="toggleMobileNavMenu"
          >
            Meine Kurse
          </router-link>
            
          <router-link
            class="link"
            v-if="currentUser.isAdmin || stage.currentStage === 'COURSE-SELECTION'"
            to="/courseselection"
            @click="toggleMobileNavMenu"
            >Kursbelegung</router-link
          >
          <router-link
            class="link"
            v-if="currentUser.isAdmin || stage.currentStage === 'COURSE-SELECTION'"
            to="/coursesurvey"
            @click="toggleMobileNavMenu"
            >Umfrage</router-link
          >
          <router-link
            v-if="currentUser.isAdmin"
            class="link"
            to="/modalcourse"
            @click="toggleMobileNavMenu"
          >
            Admin
          </router-link>

          <router-link class="link" to="/hilfe" @click="toggleMobileNavMenu">
            Hilfe</router-link
          >

          <router-link class="link" to="/profile" @click="toggleMobileNavMenu">
            Profil
          </router-link>

          <a class="link link-logout-mobile" href @click.prevent="logOut">
            Logout</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    return {
      stage: computed(() => store.state.stage),
    };
  },
  data() {
    return {
      pending: true,
      mobileView: false,
      showMobileNavMenu: false,
    };
  },
  computed: {
    currentUser() {
      //console.log(this.$store.state.user);
      return this.$store.state.user.user;
    },
  },
  async created() {
    this.mobileView = window.innerWidth <= 600;
    window.addEventListener("resize", this.isMobileView);
    this.pending = true;
    await this.$store.dispatch("stage/fetchStage");
    this.pending = false;
  },
  methods: {
    logOut() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    isMobileView() {
      this.mobileView = window.innerWidth <= 600;
    },
    toggleMobileNavMenu() {
      this.showMobileNavMenu = !this.showMobileNavMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

sup {
  font-weight: 100;
}

.navigation {
  &-container {
    max-width: 85vw;
    display: flex;
    align-items: baseline;

    .navigation-left,
    .navigation-right {
      display: inline;
    }

    .navigation-right {
      position: absolute;
      right: 30px;
    }

    .link {
      margin-left: 15px;
      text-decoration: none;
      font-size: 18px;
      padding:5px;
      border: 3px solid white;
      border-radius: 5px;
    }

    .icon {
      font-size: 25px;
      margin-left: auto !important;
    }
  }

  .router-link-active {
    border: 3px solid $htwGruen;
    border-radius: 5px;
    text-decoration: underline;
  }

  a {
    color: black !important;
  }
}

.mobile-navigation {
  position: absolute;
  right: 20px;
  top: 20px;

  button {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  &-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $htwGruen;
    z-index: 500;

    .close-btn {
      font-size: 40px;
      color: white;
      position: fixed;
      right: 20px;
      margin-top: 10px;
    }

    .links {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;

      .link {
        color: white !important;
        text-decoration: none;
        margin: 15px;
        font-size: 25px;
      }
    }
  }
}
</style>
