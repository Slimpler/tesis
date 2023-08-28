import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'nicolasde.oyarce@gmail.com',
    pass: 'xqcuavswavibxajl'
  }
});

// transporter.verify().then(() => {
//   console.log("Listo para enviar correos electrónicos");
// });
