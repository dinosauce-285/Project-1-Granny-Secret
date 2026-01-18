import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  async sendWelcomeEmail(to, username) {
    try {
      const info = await transporter.sendMail({
        from: `"Grany's Secret" <${process.env.EMAIL_USER}>`,
        to: to,
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
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}" style="display: inline-block; padding: 10px 20px; background-color: #006400; color: white; text-decoration: none; border-radius: 5px;">Explore Now</a>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
              <p>&copy; ${new Date().getFullYear()} Grany's Secret. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return null;
    }
  },
};
