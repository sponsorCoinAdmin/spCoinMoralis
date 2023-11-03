const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const { MoralisAPIs } = require('./moralis');
const moralisAPIs = new MoralisAPIs();

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req;
  const usdPrices = await moralisAPIs.getPriceRatios(query.addressOne, query.addressTwo)
  // console.log("usdPrices:, usdPrices")
  let respStatus = 200;

  return res.status(respStatus).json(usdPrices);
});

startLocalHostMoralisServer = async(port) => {
  let moralisKey = process.env.REACT_APP_MORALIS_KEY
  // console.log("moralisKey:", moralisKey)
  await moralisAPIs.start(moralisKey);

  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
}

startLocalHostMoralisServer(port)
