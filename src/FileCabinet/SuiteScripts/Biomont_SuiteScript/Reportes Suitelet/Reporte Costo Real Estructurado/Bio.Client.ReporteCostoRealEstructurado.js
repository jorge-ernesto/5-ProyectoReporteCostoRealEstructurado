/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { currentRecord, url } = N;

        const scriptId = 'customscript_bio_sl_rep_cosreaest';
        const deployId = 'customdeploy_bio_sl_rep_cosreaest';

        const CONFIG_RECORD = {
            fields_mandatory: {
                subsidiary: {
                    id: 'custpage_field_subsidiary',
                    label: 'Subsidiaria'
                },
                start: {
                    id: 'custpage_field_date_from',
                    label: 'Fecha Desde'
                },
                end: {
                    id: 'custpage_field_date_to',
                    label: 'Fecha Hasta'
                },
                year: {
                    id: 'custpage_field_year_calculate_cif',
                    label: 'Año para el calculo del CIF'
                },
                month: {
                    id: 'custpage_field_month_calculate_cif',
                    label: 'Mes para el calculo del CIF'
                }
            }
        }

        /******************/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

            // setTimeout(() => {
            //     let boton1 = document.getElementById('tr_custpage_button');
            //     boton1.classList.add('pgBntB');

            //     let boton2 = document.getElementById('tr_secondarycustpage_button');
            //     boton2.classList.add('pgBntB');
            // }, 500);

            let currentRecord = scriptContext.currentRecord;

            // Hacer campos obligatorios
            for (var key in CONFIG_RECORD.fields_mandatory) {
                let nombre_campo = CONFIG_RECORD.fields_mandatory[key]['id']
                currentRecord.getField(nombre_campo).isMandatory = true;
            }

        }

        function consultar() {

            // Obtener el currentRecord
            // En una funcion personalizada, no viene ningun currenRecord, entonces debemos usar el modulo base
            // currentRecord.get(), recupera el mismo currentRecord que tiene cada funcion estandar
            let recordContext = currentRecord.get();

            // Validar campos obligatorios
            if (validarCampos(recordContext)) return;

            // Recuperar valores de los campos
            let subsidiary = recordContext.getValue('custpage_field_subsidiary')
            let start = recordContext.getText('custpage_field_date_from');
            let end = recordContext.getText('custpage_field_date_to');
            let lote = recordContext.getText('custpage_field_lote').trim();
            let year = recordContext.getValue('custpage_field_year_calculate_cif');
            let month = recordContext.getValue('custpage_field_month_calculate_cif');
            let paginate = recordContext.getText('custpage_field_check_paginate');

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _button: 'consultar',
                    _subsidiary: subsidiary,
                    _start: start,
                    _end: end,
                    _lote: lote,
                    _year: year,
                    _month: month,
                    _paginate: paginate
                }
            })

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = suitelet;
        }

        function csv() {

            // Obtener el currentRecord
            // En una funcion personalizada, no viene ningun currenRecord, entonces debemos usar el modulo base
            // currentRecord.get(), recupera el mismo currentRecord que tiene cada funcion estandar
            let recordContext = currentRecord.get();

            // Validar campos obligatorios
            if (validarCampos(recordContext)) return;

            // Recuperar valores de los campos
            let subsidiary = recordContext.getValue('custpage_field_subsidiary')
            let start = recordContext.getText('custpage_field_date_from');
            let end = recordContext.getText('custpage_field_date_to');
            let lote = recordContext.getText('custpage_field_lote').trim();
            let year = recordContext.getValue('custpage_field_year_calculate_cif');
            let month = recordContext.getValue('custpage_field_month_calculate_cif');
            let paginate = recordContext.getText('custpage_field_check_paginate');

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _button: 'csv',
                    _subsidiary: subsidiary,
                    _start: start,
                    _end: end,
                    _lote: lote,
                    _year: year,
                    _month: month,
                    _paginate: paginate
                }
            })

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = suitelet;
        }

        function validarCampos(recordContext) {

            let mensaje = 'Introduzca valores para:';
            let errores = {};

            for (var key in CONFIG_RECORD.fields_mandatory) {
                let fieldId = CONFIG_RECORD.fields_mandatory[key]['id'];
                if (!recordContext.getValue(fieldId)) {
                    errores[CONFIG_RECORD.fields_mandatory[key]['id']] = CONFIG_RECORD.fields_mandatory[key]['label'];
                };
            }

            if (Object.keys(errores).length > 0) {
                for (let error in errores) {
                    mensaje += ` ${errores[error]},`
                }
                mensaje = mensaje.substring(0, mensaje.length - 1);
                alert(mensaje);
                return true;
            }

            return false;
        }

        return {
            pageInit: pageInit,
            consultar: consultar,
            csv: csv
        };

    });
