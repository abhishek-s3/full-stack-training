const fs = require('fs');

console.log('Start reading a file...');

// Blocking code
// const result = fs.readFileSync('contacts.txt', 'utf8');
// console.log(result);

// Non-blocking code
fs.readFile('contacts.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});


console.log('Finish reading a file!');