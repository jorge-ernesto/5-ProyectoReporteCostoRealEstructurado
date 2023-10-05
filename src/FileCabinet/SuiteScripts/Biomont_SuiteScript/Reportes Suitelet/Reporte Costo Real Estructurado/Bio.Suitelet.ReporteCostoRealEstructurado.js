// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Reporte Costo Real Structured (customscript_bio_sl_rep_cosreaest)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
const PATH = './../Reporte Costo Estandar y Costo Real/lib/';
define([`${PATH}Bio.Library.Search`, `${PATH}Bio.Library.Process`, `${PATH}Bio.Library.Helper`, './lib/Bio.Library.Process', './lib/Bio.Library.Widget', 'N'],

    function (objSearch, objProcess, objHelper, objProcessMe, objWidgetMe, N) {

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
                title: 'Reporte hojas de costos por orden de producción (CMD, MOD, SRV, CIF)',
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
            let fieldLote = form.addField({
                id: 'custpage_field_lote',
                type: serverWidget.FieldType.TEXT,
                label: 'Lote',
                container: 'custpage_group'
            });
            let fieldYearCalculateCIF = form.addField({
                id: 'custpage_field_year_calculate_cif',
                type: serverWidget.FieldType.SELECT,
                label: 'Año para el calculo del CIF',
                container: 'custpage_group'
            });
            let fieldMonthCalculateCIF = form.addField({
                id: 'custpage_field_month_calculate_cif',
                type: serverWidget.FieldType.SELECT,
                label: 'Mes para el calculo del CIF',
                container: 'custpage_group'
            });
            let fieldCheckPaginate = form.addField({
                id: 'custpage_field_check_paginate',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'Paginación',
                container: 'custpage_group'
            });

            // Setear propiedad a campo del formulario - Buscar la documentación del modulo N/ui/serverWidget
            fieldDateTo.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
            });
            fieldYearCalculateCIF.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
            });
            fieldCheckPaginate.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
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
            let { today, firstDayOfMonth, firstDayOfMonthPast, lastDayOfMonthPast, yearOfMonthPast, monthOfMonthPast } = objHelper.getDate();
            let { user } = objHelper.getUser();
            subsidiary = user.subsidiary;
            dateFrom = firstDayOfMonthPast;
            dateTo = lastDayOfMonthPast;
            checkPaginate = 'F'

            // Setear datos al formulario
            fieldSubsidiary.defaultValue = subsidiary;
            fieldDateFrom.defaultValue = dateFrom;
            fieldDateTo.defaultValue = dateTo;
            fieldCheckPaginate.defaultValue = checkPaginate;

            // Obtener datos y setear datos
            let dataYear = objHelper.getYear();
            dataYear.forEach(element => {
                fieldYearCalculateCIF.addSelectOption({
                    value: element.id,
                    text: element.name
                });
            });
            fieldYearCalculateCIF.defaultValue = yearOfMonthPast.toString();

            let dataMonth = objHelper.getMonth();
            dataMonth.forEach(element => {
                fieldMonthCalculateCIF.addSelectOption({
                    value: element.id,
                    text: element.name
                });
            });
            fieldMonthCalculateCIF.defaultValue = monthOfMonthPast.toString();

            return { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldLote, fieldYearCalculateCIF, fieldMonthCalculateCIF, fieldCheckPaginate }
        }

        // Crear sublista
        function createSublist(form, dataMD, dataMOD, dataSRV, dataCIF, checkPaginate) {
            let fDecimal = 6;

            // Tipo de Sublista
            let sublistType = null;
            if (checkPaginate == 'F') {
                sublistType = serverWidget.SublistType.LIST;
            } else if (checkPaginate == 'T') {
                sublistType = serverWidget.SublistType.STATICLIST;
            }

            objWidgetMe.createSublistMD(form, dataMD, checkPaginate, fDecimal, sublistType);
            objWidgetMe.createSublistMOD(form, dataMOD, checkPaginate, fDecimal, sublistType);
            objWidgetMe.createSublistSRV(form, dataSRV, checkPaginate, fDecimal, sublistType);
            objWidgetMe.createSublistCIF(form, dataCIF, checkPaginate, fDecimal, sublistType);
        }

        // Enviar email
        function sendEmail(csvFileMD, csvFileMOD, csvFileSRV, csvFileCIF, csvFileFactorCIF, titleDocument, form) {
            // Enviar email
            let { user } = objHelper.getUser();

            email.send({
                author: user.id,
                recipients: user.id,
                subject: `${titleDocument}`,
                body: ' ',
                attachments: [csvFileMD, csvFileMOD, csvFileSRV, csvFileCIF, csvFileFactorCIF]
            });

            form.addPageInitMessage({
                type: message.Type.INFORMATION,
                message: 'Se envio el archivo CSV a su correo.',
                duration: 25000 // 25 segundos
            });
        }

        // Validar cantidad de registros
        function validarCantidadRegistros(form, scriptContext, dataValidar, recomendacion) {
            let cantidad = 0;
            dataValidar.forEach(element => {
                cantidad += element.length;
            });

            if (cantidad > 4000) {
                form.addPageInitMessage({
                    type: message.Type.WARNING,
                    message: `La cantidad de registros supera los 4000 registros. Se recomienda usar la opción ${recomendacion}. Cantidad de registros: ${cantidad}.`,
                    duration: 25000 // 25 segundos
                });
                scriptContext.response.writePage(form);
                return true;
            }
            return false;
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
                let { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldLote, fieldYearCalculateCIF, fieldMonthCalculateCIF, fieldCheckPaginate } = createForm();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let subsidiary = scriptContext.request.parameters['_subsidiary'];
                let dateFrom = scriptContext.request.parameters['_start'];
                let dateTo = scriptContext.request.parameters['_end'];
                let lote = scriptContext.request.parameters['_lote'];
                let year = scriptContext.request.parameters['_year'];
                let month = scriptContext.request.parameters['_month'];
                let checkPaginate = scriptContext.request.parameters['_paginate'];

                if (button == 'consultar' || button == 'csv') {

                    // Setear datos al formulario
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldDateFrom.defaultValue = dateFrom;
                    fieldDateTo.defaultValue = dateTo;
                    fieldLote.defaultValue = lote;
                    fieldYearCalculateCIF.defaultValue = year;
                    fieldMonthCalculateCIF.defaultValue = month;
                    fieldCheckPaginate.defaultValue = checkPaginate;

                    // Obtener datos por search
                    let dataOTByFecha = objSearch.getDataOTByFecha(subsidiary, dateFrom, dateTo, lote);
                    let dataOT = objSearch.getDataOTByLote(subsidiary, dataOTByFecha['data']);
                    let dataRevaluacion = objSearch.getDataRevaluacion(subsidiary);
                    let dataOT_RegistrosRelacionados = objSearch.getDataOT_RegistrosRelacionados(subsidiary, dataOTByFecha['data']);
                    let dataOT_EmisionesOrdenesProduccion = objSearch.getDataOT_EmisionesOrdenesProduccion(subsidiary, dataOT_RegistrosRelacionados['data'])
                    let dataOT_DatosProduccion = objSearch.getDataOT_DatosProduccion(subsidiary, dateFrom, dateTo, dataOT['data']);
                    let dataOT_Completo = objProcess.getDataOT_Completo(dataOT['data'], dataRevaluacion['data'], dataOT_RegistrosRelacionados['data'], dataOT_EmisionesOrdenesProduccion['data'], dataOT_DatosProduccion['data'], eliminar_datos = false);

                    // Performance
                    // log.debug('Time', new Date().toLocaleString('es-ES'));
                    // Debug
                    // objHelper.error_log('', dataOT_Completo);

                    // Obtener factor CIF por meses y asignarlos a las OTs
                    let fechas = objHelper.getDatesByOT(dataOT_Completo);
                    let dataFactorCIF = {}; // * Audit: Util, manejo de JSON
                    fechas.forEach(element => {
                        let year = element.year;
                        let month = element.month;

                        let dataReporteGastos_Cuentas6168 = objSearch.getDataReporteGastos_Cuentas6168(subsidiary, year, month);
                        dataFactorCIF[year] = dataFactorCIF[year] || {};
                        dataFactorCIF[year][month] = objProcess.getFactorCIFbyMonth(dataOT_Completo, dataReporteGastos_Cuentas6168['data'], { 'anio': year, 'mes': month });
                    });
                    dataOT_Completo = objProcess.asignarFactorCIFByOTs(dataOT_Completo, dataFactorCIF);
                    // Cerrar Obtener factor CIF por meses y asignarlos a las OTs

                    // Debug
                    // objHelper.error_log('', fechas);
                    // objHelper.error_log('', dataFactorCIF);
                    // objHelper.error_log('', dataOT_Completo);
                    // objHelper.error_log_by_lote('', dataOT_Completo, ['083433']);

                    // Procesar reporte
                    let dataMD = objProcessMe.getDataMD(dataOT_Completo);
                    let dataMOD = objProcessMe.getDataMOD_SRV(dataOT_Completo, 'mod');
                    let dataSRV = objProcessMe.getDataMOD_SRV(dataOT_Completo, 'srv');
                    let dataCIF = objProcessMe.getDataMOD_SRV(dataOT_Completo, 'mod_srv', { 'anio': year, 'mes': month, 'dataFactorCIF': dataFactorCIF[year][month] });
                    let dataFactorCIF_Formateada = objProcessMe.getDataFactorCIF(dataFactorCIF);

                    // Debug
                    // objHelper.error_log('', dataMD);
                    // objHelper.error_log('', dataMOD);
                    // objHelper.error_log('', dataSRV);
                    // objHelper.error_log('', dataCIF);
                    // objHelper.error_log('', dataFactorCIF_Formateada);

                    if (button == 'consultar') {

                        // Validar cantidad de registros
                        let dataValidar = [dataMD, dataMOD, dataSRV, dataCIF];
                        let recomendacion = 'CSV'
                        if (validarCantidadRegistros(form, scriptContext, dataValidar, recomendacion) == true) return;

                        // Crear sublista
                        createSublist(form, dataMD, dataMOD, dataSRV, dataCIF, checkPaginate);
                    } else if (button == 'csv') {

                        // Crear csv
                        let titleDocument = 'Reporte Costo Real Estructurado';
                        let { csvFileMD } = objWidgetMe.createCSV_MD(dataMD, dateFrom, dateTo);
                        let { csvFileMOD } = objWidgetMe.createCSV_MOD(dataMOD, dateFrom, dateTo);
                        let { csvFileSRV } = objWidgetMe.createCSV_SRV(dataSRV, dateFrom, dateTo);
                        let { csvFileCIF } = objWidgetMe.createCSV_CIF(dataCIF, dateFrom, dateTo, year, month);
                        let { csvFileFactorCIF } = objWidgetMe.createCSV_FactorCIF(dataFactorCIF_Formateada, dateFrom, dateTo);

                        // Enviar email
                        sendEmail(csvFileMD, csvFileMOD, csvFileSRV, csvFileCIF, csvFileFactorCIF, titleDocument, form);
                    }
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            }
        }

        return { onRequest }

    });
