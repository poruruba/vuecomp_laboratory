'use strict';

//var vConsole = new VConsole();

var vue_options = {
    el: "#top",
    data: {
        progress_title: '', // for progress-dialog
        dialog_target: null, // for modal-dialog

        swagger_type: null,
        swagger_json: null,
        swagger_json_backup: null,
        select_view_type: 'json',
        swagger_json_view: '',
        base_url: 'http://localhost:10080/swagger',
        dialog_output: {},
    },
    computed: {
    },
    methods: {
        do_view: function(){
            this.change_view_type();
            this.dialog_open('#view_json_dialog');
        },
        change_view_type: function(){
            if( this.select_view_type == 'yaml' )
                this.swagger_json_view = jsyaml.dump(this.swagger_json);
            else
                this.swagger_json_view = JSON.stringify(this.swagger_json, null, '\t');
        },
        do_sample: function(){
            var swagger_type = 'yaml';
            do_get( location.origin + location.pathname + 'sample/sample.yaml', {})
            .then(text =>{
                if( swagger_type == 'json' ){
                    this.swagger_json_backup = JSON.parse(text);
                }else if( swagger_type == 'yaml' ){
                    this.swagger_json_backup = jsyaml.safeLoad(text, 'utf8');;
                }
                this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json_backup));
                this.swagger_type = swagger_type;
            });
        },
        do_read: function(e){
            var file = e.target.files[0];
            this.open_file(file);
        },
        read_click: function(e){
            this.swagger_type = null;
            e.target.value = '';
        },
        open_file: function(file){
            var swagger_type = null;
            if( file.name.endsWith('.json') )
                swagger_type = 'json';
            else
                swagger_type = 'yaml';

            var reader = new FileReader();
            reader.onload = (theFile) =>{
                var text = reader.result;

                if( swagger_type == 'json' ){
                    this.swagger_json_backup = JSON.parse(text);
                }else if( swagger_type == 'yaml' ){
                    this.swagger_json_backup = jsyaml.safeLoad(text);
                }
                this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json_backup));
                this.swagger_type = swagger_type;
            };
            reader.readAsText(file);
        },

        do_load: function(swagger_type){
            do_get(this.base_url, {})
            .then(text =>{
                if( swagger_type == 'json' ){
                    this.swagger_json_backup = JSON.parse(text);
                }else if( swagger_type == 'yaml' ){
                    this.swagger_json_backup = jsyaml.safeLoad(text, 'utf8');;
                }
                this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json_backup));
                this.swagger_type = swagger_type;
            });
        },
        do_reload: function(){
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json_backup));
        },
        do_save: function(type){
            var buffer;
            if( type == 'json')
                buffer = JSON.stringify(this.swagger_json);
            else if( type == 'yaml')
                buffer = jsyaml.dump(this.swagger_json);

			var blob = new Blob([buffer], {type: "text/plan"});
			var url = window.URL.createObjectURL(blob);

			var a = document.createElement("a");
			a.href = url;
			a.target = '_blank';
			a.download = "swagger." + type;
			a.click();
			window.URL.revokeObjectURL(url);
        },        
        do_append_method: function(){
            this.dialog_output = {};
            this.dialog_open('#append_method_dialog');
        },
        do_append_entrypoint: function(){
            var name = window.prompt("名称を入力してください", "");
            if( !name )
                return;

            if( this.swagger_json.paths[name] ){
                alert('すでに存在しています。');
                return;
            }

            this.swagger_json.paths[name] = {};
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_delete_entrypoint: function(key){
            if( !window.confirm('本当に削除しますか？') )
                return;

            delete this.swagger_json.paths[key];
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_append_definition: function(){
            var name = window.prompt("名称を入力してください", "");
            if( !name )
                return;

            if( this.swagger_json.definitions[name] ){
                alert('すでに存在しています。');
                return;
            }

            this.swagger_json.definitions[name] = {};
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_delete_definition: function(key){
            if( !window.confirm('本当に削除しますか？') )
                return;
            
            delete this.swagger_json.definitions[key];
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_append_paramdefinition: function(){
            var name = window.prompt("名称を入力してください", "");
            if( !name )
                return;

            if( this.swagger_json.parameters[name] ){
                alert('すでに存在しています。');
                return;
            }

            this.swagger_json.parameters[name] = {};
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_delete_paramdefinition: function(key){
            if( !window.confirm('本当に削除しますか？') )
                return;
            
            delete this.swagger_json.parameters[key];
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_append_respdefinition: function(){
            var name = window.prompt("名称を入力してください", "");
            if( !name )
                return;

            if( this.swagger_json.responses[name] ){
                alert('すでに存在しています。');
                return;
            }

            this.swagger_json.responses[name] = {};
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
        do_delete_respdefinition: function(key){
            if( !window.confirm('本当に削除しますか？') )
                return;
            
            delete this.swagger_json.responses[key];
            this.swagger_json = JSON.parse(JSON.stringify(this.swagger_json));
        },
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

function do_get(url, qs) {
    var params = new URLSearchParams(qs);
    var url2 = new URL(url);
    url2.search = params;
  
    return fetch(url2.toString(), {
        method: 'GET',
    })
    .then((response) => {
        if (!response.ok)
          throw 'status is not 200';
        return response.text();
    });
}