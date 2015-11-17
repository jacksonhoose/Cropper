export default class AbstractCanvas {
    constructor(){}
    // Set the image for cropping.
    setImage(){}
    // Get the current selection left, top, width height.
    getSelection(){}
    // Move the selection.
    setSelection(){}
    // Clear the selection.
    clear(){}
    // Rotate a selection.
    rotateSelection(){}
    // Set selection to fixed ratio.
    setSelectionRatio(){}
    // Crop at current selection.
    crop(){}
    // Get crop as data URL.
    toDataURL(){}
    // Get crop as Blob.
    toBlob(){}
}