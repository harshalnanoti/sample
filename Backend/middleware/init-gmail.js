// Import the nodemailer library for sending emails
const nodemailer = require("nodemailer");
// Import the Winston logger for logging email-related information
const logger = require("../middleware/winston");

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtpoffice365",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "create a smtp user mail id for authentication", // SMTP user for authentication
    pass: "Smtp password for authentication", // SMTP password for authentication
  },
});

// Define an asynchronous function for sending emails with provided mailOptions
async function sendEmails(mailOptions) {
  // Check if mailOptions has all the required properties, if not replace with default options
  const defaultOptions = {
    from: "task manager no reply mail create",
    to: "task manager no reply mail create",
    cc: "",
    bcc: "",
    subject: "Email from Task Manager website ",
    text: "Default text of email from Task Manager website ",
  };
  const normalizedEmailOptions = { ...defaultOptions, ...mailOptions };
  normalizedEmailOptions.html = normalizedEmailOptions.text; // Copy text to add html option also

  // Log normalized email options for debugging
  console.log(normalizedEmailOptions);

  // Send the email using the defined transporter and handle the result
  transporter.sendMail(normalizedEmailOptions, (error, info) => {
    if (error) {
      // Log an error message if sending the email fails
      return logger.error(error);
    }
    // Log a success message with the sent message ID if the email is sent successfully
    return logger.info("Message sent: %s", info.messageId);
  });
}

// Export the sendEmails function to make it accessible in other modules
module.exports = sendEmails;
