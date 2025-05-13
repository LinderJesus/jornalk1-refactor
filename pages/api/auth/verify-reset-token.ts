import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../../utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifica se o token existe e ainda é válido
    const users = await executeQuery<any[]>(
      'SELECT id FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Erro ao verificar token de redefinição:', error);
    return res.status(500).json({ 
      message: 'Erro ao processar sua solicitação. Por favor, tente novamente.' 
    });
  }
}
