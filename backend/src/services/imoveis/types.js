/**
 * @typedef {Object} GeoJsonProperties
 * @property {string | null} Name - Nome do polígono
 * @property {string | null} description - Descrição
 * @property {string | null} timestamp - Timestamp do evento
 * @property {string | null} begin - Data/hora de início
 * @property {string | null} end - Data/hora de fim
 * @property {string | null} altitudeMode - Modo de altitude
 * @property {number | null} tessellate - Tessellação
 * @property {number} extrude - Extrusão
 * @property {number} visibility - Visibilidade
 * @property {string | null} drawOrder - Ordem de desenho
 * @property {string | null} icon - Ícone associado
 */

/**
 * @typedef {Object} OrcamentoConfig
 * @property {number} limite_orcamento_mensal - Limite orçamentário mensal em reais
 * @property {CustosVariaveisPadrao} custos_variaveis_padrao - Custos variáveis padrão
 * @property {RegrasPontuacao} regras_pontuacao - Regras de cálculo de pontuação
 */

/**
 * @typedef {Object} GeoJsonGeometry
 * @property {"Polygon"} type - Tipo de geometria
 * @property {number[][][]} coordinates - Array de coordenadas [lon, lat, altitude]
 */

/**
 * @typedef {Object} GeoJsonFeature
 * @property {"Feature"} type - Tipo GeoJSON
 * @property {GeoJsonProperties} properties - Propriedades do feature
 * @property {GeoJsonGeometry} geometry - Geometria do feature
 */

/**
 * @typedef {Object} GeoJsonCRS
 * @property {string} type - Tipo de CRS
 * @property {{name: string}} properties - Propriedades do CRS
 */

/**
 * @typedef {Object} GeoJsonFeatureCollection
 * @property {"FeatureCollection"} type - Tipo GeoJSON
 * @property {string} name - Nome do arquivo
 * @property {GeoJsonCRS} crs - Sistema de coordenadas de referência
 * @property {GeoJsonFeature[]} features - Array de features (polígonos)
 */
/**
 * @typedef {Object} CustosVariaveisPadrao
 * @property {number} luz - Custo mensal de luz em reais
 * @property {number} internet - Custo mensal de internet em reais
 * @property {number} agua - Custo mensal de água em reais
 * @property {number} gas - Custo mensal de gás em reais
 * @property {number} telefone_outros - Custo mensal de telefone e outros em reais
 */

/**
 * @typedef {Object} RegrasPontuacao
 * @property {number} bonus_dentro_do_limite - Pontos ganhos quando despesa está dentro do limite
 * @property {number} penalidade_por_100_reais_acima - Pontos perdidos por cada R$100 acima do limite
 */
