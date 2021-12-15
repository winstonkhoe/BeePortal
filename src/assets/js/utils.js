
export function getMultipleSelectValues(select) {
    let result = [];
    let options = select && select.options;
    let opt;
  
    for (let i=0; i<options.length; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }