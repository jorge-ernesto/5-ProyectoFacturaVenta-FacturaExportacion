/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], function() {

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

            // Verificar si el formulario es una factura (puedes personalizar según tus necesidades)
            if (scriptContext.newRecord.type === 'invoice' && scriptContext.type === scriptContext.UserEventType.VIEW) {

                var tranid = scriptContext.newRecord.getValue('tranid');
        
                // Evaluar si el valor del campo es 'F002'
                if (tranid.includes("F002")) {

                    // Agregar un botón al formulario
                    var form = scriptContext.form;
                    form.addButton({
                        id: 'custpage_custom_button_download_pdf',
                        label: 'Descargar Factura',
                        functionName: "downloadPDF()"
                    });

                    form.clientScriptModulePath = './Bio.ClientScript.ImpresionFacturaExportacion.js';

                }

            }
        }

        return {beforeLoad}

    });
