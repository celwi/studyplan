<template>
  <div>
    <h1>Willkommen zu deinem Studyplan!</h1>
    <h2>Plane dein Studium und behalte den Überblick!</h2>
    <h3>Logge dich ein</h3>
    <div class="line"></div>
    <form name="form" @submit.prevent="handleLogin">
      <div>
        <div v-if="message" role="alert" class="error-message">
          {{ message }}
        </div>
      </div>
      <div>
        <label for="username">Email-Adresse oder Benutzername</label>
        <input
        id="username"
          v-model="username"
          type="text"
          name="username"
          placeholder="s0******@htw-berlin.de"
          aria-label="Füge deine HTW-Email Adresse oder deinen Benutzernamen ein, zum Beispiel: "
          :class="{ 'input--error': !username}"
          @blur="v$.username.$touch()"
        />

        <div v-if="v$.username.$error">
          <p v-if="!v$.username.required" class="error-message">
            Gib deinen Nutzernamen ein
          </p>
        </div>
      </div>
      <div>
        <label for="password">Passwort</label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          :class="{ 'input--error': !password }"
          @blur="v$.password.$touch()"
        />
        <div class="checkbox">
          <input
            class="checkbox checkbox-box"
            type="checkbox"
            name="checkbox"
            @click="showPassword('password')"
          />
          <label for="checkbox" class="checkbox checkbox-label"
            >Passwort zeigen</label
          >
        </div>
        <div v-if="v$.password.$error">
          <p v-if="!v$.password.required" class="error-message">
            Gib dein Passwort ein
          </p>
        </div>
      </div>
      <div>
        <button :disabled="v$.$invalid" :class="{ disabled: v$.$invalid }">
          <span>Login</span>
        </button>
        <p v-if="v$.$anyError" class="error-message">
          Bitte fülle alle Felder aus.
        </p>
        <a class="register-link" href="/register">zur Registrierung</a>
        <router-link
          class="reset-password-link"
          :to="{
            name: 'baseResetPassword',
          }"
        >
          Passwort vergessen
        </router-link>
        <router-view></router-view>
      </div>
      
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapState } from "vuex";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  validations() {
    return {
      username: {
        required,
      },
      password: {
        required,
      },
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.user.status.loggedIn;
    },
    ...mapState("studyplan", ["studyPlan"]),
  },
  async created() {
    if (this.loggedIn) {
      this.$router.push("/my-studyplan");
    }
  },
  methods: {
    showPassword(type) {
      var x = document.getElementById(type);
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
    handleLogin() {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        if (this.username && this.password) {
          this.$store
            .dispatch("user/login", {
              username: this.username,
              password: this.password,
            })
            .then(
              (user) => {
                if (!user.startOfStudy || !user.studyPlan) {
                  this.$router.push("/select-program");
                } else {
                  this.$router.push("/my-studyplan");
                }
              },
              (error) => {
                // this.loading = false;
                this.message =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
              }
            );
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
$htwGruen: #76b900;
$errorRed: #f8153d;

label {
  display: block;
  font-weight: bold;
}

.line {
  border-top: 3px solid;
  margin: 0 auto;
  padding: 0;
  width: 30px;
  height: 39px;
  margin-bottom: 30px;
}

h1,
h2 {
  color: black;
}

h2 {
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
  font-weight: normal;
  font-size: 20px;
}

h3 {
  margin-top: 70px;

  font-size: 23px;
}
.checkbox {
  margin-bottom: 10px;
  &-box {
    display: inline;
    margin-right: 15px;
  }

  &-label {
    display: inline;
    font-weight: 500;
  }
}

input[type="text"],
input[type="password"] {
  font-size: 20px;
  text-align: center;
  border: 3px solid;
  border-color: $htwGruen;
  border-radius: 12px;
  max-width: 350px;
  width: 80%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 30px;
}


button,
input[type="submit"] {
  background: none;
  color: black;
  text-decoration: underline 2px;
  text-decoration-color: $htwGruen ;
  text-underline-offset: 4px ;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.disabled {
  color: black;
  text-decoration: none;
  cursor: auto;
}

.error-message {
  color: $errorRed;
  margin-bottom: 30px;
  margin-top: 0;
  margin-left:30%;
  margin-right: 30%;
}

.input--error {
  border-color: $errorRed;
}
.register-link {
  display: block;
  color: black;
  font-size: 15px;
}

.reset-password-link {
  display: block;
  color: inherit;
  font-size: 15px;
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
