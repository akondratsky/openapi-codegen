import { exec } from 'child_process';
import path from 'path';

const here = (name, ...args) => path.join(
  path.resolve(), '__tests__', name, ...args
);

export const consoleOutput = (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
};


const generateCommand = `node --inspect cg \
--verbose \
--flat \
--perApi \
--perPath \
--output ${here('codegen_generated')} \
typescript-axios ${here('api.yaml')}
`;


const command = generateCommand;


console.log(command);

exec(command, consoleOutput);
