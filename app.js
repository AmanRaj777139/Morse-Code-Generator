const express = require('express');

const bodyParser = require('body-parser');


const app = express();

const translations= [];
// Morse Code Map
const morseCodeMap = {
    'A': '.-',    'B': '-...',  'C': '-.-.', 'D': '-..',
    'E': '.',     'F': '..-.',  'G': '--.',  'H': '....',
    'I': '..',    'J': '.---',  'K': '-.-',  'L': '.-..',
    'M': '--',    'N': '-.',    'O': '---',  'P': '.--.',
    'Q': '--.-',  'R': '.-.',   'S': '...',  'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',  'X': '-..-',
    'Y': '-.--',  'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---','3': '...--',
    '4': '....-', '5': '.....', '6': '-....','7': '--...',
    '8': '---..', '9': '----.',
    ' ': '/'
};

const reverseMorseCodeMap = Object.entries(morseCodeMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

// Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//css 
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/translate', async (req, res) => {
    const { text } = req.body;
    const upperText = text.toUpperCase();
    let morse = '';

    for (let char of upperText) {
        if (morseCodeMap[char]) {
            morse += morseCodeMap[char] + ' ';
        } else {
            morse += '? ';
        }
    }

    morse = morse.trim();

    if (morse === '') {
        return res.send("Invalid input: No valid characters to translate.");
    }

    translations.push({text,morse})
    res.render('result', { text: text, morse: morse });
});

app.post('/decode', async (req, res) => {
    const { morse } = req.body;
    const morseWords = morse.trim().split(' / ');
    let decodedText = '';

    for (let word of morseWords) {
        const morseChars = word.split(' '); 
        for (let char of morseChars) {
            if (reverseMorseCodeMap[char]) {
                decodedText += reverseMorseCodeMap[char];
            } else {
                decodedText += '?'; 
            }
        }
        decodedText += ' '; // Add space between words
    }

    decodedText = decodedText.trim();

    if (decodedText === '') {
        return res.send("Invalid input: No valid Morse code to decode.");
    }
    translations.push({text: decodedText, morse});
    // Render the result
    res.render('decodeResult', { morse: morse, text: decodedText });
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
