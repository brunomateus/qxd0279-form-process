

import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from 'querystring'

const htmlBoilerPlate = (title: string, body: string) => {
  return `
   <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="teste.css">
    </head>
    <body>
      ${body}
    </body>
    </html>
  `
}


const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req
  console.log(`[LOG] ${method} - ${url}`)

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('charset', 'utf-8')

  if(method == 'GET') {
    if(url == '/formulario.html') {
      res.write(htmlBoilerPlate('Meu formulário', `
        <form action="processar" method="POST">
          <div>
            Login: <input type="text" name="login">
          </div>
          <div>
            Senha: <input type="password" name="password">
          </div>
          <input type="submit">
        </form>
        `)
      )
      
    } else if(url == '/' || url == '/index.html') {
      res.write(htmlBoilerPlate('Página inicial', 
        ` <h1>Oi mundo</h1>
          <a href="formulario.html">Acessar formulário</a>
        `
      ))
    
    } else if(url?.includes('/processar')) {
      const variables = parse(url?.split('?')[1] || '')

      if(!variables.name) {
        res.write(htmlBoilerPlate('Meu formulário', `
          <h1>Voce nao preencheu corretamente</h1>
        <form action="processar" method="POST">
          <div>
            Login: <input type="text" name="login">
          </div>
          <div>
            Senha: <input type="password" name="password">
          </div>
          <input type="submit">
        </form>
        `)
        )
      } else {
      
      res.write(htmlBoilerPlate('Dados enviados', `
        Bem-vindo ${variables.login}
        Você logou com sucesso. Sua senha é ótimo ${variables.password}
      `))
      }
    
    } 
    else {
      res.statusCode = 404
    
    }
  } else {
    if(url?.includes('/processar')) {
      const variables = parse(url?.split('?')[1] || '')

        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }

        const data = Buffer.concat(chunks);
      
      res.write(htmlBoilerPlate('Dados enviados', `
        Bem-vindo ${data.toString()}
      `))
    
    } else {
      res.statusCode = 501
    }
    
  }
  res.end()

});

server.listen(8083, () => {
  console.log("The server is running")
})