/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        function getDataOT(dataReporte) {
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
                }
            });
            return dataReporte;
        }

        function getDataMD(dataReporte) {
            let fDecimal = 6;

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
                            let lin_mat = value_lm.linea_nombre; // let lin_mat = value_lm.codigo_nombre.substring(0, 2);
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

        function getDataMOD_SRV(dataReporte, type) {
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
                    let lin = value_rep.linea_nombre_ot_envasado_empacado; // let lin = value_rep.linea_nombre
                    let codigo = value_rep.codigo_oracle;
                    let producto = value_rep.descripcion;
                    // Datos de Produccion
                    let horas = value_prod.duracion_horas;
                    let fec_cierre = value_prod.fecha;
                    let anio = fec_cierre.split('/')[1];
                    let mes = fec_cierre.split('/')[2];
                    let estado = value_rep.estado;
                    let soles_x_hr = value_prod.costo_hora;
                    let total_soles = value_prod.costo_total;

                    // Procesar reporte
                    rend = `${Math.round10(rend, -2).toFixed(2)}%`;

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
                    }

                    if (!(value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO')) {
                        // Insertar informacion en array
                        data_mod.push(json);
                    }
                    if (value_prod.empleado == '22099' || value_prod.empleado_nombre == 'PERSONAL TERCERO') {
                        // Insertar informacion en array
                        data_srv.push(json);
                    }
                    // Insertar informacion en array
                    data_mod_srv.push(json);
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
