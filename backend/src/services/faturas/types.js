/**
 * @typedef {Object} Compra
 * @property {string} id - ID único da compra
 * @property {string} cartao_id - ID do cartão utilizado
 * @property {string} descricao - Descrição da compra
 * @property {string} categoria - Categoria da compra
 * @property {number} valor_total - Valor total da compra em reais
 * @property {number} parcelas_totais - Quantidade total de parcelas
 * @property {number} parcela_atual - Parcela atual sendo processada
 * @property {number} valor_parcela - Valor de cada parcela em reais
 * @property {"Recorrente" | "Parcelado"} tipo - Tipo da compra (recorrente ou parcelada)
 */

/**
 * @typedef {Object} FaturaCartaoMes
 * @property {Compra[]} compras - Lista de compras do mês
 */

/**
 * @typedef {Object.<string, FaturaCartaoMes>} FaturasCartoes
 * As chaves são datas no formato DD-MM-YYYY
 */
