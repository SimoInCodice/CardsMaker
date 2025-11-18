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