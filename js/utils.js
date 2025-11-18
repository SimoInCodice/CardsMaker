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
// input: html input obj, mode: text / url 
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
            res(result);
        }
    });
}

/* Cards & Models */

// Download the custom card
async function downloadCard(svgEl, moltiplicator) {
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
        a.download = (svgEl.value||'card') + '.png';
        // Click on the link
        a.click(); 
        // Remove the link
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

/* Local storage DBs */

function setDB(dbName, objs, nextId) {
    localStorage.setItem(dbName, JSON.stringify({
        nextId,
        objs
    }));
}

function getDB(dbName) {
    return JSON.parse(localStorage.getItem(dbName));
}

function getObjDB(dbName, id) {
    const db = getDB(dbName);
    const objs = db?.objs;
    if (!objs?.length) return null;
    return objs.find(o => o.id == id);
}

function insertObjDB(dbName, obj) {
    const db = getDB(dbName);
    // Add the id to the obj
    const objId = db?.nextId || 0;
    const nextId = objId + 1;
    const newObj = Object.assign({
        id: objId,
    }, obj);
    if (!db)
        setDB(dbName, [newObj], nextId);
    else
        setDB(dbName, [...(getDB(dbName).objs), newObj], nextId);
}

function deleteObjDB(dbName, id) {
    const db = getDB(dbName);
    const objs = db.objs;
    // Get the obj's pos
    const pos = objs.indexOf(objs.find(o => o.id === id));
    // Delete it
    objs.splice(pos, 1);
    // Save the modified array
    setDB(dbName, [...(getDB(dbName).objs)], db.nextId);
}