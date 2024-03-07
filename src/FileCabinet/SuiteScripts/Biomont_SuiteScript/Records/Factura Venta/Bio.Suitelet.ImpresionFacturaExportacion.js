/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 * 
 * API REST
 */
define(['N/search', 'N/log', 'N/record', 'N/format'],
    
    (search, log, record, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                // ID de la factura de venta que deseas buscar
                //var invoiceId = scriptContext.request.parameters.internalid;
                var invoiceId = "1485024";

                // Obtener detalles de la cabecera de la factura
                var invoiceHeader = getInvoiceHeader(invoiceId);

                // Obtener detalles del ítem en la factura, incluyendo detalles de inventario
                var invoiceDetail = getInvoiceDetail(invoiceId);

                // Construir el resultado final en formato JSON
                var result = {
                    'header': invoiceHeader,
                    'detail': invoiceDetail
                };

                scriptContext.response.write(JSON.stringify(result));
    
            } catch (error) {
              log.error('Error loading Invoice', error);  
            }      
        }

        function getInvoiceHeader(invoiceId) {
            // Crear la búsqueda para la cabecera de la factura
            var invoiceSearch = search.create({
                type: search.Type.INVOICE,
                filters: [['internalid', 'anyof', invoiceId]],
                columns: [
                    'internalid', 
                    'tranid', 
                    'trandate', 
                    'entity', 
                    'total', 
                    'custbody26', 
                    'duedate', 
                    'currency', 
                    'exchangerate', 
                    'custbody_ns_gr_rel_serie',
                    'custbody_ns_gr_rel_num',
                    'custbody10',
                    'createdfrom',
                    'custbody12',
                    'custbody_ns_amount_words',
                    'memo',
                    'custbody_psg_ei_content',
                    'billaddress',
                    'custbody_ns_printed_xml_response'
                ]
            });
    
            // Ejecutar la búsqueda
            var invoiceResults = invoiceSearch.run().getRange({ start: 0, end: 1 });
            
            // Verificar si se encontraron resultados
            let total = 0;
            if (invoiceResults && invoiceResults.length > 0) {

                if(invoiceResults[0].getValue('currency')==2){
                    total = invoiceResults[0].getValue('total') / invoiceResults[0].getValue('exchangerate');
                }else{
                    total = invoiceResults[0].getValue('total');
                }
                var invoiceHeader = {
                    'internalid': invoiceResults[0].getValue('internalid'),
                    'nrodocumento': invoiceResults[0].getValue('tranid').substring(3),
                    'fecha': invoiceResults[0].getValue('trandate'),
                    'fechavencimiento': invoiceResults[0].getValue('duedate'),
                    'moneda': invoiceResults[0].getValue('currency'),
                    'cliente': invoiceResults[0].getText('entity').split(' ').slice(1).join(' '),
                    'direcfacturacion': invoiceResults[0].getValue('billaddress').split('\n')[1],
                    'ruccliente': invoiceResults[0].getValue('custbody_psg_ei_content').match(/<numeroDocumentoAdquiriente>(.*?)<\/numeroDocumentoAdquiriente>/)[1],
                    'transportista': invoiceResults[0].getText('custbody26'),
                    'vendedor': invoiceResults[0].getValue('custbody10'),
                    'nropedido': 'Orden de Venta #'+invoiceResults[0].getText('createdfrom').split("#")[1],
                    'condicionpago': invoiceResults[0].getText('custbody12'),
                    'guiarelacionada': invoiceResults[0].getValue('custbody_ns_gr_rel_serie') +'-'+invoiceResults[0].getValue('custbody_ns_gr_rel_num'),
                    'observaciones': invoiceResults[0].getValue('memo'),
                    'total': invoiceResults[0].getValue('total'),
                    'tipocambio': invoiceResults[0].getValue('exchangerate'),
                    'totalfactura': Math.trunc(total * 100) / 100,
                    'totaltexto': invoiceResults[0].getValue('custbody_ns_amount_words'),
                    'custbody_ns_printed_xml_response': invoiceResults[0].getValue('custbody_ns_printed_xml_response'),
                    'img': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAABBCAYAAADL2qaCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozZTBjOWQzMC04Mzc5LTRmMDUtYjc2ZC04MDVlNDI4NGEwMjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEFBQkExMjlDQURGMTFFQTk2QzQ4QzY3MTM5MzdENTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEFBQkExMjhDQURGMTFFQTk2QzQ4QzY3MTM5MzdENTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDlkMWU3OS0zZjY3LTQ0ODctYTFlNy01Zjg3ODc0YWY3NzkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMmNkYjZkNi1jOTRmLWVlNDgtYmI4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'
                };
    
                return invoiceHeader;
            }
    
            // Si no se encontraron resultados, puedes devolver un objeto vacío o null según tu lógica
            return {};
        }
    
        function getInvoiceDetail(invoiceId) {
            // Crear la búsqueda para los detalles del ítem en la factura
            var itemSearch = search.create({
                type: search.Type.INVOICE,
                filters: [['internalid', 'anyof', invoiceId]],
                columns: [
                    'item', 
                    'quantity',
                    'rate', 
                    'amount',
                    'exchangerate',
                    'custcol_bio_item_reg',
                    'item.description',
                    'inventorydetail.expirationdate',
                    'inventorydetail.inventorynumber',
                    'inventorydetail.quantity',
                    'custcol_ns_pe_um',
                ]
            });
    
            // Ejecutar la búsqueda
            var itemResults = itemSearch.run().getRange({ start: 0, end: 1000 }); // Ajusta según sea necesario
    
            var invoiceDetail = [];
            invoiceDetail.push(['Item','Codigo','Descripcion','Reg','UND','Lote','Cant.','Fab.','Venc.','Precio','V.Venta']);
    
            // Procesar los resultados de los detalles de ítem en la factura
            for (let i = 0; i < itemResults.length; i++) {
                let itemId = itemResults[i].getValue('item');
                let itemCod = itemResults[i].getText('item');
                let description = itemResults[i].getValue({ name: 'description', join: 'item' });
                let quantity = itemResults[i].getValue('quantity');
                let rate = itemResults[i].getValue('rate');
                let amount = itemResults[i].getValue('amount');
                let price = (parseFloat(itemResults[i].getValue('rate')) / parseFloat(itemResults[i].getValue('exchangerate'))).toFixed(2);
                let register = itemResults[i].getValue('custcol_bio_item_reg');
                let fechaexpira = itemResults[i].getValue({ name: 'expirationdate', join: 'inventorydetail' });
                let numeroinventario = itemResults[i].getText({ name: 'inventorynumber', join: 'inventorydetail' });
                let cantidadinventario = itemResults[i].getValue({ name: 'quantity', join: 'inventorydetail' });
                let unit = itemResults[i].getValue('custcol_ns_pe_um');
    
                /*var detail = {
                    'itemId': itemId,
                    'itemCod': itemCod,
                    'description':description,
                    'quantity': Number(quantity),
                    'numeroinventario': numeroinventario,
                    'lote': numeroinventario.replace("##","#").split("#")[0],
                    'fechafabricacion': numeroinventario.replace("##","#").split("#")[1],
                    'fechaexpira': fechaexpira.split("/")[1]+"-"+fechaexpira.split("/")[2],
                    'cantidadinventario': Number(cantidadinventario),
                    'rate': Number(rate).toFixed(2),
                    'amount': Number(amount).toFixed(2),
                    'price': Number(price).toFixed(2),
                    'register': register,
                    'vventa': (Number(cantidadinventario) * Number(price)).toFixed(2),
                };*/

                let detail = [
                    i.toString(),
                    itemCod,
                    description,
                    register,
                    unit,
                    numeroinventario.replace("##","#").split("#")[0],
                    cantidadinventario,
                    numeroinventario.replace("##","#").split("#")[1],
                    fechaexpira.split("/")[1]+"-"+fechaexpira.split("/")[2],
                    Number(price).toFixed(2),
                    (Number(cantidadinventario) * Number(price)).toFixed(2),
                ];

                if(detail[1]!="" && detail[4]!=""){
                    invoiceDetail.push(detail);
                }
                
            }
    
            return invoiceDetail;
        }

        return {onRequest}

    });
