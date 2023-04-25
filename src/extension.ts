import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const ins = new ILikeNest();
	const display: vscode.StatusBarItem | undefined = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		0
	);

	vscode.workspace.onDidChangeTextDocument(() => {
		ins.displayNest(display);
	});

	let setNest = vscode.commands.registerCommand('extention.setNest', () =>{
		ins.setNest();
	});

	context.subscriptions.push(ins);
	context.subscriptions.push(setNest);
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

	public displayNest(display: vscode.StatusBarItem) {
		const activeEditor = vscode.window.activeTextEditor;
		const codeTexts = activeEditor?.document.getText();
		const tabLength = activeEditor?.options.tabSize as number;
		const cats = [
			'https://media.tenor.com/vR2nHwWXla0AAAAC/oh-no-cat-falling.gif',
			'https://media.tenor.com/Jat_4J29fygAAAAC/cat-stairs.gif',
			'https://media.tenor.com/r293RsMY9-AAAAAd/cat.gif'
		]

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

		function getWebviewContent(){
			return `<!DOCTYPE html>
			<html lang="ja">
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
			<img src='${cats[Math.floor(Math.random() * cats.length)]}' />
			</body>
			</html>`;
		}

		if(this.limit !== undefined){
			if(maxNestSize > parseInt(this.limit)) {

				const panel = vscode.window.createWebviewPanel(
					'Your Nest as Cat',
					'Cat is falling as your nest',
					vscode.ViewColumn.Two,
					{}
				);
				panel.webview.html = getWebviewContent();
			} 
		}
	}

	dispose() {
		this._disposable.dispose();
	}
}

export function deactivate() {}
