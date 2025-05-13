// Configurações para habilitar o modo de dados mockados
// Essa configuração pode ser alterada no arquivo .env.local
export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || true;

// Flag para logs de debug do modo mock
export const DEBUG_MOCK = process.env.NEXT_PUBLIC_DEBUG_MOCK === 'true' || false;

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ mockMode: MOCK_MODE });
}
