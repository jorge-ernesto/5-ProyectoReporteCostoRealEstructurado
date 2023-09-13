/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        function getDataOT(dataReporte, dataReporteGastos_Cuentas6168, parameters = {}) {

            // RECORRER ORDENES DE TRABAJO PARA AGREGAR -- LINEA DE ORDEN DE TRABAJO (TIPO DE ORDEN DE TRABAJO: ENVASADO Y EMPACADO)
            let dataReporte_ = dataReporte;
            dataReporte.forEach((value_rep, key_rep) => {
                if (value_rep.tipo_orden_trabajo == '1' || value_rep.tipo_orden_trabajo_nombre == 'FABRICACIÓN') {

                    dataReporte_.forEach((value_rep_, key_rep_) => {
                        if (value_rep.lote == value_rep_.lote && (value_rep_.tipo_orden_trabajo == '3' || value_rep_.tipo_orden_trabajo_nombre == 'ENVASADO Y EMPACADO')) {

                            dataReporte[key_rep]['linea_ot_envasado_empacado'] = value_rep_.linea;
                            dataReporte[key_rep]['linea_nombre_ot_envasado_empacado'] = value_rep_.linea_nombre;
                        }
                    });
                } else if (value_rep.tipo_orden_trabajo == '3' || value_rep.tipo_orden_trabajo_nombre == 'ENVASADO Y EMPACADO') {

                    dataReporte[key_rep]['linea_ot_envasado_empacado'] = value_rep.linea;
                    dataReporte[key_rep]['linea_nombre_ot_envasado_empacado'] = value_rep.linea_nombre;

                    // VALIDACION ADICIONAL POR EL CASO DE LA OT: 002285 CON LOTE: 083153
                    if (value_rep.linea == '6' || value_rep.linea_nombre == 'BULK Y PRODUCTOS INTERMEDIOS') {

                        dataReporte_.forEach((value_rep_, key_rep_) => {
                            if (value_rep.lote == value_rep_.lote && !(value_rep_.linea == '6' || value_rep_.linea_nombre == 'BULK Y PRODUCTOS INTERMEDIOS')) {

                                dataReporte[key_rep]['linea_ot_envasado_empacado'] = value_rep_.linea;
                                dataReporte[key_rep]['linea_nombre_ot_envasado_empacado'] = value_rep_.linea_nombre;
                            }
                        });
                    }
                }
            });

            /******************************************************/

            // RECORRER ORDENES DE TRABAJARO PARA OBTENER:
            let total_hr_iny = 0;
            let total_hr_sem = 0;
            let total_hr_liq = 0;
            let total_hr_sot = 0;
            let total_hr_sol = 0;
            let total_hr_pol = 0;
            let total_hr_aco = 0;

            dataReporte.forEach((value_rep, key_rep) => {

                let datos_de_produccion = value_rep.datos_de_produccion || [];
                datos_de_produccion.forEach((value_prod, key_prod) => {

                    // Obtener informacion
                    // Orden de Trabajo
                    let lin_id = value_rep.linea_ot_envasado_empacado;
                    let lin = value_rep.linea_nombre_ot_envasado_empacado;
                    // Datos de Produccion
                    let horas = value_prod.duracion_horas;
                    let fec_cierre = value_prod.fecha;
                    let anio = fec_cierre.split('/')[2];
                    let mes = fec_cierre.split('/')[1];
                    let estado = value_rep.estado;

                    // Filtrar datos para el CIF
                    if (Object.keys(parameters).length > 0) {

                        // Filtrar por Fecha de Cierre y Estado
                        // En JavaScript, los meses se representan con valores enteros del 0 al 11, donde 0 es enero y 11 es diciembre.
                        if (Number(anio) == Number(parameters.anio) && Number(mes) == Number(parameters.mes) + 1 && ['Cerrada', 'Closed', 'En curso', 'In Process'].includes(estado)) {

                            // Filtrar por Linea
                            if (['1', '9', '3', '10', '11', '2'].includes(lin_id) || ['INYECTABLES', 'SEMISOLIDOS', 'LIQUIDOS', 'SOLUCIONES TOPICAS', 'SOLIDOS', 'POLVOS'].includes(lin)) {

                                if (lin == 'INYECTABLES') {
                                    total_hr_iny += parseFloat(horas);
                                } else if (lin == 'SEMISOLIDOS') {
                                    total_hr_sem += parseFloat(horas);
                                } else if (lin == 'LIQUIDOS') {
                                    total_hr_liq += parseFloat(horas);
                                } else if (lin == 'SOLUCIONES TOPICAS') {
                                    total_hr_sot += parseFloat(horas);
                                } else if (lin == 'SOLIDOS') {
                                    total_hr_sol += parseFloat(horas);
                                } else if (lin == 'POLVOS') {
                                    total_hr_pol += parseFloat(horas);
                                }
                                total_hr_aco += parseFloat(horas);
                            }
                        }
                    }
                });
            });

            // TOTAL DE HORAS DE CIF POR LINEA
            dataReporte.forEach((value_rep, key_rep) => {

                dataReporte[key_rep]['total_hr_iny'] = 0;
                dataReporte[key_rep]['total_hr_sem'] = 0;
                dataReporte[key_rep]['total_hr_liq'] = 0;
                dataReporte[key_rep]['total_hr_sot'] = 0;
                dataReporte[key_rep]['total_hr_sol'] = 0;
                dataReporte[key_rep]['total_hr_pol'] = 0;
                dataReporte[key_rep]['total_hr_aco'] = 0;

                let lin_id = value_rep.linea_ot_envasado_empacado;
                let lin = value_rep.linea_nombre_ot_envasado_empacado;

                if (lin_id == '1' || lin == 'INYECTABLES') {

                    dataReporte[key_rep]['total_hr_iny'] = total_hr_iny;
                } else if (lin_id == '9' || lin == 'SEMISOLIDOS') {

                    dataReporte[key_rep]['total_hr_sem'] = total_hr_sem;
                } else if (lin_id == '3' || lin == 'LIQUIDOS') {

                    dataReporte[key_rep]['total_hr_liq'] = total_hr_liq;
                } else if (lin_id == '10' || lin == 'SOLUCIONES TOPICAS') {

                    dataReporte[key_rep]['total_hr_sot'] = total_hr_sot;
                } else if (lin_id == '11' || lin == 'SOLIDOS') {

                    dataReporte[key_rep]['total_hr_sol'] = total_hr_sol;
                } else if (lin_id == '2' || lin == 'POLVOS') {

                    dataReporte[key_rep]['total_hr_pol'] = total_hr_pol;
                }

                // ACONDICIONADO
                dataReporte[key_rep]['total_hr_aco'] = total_hr_aco;
            });

            /******************************************************/

            // RECORRER REPORTE DE GASTOS PARA OBTENER:
            let total_cc_iny = 0;
            let total_cc_sem = 0;
            let total_cc_liq = 0;
            let total_cc_sot = 0;
            let total_cc_sol = 0;
            let total_cc_pol = 0;
            let total_cc_aco = 0;

            dataReporteGastos_Cuentas6168.forEach((value_rep, key_rep) => {

                let cuenta_numero = value_rep.cuenta_numero;
                let importe_bruto = value_rep.importe_bruto;
                let centro_costo = value_rep.centro_costo;
                let centro_costo_nombre = value_rep.centro_costo_nombre;
                let centro_costo_array = ['8', '9', '10', '11', '12', '32', '13'];
                let centro_costo_nombre_array = ['PRODUCCIÓN : 2211 INYECTABLES', 'PRODUCCIÓN : 2221 SEMISOLIDOS', 'PRODUCCIÓN : 2231 LIQUIDOS', 'PRODUCCIÓN : 2241 SOLUCIONES TOPICAS', 'PRODUCCIÓN : 2251 SOLIDOS', 'PRODUCCIÓN : 2261 POLVOS', 'PRODUCCIÓN : 2271 ACONDICIONADO'];

                // Centros de costos: 2211, 2221, 2231, 2241, 2251, 2261, 2271
                if (centro_costo_array.includes(centro_costo) || centro_costo_nombre_array.includes(centro_costo_nombre)) {

                    // Eliminar todas las cuentas que comienzan con 62, excepto 62131113
                    if (cuenta_numero.substring(0, 2) != '62' || cuenta_numero == '62131113') {

                        // Eliminar toda la cuenta 63311115
                        if (cuenta_numero != '63311115') {

                            if (centro_costo == '8' || centro_costo_nombre == 'PRODUCCIÓN : 2211 INYECTABLES') {
                                total_cc_iny += parseFloat(importe_bruto);
                            } else if (centro_costo == '9' || centro_costo_nombre == 'PRODUCCIÓN : 2221 SEMISOLIDOS') {
                                total_cc_sem += parseFloat(importe_bruto);
                            } else if (centro_costo == '10' || centro_costo_nombre == 'PRODUCCIÓN : 2231 LIQUIDOS') {
                                total_cc_liq += parseFloat(importe_bruto);
                            } else if (centro_costo == '11' || centro_costo_nombre == 'PRODUCCIÓN : 2241 SOLUCIONES TOPICAS') {
                                total_cc_sot += parseFloat(importe_bruto);
                            } else if (centro_costo == '12' || centro_costo_nombre == 'PRODUCCIÓN : 2251 SOLIDOS') {
                                total_cc_sol += parseFloat(importe_bruto);
                            } else if (centro_costo == '32' || centro_costo_nombre == 'PRODUCCIÓN : 2261 POLVOS') {
                                total_cc_pol += parseFloat(importe_bruto);
                            } else if (centro_costo == '13' || centro_costo_nombre == 'PRODUCCIÓN : 2271 ACONDICIONADO') {
                                total_cc_aco += parseFloat(importe_bruto);
                            }
                        }
                    }
                }
            });

            // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
            // FACTOR CIF POR LINEA / CENTRO DE COSTO
            dataReporte.forEach((value_rep, key_rep) => {

                dataReporte[key_rep]['total_cc_iny'] = 0;
                dataReporte[key_rep]['total_cc_sem'] = 0;
                dataReporte[key_rep]['total_cc_liq'] = 0;
                dataReporte[key_rep]['total_cc_sot'] = 0;
                dataReporte[key_rep]['total_cc_sol'] = 0;
                dataReporte[key_rep]['total_cc_pol'] = 0;
                dataReporte[key_rep]['total_cc_aco'] = 0;

                dataReporte[key_rep]['factor_cif_iny'] = 0;
                dataReporte[key_rep]['factor_cif_sem'] = 0;
                dataReporte[key_rep]['factor_cif_liq'] = 0;
                dataReporte[key_rep]['factor_cif_sot'] = 0;
                dataReporte[key_rep]['factor_cif_sol'] = 0;
                dataReporte[key_rep]['factor_cif_pol'] = 0;
                dataReporte[key_rep]['factor_cif_aco'] = 0;

                let lin_id = value_rep.linea_ot_envasado_empacado;
                let lin = value_rep.linea_nombre_ot_envasado_empacado;

                if (lin_id == '1' || lin == 'INYECTABLES') {

                    dataReporte[key_rep]['total_cc_iny'] = total_cc_iny;
                    dataReporte[key_rep]['factor_cif_iny'] = value_rep.total_hr_iny == 0 ? 0 : total_cc_iny / value_rep.total_hr_iny;
                } else if (lin_id == '9' || lin == 'SEMISOLIDOS') {

                    dataReporte[key_rep]['total_cc_sem'] = total_cc_sem;
                    dataReporte[key_rep]['factor_cif_sem'] = value_rep.total_hr_sem == 0 ? 0 : total_cc_sem / value_rep.total_hr_sem;
                } else if (lin_id == '3' || lin == 'LIQUIDOS') {

                    dataReporte[key_rep]['total_cc_liq'] = total_cc_liq;
                    dataReporte[key_rep]['factor_cif_liq'] = value_rep.total_hr_liq == 0 ? 0 : total_cc_liq / value_rep.total_hr_liq;
                } else if (lin_id == '10' || lin == 'SOLUCIONES TOPICAS') {

                    dataReporte[key_rep]['total_cc_sot'] = total_cc_sot;
                    dataReporte[key_rep]['factor_cif_sot'] = value_rep.total_hr_sot == 0 ? 0 : total_cc_sot / value_rep.total_hr_sot;
                } else if (lin_id == '11' || lin == 'SOLIDOS') {

                    dataReporte[key_rep]['total_cc_sol'] = total_cc_sol;
                    dataReporte[key_rep]['factor_cif_sol'] = value_rep.total_hr_sol == 0 ? 0 : total_cc_sol / value_rep.total_hr_sol;
                } else if (lin_id == '2' || lin == 'POLVOS') {

                    dataReporte[key_rep]['total_cc_pol'] = total_cc_pol;
                    dataReporte[key_rep]['factor_cif_pol'] = value_rep.total_hr_pol == 0 ? 0 : total_cc_pol / value_rep.total_hr_pol;
                }

                // ACONDICIONADO
                dataReporte[key_rep]['total_cc_aco'] = total_cc_aco;
                dataReporte[key_rep]['factor_cif_aco'] = value_rep.total_hr_aco == 0 ? 0 : total_cc_aco / value_rep.total_hr_aco;
            });

            return dataReporte;
        }

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
                    let total_iny = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_iny);
                    let total_sem = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_sem);
                    let total_liq = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_liq);
                    let total_sot = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_sot);
                    let total_sol = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_sol);
                    let total_pol = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_pol);
                    let total_aco = parseFloat(value_prod.duracion_horas) * parseFloat(value_rep.factor_cif_aco);
                    let total_gen = total_iny + total_sem + total_liq + total_sot + total_sol + total_pol + total_aco;
                    // TOTAL DE IMPORTE BRUTO POR CENTRO DE COSTO
                    let total_cc_iny = value_rep.total_cc_iny;
                    let total_cc_sem = value_rep.total_cc_sem;
                    let total_cc_liq = value_rep.total_cc_liq;
                    let total_cc_sot = value_rep.total_cc_sot;
                    let total_cc_sol = value_rep.total_cc_sol;
                    let total_cc_pol = value_rep.total_cc_pol;
                    let total_cc_aco = value_rep.total_cc_aco;
                    // TOTAL DE HORAS DE CIF POR LINEA
                    let total_hr_iny = value_rep.total_hr_iny;
                    let total_hr_sem = value_rep.total_hr_sem;
                    let total_hr_liq = value_rep.total_hr_liq;
                    let total_hr_sot = value_rep.total_hr_sot;
                    let total_hr_sol = value_rep.total_hr_sol;
                    let total_hr_pol = value_rep.total_hr_pol;
                    let total_hr_aco = value_rep.total_hr_aco;

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
                        total_cc_iny: total_cc_iny,
                        total_cc_sem: total_cc_sem,
                        total_cc_liq: total_cc_liq,
                        total_cc_sot: total_cc_sot,
                        total_cc_sol: total_cc_sol,
                        total_cc_pol: total_cc_pol,
                        total_cc_aco: total_cc_aco,
                        // TOTAL DE HORAS DE CIF POR LINEA
                        total_hr_iny: total_hr_iny,
                        total_hr_sem: total_hr_sem,
                        total_hr_liq: total_hr_liq,
                        total_hr_sot: total_hr_sot,
                        total_hr_sol: total_hr_sol,
                        total_hr_pol: total_hr_pol,
                        total_hr_aco: total_hr_aco,
                    }

                    if (!(value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO')) {
                        // Insertar informacion en array
                        data_mod.push(json);
                    }
                    if (value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO') {
                        // Insertar informacion en array
                        data_srv.push(json);
                    }

                    // Filtrar datos para el CIF
                    if (Object.keys(parameters).length > 0) {

                        // Filtrar por Fecha de Cierre y Estado
                        // En JavaScript, los meses se representan con valores enteros del 0 al 11, donde 0 es enero y 11 es diciembre.
                        if (Number(json.anio) == Number(parameters.anio) && Number(json.mes) == Number(parameters.mes) + 1 && ['Cerrada', 'Closed', 'En curso', 'In Process'].includes(json.estado)) {

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
                return data_mod;
            } else if (type == 'srv') {
                return data_srv;
            } else if (type == 'mod_srv') {
                return data_mod_srv;
            }
        }

        return { getDataOT, getDataMD, getDataMOD_SRV }

    });
