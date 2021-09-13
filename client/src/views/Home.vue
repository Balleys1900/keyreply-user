<template>
  <div>
    <div class="home" v-if="!isUser">
      <el-row :gutter="10">
        <el-col :span="8" class="login-form">
          <h1 style="text-align:center ; text-transform:uppercase">Welcome to my page</h1>
          <el-form>
            <el-form-item label="Username">
              <el-input v-model="search" placeholder="Input username..."></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Login">Login</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <chat v-else />
  </div>
</template>

<script>
import Vue from 'vue';
import socket from '../socket/socket';
import Chat from './Chat.vue';
export default Vue.extend({
  name: 'Home',
  components: { Chat },
  data() {
    return {
      search: '',
      isUser: false,
    };
  },
  methods: {
    Login() {
      this.isUser = true;
      const username = this.search;
      socket.auth = { username, admin: false };
      socket.connect();
    },
  },
  created() {
    socket.on('connect_error', err => {
      if (err.message === 'invalid username') {
        this.usernameAlreadySelected = false;
      }
    });
  },
  destroyed() {
    socket.off('connect_error');
  },
});

// listen...
</script>

<style lang="scss" scoped>
.login-form {
  padding: 20px !important;
  border: 1px solid #dcdfe6;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
