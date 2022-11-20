require("dotenv").config();
const paystack = require("paystack")(process.env.payStackAPIKey);

exports.initializePay = async function (data) {
  const { amount, email, first_name } = data;
  const result = await paystack.transaction.initialize({
    amount: amount * 100,
    email,
    metadata: {
      first_name,
    },
  });
  return result;
};

exports.verifyPayment = async function (ref) {
  const result = await paystack.transaction.verify(ref);

  return result;
};
