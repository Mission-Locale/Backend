import nodemailer from "nodemailer";

class MailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendAdvisorInvitation(email, firstName, lastName, resetToken) {
    const frontendUrl = process.env.FRONTEND_URL;
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Mission Locale" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "Bienvenue à la Mission Locale - Créez votre mot de passe",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue à la Mission Locale</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">Bienvenue à la Mission Locale !</h1>
            
            <p style="text-transform: capitalize;">Bonjour <strong>${firstName} ${lastName}</strong>,</p>
            
            <p>Votre compte conseiller a été créé avec succès. Pour finaliser la configuration de votre compte, veuillez définir votre mot de passe en cliquant sur le bouton ci-dessous :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Créer mon mot de passe
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
              <br>
              <a href="${resetLink}" style="color: #3498db; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #7f8c8d; font-size: 12px;">
              Ce lien est valide pendant 72 heures. Si vous n'avez pas demandé ce compte, veuillez ignorer cet email.
            </p>
            
            <p style="margin-top: 30px;">
              Cordialement,<br>
              <strong>L'équipe de la Mission Locale</strong>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Bonjour ${firstName} ${lastName},

        Votre compte conseiller a été créé avec succès. Pour finaliser la configuration de votre compte, veuillez définir votre mot de passe en cliquant sur le lien suivant :

        ${resetLink}

        Ce lien est valide pendant 72 heures.

        Si vous n'avez pas demandé ce compte, veuillez ignorer cet email.

        Cordialement,
        L'équipe de la Mission Locale
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email envoyé: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  }

  async sendPasswordReset(email, firstName, resetToken) {
    const frontendUrl = process.env.FRONTEND_URL;
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Mission Locale" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe - Mission Locale",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">Réinitialisation de mot de passe</h1>
            
            <p>Bonjour <strong>${firstName}</strong>,</p>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
              <br>
              <a href="${resetLink}" style="color: #3498db; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #7f8c8d; font-size: 12px;">
              Ce lien est valide pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
            </p>
            
            <p style="margin-top: 30px;">
              Cordialement,<br>
              <strong>L'équipe de la Mission Locale</strong>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de mot de passe

        Bonjour ${firstName},

        Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour définir un nouveau mot de passe :

        ${resetLink}

        Ce lien est valide pendant 1 heure.

        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

        Cordialement,
        L'équipe de la Mission Locale
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email envoyé: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  }

  // Vérifie connexion au serveur SMTP
  // async verifyConnection() {
  //   try {
  //     await this.transporter.verify();
  //     console.log("Connexion SMTP vérifiée avec succès");
  //     return true;
  //   } catch (error) {
  //     console.error("Erreur de connexion SMTP:", error);
  //     return false;
  //   }
  // }
}

export default new MailService();
