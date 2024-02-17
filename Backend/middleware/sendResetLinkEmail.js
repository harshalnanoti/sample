// Import required modules and packages
const jwt = require("jsonwebtoken");
const sendEmails = require("../middleware/init-gmail");
const userModel = require("../models/usersModel");
const logger = require("../middleware/winston");
const host = require("../config/host-config");

// Define an asynchronous function to send a reset password link
async function sendResetPasswordLink(req, res, next, email) {
  try {
    console.log("Step 1: Start sending reset password link");
    // Find user with the specified email in the database
    const user = await userModel.findOne({ email });

    // Check if the user exists in the database
    if (!user) {
      console.log("Step 2: User not found. Returning 404 response.");
      // Instead of sending the response here, you can throw an error
      throw new Error(
        `User with email ${email} is not registered. Please try again or register first.`
      );
    }

    // User found, generate a JWT token for resetting the password
    const token = await jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_RESET_KEY,
      { expiresIn: "2h" }
    );

    // Determine the port for the reset password link based on the host configuration
    let port = "";
    if (host.PORT === "") {
      port = "";
    } else {
      port = ":" + host.PORT;
    }

    // Construct the email options with the reset password link
    const emailOptions = {
      to: user.email,
      cc: "",
      subject: "Task Manager User - Reset your password",
      text: `<h2>Use the link below to reset your password.
             </h2><br><a style="background-color: #66a3ff; 
             color: white; 
             padding: 1em 4em;
             text-decoration:none; 
             border-radius: 10px" 
     href="http://localhost:5173/rechange-password/${token}" 
     target="_blank">
     Click here to reset password.
    </a>
    .<br><br>
             The link is valid only for 2 hours.<br>
             The link will work only once.<br><br>
             <strong>Thanks and Regards,</strong>`,
    };

    // Send the reset password link email
    console.log("Step 3: Sending reset password link email to", user.email);
    sendEmails(emailOptions);

    // Update the user record with the generated reset token
    user.reset_key = token;
    const savedUser = await user.save();

    // Log information about the sent password reset email
    console.log("Step 4: Password Reset Email sent to:", savedUser.email);
    logger.info(`Password Reset Email sent to: ${savedUser.email}`);

    // Return success message
    console.log("Step 5: Reset Link sent on email successfully.");
    return {
      success: true,
      message: "Reset Link sent on email successfully.",
    };
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Step 6: Error during sending reset password link:", error);
    logger.error(error);
    return next(error);
  }
}

// Export the function to make it accessible in other modules
module.exports = sendResetPasswordLink;
