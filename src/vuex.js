//定义一个Vue,让全局都可以使用这个Vue
let Vue;

// forEach是用来循环一个对象
const forEach = (obj, callback) => {
    // 把数组中的每一个key得到  objc[key] 
    // key  value  ----> callback
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}

class Store {
    //当new的时候,给Vuex.js中传入了一堆的东西，在这里接收需要用constructor
    constructor(options) {
        // console.log(options);   //打印出{state: {…}, getters: {…}, mutations: {…}, actions: {…}}，就可以拿到里面的数据了

        //给每个组件的$store上挂一个state，让每个组件都可以用  this.$store.state
        // this.state = options.state
        /* --------------------------------------------状态响应式原理---------------------------------------------------- */
        // 上面那种写法不完美，当改变数据的时候，不能动态的渲染，所以需要把data中的数据做成响应式的
        //_s在下面的 get state方法中使用
        this._s = new Vue({
            data: {
                // 只有data中的数据才是响应式
                state: options.state
            }
        })
        /* ----------------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------------getters原理------------------------------------------------------- */
        //在state上面传入一个name:'Fan'打印一下
        // console.log(this.state);    //打印结果  {name: "Fan"}

        //得到仓库中的getters,如果人家不写getters的话，就默认为空
        let getters = options.getters || {}
        // console.log(getters);   //打印出一个对象，对象中是一个方法  {myName: ƒ}

        //给仓库上面挂载一个getters,这个getters和上面的那一个getters不一样,一个是得到，一个是挂载
        this.getters = {}

        //不好理解,因为人家会给你传多个方法，所以使用这个api处理得到的getters,得到一个数组
        //把store.js中的getters中再写一个方法myAge，用来测试
        // console.log(Object.keys(getters));  //打印出  ["myName", "myAge"]

        forEach(getters, (getterName, value) => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return value(this.state)
                }
            })
        })
        /* -------------------------------------------------------------------------------------------------- */

        /* ------------------------------------------------mutatios原理-------------------------------------------------- */
        //和getters思路差不多

        //得到mutations
        let mutations = options.mutations || {}
        // console.log(mutations);     //{add: ƒ}

        //挂载mutations
        this.mutations = {}

        forEach(mutations, (mutationName, value) => {
            this.mutations[mutationName] = (payload) => {
                value(this.state, payload)
            }
        })

        //打印看一下，正确
        // console.log(mutations);     //{add: ƒ, sub: ƒ}
        //但是他需要实现commit,在下面实现
        /* -------------------------------------------------------------------------------------------------- */
        /* --------------------------------------------------actions原理------------------------------------------------ */
        //和上面两种大同小异，不多注释了
        let actions = options.actions || {}
        this.actions = {};
        forEach(actions, (action, value) => {
            this.actions[action] = (payload) => {
                value(this, payload)
            }
        })
        /* -------------------------------------------------------------------------------------------------- */
    }
    // type是actions的类型  
    dispatch = (type, payload) => {
        this.actions[type](payload)
    }

    //给store上挂一个commit,接收两个参数，一个是类型，一个是数据
    commit = (type, payload) => {
        //{add: ƒ, sub: ƒ}
        this.mutations[type](payload)
    }

    get state() {
        return this._s.state
    }
}

//install本质上就是一个函数
const install = (_Vue) => {
    // console.log('......');  //测试能不能调到这个方法,经测试可以调到
    //把构造器赋给全局Vue
    Vue = _Vue;

    //混入
    Vue.mixin({
        beforeCreate() { //表示在组件创建之前自动调用，每个组件都有这个钩子
            // console.log(this.$options.name) //this表示每个组件,测试，可以打印出mian.js和App.vue中的name main和app

            /* ------------------------------------------state原理--------------------------------------------------------- */
            //保证每一个组件都能得到仓库
            //判断如果是main.js的话，就把$store挂到上面
            if (this.$options && this.$options.store) {
                this.$store = this.$options.store
            } else {
                //如果不是根组件的话，也把$store挂到上面,因为是树状组件，所以用这种方式
                this.$store = this.$parent && this.$parent.$store

                //在App.vue上的mounted()钩子中测试，可以得到store ---> Store {}
            }
        },
        /* ------------------------------------------------------------------------------------------------------------- */
    })
}

//导出
export default {
    install,
    Store
}