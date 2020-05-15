'use strict';

//var vConsole = new VConsole();

Vue.component('custom-template-01', {
    template: `
        <div class="panel panel-default">
            <slot></slot>
        </div>`,
});

Vue.component('custom-template-02', {
    props: ['header'],
    template: `
        <div class="panel">
            <div class="panel-heading">
                <h4 class="panel-title">{{header}}</h4>
            </div>
            <div class="panel-body">
                <slot></slot>
            </div>
            <div class="panel-footer">
                <slot name="footer"></slot>
            </div>
        </div>`,
});

Vue.component('custom-template-03', {
    props: ['value'],
    template: `
        <div class="panel">
            <div class="panel-body">
                <slot></slot>
            </div>
            <div class="panel-footer">
                <button class="btn btn-default" v-on:click="do_input">do_input</button>
            </div>
        </div>`,
    methods:{
        do_input: function(){
            var ret = window.prompt('入力してください。', this.value);
            if( ret )
                this.$emit('input', ret);
        }
    }
});

Vue.component('custom-template-04', {
    props: ['value'],
    template: `
        <div class="panel">
            <div class="panel-body">
                <slot></slot>
            </div>
            <div class="panel-footer">
                <custom-template-04-a v-model="value_"></custom-template-04-a>
            </div>
        </div>`,
    data: function(){
      return {
          value_: this.value,
      }
    },
    watch: {
        value: function(newValue){
            this.value_ = newValue;
        },
        value_: function(newValue){
            this.$emit('input', newValue);
        }
    }
});

Vue.component('custom-template-04-a', {
    props: ['value'],
    template: `
        <div>
            <button class="btn btn-default" v-on:click="do_input">do_input</button>
        </div>
    `,
    methods:{
        do_input: function(){
            var ret = window.prompt('入力してください。', this.value);
            if( ret )
                this.$emit('input', ret);
        }
    }
});



var vue_options = {
    el: "#top",
    data: {
        progress_title: '', // for progress-dialog

        inout_text: 'initial text',
        data: 'initial data',
    },
    computed: {
    },
    methods: {
    },
    created: function(){
    },
    mounted: function(){
        proc_load();
    }
};
vue_add_methods(vue_options, methods_bootstrap);
vue_add_components(vue_options, components_bootstrap);
var vue = new Vue( vue_options );
