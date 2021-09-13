import { User } from '@/types/user.interface';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface State {
	users: User[];
}

const initialState: State = {
	users: [],
};

export default new Vuex.Store({
	state: initialState,
	mutations: {
		PUSH_USERS(state, payload: User) {
			state.users.push(payload);
		},
	},
	actions: {},
	getters: {
		getUsers(state) {
			return state.users;
		},
	},
	modules: {},
});
