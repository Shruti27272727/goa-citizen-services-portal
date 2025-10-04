const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'admin123'; // your desired admin password
  const saltRounds = 10;

  const hashed = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password:', hashed);
}

hashPassword();
