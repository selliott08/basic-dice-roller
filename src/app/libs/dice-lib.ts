export function ConvertString(input: string): string[] {
  const retValues: string[] = [];
  retValues.push(input);

  const regEx = /\d*d\d+/g;

  const valsToConvert = input.match(regEx);
  const convertedVals: string[] = [];

  valsToConvert?.forEach((el, i) => {
    convertedVals.push(convertRoll(el));
    input = input.replace(valsToConvert[i], convertedVals[i]);
  });

  retValues.push(input);

  retValues.push('' + customEval(input));
  return retValues;
}

export function convertRoll(input: string): string {
  const vals = input.split('d');
  if (vals[0] === '') {
    vals[0] = '1';
  }
  let output = '';

  for (let i = 0; i < customEval(vals[0]); i++) {
    if (output !== '') {
      output += ' + ';
    }
    output = output + getRandomInt(customEval(vals[1]));
  }

  return '' + output;
}

function customEval(v:any): any {
  return (0,eval)(v);
}

export function getRandomInt(max: number): number {
  return Math.ceil(Math.random() * max);
}
