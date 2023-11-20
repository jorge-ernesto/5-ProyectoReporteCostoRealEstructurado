// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Conf Centro de Costo - Linea (customscript_bio_ue_conf_cencos_lin)
// - Registro:
//      - Configuración de Centro de Costo - Línea (customrecord_bio_conf_cencos_lin)

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { log } = N;
        const { serverWidget } = N.ui;

        /******************/

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        function beforeLoad(scriptContext) {

            // Obtener form
            let form = scriptContext.form;

            // Setear propiedad a campo del formulario
                // Recuperar un campo del formulario
                let fieldIsInactive = form.getField({
                    id: 'isinactive'
                });

                // Convertir en hidden un campo
                fieldIsInactive.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
        }

        return { beforeLoad };

    });
