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

	let setNest = vscode.commands.registerCommand("extention.setNest", () =>{
		ins.setNest();
	});

	context.subscriptions.push(ins);
	context.subscriptions.push(setNest);
}

class ILikeNest {
	private _disposable: vscode.Disposable;
	private limit: number = 0;

	constructor() {
		const subscriptions: vscode.Disposable[] = [];
		this._disposable = vscode.Disposable.from(...subscriptions);
	}

	public async setNest() {
		const lim_str = await vscode.window.showInputBox({
			title: "Please set max nest size."
		});

		if (!lim_str) return;

		this.limit = parseInt(lim_str);
		vscode.window.showInformationMessage(`Max nest size : ${this.limit}`);	
	}

	public displayNest(display: vscode.StatusBarItem) {
		const activeEditor = vscode.window.activeTextEditor;

		if (!activeEditor) return;

		const codeTexts = activeEditor.document.getText();
		const tabLength = activeEditor.options.tabSize as number;
		const cats = [
			'https://media.tenor.com/vR2nHwWXla0AAAAC/oh-no-cat-falling.gif',
			'https://media.tenor.com/Jat_4J29fygAAAAC/cat-stairs.gif',
			'https://media.tenor.com/r293RsMY9-AAAAAd/cat.gif'
		]

		let maxNestSize = 0;
		if (!codeTexts){
			display.hide();
			return;
		}


		for (const row of codeTexts.split("\n")) {
			let countNest = 0;
			for (const c of row) {
				if (!( c in [" ", "\t"])) break;
					countNest += (c === " ") ? 1: tabLength;
			}
					maxNestSize = Math.max(maxNestSize, countNest);
		}

		display.text = `Nest Size: ${maxNestSize}`;
		display.show();



		const getWebviewContent = (() =>
			`<!DOCTYPE html>
			<html lang="ja">
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
			<img src='${cats[Math.floor(Math.random() * cats.length)]}' />
			</body>
			</html>`
		);

		if(!this.limit) return;

		if(maxNestSize > this.limit) {
			const panel = vscode.window.createWebviewPanel(
				'Your Nest as Cat',
				'Cat is falling as your nest',
				vscode.ViewColumn.Two,
				{}
			);
			panel.webview.html = getWebviewContent();
		}
	}

	dispose() {
		this._disposable.dispose();
	}
}

export function deactivate() {}
