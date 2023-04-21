import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ilikenest" is now active!');

	let disposable = vscode.commands.registerCommand('ilikenest.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from ilikenest!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
