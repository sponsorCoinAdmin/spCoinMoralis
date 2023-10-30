const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

import { getMoralisQuote } from "./moralisAPIS";

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req;
  const usdPrices = {}
  let respStatus = 200;

  let quoteRec = await getMoralisQuote(query.addressOne);
  // console.log("quoteRec: " + JSON.stringify(quoteRec,null,2))
  quoteRec.status == 200 ? usdPrices.tokenOne = quoteRec.token :  usdPrices.tokenOneErrMsg = quoteRec.errMsg
  usdPrices.tokenOneStatus = quoteRec.status

  quoteRec = await getMoralisQuote(query.addressTwo);
  // console.log("quoteRec: " + JSON.stringify(quoteRec,null,2))
  quoteRec.status == 200 ? usdPrices.tokenTwo = quoteRec.token :  usdPrices.tokenTwoErrMsg = quoteRec.errMsg
  usdPrices.tokenTwoStatus = quoteRec.status

if (usdPrices.tokenOneStatus === 200 && usdPrices.tokenTwoStatus == 200)
    usdPrices.ratio = usdPrices.tokenOne/usdPrices.tokenTwo

    // console.log("usdPrices: " + JSON.stringify(usdPrices, null, 2))
    return res.status(respStatus).json(usdPrices);
});

const getMoralisQuote = async(addr) => {
  let quoteRec = {}
  await Moralis.EvmApi.token.getTokenPrice({
    address: addr}).then((resp) => {
      quoteRec.token = resp.raw.usdPrice;
      quoteRec.status = 200;
      }).catch((err) => {
        quoteRec.errMsg = "ERROR:" + err;
        quoteRec.status = 401
      })
  return quoteRec
}

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
