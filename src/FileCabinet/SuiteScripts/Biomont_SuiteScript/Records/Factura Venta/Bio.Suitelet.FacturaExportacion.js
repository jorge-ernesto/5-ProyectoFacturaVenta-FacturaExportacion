/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N','./lib/qrcode'],
    
    (N,QRCode) => {

        const { search, log, record, format, file, render, encode, https, xml  } = N;
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if (scriptContext.request.method == 'GET') {
                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let invoiceId = scriptContext.request.parameters['_invoiceId'];

                if (button == 'pdf') {

                    // Obtener datos
                    let invoice_data = getData(invoiceId);

                    // Crear PDF
                    let { pdfFile } = createPDF(invoice_data);

                    // Descargar PDF
                    scriptContext.response.writeFile({
                        file: pdfFile
                    });
                }

            }
            
        }

        function getInvoiceTotal(invoiceId){
            return record.load({
                type: search.Type.INVOICE,
                id: invoiceId
            }).getValue('total');
        }

        function getData(invoiceId) {

            // Obtener detalles de la cabecera de la factura
            var invoiceHeader = getInvoiceHeader(invoiceId);

            var invoiceDetail = getInvoiceDetail(invoiceId, invoiceHeader.ruccliente);
            
            var result = {
                'header': invoiceHeader,
                'detail': invoiceDetail
            };

            return result;
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

            var hashValue = "", resizedImage = "";
            log.error("invoiceResults[0].getValue('custbody_ns_printed_xml_response')", invoiceResults[0].getValue('custbody_ns_printed_xml_response'));
            if (invoiceResults[0].getValue('custbody_ns_printed_xml_response')) {
                hashValue = getValueLabelXML(invoiceResults[0].getValue('custbody_ns_printed_xml_response')) || '';
                log.error("hashValue", hashValue);
                let contentData = `20100278708|01|${invoiceResults[0].getValue('tranid').substring(3).split('-')[0]}|${invoiceResults[0].getValue('tranid').substring(3).split('-')[1]}|0.00|${Math.trunc(invoiceResults[0].getValue('total') / invoiceResults[0].getValue('exchangerate') * 100) / 100}|${invoiceResults[0].getValue('trandate').split('/')[2]}-${invoiceResults[0].getValue('trandate').split('/')[1]}-${invoiceResults[0].getValue('trandate').split('/')[0]}|${invoiceResults[0].getValue('custbody_psg_ei_content').match(/<numeroDocumentoAdquiriente>(.*?)<\/numeroDocumentoAdquiriente>/)[1]}|${hashValue}`;
                resizedImage = crearQR(contentData);
            }



            // Verificar si se encontraron resultados
            var total = 0;
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
                    'totalfactura': getInvoiceTotal(invoiceId), //Math.trunc(total * 100) / 100,
                    'totaltexto': invoiceResults[0].getValue('custbody_ns_amount_words'),
                    'hash': hashValue,
                    'imageQR': resizedImage
                };
    
                return invoiceHeader;
            }
    
            // Si no se encontraron resultados, puedes devolver un objeto vacío o null según tu lógica
            return {};
        }

        function getInvoiceDetail(invoiceId, ruccliente) {
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
                    'custcol_ns_pe_um'
                ]
            });
    
            // Ejecutar la búsqueda
            var itemResults = itemSearch.run().getRange({ start: 0, end: 1000 }); // Ajusta según sea necesario
    
            var invoiceDetail = [];

            var register = '';
    
            // Procesar los resultados de los detalles de ítem en la factura
            for (let i = 0; i < itemResults.length; i++) {
                let itemId = itemResults[i].getValue('item');
                let itemCod = itemResults[i].getText('item');
                let description = itemResults[i].getValue({ name: 'description', join: 'item' });
                let quantity = itemResults[i].getValue('quantity');
                let rate = itemResults[i].getValue('rate');
                let amount = itemResults[i].getValue('amount');
                let price = (parseFloat(itemResults[i].getValue('rate')) / parseFloat(itemResults[i].getValue('exchangerate'))).toFixed(2);

                if(ruccliente==='J0310000308829'){
                    register = itemResults[i].getValue('custcol_bio_item_reg');
                }
                
                let fechaexpira = itemResults[i].getValue({ name: 'expirationdate', join: 'inventorydetail' });
                let numeroinventario = itemResults[i].getText({ name: 'inventorynumber', join: 'inventorydetail' });
                let cantidadinventario = itemResults[i].getValue({ name: 'quantity', join: 'inventorydetail' });
                let unit = itemResults[i].getValue('custcol_ns_pe_um');
    
                var detail = {
                    'item': i,
                    'itemId': itemId,
                    'itemCod': itemCod,
                    'description':description,
                    'unidades':unit,
                    'quantity': Number(quantity),
                    'numeroinventario': numeroinventario,
                    'lote': numeroinventario.replace("##","#").split("#")[0],
                    'fechafabricacion': numeroinventario.replace("##","#").split("#")[1],
                    'fechaexpira': fechaexpira.split("/")[1]+"-"+fechaexpira.split("/")[2],
                    'cantidadinventario': Number(cantidadinventario),
                    'rate': Number(rate).toFixed(2),
                    'amount': Number(amount).toFixed(2),
                    'price': Number(price),
                    'register': register,
                    'vventa': Number(cantidadinventario) * Number(price)
                };

                if(detail.itemId!="" && detail.unidades!=""){
                    invoiceDetail.push(detail);
                }
                
            }
    
            return invoiceDetail;
        }

        function getValueLabelXML(obj){
            // Agregar el encabezado 'Accept-Language' a la solicitud HTTP
            var headers = {
                'Accept-Language': 'en-us'
            };

            var response = https.get({
                url: obj,
                headers: headers
            });

            // Verificar si la solicitud HTTP fue exitosa
            if (response.code !== 200) {
                return false;
                //throw 'Error en la solicitud HTTP. Código: ' + response.code;
            }

            // Decodificar la cadena base64 a una cadena binaria
            var binaryString = encode.convert({
                string: response.body,
                inputEncoding: encode.Encoding.BASE_64,
                outputEncoding: encode.Encoding.UTF_8
            });

            // Convertir la cadena binaria a XML
            var xmlDoc = xml.Parser.fromString(binaryString);

            // Obtener el valor de la etiqueta específica ('ds:DigestValue' en este caso)
            var digestValueNode = xmlDoc.getElementsByTagName('ds:DigestValue')[0];

            if (digestValueNode) {
                var valorEtiqueta = digestValueNode.textContent;
                return valorEtiqueta;
            } else {
                //throw 'La etiqueta "ds:DigestValue" no fue encontrada en el documento XML.';
                return false;
            }
        }

        function crearQR(contentData){
            /// Generar el código QR
            var qr = QRCode(0, 'L');
            qr.addData(contentData);
            qr.make();

            // Obtener la imagen del código QR en base64
            return qr.createImgTag(1, 0).replace(/^<img[^>]+src="data:image\/png;base64,/, '').replace(/"[^>]*$/, '');
        }

        function convertirImagenABase64() {
            let fileObj = file.load({
              id: '54016' // ID del logo biomont
            });
            // Leer el contenido del archivo como un blob binario
            let fileContent = fileObj.getContents();

            return 'data:image/gif;base64,' + fileContent.toString('base64');
        }

        // Crear PDF
        function createPDF(invoice_data) {

            // Crear PDF - Contenido dinamico
            let pdfContent = file.load('./template/PDF/pdfreport_applying_stylesheets.ftl').getContents();
            let rendererPDF = render.create();
            rendererPDF.templateContent = pdfContent;

            // Enviar datos a PDF
            rendererPDF.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: "input",
                data: {
                    data: JSON.stringify({
                        invoice_data: invoice_data,
                        img: convertirImagenABase64()
                    })
                }
            });

            // Crear PDF
            let pdfFile = rendererPDF.renderAsPdf();

            // Reescribir datos de PDF
            pdfFile.name = `biomont_factura_exportacion.pdf`;

            return { pdfFile };
        }

        return {onRequest}

    });
