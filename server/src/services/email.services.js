import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("SendGrid Config:", {
  apiKeyProvided: !!process.env.SENDGRID_API_KEY,
  senderEmail: process.env.SENDGRID_SENDER_EMAIL,
});

export const emailService = {
  async sendWelcomeEmail(to, username) {
    try {
      const msg = {
        to: to,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: "Welcome to Grany's Secret!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <h1 style="color: #4a5568;">Welcome to Grany's Secret!</h1>
            </div>
            <div style="padding: 20px; color: #2d3748; line-height: 1.6;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Thank you for joining our community of food lovers! We're excited to have you on board.</p>
              <p>With Grany's Secret, you can:</p>
              <ul>
                <li>Discover amazing recipes</li>
                <li>Share your own culinary creations</li>
                <li>Connect with other chefs</li>
              </ul>
              <p>Get started by exploring our latest recipes or creating your first one!</p>
              <br/>
              <a href="${process.env.REACT_APP_URL || "http://localhost:3000"}" style="display: inline-block; padding: 10px 20px; background-color: #006400; color: white; text-decoration: none; border-radius: 5px;">Explore Now</a>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
              <p>&copy; ${new Date().getFullYear()} Grany's Secret. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      const response = await sgMail.send(msg);
      console.log("Message sent:", response[0].statusCode);
      return response;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      if (error.response) {
        console.error("SendGrid Error Body:", error.response.body);
      }
      return null;
    }
  },

  async sendPasswordResetEmail(to, resetToken) {
    try {
      const resetUrl = `${process.env.REACT_APP_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

      const msg = {
        to: to,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: "Reset Your Password - Grany's Secret",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <h1 style="color: #4a5568;">Password Reset Request</h1>
            </div>
            <div style="padding: 20px; color: #2d3748; line-height: 1.6;">
              <p>Hi there,</p>
              <p>We received a request to reset your password for your Grany's Secret account.</p>
              <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
              <br/>
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #006400; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
              <br/>
              <br/>
              <p style="color: #718096; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="color: #4299e1; word-break: break-all; font-size: 14px;">${resetUrl}</p>
              <br/>
              <p style="color: #e53e3e; font-size: 14px;"><strong>Important:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
              <p>&copy; ${new Date().getFullYear()} Grany's Secret. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      const response = await sgMail.send(msg);
      console.log("Password reset email sent:", response[0].statusCode);
      return response;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.response) {
        console.error("SendGrid Error Body:", error.response.body);
      }
      throw new Error("Failed to send password reset email");
    }
  },
};
