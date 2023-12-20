import express from "express";
import cors from "cors";
import request from "request";

const app = express();

app.use(express.json());
app.use(cors());

let imgString;

app.post("/sendData", async (req, res) => {
  const url = req.body.url;
  const auth = req.body.auth;
  const user = req.body.user;
  const password = req.body.password;

  /*console.log(
    `URL: ${url}\nAUTH: ${auth}\nUSERNAME: ${user}\nPASSWORD: ${password}`
  );*/

  try {
    imgString = await catchImageString(url, auth, user, password);
    res.send(imgString);
  } catch (error) {
    console.error(`Erro: ${error}`);
    res.status(500).send("Erro ao processar a requisição.");
  }
});

app.get("/getImage", (req, res) => {
  res.json({
    imagesrc: imgString,
  });
});

const port = 3005;

app.listen(port, () => {
  console.log(`O serviço foi iniciado na porta ${port}`);
});

const catchImageString = (url, auth, user, password) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: url,
      headers: {
        Authorization: auth,
      },
      auth: {
        username: user,
        password: password,
        sendImmediately: false,
      },
    };

    request(options, function (error, response, body) {
      if (error) {
        console.error(`Erro: ${error}`);
        reject(error);
      } else {
        const dados = extrairPhotoData(body);
        resolve(dados);
      }
    });
  });
};

function extrairPhotoData(resposta) {
  const photoData1 = resposta.split("\n");
  const photoData = photoData1[0].split("FaceDataList[0].PhotoData[0]=");

  if (photoData && photoData.length > 1) {
    const stringDaImagem = "data:image/png;base64," + photoData[1];
    return stringDaImagem;
  }

  return null;
}
