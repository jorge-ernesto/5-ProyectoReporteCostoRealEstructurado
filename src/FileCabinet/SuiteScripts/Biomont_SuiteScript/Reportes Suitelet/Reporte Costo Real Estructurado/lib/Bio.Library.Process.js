/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        function getDataMD(dataReporte) {

            // Declarar variables
            let data = [];

            dataReporte.forEach(element => {
                // Obtener informacion
                let nro_ord = element.id_interno;

                // Insertar informacion en array
                data.push({
                    nro_ord: nro_ord,
                });
            });

            // Retornar informacion
            return data;
        }

        return { getDataMD }

    });
