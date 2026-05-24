/**
 * Navorix Exchange — Translation strings
 * 10 languages covering the major crypto markets
 */

export type LangCode =
  | "pt-BR" | "en" | "es" | "zh" | "ja" | "ko" | "ru" | "de" | "fr" | "tr";

export interface Translations {
  // Nav
  nav: {
    dashboard:  string;
    tokens:     string;
    trending:   string;
    create:     string;
    pools:      string;
    portfolio:  string;
  };

  // Wallet
  wallet: {
    connect:       string;
    connecting:    string;
    disconnect:    string;
    connected:     string;
    copyAddress:   string;
    copied:        string;
    viewOnSolscan: string;
    chooseWallet:  string;
    detected:      string;
    installExtension: string;
    openApp:       string;
    neverAskSeed:  string;
  };

  // Dashboard / Hero
  hero: {
    badge:        string;
    title1:       string;
    title2:       string;
    subtitle:     string;
    createToken:  string;
    explore:      string;
  };

  // Stats
  stats: {
    totalTokens:    string;
    totalLiquidity: string;
    volume24h:      string;
    activeTraders:  string;
    loading:        string;
  };

  // Token card
  tokenCard: {
    marketCap:  string;
    liquidity:  string;
    volume24h:  string;
    holders:    string;
  };

  // Marketplace
  marketplace: {
    title:       string;
    subtitle:    string;
    searchPlaceholder: string;
    hot:         string;
    new:         string;
    cap:         string;
    vol:         string;
    noTokens:    string;
    noResults:   string;
    retry:       string;
  };

  // Create token
  create: {
    title:          string;
    subtitle:       string;
    mediaSection:   string;
    logoLabel:      string;
    logoHint:       string;
    bannerLabel:    string;
    bannerHint:     string;
    clickToUpload:  string;
    clickToChange:  string;
    infoSection:    string;
    nameLabel:      string;
    namePlaceholder:string;
    nameHint:       string;
    tickerLabel:    string;
    tickerPlaceholder: string;
    tickerHint:     string;
    descLabel:      string;
    descPlaceholder:string;
    socialSection:  string;
    paramsSection:  string;
    decimalsLabel:  string;
    decimalsHint:   string;
    supplyLabel:    string;
    supplyHint:     string;
    integerToken:   string;
    solanaDefault:  string;
    highPrecision:  string;
    customValue:    string;
    currentSupply:  string;
    initialBuy:     string;
    optional:       string;
    initialBuyDesc: string;
    launchRate:     string;
    tenPctSupply:   string;
    firstBuyer:     string;
    quickValues:    string;
    youWillReceive: string;
    ofSupply:       string;
    skipBuy:        string;
    raydiumMin:     string;
    raydiumMinDesc: string;
    costSummary:    string;
    platformFee:    string;
    gasFee:         string;
    total:          string;
    insufficientBalance: string;
    connectWallet:  string;
    createButton:   string;
    createWithBuy:  string;
    immutableNote:  string;
    uploading:      string;
    metadata:       string;
    mintingSolana:  string;
    onChainMeta:    string;
    creatingPool:   string;
    savingDb:       string;
    dontClose:      string;
    success:        string;
    successBought:  string;
    viewMarketplace:string;
    createAnother:  string;
    failed:         string;
    tryAgain:       string;
    walletRequired: string;
    walletRequiredDesc: string;
  };

  // Trade panel
  trade: {
    buy:            string;
    sell:           string;
    youPay:         string;
    youSell:        string;
    youReceive:     string;
    priceImpact:    string;
    fee:            string;
    minReceived:    string;
    slippage:       string;
    noLiquidity:    string;
    buying:         string;
    selling:        string;
    confirmed:      string;
    lastTx:         string;
  };

  // Portfolio
  portfolio: {
    title:          string;
    subtitle:       string;
    connectTitle:   string;
    connectDesc:    string;
    solBalance:     string;
    tokenHoldings:  string;
    noTokens:       string;
    buyOnMarket:    string;
    tradeHistory:   string;
    viewJson:       string;
    refresh:        string;
    wallet:         string;
  };

  // Pools
  pools: {
    title:          string;
    subtitle:       string;
    howItWorks:     string;
    howItWorksDesc: string;
    addLP:          string;
    trade:          string;
    noPools:        string;
    liquidity:      string;
    volume24h:      string;
    fee:            string;
    price24h:       string;
    solReserve:     string;
  };

  // Trending
  trending: {
    title:    string;
    subtitle: string;
    token:    string;
    price:    string;
    change24: string;
    marketCap:string;
    volume24: string;
  };

  // Common
  common: {
    loading:    string;
    error:      string;
    notFound:   string;
    back:       string;
    viewAll:    string;
    createdAgo: string;
    copy:       string;
    solscan:    string;
    explorer:   string;
    about:      string;
    terms:      string;
    devnet:     string;
    mainnet:    string;
  };

  // Error boundary
  error: {
    title:   string;
    desc:    string;
    button:  string;
    fallback:string;
  };
}

// ─────────────────────────────────────────────────────────────
//  PORTUGUÊS (BR) — default
// ─────────────────────────────────────────────────────────────
const ptBR: Translations = {
  nav: { dashboard:"Dashboard", tokens:"Tokens", trending:"Trending", create:"Criar", pools:"Pools", portfolio:"Portfolio" },
  wallet: { connect:"Conectar Carteira", connecting:"Conectando...", disconnect:"Desconectar", connected:"Conectada", copyAddress:"Copiar endereço", copied:"Copiado!", viewOnSolscan:"Ver no Solscan", chooseWallet:"Conectar Carteira", detected:"Detectada", installExtension:"Instalar extensão", openApp:"Abrir app", neverAskSeed:"A Navorix nunca pede sua seed phrase." },
  hero: { badge:"Construído na Solana", title1:"A Premier", title2:"Launchpad Solana", subtitle:"Crie tokens SPL, negocie meme coins, forneça liquidez e descubra o próximo moonshot.", createToken:"Criar Token", explore:"Explorar Tokens" },
  stats: { totalTokens:"Total de Tokens", totalLiquidity:"Liquidez Total", volume24h:"Volume 24h", activeTraders:"Traders Ativos", loading:"Carregando..." },
  tokenCard: { marketCap:"Market Cap", liquidity:"Liquidez", volume24h:"Volume 24h", holders:"Holders" },
  marketplace: { title:"Marketplace de Tokens", subtitle:"Descubra, compre e venda tokens SPL na blockchain Solana.", searchPlaceholder:"Buscar por nome, ticker ou mint...", hot:"🔥 Hot", new:"✨ Novo", cap:"💰 Cap", vol:"📊 Vol", noTokens:"Nenhum token encontrado.", noResults:'Nenhum token com "{q}"', retry:"Tentar novamente" },
  create: { title:"Criar Token SPL", subtitle:"Lance seu próprio meme coin ou token utilitário na Solana. Sem código.", mediaSection:"Mídia", logoLabel:"Logo do Token", logoHint:"PNG, JPG, GIF · 1:1 recomendado · max 15MB", bannerLabel:"Banner", bannerHint:"16:9 recomendado · max 5MB", clickToUpload:"Clique para enviar", clickToChange:"Clique para trocar", infoSection:"Informações do Token", nameLabel:"Nome do Token", namePlaceholder:"ex: Navorix Coin", nameHint:"Máximo 32 caracteres", tickerLabel:"Ticker / Símbolo", tickerPlaceholder:"ex: NVR", tickerHint:"Somente maiúsculas e números (máx. 10)", descLabel:"Descrição", descPlaceholder:"Descreva seu token para a comunidade...", socialSection:"Links Sociais", paramsSection:"Parâmetros do Token", decimalsLabel:"Decimais", decimalsHint:"Define a menor fração do token", supplyLabel:"Supply Total", supplyHint:"Quantidade de tokens a criar", integerToken:"Token inteiro (sem fração)", solanaDefault:"Padrão Solana (como USDC)", highPrecision:"Alta precisão (como SOL)", customValue:"Ou digite um valor personalizado...", currentSupply:"Supply atual:", initialBuy:"Compra inicial", optional:"opcional", initialBuyDesc:"Compre seus próprios tokens antes do lançamento", launchRate:"Taxa de lançamento:", tenPctSupply:"(10% do fornecimento).", firstBuyer:"Você é o primeiro comprador — vantagem de preço máxima.", quickValues:"Valores rápidos", youWillReceive:"Você receberá", ofSupply:"do supply", skipBuy:"Pular compra inicial →", raydiumMin:"Adicione pelo menos 0.3 SOL", raydiumMinDesc:"para criar a pool e listar automaticamente no Raydium. Com valores menores, o token ainda será criado normalmente, mas a negociação pública poderá ser ativada depois.", costSummary:"Resumo do custo", platformFee:"Taxa de criação (plataforma)", gasFee:"Gás estimado (rede Solana)", total:"Total", insufficientBalance:"Saldo insuficiente", connectWallet:"Conectar Carteira", createButton:"Criar {symbol} na Solana", createWithBuy:"Criar {symbol} · Comprar {sol} SOL", immutableNote:"Dados imutáveis após criação · Taxa: 0.02 SOL", uploading:"Enviando imagem...", metadata:"Metadados Arweave", mintingSolana:"Mint Solana", onChainMeta:"Metadados on-chain", creatingPool:"Pool Raydium", savingDb:"Marketplace", dontClose:"Não feche esta janela", success:"Token Criado! 🎉", successBought:"Você comprou {amount} ${symbol} na compra inicial.", viewMarketplace:"Ver no marketplace", createAnother:"Criar outro token", failed:"Falha na criação", tryAgain:"Tentar novamente", walletRequired:"Conecte sua carteira", walletRequiredDesc:"Phantom, Solflare ou outra carteira Solana." },
  trade: { buy:"Comprar", sell:"Vender", youPay:"Você paga (SOL)", youSell:"Você vende ({symbol})", youReceive:"Você recebe", priceImpact:"Impacto no preço", fee:"Taxa Raydium", minReceived:"Mínimo recebido", slippage:"Slippage:", noLiquidity:"Sem liquidez disponível", buying:"Comprando...", selling:"Vendendo...", confirmed:"Última transação confirmada", lastTx:"Última transação" },
  portfolio: { title:"Portfolio", subtitle:"Saldo SOL, tokens e histórico de trades.", connectTitle:"Conecte sua carteira", connectDesc:"Veja saldo SOL, tokens e histórico de trades.", solBalance:"Saldo SOL", tokenHoldings:"Tokens na Carteira", noTokens:"Nenhum token SPL encontrado.", buyOnMarket:"Comprar no marketplace", tradeHistory:"Histórico de trades da carteira", viewJson:"Ver JSON", refresh:"Atualizar", wallet:"Carteira" },
  pools: { title:"Liquidity Pools", subtitle:"Forneça SOL + token como liquidez e ganhe 1% em cada trade.", howItWorks:"Como funciona:", howItWorksDesc:"Pools usam AMM constant-product (x × y = k). Ao adicionar liquidez você recebe tokens LP representando sua participação.", addLP:"Add LP", trade:"Negociar", noPools:"Nenhuma pool ainda. Crie um token para criar uma pool automaticamente.", liquidity:"Liquidez", volume24h:"Volume 24h", fee:"Taxa", price24h:"Preço 24h", solReserve:"Reserva SOL" },
  trending: { title:"Trending Agora", subtitle:"Top tokens por volume, crescimento de market cap e momentum.", token:"Token", price:"Preço", change24:"24h", marketCap:"Market Cap", volume24:"Volume 24h" },
  common: { loading:"Carregando...", error:"Erro", notFound:"Não encontrado", back:"Voltar", viewAll:"Ver todos", createdAgo:"Criado", copy:"Copiar", solscan:"Solscan", explorer:"Explorer", about:"Sobre", terms:"Termos", devnet:"devnet", mainnet:"mainnet" },
  error: { title:"Algo deu errado", desc:"Ocorreu um erro ao carregar a página. Clique abaixo para limpar e tentar novamente.", button:"Limpar e Recarregar", fallback:"Se o problema persistir, abra em aba anônima ou limpe os dados do site no navegador." },
};

// ─────────────────────────────────────────────────────────────
//  ENGLISH
// ─────────────────────────────────────────────────────────────
const en: Translations = {
  nav: { dashboard:"Dashboard", tokens:"Tokens", trending:"Trending", create:"Create", pools:"Pools", portfolio:"Portfolio" },
  wallet: { connect:"Connect Wallet", connecting:"Connecting...", disconnect:"Disconnect", connected:"Connected", copyAddress:"Copy address", copied:"Copied!", viewOnSolscan:"View on Solscan", chooseWallet:"Connect Wallet", detected:"Detected", installExtension:"Install extension", openApp:"Open app", neverAskSeed:"Navorix never asks for your seed phrase." },
  hero: { badge:"Built on Solana", title1:"The Premier", title2:"Solana Launchpad", subtitle:"Create SPL tokens, trade meme coins, provide liquidity and discover the next moonshot.", createToken:"Create Token", explore:"Explore Tokens" },
  stats: { totalTokens:"Total Tokens", totalLiquidity:"Total Liquidity", volume24h:"24h Volume", activeTraders:"Active Traders", loading:"Loading..." },
  tokenCard: { marketCap:"Market Cap", liquidity:"Liquidity", volume24h:"24h Volume", holders:"Holders" },
  marketplace: { title:"Token Marketplace", subtitle:"Discover, buy and sell SPL tokens on the Solana blockchain.", searchPlaceholder:"Search by name, ticker or mint...", hot:"🔥 Hot", new:"✨ New", cap:"💰 Cap", vol:"📊 Vol", noTokens:"No tokens found.", noResults:'No tokens matching "{q}"', retry:"Retry" },
  create: { title:"Create SPL Token", subtitle:"Launch your own meme coin or utility token on Solana. No coding required.", mediaSection:"Media", logoLabel:"Token Logo", logoHint:"PNG, JPG, GIF · 1:1 recommended · max 15MB", bannerLabel:"Banner", bannerHint:"16:9 recommended · max 5MB", clickToUpload:"Click to upload", clickToChange:"Click to change", infoSection:"Token Info", nameLabel:"Token Name", namePlaceholder:"e.g. Navorix Coin", nameHint:"Maximum 32 characters", tickerLabel:"Ticker / Symbol", tickerPlaceholder:"e.g. NVR", tickerHint:"Uppercase letters and numbers only (max 10)", descLabel:"Description", descPlaceholder:"Describe your token to the community...", socialSection:"Social Links", paramsSection:"Token Parameters", decimalsLabel:"Decimals", decimalsHint:"Defines the smallest unit of the token", supplyLabel:"Total Supply", supplyHint:"Number of tokens to mint", integerToken:"Integer token (no fractions)", solanaDefault:"Solana default (like USDC)", highPrecision:"High precision (like SOL)", customValue:"Or type a custom value...", currentSupply:"Current supply:", initialBuy:"Initial buy", optional:"optional", initialBuyDesc:"Buy your own tokens before launch", launchRate:"Launch rate:", tenPctSupply:"(10% of supply).", firstBuyer:"You are the first buyer — maximum price advantage.", quickValues:"Quick values", youWillReceive:"You will receive", ofSupply:"of supply", skipBuy:"Skip initial buy →", raydiumMin:"Add at least 0.3 SOL", raydiumMinDesc:"to create the pool and automatically list on Raydium. With less, the token is still created but public trading can be activated later.", costSummary:"Cost summary", platformFee:"Creation fee (platform)", gasFee:"Estimated gas (Solana network)", total:"Total", insufficientBalance:"Insufficient balance", connectWallet:"Connect Wallet", createButton:"Create {symbol} on Solana", createWithBuy:"Create {symbol} · Buy {sol} SOL", immutableNote:"Data is immutable after creation · Fee: 0.02 SOL", uploading:"Uploading image...", metadata:"Arweave metadata", mintingSolana:"Solana mint", onChainMeta:"On-chain metadata", creatingPool:"Raydium pool", savingDb:"Marketplace", dontClose:"Do not close this window", success:"Token Created! 🎉", successBought:"You bought {amount} ${symbol} in the initial buy.", viewMarketplace:"View in marketplace", createAnother:"Create another token", failed:"Creation failed", tryAgain:"Try again", walletRequired:"Connect your wallet", walletRequiredDesc:"Phantom, Solflare or any Solana wallet." },
  trade: { buy:"Buy", sell:"Sell", youPay:"You pay (SOL)", youSell:"You sell ({symbol})", youReceive:"You receive", priceImpact:"Price impact", fee:"Raydium fee", minReceived:"Min received", slippage:"Slippage:", noLiquidity:"No liquidity available", buying:"Buying...", selling:"Selling...", confirmed:"Last transaction confirmed", lastTx:"Last transaction" },
  portfolio: { title:"Portfolio", subtitle:"SOL balance, tokens and trade history.", connectTitle:"Connect your wallet", connectDesc:"See SOL balance, tokens and trade history.", solBalance:"SOL Balance", tokenHoldings:"Wallet Tokens", noTokens:"No SPL tokens found.", buyOnMarket:"Buy on marketplace", tradeHistory:"Wallet trade history", viewJson:"View JSON", refresh:"Refresh", wallet:"Wallet" },
  pools: { title:"Liquidity Pools", subtitle:"Provide SOL + token liquidity and earn 1% on every trade.", howItWorks:"How it works:", howItWorksDesc:"Pools use constant-product AMM (x × y = k). When you add liquidity you receive LP tokens representing your share.", addLP:"Add LP", trade:"Trade", noPools:"No pools yet. Create a token to automatically deploy a pool.", liquidity:"Liquidity", volume24h:"24h Volume", fee:"Fee", price24h:"24h Price", solReserve:"SOL Reserve" },
  trending: { title:"Trending Now", subtitle:"Top tokens by volume, market cap growth and momentum.", token:"Token", price:"Price", change24:"24h", marketCap:"Market Cap", volume24:"24h Volume" },
  common: { loading:"Loading...", error:"Error", notFound:"Not found", back:"Back", viewAll:"View all", createdAgo:"Created", copy:"Copy", solscan:"Solscan", explorer:"Explorer", about:"About", terms:"Terms", devnet:"devnet", mainnet:"mainnet" },
  error: { title:"Something went wrong", desc:"An error occurred loading the page. Click below to clear and try again.", button:"Clear & Reload", fallback:"If the problem persists, open in incognito mode or clear site data in your browser." },
};

// ─────────────────────────────────────────────────────────────
//  ESPAÑOL
// ─────────────────────────────────────────────────────────────
const es: Translations = {
  nav: { dashboard:"Panel", tokens:"Tokens", trending:"Tendencias", create:"Crear", pools:"Pools", portfolio:"Portafolio" },
  wallet: { connect:"Conectar Billetera", connecting:"Conectando...", disconnect:"Desconectar", connected:"Conectada", copyAddress:"Copiar dirección", copied:"¡Copiado!", viewOnSolscan:"Ver en Solscan", chooseWallet:"Conectar Billetera", detected:"Detectada", installExtension:"Instalar extensión", openApp:"Abrir app", neverAskSeed:"Navorix nunca pide tu seed phrase." },
  hero: { badge:"Construido en Solana", title1:"El Principal", title2:"Launchpad de Solana", subtitle:"Crea tokens SPL, opera meme coins, provee liquidez y descubre el próximo moonshot.", createToken:"Crear Token", explore:"Explorar Tokens" },
  stats: { totalTokens:"Total de Tokens", totalLiquidity:"Liquidez Total", volume24h:"Volumen 24h", activeTraders:"Traders Activos", loading:"Cargando..." },
  tokenCard: { marketCap:"Cap. de Mercado", liquidity:"Liquidez", volume24h:"Volumen 24h", holders:"Holders" },
  marketplace: { title:"Mercado de Tokens", subtitle:"Descubre, compra y vende tokens SPL en la blockchain de Solana.", searchPlaceholder:"Buscar por nombre, ticker o mint...", hot:"🔥 Hot", new:"✨ Nuevo", cap:"💰 Cap", vol:"📊 Vol", noTokens:"No se encontraron tokens.", noResults:'Sin tokens que coincidan con "{q}"', retry:"Reintentar" },
  create: { title:"Crear Token SPL", subtitle:"Lanza tu propio meme coin o token utilitario en Solana. Sin código.", mediaSection:"Medios", logoLabel:"Logo del Token", logoHint:"PNG, JPG, GIF · 1:1 recomendado · máx 15MB", bannerLabel:"Banner", bannerHint:"16:9 recomendado · máx 5MB", clickToUpload:"Haz clic para subir", clickToChange:"Haz clic para cambiar", infoSection:"Información del Token", nameLabel:"Nombre del Token", namePlaceholder:"ej: Navorix Coin", nameHint:"Máximo 32 caracteres", tickerLabel:"Ticker / Símbolo", tickerPlaceholder:"ej: NVR", tickerHint:"Solo letras mayúsculas y números (máx 10)", descLabel:"Descripción", descPlaceholder:"Describe tu token a la comunidad...", socialSection:"Redes Sociales", paramsSection:"Parámetros del Token", decimalsLabel:"Decimales", decimalsHint:"Define la unidad más pequeña del token", supplyLabel:"Supply Total", supplyHint:"Cantidad de tokens a crear", integerToken:"Token entero (sin fracción)", solanaDefault:"Estándar Solana (como USDC)", highPrecision:"Alta precisión (como SOL)", customValue:"O ingresa un valor personalizado...", currentSupply:"Supply actual:", initialBuy:"Compra inicial", optional:"opcional", initialBuyDesc:"Compra tus propios tokens antes del lanzamiento", launchRate:"Tasa de lanzamiento:", tenPctSupply:"(10% del supply).", firstBuyer:"Eres el primer comprador — máxima ventaja de precio.", quickValues:"Valores rápidos", youWillReceive:"Recibirás", ofSupply:"del supply", skipBuy:"Omitir compra inicial →", raydiumMin:"Agrega al menos 0.3 SOL", raydiumMinDesc:"para crear el pool y listar automáticamente en Raydium.", costSummary:"Resumen de costos", platformFee:"Tarifa de creación (plataforma)", gasFee:"Gas estimado (red Solana)", total:"Total", insufficientBalance:"Saldo insuficiente", connectWallet:"Conectar Billetera", createButton:"Crear {symbol} en Solana", createWithBuy:"Crear {symbol} · Comprar {sol} SOL", immutableNote:"Datos inmutables tras la creación · Tarifa: 0.02 SOL", uploading:"Subiendo imagen...", metadata:"Metadatos Arweave", mintingSolana:"Mint Solana", onChainMeta:"Metadatos on-chain", creatingPool:"Pool Raydium", savingDb:"Marketplace", dontClose:"No cierres esta ventana", success:"¡Token Creado! 🎉", successBought:"Compraste {amount} ${symbol} en la compra inicial.", viewMarketplace:"Ver en el marketplace", createAnother:"Crear otro token", failed:"Error en la creación", tryAgain:"Intentar de nuevo", walletRequired:"Conecta tu billetera", walletRequiredDesc:"Phantom, Solflare u otra billetera Solana." },
  trade: { buy:"Comprar", sell:"Vender", youPay:"Pagas (SOL)", youSell:"Vendes ({symbol})", youReceive:"Recibes", priceImpact:"Impacto en precio", fee:"Tarifa Raydium", minReceived:"Mínimo recibido", slippage:"Slippage:", noLiquidity:"Sin liquidez disponible", buying:"Comprando...", selling:"Vendiendo...", confirmed:"Última transacción confirmada", lastTx:"Última transacción" },
  portfolio: { title:"Portafolio", subtitle:"Saldo SOL, tokens e historial de trades.", connectTitle:"Conecta tu billetera", connectDesc:"Ve tu saldo SOL, tokens e historial de trades.", solBalance:"Saldo SOL", tokenHoldings:"Tokens en la Billetera", noTokens:"No se encontraron tokens SPL.", buyOnMarket:"Comprar en el marketplace", tradeHistory:"Historial de trades", viewJson:"Ver JSON", refresh:"Actualizar", wallet:"Billetera" },
  pools: { title:"Pools de Liquidez", subtitle:"Provee liquidez SOL + token y gana 1% en cada trade.", howItWorks:"Cómo funciona:", howItWorksDesc:"Los pools usan AMM de producto constante (x × y = k).", addLP:"Agregar LP", trade:"Operar", noPools:"Sin pools aún. Crea un token para desplegar un pool automáticamente.", liquidity:"Liquidez", volume24h:"Volumen 24h", fee:"Tarifa", price24h:"Precio 24h", solReserve:"Reserva SOL" },
  trending: { title:"Tendencias Ahora", subtitle:"Top tokens por volumen, crecimiento de market cap y momentum.", token:"Token", price:"Precio", change24:"24h", marketCap:"Cap. Mercado", volume24:"Volumen 24h" },
  common: { loading:"Cargando...", error:"Error", notFound:"No encontrado", back:"Volver", viewAll:"Ver todos", createdAgo:"Creado", copy:"Copiar", solscan:"Solscan", explorer:"Explorer", about:"Acerca de", terms:"Términos", devnet:"devnet", mainnet:"mainnet" },
  error: { title:"Algo salió mal", desc:"Ocurrió un error al cargar la página. Haz clic abajo para limpiar e intentar de nuevo.", button:"Limpiar y Recargar", fallback:"Si el problema persiste, abre en modo incógnito o limpia los datos del sitio." },
};

// ─────────────────────────────────────────────────────────────
//  中文 (CHINESE SIMPLIFIED)
// ─────────────────────────────────────────────────────────────
const zh: Translations = {
  nav: { dashboard:"仪表盘", tokens:"代币", trending:"趋势", create:"创建", pools:"流动池", portfolio:"持仓" },
  wallet: { connect:"连接钱包", connecting:"连接中...", disconnect:"断开连接", connected:"已连接", copyAddress:"复制地址", copied:"已复制！", viewOnSolscan:"在Solscan查看", chooseWallet:"连接钱包", detected:"已检测到", installExtension:"安装插件", openApp:"打开应用", neverAskSeed:"Navorix从不索要您的助记词。" },
  hero: { badge:"基于Solana构建", title1:"首席", title2:"Solana发射台", subtitle:"创建SPL代币，交易Meme币，提供流动性，发现下一个百倍币。", createToken:"创建代币", explore:"探索代币" },
  stats: { totalTokens:"代币总数", totalLiquidity:"总流动性", volume24h:"24小时交易量", activeTraders:"活跃交易者", loading:"加载中..." },
  tokenCard: { marketCap:"市值", liquidity:"流动性", volume24h:"24小时量", holders:"持有者" },
  marketplace: { title:"代币市场", subtitle:"在Solana区块链上发现、购买和出售SPL代币。", searchPlaceholder:"按名称、代码或铸造地址搜索...", hot:"🔥 热门", new:"✨ 最新", cap:"💰 市值", vol:"📊 交易量", noTokens:"未找到代币。", noResults:'未找到与"{q}"匹配的代币', retry:"重试" },
  create: { title:"创建SPL代币", subtitle:"在Solana上发行您自己的Meme币或功能代币。无需编程。", mediaSection:"媒体", logoLabel:"代币Logo", logoHint:"PNG, JPG, GIF · 建议1:1 · 最大15MB", bannerLabel:"横幅", bannerHint:"建议16:9 · 最大5MB", clickToUpload:"点击上传", clickToChange:"点击更换", infoSection:"代币信息", nameLabel:"代币名称", namePlaceholder:"例：Navorix Coin", nameHint:"最多32个字符", tickerLabel:"代码/符号", tickerPlaceholder:"例：NVR", tickerHint:"仅大写字母和数字（最多10个）", descLabel:"描述", descPlaceholder:"向社区描述您的代币...", socialSection:"社交链接", paramsSection:"代币参数", decimalsLabel:"小数位", decimalsHint:"定义代币最小单位", supplyLabel:"总供应量", supplyHint:"要铸造的代币数量", integerToken:"整数代币（无小数）", solanaDefault:"Solana标准（如USDC）", highPrecision:"高精度（如SOL）", customValue:"或输入自定义值...", currentSupply:"当前供应量：", initialBuy:"初始购买", optional:"可选", initialBuyDesc:"在发布前购买自己的代币", launchRate:"发行汇率：", tenPctSupply:"（供应量的10%）。", firstBuyer:"您是第一个买家——最大价格优势。", quickValues:"快速选择", youWillReceive:"您将获得", ofSupply:"供应量", skipBuy:"跳过初始购买 →", raydiumMin:"至少添加0.3 SOL", raydiumMinDesc:"以创建流动池并自动在Raydium上市。", costSummary:"费用摘要", platformFee:"创建费用（平台）", gasFee:"预估Gas（Solana网络）", total:"合计", insufficientBalance:"余额不足", connectWallet:"连接钱包", createButton:"在Solana创建{symbol}", createWithBuy:"创建{symbol} · 购买{sol} SOL", immutableNote:"创建后数据不可更改 · 费用：0.02 SOL", uploading:"上传图片...", metadata:"Arweave元数据", mintingSolana:"Solana铸造", onChainMeta:"链上元数据", creatingPool:"Raydium流动池", savingDb:"市场", dontClose:"请勿关闭此窗口", success:"代币创建成功！🎉", successBought:"您在初始购买中获得了{amount} ${symbol}。", viewMarketplace:"在市场中查看", createAnother:"创建另一个代币", failed:"创建失败", tryAgain:"重试", walletRequired:"请连接您的钱包", walletRequiredDesc:"Phantom、Solflare或任何Solana钱包。" },
  trade: { buy:"购买", sell:"出售", youPay:"您支付（SOL）", youSell:"您出售（{symbol}）", youReceive:"您获得", priceImpact:"价格影响", fee:"Raydium手续费", minReceived:"最低获得", slippage:"滑点：", noLiquidity:"无可用流动性", buying:"购买中...", selling:"出售中...", confirmed:"最后交易已确认", lastTx:"最后交易" },
  portfolio: { title:"持仓", subtitle:"SOL余额、代币和交易历史。", connectTitle:"连接您的钱包", connectDesc:"查看SOL余额、代币和交易历史。", solBalance:"SOL余额", tokenHoldings:"钱包代币", noTokens:"未找到SPL代币。", buyOnMarket:"在市场购买", tradeHistory:"钱包交易历史", viewJson:"查看JSON", refresh:"刷新", wallet:"钱包" },
  pools: { title:"流动性池", subtitle:"提供SOL+代币流动性，每笔交易获得1%收益。", howItWorks:"运作方式：", howItWorksDesc:"流动池使用恒定乘积AMM（x × y = k）。", addLP:"添加LP", trade:"交易", noPools:"暂无流动池。创建代币自动部署流动池。", liquidity:"流动性", volume24h:"24小时量", fee:"手续费", price24h:"24小时价格", solReserve:"SOL储备" },
  trending: { title:"当前热门", subtitle:"按交易量、市值增长和动能排名的顶级代币。", token:"代币", price:"价格", change24:"24小时", marketCap:"市值", volume24:"24小时量" },
  common: { loading:"加载中...", error:"错误", notFound:"未找到", back:"返回", viewAll:"查看全部", createdAgo:"创建于", copy:"复制", solscan:"Solscan", explorer:"浏览器", about:"关于", terms:"条款", devnet:"开发网", mainnet:"主网" },
  error: { title:"出现错误", desc:"加载页面时发生错误，请点击下方清除并重试。", button:"清除并重新加载", fallback:"如果问题持续存在，请尝试无痕模式或清除站点数据。" },
};

// ─────────────────────────────────────────────────────────────
//  日本語 (JAPANESE)
// ─────────────────────────────────────────────────────────────
const ja: Translations = {
  nav: { dashboard:"ダッシュボード", tokens:"トークン", trending:"トレンド", create:"作成", pools:"プール", portfolio:"ポートフォリオ" },
  wallet: { connect:"ウォレット接続", connecting:"接続中...", disconnect:"切断", connected:"接続済み", copyAddress:"アドレスをコピー", copied:"コピーしました！", viewOnSolscan:"Solscanで確認", chooseWallet:"ウォレットを選択", detected:"検出済み", installExtension:"拡張機能をインストール", openApp:"アプリを開く", neverAskSeed:"Navorixがシードフレーズを求めることはありません。" },
  hero: { badge:"Solanaで構築", title1:"プレミア", title2:"Solanaランチパッド", subtitle:"SPLトークンを作成し、ミームコインを取引し、流動性を提供し、次のムーンショットを見つけましょう。", createToken:"トークン作成", explore:"トークンを探す" },
  stats: { totalTokens:"総トークン数", totalLiquidity:"総流動性", volume24h:"24h取引量", activeTraders:"アクティブトレーダー", loading:"読み込み中..." },
  tokenCard: { marketCap:"時価総額", liquidity:"流動性", volume24h:"24h量", holders:"ホルダー" },
  marketplace: { title:"トークンマーケット", subtitle:"SolanaブロックチェーンのSPLトークンを発見、売買しましょう。", searchPlaceholder:"名前、ティッカー、またはミントで検索...", hot:"🔥 ホット", new:"✨ 新着", cap:"💰 時価", vol:"📊 出来高", noTokens:"トークンが見つかりません。", noResults:'"{q}"に一致するトークンがありません', retry:"再試行" },
  create: { title:"SPLトークン作成", subtitle:"Solana上で独自のミームコインやユーティリティトークンを作成。コード不要。", mediaSection:"メディア", logoLabel:"トークンロゴ", logoHint:"PNG, JPG, GIF · 1:1推奨 · 最大15MB", bannerLabel:"バナー", bannerHint:"16:9推奨 · 最大5MB", clickToUpload:"クリックしてアップロード", clickToChange:"クリックして変更", infoSection:"トークン情報", nameLabel:"トークン名", namePlaceholder:"例：Navorix Coin", nameHint:"最大32文字", tickerLabel:"ティッカー / シンボル", tickerPlaceholder:"例：NVR", tickerHint:"大文字英数字のみ（最大10文字）", descLabel:"説明", descPlaceholder:"コミュニティへトークンを説明...", socialSection:"ソーシャルリンク", paramsSection:"トークンパラメータ", decimalsLabel:"小数点桁数", decimalsHint:"トークンの最小単位を定義", supplyLabel:"総供給量", supplyHint:"鋳造するトークン数", integerToken:"整数トークン（小数なし）", solanaDefault:"Solanaデフォルト（USDCと同様）", highPrecision:"高精度（SOLと同様）", customValue:"カスタム値を入力...", currentSupply:"現在の供給量：", initialBuy:"初期購入", optional:"オプション", initialBuyDesc:"ローンチ前に自分のトークンを購入", launchRate:"ローンチレート：", tenPctSupply:"（供給量の10%）。", firstBuyer:"あなたが最初の買い手です — 最大価格優位性。", quickValues:"クイック選択", youWillReceive:"受け取り数量", ofSupply:"供給量の", skipBuy:"初期購入をスキップ →", raydiumMin:"最低0.3 SOLを追加", raydiumMinDesc:"プールを作成してRaydiumに自動上場するために。", costSummary:"コスト概要", platformFee:"作成手数料（プラットフォーム）", gasFee:"推定ガス代（Solanaネットワーク）", total:"合計", insufficientBalance:"残高不足", connectWallet:"ウォレット接続", createButton:"Solanaで{symbol}を作成", createWithBuy:"{symbol}を作成 · {sol} SOLを購入", immutableNote:"作成後はデータ変更不可 · 手数料：0.02 SOL", uploading:"画像アップロード中...", metadata:"Arweaveメタデータ", mintingSolana:"Solanaミント", onChainMeta:"オンチェーンメタデータ", creatingPool:"Raydiumプール", savingDb:"マーケットプレイス", dontClose:"このウィンドウを閉じないでください", success:"トークン作成完了！🎉", successBought:"初期購入で{amount} ${symbol}を取得しました。", viewMarketplace:"マーケットプレイスで見る", createAnother:"別のトークンを作成", failed:"作成失敗", tryAgain:"再試行", walletRequired:"ウォレットを接続してください", walletRequiredDesc:"Phantom、Solflare、またはその他のSolanaウォレット。" },
  trade: { buy:"購入", sell:"売却", youPay:"支払い（SOL）", youSell:"売却（{symbol}）", youReceive:"受け取り", priceImpact:"価格影響", fee:"Raydium手数料", minReceived:"最低受取額", slippage:"スリッページ：", noLiquidity:"利用可能な流動性なし", buying:"購入中...", selling:"売却中...", confirmed:"最後のトランザクションが確認されました", lastTx:"最後のトランザクション" },
  portfolio: { title:"ポートフォリオ", subtitle:"SOL残高、トークン、取引履歴。", connectTitle:"ウォレットを接続してください", connectDesc:"SOL残高、トークン、取引履歴を確認。", solBalance:"SOL残高", tokenHoldings:"ウォレット内トークン", noTokens:"SPLトークンが見つかりません。", buyOnMarket:"マーケットで購入", tradeHistory:"取引履歴", viewJson:"JSONで見る", refresh:"更新", wallet:"ウォレット" },
  pools: { title:"流動性プール", subtitle:"SOL+トークンの流動性を提供し、すべての取引で1%を獲得。", howItWorks:"仕組み：", howItWorksDesc:"プールは定積AMM（x × y = k）を使用します。", addLP:"LP追加", trade:"取引", noPools:"プールなし。トークンを作成してプールを自動デプロイ。", liquidity:"流動性", volume24h:"24h量", fee:"手数料", price24h:"24h価格", solReserve:"SOL準備金" },
  trending: { title:"現在のトレンド", subtitle:"取引量、時価総額成長率、モメンタムによるトップトークン。", token:"トークン", price:"価格", change24:"24時間", marketCap:"時価総額", volume24:"24h量" },
  common: { loading:"読み込み中...", error:"エラー", notFound:"見つかりません", back:"戻る", viewAll:"すべて見る", createdAgo:"作成", copy:"コピー", solscan:"Solscan", explorer:"エクスプローラー", about:"について", terms:"利用規約", devnet:"テストネット", mainnet:"メインネット" },
  error: { title:"エラーが発生しました", desc:"ページの読み込み中にエラーが発生しました。下をクリックしてクリアして再試行してください。", button:"クリアして再読み込み", fallback:"問題が解決しない場合は、シークレットモードで開くかサイトデータを消去してください。" },
};

// ─────────────────────────────────────────────────────────────
//  한국어 (KOREAN)
// ─────────────────────────────────────────────────────────────
const ko: Translations = {
  nav: { dashboard:"대시보드", tokens:"토큰", trending:"트렌딩", create:"만들기", pools:"풀", portfolio:"포트폴리오" },
  wallet: { connect:"지갑 연결", connecting:"연결 중...", disconnect:"연결 해제", connected:"연결됨", copyAddress:"주소 복사", copied:"복사됨!", viewOnSolscan:"Solscan에서 보기", chooseWallet:"지갑 선택", detected:"감지됨", installExtension:"확장 프로그램 설치", openApp:"앱 열기", neverAskSeed:"Navorix는 시드 문구를 요청하지 않습니다." },
  hero: { badge:"Solana 기반", title1:"프리미어", title2:"Solana 런치패드", subtitle:"SPL 토큰을 만들고, 밈코인을 거래하고, 유동성을 제공하고, 다음 100배 코인을 발견하세요.", createToken:"토큰 만들기", explore:"토큰 탐색" },
  stats: { totalTokens:"총 토큰", totalLiquidity:"총 유동성", volume24h:"24시간 거래량", activeTraders:"활성 트레이더", loading:"로딩 중..." },
  tokenCard: { marketCap:"시가총액", liquidity:"유동성", volume24h:"24h 거래량", holders:"홀더" },
  marketplace: { title:"토큰 마켓플레이스", subtitle:"Solana 블록체인에서 SPL 토큰을 발견, 구매, 판매하세요.", searchPlaceholder:"이름, 티커 또는 민트로 검색...", hot:"🔥 인기", new:"✨ 신규", cap:"💰 시총", vol:"📊 거래량", noTokens:"토큰을 찾을 수 없습니다.", noResults:'"{q}"와 일치하는 토큰 없음', retry:"다시 시도" },
  create: { title:"SPL 토큰 만들기", subtitle:"코드 없이 Solana에서 밈코인 또는 유틸리티 토큰을 출시하세요.", mediaSection:"미디어", logoLabel:"토큰 로고", logoHint:"PNG, JPG, GIF · 1:1 권장 · 최대 15MB", bannerLabel:"배너", bannerHint:"16:9 권장 · 최대 5MB", clickToUpload:"클릭하여 업로드", clickToChange:"클릭하여 변경", infoSection:"토큰 정보", nameLabel:"토큰 이름", namePlaceholder:"예: Navorix Coin", nameHint:"최대 32자", tickerLabel:"티커 / 심볼", tickerPlaceholder:"예: NVR", tickerHint:"대문자 및 숫자만 (최대 10자)", descLabel:"설명", descPlaceholder:"커뮤니티에 토큰을 설명하세요...", socialSection:"소셜 링크", paramsSection:"토큰 매개변수", decimalsLabel:"소수점", decimalsHint:"토큰의 최소 단위 정의", supplyLabel:"총 공급량", supplyHint:"발행할 토큰 수", integerToken:"정수 토큰 (소수점 없음)", solanaDefault:"Solana 기본값 (USDC처럼)", highPrecision:"고정밀 (SOL처럼)", customValue:"또는 사용자 정의 값 입력...", currentSupply:"현재 공급량:", initialBuy:"초기 구매", optional:"선택", initialBuyDesc:"출시 전 자신의 토큰 구매", launchRate:"출시 요율:", tenPctSupply:"(공급량의 10%).", firstBuyer:"첫 번째 구매자입니다 — 최대 가격 이점.", quickValues:"빠른 선택", youWillReceive:"받게 됩니다", ofSupply:"공급량의", skipBuy:"초기 구매 건너뛰기 →", raydiumMin:"최소 0.3 SOL 추가", raydiumMinDesc:"풀을 만들고 Raydium에 자동으로 등록하려면.", costSummary:"비용 요약", platformFee:"생성 수수료 (플랫폼)", gasFee:"예상 가스비 (Solana 네트워크)", total:"합계", insufficientBalance:"잔액 부족", connectWallet:"지갑 연결", createButton:"Solana에서 {symbol} 만들기", createWithBuy:"{symbol} 만들기 · {sol} SOL 구매", immutableNote:"생성 후 데이터 변경 불가 · 수수료: 0.02 SOL", uploading:"이미지 업로드 중...", metadata:"Arweave 메타데이터", mintingSolana:"Solana 민트", onChainMeta:"온체인 메타데이터", creatingPool:"Raydium 풀", savingDb:"마켓플레이스", dontClose:"이 창을 닫지 마세요", success:"토큰 생성 완료! 🎉", successBought:"초기 구매에서 {amount} ${symbol}을 받았습니다.", viewMarketplace:"마켓플레이스에서 보기", createAnother:"다른 토큰 만들기", failed:"생성 실패", tryAgain:"다시 시도", walletRequired:"지갑을 연결하세요", walletRequiredDesc:"Phantom, Solflare 또는 기타 Solana 지갑." },
  trade: { buy:"구매", sell:"판매", youPay:"지불 (SOL)", youSell:"판매 ({symbol})", youReceive:"받기", priceImpact:"가격 영향", fee:"Raydium 수수료", minReceived:"최소 수령", slippage:"슬리피지:", noLiquidity:"사용 가능한 유동성 없음", buying:"구매 중...", selling:"판매 중...", confirmed:"마지막 거래 확인됨", lastTx:"마지막 거래" },
  portfolio: { title:"포트폴리오", subtitle:"SOL 잔액, 토큰 및 거래 내역.", connectTitle:"지갑을 연결하세요", connectDesc:"SOL 잔액, 토큰 및 거래 내역을 확인하세요.", solBalance:"SOL 잔액", tokenHoldings:"지갑 토큰", noTokens:"SPL 토큰을 찾을 수 없습니다.", buyOnMarket:"마켓에서 구매", tradeHistory:"거래 내역", viewJson:"JSON 보기", refresh:"새로고침", wallet:"지갑" },
  pools: { title:"유동성 풀", subtitle:"SOL + 토큰 유동성을 제공하고 모든 거래에서 1%를 받으세요.", howItWorks:"작동 방식:", howItWorksDesc:"풀은 상수 곱 AMM (x × y = k)을 사용합니다.", addLP:"LP 추가", trade:"거래", noPools:"풀 없음. 토큰을 만들면 자동으로 풀이 배포됩니다.", liquidity:"유동성", volume24h:"24h 거래량", fee:"수수료", price24h:"24h 가격", solReserve:"SOL 보유량" },
  trending: { title:"현재 트렌딩", subtitle:"거래량, 시총 성장, 모멘텀 기준 상위 토큰.", token:"토큰", price:"가격", change24:"24h", marketCap:"시가총액", volume24:"24h 거래량" },
  common: { loading:"로딩 중...", error:"오류", notFound:"찾을 수 없음", back:"뒤로", viewAll:"전체 보기", createdAgo:"생성됨", copy:"복사", solscan:"Solscan", explorer:"익스플로러", about:"소개", terms:"이용약관", devnet:"개발넷", mainnet:"메인넷" },
  error: { title:"오류가 발생했습니다", desc:"페이지 로딩 중 오류가 발생했습니다. 아래 버튼을 클릭하여 초기화하고 다시 시도하세요.", button:"초기화 및 새로고침", fallback:"문제가 계속되면 시크릿 모드에서 열거나 사이트 데이터를 삭제하세요." },
};

// ─────────────────────────────────────────────────────────────
//  РУССКИЙ (RUSSIAN)
// ─────────────────────────────────────────────────────────────
const ru: Translations = {
  nav: { dashboard:"Панель", tokens:"Токены", trending:"Тренды", create:"Создать", pools:"Пулы", portfolio:"Портфель" },
  wallet: { connect:"Подключить кошелёк", connecting:"Подключение...", disconnect:"Отключить", connected:"Подключён", copyAddress:"Копировать адрес", copied:"Скопировано!", viewOnSolscan:"Смотреть в Solscan", chooseWallet:"Выбрать кошелёк", detected:"Обнаружен", installExtension:"Установить расширение", openApp:"Открыть приложение", neverAskSeed:"Navorix никогда не запрашивает сид-фразу." },
  hero: { badge:"Построено на Solana", title1:"Ведущий", title2:"Лончпад Solana", subtitle:"Создавайте SPL токены, торгуйте мем-коинами, предоставляйте ликвидность и находите следующий лунный токен.", createToken:"Создать токен", explore:"Исследовать токены" },
  stats: { totalTokens:"Всего токенов", totalLiquidity:"Общая ликвидность", volume24h:"Объём за 24ч", activeTraders:"Активные трейдеры", loading:"Загрузка..." },
  tokenCard: { marketCap:"Рыноч. кап.", liquidity:"Ликвидность", volume24h:"Объём 24ч", holders:"Держатели" },
  marketplace: { title:"Рынок токенов", subtitle:"Откройте, купите и продайте SPL токены в блокчейне Solana.", searchPlaceholder:"Поиск по имени, тикеру или адресу...", hot:"🔥 Горячие", new:"✨ Новые", cap:"💰 Кап.", vol:"📊 Объём", noTokens:"Токены не найдены.", noResults:'Нет токенов, соответствующих "{q}"', retry:"Повторить" },
  create: { title:"Создать SPL токен", subtitle:"Запустите свой мем-коин или утилитарный токен в Solana. Без кода.", mediaSection:"Медиа", logoLabel:"Логотип токена", logoHint:"PNG, JPG, GIF · 1:1 рекомендуется · макс 15МБ", bannerLabel:"Баннер", bannerHint:"16:9 рекомендуется · макс 5МБ", clickToUpload:"Нажмите для загрузки", clickToChange:"Нажмите для изменения", infoSection:"Информация о токене", nameLabel:"Название токена", namePlaceholder:"напр.: Navorix Coin", nameHint:"Максимум 32 символа", tickerLabel:"Тикер / Символ", tickerPlaceholder:"напр.: NVR", tickerHint:"Только заглавные буквы и цифры (макс 10)", descLabel:"Описание", descPlaceholder:"Опишите свой токен сообществу...", socialSection:"Социальные ссылки", paramsSection:"Параметры токена", decimalsLabel:"Знаки после запятой", decimalsHint:"Определяет минимальную единицу токена", supplyLabel:"Общий объём", supplyHint:"Количество токенов для чеканки", integerToken:"Целый токен (без дробей)", solanaDefault:"Стандарт Solana (как USDC)", highPrecision:"Высокая точность (как SOL)", customValue:"Или введите своё значение...", currentSupply:"Текущий объём:", initialBuy:"Начальная покупка", optional:"необязательно", initialBuyDesc:"Купите свои токены до запуска", launchRate:"Курс запуска:", tenPctSupply:"(10% объёма).", firstBuyer:"Вы первый покупатель — максимальное ценовое преимущество.", quickValues:"Быстрые значения", youWillReceive:"Вы получите", ofSupply:"объёма", skipBuy:"Пропустить начальную покупку →", raydiumMin:"Добавьте минимум 0.3 SOL", raydiumMinDesc:"для создания пула и автоматического листинга на Raydium.", costSummary:"Сводка расходов", platformFee:"Комиссия создания (платформа)", gasFee:"Оценочный газ (сеть Solana)", total:"Итого", insufficientBalance:"Недостаточный баланс", connectWallet:"Подключить кошелёк", createButton:"Создать {symbol} в Solana", createWithBuy:"Создать {symbol} · Купить {sol} SOL", immutableNote:"Данные неизменны после создания · Комиссия: 0.02 SOL", uploading:"Загрузка изображения...", metadata:"Метаданные Arweave", mintingSolana:"Чеканка Solana", onChainMeta:"Метаданные on-chain", creatingPool:"Пул Raydium", savingDb:"Маркетплейс", dontClose:"Не закрывайте это окно", success:"Токен создан! 🎉", successBought:"Вы купили {amount} ${symbol} при начальной покупке.", viewMarketplace:"Смотреть на маркетплейсе", createAnother:"Создать ещё токен", failed:"Создание не удалось", tryAgain:"Попробовать снова", walletRequired:"Подключите кошелёк", walletRequiredDesc:"Phantom, Solflare или любой другой кошелёк Solana." },
  trade: { buy:"Купить", sell:"Продать", youPay:"Вы платите (SOL)", youSell:"Вы продаёте ({symbol})", youReceive:"Вы получите", priceImpact:"Влияние на цену", fee:"Комиссия Raydium", minReceived:"Минимум к получению", slippage:"Проскальзывание:", noLiquidity:"Ликвидность недоступна", buying:"Покупка...", selling:"Продажа...", confirmed:"Последняя транзакция подтверждена", lastTx:"Последняя транзакция" },
  portfolio: { title:"Портфель", subtitle:"Баланс SOL, токены и история сделок.", connectTitle:"Подключите кошелёк", connectDesc:"Просматривайте баланс SOL, токены и историю сделок.", solBalance:"Баланс SOL", tokenHoldings:"Токены в кошельке", noTokens:"SPL токены не найдены.", buyOnMarket:"Купить на маркетплейсе", tradeHistory:"История сделок", viewJson:"Смотреть JSON", refresh:"Обновить", wallet:"Кошелёк" },
  pools: { title:"Пулы ликвидности", subtitle:"Предоставляйте ликвидность SOL + токен и зарабатывайте 1% с каждой сделки.", howItWorks:"Как это работает:", howItWorksDesc:"Пулы используют AMM с постоянным произведением (x × y = k).", addLP:"Добавить LP", trade:"Торговать", noPools:"Пулов нет. Создайте токен для автоматического развёртывания пула.", liquidity:"Ликвидность", volume24h:"Объём 24ч", fee:"Комиссия", price24h:"Цена 24ч", solReserve:"Резерв SOL" },
  trending: { title:"Сейчас в тренде", subtitle:"Топ токены по объёму, росту рыноч. капитализации и импульсу.", token:"Токен", price:"Цена", change24:"24ч", marketCap:"Рыноч. кап.", volume24:"Объём 24ч" },
  common: { loading:"Загрузка...", error:"Ошибка", notFound:"Не найдено", back:"Назад", viewAll:"Смотреть все", createdAgo:"Создано", copy:"Копировать", solscan:"Solscan", explorer:"Обозреватель", about:"О нас", terms:"Условия", devnet:"девнет", mainnet:"мейннет" },
  error: { title:"Что-то пошло не так", desc:"При загрузке страницы произошла ошибка. Нажмите кнопку ниже для сброса.", button:"Очистить и перезагрузить", fallback:"Если проблема не решается, попробуйте режим инкогнито или очистите данные сайта." },
};

// ─────────────────────────────────────────────────────────────
//  DEUTSCH (GERMAN)
// ─────────────────────────────────────────────────────────────
const de: Translations = {
  nav: { dashboard:"Dashboard", tokens:"Token", trending:"Trends", create:"Erstellen", pools:"Pools", portfolio:"Portfolio" },
  wallet: { connect:"Wallet verbinden", connecting:"Verbinde...", disconnect:"Trennen", connected:"Verbunden", copyAddress:"Adresse kopieren", copied:"Kopiert!", viewOnSolscan:"Bei Solscan ansehen", chooseWallet:"Wallet auswählen", detected:"Erkannt", installExtension:"Erweiterung installieren", openApp:"App öffnen", neverAskSeed:"Navorix fragt nie nach Ihrer Seed-Phrase." },
  hero: { badge:"Auf Solana gebaut", title1:"Die führende", title2:"Solana Launchpad", subtitle:"Erstelle SPL-Token, handle Meme-Coins, stelle Liquidität bereit und entdecke den nächsten Moonshot.", createToken:"Token erstellen", explore:"Token erkunden" },
  stats: { totalTokens:"Gesamte Token", totalLiquidity:"Gesamtliquidität", volume24h:"24h-Volumen", activeTraders:"Aktive Trader", loading:"Laden..." },
  tokenCard: { marketCap:"Marktkapitalisierung", liquidity:"Liquidität", volume24h:"24h-Volumen", holders:"Inhaber" },
  marketplace: { title:"Token-Marktplatz", subtitle:"Entdecke, kaufe und verkaufe SPL-Token auf der Solana-Blockchain.", searchPlaceholder:"Nach Name, Ticker oder Mint suchen...", hot:"🔥 Heiß", new:"✨ Neu", cap:"💰 Kap.", vol:"📊 Vol.", noTokens:"Keine Token gefunden.", noResults:'Keine Token für "{q}"', retry:"Wiederholen" },
  create: { title:"SPL-Token erstellen", subtitle:"Starte deinen eigenen Meme-Coin oder Utility-Token auf Solana. Ohne Code.", mediaSection:"Medien", logoLabel:"Token-Logo", logoHint:"PNG, JPG, GIF · 1:1 empfohlen · max 15MB", bannerLabel:"Banner", bannerHint:"16:9 empfohlen · max 5MB", clickToUpload:"Zum Hochladen klicken", clickToChange:"Zum Ändern klicken", infoSection:"Token-Informationen", nameLabel:"Token-Name", namePlaceholder:"z.B.: Navorix Coin", nameHint:"Maximal 32 Zeichen", tickerLabel:"Ticker / Symbol", tickerPlaceholder:"z.B.: NVR", tickerHint:"Nur Großbuchstaben und Zahlen (max 10)", descLabel:"Beschreibung", descPlaceholder:"Beschreibe deinen Token der Community...", socialSection:"Soziale Links", paramsSection:"Token-Parameter", decimalsLabel:"Dezimalstellen", decimalsHint:"Definiert die kleinste Einheit des Tokens", supplyLabel:"Gesamtangebot", supplyHint:"Anzahl der zu prägenden Token", integerToken:"Ganzzahliger Token (ohne Bruchteile)", solanaDefault:"Solana-Standard (wie USDC)", highPrecision:"Hohe Präzision (wie SOL)", customValue:"Oder benutzerdefinierten Wert eingeben...", currentSupply:"Aktuelles Angebot:", initialBuy:"Erstkauf", optional:"optional", initialBuyDesc:"Kaufe deine Token vor dem Launch", launchRate:"Launch-Rate:", tenPctSupply:"(10% des Angebots).", firstBuyer:"Du bist der erste Käufer — maximaler Preisvorteil.", quickValues:"Schnellwahl", youWillReceive:"Du erhältst", ofSupply:"des Angebots", skipBuy:"Erstkauf überspringen →", raydiumMin:"Mindestens 0,3 SOL hinzufügen", raydiumMinDesc:"um den Pool zu erstellen und automatisch bei Raydium zu listen.", costSummary:"Kostenübersicht", platformFee:"Erstellungsgebühr (Plattform)", gasFee:"Geschätzte Gas-Gebühr (Solana-Netzwerk)", total:"Gesamt", insufficientBalance:"Unzureichendes Guthaben", connectWallet:"Wallet verbinden", createButton:"{symbol} auf Solana erstellen", createWithBuy:"{symbol} erstellen · {sol} SOL kaufen", immutableNote:"Daten sind nach Erstellung unveränderlich · Gebühr: 0,02 SOL", uploading:"Bild hochladen...", metadata:"Arweave-Metadaten", mintingSolana:"Solana-Mint", onChainMeta:"On-Chain-Metadaten", creatingPool:"Raydium-Pool", savingDb:"Marktplatz", dontClose:"Dieses Fenster nicht schließen", success:"Token erstellt! 🎉", successBought:"Du hast {amount} ${symbol} beim Erstkauf erworben.", viewMarketplace:"Im Marktplatz ansehen", createAnother:"Weiteren Token erstellen", failed:"Erstellung fehlgeschlagen", tryAgain:"Erneut versuchen", walletRequired:"Wallet verbinden", walletRequiredDesc:"Phantom, Solflare oder ein anderes Solana-Wallet." },
  trade: { buy:"Kaufen", sell:"Verkaufen", youPay:"Du zahlst (SOL)", youSell:"Du verkaufst ({symbol})", youReceive:"Du erhältst", priceImpact:"Preisauswirkung", fee:"Raydium-Gebühr", minReceived:"Mindesterhalt", slippage:"Slippage:", noLiquidity:"Keine Liquidität verfügbar", buying:"Kaufe...", selling:"Verkaufe...", confirmed:"Letzte Transaktion bestätigt", lastTx:"Letzte Transaktion" },
  portfolio: { title:"Portfolio", subtitle:"SOL-Guthaben, Token und Transaktionsverlauf.", connectTitle:"Wallet verbinden", connectDesc:"SOL-Guthaben, Token und Verlauf anzeigen.", solBalance:"SOL-Guthaben", tokenHoldings:"Wallet-Token", noTokens:"Keine SPL-Token gefunden.", buyOnMarket:"Auf Marktplatz kaufen", tradeHistory:"Handelsverlauf", viewJson:"JSON ansehen", refresh:"Aktualisieren", wallet:"Wallet" },
  pools: { title:"Liquiditätspools", subtitle:"Stelle SOL + Token Liquidität bereit und verdiene 1% bei jedem Trade.", howItWorks:"So funktioniert es:", howItWorksDesc:"Pools verwenden konstantes Produkt AMM (x × y = k).", addLP:"LP hinzufügen", trade:"Handeln", noPools:"Keine Pools. Token erstellen, um Pool automatisch zu deployen.", liquidity:"Liquidität", volume24h:"24h-Volumen", fee:"Gebühr", price24h:"24h-Preis", solReserve:"SOL-Reserve" },
  trending: { title:"Aktuell im Trend", subtitle:"Top-Token nach Volumen, Marktkapitalisierungswachstum und Momentum.", token:"Token", price:"Preis", change24:"24h", marketCap:"Marktkapitalisierung", volume24:"24h-Volumen" },
  common: { loading:"Laden...", error:"Fehler", notFound:"Nicht gefunden", back:"Zurück", viewAll:"Alle ansehen", createdAgo:"Erstellt", copy:"Kopieren", solscan:"Solscan", explorer:"Explorer", about:"Über uns", terms:"Nutzungsbedingungen", devnet:"Devnet", mainnet:"Mainnet" },
  error: { title:"Etwas ist schiefgelaufen", desc:"Beim Laden der Seite ist ein Fehler aufgetreten. Klicke unten, um zu bereinigen und es erneut zu versuchen.", button:"Bereinigen und Neu laden", fallback:"Falls das Problem weiterhin besteht, öffne im Inkognito-Modus oder lösche die Website-Daten." },
};

// ─────────────────────────────────────────────────────────────
//  FRANÇAIS (FRENCH)
// ─────────────────────────────────────────────────────────────
const fr: Translations = {
  nav: { dashboard:"Tableau de bord", tokens:"Tokens", trending:"Tendances", create:"Créer", pools:"Pools", portfolio:"Portefeuille" },
  wallet: { connect:"Connecter Portefeuille", connecting:"Connexion...", disconnect:"Déconnecter", connected:"Connecté", copyAddress:"Copier l'adresse", copied:"Copié !", viewOnSolscan:"Voir sur Solscan", chooseWallet:"Choisir un portefeuille", detected:"Détecté", installExtension:"Installer l'extension", openApp:"Ouvrir l'app", neverAskSeed:"Navorix ne demande jamais votre phrase de récupération." },
  hero: { badge:"Construit sur Solana", title1:"La Première", title2:"Launchpad Solana", subtitle:"Créez des tokens SPL, tradez des meme coins, fournissez de la liquidité et découvrez le prochain moonshot.", createToken:"Créer un Token", explore:"Explorer les Tokens" },
  stats: { totalTokens:"Total des Tokens", totalLiquidity:"Liquidité Totale", volume24h:"Volume 24h", activeTraders:"Traders Actifs", loading:"Chargement..." },
  tokenCard: { marketCap:"Capitalisation", liquidity:"Liquidité", volume24h:"Volume 24h", holders:"Détenteurs" },
  marketplace: { title:"Marché de Tokens", subtitle:"Découvrez, achetez et vendez des tokens SPL sur la blockchain Solana.", searchPlaceholder:"Rechercher par nom, ticker ou adresse...", hot:"🔥 Chaud", new:"✨ Nouveau", cap:"💰 Cap.", vol:"📊 Vol.", noTokens:"Aucun token trouvé.", noResults:'Aucun token correspondant à "{q}"', retry:"Réessayer" },
  create: { title:"Créer un Token SPL", subtitle:"Lancez votre propre meme coin ou token utilitaire sur Solana. Sans code.", mediaSection:"Médias", logoLabel:"Logo du Token", logoHint:"PNG, JPG, GIF · 1:1 recommandé · max 15Mo", bannerLabel:"Bannière", bannerHint:"16:9 recommandé · max 5Mo", clickToUpload:"Cliquer pour télécharger", clickToChange:"Cliquer pour changer", infoSection:"Informations sur le Token", nameLabel:"Nom du Token", namePlaceholder:"ex : Navorix Coin", nameHint:"Maximum 32 caractères", tickerLabel:"Ticker / Symbole", tickerPlaceholder:"ex : NVR", tickerHint:"Lettres majuscules et chiffres uniquement (max 10)", descLabel:"Description", descPlaceholder:"Décrivez votre token à la communauté...", socialSection:"Liens Sociaux", paramsSection:"Paramètres du Token", decimalsLabel:"Décimales", decimalsHint:"Définit la plus petite unité du token", supplyLabel:"Offre Totale", supplyHint:"Nombre de tokens à créer", integerToken:"Token entier (sans fraction)", solanaDefault:"Standard Solana (comme USDC)", highPrecision:"Haute précision (comme SOL)", customValue:"Ou entrez une valeur personnalisée...", currentSupply:"Offre actuelle :", initialBuy:"Achat initial", optional:"optionnel", initialBuyDesc:"Achetez vos propres tokens avant le lancement", launchRate:"Taux de lancement :", tenPctSupply:"(10% de l'offre).", firstBuyer:"Vous êtes le premier acheteur — avantage de prix maximal.", quickValues:"Valeurs rapides", youWillReceive:"Vous recevrez", ofSupply:"de l'offre", skipBuy:"Ignorer l'achat initial →", raydiumMin:"Ajoutez au moins 0,3 SOL", raydiumMinDesc:"pour créer le pool et lister automatiquement sur Raydium.", costSummary:"Récapitulatif des coûts", platformFee:"Frais de création (plateforme)", gasFee:"Gas estimé (réseau Solana)", total:"Total", insufficientBalance:"Solde insuffisant", connectWallet:"Connecter Portefeuille", createButton:"Créer {symbol} sur Solana", createWithBuy:"Créer {symbol} · Acheter {sol} SOL", immutableNote:"Les données sont immuables après création · Frais : 0,02 SOL", uploading:"Téléchargement de l'image...", metadata:"Métadonnées Arweave", mintingSolana:"Mint Solana", onChainMeta:"Métadonnées on-chain", creatingPool:"Pool Raydium", savingDb:"Marketplace", dontClose:"Ne fermez pas cette fenêtre", success:"Token Créé ! 🎉", successBought:"Vous avez acheté {amount} ${symbol} lors de l'achat initial.", viewMarketplace:"Voir sur le marketplace", createAnother:"Créer un autre token", failed:"Échec de la création", tryAgain:"Réessayer", walletRequired:"Connectez votre portefeuille", walletRequiredDesc:"Phantom, Solflare ou tout autre portefeuille Solana." },
  trade: { buy:"Acheter", sell:"Vendre", youPay:"Vous payez (SOL)", youSell:"Vous vendez ({symbol})", youReceive:"Vous recevez", priceImpact:"Impact sur le prix", fee:"Frais Raydium", minReceived:"Minimum reçu", slippage:"Glissement :", noLiquidity:"Aucune liquidité disponible", buying:"Achat...", selling:"Vente...", confirmed:"Dernière transaction confirmée", lastTx:"Dernière transaction" },
  portfolio: { title:"Portefeuille", subtitle:"Solde SOL, tokens et historique des trades.", connectTitle:"Connectez votre portefeuille", connectDesc:"Voir solde SOL, tokens et historique.", solBalance:"Solde SOL", tokenHoldings:"Tokens dans le Portefeuille", noTokens:"Aucun token SPL trouvé.", buyOnMarket:"Acheter sur le marketplace", tradeHistory:"Historique des trades", viewJson:"Voir JSON", refresh:"Actualiser", wallet:"Portefeuille" },
  pools: { title:"Pools de Liquidité", subtitle:"Fournissez de la liquidité SOL + token et gagnez 1% sur chaque trade.", howItWorks:"Comment ça marche :", howItWorksDesc:"Les pools utilisent l'AMM à produit constant (x × y = k).", addLP:"Ajouter LP", trade:"Trader", noPools:"Aucun pool. Créez un token pour déployer automatiquement un pool.", liquidity:"Liquidité", volume24h:"Volume 24h", fee:"Frais", price24h:"Prix 24h", solReserve:"Réserve SOL" },
  trending: { title:"Tendances Actuelles", subtitle:"Top tokens par volume, croissance de capitalisation et momentum.", token:"Token", price:"Prix", change24:"24h", marketCap:"Capitalisation", volume24:"Volume 24h" },
  common: { loading:"Chargement...", error:"Erreur", notFound:"Non trouvé", back:"Retour", viewAll:"Voir tout", createdAgo:"Créé", copy:"Copier", solscan:"Solscan", explorer:"Explorateur", about:"À propos", terms:"Conditions", devnet:"devnet", mainnet:"mainnet" },
  error: { title:"Quelque chose s'est mal passé", desc:"Une erreur s'est produite lors du chargement de la page. Cliquez ci-dessous pour effacer et réessayer.", button:"Effacer et Recharger", fallback:"Si le problème persiste, ouvrez en mode incognito ou effacez les données du site." },
};

// ─────────────────────────────────────────────────────────────
//  TÜRKÇE (TURKISH)
// ─────────────────────────────────────────────────────────────
const tr: Translations = {
  nav: { dashboard:"Panel", tokens:"Tokenler", trending:"Trendler", create:"Oluştur", pools:"Havuzlar", portfolio:"Portföy" },
  wallet: { connect:"Cüzdan Bağla", connecting:"Bağlanıyor...", disconnect:"Bağlantıyı Kes", connected:"Bağlı", copyAddress:"Adresi Kopyala", copied:"Kopyalandı!", viewOnSolscan:"Solscan'da Gör", chooseWallet:"Cüzdan Seç", detected:"Tespit Edildi", installExtension:"Uzantı Yükle", openApp:"Uygulamayı Aç", neverAskSeed:"Navorix asla seed phrase'inizi istemez." },
  hero: { badge:"Solana Üzerine İnşa Edildi", title1:"Öncü", title2:"Solana Launchpad'i", subtitle:"SPL token oluşturun, meme coin işlem yapın, likidite sağlayın ve bir sonraki moonshot'u keşfedin.", createToken:"Token Oluştur", explore:"Token Keşfet" },
  stats: { totalTokens:"Toplam Token", totalLiquidity:"Toplam Likidite", volume24h:"24s Hacim", activeTraders:"Aktif Trader'lar", loading:"Yükleniyor..." },
  tokenCard: { marketCap:"Piyasa Değeri", liquidity:"Likidite", volume24h:"24s Hacim", holders:"Sahipler" },
  marketplace: { title:"Token Pazaryeri", subtitle:"Solana blockchain'inde SPL tokenları keşfedin, alın ve satın.", searchPlaceholder:"İsim, ticker veya mint ile ara...", hot:"🔥 Popüler", new:"✨ Yeni", cap:"💰 Değer", vol:"📊 Hacim", noTokens:"Token bulunamadı.", noResults:'"{q}" ile eşleşen token yok', retry:"Tekrar Dene" },
  create: { title:"SPL Token Oluştur", subtitle:"Solana'da kendi meme coin'inizi veya yardımcı tokenınızı başlatın. Kod gerektirmez.", mediaSection:"Medya", logoLabel:"Token Logosu", logoHint:"PNG, JPG, GIF · 1:1 önerilir · maks 15MB", bannerLabel:"Banner", bannerHint:"16:9 önerilir · maks 5MB", clickToUpload:"Yüklemek için tıklayın", clickToChange:"Değiştirmek için tıklayın", infoSection:"Token Bilgileri", nameLabel:"Token Adı", namePlaceholder:"örn: Navorix Coin", nameHint:"Maksimum 32 karakter", tickerLabel:"Ticker / Sembol", tickerPlaceholder:"örn: NVR", tickerHint:"Sadece büyük harf ve rakamlar (maks 10)", descLabel:"Açıklama", descPlaceholder:"Topluluğa tokenınızı açıklayın...", socialSection:"Sosyal Bağlantılar", paramsSection:"Token Parametreleri", decimalsLabel:"Ondalık Basamak", decimalsHint:"Tokenın en küçük birimini tanımlar", supplyLabel:"Toplam Arz", supplyHint:"Basılacak token sayısı", integerToken:"Tam sayı token (kesir yok)", solanaDefault:"Solana varsayılanı (USDC gibi)", highPrecision:"Yüksek hassasiyet (SOL gibi)", customValue:"Veya özel değer girin...", currentSupply:"Mevcut arz:", initialBuy:"İlk Alım", optional:"isteğe bağlı", initialBuyDesc:"Lansmandan önce kendi tokenlarınızı satın alın", launchRate:"Lansman oranı:", tenPctSupply:"(arzın %10'u).", firstBuyer:"İlk alıcısınız — maksimum fiyat avantajı.", quickValues:"Hızlı değerler", youWillReceive:"Alacaksınız", ofSupply:"arz", skipBuy:"İlk alımı atla →", raydiumMin:"En az 0,3 SOL ekleyin", raydiumMinDesc:"havuz oluşturmak ve Raydium'a otomatik listelemek için.", costSummary:"Maliyet özeti", platformFee:"Oluşturma ücreti (platform)", gasFee:"Tahmini gaz (Solana ağı)", total:"Toplam", insufficientBalance:"Yetersiz bakiye", connectWallet:"Cüzdan Bağla", createButton:"Solana'da {symbol} Oluştur", createWithBuy:"{symbol} Oluştur · {sol} SOL Al", immutableNote:"Oluşturulduktan sonra veriler değiştirilemez · Ücret: 0,02 SOL", uploading:"Resim yükleniyor...", metadata:"Arweave meta verileri", mintingSolana:"Solana mint", onChainMeta:"Zincir üstü meta veriler", creatingPool:"Raydium havuzu", savingDb:"Pazaryeri", dontClose:"Bu pencereyi kapatmayın", success:"Token Oluşturuldu! 🎉", successBought:"İlk alımda {amount} ${symbol} aldınız.", viewMarketplace:"Pazaryerinde görüntüle", createAnother:"Başka token oluştur", failed:"Oluşturma başarısız", tryAgain:"Tekrar dene", walletRequired:"Cüzdanınızı bağlayın", walletRequiredDesc:"Phantom, Solflare veya herhangi bir Solana cüzdanı." },
  trade: { buy:"Al", sell:"Sat", youPay:"Ödüyorsunuz (SOL)", youSell:"Satıyorsunuz ({symbol})", youReceive:"Alıyorsunuz", priceImpact:"Fiyat etkisi", fee:"Raydium ücreti", minReceived:"Minimum alınan", slippage:"Kayma:", noLiquidity:"Kullanılabilir likidite yok", buying:"Alınıyor...", selling:"Satılıyor...", confirmed:"Son işlem onaylandı", lastTx:"Son işlem" },
  portfolio: { title:"Portföy", subtitle:"SOL bakiyesi, tokenlar ve işlem geçmişi.", connectTitle:"Cüzdanınızı bağlayın", connectDesc:"SOL bakiyesi, tokenlar ve işlem geçmişini görüntüleyin.", solBalance:"SOL Bakiyesi", tokenHoldings:"Cüzdandaki Tokenlar", noTokens:"SPL token bulunamadı.", buyOnMarket:"Pazaryerinde satın al", tradeHistory:"İşlem geçmişi", viewJson:"JSON görüntüle", refresh:"Yenile", wallet:"Cüzdan" },
  pools: { title:"Likidite Havuzları", subtitle:"SOL + token likiditesi sağlayın ve her işlemde %1 kazanın.", howItWorks:"Nasıl çalışır:", howItWorksDesc:"Havuzlar sabit çarpım AMM kullanır (x × y = k).", addLP:"LP Ekle", trade:"İşlem Yap", noPools:"Henüz havuz yok. Otomatik havuz dağıtımı için token oluşturun.", liquidity:"Likidite", volume24h:"24s Hacim", fee:"Ücret", price24h:"24s Fiyat", solReserve:"SOL Rezervi" },
  trending: { title:"Şu An Trend Olanlar", subtitle:"Hacim, piyasa değeri büyümesi ve momentuma göre en iyi tokenlar.", token:"Token", price:"Fiyat", change24:"24s", marketCap:"Piyasa Değeri", volume24:"24s Hacim" },
  common: { loading:"Yükleniyor...", error:"Hata", notFound:"Bulunamadı", back:"Geri", viewAll:"Tümünü gör", createdAgo:"Oluşturuldu", copy:"Kopyala", solscan:"Solscan", explorer:"Explorer", about:"Hakkında", terms:"Şartlar", devnet:"devnet", mainnet:"mainnet" },
  error: { title:"Bir şeyler yanlış gitti", desc:"Sayfa yüklenirken bir hata oluştu. Temizlemek ve tekrar denemek için aşağıya tıklayın.", button:"Temizle ve Yenile", fallback:"Sorun devam ederse gizli modda açın veya site verilerini temizleyin." },
};

// ─────────────────────────────────────────────────────────────
//  EXPORT MAP
// ─────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Translations> = {
  "pt-BR": ptBR,
  en,
  es,
  zh,
  ja,
  ko,
  ru,
  de,
  fr,
  tr,
};

export const LANG_LABELS: Record<LangCode, string> = {
  "pt-BR": "Português",
  en:      "English",
  es:      "Español",
  zh:      "中文",
  ja:      "日本語",
  ko:      "한국어",
  ru:      "Русский",
  de:      "Deutsch",
  fr:      "Français",
  tr:      "Türkçe",
};

export const LANG_FLAGS: Record<LangCode, string> = {
  "pt-BR": "🇧🇷",
  en:      "🇺🇸",
  es:      "🇪🇸",
  zh:      "🇨🇳",
  ja:      "🇯🇵",
  ko:      "🇰🇷",
  ru:      "🇷🇺",
  de:      "🇩🇪",
  fr:      "🇫🇷",
  tr:      "🇹🇷",
};

/**
 * Auto-detect the best language from navigator.language.
 * Defaults to "en" if no match found.
 */
export function detectLanguage(): LangCode {
  if (typeof navigator === "undefined") return "en";

  const browserLang = navigator.language?.toLowerCase() ?? "";

  if (browserLang.startsWith("pt"))    return "pt-BR";
  if (browserLang.startsWith("es"))    return "es";
  if (browserLang.startsWith("zh"))    return "zh";
  if (browserLang.startsWith("ja"))    return "ja";
  if (browserLang.startsWith("ko"))    return "ko";
  if (browserLang.startsWith("ru"))    return "ru";
  if (browserLang.startsWith("de"))    return "de";
  if (browserLang.startsWith("fr"))    return "fr";
  if (browserLang.startsWith("tr"))    return "tr";

  return "en";
}
