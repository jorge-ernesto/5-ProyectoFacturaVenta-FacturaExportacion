/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url'], 
    
    function(currentRecord, url) {

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
            console.log("Factura de exportacion");
        }

        function downloadPDF(){
            let recordContext = currentRecord.get();
            let InvoiceId = recordContext.getValue('id');
 
             // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
             let suitelet = url.resolveScript({
                 deploymentId: "customdeploy_stl_factura_exportacion",
                 scriptId: "customscript_stl_factura_exportacion",
                 params: {
                    _invoiceId: InvoiceId,
                    _button: 'pdf',
                 }
             });
 
             // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
             setWindowChanged(window, false);
 
             // Abrir url
             window.open(suitelet);

        }

        return {
            pageInit: pageInit,
            downloadPDF: downloadPDF
        };
    
    });
