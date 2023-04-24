import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const ins = new ILikeNest();

	let setNest = vscode.commands.registerCommand('extention.setNest', () =>{
		ins.setNest();
	});
	
	let displayNest = vscode.commands.registerCommand('extention.displayNest', () =>{
		ins.displayNest(context);
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

	public displayNest(context: vscode.ExtensionContext) {
		const activeEditor = vscode.window.activeTextEditor;
		const codeTexts = activeEditor?.document.getText();
		const tabLength = activeEditor?.options.tabSize as number;
		const display:vscode.StatusBarItem | undefined = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			0
		);

		let countNest = 0;
		let flag = true;
		let maxNestSize = 0;
		if (codeTexts !== undefined){
			for (let i = 0; i < codeTexts?.length; i++) {
				if ((codeTexts.charAt(i) === " " || codeTexts.charAt(i) === "\t") && flag) {
					if (codeTexts.charAt(i) === " ") {
						countNest += 1;
					}
					else {
						countNest += tabLength
					}
				}else if (codeTexts.charAt(i) === "\n") {
					flag = true;
					maxNestSize = Math.max(maxNestSize, countNest);
					countNest = 0;
				}else{
					flag = false;
				}
			}
			display.text = `Nest Size: ${maxNestSize}`;
			display.show();
		}else {
			display.hide();
		}
	}

	dispose() {
		this._disposable.dispose();
	}
}

export function deactivate() {}
