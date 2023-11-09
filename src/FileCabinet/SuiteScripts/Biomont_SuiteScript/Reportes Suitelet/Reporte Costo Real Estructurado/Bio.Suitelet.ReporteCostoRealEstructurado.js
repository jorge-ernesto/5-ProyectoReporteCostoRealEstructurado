// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Reporte Costo Real Structured (customscript_bio_sl_rep_cosreaest)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
const PATH = './../Reporte Costo Estandar y Costo Real/lib/';
define([`${PATH}Bio.Library.Search`, `${PATH}Bio.Library.Process`, `${PATH}Bio.Library.Helper`, './lib/Bio.Library.Process', 'N'],

    function (objSearch, objProcess, objHelper, objProccessMe, N) {

        const { log, runtime, email, file } = N;
        const { serverWidget, message } = N.ui;

        /******************/

        const DATA = {
            'clientScriptModulePath': './Bio.Client.ReporteCostoRealEstructurado.js'
        }

        // Crear formulario
        function createForm() {
            // Crear formulario
            let form = serverWidget.createForm({
                title: 'Hoja de costos por orden de producción (CMD, MOD, CIF)',
                hideNavBar: false
            });

            // Mostrar Grupo de Campos
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filters',
            })
            let fieldSubsidiary = form.addField({
                id: 'custpage_field_subsidiary',
                type: serverWidget.FieldType.SELECT,
                label: 'Subsidiaria',
                source: 'subsidiary',
                container: 'custpage_group'
            });
            let fieldDateFrom = form.addField({
                id: 'custpage_field_date_from',
                type: serverWidget.FieldType.DATE,
                label: 'Fecha Desde',
                container: 'custpage_group'
            });
            let fieldDateTo = form.addField({
                id: 'custpage_field_date_to',
                type: serverWidget.FieldType.DATE,
                label: 'Fecha Hasta',
                container: 'custpage_group'
            });
            let fieldCheckPaginate = form.addField({
                id: 'custpage_field_check_paginate',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'Paginación',
                container: 'custpage_group'
            });

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath;

            // Mostrar botones
            // form.addSubmitButton({ label: 'Consultar' });
            form.addButton({
                id: 'custpage_button_consultar',
                label: 'Consultar',
                functionName: 'consultar()'
            });
            form.addButton({
                id: 'custpage_button_csv',
                label: 'CSV',
                functionName: 'csv()'
            });

            // Obtener datos
            let { today, firstDayOfMonth } = objHelper.getDate();
            let { user } = objHelper.getUser();
            subsidiary = user.subsidiary;
            dateFrom = firstDayOfMonth;
            dateTo = today;
            checkPaginate = 'F'

            // Setear datos al formulario
            fieldSubsidiary.defaultValue = subsidiary;
            fieldDateFrom.defaultValue = dateFrom;
            fieldDateTo.defaultValue = dateTo;
            fieldCheckPaginate.defaultValue = checkPaginate;

            return { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldCheckPaginate }
        }

        function createSublistMD(form, dataReporte, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL MD
            // Agregar sublista
            let sublist_md = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_md',
                type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                label: 'Costo Real MD',
                container: 'tab_md'
            });

            // Setear cabecera a sublista
            sublist_md.addField({ id: 'custpage_nro_ord', type: serverWidget.FieldType.TEXT, label: 'nro_ord' });
            sublist_md.addField({ id: 'custpage_fec_ord', type: serverWidget.FieldType.TEXT, label: 'fec_ord' });
            sublist_md.addField({ id: 'custpage_cant_teor', type: serverWidget.FieldType.TEXT, label: 'cant_teor' });
            sublist_md.addField({ id: 'custpage_cant_real', type: serverWidget.FieldType.TEXT, label: 'cant_real' });
            sublist_md.addField({ id: 'custpage_rend', type: serverWidget.FieldType.TEXT, label: 'rend %' });
            sublist_md.addField({ id: 'custpage_codigo', type: serverWidget.FieldType.TEXT, label: 'codigo' });
            sublist_md.addField({ id: 'custpage_producto', type: serverWidget.FieldType.TEXT, label: 'producto' });
            sublist_md.addField({ id: 'custpage_lin', type: serverWidget.FieldType.TEXT, label: 'LIN' });
            sublist_md.addField({ id: 'custpage_cod_mat', type: serverWidget.FieldType.TEXT, label: 'cod_mat' });
            sublist_md.addField({ id: 'custpage_des_mat', type: serverWidget.FieldType.TEXT, label: 'des_mat' });
            sublist_md.addField({ id: 'custpage_cantidad', type: serverWidget.FieldType.TEXT, label: 'cantidad' });
            sublist_md.addField({ id: 'custpage_costo', type: serverWidget.FieldType.TEXT, label: 'costo' });
            sublist_md.addField({ id: 'custpage_fec_cierre', type: serverWidget.FieldType.TEXT, label: 'fec_cierre' });
            sublist_md.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'estado' });
            sublist_md.addField({ id: 'custpage_fecha_doc', type: serverWidget.FieldType.TEXT, label: 'Fecha Doc' });

            // Setear los datos obtenidos a sublista
            let dataMD = objProccessMe.getDataMD(dataReporte);
            dataMD.forEach((element, i) => {
                if (element.nro_ord) {
                    sublist_md.setSublistValue({ id: 'custpage_nro_ord', line: i, value: element.nro_ord });
                }
                if (element.fec_ord) {
                    sublist_md.setSublistValue({ id: 'custpage_fec_ord', line: i, value: element.fec_ord });
                }
                if (element.cant_teor) {
                    sublist_md.setSublistValue({ id: 'custpage_cant_teor', line: i, value: element.cant_teor });
                }
                if (element.cant_real) {
                    sublist_md.setSublistValue({ id: 'custpage_cant_real', line: i, value: element.cant_real });
                }
                if (element.rend) {
                    sublist_md.setSublistValue({ id: 'custpage_rend', line: i, value: element.rend });
                }
                if (element.codigo) {
                    sublist_md.setSublistValue({ id: 'custpage_codigo', line: i, value: element.codigo });
                }
                if (element.producto) {
                    sublist_md.setSublistValue({ id: 'custpage_producto', line: i, value: element.producto });
                }
                if (element.lin) {
                    sublist_md.setSublistValue({ id: 'custpage_lin', line: i, value: element.lin });
                }
                if (element.cod_mat) {
                    sublist_md.setSublistValue({ id: 'custpage_cod_mat', line: i, value: element.cod_mat });
                }
                if (element.des_mat) {
                    sublist_md.setSublistValue({ id: 'custpage_des_mat', line: i, value: element.des_mat });
                }
                if (element.cantidad) {
                    sublist_md.setSublistValue({ id: 'custpage_cantidad', line: i, value: element.cantidad });
                }
                if (element.costo) {
                    sublist_md.setSublistValue({ id: 'custpage_costo', line: i, value: element.costo });
                }
                if (element.fec_cierre) {
                    sublist_md.setSublistValue({ id: 'custpage_fec_cierre', line: i, value: element.fec_cierre });
                }
                if (element.estado) {
                    sublist_md.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                }
                if (element.fecha_doc) {
                    sublist_md.setSublistValue({ id: 'custpage_fecha_doc', line: i, value: element.fecha_doc });
                }
            });

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist_md.lineCount;
                sublist_md.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistMOD(form, dataReporte, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL MOD
            // Agregar sublista
            let sublist_mod = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_mod',
                type: sublistType,
                label: 'Costo Real MOD',
                container: 'tab_mod'
            });

            // Setear cabecera a sublista
            // Setear los datos obtenidos a sublista

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist_mod.lineCount;
                sublist_mod.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistSRV(form, dataReporte, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL SRV
            // Agregar sublista
            let sublist_srv = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_srv',
                type: sublistType,
                label: 'Costo Real MOD',
                container: 'tab_mod'
            });

            // Setear cabecera a sublista
            // Setear los datos obtenidos a sublista

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist_srv.lineCount;
                sublist_srv.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistCIF(form, dataReporte, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL CIF
            // Agregar sublista
            let sublist_cif = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_cif',
                type: sublistType,
                label: 'Costo Real MOD',
                container: 'tab_mod'
            });

            // Setear cabecera a sublista
            // ...

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist_cif.lineCount;
                sublist_cif.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        // Crear sublista
        function createSublist(form, dataReporte, checkPaginate) {
            let fDecimal = 6;

            // Tipo de Sublista
            let sublistType = null;
            if (checkPaginate == 'F') {
                sublistType = serverWidget.SublistType.LIST;
            } else if (checkPaginate == 'T') {
                sublistType = serverWidget.SublistType.STATICLIST;
            }

            createSublistMD(form, dataReporte, checkPaginate, fDecimal, sublistType);
            createSublistMOD(form, dataReporte, checkPaginate, fDecimal, sublistType);
            createSublistSRV(form, dataReporte, checkPaginate, fDecimal, sublistType);
            createSublistCIF(form, dataReporte, checkPaginate, fDecimal, sublistType);
        }

        // Crear csv
        function createCSV(dataReporte, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'reporteCostoEstandarCostoReal';
            let titleDocument = 'Reporte de costo estandar por elementos del costo';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            // ORDEN DE TRABAJO
            current.push('ORDEN DE TRABAJO');
            current.push('LOTE');
            current.push('TIPO DE ORDEN DE TRABAJO');
            current.push('ESTADO');
            current.push('FECHA');
            current.push('FECHA DE INICIO DE LA PRODUCCION');
            current.push('FECHA DE FINALIZACION DE PRODUCCION');
            current.push('FECHA DE COSTO ESTANDAR');
            current.push('CENTRO DE COSTO');
            current.push('CODIGO ORACLE');
            current.push('DESCRIPCION');
            current.push('CANTIDAD');
            current.push('COSTO TOTAL');
            // COSTO ESTANDAR
            current.push('COSTO EST MD');
            current.push('COSTO EST MOD');
            current.push('COSTO EST SRV');
            current.push('COSTO EST CIF');
            current.push('COSTO EST C.U.');
            // COSTO REAL
            current.push('COSTO REAL MD');
            current.push('COSTO REAL MOD');
            current.push('COSTO REAL SRV');
            current.push('COSTO REAL CIF');
            current.push('COSTO REAL C.U.');
            // DIFERENCIA SOLES
            current.push('DIF S/. MD');
            current.push('DIF S/. MOD');
            current.push('DIF S/. SRV');
            current.push('DIF S/. CIF');
            current.push('DIF S/. C.U.');
            // DIFERENCIA %
            current.push('DIF % MD');
            current.push('DIF % MOD');
            current.push('DIF % SRV');
            current.push('DIF % CIF');
            current.push('DIF % C.U.');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            dataReporte.forEach((element, i) => {
                let current = [];
                // ORDEN DE TRABAJO
                current.push(element.orden_trabajo);
                current.push(element.lote);
                current.push(element.tipo_orden_trabajo_nombre);
                current.push(element.estado);
                current.push(element.fec);
                current.push(element.fec_ini_prod);
                current.push(element.fec_fin_prod);
                current.push(element.fec_cos_est);
                current.push(element.centro_costo);
                current.push(element.codigo_oracle);
                current.push(element.descripcion);
                current.push(element.cantidad_construido);
                current.push(element.costo_total);
                // COSTO ESTANDAR
                current.push(element.costo_estandar_md);
                current.push(element.costo_estandar_mod);
                current.push(element.costo_estandar_srv);
                current.push(element.costo_estandar_cif);
                current.push(element.costo_estandar_total);
                // COSTO REAL
                current.push(element.costo_real_md);
                current.push(element.costo_real_mod);
                current.push(element.costo_real_srv);
                current.push(element.costo_real_cif);
                current.push(element.costo_real_total);
                // DIFERENCIA SOLES
                current.push(element.dif_md);
                current.push(element.dif_mod);
                current.push(element.dif_srv);
                current.push(element.dif_cif);
                current.push(element.dif_total);
                // DIFERENCIA %
                current.push(element.dif_md_);
                current.push(element.dif_mod_);
                current.push(element.dif_srv_);
                current.push(element.dif_cif_);
                current.push(element.dif_total_);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let csvFile = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFile, typeRep, titleDocument };
        }

        // Enviar email
        function sendEmail(csvFile, titleDocument, form) {
            // Enviar email
            let { user } = objHelper.getUser();

            email.send({
                author: user.id,
                recipients: user.id,
                subject: `${titleDocument}`,
                body: ' ',
                attachments: [csvFile]
            });

            form.addPageInitMessage({
                type: message.Type.INFORMATION,
                message: 'Se envio el archivo CSV a su correo.',
                duration: 25000 // 25 segundos
            });
        }

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameters', scriptContext.request.parameters);

            if (scriptContext.request.method == 'GET') {
                // Crear formulario
                let { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldCheckPaginate } = createForm();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let subsidiary = scriptContext.request.parameters['_subsidiary'];
                let dateFrom = scriptContext.request.parameters['_start'];
                let dateTo = scriptContext.request.parameters['_end'];
                let checkPaginate = scriptContext.request.parameters['_paginate'];

                if (button == 'consultar') {
                    // Setear datos al formulario
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldDateFrom.defaultValue = dateFrom;
                    fieldDateTo.defaultValue = dateTo;
                    fieldCheckPaginate.defaultValue = checkPaginate;

                    // Obtener datos por search
                    let dataOTByFecha = objSearch.getDataOTByFecha(subsidiary, dateFrom, dateTo);
                    let dataOT = objSearch.getDataOTByLote(subsidiary, dataOTByFecha['data']);
                    let dataRevaluacion = objSearch.getDataRevaluacion(subsidiary);
                    let dataOT_RegistrosRelacionados = objSearch.getDataOT_RegistrosRelacionados(subsidiary, dataOTByFecha['data']);
                    let dataOT_EmisionesOrdenesProduccion = objSearch.getDataOT_EmisionesOrdenesProduccion(subsidiary, dataOT_RegistrosRelacionados['data'])
                    let dataOT_DatosProduccion = objSearch.getDataOT_DatosProduccion(subsidiary, dateFrom, dateTo, dataOT['data']);
                    let dataOT_Completo = objProcess.getDataOT_Completo(dataOT['data'], dataRevaluacion['data'], dataOT_RegistrosRelacionados['data'], dataOT_EmisionesOrdenesProduccion['data'], dataOT_DatosProduccion['data']);

                    // Debug
                    objHelper.error_log('', dataOT_Completo);

                    // Procesar reporte
                    let dataReporte = dataOT_Completo

                    // Crear sublista
                    createSublist(form, dataReporte, checkPaginate);
                } else if (button == 'csv') {
                    // Setear datos al formulario
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldDateFrom.defaultValue = dateFrom;
                    fieldDateTo.defaultValue = dateTo;
                    fieldCheckPaginate.defaultValue = checkPaginate;

                    // Obtener datos por search
                    let dataOTByFecha = objSearch.getDataOTByFecha(subsidiary, dateFrom, dateTo);
                    let dataOT = objSearch.getDataOTByLote(subsidiary, dataOTByFecha['data']);
                    let dataRevaluacion = objSearch.getDataRevaluacion(subsidiary);
                    let dataOT_RegistrosRelacionados = objSearch.getDataOT_RegistrosRelacionados(subsidiary, dataOTByFecha['data']);
                    let dataOT_EmisionesOrdenesProduccion = objSearch.getDataOT_EmisionesOrdenesProduccion(subsidiary, dataOT_RegistrosRelacionados['data'])
                    let dataOT_DatosProduccion = objSearch.getDataOT_DatosProduccion(subsidiary, dateFrom, dateTo, dataOT['data']);
                    let dataOT_Completo = objProcess.getDataOT_Completo(dataOT['data'], dataRevaluacion['data'], dataOT_RegistrosRelacionados['data'], dataOT_EmisionesOrdenesProduccion['data'], dataOT_DatosProduccion['data']);

                    // Procesar reporte
                    let dataReporte = objProcess.getReporte_CSV_Excel(dataOT_Completo);

                    // Crear csv
                    let { csvFile, titleDocument } = createCSV(dataReporte, dateFrom, dateTo);

                    // Enviar email
                    sendEmail(csvFile, titleDocument, form);
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            }
        }

        return { onRequest }

    });
