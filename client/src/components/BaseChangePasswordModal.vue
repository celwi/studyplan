<template>
  <div>
    <BaseModal :route="'/profile'">
      <template #header>
        <button
          type="button"
          class="btn-close"
          @click="$router.push('/profile')"
        >
          x
        </button>
        <h1>Passwort ändern</h1>
      </template>

      <template #body>
        <form name="form">
          <div class="fields">
            <div class="fieldgroup">
              <label for="oldPassword" class="password-label"
                >Altes Passwort</label
              >
              <input
                id="oldPassword"
                v-model="oldPassword"
                class="password-input"
                type="password"
                name="oldPassword"
                :class="{ error: v$.oldPassword.$error }"
                @blur="v$.oldPassword.$touch()"
              />
              <div>
                <input
                  type="checkbox"
                  name="checkbox"
                  @click="showPassword('oldPassword')"
                />
                <label for="checkbox">Passwort zeigen</label>
              </div>
            </div>

            <div class="fieldgroup">
              <label for="newPassword" class="password-label"
                >Neues Passwort</label
              >
              <input
                id="newPassword"
                v-model="newPassword"
                class="password-input"
                type="password"
                name="newPassword"
                :class="{ error: v$.newPassword.$error }"
                @blur="v$.newPassword.$touch()"
              />
              <div>
                <input
                  type="checkbox"
                  name="checkbox"
                  @click="showPassword('newPassword')"
                />
                <label for="checkbox">Passwort zeigen</label>
              </div>
            </div>
            <div v-if="v$.newPassword.$error">
              <p
                v-if="!v$.newPassword.required || v$.oldPassword.required"
                class="message--error"
              >
                Darf nicht leer sein
              </p>
            </div>
          </div>
        </form>
        <div
          v-if="message"
          class="message"
          :class="{
            'message message--error': !successful,
            'message message--success': successful,
          }"
        >
          {{ message }}
        </div>
      </template>

      <template #footer>
        <button
          :disabled="v$.$invalid"
          class="submit"
          :class="{ disabled: v$.$invalid }"
          @click="handlePasswordUpdate"
        >
          Passwort ändern
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      message: "",
    };
  },
  validations() {
    return {
      oldPassword: {
        required,
      },
      newPassword: {
        required,
      },
    };
  },
  created() {
    document.documentElement.style.overflow = "hidden";
  },

  unmounted() {
    document.documentElement.style.overflow = "auto";
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
    async handlePasswordUpdate() {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        const response = await this.$store.dispatch("user/changePassword", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        if (response) {
          //not updated
          this.message = response.message;
          this.successful = false;
        } else {
          //everything went ok
          this.message = "Password erfolgreich geändert!";
          this.successful = true;
          this.oldPassword = "";
          this.newPassword = "";
          this.v$.$reset();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;

.error {
  border-color: $errorRed !important;
}

.message {
  &--error {
    color: $errorRed;
    margin-bottom: 30px;
    margin-top: 0;
  }
  &--success {
    color: black;
  }
}

.fields {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .fieldgroup {
    margin-bottom: 50px;

    .password-label {
      display: block;
      font-weight: bold;
      font-size: 18px;
    }

    .password-input {
      max-width: 35vw;
      font-size: 20px;
      text-align: center;
      border-radius: 12px;
      height: 50px;
      margin-top: 30px;
      margin-bottom: 20px;

      @media screen and (max-width: 500px) {
        max-width: 80vw;
        font-size: 15px;
        height: 50px;
      }
    }

    input {
      border: 3px solid $htwGruen;
      display: inline;

      &:focus {
        outline: none;
      }
    }

    .checkbox {
      display: inline;
    }
  }
  .submit,
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
  }

  .disabled {
    color: black;
    text-decoration: none;
    cursor: auto;
  }
}
</style>
