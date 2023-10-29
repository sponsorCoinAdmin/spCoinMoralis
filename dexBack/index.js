const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req;
  const usdPrices = {}
  let respStatus = 200;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne})
      .then((rest) =>{ usdPrices.tokenOne = rest.raw.usdPrice;})
        .catch((err) =>{ usdPrices.tokenOneErrMsg = "TokenOne ERROR:" + err;
        respStatus = 401})

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo})
      .then((rest) =>{ usdPrices.tokenTwo = rest.raw.usdPrice; })
        .catch((err) =>{ usdPrices.tokenTwoErrMsg = "TokenTwo ERROR:" + err;
        respStatus = 401})

  usdPrices.status = respStatus;
  if (respStatus === 200)
    usdPrices.ratio = usdPrices.tokenOne/usdPrices.tokenTwo

  return res.status(respStatus).json(usdPrices);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
