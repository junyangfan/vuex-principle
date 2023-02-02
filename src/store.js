import Vue from 'vue'
//把里面的全删了，自己写

// 引入自己的写的vuex,里面有一个对象{install}，当你use时，会自动调用这个方法
//导入vuex {install Store}
import Vuex from './vuex'

Vue.use(Vuex)

//需要创建一个仓库并导出
//当new的时候,给Vuex.js中传入了一堆的东西
export default new Vuex.Store({
    state: {
        name: 'Fan',
        age: 100
    },
    //getters中虽然是一个方法，但是用时，可以把他当作属性
    getters: { // 说白了，就是vue中data中的computed
        myName(state) {
            return state.name + 'Jun'
        },
        myAge() {

        }
    },
    // 改变状态：异步请求数据  事件 
    mutations: {
        add(state, payload) {
            state.age += payload
        },
        sub() {

        },
        asyncSub(state, payload) {
            state.age -= payload
        }
    },
    actions: {
        asyncSub({
            commit
        }, payload) {
            setTimeout(() => {
                commit("asyncSub", payload)
            }, 2000)
        }
    }
})