
const { Resend } = require('resend');
const resend = new Resend('re_XPwJvH59_M1BnnssEZfC1fjLy2RDjhGqy');

async function test() {
  try {
    const data = await resend.emails.send({
      from: 'contact@miterion.com',
      to: 'aplikacjaweb@gmail.com',
      bcc: 'contact@miterion.com',
      subject: 'Direct Resend API Test',
      html: '<strong>Testing direct send from contact@miterion.com</strong>'
    });
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

test();
