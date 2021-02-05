const fetch = require('node-fetch');

const args = process.argv;

const email = args[2];
const userUrl = 'https://whmcstest.proxy.beeceptor.com/client/';
const invoiceUrl = 'https://whmcstest.proxy.beeceptor.com/invoices/';

const logDetails = ({
  firstname,
  lastname,
  email,
  id,
  status,
  credit,
  lastlogin,
  currency_code,
}) => {
  console.log('==================================================');
  console.log(`${firstname} ${lastname} (${email})`);
  console.log(`ID: ${id}`);
  console.log(`Status: ${status}`);
  console.log(`Credit: ${currency_code} ${credit}`);
  console.log(`Last Login: ${lastlogin.substr(6, 10)}`);
};

const logInvoices = async ({ id }) => {
  try {
    const response = await fetch(`${invoiceUrl}${id}`);
    const userInvoicesResults = await response.json();
    const userInvoices = userInvoicesResults.invoices.invoice;

    console.log('\n', 'Orders');
    console.log('# - InvoiceId - Status - Date - Due_Date - Total');
    userInvoices.forEach(
      ({ id, status, date, duedate, total, currencycode }, index) =>
        console.log(
          `${
            index + 1
          }. ${id} | ${status} | ${date} | ${duedate} | ${currencycode} ${total}`
        )
    );
  } catch {
    console.error(`Failed to retrieve invoices for user with id: ${id}`);
    console.log('See below for more details on the error:');
    console.error(err);
  }
};

fetchUserDetails = async (userUrl, email) => {
  try {
    const response = await fetch(`${userUrl}${email}`);
    const userProfile = await response.json();

    logDetails(userProfile);
    logInvoices(userProfile);
  } catch (err) {
    // handle error
    console.error(`User with email: ${email} cannot be found`);
    console.log('See below for more details on the error:');
    console.error(err);
  }
};

fetchUserDetails(userUrl, email);
