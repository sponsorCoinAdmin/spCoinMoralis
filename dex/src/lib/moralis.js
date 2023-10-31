// const Moralis = require("moralis").default;

import Moralis from "moralis";

class MoralisAPIs {
  constructor () {
    this.started = false;
  }

  getMoralisQuote = async(tokenAddr) => {
    // console.log(`EXECUTING getMoralisQuote(${tokenAddr})`)
    let quoteRec = {}
    await Moralis.EvmApi.token.getTokenPrice({
      address: tokenAddr}).then((resp) => {
        quoteRec.token = resp.raw.usdPrice;
        quoteRec.status = 200;
        }).catch((err) => {
          quoteRec.errMsg = "ERROR:" + err;
          quoteRec.status = 401
        })
    return quoteRec
  }
  
  getPriceRatios = async(tokenAddr1, tokenAddr2) => {
    const usdPrices = {}
  
    let quoteRec = await this.getMoralisQuote(tokenAddr1);
    // console.log("quoteRec: " + JSON.stringify(quoteRec, null, 2))
    quoteRec.status === 200 ? usdPrices.tokenOne = quoteRec.token :  usdPrices.tokenOneErrMsg = quoteRec.errMsg
    usdPrices.tokenOneStatus = quoteRec.status
  
    quoteRec = await this.getMoralisQuote(tokenAddr2);
    // console.log("quoteRec: " + JSON.stringify(quoteRec, null, 2))
    quoteRec.status === 200 ? usdPrices.tokenTwo = quoteRec.token :  usdPrices.tokenTwoErrMsg = quoteRec.errMsg
    usdPrices.tokenTwoStatus = quoteRec.status
  
    if (usdPrices.tokenOneStatus === 200 && usdPrices.tokenTwoStatus === 200)
        usdPrices.ratio = usdPrices.tokenOne/usdPrices.tokenTwo
    // console.log("usdPrices: " + JSON.stringify(usdPrices, null, 2))

    return usdPrices;
  }
  
 start = async(apiKey) => {
    await Moralis.start({
      apiKey: apiKey,
    }).then(this.started = true)
  }
}

module.exports = {
  Moralis,
  MoralisAPIs
}
