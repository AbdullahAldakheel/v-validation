// import i18n from "../../app";

export default {
    data() {
        return {
            errors: {},
        };
    },
    methods: {
        errorFor(field) {
            return this.errors != null && this.errors[field]
                ? this.errors[field]
                : null;
        },
        getValidationCodes(code){
            return require('./validationCodes.json')[code] || '';
        },
        inputValidation(Comp){
            let [data, name, codes] = Comp;
            let ok = true;
            this.clearValues(name);
            if(Array.isArray(data)){
                data.length > 0 ? data = data.join() : data = '';
            }
            console.log(codes)
            codes.forEach(code => {
                let vc = this.getValidationCodes(code);
                var regex = new RegExp(vc.regex);

                if(!regex.test((data || '').toLowerCase())){
                    let tmp = this.errors || {};
                    tmp[name] = [(((vc.message)).replace(':attribute', (name)))];
                    this.errors = null;
                    this.errors = tmp;
                    ok = false;

                }
            })
            return ok;
        },clearValues(name){
            let tmp = this.errors || {};
            delete tmp[name];
            this.errors = null;
            this.errors = tmp;
        },submitCheck(inputs = null){
            let that = this;
            let ok = true;

            $('.validation-'+that.$options._componentTag).each(function( e ) {
                let validate = true;
                let v = JSON.parse($(this).attr('data-validation'))[1];
                if(inputs){
                    if(inputs.indexOf(v) == -1)
                        validate = false;
                }
                if(validate){
                    let Currentvalue = ($(this).val() || '');
                    if($(this)[0]['__vue__']){

                        Currentvalue = $(this)[0]['__vue__'].value;
                    }
                    if($(this)[0].type == 'radio'){

                        if( $(this).parent().children('input:checked').length == 0){
                            Currentvalue = '';
                        }
                    }


                    let data = JSON.parse($(this).attr('data-validation'));
                    !ok ? that.inputValidation([Currentvalue, data[1], data[0] ]) : ok = that.inputValidation([Currentvalue, data[1], data[0] ]);
                    that.showMessage(data[1], that.errors[data[1]]);
                }

            });
            return ok;
        },showMessage(inputName, errorMessage){
            let name = inputName.replace(/\s/g, ''); + '-validation';
                if(errorMessage){
                    $('.'+name).addClass('invalid-tooltip');
                    $('.'+name).parent().css('margin-bottom','50px');
                    $('.'+name).html(errorMessage);
                }else{
                    $('.'+name).removeClass('invalid-tooltip');
                    $('.'+name).parent().css('margin-bottom','20px');
                    $('.'+name).html('');
                }

        }

    }
};