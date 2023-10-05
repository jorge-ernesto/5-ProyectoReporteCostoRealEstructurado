/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        function getDataMD(dataReporte) {

            // Declarar variables
            let data = [];

            dataReporte.forEach((value_rep, key_rep) => {

                let registros_relacionados = value_rep.registros_relacionados || [];
                registros_relacionados.forEach((value_regrel, key_regrel) => {

                    let impacto_en_lm = value_regrel.impacto_en_lm || [];
                    impacto_en_lm.forEach((value_lm, key_lm) => {

                        // Validar
                        if (!(value_lm.linea == '6' || value_lm.linea_nombre == 'BULK Y PRODUCTOS INTERMEDIOS')) {
                            // Obtener informacion
                            // Orden de Trabajo
                            let nro_ord = value_rep.orden_trabajo;
                            let lote = value_rep.lote;
                            let fec_ord = value_rep.fec;
                            let cant_teor = value_rep.cantidad_teorica;
                            let cant_real = value_rep.cantidad_construido;
                            let rend = (value_rep.cantidad_construido * 100) / value_rep.cantidad_teorica;
                            let codigo = value_rep.codigo_oracle;
                            let producto = value_rep.descripcion;
                            // Registros Relacionados (Emisiones de Ordenes de Produccion)
                            let lin_mat = value_lm.linea_nombre;
                            let cod_mat = value_lm.codigo_nombre;
                            let des_mat = value_lm.descripcion;
                            let cantidad = value_lm.cantidad;
                            let costo = value_lm.importe_debito;
                            let fec_cierre = value_regrel.related_record_date;
                            let estado = value_rep.estado;
                            let fec_doc = value_regrel.related_record_date;

                            // Procesar reporte
                            rend = `${Math.round10(rend, -2).toFixed(2)}%`;

                            // Unidades de medida - Conversion para PESO
                            // Ruta: Listas -> Contabilidad -> Unidades de medida
                            if (value_lm.unidades_abreviacion == 'GR') {
                                cantidad = cantidad * 1000;
                            }

                            // Insertar informacion en array
                            data.push({
                                // Orden de Trabajo
                                nro_ord: nro_ord,
                                lote: lote,
                                fec_ord: fec_ord,
                                cant_teor: cant_teor,
                                cant_real: cant_real,
                                rend: rend,
                                codigo: codigo,
                                producto: producto,
                                // Registros Relacionados (Emisiones de Ordenes de Produccion)
                                lin_mat: lin_mat,
                                cod_mat: cod_mat,
                                des_mat: des_mat,
                                cantidad: cantidad,
                                costo: costo,
                                fec_cierre: fec_cierre,
                                estado: estado,
                                fec_doc: fec_doc,
                            });
                        }
                    });
                });
            });

            // Retornar informacion
            return data;
        }

        function getDataMOD_SRV(dataReporte, type, parameters = {}) {

            let fDecimal = 6;

            // Declarar variables
            let data = [];
            let data_mod = [];
            let data_srv = [];
            let data_mod_srv = [];

            dataReporte.forEach((value_rep, key_rep) => {

                let datos_de_produccion = value_rep.datos_de_produccion || [];
                datos_de_produccion.forEach((value_prod, key_prod) => {

                    // Obtener informacion
                    // Orden de Trabajo
                    let nro_ord = value_rep.orden_trabajo;
                    let lote = value_rep.lote;
                    let fec_ord = value_rep.fec;
                    let cant_teor = value_rep.cantidad_teorica;
                    let cant_real = value_rep.cantidad_construido;
                    let rend = (value_rep.cantidad_construido * 100) / value_rep.cantidad_teorica;
                    let categoria = value_prod.nombre_operacion_descripcion;
                    let servicios = value_prod.servicios;
                    let empleado_proveedor_servicio = value_prod.empleado_nombre;
                    let lin_id = value_rep.linea_ot_envasado_empacado;
                    let lin = value_rep.linea_nombre_ot_envasado_empacado;
                    let codigo = value_rep.codigo_oracle;
                    let producto = value_rep.descripcion;
                    // Datos de Produccion
                    let horas = value_prod.duracion_horas;
                    let fec_cierre = value_prod.fecha;
                    let anio = fec_cierre.split('/')[2];
                    let mes = fec_cierre.split('/')[1];
                    let estado = value_rep.estado;
                    let soles_x_hr = value_prod.costo_hora;
                    let total_soles = value_prod.costo_total;
                    // Datos CIF
                    let total_iny = value_prod.total_iny;
                    let total_sem = value_prod.total_sem;
                    let total_liq = value_prod.total_liq;
                    let total_sot = value_prod.total_sot;
                    let total_sol = value_prod.total_sol;
                    let total_pol = value_prod.total_pol;
                    let total_aco = value_prod.total_aco;
                    let total_gen = value_prod.total_gen;

                    // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
                    // let total_cc_iny = value_rep.total_cc_iny;
                    // let total_cc_sem = value_rep.total_cc_sem;
                    // let total_cc_liq = value_rep.total_cc_liq;
                    // let total_cc_sot = value_rep.total_cc_sot;
                    // let total_cc_sol = value_rep.total_cc_sol;
                    // let total_cc_pol = value_rep.total_cc_pol;
                    // let total_cc_aco = value_rep.total_cc_aco;

                    // TOTAL DE HORAS DE CIF POR LINEA
                    // let total_hr_iny = value_rep.total_hr_iny;
                    // let total_hr_sem = value_rep.total_hr_sem;
                    // let total_hr_liq = value_rep.total_hr_liq;
                    // let total_hr_sot = value_rep.total_hr_sot;
                    // let total_hr_sol = value_rep.total_hr_sol;
                    // let total_hr_pol = value_rep.total_hr_pol;
                    // let total_hr_aco = value_rep.total_hr_aco;

                    // Procesar reporte
                    rend = isNaN(rend) ? '' : `${Math.round10(rend, -2).toFixed(2)}%`;
                    total_iny = isNaN(total_iny) ? '' : Math.round10(total_iny, -fDecimal).toFixed(fDecimal);
                    total_sem = isNaN(total_sem) ? '' : Math.round10(total_sem, -fDecimal).toFixed(fDecimal);
                    total_liq = isNaN(total_liq) ? '' : Math.round10(total_liq, -fDecimal).toFixed(fDecimal);
                    total_sot = isNaN(total_sot) ? '' : Math.round10(total_sot, -fDecimal).toFixed(fDecimal);
                    total_sol = isNaN(total_sol) ? '' : Math.round10(total_sol, -fDecimal).toFixed(fDecimal);
                    total_pol = isNaN(total_pol) ? '' : Math.round10(total_pol, -fDecimal).toFixed(fDecimal);
                    total_aco = isNaN(total_aco) ? '' : Math.round10(total_aco, -fDecimal).toFixed(fDecimal);
                    total_gen = isNaN(total_gen) ? '' : Math.round10(total_gen, -fDecimal).toFixed(fDecimal);

                    let json = {
                        // Orden de Trabajo
                        nro_ord: nro_ord,
                        lote: lote,
                        fec_ord: fec_ord,
                        cant_teor: cant_teor,
                        cant_real: cant_real,
                        rend: rend,
                        categoria: categoria,
                        servicios: servicios,
                        empleado_proveedor_servicio: empleado_proveedor_servicio,
                        lin_id: lin_id,
                        lin: lin,
                        codigo: codigo,
                        producto: producto,
                        // Datos de Produccion
                        horas: horas,
                        fec_cierre: fec_cierre,
                        anio: anio,
                        mes: mes,
                        estado: estado,
                        soles_x_hr: soles_x_hr,
                        total_soles: total_soles,
                        // Datos CIF
                        total_iny: total_iny,
                        total_sem: total_sem,
                        total_liq: total_liq,
                        total_sot: total_sot,
                        total_sol: total_sol,
                        total_pol: total_pol,
                        total_aco: total_aco,
                        total_gen: total_gen,

                        // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
                        // total_cc_iny: total_cc_iny,
                        // total_cc_sem: total_cc_sem,
                        // total_cc_liq: total_cc_liq,
                        // total_cc_sot: total_cc_sot,
                        // total_cc_sol: total_cc_sol,
                        // total_cc_pol: total_cc_pol,
                        // total_cc_aco: total_cc_aco,

                        // TOTAL DE HORAS DE CIF POR LINEA
                        // total_hr_iny: total_hr_iny,
                        // total_hr_sem: total_hr_sem,
                        // total_hr_liq: total_hr_liq,
                        // total_hr_sot: total_hr_sot,
                        // total_hr_sol: total_hr_sol,
                        // total_hr_pol: total_hr_pol,
                        // total_hr_aco: total_hr_aco,
                    }

                    if (!(value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO')) {
                        // Insertar informacion en array
                        data_mod.push(json);
                    }
                    if (value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO') {
                        // Insertar informacion en array
                        data_srv.push(json);
                    }

                    // Validar parametros para filtrar datos - para obtener data CIF por año y mes
                    if (Object.keys(parameters).length > 0) {

                        // Filtrar por Fecha de Cierre y Estado
                        // En JavaScript, los meses se representan con valores enteros del 0 al 11, donde 0 es enero y 11 es diciembre.
                        if (Number(json.anio) == Number(parameters.anio) && Number(json.mes) == Number(parameters.mes) + 1 && ['Cerrada', 'Closed', 'En curso', 'In Process', 'Liberada', 'Released'].includes(json.estado)) {

                            // Filtrar por Linea
                            if (['1', '9', '3', '10', '11', '2'].includes(lin_id) || ['INYECTABLES', 'SEMISOLIDOS', 'LIQUIDOS', 'SOLUCIONES TOPICAS', 'SOLIDOS', 'POLVOS'].includes(lin)) {

                                // Insertar informacion en array
                                data_mod_srv.push(json);
                            }
                        }
                    }
                });
            });

            // Retornar informacion
            if (type == 'mod') {
                data = data_mod;
            } else if (type == 'srv') {
                data = data_srv;
            } else if (type == 'mod_srv') {
                data = data_mod_srv;
            }

            // Agregar totales CIF
            if (Object.keys(data).length > 0) { // Validar data CIF
                if (Object.keys(parameters).length > 0) { // Validar parametros
                    if (parameters.dataFactorCIF) { // Validar factor CIF - por año y mes
                        let dataFactorCIF = parameters.dataFactorCIF;
                        data = addTotalesCIF(data, dataFactorCIF);
                    }
                }
            }

            return data;
        }

        function addTotalesCIF(data, dataFactorCIF) {

            let json = {};

            // LINEA VACIA
            json = {};
            data.push(json);

            // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
            json = {
                estado: 'TOTAL CC',
                total_iny: dataFactorCIF.total_cc_iny,
                total_sem: dataFactorCIF.total_cc_sem,
                total_liq: dataFactorCIF.total_cc_liq,
                total_sot: dataFactorCIF.total_cc_sot,
                total_sol: dataFactorCIF.total_cc_sol,
                total_pol: dataFactorCIF.total_cc_pol,
                total_aco: dataFactorCIF.total_cc_aco,
            }
            data.push(json);

            // TOTAL DE HORAS DE CIF POR LINEA
            json = {
                estado: 'TOTAL HRS LIN',
                total_iny: dataFactorCIF.total_hr_iny,
                total_sem: dataFactorCIF.total_hr_sem,
                total_liq: dataFactorCIF.total_hr_liq,
                total_sot: dataFactorCIF.total_hr_sot,
                total_sol: dataFactorCIF.total_hr_sol,
                total_pol: dataFactorCIF.total_hr_pol,
                total_aco: dataFactorCIF.total_hr_aco,
            }
            data.push(json);

            // FACTOR CIF POR LINEA / CENTRO DE COSTO
            json = {
                estado: 'FACTOR',
                total_iny: dataFactorCIF.factor_cif_iny,
                total_sem: dataFactorCIF.factor_cif_sem,
                total_liq: dataFactorCIF.factor_cif_liq,
                total_sot: dataFactorCIF.factor_cif_sot,
                total_sol: dataFactorCIF.factor_cif_sol,
                total_pol: dataFactorCIF.factor_cif_pol,
                total_aco: dataFactorCIF.factor_cif_aco,
            }
            data.push(json);

            return data;
        }

        function getDataFactorCIF(dataFactorCIF) {

            let data = [];
            let json = {};
            let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            // LINEAS POR MESES
            for (var key in dataFactorCIF) {

                // console.log(dataFactorCIF[key]);
                let anio = key;
                let dataMonth = dataFactorCIF[key];

                for (var key in dataMonth) {

                    // console.log(dataMonth[key]);
                    let value = dataMonth[key];

                    // LINEA VACIA
                    json = {
                        label: '',
                        total_iny: '',
                        total_sem: '',
                        total_liq: '',
                        total_sot: '',
                        total_sol: '',
                        total_pol: '',
                        total_aco: '',
                    }
                    data.push(json);

                    // AÑO Y MES
                    json = {
                        label: `${anio} - ${meses[key]}`,
                        total_iny: '',
                        total_sem: '',
                        total_liq: '',
                        total_sot: '',
                        total_sol: '',
                        total_pol: '',
                        total_aco: '',
                    }
                    data.push(json);

                    // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
                    json = {
                        label: 'TOTAL CC',
                        total_iny: value.total_cc_iny,
                        total_sem: value.total_cc_sem,
                        total_liq: value.total_cc_liq,
                        total_sot: value.total_cc_sot,
                        total_sol: value.total_cc_sol,
                        total_pol: value.total_cc_pol,
                        total_aco: value.total_cc_aco,
                    }
                    data.push(json);

                    // TOTAL DE HORAS DE CIF POR LINEA
                    json = {
                        label: 'TOTAL HRS LIN',
                        total_iny: value.total_hr_iny,
                        total_sem: value.total_hr_sem,
                        total_liq: value.total_hr_liq,
                        total_sot: value.total_hr_sot,
                        total_sol: value.total_hr_sol,
                        total_pol: value.total_hr_pol,
                        total_aco: value.total_hr_aco,
                    }
                    data.push(json);

                    // FACTOR CIF POR LINEA / CENTRO DE COSTO
                    json = {
                        label: 'FACTOR',
                        total_iny: value.factor_cif_iny,
                        total_sem: value.factor_cif_sem,
                        total_liq: value.factor_cif_liq,
                        total_sot: value.factor_cif_sot,
                        total_sol: value.factor_cif_sol,
                        total_pol: value.factor_cif_pol,
                        total_aco: value.factor_cif_aco,
                    }
                    data.push(json);
                }
            }

            return data;
        }

        return { getDataMD, getDataMOD_SRV, getDataFactorCIF }

    });
