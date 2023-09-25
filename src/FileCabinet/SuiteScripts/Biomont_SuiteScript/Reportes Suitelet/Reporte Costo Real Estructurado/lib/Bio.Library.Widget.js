/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
const PATH_ = './../../Reporte Costo Estandar y Costo Real/lib/';
define([`${PATH_}Bio.Library.Helper`, 'N'],

    function (objHelper, N) {

        const { file } = N;
        const { serverWidget } = N.ui;

        function createSublistMD(form, data, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL MD
            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_md',
                type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                label: 'Costo Real MD',
                container: 'tab_md'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_nro_ord', type: serverWidget.FieldType.TEXT, label: 'nro_ord' });
            sublist.addField({ id: 'custpage_lote', type: serverWidget.FieldType.TEXT, label: 'lote' });
            sublist.addField({ id: 'custpage_fec_ord', type: serverWidget.FieldType.TEXT, label: 'fec_ord' });
            sublist.addField({ id: 'custpage_cant_teor', type: serverWidget.FieldType.TEXT, label: 'cant_teor' });
            sublist.addField({ id: 'custpage_cant_real', type: serverWidget.FieldType.TEXT, label: 'cant_real' });
            sublist.addField({ id: 'custpage_rend', type: serverWidget.FieldType.TEXT, label: 'rend %' });
            sublist.addField({ id: 'custpage_codigo', type: serverWidget.FieldType.TEXT, label: 'codigo' });
            sublist.addField({ id: 'custpage_producto', type: serverWidget.FieldType.TEXT, label: 'producto' });
            sublist.addField({ id: 'custpage_lin_mat', type: serverWidget.FieldType.TEXT, label: 'lin_mat' });
            sublist.addField({ id: 'custpage_cod_mat', type: serverWidget.FieldType.TEXT, label: 'cod_mat' });
            sublist.addField({ id: 'custpage_des_mat', type: serverWidget.FieldType.TEXT, label: 'des_mat' });
            sublist.addField({ id: 'custpage_cantidad', type: serverWidget.FieldType.TEXT, label: 'cantidad' });
            sublist.addField({ id: 'custpage_costo', type: serverWidget.FieldType.TEXT, label: 'costo' });
            sublist.addField({ id: 'custpage_fec_cierre', type: serverWidget.FieldType.TEXT, label: 'fec_cierre' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'estado' });
            sublist.addField({ id: 'custpage_fec_doc', type: serverWidget.FieldType.TEXT, label: 'fec_doc' });

            // Setear los datos obtenidos a sublista
            data.forEach((element, i) => {
                if (element.nro_ord) {
                    sublist.setSublistValue({ id: 'custpage_nro_ord', line: i, value: element.nro_ord });
                }
                if (element.lote) {
                    sublist.setSublistValue({ id: 'custpage_lote', line: i, value: element.lote });
                }
                if (element.fec_ord) {
                    sublist.setSublistValue({ id: 'custpage_fec_ord', line: i, value: element.fec_ord });
                }
                if (element.cant_teor) {
                    sublist.setSublistValue({ id: 'custpage_cant_teor', line: i, value: element.cant_teor });
                }
                if (element.cant_real) {
                    sublist.setSublistValue({ id: 'custpage_cant_real', line: i, value: element.cant_real });
                }
                if (element.rend) {
                    sublist.setSublistValue({ id: 'custpage_rend', line: i, value: element.rend });
                }
                if (element.codigo) {
                    sublist.setSublistValue({ id: 'custpage_codigo', line: i, value: element.codigo });
                }
                if (element.producto) {
                    sublist.setSublistValue({ id: 'custpage_producto', line: i, value: element.producto });
                }
                if (element.lin_mat) {
                    sublist.setSublistValue({ id: 'custpage_lin_mat', line: i, value: element.lin_mat });
                }
                if (element.cod_mat) {
                    sublist.setSublistValue({ id: 'custpage_cod_mat', line: i, value: element.cod_mat });
                }
                if (element.des_mat) {
                    sublist.setSublistValue({ id: 'custpage_des_mat', line: i, value: element.des_mat });
                }
                if (element.cantidad) {
                    sublist.setSublistValue({ id: 'custpage_cantidad', line: i, value: element.cantidad });
                }
                if (element.costo) {
                    sublist.setSublistValue({ id: 'custpage_costo', line: i, value: element.costo });
                }
                if (element.fec_cierre) {
                    sublist.setSublistValue({ id: 'custpage_fec_cierre', line: i, value: element.fec_cierre });
                }
                if (element.estado) {
                    sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                }
                if (element.fec_doc) {
                    sublist.setSublistValue({ id: 'custpage_fec_doc', line: i, value: element.fec_doc });
                }
            });

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist.lineCount;
                sublist.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistMOD(form, data, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL MOD
            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_mod',
                type: sublistType,
                label: 'Costo Real MOD',
                container: 'tab_mod'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_nro_ord', type: serverWidget.FieldType.TEXT, label: 'nro_ord' });
            sublist.addField({ id: 'custpage_lote', type: serverWidget.FieldType.TEXT, label: 'lote' });
            sublist.addField({ id: 'custpage_fec_ord', type: serverWidget.FieldType.TEXT, label: 'fec_ord' });
            sublist.addField({ id: 'custpage_cant_teor', type: serverWidget.FieldType.TEXT, label: 'cant_teor' });
            sublist.addField({ id: 'custpage_cant_real', type: serverWidget.FieldType.TEXT, label: 'cant_real' });
            sublist.addField({ id: 'custpage_rend', type: serverWidget.FieldType.TEXT, label: 'rend %' });
            sublist.addField({ id: 'custpage_categoria', type: serverWidget.FieldType.TEXT, label: 'categoria' });
            sublist.addField({ id: 'custpage_empleado', type: serverWidget.FieldType.TEXT, label: 'empleado' });
            sublist.addField({ id: 'custpage_lin', type: serverWidget.FieldType.TEXT, label: 'lin' });
            sublist.addField({ id: 'custpage_codigo', type: serverWidget.FieldType.TEXT, label: 'codigo' });
            sublist.addField({ id: 'custpage_producto', type: serverWidget.FieldType.TEXT, label: 'producto' });
            sublist.addField({ id: 'custpage_horas', type: serverWidget.FieldType.TEXT, label: 'horas' });
            sublist.addField({ id: 'custpage_fec_cierre', type: serverWidget.FieldType.TEXT, label: 'fec_cierre' });
            sublist.addField({ id: 'custpage_anio', type: serverWidget.FieldType.TEXT, label: 'anio' });
            sublist.addField({ id: 'custpage_mes', type: serverWidget.FieldType.TEXT, label: 'mes' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'estado' });
            sublist.addField({ id: 'custpage_soles_x_hr', type: serverWidget.FieldType.TEXT, label: 'S/. X Hr.' });
            sublist.addField({ id: 'custpage_total_soles', type: serverWidget.FieldType.TEXT, label: 'C. TOTAL. S/.' });

            // Setear los datos obtenidos a sublista
            data.forEach((element, i) => {
                if (element.nro_ord) {
                    sublist.setSublistValue({ id: 'custpage_nro_ord', line: i, value: element.nro_ord });
                }
                if (element.lote) {
                    sublist.setSublistValue({ id: 'custpage_lote', line: i, value: element.lote });
                }
                if (element.fec_ord) {
                    sublist.setSublistValue({ id: 'custpage_fec_ord', line: i, value: element.fec_ord });
                }
                if (element.cant_teor) {
                    sublist.setSublistValue({ id: 'custpage_cant_teor', line: i, value: element.cant_teor });
                }
                if (element.cant_real) {
                    sublist.setSublistValue({ id: 'custpage_cant_real', line: i, value: element.cant_real });
                }
                if (element.rend) {
                    sublist.setSublistValue({ id: 'custpage_rend', line: i, value: element.rend });
                }
                if (element.categoria) {
                    sublist.setSublistValue({ id: 'custpage_categoria', line: i, value: element.categoria });
                }
                if (element.empleado_proveedor_servicio) {
                    sublist.setSublistValue({ id: 'custpage_empleado', line: i, value: element.empleado_proveedor_servicio });
                }
                if (element.lin) {
                    sublist.setSublistValue({ id: 'custpage_lin', line: i, value: element.lin });
                }
                if (element.codigo) {
                    sublist.setSublistValue({ id: 'custpage_codigo', line: i, value: element.codigo });
                }
                if (element.producto) {
                    sublist.setSublistValue({ id: 'custpage_producto', line: i, value: element.producto });
                }
                if (element.horas) {
                    sublist.setSublistValue({ id: 'custpage_horas', line: i, value: element.horas });
                }
                if (element.fec_cierre) {
                    sublist.setSublistValue({ id: 'custpage_fec_cierre', line: i, value: element.fec_cierre });
                }
                if (element.anio) {
                    sublist.setSublistValue({ id: 'custpage_anio', line: i, value: element.anio });
                }
                if (element.mes) {
                    sublist.setSublistValue({ id: 'custpage_mes', line: i, value: element.mes });
                }
                if (element.estado) {
                    sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                }
                if (element.soles_x_hr) {
                    sublist.setSublistValue({ id: 'custpage_soles_x_hr', line: i, value: element.soles_x_hr });
                }
                if (element.total_soles) {
                    sublist.setSublistValue({ id: 'custpage_total_soles', line: i, value: element.total_soles });
                }
            });

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist.lineCount;
                sublist.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistSRV(form, data, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL SRV
            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_srv',
                type: sublistType,
                label: 'Costo Real SRV',
                container: 'tab_srv'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_nro_ord', type: serverWidget.FieldType.TEXT, label: 'nro_ord' });
            sublist.addField({ id: 'custpage_lote', type: serverWidget.FieldType.TEXT, label: 'lote' });
            sublist.addField({ id: 'custpage_fec_ord', type: serverWidget.FieldType.TEXT, label: 'fec_ord' });
            sublist.addField({ id: 'custpage_cant_teor', type: serverWidget.FieldType.TEXT, label: 'cant_teor' });
            sublist.addField({ id: 'custpage_cant_real', type: serverWidget.FieldType.TEXT, label: 'cant_real' });
            sublist.addField({ id: 'custpage_categoria', type: serverWidget.FieldType.TEXT, label: 'categoria' });
            sublist.addField({ id: 'custpage_factura', type: serverWidget.FieldType.TEXT, label: 'factura' });
            sublist.addField({ id: 'custpage_proveedor_servicio', type: serverWidget.FieldType.TEXT, label: 'proveedor_servicio' });
            sublist.addField({ id: 'custpage_lin', type: serverWidget.FieldType.TEXT, label: 'lin' });
            sublist.addField({ id: 'custpage_codigo', type: serverWidget.FieldType.TEXT, label: 'codigo' });
            sublist.addField({ id: 'custpage_producto', type: serverWidget.FieldType.TEXT, label: 'producto' });
            sublist.addField({ id: 'custpage_horas', type: serverWidget.FieldType.TEXT, label: 'horas' });
            sublist.addField({ id: 'custpage_fec_cierre', type: serverWidget.FieldType.TEXT, label: 'fec_cierre' });
            sublist.addField({ id: 'custpage_anio', type: serverWidget.FieldType.TEXT, label: 'anio' });
            sublist.addField({ id: 'custpage_mes', type: serverWidget.FieldType.TEXT, label: 'mes' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'estado' });
            sublist.addField({ id: 'custpage_soles_x_hr', type: serverWidget.FieldType.TEXT, label: 'S/. X Hr.' });
            sublist.addField({ id: 'custpage_total_soles', type: serverWidget.FieldType.TEXT, label: 'C. TOTAL. S/.' });

            // Setear los datos obtenidos a sublista
            data.forEach((element, i) => {
                if (element.nro_ord) {
                    sublist.setSublistValue({ id: 'custpage_nro_ord', line: i, value: element.nro_ord });
                }
                if (element.lote) {
                    sublist.setSublistValue({ id: 'custpage_lote', line: i, value: element.lote });
                }
                if (element.fec_ord) {
                    sublist.setSublistValue({ id: 'custpage_fec_ord', line: i, value: element.fec_ord });
                }
                if (element.cant_teor) {
                    sublist.setSublistValue({ id: 'custpage_cant_teor', line: i, value: element.cant_teor });
                }
                if (element.cant_real) {
                    sublist.setSublistValue({ id: 'custpage_cant_real', line: i, value: element.cant_real });
                }
                if (element.categoria) {
                    sublist.setSublistValue({ id: 'custpage_categoria', line: i, value: element.categoria });
                }
                if (element.servicios) {
                    sublist.setSublistValue({ id: 'custpage_factura', line: i, value: element.servicios });
                }
                if (element.empleado_proveedor_servicio) {
                    sublist.setSublistValue({ id: 'custpage_proveedor_servicio', line: i, value: element.empleado_proveedor_servicio });
                }
                if (element.lin) {
                    sublist.setSublistValue({ id: 'custpage_lin', line: i, value: element.lin });
                }
                if (element.codigo) {
                    sublist.setSublistValue({ id: 'custpage_codigo', line: i, value: element.codigo });
                }
                if (element.producto) {
                    sublist.setSublistValue({ id: 'custpage_producto', line: i, value: element.producto });
                }
                if (element.horas) {
                    sublist.setSublistValue({ id: 'custpage_horas', line: i, value: element.horas });
                }
                if (element.fec_cierre) {
                    sublist.setSublistValue({ id: 'custpage_fec_cierre', line: i, value: element.fec_cierre });
                }
                if (element.anio) {
                    sublist.setSublistValue({ id: 'custpage_anio', line: i, value: element.anio });
                }
                if (element.mes) {
                    sublist.setSublistValue({ id: 'custpage_mes', line: i, value: element.mes });
                }
                if (element.estado) {
                    sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                }
                if (element.soles_x_hr) {
                    sublist.setSublistValue({ id: 'custpage_soles_x_hr', line: i, value: element.soles_x_hr });
                }
                if (element.total_soles) {
                    sublist.setSublistValue({ id: 'custpage_total_soles', line: i, value: element.total_soles });
                }
            });

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist.lineCount;
                sublist.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createSublistCIF(form, data, checkPaginate, fDecimal, sublistType) {
            // COSTO REAL CIF
            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_costo_real_cif',
                type: sublistType,
                label: 'Costo Real CIF',
                container: 'tab_cif'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_nro_ord', type: serverWidget.FieldType.TEXT, label: 'nro_ord' });
            sublist.addField({ id: 'custpage_lote', type: serverWidget.FieldType.TEXT, label: 'lote' });
            sublist.addField({ id: 'custpage_fec_ord', type: serverWidget.FieldType.TEXT, label: 'fec_ord' });
            sublist.addField({ id: 'custpage_cant_teor', type: serverWidget.FieldType.TEXT, label: 'cant_teor' });
            sublist.addField({ id: 'custpage_cant_real', type: serverWidget.FieldType.TEXT, label: 'cant_real' });
            sublist.addField({ id: 'custpage_categoria', type: serverWidget.FieldType.TEXT, label: 'categoria' });
            sublist.addField({ id: 'custpage_empleado', type: serverWidget.FieldType.TEXT, label: 'empleado' });
            sublist.addField({ id: 'custpage_lin', type: serverWidget.FieldType.TEXT, label: 'lin' });
            sublist.addField({ id: 'custpage_codigo', type: serverWidget.FieldType.TEXT, label: 'codigo' });
            sublist.addField({ id: 'custpage_producto', type: serverWidget.FieldType.TEXT, label: 'producto' });
            sublist.addField({ id: 'custpage_horas', type: serverWidget.FieldType.TEXT, label: 'horas' });
            sublist.addField({ id: 'custpage_fec_cierre', type: serverWidget.FieldType.TEXT, label: 'fec_cierre' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'estado' });
            sublist.addField({ id: 'custpage_iny_2211', type: serverWidget.FieldType.TEXT, label: 'iny_2211' });
            sublist.addField({ id: 'custpage_sem_2221', type: serverWidget.FieldType.TEXT, label: 'sem_2221' });
            sublist.addField({ id: 'custpage_liq_2231', type: serverWidget.FieldType.TEXT, label: 'liq_2231' });
            sublist.addField({ id: 'custpage_sot_2241', type: serverWidget.FieldType.TEXT, label: 'sot_2241' });
            sublist.addField({ id: 'custpage_sol_2251', type: serverWidget.FieldType.TEXT, label: 'sol_2251' });
            sublist.addField({ id: 'custpage_pol_2261', type: serverWidget.FieldType.TEXT, label: 'pol_2261' });
            sublist.addField({ id: 'custpage_aco_2271', type: serverWidget.FieldType.TEXT, label: 'aco_2271' });
            sublist.addField({ id: 'custpage_tot_gen', type: serverWidget.FieldType.TEXT, label: 'tot_gen' });

            // Setear los datos obtenidos a sublista
            data.forEach((element, i) => {
                if (element.nro_ord) {
                    sublist.setSublistValue({ id: 'custpage_nro_ord', line: i, value: element.nro_ord });
                }
                if (element.lote) {
                    sublist.setSublistValue({ id: 'custpage_lote', line: i, value: element.lote });
                }
                if (element.fec_ord) {
                    sublist.setSublistValue({ id: 'custpage_fec_ord', line: i, value: element.fec_ord });
                }
                if (element.cant_teor) {
                    sublist.setSublistValue({ id: 'custpage_cant_teor', line: i, value: element.cant_teor });
                }
                if (element.cant_real) {
                    sublist.setSublistValue({ id: 'custpage_cant_real', line: i, value: element.cant_real });
                }
                if (element.categoria) {
                    sublist.setSublistValue({ id: 'custpage_categoria', line: i, value: element.categoria });
                }
                if (element.empleado_proveedor_servicio) {
                    sublist.setSublistValue({ id: 'custpage_empleado', line: i, value: element.empleado_proveedor_servicio });
                }
                if (element.lin) {
                    sublist.setSublistValue({ id: 'custpage_lin', line: i, value: element.lin });
                }
                if (element.codigo) {
                    sublist.setSublistValue({ id: 'custpage_codigo', line: i, value: element.codigo });
                }
                if (element.producto) {
                    sublist.setSublistValue({ id: 'custpage_producto', line: i, value: element.producto });
                }
                if (element.horas) {
                    sublist.setSublistValue({ id: 'custpage_horas', line: i, value: element.horas });
                }
                if (element.fec_cierre) {
                    sublist.setSublistValue({ id: 'custpage_fec_cierre', line: i, value: element.fec_cierre });
                }
                if (element.estado) {
                    sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                }
                if (element.total_iny || objHelper.isNumeric(element.total_iny)) {
                    sublist.setSublistValue({ id: 'custpage_iny_2211', line: i, value: element.total_iny });
                }
                if (element.total_sem || objHelper.isNumeric(element.total_sem)) {
                    sublist.setSublistValue({ id: 'custpage_sem_2221', line: i, value: element.total_sem });
                }
                if (element.total_liq || objHelper.isNumeric(element.total_liq)) {
                    sublist.setSublistValue({ id: 'custpage_liq_2231', line: i, value: element.total_liq });
                }
                if (element.total_sot || objHelper.isNumeric(element.total_sot)) {
                    sublist.setSublistValue({ id: 'custpage_sot_2241', line: i, value: element.total_sot });
                }
                if (element.total_sol || objHelper.isNumeric(element.total_sol)) {
                    sublist.setSublistValue({ id: 'custpage_sol_2251', line: i, value: element.total_sol });
                }
                if (element.total_pol || objHelper.isNumeric(element.total_pol)) {
                    sublist.setSublistValue({ id: 'custpage_pol_2261', line: i, value: element.total_pol });
                }
                if (element.total_aco || objHelper.isNumeric(element.total_aco)) {
                    sublist.setSublistValue({ id: 'custpage_aco_2271', line: i, value: element.total_aco });
                }
                if (element.total_gen || objHelper.isNumeric(element.total_gen)) {
                    sublist.setSublistValue({ id: 'custpage_tot_gen', line: i, value: element.total_gen });
                }
            });

            // Setear cantidad de registros
            if (checkPaginate == 'F') {
                var numLines = sublist.lineCount;
                sublist.helpText = `Cantidad de registros: ${numLines}`;
            }
        }

        function createCSV_MD(data, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'costoRealMD';
            let titleDocument = 'Reporte Costo Real Estructurado';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            current.push('NRO_ORD');
            current.push('LOTE');
            current.push('FEC_ORD');
            current.push('CANT_TEOR');
            current.push('CANT_REAL');
            current.push('REND');
            current.push('CODIGO');
            current.push('PRODUCTO');
            current.push('LIN');
            current.push('COD_MAT');
            current.push('DES_MAT');
            current.push('CANTIDAD');
            current.push('COSTO');
            current.push('FEC_CIERRE');
            current.push('ESTADO');
            current.push('FEC_DOC');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            data.forEach((element, i) => {
                let current = [];
                current.push(element.nro_ord);
                current.push(element.lote);
                current.push(element.fec_ord);
                current.push(element.cant_teor);
                current.push(element.cant_real);
                current.push(element.rend);
                current.push(element.codigo);
                current.push(element.producto);
                current.push(element.lin_mat);
                current.push(element.cod_mat);
                current.push(element.des_mat);
                current.push(element.cantidad);
                current.push(element.costo);
                current.push(element.fec_cierre);
                current.push(element.estado);
                current.push(element.fec_doc);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let csvFileMD = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFileMD, titleDocument }
        }

        function createCSV_MOD(data, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'costoRealMOD';
            let titleDocument = 'Reporte Costo Real Estructurado';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            current.push('NRO_ORD');
            current.push('LOTE');
            current.push('FEC_ORD');
            current.push('CANT_TEOR');
            current.push('CANT_REAL');
            current.push('REND');
            current.push('CATEGORIA');
            current.push('EMPLEADO');
            current.push('LIN');
            current.push('CODIGO');
            current.push('PRODUCTO');
            current.push('HORAS');
            current.push('FEC_CIERRE');
            current.push('ANIO');
            current.push('MES');
            current.push('ESTADO');
            current.push('S_X_HR');
            current.push('C_TOTAL_S');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            data.forEach((element, i) => {
                let current = [];
                current.push(element.nro_ord);
                current.push(element.lote);
                current.push(element.fec_ord);
                current.push(element.cant_teor);
                current.push(element.cant_real);
                current.push(element.rend);
                current.push(element.categoria);
                current.push(element.empleado_proveedor_servicio);
                current.push(element.lin);
                current.push(element.codigo);
                current.push(element.producto);
                current.push(element.horas);
                current.push(element.fec_cierre);
                current.push(element.anio);
                current.push(element.mes);
                current.push(element.estado);
                current.push(element.soles_x_hr);
                current.push(element.total_soles);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let csvFileMOD = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFileMOD, titleDocument }
        }

        function createCSV_SRV(data, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'costoRealSRV';
            let titleDocument = 'Reporte Costo Real Estructurado';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            current.push('NRO_ORD');
            current.push('LOTE');
            current.push('FEC_ORD');
            current.push('CANT_TEOR');
            current.push('CANT_REAL');
            current.push('CATEGORIA');
            current.push('FACTURA');
            current.push('PROVEEDOR_SERVICIO');
            current.push('LIN');
            current.push('CODIGO');
            current.push('PRODUCTO');
            current.push('HORAS');
            current.push('FEC_CIERRE');
            current.push('ANIO');
            current.push('MES');
            current.push('ESTADO');
            current.push('S_X_HR');
            current.push('C_TOTAL_S');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            data.forEach((element, i) => {
                let current = [];
                current.push(element.nro_ord);
                current.push(element.lote);
                current.push(element.fec_ord);
                current.push(element.cant_teor);
                current.push(element.cant_real);
                current.push(element.categoria);
                current.push(element.servicios);
                current.push(element.empleado_proveedor_servicio);
                current.push(element.lin);
                current.push(element.codigo);
                current.push(element.producto);
                current.push(element.horas);
                current.push(element.fec_cierre);
                current.push(element.anio);
                current.push(element.mes);
                current.push(element.estado);
                current.push(element.soles_x_hr);
                current.push(element.total_soles);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let csvFileSRV = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFileSRV, titleDocument }
        }

        function createCSV_CIF(data, dateFrom, dateTo, year, month) {
            // Nombre del archivo
            let typeRep = 'costoRealCIF';
            let titleDocument = 'Reporte Costo Real Estructurado';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            current.push('NRO_ORD');
            current.push('LOTE');
            current.push('FEC_ORD');
            current.push('CANT_TEOR');
            current.push('CANT_REAL');
            current.push('CATEGORIA');
            current.push('EMPLEADO');
            current.push('LIN');
            current.push('CODIGO');
            current.push('PRODUCTO');
            current.push('HORAS');
            current.push('FEC_CIERRE');
            current.push('ESTADO');
            current.push('INY_2211');
            current.push('SEM_2221');
            current.push('LIQ_2231');
            current.push('SOT_2241');
            current.push('SOL_2251');
            current.push('POL_2261');
            current.push('ACO_2271');
            current.push('TOT_GEN');

            // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
            // current.push('');
            // current.push('total_cc_iny');
            // current.push('total_cc_sem');
            // current.push('total_cc_liq');
            // current.push('total_cc_sot');
            // current.push('total_cc_sol');
            // current.push('total_cc_pol');
            // current.push('total_cc_aco');

            // TOTAL DE HORAS DE CIF POR LINEA
            // current.push('');
            // current.push('total_hr_iny');
            // current.push('total_hr_sem');
            // current.push('total_hr_liq');
            // current.push('total_hr_sot');
            // current.push('total_hr_sol');
            // current.push('total_hr_pol');
            // current.push('total_hr_aco');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            data.forEach((element, i) => {
                let current = [];
                current.push(element.nro_ord);
                current.push(element.lote);
                current.push(element.fec_ord);
                current.push(element.cant_teor);
                current.push(element.cant_real);
                current.push(element.categoria);
                current.push(element.empleado_proveedor_servicio);
                current.push(element.lin);
                current.push(element.codigo);
                current.push(element.producto);
                current.push(element.horas);
                current.push(element.fec_cierre);
                current.push(element.estado);
                current.push(element.total_iny);
                current.push(element.total_sem);
                current.push(element.total_liq);
                current.push(element.total_sot);
                current.push(element.total_sol);
                current.push(element.total_pol);
                current.push(element.total_aco);
                current.push(element.total_gen);

                // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
                // current.push('');
                // current.push(element.total_cc_iny);
                // current.push(element.total_cc_sem);
                // current.push(element.total_cc_liq);
                // current.push(element.total_cc_sot);
                // current.push(element.total_cc_sol);
                // current.push(element.total_cc_pol);
                // current.push(element.total_cc_aco);

                // TOTAL DE HORAS DE CIF POR LINEA
                // current.push('');
                // current.push(element.total_hr_iny);
                // current.push(element.total_hr_sem);
                // current.push(element.total_hr_liq);
                // current.push(element.total_hr_sot);
                // current.push(element.total_hr_sol);
                // current.push(element.total_hr_pol);
                // current.push(element.total_hr_aco);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            let csvFileCIF = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}_CIF${year}${meses[month]}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFileCIF, titleDocument }
        }

        function createCSV_FactorCIF(data, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'factorCIF';
            let titleDocument = 'Reporte Costo Real Estructurado';

            // Crear CSV
            let csvData = [];

            // Setear cabecera de csv
            let current = [];
            current.push('');
            current.push('INY_2211');
            current.push('SEM_2221');
            current.push('LIQ_2231');
            current.push('SOT_2241');
            current.push('SOL_2251');
            current.push('POL_2261');
            current.push('ACO_2271');

            current = current.join(';');
            csvData.push(current);

            // Setear contenido de csv
            data.forEach((element, i) => {
                let current = [];
                current.push(element.label);
                current.push(element.total_iny);
                current.push(element.total_sem);
                current.push(element.total_liq);
                current.push(element.total_sot);
                current.push(element.total_sol);
                current.push(element.total_pol);
                current.push(element.total_aco);

                current = current.join(';');
                csvData.push(current);
            });
            csvData = csvData.join("\r\n");

            let csvFileFactorCIF = file.create({
                name: `biomont_${typeRep}_${dateFrom}_${dateTo}.csv`,
                fileType: file.Type.CSV,
                contents: csvData,
                encoding: file.Encoding.UTF_8,
            });

            return { csvFileFactorCIF, titleDocument }
        }

        return {
            createSublistMD,
            createSublistMOD,
            createSublistSRV,
            createSublistCIF,
            createCSV_MD,
            createCSV_MOD,
            createCSV_SRV,
            createCSV_CIF,
            createCSV_FactorCIF
        }

    });
