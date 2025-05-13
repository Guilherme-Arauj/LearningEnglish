import { IResetPasswordEmail } from "./IResetPasswordEmail";

export class ResetPasswordEmail implements IResetPasswordEmail {
  public generate(url: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Recuperação de Senha</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 20px;
      margin-top: 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .small {
      font-size: 12px;
      color: #666666;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Recuperação de Senha</h2>
    <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha. Este link é válido por tempo limitado e só pode ser usado uma vez.</p>
    
    <a href="${url}" class="button">Redefinir Senha</a>
    
    <p class="small">Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual permanecerá a mesma.</p>
  </div>
</body>
</html>
    `;
  }
}