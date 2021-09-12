<template>
	<div class="home">
		<el-row :gutter="10">
			<el-col :span="8" class="login-form">
				<h1 style="text-align:center ; text-transform:uppercase">Welcome to my page</h1>
				<el-form>
					<el-form-item label="Username">
						<el-input v-model="search" placeholder="Input username..."></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary">Login</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue';
	import io from 'socket.io-client';

	export default Vue.extend({
		name: 'Home',
		components: {},
		data() {
			return {
				search: '',
			};
		},
		created() {
			const socket = io();
			console.log({ socket });
		},
	});
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
