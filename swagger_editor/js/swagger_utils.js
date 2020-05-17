'use strict';

var dialog_callback = null;

function dialog_open(target, initial_content, callback){
  vue.dialog_custom_open(target, initial_content, callback);
}

function to_default(type){
  if( !type_format[type] )
    return "";
  return type_format[type].init;
}

const enum_in = [
  "body", "query", "formData", "path", "header"
];

const enum_method = [
  'get', 'post', 'put', 'patch', 'delete', 'head', 'options'
];

const enum_type = [
  "string", "number", "integer", "boolean", "file", "object", "array"
];

const enum_format = [
  "float", "double", "int32", "int64", "date", "date-time", "password", "email", "uuid", "hostname", "ipv4", "ipv6"
];

const has_method_obj = [
  "summary", "description", "x-swagger-router-controller", "operationId", "consumes", "produces", "parameters", "responses", "security"
];

const has_parameters_objs = [
  "name", "in", "description", "required", "schema", "type", "format", "items", "enum", "maximum", "minimum", "maxItems", "minItems", "maxLength", "minLength"
];

const has_parameters_objs_body = [
  "name", "description", "required", "schema"
];

const has_parameters_objs_other = [
  "name", "description", "required", "type", "format", "items", "enum", "maximum", "minimum", "maxItems", "minItems", "maxLength", "minLength"
];

const has_properties_obj = [
  "type", "format", "description", "enum", "$ref", "items"
];

const has_definitions_obj = [
  "type", "properties", "required", "title"
];

const has_responses_obj = [
  "description", "schema"
];

const has_schema = [
  "type", "format", "$ref", "items", "properties", "enum"
];

const has_items = [
  "type", "format", "items", "maximum", "minimum", "maxLength", "minLength", "maxItems", "minItems", "enum", "$ref", 
]

const choice_consprod = [
  "application/json",
  "application/xml",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
  "text/plain",
  "text/html",
];

const type_format = {
  "description" : { type: "L", init: "" },
  "version" : { type: "s", init: "" },
  "title" : { type: "S", init: "" },
  "host" : { type: "S", init: "" },
  "basePath" : { type: "s", init: "" },
  "tags" : { type: "a", init: [] },
  "schemes" : { type: "a", init: [] },
  "paths" : { type: "o", init: {} },
  "operationId" : { type: "s", init: "default" },
  "parameters" : { type: "a", init: [] },
  "responses" : { type: "o", init: {} },
  "security" : { type: "a", init: [] }, // "o"
  "items" : { type: "o", init: {} },
  "enum" : { type: "a", init: [] },
  "schema": { type: "o", init: {} },
  "type" : { type: "e", init: "string" },
  "in" : { type: "e", init: "body" },
  "required" : { type: "b",  init: false }, // "a"
  "format" : { type: "e", init: "email" },
  "x-swagger-router-controller" : { type: "s", init: "routing" },
  "name" : { type: "s", init: "" },
  "$ref" : { type: "S", init: "#/definitions/" },
  "maximum": { type: "n", init: 0 },
  "minimum" : { type: "n", init: 0 },
  "maxImtes" : { type: "n", init: 0 },
  "minItems" : { type: "n", init: 0 },
  "maxLength" : { type: "n", init: 0 },
  "minLength" : { type: "n", init: 0 },
  "summary": { type: "S", init: "" },
  "properties" : { type: "o", init: {} },
  "consumes" : { type: "a", init: [] },
  "produces" : { type: "a", init: [] },
};

Vue.component('swagger-ref', {
  props: ['value'],
  template: `
    <span>
      <label>$ref</label> <a v-bind:href="link" v-if="link">jump</a>
      <input type="text" class="form-control" v-model="value_">
    </span>
  `,
  data: function(){
    return {
        value_: this.value,
    }
  },
  computed: {
    link: function(){
      return ( this.value_.startsWith('#/definitions/') ) ? '#def_' + this.value_.substr('#/definitions/'.length) : null;
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

Vue.component('swagger-common', {
  props: ['name', 'value', 'type', 'readonly'],
  template: `
    <span v-bind:class="type=='s' ? 'form-inline' : ''">
      <label>{{name}}</label>
      <span v-if="type=='L'">
        <textarea v-if="readonly==''" class="form-control" v-bind:value="JSON.stringify(value_)" readonly></textarea>
        <textarea v-else class="form-control" v-model="value_"></textarea>
      </span>
      <span v-else>
        <input v-if="readonly==''" class="form-control" v-bind:value="JSON.stringify(value_)" readonly>
        <input v-else class="form-control" v-model="value_">
      </span>
    </span>
  `,
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

Vue.component('swagger-format', {
  props: ['value'],
  template: `
    <span class="form-inline">
      <label>format</label>
      <select class="form-control" v-model="value_">
        <option v-for="(value1, index1) in enum_format" v-bind:value="value1">{{value}}</option>
      </select>
    </span>
  `,
  data: function(){
    return {
        value_: this.value,
        enum_format: enum_format,
    }
  },
  watch: {
      value: function(newVal){
          this.value_ = newVal;
      },
      value_: function(newVal){
          this.$emit('input', newVal);
      }
  }
});

Vue.component('swagger-type', {
  props: ['value'],
  template: `
    <span class="form-inline">
      <label>type</label>
      <select class="form-control" v-model="value_">
        <option v-for="(value, index) in enum_type" v-bind:value="value">{{value}}</option>
      </select>
    </span>
  `,
  data: function(){
    return {
        value_: this.value,
        enum_type: enum_type,
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

Vue.component('swagger-security', {
  props: ['value'],
  template: `
    <span>
      <label>security</label>
      <ul>
        <li v-for="(value1, index1) in value_">
          <span>
            <button class="btn btn-default btn-xs" v-on:click="do_delete_item(index1)">削除</button>
            <ul v-for="(value2, key2, index2) in value1">
              {{key2}}
              <li v-for="(value3, index3) in value2" class="form-inline"">
                <input type="text" class="form-control" v-model="value_[index1][key2][index3]">
                <button class="btn btn-default btn-xs" v-on:click="do_delete_item3(index1, key2, index3)">削除</button>
              </li>
              <button class="btn btn-default btn-xs" v-on:click="do_append_item(index1, key2)">追加</button>
            </ul>
          </span>
        </li>
        <button class="btn btn-default btn-xs" v-on:click="do_append_key">追加</button>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_item: function(index){
      this.value_.splice(index, 1);
    },
    do_delete_item3: function(index, key, index3){
      this.value_[index][key].splice(index3, 1);
    },
    do_append_item: function(index, key){
      this.value_[index][key].push("");
    },
    do_append_key: function(){
      dialog_open('#append_string_dialog', { title: 'name' }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;

      var element = content.string;
      if( !element )
        return;

      var obj = {};
      obj[element] = [];
      this.value_.push(obj);
    }
  }
});

Vue.component('swagger-enum', {
  props: ['value'],
  template: `
    <span>
      <label>enum</label>
      <ul>
        <li v-for="(value1, index1) in value_">
          <div class="form-inline">
            <label>#{{index1 + 1}}</label>
            <input type="text" class="form-control" v-model="value_[index1]">
            <button class="btn btn-default btn-xs" v-on:click="do_delete_item(index1)">削除</button>
          </div>
        </li>
        <li>
          <button class="btn btn-default btn-xs" v-on:click="do_append_item">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_item: function(index){
      this.value_.splice(index, 1);
    },
    do_append_item: function(){
      this.value_.push("");
    },
  }
});

Vue.component('swagger-requiredprop', {
  props: ['value', 'choice'],
  template: `
    <span>
      <label>required</label>
      <ul>
        <li v-for="(value1, index1) in value_">
          <div class="form-inline">
            <label>#{{index1 + 1}}</label>
            <input type="text" class="form-control" v-model="value_[index1]">
            <button class="btn btn-default btn-xs" v-on:click="do_delete_item(index1)">削除</button>
          </div>
        </li>
        <li>
          <button class="btn btn-default btn-xs" v-on:click="do_append_item()">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_item: function(index){
      this.value_.splice(index, 1);
    },
    do_append_item: function(){
      dialog_open('#append_select_dialog', { title: 'property', choice : this.choice }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_.includes(element) ){
          alert('すでに存在しています。');
          return;
      }

      this.value_.push(element);
    }
  }
});

Vue.component('swagger-consprod', {
  props: ['name', 'value'],
  template: `
    <span>
      <label>{{name}}</label>
      <ul>
        <li v-for="(value1, index1) in value_">
          <div class="form-inline">
            <label>#{{index1 + 1}}</label>
            <select class="form-control" v-model="value_[index1]">
              <option v-for="(value2, index2) in choice" v-bind:value="value2">{{value2}}</option>
            </select>
            <button class="btn btn-default btn-xs" v-on:click="do_delete_item(index1)">削除</button>
          </div>
        </li>
        <li>
          <button class="btn btn-default btn-xs" v-on:click="do_append_item()">追加</button>
        </li>
      </ul>
    </span>
  `,
  data: function(){
    return {
        value_: this.value,
        choice: choice_consprod,
    }
  },
  watch: {
      value: function(newValue){
          this.value_ = newValue;
      },
      value_: function(newValue){
          this.$emit('input', newValue);
      }
  },
  methods: {
    do_delete_item: function(index){
      this.value_.splice(index, 1);
    },
    do_append_item: function(){
      this.value_.push(this.choice[0]);
    },
  }
});

Vue.component('swagger-items', {
  props: ['value'],
  template: `
    <span>
      <label>items</label>
      <ul>
        <li v-for="(value1, key1, index1) in value_">
          <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)">削除</button>
          <component v-bind:is="'swagger-'+key1" v-bind:name="key1" v-model="value_[key1]" v-if="['type','format','items','enum'].includes(key1)"></component>
          <swagger-common v-else-if="key1=='maximum' || key1=='minimum' || key1=='minItems' || key1=='maxItems' || key1=='maxLength' || key1=='minLength'" v-bind:name="key1" v-model="value_[key1]" type="n"></swagger-common>
          <swagger-ref v-else-if="key1=='$ref'" v-model="value_[key1]"></swagger-ref>
          <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
        </li>
        <li>
          <button class="btn btn-default btn-xs" v-on:click="do_add_element()">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_items }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      Vue.set(this.value_, element, to_default(element));
    }
  }
});


Vue.component('swagger-schema', {
  props: ['value'],
  template: `
    <span>
      <label>schema</label>
      <ul>
        <li v-for="(value1, key1, index1) in value_">
          <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)">削除</button>
          <component v-bind:is="'swagger-'+key1" v-bind:name="key1" v-model="value_[key1]" v-if="['type','format','items','properties','enum'].includes(key1)"></component>
          <swagger-ref v-else-if="key1=='$ref'" v-model="value_[key1]"></swagger-ref>
          <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
        </li>
        <li>
          <button class="btn btn-default btn-xs" v-on:click="do_add_element()">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_schema }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      Vue.set(this.value_, element, to_default(element));
    }
  }
});

Vue.component('swagger-required', {
  props: ['value'],
  template: `
    <span class="form-inline">
      <label><input type="checkbox" v-model="value_">required</label>
    </span>
  `,
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

Vue.component('swagger-param-body', {
  props: ['value'],
  template: `
    <span>
      <label>in: body</label>
      <div v-for="(value1, key1, index1) in value_" v-if="key1!='in'">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)">削除</button>
        <component v-bind:is="'swagger-'+key1" v-bind:name="key1" v-model="value_[key1]" v-if="['required','schema'].includes(key1)"></component>
        <swagger-common v-else-if="key1=='name'" v-bind:name="key1" v-model="value_[key1]" type="s"></swagger-common>
        <swagger-common v-else-if="key1=='description'" v-bind:name="key1" v-model="value_[key1]" type="L"></swagger-common>
        <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
      </div>
      <button class="btn btn-default btn-xs" v-on:click="do_add_element()">追加</button>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_parameters_objs_body }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      Vue.set(this.value_, element, to_default(element));
    }
  }
});

Vue.component('swagger-param-other', {
  props: ['name', 'value'],
  template: `
    <span>
      <label>in: {{name}}</label>
      <div v-for="(value1, key1, index1) in value_" v-if="key1!='in'">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)">削除</button>
        <component v-bind:is="'swagger-'+key1" v-bind:name="key1" v-model="value_[key1]" v-if="['required','type','enum','format','items'].includes(key1)"></component>
        <swagger-common v-else-if="key1=='name'" v-bind:name="key1" v-model="value_[key1]" type="s"></swagger-common>
        <swagger-common v-else-if="key1=='description'" v-bind:name="key1" v-model="value_[key1]" type="L"></swagger-common>
        <swagger-common v-else-if="key1=='maximum' || key1=='minimum' || key1=='minItems' || key1=='maxItems' || key1=='maxLength' || key1=='minLength'" v-bind:name="key1" v-model="value_[key1]" type="n"></swagger-common>
        <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
      </div>
      <button class="btn btn-default btn-xs" v-on:click="do_add_element()">追加</button>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_parameters_objs_other }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      Vue.set(this.value_, element, to_default(element));
    }
  }
});

Vue.component('swagger-parameters', {
  props: ['value'],
  template: `
    <span>
      <label>parameters</label>
      <ul class="list-group">
        <li class="list-group-item" v-for="(value1, index1) in value_">
          <label>#{{index1 + 1}}</label><button class="btn btn-default btn-xs pull-right" v-on:click="do_delete_item(index1)">削除</button>
          <swagger-param-body v-if="value1.in=='body'" v-model="value_[index1]"></swagger-param-body>
          <swagger-param-other v-else-if="['formData','query','path','header'].includes(value1.in)" v-bind:name="value1.in" v-model="value_[index1]"></swagger-param-other>
          <swagger-common v-else name="unknown" v-model="value_[index1]" readonly></swagger-common>
        </li>
        <li class="list-group-item">
          <button class="btn btn-default btn-xs" v-on:click="do_add_element()">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_item: function(index){
      this.value_.splice(index, 1);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'parameter', choice : enum_in }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      var method = { in : element };
      this.value_.push(method);
    }
  }
});

Vue.component('swagger-properties', {
  props: ['value'],
  template: `
    <span>
      <label>properties</label>
      <ul class="list-group">
        <li v-for="(value1, key1, index1) in value_" class="list-group-item">
          <button class="btn btn-default btn-xs pull-right" v-on:click="do_delete_key(key1)">削除</button>
          <label>{{key1}}</label>
          <ul class="list-unstyled">
            <li v-for="(value2, key2, index2) in value1">
              <button class="btn btn-default btn-xs" v-on:click="do_delete_key2(key1, key2)">削除</button>
              <swagger-type v-if="key2=='type'" v-model="value_[key1][key2]"></swagger-type>
              <swagger-format v-else-if="key2=='format'" v-model="value_[key1][key2]"></swagger-format>
              <swagger-ref v-else-if="key2=='$ref'" v-model="value_[key1][key2]"></swagger-ref>
              <swagger-common v-else-if="key2=='description'" v-bind:name="key2" v-model="value_[key1][key2]" type="L"></swagger-common>
              <swagger-items v-else-if="key2=='items'" v-model="value_[key1][key2]"></swagger-items>
              <swagger-enum v-else-if="key2=='enum'" v-model="value_[key1][key2]"></swagger-enum>
              <swagger-common v-else v-bind:name="key2" v-model="value_[key1][key2]" readonly></swagger-common>
            </li>
            <li>
              <button class="btn btn-default btn-xs" v-on:click="do_add_element(key1)">追加</button>
            </li>
          </ul>
        </li>
        <li class="list-group-item">
          <button class="btn btn-default btn-xs" v-on:click="do_add_item">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_delete_key2: function(key1, key2){
      Vue.delete(this.value_[key1], key2);
    },
    do_add_element: function(key){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_properties_obj, key }, this.dialog_return);
    },
    do_add_item: function(){
      dialog_open('#append_string_dialog', { title: 'item' }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;

      if( content.title == 'item' ){
        var element = content.string;
        if( !element )
          return;

        if( this.value_[element] ){
            alert('すでに存在しています。');
            return;
        }

        Vue.set(this.value_, element, {});
      }else if( content.title == 'element' ){
        var element = content.selected;
        var key = content.key;
        if( this.value_[key][element] ){
            alert('すでに存在しています。');
            return;
        }

        Vue.set(this.value_[key], element, to_default(element));
      }
    }
  }
});

Vue.component('swagger-responses', {
  props: ['value'],
  template: `
    <span>
      <label>responses</label>
      <ul class="list-group">
        <li v-for="(value1, key1, index1) in value_" class="list-group-item">
          <button class="btn btn-default btn-xs pull-right" v-on:click="do_delete_key(key1)">削除</button>
          <label>{{key1}}</label>
          <div v-for="(value2, key2, index2) in value1">
            <button class="btn btn-default btn-xs" v-on:click="do_delete_key2(key1, key2)">削除</button>
            <swagger-common v-if="key2=='description'" v-bind:name="key2" v-model="value_[key1][key2]"></swagger-common>
            <swagger-schema v-else-if="key2=='schema'" v-model="value_[key1][key2]"></swagger-schema>
            <swagger-common v-else v-bind:name="key2" v-model="value_[key1][key2]" readonly></swagger-common>
          </div>
          <button class="btn btn-default btn-xs" v-on:click="do_add_element(key1)">追加</button>
        </li>
        <li class="list-group-item">
          <button class="btn btn-default btn-xs" v-on:click="do_add_code">追加</button>
        </li>
      </ul>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_delete_key2: function(key1, key2){
      Vue.delete(this.value_[key1], key2);
    },
    do_add_element: function(key){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_responses_obj, key }, this.dialog_return);
    },
    do_add_code: function(){
      dialog_open('#append_number_dialog', { title: 'code' }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;

      if( content.title == 'code' ){
        var element = content.number;
        if( element == undefined )
          return;

        if( !this.value_ ){
          this.value_ = {};
        }else
        if( this.value_[String(element)] ){
            alert('すでに存在しています。');
            return;
        }

        Vue.set(this.value_, String(element), {});
//        this.value_[String(element)] = {};
      }else if( content.title == 'element' ){
        var element = content.selected;
        var key = content.key;
        if( this.value_[key][element] ){
            alert('すでに存在しています。');
            return;
        }

        Vue.set(this.value_[key], element, to_default(element));
//        this.value_[key][element] = to_default(element);
      }
//      this.value_ = JSON.parse(JSON.stringify(this.value_));
    }
  }
});

Vue.component('swagger-method', {
  props: ['value'],
  template: `
    <span>
      <br>
      <div v-for="(value1, key1, index1) in value_" v-if="key1!='parameters' && key1!='responses'">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)">削除</button>
        <swagger-common v-if="key1=='summary'" v-bind:name="key1" v-model="value_[key1]" type="S"></swagger-common>
        <swagger-common v-else-if="key1=='description'" v-bind:name="key1" v-model="value_[key1]" type="L"></swagger-common>
        <swagger-common v-else-if="key1=='operationId'" v-bind:name="key1" v-model="value_[key1]" type="s"></swagger-common>
        <swagger-common v-else-if="key1=='x-swagger-router-controller'" v-bind:name="key1" v-model="value_[key1]" type="s"></swagger-common>
        <swagger-consprod v-else-if="key1=='consumes' || key1=='produces'" v-bind:name="key1" v-model="value_[key1]"></swagger-consprod>
        <swagger-security v-else-if="key1=='security'" v-model="value_[key1]"></swagger-security>
        <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
      </div>
      <br>
      <button class="btn btn-default btn-sm" v-on:click="do_add_element">追加</button>
      <hr>
      <div v-if="value_['parameters']">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key('parameters')">削除</button>
        <swagger-parameters v-model="value_['parameters']"></swagger-parameters>
      </div>
      <hr>
      <div v-if="value_['responses']">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key('responses')">削除</button>
        <swagger-responses v-model="value_['responses']"></swagger-responses>
      </div>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_add_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice: has_method_obj }, this.dialog_return);
    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
          alert('すでに存在しています。');
          return;
      }

      Vue.set(this.value_, element, to_default(element));
    }
  }
});

Vue.component('swagger-entrypoint', {
  props: ['id', 'collapse', 'value'],
  template: `
    <div>
      <div class="panel panel-default" v-for="(value1, key1, index) in value_">
        <div class="panel-heading">
          <div class="panel-title"><a data-toggle="collapse" v-bind:href="'#' + id + '_' + index">{{key1}}</a></div>
        </div>
        <div class="panel-collapse" v-bind:class="collapse=='true' ? 'collapse' : 'collapse in'" v-bind:id="id + '_' + index">
          <div class="panel-body" v-if="key1=='x-swagger-pipe'">
            {{value1}}
          </div>
          <div class="panel-body" v-else>
            <button class="btn btn-default btn-xs pull-right" v-on:click="do_delete_key(key1)">削除</button>
            <swagger-method v-model="value_[key1]"></swagger-method>
          </div>
        </div>
      </div>
      <button class="btn btn-default" v-on:click="do_append_method">メソッド追加</button>
    </div>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_append_method: function(){
      dialog_open('#append_select_dialog', { title: 'method', choice : enum_method }, this.dialog_return);
      return;

    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
        alert('すでに存在しています。');
        return;
      }

      Vue.set(this.value_, element, (element=='$ref') ? "" : {} );
    }
  }
});

Vue.component('swagger-definition', {
  props: ['value'],
  template: `
    <span>
      <div v-for="(value1, key1, index1) in value_" v-if="key1!='properties'">
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key(key1)" v-if="key1!='in'">削除</button>
        <swagger-type v-if="key1=='type'" v-model="value_[key1]"></swagger-type>
        <swagger-requiredprop v-else-if="key1=='required'" v-model="value_[key1]" v-bind:choice="value_['properties'] ? Object.keys(value_['properties']) : []"></swagger-requiredprop>
        <swagger-common v-else-if="key1=='title'" v-bind:name="key1" v-model="value_[key1]" type="S"></swagger-common>
        <swagger-common v-else v-bind:name="key1" v-model="value_[key1]" readonly></swagger-common>
      </div>
      <br>
      <button class="btn btn-default btn-sm" v-on:click="do_append_element">追加</button>
      <div v-if="value_['properties']">
        <br>
        <button class="btn btn-default btn-xs" v-on:click="do_delete_key('properties')">削除</button>
        <swagger-properties v-model="value_['properties']"></swagger-properties>
      </div>
    </span>
  `,
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
  },
  methods: {
    do_delete_key: function(key){
      Vue.delete(this.value_, key);
    },
    do_append_element: function(){
      dialog_open('#append_select_dialog', { title: 'element', choice : has_definitions_obj }, this.dialog_return);
      return;

    },
    dialog_return: function(status, content){
      if( status < 0 )
        return;
      
      var element = content.selected;
      if( this.value_[element] ){
        alert('すでに存在しています。');
        return;
      }

      Vue.set(this.value_, element, (element == 'required' ? [] : to_default(element)));
    }
  }
});

Vue.component('swagger-securitydefinitions', {
  props: ['value'],
  template: `
    <span>
      <ul>
        <li v-for="(value1, key1, index1) in value_">
          <label>{{key1}}</label> {{value1}}
        </li>
      </ul>
    </span>
  `,
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
