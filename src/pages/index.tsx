import React, { useState } from "react";

export default function Home() {
  const [ip, setIp] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [imgSrc, setImgSrc] = useState("");
  const [aux, setAux] = useState(false);

  const treatSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    const url: string = `http://${ip}/cgi-bin/AccessFace.cgi?action=list&UserIDList[0]=${id}`;
    const auth: any = `Digest ${Buffer.from(`${user}:${password}`).toString(
      "base64"
    )}`;

    console.log(`url: ${url}\nauth: ${auth}`);

    try {
      const sendData = await fetch("http://localhost:3005/sendData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          auth: auth,
          user: user,
          password: password,
        }),
      });

      if (sendData.ok) {
        console.log("Os dados foram enviados com sucesso!");
        changeImage();
      } else {
        throw new Error("Erro ao enviar os dados");
      }
    } catch (error) {
      console.error(`Erro: ${error}`);
    }

    setAux(true);
  };

  const changeImage = async () => {
    await fetch("http://localhost:3005/getImage")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setImgSrc(data.imagesrc);
      })
      .catch((err) => console.log("Erro GET: ", err));
  };

  return (
    <>
      <div className="greatBox">
        <form onSubmit={treatSubmit} className="formBox">
          <div className="divLogo"></div>
          <div>
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              type="text"
              placeholder="IP do equipamento"
            />
          </div>

          <div>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type="text"
              placeholder="Nome de usuário do equipamento"
            />
          </div>

          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Senha do equipamento"
            />
          </div>

          <div>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              type="text"
              placeholder="ID do acionador"
            />
          </div>

          <div>
            <button type="submit">Gerar Imagem</button>
          </div>
        </form>
        <div className="imageBox">
          {aux ? (
            <>
              <div>
                <h3>ID: {id} - Nome do Cidadão</h3>
              </div>
              <img src={imgSrc} alt="faceEncontrada" />
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}
