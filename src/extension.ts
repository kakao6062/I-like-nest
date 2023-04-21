import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ilikenest" is now active!');

	let disposable = vscode.commands.registerCommand('ilikenest.helloWorld', async() => {
		const limitNest = await vscode.window.showInputBox({
			title: "ネストの深さを設定してください．"
		});
		if (limitNest !== undefined) {
			vscode.window.showInformationMessage(`${limitNest}を受け付けました．`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
