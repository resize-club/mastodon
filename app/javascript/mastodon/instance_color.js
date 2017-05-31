import sha1 from 'sha1';

export function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export function getInstanceColor(titleText, url) {
  let parts = titleText.split('@');
  if (parts.length > 1)
    return sha1(parts[1]).substr(0, 6);

  parts = url.split('/@');
  if (parts.length > 1) {
    let instance_name = parts[0].split('://')[1];
    if (instance_name)
      return sha1(instance_name).substr(0, 6);
  }

  return 'ffffff'
}
