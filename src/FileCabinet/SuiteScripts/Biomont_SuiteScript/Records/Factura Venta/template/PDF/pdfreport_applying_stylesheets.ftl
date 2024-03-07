<#assign params = input.data?eval>
<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <style>
            body {
                font-family: sans-serif;
            }

            .bold {
                font-weight: bold;
            }

            .center {
                text-align: center;
                margin: 0 auto;
            }

            .left {
                text-align: left;
            }

            .pb1 {
                padding-bottom: 1px;
            }

            .fs15 {
                font-size: 15px;
            }

            .fs10 {
                font-size: 10px;
            }

            .fs9 {
                font-size: 9px;
            }

            .fs8 {
                font-size: 8px;
            }

            .fs7 {
                font-size: 7px;
            }

            .tbbody {
                border-collapse: collapse;
                /* Asegura que los bordes de las celdas se fusionen correctamente */
                width: 100%;
            }

            .tbbody th,
            .tbbody td {
                border: 1px solid black;
                text-align: center;
                padding: 3px;
            }
        </style>

        <macrolist>
            <macro id="nlheader">
                <table class="header" style="width: 100%;">
                    <tr>
                        <td style="width: 65%;">
                            <img src="${params.img}" style="width: 155px; height: 60px;" />
                        </td>
                        <td rowspan="2" style="width: 35%; text-align: right;">
                            <p align="center" style="width: 100%;border: solid 1px #000000;padding:10px;">
                                <span class="fs15 bold"><b>R.U.C. N&deg; 20100278708</b></span><br /><br />
                                <span class="fs15 bold"><b>FACTURA ELECTR&Oacute;NICA</b></span><br /><br />
                                <span class="fs15 bold"><b>
                                        ${params.invoice_data.header.nrodocumento}
                                    </b></span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 65%;" class="fs8">
                            <b>Laboratorios BIOMONT S.A.</b>
                            <br />Av. Industrial N&deg; 184 - La Aurora - Ate - Lima - Lima - Per&uacute;<br />
                            Telfs.: (00 511) 206-2700 * 206-2701 * 2062702<br />
                            Email: laboratorios@biomont.com.pe Web: www.biomont.com.pe
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style='width:100%;'></td>
                    </tr>
                    <tr>
                        <td style="width: 70%;" class="fs9"><b>RUC:</b>
                            ${params.invoice_data.header.ruccliente}
                        </td>
                        <td style="width: 30%;" class="fs9"><b>Fecha de Emisión:</b>
                            ${params.invoice_data.header.fecha}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 70%;" class="fs9"><b>Nombre/Razón Social:</b>
                            ${params.invoice_data.header.cliente}
                        </td>
                        <td style="width: 30%;" class="fs9"><b>Fecha Vencimiento:</b>
                            ${params.invoice_data.header.fechavencimiento}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 70%;" class="fs9"><b>Dirección:</b>
                            ${params.invoice_data.header.direcfacturacion}
                        </td>
                        <td style="width: 30%;" class="fs9"><b>Vendedor:</b>
                            ${params.invoice_data.header.vendedor}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 70%;" class="fs9"><b>Transportista:</b>
                            ${params.invoice_data.header.transportista}
                        </td>
                        <td style="width: 30%;" class="fs9"><b>Nº de Pedido:</b>
                            ${params.invoice_data.header.nropedido}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 70%;" class="fs9"><b>Guía:</b>
                            ${params.invoice_data.header.guiarelacionada}
                        </td>
                        <td style="width: 30%;" class="fs9"><b>Condición de Pago:</b>
                            ${params.invoice_data.header.condicionpago}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style='width: 100%;'></td>
                    </tr>
                </table>
            </macro>
            <macro id="nlfooter">
                <table class="footer" style="width: 100%;">
                    <tr>
                        <td colspan="11">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="7" rowspan="3" class="fs9" style="vertical-align: middle;">
                            <b>Son:</b>
                            ${params.invoice_data.header.totaltexto}
                                
                            <p style="width: 100%;border: solid 1px #000000;padding:2px;">
                                <b>Observaciones:</b>
                                ${params.invoice_data.header.observaciones}
                            </p>
                        </td>
                        <td class="fs9" colspan="2"><b>Op. Gravada</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Op. Exoneradas</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Op. Gratuitas</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="7" rowspan="5">
                            <p style="width: 100%;border: solid 1px #000000;padding:2px;">
                                <b>NOTAS</b><br />
                                1.- Sírvase a cancelar esta factura con cheque a la orden de Laboratorios Biomont S.A.<br />
                                2.- Una vez entregada la mercadería no hay lugar a reclamos, cambio o devolución.<br />
                                3.- Toda factura o letra que no sea cancelada a su vencimiento estará afectada a intereses.<br />
                                4.- Todo canje y/o devolución se realizarán a través del vendedor, indicando el documento con el cual<br /> se adquirió el producto.
                            </p>
                        </td>
                        <td class="fs9" colspan="2"><b>Op. Inafecta</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Op. Exportación</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>
                            ${params.invoice_data.header.totalfactura?string("#,##0.00")}
                        </td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>I.G-.V. (18%)</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Flete</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Seguro</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right'>0.00</td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="7" rowspan="2">
                            <p style="width: 100%;border: solid 1px #000000;padding:2px;">
                                <b>Observaciones de SUNAT</b><br />
                                El comprobante numero ${params.invoice_data.header.nrodocumento}, ha sido aceptada
                            </p>
                        </td>
                        <td class="fs9" colspan="2"></td>
                        <td class="fs9"></td>
                        <td class="fs9" align='right'></td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="2"><b>Importe Total</b></td>
                        <td class="fs9">$</td>
                        <td class="fs9" align='right' style="border-top: solid 1px #000000;">
                            ${params.invoice_data.header.totalfactura?string("#,##0.00")}
                        </td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="11">
                            Autorizado a ser emisor electrónico mediante R.I. SUNAT Nº0340050004781<br />
                            Representación Impresa de la Factura Electrónica, consulte en https://sfe.bizlinks.com.pe
                        </td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="8" style='width:80%;'></td>
                        <td align='right' class="fs9" colspan="3" style='width:30%;'>
                            ${params.invoice_data.header.imageQR}
                            <br /><i>Powered by Bizlinks</i>
                        </td>
                    </tr>
                    <tr>
                        <td class="fs9" colspan="4" style='width:40%;'>Código Hash: ${params.invoice_data.header.hash}
                        </td>
                        <td align='center' class="fs9" colspan="3" style='width:30%;'>
                            <pagenumber /> /
                            <totalpages />
                        </td>
                        <td align='right' class="fs9" colspan="4" style='width:40%;'>R.U.C. 20100278708-${params.invoice_data.header.nrodocumento}
                        </td>
                    </tr>
                </table>
            </macro>
        </macrolist>
    </head>

    <body header="nlheader" header-height="180pt" footer="nlfooter" footer-height="240pt" padding="5mm 5mm 5mm 5mm" size="A4">

        <table style="width: 100%;" class="tbbody">
                <tr>
                    <td align='center' class="fs9"><b>Item</b></td>
                    <td class="fs9"><b>Código</b></td>
                    <td class="fs9"><b>Descripción</b></td>
                    <td align='center' class="fs9"><b>Reg</b></td>
                    <td align='center' class="fs9"><b>UND</b></td>
                    <td align='center' class="fs9"><b>Lote</b></td>
                    <td align='center' class="fs9"><b>Cant.</b></td>
                    <td align='center' class="fs9"><b>Fab.</b></td>
                    <td align='center' class="fs9"><b>Venc.</b></td>
                    <td align='center' class="fs9"><b>Precio</b></td>
                    <td align='center' class="fs9"><b>V. Venta</b></td>
                </tr>
                <#list params.invoice_data.detail as detalle>
                    <tr>
                        <td align='center' class="fs8">
                            ${detalle.item}
                        </td>
                        <td class="fs8">
                            ${detalle.itemCod}
                        </td>
                        <td class="fs8">
                            ${detalle.description}
                        </td>
                        <td align='center' class="fs8">
                            ${detalle.register}
                        </td>
                        <td align='center' class="fs8">
                            ${detalle.unidades}
                        </td>
                        <td align='center' class="fs8">
                            ${detalle.lote}
                        </td>
                        <td align='right' class="fs8">
                            ${detalle.cantidadinventario}
                        </td>
                        <td align='center' class="fs8">
                            ${detalle.fechafabricacion}
                        </td>
                        <td align='center' class="fs8">
                            ${detalle.fechaexpira}
                        </td>
                        <td align='right' class="fs8">
                            ${detalle.price?string("#,##0.00")}
                        </td>
                        <td align='right' class="fs8">
                            ${detalle.vventa?string("#,##0.00")}
                        </td>
                    </tr>
                </#list>
            </table>

    </body>
</pdf>