let hostConfig = {
    PROTOCOL: 'http',
    HOST: 'localhost',
    PORT: process.env.PORT || 4000,
    FEEDBACK_EMAIL: 'rashminanoti@gmail.com , itsupport06@dinshaws.co.in',
    CAREER_EMAIL: 'rashminanoti@gmail.com, itsupport06@dinshaws.co.in',
    REPLY_TO: 'itsupport06@dinshaws.co.in',
 };

console.log(process.env.NODE_ENV, hostConfig);
module.exports = hostConfig;