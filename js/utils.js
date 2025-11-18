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

function getFontSizeSVGText(element) {
    if (!card) return null;
    let fontSize = null;
    /*
    // Check if the element is a child of a svg element
    if (!card.contains(element)) return null;
    // This fun. is only implemented for text svg elements
    if (element.tagName !== "text") return null;

    
    // Get the element font size within the style attribute inside the element
    fontSize = element.style.fontSize;

    // Otherwise retrive the font size from the element's classes
    // Card style
    const cardStyle = card.querySelector("defs style");
    console.log(cardStyle);

    const elementClasses = element.getAttribute("class").split(/ +/);
    console.log(elementClasses);
    elementClasses.forEach(classText => console.log(cardStyle.querySelector("." + classText)));
    */

    return fontSize;
}

function highlightElement(elements, classStr, pos) {
    // Remove the class from all elements
    for (const element of elements)
        element.classList.remove(classStr);
    // Add the class to the selected element
    const selectedElement = elements[pos];
    if (selectedElement)
        selectedElement.classList.add(classStr);
}