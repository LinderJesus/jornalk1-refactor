import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'user@example.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || 'password',
  },
});

// Função para enviar e-mail
export const sendEmail = async (options: EmailOptions) => {
  try {
    // Se estiver em ambiente de desenvolvimento, apenas logar o e-mail
    if (process.env.NODE_ENV === 'development') {
      console.log('=== E-MAIL DE DESENVOLVIMENTO ===');
      console.log('Para:', options.to);
      console.log('Assunto:', options.subject);
      console.log('Conteúdo HTML:', options.html);
      console.log('===============================');
      return { message: 'E-mail registrado (modo desenvolvimento)' };
    }

    // Configurações do e-mail
    const mailOptions = {
      from: `"JornalK1" <${process.env.EMAIL_FROM || 'noreply@jornalk1.com.br'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ' '), // Versão em texto simples
    };

    // Envia o e-mail
    const info = await transporter.sendMail(mailOptions);
    
    console.log('E-mail enviado:', info.messageId);
    return { messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Falha ao enviar e-mail');
  }
};
