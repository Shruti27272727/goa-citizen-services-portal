const bcrypt = require("bcryptjs");

const hashed = "$2b$10$GheT4LjzP4xDmUX6v8stU.pQf5rFzoa09DQugy5m2U1WAkavdT32G";
const password = "Officer123!";

bcrypt.compare(password, hashed).then(console.log); 
