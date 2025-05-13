import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../../utils/db';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
  }

  try {
    // Verifica se o token existe e ainda é válido
    const users = await executeQuery<any[]>(
      'SELECT id, email FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    const user = users[0];
    
    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Atualiza a senha e limpa o token de redefinição
    await executeQuery(
      `UPDATE users 
       SET password = ?, resetToken = NULL, resetTokenExpiry = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    // Aqui você poderia enviar um e-mail de confirmação se desejado
    console.log(`Senha alterada para o usuário: ${user.email}`);

    return res.status(200).json({ 
      message: 'Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.' 
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ 
      message: 'Erro ao processar sua solicitação. Por favor, tente novamente.' 
    });
  }
}
