import inquirer from "inquirer";

export async function confirm(
  msg: string,
  defaultValue = false
): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: msg,
      default: defaultValue,
    },
  ]);
  return confirmed;
}

export async function input(msg: string, defaultValue = ""): Promise<string> {
  const { value } = await inquirer.prompt([
    {
      type: "input",
      name: "value",
      message: msg,
      default: defaultValue,
    },
  ]);
  return value;
}

export async function select(msg: string, choices: string[]): Promise<string> {
  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: msg,
      choices: choices,
    },
  ]);
  return selected;
}

export async function multiSelect(
  msg: string,
  choices: string[]
): Promise<string[]> {
  const { selected } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selected",
      message: msg,
      choices: choices,
    },
  ]);
  return selected;
}
