import { execSync } from 'child_process'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const formatter = vscode.languages.registerDocumentFormattingEditProvider(
    'kotlin',
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        const text = document.getText()

        try {
          const formatted = execSync('ktlint --stdin -F', {
            input: text,
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
          })

          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
          )

          return [vscode.TextEdit.replace(fullRange, formatted)]
        } catch (error) {
          if (error instanceof Error) {
            vscode.window.showErrorMessage(`ktlint error: ${error.message}`)
          }
          return []
        }
      },
    }
  )

  context.subscriptions.push(formatter)
}

export function deactivate() {}
