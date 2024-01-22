const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = 'list',
  Add = 'add',
  Remove = 'remove',
  Quit = 'quit',
}

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type InquirerAnswers = {
  action: Action;
};

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): string {
    return 'Content: ' + this.content;
  }

  public capitalize() {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
  }

  public toUpperCase() {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase() {
    this.content = this.content.toLowerCase();
  }

  public showColorized(variant: MessageVariant, text: string) {
    switch (variant) {
      case MessageVariant.Success:
        consola.success(text);
        break;
      case MessageVariant.Error:
        consola.error(text);
        break;
      case MessageVariant.Info:
        consola.info(text);
        break;
      default:
        console.log('Invalid variant');
    }
  }
}

interface User {
  name: string;
  age: number;
}

class UserData extends Message {
  data: User[] = [];

  public showAll() {
    this.showColorized(MessageVariant.Info, 'Users data');

    if (this.data.length > 0) {
      console.table(this.data);
    } else {
      console.log('No data...');
    }
  }

  public add(newUser: User) {
    if (typeof newUser.age === 'number' && newUser.age > 0 && typeof newUser.name === 'string' && newUser.name.length > 0) {
      this.data.push(newUser);
      this.showColorized(MessageVariant.Success, 'User has been successfully added!');
    } else {
      this.showColorized(MessageVariant.Error, 'Wrong data!');
    }
  }

  public remove(userName: string) {
    const userToRemove = this.data.find((user) => user.name === userName);

    if (userToRemove) {
      const indexToRemove = this.data.indexOf(userToRemove);
      this.data.splice(indexToRemove, 1);
      this.showColorized(MessageVariant.Success, 'User has been successfully removed!');
    } else {
      this.showColorized(MessageVariant.Error, 'User not found...');
    }
  }
}

const users = new UserData('Content');

console.log('\n');
console.info('???? Welcome to the UsersApp!');
console.log('====================================');
users.showColorized(MessageVariant.Info, 'Available actions');
console.log('\n');
console.log('list – show all users');
console.log('add – add new user to the list');
console.log('remove – remove user from the list');
console.log('quit – quit the app');
console.log('\n');

const startApp = () => {
  inquirer.prompt([
    {
      name: 'action',
      type: 'input',
      message: 'How can I help you?',
    },
  ]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([
          {
            name: 'name',
            type: 'input',
            message: 'Enter name',
          },
          {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          },
        ]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([
          {
            name: 'name',
            type: 'input',
            message: 'Enter name',
          },
        ]);
        users.remove(name.name);
        break;
      case Action.Quit:
        users.showColorized(MessageVariant.Info, 'Bye bye!');
        return;
    }

    startApp();
  });
}

startApp();
