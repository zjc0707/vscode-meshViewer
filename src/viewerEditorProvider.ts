import * as vscode from 'vscode';
import { disposeAll } from './dispose';
import { getWebViewContent } from './extension';
import { ViewerDocument, ViewerEdit } from './viewerDocument';

export class ViewerEditorProvider implements vscode.CustomEditorProvider<ViewerDocument> {

    private static newPawDrawFileId = 1;

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            ViewerEditorProvider.viewType,
            new ViewerEditorProvider(context),
            {
                // For this demo extension, we enable `retainContextWhenHidden` which keeps the 
                // webview alive even when it is not visible. You should avoid using this setting
                // unless is absolutely required as it does have memory overhead.
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            });
    }

    private static readonly viewType = 'jcWebView';

    private readonly webviews = new WebviewCollection();

    constructor(
        private readonly _context: vscode.ExtensionContext
    ) { }

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<ViewerDocument>>();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;
    saveCustomDocument(document: ViewerDocument, cancellation: vscode.CancellationToken): Thenable<void> {
        // throw new Error('Method not implemented.');
        return document.save(cancellation);
    }
    saveCustomDocumentAs(document: ViewerDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {
        // throw new Error('Method not implemented.');
        return document.saveAs(destination, cancellation);
    }
    revertCustomDocument(document: ViewerDocument, cancellation: vscode.CancellationToken): Thenable<void> {
        // throw new Error('Method not implemented.');
        return document.revert(cancellation);
    }
    backupCustomDocument(document: ViewerDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        // throw new Error('Method not implemented.');
        return document.backup(context.destination, cancellation);
    }
    async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<ViewerDocument> {
        const document: ViewerDocument = await ViewerDocument.create(uri, openContext.backupId, {
            getFileData: async () => {
                const webviewsForDocument = Array.from(this.webviews.get(document.uri));
                if (!webviewsForDocument.length) {
                    throw new Error('not find webview');
                }
                const panel = webviewsForDocument[0];
                const response = await this.postMessageWithResponse<number[]>(panel, 'getFileData', {});
                return new Uint8Array(response);
            }
        });

        const listeners: vscode.Disposable[] = [];

        listeners.push(document.onDidChange(e => {
            this._onDidChangeCustomDocument.fire({
                document,
                ...e
            });
        }));

        document.onDidDispose(() => disposeAll(listeners));

        return document;
    }
    async resolveCustomEditor(document: ViewerDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
        // throw new Error('Method not implemented.');
        console.log('add', document.uri);
        this.webviews.add(document.uri, webviewPanel);

        webviewPanel.webview.options = {
            enableScripts: true
        };
        webviewPanel.webview.html = getWebViewContent(this._context);

        webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e));

        webviewPanel.webview.onDidReceiveMessage(e => {
            if (e.type === 'ready') {
				if (document.uri.scheme === 'untitled') {
					this.postMessage(webviewPanel, 'init', {
						untitled: true,
						editable: true,
					});
				} else {
					const editable = vscode.workspace.fs.isWritableFileSystem(document.uri.scheme);

					this.postMessage(webviewPanel, 'init', {
						value: document.documentData,
						editable,
					});
				}
			}
        });
    }

    private _requestId = 1;
    private readonly _callbacks = new Map<number, (response: any) => void>();

    private postMessageWithResponse<R = unknown>(panel: vscode.WebviewPanel, type: string, body: any): Promise<R> {
        const requestId = this._requestId++;
        const p = new Promise<R>(resolve => this._callbacks.set(requestId, resolve));
        panel.webview.postMessage({ type, requestId, body });
        return p;
    }

    private postMessage(panel: vscode.WebviewPanel, type: string, body: any): void {
		panel.webview.postMessage({ type, body });
	}

	private onMessage(document: ViewerDocument, message: any) {
		switch (message.type) {
			case 'stroke':
				document.makeEdit(message as ViewerEdit);
				return;

			case 'response':
				{
					const callback = this._callbacks.get(message.requestId);
					callback?.(message.body);
					return;
				}
		}
	}
}

/**
 * Tracks all webviews.
 */
class WebviewCollection {

    private readonly _webviews = new Set<{
        readonly resource: string;
        readonly webviewPanel: vscode.WebviewPanel;
    }>();

    /**
     * Get all known webviews for a given uri.
     */
    public *get(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
        const key = uri.toString();
        for (const entry of this._webviews) {
            if (entry.resource === key) {
                yield entry.webviewPanel;
            }
        }
    }

    /**
     * Add a new webview to the collection.
     */
    public add(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel) {
        const entry = { resource: uri.toString(), webviewPanel };
        this._webviews.add(entry);

        webviewPanel.onDidDispose(() => {
            this._webviews.delete(entry);
        });
    }
}