<template>
  <div class="about">
    <h1>Welcome to ChatPage</h1>
    <div v-if="!isChat" class="chat-btn">
      <el-button type="primary" @click="handleChatRequest">Chat to admin</el-button>
    </div>
    <div v-else>
      <div class="chat-container">
        <el-scrollbar class="chat-list">
          <div
            class="chat-block"
            :class="{ user: chat.isUser }"
            v-for="(chat, index) in chatArr"
            :key="index"
          >
            <span>{{ chat.msg }}</span>
          </div>
        </el-scrollbar>
        <div class="chat-controls">
          <span class="admin-chat" v-if="adminTyping">Admin is typing...</span>
          <el-form @submit.prevent.native="handleChat">
            <el-form-item>
              <el-input v-model="msg" placeholder="Enter your message....">
                <template #append>
                  <el-button icon="el-icon-s-promotion" @click="handleChat"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import socket from '../socket/socket';

export default Vue.extend({
  name: 'Chat',
  props: ['username'],
  components: {},
  data() {
    return {
      isChat: false,
      msg: '',
      chatArr: [],
      adminTyping: false,
    };
  },
  methods: {
    handleChatRequest() {
      socket.emit('chatRequest', { username: this.username });
      this.isChat = !this.isChat;
      this.appendMessage('Chúng tôi đang tìm nhân viên hỗ trợ cho bạn...', false);
    },
    handleChat() {
      if (this.msg.length > 0) {
        this.appendMessage(this.msg);
        socket.emit('chat', { message: this.msg });
        this.msg = '';
      }
    },
    appendMessage(message, isUser = true) {
      this.chatArr.push({
        msg: message,
        isUser,
      });
    },
  },
  mounted() {
    socket.on('adminResponse', ({ adminName, message }) => {
      this.appendMessage(message, false);
    });
    socket.on('adminTyping', () => {
      this.adminTyping = true;
    });
  },
  destroyed() {
    socket.off('connect_error');
  },
});
</script>

<style>
.about h1 {
  text-align: center;
}

.chat-btn {
  text-align: center;
}
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 400px;
  margin: 0 auto;
  padding: 20px;
  height: 500px;

  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}

.chat-list.chat-list {
  height: 90%;
}
.el-scrollbar__wrap {
  overflow: auto !important;
}

.chat-controls {
  height: 10%;
}

.chat-block {
  margin-bottom: 15px;
}

.chat-block span {
  display: inline-block;
  padding: 10px 20px;
  background: #8c8c8c;
  box-shadow: 0 0 5px #ccc;
  border-radius: 999px;
  color: #fff;
}

.chat-block.user {
  text-align: right;
}

.chat-block.user span {
  background: #1890ff;
  text-align: right;
}
.admin-chat {
  display: block;
  margin-bottom: 10px;
}
</style>
