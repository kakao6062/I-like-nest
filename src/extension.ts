import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const ins = new ILikeNest();

	let setNest = vscode.commands.registerCommand('extention.setNest', () =>{
		ins.setNest();
	});
	
	let displayNest = vscode.commands.registerCommand('extention.displayNest', () =>{
		ins.displayNest();
	});

	context.subscriptions.push(ins);
	context.subscriptions.push(setNest);
	context.subscriptions.push(displayNest);
}

class ILikeNest {
	private _disposable: vscode.Disposable;
	private limit: string|undefined;

	constructor() {
		let subscriptions: vscode.Disposable[] = [];
		this._disposable = vscode.Disposable.from(...subscriptions);
	}

	public async setNest() {
		this.limit = await vscode.window.showInputBox({
			title: "Please set max nest size."
		});
		if (this.limit !== undefined) {
			vscode.window.showInformationMessage(`Max nest size : ${this.limit}`);
		}
	}

	public displayNest() {
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
	}
	dispose() {
		this._disposable.dispose();
	}
}

export function deactivate() {}
