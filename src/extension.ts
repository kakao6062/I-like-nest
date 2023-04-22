import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let limitNest: string|undefined;

	let setNest = vscode.commands.registerCommand('setNest', async() => {
		limitNest = await vscode.window.showInputBox({
			title: "Please set max nest size."
		});

		if (limitNest !== undefined) {
			vscode.window.showInformationMessage(`Max nest size : ${limitNest}`);
		}
	});
	context.subscriptions.push(setNest);
	
	let displayNest = vscode.commands.registerCommand('displayNest', () =>{
		const codeTexts = vscode.window.activeTextEditor?.document.getText();
		let countNest = 0;
		let output = 0;
		let flag = true;
		if (codeTexts !== undefined){
			for (let i = 0; i < codeTexts?.length; i++) {
				if (codeTexts.charAt(i) === " " && flag) {
					countNest += 1;
				}else if (codeTexts.charAt(i) === "\n") {
					flag = true;
					output = Math.max(output, countNest);
					countNest = 0;
				}else{
					flag = false;
				}
			}
		}

		vscode.window.showInformationMessage(`Now max nest size : ${output}`);
	});
	context.subscriptions.push(displayNest);

}

export function deactivate() {}
