

export const dValidate =  {
    inserted(el, binding, vnode){
        // If index 3 false, dont do any thing.
        if(binding.value[2] == false){
            return;
        }
        // Get component name
        let componentName = vnode.context.$options._componentTag;
        // Add class validation to know which input.
        el.classList.add("validation-"+componentName);
        el.setAttribute(`data-validation`, JSON.stringify(binding.value))
        let name = (binding.value[1]).replace(/\s/g, ''); + '-validation';

        let handler = function(e) {
            let val = (e.srcElement.value || e.srcElement.outerText);
            if(e.srcElement.parentElement.classList[0] == 'bootstrap-tagsinput'){
                val = '';
                $(e.path[1]).children('span.tag').each(function (n) {
                    val += $(this).text();
                })
            }
            let codes = binding.value[0];
            let name = binding.value[1];
            vnode.context.inputValidation([val,name,codes]);
            vnode.context.showMessage(name, vnode.context.errorFor(name))
        }
        // Prepare a div to show if there error message.
        var component = {
            template: '<div class="'+name+'"></div>'
        };
        Vue.component('my-component', component);
        var myComponent = Vue.extend(component);
        var component = new myComponent().$mount();
        el.parentElement.append(component.$el);
        // on input (changes) run the handler.
        if(el.getAttribute('type') == 'radio'){
            el.parentElement.addEventListener('input', handler);
        }else if (el.getAttribute('type') == null) {
            if(vnode.tag == 'textarea'){
                el.parentElement.addEventListener('input', handler);
            }else{
                if(vnode.data.staticClass && vnode.data.staticClass.includes('select2')){
                    el.parentElement.addEventListener('select', handler);

                }else if(el.getAttribute('handle')) {
                    el.parentElement.addEventListener('input', handler);

                }else
                {
                    el.parentElement.addEventListener('focusout', handler);
                }
            }
        }else if(el.className.includes('tagsinput')) {
            el.parentElement.addEventListener('focusout', handler);
        }else{
            el.addEventListener('input', handler);

        }

    }
}
export const dSubmit =  {
    inserted(el, binding, vnode){
        let handler = function(e) {
            if(!vnode.context.submitCheck())
                return;

            this.errors = {};
            binding.value();
        }
        // on (click) run the handler.
        el.addEventListener('click', handler);
    }
}
export const dRequire =   {
    inserted(el, binding, vnode){
        if(binding.value == false){
            return;
        }
        var component = {
            template: '<span style="color:red;">*</span>'
        };
        Vue.component('my-component', component);
        var myComponent = Vue.extend(component);
        var component = new myComponent().$mount();
        el.after(component.$el);
    }
}

import validationError from './files/ValidationError';


export default {
    install(Vue, options) {
        Vue.directive('validate', dValidate);
        Vue.directive('submit', dSubmit);
        Vue.directive('required', dRequire);
        Vue.mixin(validationError);
    }
};
