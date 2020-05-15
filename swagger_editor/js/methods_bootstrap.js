var methods_bootstrap = {
    dialog_custom_open: function(target, initial_content, callback){
        if( !target || !callback )
            return;

        this.dialog_callback = callback;
        this.dialog_content = initial_content;
        this.dialog_open(target);
    },
    dialog_custom_close: function(status){
        this.dialog_close();

        try{
            if( !this.dialog_callback )
                return;
            this.dialog_callback(status, this.dialog_content);
        }catch(error){
            console.log(error);
            alert(error);
        }finally{
            this.dialog_callback = null;
        }
    },
    dialog_open: function(target, backdrop = 'static'){
        this.dialog_target = target;
        $(target).modal({backdrop: backdrop, keyboard: false});
    },
    dialog_close: function(){
        if( this.dialog_target ){
            $(this.dialog_target).modal('hide');
            this.dialog_target = null;
        }
    },
    panel_open: function(target){
        $(target).collapse("show");
    },
    panel_close: function(target){
        $(target).collapse("hide");
    },
    progress_open: function(title = '少々お待ちください。', backdrop){
        this.progress_title = title;
        this.dialog_open('#progress', backdrop);
    },
    progress_close: function(){
        this.dialog_close();
    },
    toast_show: function(message, title, level = "info", option){
        toastr[level](message, title, option);
    }
};
