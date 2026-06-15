const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to match FormLabel components
  const formLabelRegex = /(<FormLabel[^>]*)>([^<]*)<\/FormLabel>/g;
  
  content = content.replace(formLabelRegex, (match, openTag, textContent) => {
    // If text ends with ' *', it is required.
    if (textContent.trim().endsWith('*')) {
      const newText = textContent.replace(/\s*\*\s*$/, '');
      if (!openTag.includes('required')) {
        return `${openTag} required>${newText}</FormLabel>`;
      } else {
        return `${openTag}>${newText}</FormLabel>`;
      }
    }
    
    // For login/signup and other places where it might not have *, but is required
    // (We look for "Email", "Password", "First Name", "Card Number", etc. if they are known required)
    // But wait, it's safer to only add `required` if it had `*` or if we explicitly know it.
    // Let's add explicit checks for common required fields that might be missing *
    const t = textContent.trim();
    const implicitlyRequired = [
      'Email Address', 'Password', 'First Name', 'Address', 'City', 'State', 'Zip Code', 'Country', 'Card Number', 'Cardholder Name', 'Expiry Date', 'CVV', 'Email', 'Your name', 'Subject', 'Message', 'Topic'
    ];
    
    // If it says (Optional), it's not required
    if (t.toLowerCase().includes('optional')) {
      return match;
    }

    // If it's one of the known implicitly required fields and not already marked required
    if (implicitlyRequired.includes(t) && !openTag.includes('required')) {
       return `${openTag} required>${textContent}</FormLabel>`;
    }
    
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walk('./app', processFile);
walk('./components', processFile);
console.log('Done.');
