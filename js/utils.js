/* Strings */

/* Get only the first number that appeared */
function extractNumber(str) {
    // RegExp iterator
    const matches = str.match(/[0-9]+|\.[0-9]/g);
    const [integer, decimal] = matches;
    const integerValue = Number(integer);
    const decimalValue = Number(decimal);
    // If the decimal part exists
    if (isNaN(decimalValue))
        return integerValue;
    return integerValue + decimalValue;
}

/* Check if the string is a valid SVG string */
function isSVG(svgString) {
    console.log(svgString.matchAll(/(<\?xml\b[^>]*>\s*)?<svg\b[^>]*>.*<\/svg>/g).next());
    //return svgString.match(/(<\?xml\b[^>]*>\s*)?<svg\b[^>]*>.*<\/svg>/g);
}

/* Elements */

function highlightElement(elements, classStr, pos) {
    // Remove the class from all elements
    for (const element of elements)
        element.classList.remove(classStr);
    // Add the class to the selected element
    const selectedElement = elements[pos];
    if (selectedElement)
        selectedElement.classList.add(classStr);
}

/* Inputs */
// input: html input obj, mode: text / url / arraybuffer
function readInputFile(input, mode) {
    return new Promise((res, rej) => {
        const [file] = input.files;
        if (!file) return rej("Error: Empty input");
        const fileReader = new FileReader();
        if (mode === "url")
            fileReader.readAsDataURL(file);
        else if (mode === "text")
            fileReader.readAsText(file);
        else if (mode === "arraybuffer")
            fileReader.readAsArrayBuffer(file);
        else
            rej("Read file error: Wrong read mode");
        fileReader.onloadend = (e) => {
            const result = e.currentTarget.result;
            res(Object.assign(file, {
                content: result
            }));
        }
    });
}

/* Cards & Models */

// Download the custom card in PNG format
async function downloadCardPNG(svgEl, moltiplicator, cardName) {
    // From SVG element create a Blob
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    console.log(svgXml);
    const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' } );
    const url = URL.createObjectURL(blob);
    console.log(url);
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * moltiplicator;
        canvas.height = img.height * moltiplicator;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff00'; // Fill with a trasparent color
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        // Create the link
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = (cardName || 'card') + '.png';
        // Click on the link
        a.click(); 
        // Remove the link
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

// Download the custom card in SVG
async function downloadCardSVG(svgEl, cardName) {
    // From SVG element create a Blob
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    console.log(svgXml);
    const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' } );
    const url = URL.createObjectURL(blob);
    console.log(url);
    const img = new Image();
    img.onload = () => {
        // Create the link
        const a = document.createElement('a');
        a.href = url;
        a.download = (cardName || 'card') + '.svg';
        // Click on the link
        a.click(); 
        // Remove the link
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

/* Local storage DBs */

async function createOpenDB(dbName, version, objsStores) {
    return new Promise((res, rej) => {
        let db;
        // Open the DB
        const request = window.indexedDB.open(dbName, version);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            rej(`Database error: ${event.target.error?.message}`);
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            res(db);
        };
        request.onupgradeneeded = (event) => {
            if (objsStores?.length === 0) return;

            const db = event.target.result;

            for (const objStore of objsStores) {
                const { name, fields } = objStore;
                db.createObjectStore(name, fields);
            }
        };
    });
}

function makeTransaction(db, objStoreName, cb) {
    const t = db.transaction(objStoreName, "readwrite");

    t.oncomplete = cb;
}