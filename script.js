const fetch = require('node-fetch');

const args = process.argv;

const email = args[2];
const userUrl = 'https://whmcstest.proxy.beeceptor.com/client';
const invoiceUrl = 'https://whmcstest.proxy.beeceptor.com/invoices';

const getRexegDate = (date) => {
  result = date.match(
    '[0-9]{2}([-/ .])[0-9]{2}([-/ .])[0-9]{4}([-/ .])[0-9]{2}([-: .])[0-9]{2}'
  );
  return result != null ? result[0] : 'Could Not Find Last Login For User';
};

const logUserDetails = ({
  firstname,
  lastname,
  email,
  id,
  status,
  credit,
  lastlogin,
  currency_code,
}) => {
  console.log(
    `==================================================  
    ${firstname} ${lastname} (${email}) 
    ID: ${id} 
    Status: ${status} 
    Credit: ${currency_code} ${credit} 
    Last Login: ${getRexegDate(lastlogin)}`
  );
};

const logUserInvoices = (invoicesArr = []) => {
  console.log(`\n Orders \n # - InvoiceId - Status - Date - Due_Date - Total`);

  invoicesArr.forEach(
    ({ id, status, date, duedate, total, currencycode }, index) =>
      console.log(
        `${
          index + 1
        }. ${id} | ${status} | ${date} | ${duedate} | ${currencycode} ${total}`
      )
  );
};

(async function (email) {
  try {
    const userProfile = await fetch(`${userUrl}/${email}`).then((response) =>
      response.json()
    );
    const userInvoices = await fetch(
      `${invoiceUrl}/${userProfile.id}`
    ).then((response) => response.json());

    logUserDetails(userProfile);
    logUserInvoices(userInvoices.invoices.invoice);
  } catch (error) {
    console.error(`User with email: ${email} cannot be found`);
    console.log('See below for more details on the error:');
    console.error(error);
  }
})(email);
