export function getImageDimensions(image){
  let width = image.width;
  let height = image.height;

  return {
    width,
    height
  };
};

function scaleByWidth(image, target){
  if(image.width < target.width) return;

  let height = image.height;
  let width = image.width;
  let scale = target.width / width;

  height = height * scale;
  width = width * scale;

  return {
    height,
    width
  };
}

function scaleByHeight(image, target){
  if(image.height < target.height) return;

  let height = image.height;
  let width = image.width;
  let scale = target.height / height;

  height = height * scale;
  width = width * scale;

  return {
    height,
    width
  };
}

export function fitImage(image, target){
  let height = image.height;
  let width = image.width;

  if(height > target.height || width > target.width){
    if(height > width){
      return scaleByHeight(image, target);
    } else {
      return scaleByWidth(image, target);
    }
  }

  return {
    width,
    height
  };
};

export function cloneImage(imageSource, callback){
    let clone = new Image();
    let cloneCallback = e => {
        clone.removeEventListener('load', cloneCallback);
        if (callback) callback(clone);
    };
    clone.addEventListener('load', cloneCallback);
    clone.setAttribute('src', imageSource);
};