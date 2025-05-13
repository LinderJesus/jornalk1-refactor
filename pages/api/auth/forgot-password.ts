import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../utils/db';
import crypto from 'crypto';
import { sendEmail } from '../../../utils/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  try {
    // Verifica se o e-mail existe no banco de dados
    const users = await executeQuery<any[]>(
      'SELECT id, name FROM users WHERE email = ?',
      [email]
    );

    // Mesmo que o e-mail não exista, retornamos sucesso para evitar enumeração de e-mails
    if (users.length === 0) {
      console.log(`Tentativa de recuperação para e-mail não cadastrado: ${email}`);
      return res.status(200).json({ 
        message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação' 
      });
    }

    const user = users[0];
    
    // Gera um token de redefinição
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de validade

    // Salva o token no banco de dados
    await executeQuery(
      'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // URL para redefinição de senha
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/redefinir-senha?token=${resetToken}`;

    // Envia o e-mail de recuperação
    try {
      await sendEmail({
        to: email,
        subject: 'Redefinição de Senha - JornalK1',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a365d;">Redefinição de Senha</h2>
            <p>Olá ${user.name},</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no JornalK1.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <div style="margin: 25px 0;">
              <a href="${resetUrl}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #3182ce;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              ">
                Redefinir Senha
              </a>
            </div>
            <p>Se você não solicitou esta redefinição, pode ignorar este e-mail com segurança.</p>
            <p>Este link expirará em 1 hora.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #718096;">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br />
              ${resetUrl}
            </p>
          </div>
        `,
      });

      console.log(`E-mail de recuperação enviado para: ${email}`);
    } catch (emailError) {
      console.error('Erro ao enviar e-mail de recuperação:', emailError);
      return res.status(500).json({ 
        message: 'Erro ao enviar e-mail de recuperação. Por favor, tente novamente mais tarde.' 
      });
    }

    return res.status(200).json({ 
      message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação' 
    });
  } catch (error) {
    console.error('Erro no processo de recuperação de senha:', error);
    return res.status(500).json({ 
      message: 'Erro ao processar sua solicitação. Por favor, tente novamente.' 
    });
  }
}
