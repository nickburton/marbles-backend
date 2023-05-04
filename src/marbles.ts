import axios from "axios";
import bodyParser from "body-parser";
import express from "express";

interface Marble {
  id: string;
  name: string;
  material: string;
  rarity: string;
  image: string;
}

const marbles: Marble[] = [
  {
    id: "1",
    name: "Marble 1",
    material: "Glass",
    rarity: "Common",
    image: "https://placekitten.com/200/300",
  },
  {
    id: "2",
    name: "Marble 2",
    material: "Agate",
    rarity: "Rare",
    image: "https://placekitten.com/200/300",
  },
  {
    id: "3",
    name: "Marble 3",
    material: "Marble",
    rarity: "Common",
    image: "https://placekitten.com/200/300",
  },
];

const app = express();
app.use(bodyParser.json());

app.get("/marbles", (req, res) => {
  res.send(marbles);
});

app.get("/marbles/:id", (req, res) => {
  const id = req.params.id;
  const marble = marbles.find((marble) => marble.id === id);
  if (marble) {
    res.send(marble);
  } else {
    res.status(404).send({ message: "Marble not found" });
  }
});

app.post("/marbles", (req, res) => {
  const marble: Marble = req.body;
  marbles.push(marble);
  res.status(201).send(marble);
});

app.put("/marbles/:id", (req, res) => {
  const id = req.params.id;
  const updatedMarble: Marble = req.body;
  const index = marbles.findIndex((marble) => marble.id === id);
  if (index === -1) {
    res.status(404).send({ message: "Marble not found" });
  } else {
    marbles[index] = updatedMarble;
    res.send(updatedMarble);
  }
});

app.delete("/marbles/:id", (req, res) => {
  const id = req.params.id;
  const index = marbles.findIndex((marble) => marble.id === id);
  if (index === -1) {
    res.status(404).send({ message: "Marble not found" });
  } else {
    marbles.splice(index, 1);
    res.send({ message: "Marble removed" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

async function uploadToIPFS(data: any) {
  const pinataApiKey = "YOUR_API_KEY";
  const pinataSecretApiKey = "YOUR_SECRET_API_KEY";

  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const response = await axios.post(url, data, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  return response.data.IpfsHash;
}

// Example usage:
const tokenMetadata = {
  name: "My NFT",
  description: "An example NFT",
  image: "https://example.com/nft.jpg",
  properties: {
    rarity: "common",
    color: "blue",
    material: "gold",
  },
};

(async function () {
  const ipfsHash = await uploadToIPFS(tokenMetadata);
  console.log("IPFS hash:", ipfsHash);
})();
