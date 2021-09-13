<template>
  <div class="about">
    <h1>User Manager</h1>

    <div>
      <el-container>
        <el-aside>
          <el-scrollbar>
            <div class="user" v-for="user in users" :key="user.userID">
              <div class="user-name">{{ user.username }}</div>
              <div class="status">
                <status-icon :connected="user.connected" />
              </div>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-header>
            <div class="currentUser">
              <div class="curUsername">Lee</div>
              <div class="setting">Setting</div>
            </div>
          </el-header>
          <el-main>
            <el-scrollbar height="400px">
              <div class="container-chat">
                <div class="isAdmin">
                  <i style="color:#409EFC; font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From Admin</div>
                </div>
                <div class="isUser">
                  <i style="font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From User</div>
                </div>
                <div class="isAdmin">
                  <i style="color:#409EFC; font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From Admin</div>
                </div>
                <div class="isUser">
                  <i style="font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message from user</div>
                </div>
                <div class="isAdmin">
                  <i style="color:#409EFC; font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From Admin</div>
                </div>
                <div class="isUser">
                  <i style="font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From User</div>
                </div>
                <div class="isAdmin">
                  <i style="color:#409EFC; font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message From Admin</div>
                </div>
                <div class="isUser">
                  <i style="font-size:20px" class="el-icon-user-solid"></i>
                  <div class="message">Message from user</div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
          <el-footer>
            <div class="form-input">
              <input type="text" name="" id="" class="input-text" />
              <button class="btn-send">Send</button>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import StatusIcon from './StatusIcon.vue';
import socket from '../socket/socket';
export default Vue.extend({
  name: 'Chat',
  components: { StatusIcon },
  data() {
    return {
      users: [],
    };
  },
  created() {
    socket.auth = {
      admin: true,
    };
    socket.connect();
  },
  // After completely render
  mounted() {
    socket.on('connect', () => {
      this.users.forEach(user => {
        console.log(user);
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on('disconnect', () => {
      this.users.forEach(user => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    const initReactiveProperties = user => {
      console.log('init');
      user.connected = true;
    };

    socket.on('users', users => {
      users.forEach(user => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // put the current user first, and sort by username
      this.users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on('user connected', user => {
      initReactiveProperties(user);
      this.users.push(user);
    });

    socket.on('user disconnected', id => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });
  },
  destroyed() {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('users');
    socket.off('user connected');
    socket.off('user disconnected');
    // socket.off('private message');
  },
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.about h1 {
  text-align: center;
  margin: 30px 0;
}
.about {
  width: 80%;
  margin: 0 auto;
}
.el-container {
  width: 100%;
}
.el-header {
  border-radius: 10px;
  border-bottom: 1px solid #d3dce6;
  /* border-radius: 10px; */
}

.el-footer {
  margin: 0;
  padding: 0;
  height: 40px !important;
}
.el-aside {
  padding: 60px 0;
  line-height: 60px;
  width: 19% !important;
  border-radius: 10px;
  border-right: 1px solid #d3dce6;
}

.el-main {
  height: 400px;
  overflow: hidden;
  /* padding: 0 20px; */
}

.el-scrollbar {
  margin: 20px 0;
  height: 400px;
  /* padding: 0 20px; */
}

.user {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.user:hover {
  width: 95%;
  background-color: #d3dce6;
  cursor: pointer;
}
.user .user-name {
  font-size: 20px;
}

.currentUser {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.form-input {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.form-input .input-text {
  height: 100%;
  width: 80%;
  border-radius: 10px;
  font-size: 20px;
  padding-left: 15px;
}
.input-text:focus-visible {
  outline: none;
}
.form-input .btn-send {
  height: 100%;
  width: 20%;
  border-radius: 20px;
}

.btn-send:hover {
  background-color: red;
}
.container-chat {
  width: 94%;
  margin: 0 auto;
}

.isAdmin {
  display: flex;
  align-items: center;
  gap: 20px;
  line-height: 30px;
}
.isAdmin .message {
  background-color: #e4e7ed;
  padding: 15px;
  border-radius: 20px;
}
.isUser .message {
  background-color: #409eff;
  padding: 15px;
  border-radius: 20px;
  color: #fff;
}
.isUser {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 20px;
  line-height: 30px;
}
</style>
